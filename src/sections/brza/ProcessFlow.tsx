import type { BrzaContent } from '../../types'

type Props = { c: NonNullable<BrzaContent['processFlow']> }

function Connector() {
  return (
    <div className="flex justify-center" aria-hidden>
      <svg width="20" height="34" viewBox="0 0 20 34" className="text-border-accent">
        <line x1="10" y1="0" x2="10" y2="26" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
        <path d="M4 24 L10 32 L16 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function ProcessFlow({ c }: Props) {
  return (
    <section id="process" className="px-6 md:px-8 py-20 md:py-32 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs font-medium tracking-widest text-text-secondary">{c.badge}</span>
      </div>
      <h2 className="mt-8 text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      <p className="mt-6 max-w-3xl text-lg text-text-secondary leading-relaxed">{c.subtitle}</p>

      <div className="mt-14 space-y-2">
        {c.phases.map((phase, pi) => (
          <div key={phase.id}>
            {/* etiqueta de fase */}
            <div className="flex items-center gap-3 mb-4 mt-2">
              <span className="font-mono text-[11px] font-bold tracking-widest text-accent">{phase.label}</span>
              <span className="font-mono text-[11px] tracking-widest uppercase text-text-muted">{phase.name}</span>
              <span className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-2">
              {phase.steps.map((step, si) => (
                <div key={step.n}>
                  <div className="group rounded-2xl border border-border bg-surface hover:border-border-accent transition p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      <span className="shrink-0 font-mono text-sm font-bold text-accent/80 tabular-nums pt-0.5">
                        {step.n}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-text-primary leading-snug">
                          {step.title}
                        </h3>
                        <div className="mt-2 flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-accent shrink-0" aria-hidden>→</span>
                          <span className="leading-relaxed">{step.output}</span>
                        </div>
                        {step.docs && step.docs.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {step.docs.map((doc) => (
                              <span
                                key={doc}
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-2.5 py-1 font-mono text-[11px] text-text-secondary"
                              >
                                <span className="text-accent/70" aria-hidden>▪</span>
                                {doc}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* conector entre pasos (salvo el último paso de la última fase) */}
                  {!(pi === c.phases.length - 1 && si === phase.steps.length - 1) && <Connector />}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* nodo de convergencia: la oferta */}
        <div className="pt-2">
          <div className="rounded-2xl border border-border-accent bg-accent-glow p-6 md:p-8">
            <div className="font-mono text-[11px] font-bold tracking-widest text-accent">{c.converge.label}</div>
            <h3 className="mt-2 text-2xl md:text-3xl font-bold text-text-primary">{c.converge.title}</h3>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {c.converge.stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-surface px-4 py-3">
                  <div className="text-xl md:text-2xl font-bold text-text-primary font-display">{s.value}</div>
                  <div className="mt-1 font-mono text-[11px] tracking-wider uppercase text-text-muted leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
