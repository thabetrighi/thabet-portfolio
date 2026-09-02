interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

export async function verifyTurnstileToken(
  secret: string,
  token: string,
  remoteIp?: string,
): Promise<boolean> {
  const body: Record<string, string> = {
    secret,
    response: token,
  };

  if (remoteIp && remoteIp !== 'unknown') {
    body.remoteip = remoteIp;
  }

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const verifyData = (await verifyRes.json()) as TurnstileVerifyResponse;
  return verifyData.success === true;
}
