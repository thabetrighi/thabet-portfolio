import { env } from 'cloudflare:workers';
import type { GitHubCommitResult, GitHubFile, GitHubRepoStatus, GitHubWorkflowRun } from '../types';
import { DEPLOY_WORKFLOW_FILE } from '../config';

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

interface GitHubContentResponse {
  sha: string;
  content: string;
  encoding: string;
}

interface GitHubDirectoryItem {
  name: string;
  path: string;
  sha: string;
  type: 'file' | 'dir';
}

export class GitHubError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'GitHubError';
    this.status = status;
  }
}

export function getGitHubConfig(): GitHubConfig | null {
  const token = env.GITHUB_TOKEN;
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch };
}

export function isGitHubConfigured(): boolean {
  return getGitHubConfig() !== null;
}

const GITHUB_USER_AGENT = 'thabetrighi-admin/1.0 (+https://thabetrighi.com)';

async function githubFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getGitHubConfig();
  if (!config) throw new GitHubError('GitHub is not configured', 503);

  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': GITHUB_USER_AGENT,
      ...init.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new GitHubError(text || response.statusText, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function decodeContent(content: string): string {
  return new TextDecoder().decode(
    Uint8Array.from(atob(content.replace(/\n/g, '')), (c) => c.charCodeAt(0)),
  );
}

function encodeContent(content: string): string {
  return btoa(unescape(encodeURIComponent(content)));
}

export async function getRepoStatus(): Promise<GitHubRepoStatus> {
  const config = getGitHubConfig();
  if (!config) {
    return { connected: false, owner: '', repo: '', branch: 'main', defaultBranch: 'main' };
  }

  const repo = await githubFetch<{ default_branch: string }>(
    `/repos/${config.owner}/${config.repo}`,
  );

  return {
    connected: true,
    owner: config.owner,
    repo: config.repo,
    branch: config.branch,
    defaultBranch: repo.default_branch,
  };
}

export async function getFile(path: string): Promise<GitHubFile | null> {
  const config = getGitHubConfig();
  if (!config) throw new GitHubError('GitHub is not configured', 503);

  try {
    const data = await githubFetch<GitHubContentResponse>(
      `/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`,
    );
    return {
      path,
      sha: data.sha,
      content: decodeContent(data.content),
    };
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) return null;
    throw error;
  }
}

export async function listDirectory(path: string): Promise<GitHubDirectoryItem[]> {
  const config = getGitHubConfig();
  if (!config) throw new GitHubError('GitHub is not configured', 503);

  try {
    const items = await githubFetch<GitHubDirectoryItem[]>(
      `/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`,
    );
    return Array.isArray(items) ? items.filter((item) => item.type === 'file') : [];
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) return [];
    throw error;
  }
}

function isGitHubContentSha(sha?: string): sha is string {
  return Boolean(sha && !sha.startsWith('local:'));
}

export async function upsertFile(
  path: string,
  content: string,
  message: string,
  existingSha?: string,
): Promise<GitHubCommitResult> {
  const config = getGitHubConfig();
  if (!config) throw new GitHubError('GitHub is not configured', 503);

  let sha = isGitHubContentSha(existingSha) ? existingSha : undefined;
  if (!sha) {
    const existing = await getFile(path);
    if (existing) sha = existing.sha;
  }

  const body: Record<string, string> = {
    message,
    content: encodeContent(content),
    branch: config.branch,
  };
  if (sha) body.sha = sha;

  const result = await githubFetch<{ commit: { sha: string }; content: { sha: string } }>(
    `/repos/${config.owner}/${config.repo}/contents/${path}`,
    { method: 'PUT', body: JSON.stringify(body) },
  );

  return { commitSha: result.commit.sha, contentSha: result.content.sha, path };
}

export async function deleteFile(
  path: string,
  sha: string,
  message: string,
): Promise<GitHubCommitResult> {
  const config = getGitHubConfig();
  if (!config) throw new GitHubError('GitHub is not configured', 503);

  const result = await githubFetch<{ commit: { sha: string } }>(
    `/repos/${config.owner}/${config.repo}/contents/${path}`,
    {
      method: 'DELETE',
      body: JSON.stringify({ message, sha, branch: config.branch }),
    },
  );

  return { commitSha: result.commit.sha, contentSha: sha, path };
}

export async function triggerDeploy(): Promise<{ triggered: boolean; message: string }> {
  const config = getGitHubConfig();
  if (!config) throw new GitHubError('GitHub is not configured', 503);

  try {
    await githubFetch(
      `/repos/${config.owner}/${config.repo}/actions/workflows/${encodeURIComponent(DEPLOY_WORKFLOW_FILE)}/dispatches`,
      {
        method: 'POST',
        body: JSON.stringify({ ref: config.branch }),
      },
    );
    return { triggered: true, message: 'Deploy workflow triggered successfully' };
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) {
      return {
        triggered: false,
        message: 'Deploy workflow not found. Push .github/workflows/deploy.yml first.',
      };
    }
    throw error;
  }
}

export async function getLatestDeployRun(): Promise<GitHubWorkflowRun | null> {
  const config = getGitHubConfig();
  if (!config) return null;

  try {
    const data = await githubFetch<{
      workflow_runs: {
        id: number;
        status: string;
        conclusion: string | null;
        html_url: string;
        created_at: string;
      }[];
    }>(
      `/repos/${config.owner}/${config.repo}/actions/workflows/${encodeURIComponent(DEPLOY_WORKFLOW_FILE)}/runs?per_page=1`,
    );

    const run = data.workflow_runs[0];
    if (!run) return null;

    return {
      id: run.id,
      status: run.status,
      conclusion: run.conclusion,
      htmlUrl: run.html_url,
      createdAt: run.created_at,
    };
  } catch {
    return null;
  }
}
