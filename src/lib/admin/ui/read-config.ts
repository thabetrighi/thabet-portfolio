export function readPageConfig<T extends Record<string, unknown>>(): T {
  const el = document.getElementById('adm-page-config');
  if (!el) return {} as T;

  const raw = el.textContent?.trim();
  if (!raw) return {} as T;

  try {
    return JSON.parse(raw) as T;
  } catch {
    console.error('Failed to parse admin page config');
    return {} as T;
  }
}
