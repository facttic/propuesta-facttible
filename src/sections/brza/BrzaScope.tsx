import type { BrzaContent } from '../../types'
import Icon from '../../components/Icon'

export default function BrzaScope({ c }: { c: NonNullable<BrzaContent['scope']> }) {
  return (
    <section id="scope" className="px-6 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs font-medium tracking-widest text-text-secondary">{c.badge}</span>
      </div>
      <h2 className="mt-8 text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      <p className="mt-6 text-lg md:text-xl text-text-secondary leading-relaxed max-w-4xl">{c.subtitle}</p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        {c.items.map((item, index) => (
          <div key={index} className="p-7 rounded-2xl bg-surface border border-border flex gap-4">
            <div className="w-11 h-11 rounded-xl bg-accent-glow flex items-center justify-center shrink-0">
              <Icon name={item.icon} className="text-accent" size={22} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-3 text-sm md:text-base text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {c.footer && (
        <div className="mt-12 p-7 rounded-2xl bg-surface-elevated border border-border-accent text-text-secondary leading-relaxed">
          {c.footer}
        </div>
      )}
    </section>
  )
}
