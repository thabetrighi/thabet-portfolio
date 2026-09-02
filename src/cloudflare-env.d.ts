/// <reference types="@astrojs/cloudflare/types.d.ts" />

interface EmailSendResult {
  messageId: string;
}

interface EmailAddress {
  email: string;
  name?: string;
}

interface EmailMessageBuilder {
  to: string | EmailAddress | (string | EmailAddress)[];
  from: string | EmailAddress;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | EmailAddress;
}

interface SendEmail {
  send(message: EmailMessageBuilder): Promise<EmailSendResult>;
}

interface Env {
  EMAIL: SendEmail;
  CONTACT_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}
