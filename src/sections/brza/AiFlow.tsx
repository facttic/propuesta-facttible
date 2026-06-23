import type { BrzaContent } from '../../types'
import Icon from '../../components/Icon'

type Props = { c: NonNullable<BrzaContent['aiFlow']> }

export default function AiFlow({ c }: Props) {
  return (
    <section id="ai" className="px-6 md:px-8 py-20 md:py-32 max-w-6xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-accent bg-accent-glow">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs font-medium tracking-widest text-accent">{c.badge}</span>
      </div>
      <h2 className="mt-8 text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      <p className="mt-6 max-w-3xl text-lg text-text-secondary leading-relaxed">{c.subtitle}</p>

      {/* cabecera de carriles (solo desktop) */}
      <div className="mt-14 hidden md:grid grid-cols-[1fr_auto_1fr] gap-4 items-center px-1">
        <div className="font-mono text-[11px] font-bold tracking-widest uppercase text-text-muted">Hoy</div>
        <div className="w-10" />
        <div className="font-mono text-[11px] font-bold tracking-widest uppercase text-accent">Con IA</div>
      </div>

      <div className="mt-4 space-y-5">
        {c.lanes.map((lane, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {lane.icon && <Icon name={lane.icon} size={15} className="text-accent" />}
              <span className="font-mono text-[11px] tracking-widest uppercase text-text-secondary">{lane.phase}</span>
              {lane.warning && (
                <span className="inline-flex items-center gap-1 rounded-md border border-border-accent bg-accent-glow px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase text-accent">
                  <Icon name="info" size={11} /> Riesgo de multas
                </span>
              )}
              {lane.origin === 'facttic' && (
                <span className="inline-flex items-center gap-1 rounded-md border border-secondary/40 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase text-secondary">
                  ✦ Idea FACTTIC
                </span>
              )}
              <span className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
              {/* HOY */}
              <div className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-base font-bold text-text-primary">{lane.hoy.title}</h3>
                <ul className="mt-3 space-y-1.5">
                  {lane.hoy.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                      <span className="text-text-muted shrink-0" aria-hidden>·</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                {lane.hoy.metric && (
                  <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-text-muted">
                    <Icon name="clock" size={13} />
                    {lane.hoy.metric}
                  </div>
                )}
              </div>

              {/* flecha */}
              <div className="hidden md:flex items-center justify-center text-accent" aria-hidden>
                <Icon name="arrow-right" size={22} />
              </div>
              <div className="flex md:hidden justify-center text-accent" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 20 20"><path d="M10 3 L10 15 M5 11 L10 16 L15 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>

              {/* CON IA */}
              <div className="rounded-2xl border border-border-accent bg-accent-glow p-5 flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/15 border border-border-accent px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-accent">
                    <Icon name="brain" size={12} /> IA
                  </span>
                  <h3 className="text-base font-bold text-text-primary">{lane.ia.agent}</h3>
                </div>
                <p className="mt-2.5 text-sm text-text-secondary leading-relaxed">{lane.ia.automatiza}</p>

                <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                  <Icon name="users" size={15} className="text-secondary shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-secondary">Humano valida</span>
                    <div className="text-text-secondary">{lane.ia.human}</div>
                  </div>
                </div>

                <div className="mt-auto pt-3 flex items-start gap-2 text-sm text-text-primary">
                  <Icon name="zap" size={15} className="text-accent shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{lane.ia.mejora}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {c.note && (
        <div className="mt-10 rounded-2xl border border-border bg-surface p-5 md:p-6">
          <div className="flex items-start gap-3">
            <Icon name="shield-check" size={20} className="text-secondary shrink-0 mt-0.5" />
            <p className="text-sm md:text-base text-text-secondary leading-relaxed">{c.note}</p>
          </div>
        </div>
      )}
    </section>
  )
}
