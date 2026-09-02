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

export async function parseLoginBody(request: Request): Promise<{
  email: string;
  password: string;
  'cf-turnstile-response'?: string;
  redirect?: string;
}> {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return request.json();
  }

  const form = await request.formData();
  return {
    email: String(form.get('email') || ''),
    password: String(form.get('password') || ''),
    'cf-turnstile-response': String(form.get('cf-turnstile-response') || '') || undefined,
    redirect: String(form.get('redirect') || '') || undefined,
  };
}

export function adminRedirect(
  location: string,
  status = 302,
  headers: Record<string, string> = {},
): Response {
  return new Response(null, {
    status,
    headers: {
      Location: location,
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}
