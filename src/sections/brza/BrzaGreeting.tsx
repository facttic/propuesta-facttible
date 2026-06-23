import type { BrzaContent } from '../../types'

export default function BrzaGreeting({ c }: { c: BrzaContent['greeting'] }) {
  return (
    <section id="greeting" className="px-6 md:px-8 py-20 md:py-32 max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      <div className="mt-8 space-y-5">
        {c.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-lg md:text-2xl text-text-secondary leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="mt-12 p-6 md:p-7 rounded-2xl border border-border-accent bg-accent-glow">
        <div className="font-mono text-xs tracking-widest text-accent">{c.calloutLabel}</div>
        <p className="mt-3 text-base md:text-lg text-text-primary leading-relaxed">{c.calloutText}</p>
      </div>
    </section>
  )
}
