#!/usr/bin/env node
/**
 * Generate ADMIN_PASSWORD_HASH for wrangler secret.
 * Usage: node scripts/generate-admin-hash.mjs "your-password"
 */
import { webcrypto } from 'node:crypto';

const password = process.argv[2];
const salt = 'thabet-portfolio-admin-v1';

if (!password) {
  console.error('Usage: node scripts/generate-admin-hash.mjs "your-password"');
  process.exit(1);
}

const encoder = new TextEncoder();
const keyMaterial = await webcrypto.subtle.importKey(
  'raw',
  encoder.encode(password),
  'PBKDF2',
  false,
  ['deriveBits'],
);
const bits = await webcrypto.subtle.deriveBits(
  {
    name: 'PBKDF2',
    salt: encoder.encode(salt),
    iterations: 100_000,
    hash: 'SHA-256',
  },
  keyMaterial,
  256,
);
const hash = Buffer.from(bits).toString('base64');
console.log('ADMIN_PASSWORD_HASH=' + hash);
console.log('\nSet with: npx wrangler secret put ADMIN_PASSWORD_HASH');
