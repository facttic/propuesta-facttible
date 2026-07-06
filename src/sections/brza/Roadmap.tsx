import { Fragment } from 'react'
import type { BrzaContent } from '../../types'
import Icon from '../../components/Icon'
import Reveal from '../../components/Reveal'

type Props = {
  c: NonNullable<BrzaContent['roadmap']>
  inv?: BrzaContent['investment']
}

// "Simple · alto valor" → { main: "Simple", sub: "alto valor" }
function splitAxis(s?: string) {
  const parts = (s ?? '').split('·')
  return { main: (parts[0] ?? '').trim(), sub: parts.slice(1).join('·').trim() }
}

const EFFORT = { baja: { level: 1, word: 'Baja' }, media: { level: 2, word: 'Media' }, alta: { level: 3, word: 'Alta' } }
const VALUE = { medio: { level: 2, word: 'Medio' }, alto: { level: 3, word: 'Alto' } }

// medidor explícito: etiqueta + 3 puntos + palabra (para leer complejidad/valor de un vistazo)
function Meter({ label, level, word, tone }: { label: string; level: number; word: string; tone: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">{label}</span>
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < level ? tone : 'bg-border'}`} />
        ))}
      </span>
      <span className="font-mono text-[10px] font-bold text-text-secondary">{word}</span>
    </div>
  )
}

// Documento entregable del Discovery: página con esquemas (mini flujo) y definiciones,
// con un sparkle de "valor". Flat, con la paleta de marca; sparkle con glow y twinkle.
function DiscoveryDeliverableArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" aria-hidden>
      {/* sombra suave del documento */}
      <rect x="26" y="22" width="76" height="100" rx="6" fill="#000" opacity="0.05" />
      {/* documento */}
      <rect x="22" y="16" width="76" height="100" rx="6" fill="#ffffff" stroke="#e2ddd6" strokeWidth="1.5" />
      {/* barra de título (acento) + subtítulo */}
      <rect x="32" y="27" width="34" height="5" rx="2.5" fill="#ff5229" />
      <rect x="32" y="37" width="24" height="3" rx="1.5" fill="#cfc9c1" />
      {/* mini flujo de esquemas: dos cajas que confluyen en una tercera */}
      <g stroke="#57c3c8" strokeWidth="1.6">
        <rect x="31" y="50" width="17" height="12" rx="2.5" fill="#57c3c8" fillOpacity="0.12" />
        <rect x="72" y="50" width="17" height="12" rx="2.5" fill="#57c3c8" fillOpacity="0.12" />
        <rect x="51.5" y="70" width="17" height="12" rx="2.5" fill="#57c3c8" fillOpacity="0.12" />
        <path d="M39.5 62 V66 Q39.5 70 44 70 H51.5" fill="none" strokeLinecap="round" />
        <path d="M80.5 62 V66 Q80.5 70 76 70 H68.5" fill="none" strokeLinecap="round" />
      </g>
      {/* nodos */}
      <g fill="#57c3c8">
        <circle cx="39.5" cy="56" r="1.7" />
        <circle cx="80.5" cy="56" r="1.7" />
        <circle cx="60" cy="76" r="1.7" />
      </g>
      {/* definiciones (líneas de texto), la primera en acento */}
      <g fill="#cfc9c1">
        <rect x="32" y="92" width="56" height="3" rx="1.5" />
        <rect x="32" y="99" width="48" height="3" rx="1.5" />
        <rect x="32" y="106" width="52" height="3" rx="1.5" />
      </g>
      <rect x="32" y="92" width="16" height="3" rx="1.5" fill="#57c3c8" />
      {/* sparkle de valor (con glow y twinkle) */}
      <g className="value-sparkle" style={{ color: '#ff5229' }}>
        <path d="M96 17 C98 24.5 100.5 27 108 29 C100.5 31 98 33.5 96 41 C94 33.5 91.5 31 84 29 C91.5 27 94 24.5 96 17 Z" fill="currentColor" />
        <path d="M108 41 C109 44.5 110 45.5 113.5 46.5 C110 47.5 109 48.5 108 52 C107 48.5 106 47.5 102.5 46.5 C106 45.5 107 44.5 108 41 Z" fill="currentColor" opacity="0.85" />
      </g>
    </svg>
  )
}

export default function Roadmap({ c, inv }: Props) {
  const firstLaterIndex = c.phases.findIndex((p) => p.status !== 'priced')
  return (
    <section id="roadmap" className="px-6 md:px-8 py-20 md:py-32 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs font-medium tracking-widest text-text-secondary">{c.badge}</span>
      </div>
      <h2 className="mt-8 text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      <p className="mt-6 text-lg text-text-secondary leading-relaxed">{c.subtitle}</p>

      {/* eje simple → complejo */}
      {(c.axisFrom || c.axisTo) && (
        <div className="mt-12 flex items-center gap-4 md:gap-6">
          <div className="text-left leading-tight shrink-0">
            <div className="font-mono text-sm md:text-base font-bold tracking-widest uppercase text-secondary">
              {splitAxis(c.axisFrom).main}
            </div>
            {splitAxis(c.axisFrom).sub && (
              <div className="font-mono text-[10px] tracking-wider uppercase text-text-muted">
                {splitAxis(c.axisFrom).sub}
              </div>
            )}
          </div>
          <div className="relative flex-1 h-2 rounded-full bg-gradient-to-r from-secondary/70 via-secondary/25 to-accent/80">
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-secondary/20" />
            <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-l-[13px] border-l-accent" />
          </div>
          <div className="text-right leading-tight shrink-0">
            <div className="font-mono text-sm md:text-base font-bold tracking-widest uppercase text-accent">
              {splitAxis(c.axisTo).main}
            </div>
            {splitAxis(c.axisTo).sub && (
              <div className="font-mono text-[10px] tracking-wider uppercase text-text-muted">
                {splitAxis(c.axisTo).sub}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {c.phases.map((p, i) => {
          const priced = p.status === 'priced'
          return (
            <Fragment key={p.label}>
              {i === firstLaterIndex && (
                <div className="pt-8">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold tracking-widest uppercase text-text-secondary whitespace-nowrap">
                      Posibles fases siguientes
                    </span>
                    <span className="flex-1 h-px bg-border" />
                  </div>
                  <p className="mt-2 text-sm text-text-muted leading-relaxed">
                    División tentativa del trabajo futuro. Su alcance, plazos y costo se definen concretamente al finalizar el Discovery.
                  </p>
                </div>
              )}
              <Reveal>
              <div
                data-pdf-atomic
                className={`relative rounded-2xl border p-6 md:p-7 ${
                  priced ? 'border-border-accent bg-accent-glow' : 'border-border bg-surface'
                }`}
              >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <span className="shrink-0 font-mono text-sm font-bold text-accent/80 tabular-nums pt-1">
                    {String(i).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-[11px] font-bold tracking-widest text-accent">{p.label}</div>
                    <h3 className="mt-1 text-xl md:text-2xl font-bold text-text-primary">{p.name}</h3>
                  </div>
                </div>
                <div className="shrink-0 md:text-right">
                  {p.duration && (
                    <div className="font-mono text-[11px] tracking-wider uppercase text-text-muted">{p.duration}</div>
                  )}
                  {priced ? (
                    <div className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-border-accent px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase text-accent">
                      Detalle de inversión abajo
                    </div>
                  ) : (
                    <div className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase text-text-muted">
                      A estimar tras el Discovery
                    </div>
                  )}
                </div>
              </div>

              {(p.effort || p.value) && (
                <div className="mt-4 md:pl-8 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                  {p.effort && (
                    <Meter label="Complejidad" level={EFFORT[p.effort].level} word={EFFORT[p.effort].word} tone="bg-text-muted" />
                  )}
                  {p.value && (
                    <Meter label="Valor" level={VALUE[p.value].level} word={VALUE[p.value].word} tone="bg-accent" />
                  )}
                </div>
              )}

              {p.focus && (
                <p className="mt-4 md:pl-8 text-sm md:text-base text-text-secondary leading-relaxed">{p.focus}</p>
              )}

              <div className="mt-5 flex flex-wrap gap-2 md:pl-8">
                {p.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] ${
                      priced
                        ? 'border border-border-accent bg-surface text-text-secondary'
                        : 'border border-border bg-surface-elevated text-text-secondary'
                    }`}
                  >
                    <span className="text-accent/70" aria-hidden>+</span>
                    {cap}
                  </span>
                ))}
              </div>
              </div>
              </Reveal>
            </Fragment>
          )
        })}
      </div>

      {c.note && (
        <Reveal>
          <div data-pdf-atomic className="mt-8 rounded-2xl border border-border bg-surface p-5 md:p-6">
            <p className="text-sm md:text-base text-text-secondary leading-relaxed">{c.note}</p>
          </div>
        </Reveal>
      )}

      {/* ── detalle de inversión de las fases presupuestadas ── */}
      {inv && (
        <Reveal>
        <div className="mt-16 pt-12 border-t border-border">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-accent bg-accent-glow">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="font-mono text-xs font-medium tracking-widest text-accent">{inv.badge}</span>
          </div>
          <h3 className="mt-6 text-2xl md:text-4xl font-bold text-text-primary">{inv.title}</h3>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">{inv.subtitle}</p>

          {inv.deliverable && (
            <div data-pdf-atomic className="mt-8 rounded-2xl border border-border-accent bg-accent-glow p-6 md:p-8">
              <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-accent">
                {inv.deliverable.badge}
              </div>
              <h4 className="mt-2 text-xl md:text-2xl font-bold text-text-primary">{inv.deliverable.title}</h4>
              <p className="mt-3 text-text-secondary leading-relaxed">{inv.deliverable.lead}</p>
              <ul className="mt-5 space-y-3">
                {inv.deliverable.items.map((it) => (
                  <li key={it} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-md bg-accent text-bg shrink-0 mt-0.5" aria-hidden>
                      <Icon name="check" size={13} />
                    </span>
                    <span className="text-sm md:text-base text-text-secondary leading-relaxed">{it}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-border-accent/40 pt-4 text-sm md:text-base text-text-primary leading-relaxed">
                {inv.deliverable.note}
              </p>
              <div className="mt-6 flex justify-center">
                <DiscoveryDeliverableArt className="w-36 md:w-44" />
              </div>
            </div>
          )}

          <div className="mt-10 space-y-5">
            {inv.phases.map((phase) => (
              <div key={phase.label} data-pdf-atomic className="rounded-2xl border border-border bg-surface overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-border">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-text-primary">{phase.label}</h4>
                    <div className="font-mono text-[11px] tracking-wider uppercase text-text-muted">{phase.duration}</div>
                  </div>
                  <div className="font-mono text-sm text-text-secondary tabular-nums shrink-0">{phase.subtotalHours} hs</div>
                </div>
                <div className="divide-y divide-border">
                  {phase.rows.map((r) => (
                    <div key={r.role} className="flex items-start justify-between gap-4 px-5 md:px-6 py-3.5">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0 mt-2" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm md:text-base font-medium text-text-primary">{r.role}</span>
                            <span className="font-mono text-[11px] tracking-wider uppercase text-text-muted">
                              {r.dedication}
                            </span>
                          </div>
                          {r.desc && (
                            <p className="mt-1 text-[13px] text-text-secondary leading-relaxed">{r.desc}</p>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-sm text-text-secondary tabular-nums shrink-0 mt-0.5">{r.hours} hs</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* total */}
          <div data-pdf-atomic className="mt-6 rounded-2xl border border-border-accent bg-accent-glow px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="font-mono text-[11px] font-bold tracking-widest text-accent">INVERSIÓN — DISCOVERY</div>
              <div className="mt-1 text-sm text-text-secondary">Precio cerrado; el resto se estima al finalizar el Discovery.</div>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-text-primary font-display">{inv.total}</div>
          </div>

          <div className="mt-8 space-y-3">
            {inv.notes.map((n, i) => (
              <div key={i} className="flex items-start gap-3">
                <Icon name={n.icon} size={18} className="text-accent shrink-0 mt-0.5" />
                <p className="text-sm md:text-base text-text-secondary leading-relaxed">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      )}
    </section>
  )
}
