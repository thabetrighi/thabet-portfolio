export function adminJson(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

export function adminError(error: string, status: number): Response {
  return adminJson({ error }, status);
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  return request.json() as Promise<T>;
}
