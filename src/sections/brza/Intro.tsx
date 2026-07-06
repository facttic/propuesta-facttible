import type { BrzaContent } from '../../types'
import Logo from '../../components/Logo'

type Props = { c: NonNullable<BrzaContent['intro']> }

export default function Intro({ c }: Props) {
  return (
    <section id="intro" className="px-6 md:px-8 py-20 md:py-32 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs font-medium tracking-widest text-text-secondary">{c.badge}</span>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Logo className="text-3xl md:text-4xl text-text-primary" />
      </div>

      <h2 className="mt-6 text-3xl md:text-5xl font-bold text-text-primary leading-tight">{c.title}</h2>
      <p className="mt-6 text-lg md:text-xl text-text-secondary leading-relaxed">{c.subtitle}</p>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {c.stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface px-5 py-6">
            <div className="text-3xl md:text-4xl font-bold text-accent font-display leading-none">{s.value}</div>
            <div className="mt-2 font-mono text-[11px] tracking-wider uppercase text-text-muted leading-tight">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {c.points && c.points.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.points.map((p) => (
            <div key={p} className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3">
              <span className="text-accent shrink-0 mt-0.5" aria-hidden>▪</span>
              <span className="text-sm md:text-base text-text-secondary leading-relaxed">{p}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
