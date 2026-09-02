export function readPageConfig<T extends Record<string, unknown>>(): T {
  const el = document.getElementById('adm-page-config');
  if (!el?.textContent) return {} as T;
  return JSON.parse(el.textContent) as T;
}
