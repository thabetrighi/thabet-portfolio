export interface GitHubFile {
  path: string;
  sha: string;
  content: string;
}

export interface GitHubCommitResult {
  commitSha: string;
  contentSha: string;
  path: string;
}

export interface GitHubRepoStatus {
  connected: boolean;
  owner: string;
  repo: string;
  branch: string;
  defaultBranch: string;
}

export interface GitHubWorkflowRun {
  id: number;
  status: string;
  conclusion: string | null;
  htmlUrl: string;
  createdAt: string;
}

export interface AdminSession {
  id: string;
  createdAt: number;
  expiresAt: number;
}

export interface ArticleFrontmatter {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  cover?: string;
  translationOf?: string;
  draft?: boolean;
}

export interface ProjectFrontmatter {
  title: string;
  excerpt: string;
  problem: string;
  solution: string;
  role: string;
  result: string;
  technologies: string[];
  cover: string;
  order: number;
  featured?: boolean;
  github?: string;
  demo?: string;
  translationOf?: string;
  draft?: boolean;
}

export interface MarkdownDocument<T> {
  slug: string;
  locale: string;
  frontmatter: T;
  body: string;
  sha?: string;
}

export interface SiteConfig {
  name: string;
  fullName: { ar: string; en: string; fr: string };
  logo: string;
  email: string;
  url: string;
}

export interface SocialConfig {
  links: { platform: string; url: string }[];
}

export interface ProfileConfig {
  experience: unknown[];
  skills: unknown[];
  about: { summary: string; extended: string };
  resume: unknown;
}

export interface DeployStatus {
  triggered: boolean;
  workflowRunId?: number;
  message: string;
}
