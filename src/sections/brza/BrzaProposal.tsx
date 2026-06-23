import type { BrzaContent } from '../../types'

type Props = {
  c: NonNullable<BrzaContent['proposal']>
  pricing: NonNullable<BrzaContent['pricing']>
}

const BAR_STYLES = [
  {
    fill: 'linear-gradient(90deg, rgba(87,195,200,0.30) 0%, rgba(87,195,200,0.18) 100%)',
    border: 'rgba(87,195,200,0.40)',
    dot: '#57c3c8',
  },
  {
    fill: 'linear-gradient(90deg, rgba(255,82,41,0.35) 0%, rgba(255,82,41,0.22) 100%)',
    border: 'rgba(255,82,41,0.45)',
    dot: '#ff5229',
  },
]


export default function BrzaProposal({ c, pricing }: Props) {
  const totalAmount = parseCurrency(pricing.total)
  const items = pricing.breakdown.map((item, index) => {
    const percentage = parsePercentage(item.value)
    const style = BAR_STYLES[index] ?? BAR_STYLES[0]
    return {
      ...item,
      percentage,
      amount: Math.round((totalAmount * percentage) / 100),
      style,
    }
  })

  return (
    <section id="proposal" className="px-6 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs font-medium tracking-widest text-text-secondary">{c.badge}</span>
      </div>
      <h2 className="mt-8 text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      <p className="mt-6 text-lg md:text-xl text-text-secondary leading-relaxed max-w-4xl">{c.subtitle}</p>

      <div className="mt-14 p-8 md:p-10 rounded-2xl bg-surface border border-border-accent">
        <div className="font-mono text-[11px] tracking-widest text-accent">DISTRIBUCIÓN DEL ESFUERZO INICIAL</div>
        <div className="mt-8 space-y-5">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border bg-surface-elevated"
              style={{ borderColor: item.style.border }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-2xl"
                style={{
                  width: `${item.percentage}%`,
                  background: item.style.fill,
                }}
              />
              <div className="relative p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.style.dot }} />
                  <span className="font-mono text-[11px] tracking-widest text-text-muted">{item.label}</span>
                </div>
                <div className="flex flex-col md:items-end gap-1 shrink-0">
                  <span className={`text-xl md:text-2xl font-bold ${item.accent ? 'text-accent' : 'text-text-primary'}`}>
                    {item.value}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {item.accent ? `${formatArs(item.amount)} + IVA` : formatArs(item.amount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-base text-text-secondary leading-relaxed max-w-4xl">
          En este esquema, las cooperativas absorben el desarrollo inicial del sistema y BRZA aporta luego una parte del estimado original a través del funcionamiento del próximo evento, una vez que la herramienta ya esté operativa.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        {c.cards.map((card, index) => (
          <div key={index} className="p-7 rounded-2xl bg-surface border border-border">
            <div className="font-mono text-[11px] tracking-widest text-accent">0{index + 1}</div>
            <h3 className="mt-3 text-xl font-semibold text-text-primary">{card.title}</h3>
            <p className="mt-3 text-sm md:text-base text-text-secondary leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-2xl bg-accent-glow border border-border-accent">
        <p className="text-base md:text-lg text-text-primary leading-relaxed">{c.closing}</p>
      </div>
    </section>
  )
}

function parsePercentage(value: string) {
  const match = value.match(/\d+(?:[.,]\d+)?/)
  if (!match) return 0
  return Number.parseFloat(match[0].replace(',', '.'))
}

function parseCurrency(value: string) {
  const digits = value.replace(/[^\d]/g, '')
  return Number.parseInt(digits, 10) || 0
}

function formatArs(value: number) {
  const rounded = Math.round(value / 1000000) * 1000000
  return `$${rounded.toLocaleString('es-AR')} ARS`
}

