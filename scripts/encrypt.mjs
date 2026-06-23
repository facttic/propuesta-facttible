#!/usr/bin/env node
// Encrypt content.<slug>.json -> public/content.<slug>.enc.json
// Usage: PASSWORD="passphrase" npm run encrypt -- <slug>
//   e.g. PASSWORD="..." npm run encrypt -- gls
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { webcrypto as crypto } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const ITERATIONS = 600_000

function getSlug() {
  const slug = process.argv[2]
  if (!slug) {
    console.error('Usage: npm run encrypt -- <slug>   (e.g. gls)')
    process.exit(1)
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error('Slug must match /^[a-z0-9-]+$/ (lowercase letters, digits, dashes)')
    process.exit(1)
  }
  return slug
}

async function getPassword() {
  if (process.env.PASSWORD) return process.env.PASSWORD
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const pw = await rl.question('Password: ')
  rl.close()
  return pw
}

async function deriveKey(password, salt) {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

const toB64 = (bytes) => Buffer.from(bytes).toString('base64')

async function main() {
  const slug = getSlug()
  const src = resolve(ROOT, `content.${slug}.json`)
  const outDir = resolve(ROOT, 'public')
  const out = resolve(outDir, `content.${slug}.enc.json`)

  if (!existsSync(src)) {
    console.error(`Missing ${src}. Create it first (plaintext JSON, gitignored).`)
    process.exit(1)
  }
  const password = await getPassword()
  if (!password || password.length < 8) {
    console.error('Password must be at least 8 chars.')
    process.exit(1)
  }
  const plaintext = readFileSync(src, 'utf8')
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext)),
  )
  const payload = {
    v: 1,
    kdf: 'PBKDF2-SHA256',
    iter: ITERATIONS,
    salt: toB64(salt),
    iv: toB64(iv),
    ct: toB64(ct),
  }
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  writeFileSync(out, JSON.stringify(payload))
  console.log(`Encrypted ${plaintext.length} bytes → ${out}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
