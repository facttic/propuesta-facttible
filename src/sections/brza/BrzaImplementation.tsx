import type { BrzaContent } from '../../types'

export default function BrzaImplementation({ c }: { c: NonNullable<BrzaContent['implementation']> }) {
  return (
    <section id="implementation" className="px-6 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs font-medium tracking-widest text-text-secondary">{c.badge}</span>
      </div>
      <h2 className="mt-8 text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      <p className="mt-6 text-lg md:text-xl text-text-secondary leading-relaxed max-w-4xl">{c.subtitle}</p>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 items-start">
        <div className="space-y-5">
          {c.phases.map((phase, index) => (
            <div key={index} className="p-7 rounded-2xl bg-surface border border-border">
              <div className="font-mono text-[11px] tracking-widest text-accent">{phase.label}</div>
              <h3 className="mt-3 text-xl font-semibold text-text-primary">{phase.title}</h3>
              <p className="mt-3 text-sm md:text-base text-text-secondary leading-relaxed">{phase.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-2xl bg-accent-glow border border-border-accent sticky top-8">
          <div className="font-mono text-[11px] tracking-widest text-accent">{c.estimate.label}</div>
          <div className="mt-4 text-4xl md:text-5xl font-bold text-text-primary leading-none">{c.estimate.value}</div>
          <p className="mt-4 text-sm md:text-base text-text-secondary leading-relaxed">{c.estimate.desc}</p>
        </div>
      </div>
    </section>
  )
}
