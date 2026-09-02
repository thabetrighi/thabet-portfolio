export const EMAIL_FROM = 'contact@thabetrighi.com';
export const EMAIL_TO = 'righithabt@gmail.com';

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildContactEmailBody(name: string, email: string, message: string) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br>');

  return {
    text: `New message from ${name} (${email})\n\n${message}`,
    html: `
      <h2>New contact form message</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `.trim(),
  };
}
