export type EncryptedPayload = {
  v: number
  kdf: string
  iter: number
  salt: string
  iv: string
  ct: string
}

function fromB64(s: string): ArrayBuffer {
  const bin = atob(s)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out.buffer as ArrayBuffer
}

async function deriveKey(password: string, salt: ArrayBuffer, iter: number): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
}

export async function decryptContent(payload: EncryptedPayload, password: string): Promise<unknown> {
  const salt = fromB64(payload.salt)
  const iv = fromB64(payload.iv)
  const ct = fromB64(payload.ct)
  const key = await deriveKey(password, salt, payload.iter)
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
  const text = new TextDecoder().decode(plain)
  return JSON.parse(text)
}
