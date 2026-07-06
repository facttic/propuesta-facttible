import type { BrzaContent } from '../../types'
import ScrollHint from '../../components/ScrollHint'
import Logo from '../../components/Logo'

export default function BrzaCover({ c }: { c: BrzaContent['cover'] }) {
  return (
    <section
      id="cover"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 py-20 md:py-32 text-center"
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-accent bg-accent-glow mb-10">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-[11px] font-semibold tracking-widest text-accent">
          {c.eyebrow}
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-text-primary leading-[1.05] max-w-5xl">
        {c.title}
      </h1>

      <p className="mt-8 max-w-3xl text-lg md:text-2xl text-text-secondary leading-relaxed">
        {c.subtitle}
      </p>

      <div className="mt-10 flex flex-col items-center gap-2 text-text-secondary">
        <Logo className="text-2xl md:text-3xl text-text-primary" />
      </div>

      <div className="mt-12 flex items-center gap-4 text-[11px] font-mono tracking-widest uppercase text-text-muted">
        <span>{c.date}</span>
        <span className="w-1 h-1 rounded-full bg-text-muted" />
        <span>{c.version}</span>
      </div>

      <ScrollHint />
    </section>
  )
}
