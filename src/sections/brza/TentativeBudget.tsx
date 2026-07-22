import type { BrzaContent } from '../../types'

type Props = {
  c: NonNullable<BrzaContent['tentativeBudget']>
}

function formatUsd(value: number) {
  return `USD ${value.toLocaleString('es-AR')}`
}

function range(min: string | number, max: string | number) {
  return min === max ? `${min}` : `${min}–${max}`
}

export default function TentativeBudget({ c }: Props) {
  return (
    <section id="tentative-budget" className="px-6 md:px-8 py-20 md:py-32 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs font-medium tracking-widest text-text-secondary">{c.badge}</span>
      </div>
      <h2 className="mt-8 text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      {c.subtitle && (
        <p className="mt-6 text-lg text-text-secondary leading-relaxed">{c.subtitle}</p>
      )}

      <div data-pdf-atomic className="mt-10 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[380px] text-sm md:text-base">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="px-5 md:px-6 py-4 text-left font-mono text-[11px] tracking-widest uppercase text-text-muted">
                Fase
              </th>
              <th className="px-4 py-4 text-right font-mono text-[11px] tracking-widest uppercase text-text-muted">
                Semanas
              </th>
              <th className="px-5 md:px-6 py-4 text-right font-mono text-[11px] tracking-widest uppercase text-text-muted">
                Costo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {c.rows.map((r) => (
              <tr key={r.phase}>
                <td className="px-5 md:px-6 py-3.5 font-medium text-text-primary whitespace-nowrap">{r.phase}</td>
                <td className="px-4 py-3.5 text-right font-mono tabular-nums text-text-secondary whitespace-nowrap">
                  {range(r.weeksMin, r.weeksMax)}
                </td>
                <td className="px-5 md:px-6 py-3.5 text-right font-mono tabular-nums text-text-primary whitespace-nowrap">
                  {range(formatUsd(r.costMin), formatUsd(r.costMax))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border-accent bg-accent-glow">
              <td className="px-5 md:px-6 py-4 font-mono text-[11px] font-bold tracking-widest text-accent whitespace-nowrap">
                TOTAL
              </td>
              <td className="px-4 py-4 text-right font-mono font-bold tabular-nums text-text-primary whitespace-nowrap">
                {range(c.total.weeksMin, c.total.weeksMax)}
                <span className="block font-mono text-[10px] font-normal tracking-wide text-text-secondary normal-case">
                  {c.total.monthsLabel}
                </span>
              </td>
              <td className="px-5 md:px-6 py-4 text-right font-mono font-bold tabular-nums text-text-primary whitespace-nowrap">
                {range(formatUsd(c.total.costMin), formatUsd(c.total.costMax))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {c.notes && c.notes.length > 0 && (
        <ol className="mt-6 space-y-2.5">
          {c.notes.map((n, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5 font-mono text-[11px] font-bold text-accent tabular-nums">
                {i + 1}.
              </span>
              <span className="text-sm md:text-base text-text-secondary leading-relaxed">{n}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
