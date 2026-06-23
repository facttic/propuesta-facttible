import { useState, useEffect, FormEvent } from 'react'
import { decryptContent, EncryptedPayload } from '../lib/crypto'
import type { ProposalContent } from '../types'
import Logo from './Logo'

type Props = {
  onUnlock: (content: ProposalContent) => void
}

type Status = 'checking' | 'ready' | 'missing' | 'no-slug'
type Locale = 'es' | 'en'

const COPY: Record<Locale, Record<string, string>> = {
  es: {
    loading: 'CARGANDO…',
    missingBadge: 'PROPUESTA NO DISPONIBLE',
    missingTitle: 'Lo sentimos: esta propuesta no existe o ya no está disponible.',
    missingBody: 'Si querés que armemos un presupuesto para tu organización, escribinos a FACTTIC.',
    encryptedBadge: 'CIFRADO DE PUNTA A PUNTA',
    title: 'Ingresá la contraseña para ver la propuesta',
    body: 'Esta propuesta contiene información compartida bajo confidencialidad, por eso todo el contenido se almacena cifrado (AES-256-GCM). Nada puede leerse sin la contraseña: ni en el navegador, ni en el servidor, ni en el repositorio público.',
    footnote: 'La contraseña fue compartida por un canal aparte. El descifrado ocurre localmente en tu navegador; nada se envía a ningún servidor.',
    placeholder: 'Contraseña',
    wrongPassword: 'Contraseña incorrecta',
    unlocking: 'Desbloqueando…',
    unlock: 'Desbloquear',
  },
  en: {
    loading: 'LOADING…',
    missingBadge: 'PROPOSAL NOT FOUND',
    missingTitle: "Sorry — this proposal doesn't exist or has expired.",
    missingBody: "If you'd like us to put together a quote for you, get in touch with FACTTIC.",
    encryptedBadge: 'END-TO-END ENCRYPTED',
    title: 'Enter the passphrase to view the proposal',
    body: 'This proposal contains information shared under NDA, so all content is stored encrypted (AES-256-GCM). Nothing is readable without the passphrase: not in the browser, not on the server, and not in the public repository.',
    footnote: 'The passphrase was shared with you out-of-band. Decryption happens locally in your browser; nothing is sent to any server.',
    placeholder: 'Passphrase',
    wrongPassword: 'Wrong password',
    unlocking: 'Unlocking…',
    unlock: 'Unlock',
  },
}

function getSlug(): string | null {
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('for')
  if (!slug) return null
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  return slug
}

function detectLocale(): Locale {
  const language = navigator.language.toLowerCase()
  return language.startsWith('es') ? 'es' : 'en'
}

export default function PasswordGate({ onUnlock }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<Status>('checking')
  const slug = getSlug()
  const copy = COPY[detectLocale()]

  useEffect(() => {
    if (!slug) {
      setStatus('no-slug')
      return
    }
    fetch(`${import.meta.env.BASE_URL}content.${slug}.enc.json`, { method: 'HEAD' })
      .then((res) => setStatus(res.ok ? 'ready' : 'missing'))
      .catch(() => setStatus('missing'))
  }, [slug])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}content.${slug}.enc.json`)
      if (!res.ok) throw new Error('Content not found')
      const payload = (await res.json()) as EncryptedPayload
      const content = (await decryptContent(payload, password)) as ProposalContent
      document.title = content.meta.title
      onUnlock(content)
    } catch {
      setError(copy.wrongPassword)
      setLoading(false)
    }
  }

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-6">
        <div className="text-text-muted text-sm font-mono tracking-widest">{copy.loading}</div>
      </div>
    )
  }

  if (status === 'missing' || status === 'no-slug') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-6">
        <div className="w-full max-w-md text-center space-y-6">
          <Logo className="text-4xl text-text-primary block" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-text-muted text-xs font-mono tracking-widest">
            <span className="w-2 h-2 rounded-full bg-text-muted" />
            {copy.missingBadge}
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-text-primary">{copy.missingTitle}</h1>
            <p className="text-text-secondary text-sm leading-relaxed">{copy.missingBody}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="mailto:info@facttic.org.ar"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-bg font-semibold hover:opacity-90 transition"
            >
              info@facttic.org.ar
            </a>
            <a
              href="https://facttic.org.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border text-text-primary hover:border-accent transition"
            >
              facttic.org.ar
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-6">
          <Logo className="text-4xl text-text-primary block" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-accent bg-accent-glow text-accent text-xs font-mono tracking-widest">
            <span className="w-2 h-2 rounded-full bg-accent" />
            {copy.encryptedBadge}
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-text-primary">{copy.title}</h1>
            <p className="text-text-secondary text-sm leading-relaxed">{copy.body}</p>
            <p className="text-text-muted text-xs leading-relaxed">{copy.footnote}</p>
          </div>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          placeholder={copy.placeholder}
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition"
        />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-3 rounded-xl bg-accent text-bg font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? copy.unlocking : copy.unlock}
        </button>
      </form>
    </div>
  )
}
