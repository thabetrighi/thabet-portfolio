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

interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface SendEmail {
  send(message: EmailMessageBuilder): Promise<EmailSendResult>;
}

interface Env {
  EMAIL: SendEmail;
  CONTACT_RATE_LIMITER: RateLimit;
  ADMIN_RATE_LIMITER: RateLimit;
  ADMIN_LOGIN_RATE_LIMITER: RateLimit;
  SESSION: KVNamespace;
  CONTACT_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
  PUBLIC_TURNSTILE_SITE_KEY?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_PASSWORD_HASH?: string;
  GITHUB_TOKEN?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
}
