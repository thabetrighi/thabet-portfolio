/** Minimal YAML frontmatter parser/serializer for admin markdown editing */

function parseScalar(value: string): string | number | boolean {
  const trimmed = value.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseYamlBlock(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yaml.split('\n');
  let currentKey: string | null = null;
  let currentArray: string[] | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    const arrayMatch = line.match(/^(\w+):\s*$/);
    if (arrayMatch) {
      currentKey = arrayMatch[1]!;
      currentArray = [];
      result[currentKey] = currentArray;
      continue;
    }

    const arrayItemMatch = line.match(/^\s+-\s+(.+)$/);
    if (arrayItemMatch && currentArray) {
      currentArray.push(String(parseScalar(arrayItemMatch[1]!)));
      continue;
    }

    const kvMatch = line.match(/^(\w+):\s*(.+)$/);
    if (kvMatch) {
      currentKey = kvMatch[1]!;
      currentArray = null;
      result[currentKey] = parseScalar(kvMatch[2]!);
    }
  }

  return result;
}

export function parseMarkdown<T extends Record<string, unknown>>(
  raw: string,
): { frontmatter: T; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {} as T, body: raw.trim() };
  }
  return {
    frontmatter: parseYamlBlock(match[1]!) as T,
    body: match[2]!.trim(),
  };
}

function serializeValue(value: unknown, indent = ''): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return `${indent}[]`;
    return value.map((item) => `${indent}  - ${formatScalar(item)}`).join('\n');
  }
  return formatScalar(value);
}

function formatScalar(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  const str = String(value);
  if (/[:#\n]/.test(str) || str.includes('"')) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

export function stringifyMarkdown(
  frontmatter: Record<string, unknown>,
  body: string,
): string {
  const lines: string[] = ['---'];

  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${formatScalar(item)}`);
      }
    } else {
      lines.push(`${key}: ${formatScalar(value)}`);
    }
  }

  lines.push('---', '', body.trim(), '');
  return lines.join('\n');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
