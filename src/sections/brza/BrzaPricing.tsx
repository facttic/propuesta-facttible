import type { BrzaContent } from '../../types'
import Icon from '../../components/Icon'

export default function BrzaPricing({ c }: { c: NonNullable<BrzaContent['pricing']> }) {
  return (
    <section id="pricing" className="px-6 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs font-medium tracking-widest text-text-secondary">{c.badge}</span>
      </div>
      <h2 className="mt-8 text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      <p className="mt-6 text-lg md:text-xl text-text-secondary leading-relaxed max-w-4xl">{c.subtitle}</p>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 lg:gap-8">
        <div className="p-8 md:p-10 rounded-2xl bg-accent-glow border border-border-accent">
          <div className="font-mono text-[11px] tracking-widest text-accent">INVERSIÓN TOTAL</div>
          <div className="mt-4 text-5xl md:text-6xl font-bold text-text-primary leading-[0.95]">{c.total}</div>
          <div className="mt-4 text-base text-text-secondary leading-relaxed">{c.totalLabel}</div>
        </div>

        <div className="p-8 rounded-2xl bg-surface border border-border flex flex-col justify-center">
          <div className="font-mono text-[11px] tracking-widest text-accent">QUÉ CONTEMPLA ESTE COSTO</div>
          <div className="mt-6 space-y-5">
            {c.notes.map((note, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                  <Icon name={note.icon} className="text-text-muted" size={16} />
                </div>
                <p className="text-base text-text-secondary leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
