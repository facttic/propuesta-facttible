import { Fragment } from 'react'
import type { BrzaContent } from '../../types'

// Resalta en negrita los tramos marcados con **...** en el texto.
function withBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-bold text-text-primary">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

export default function BrzaGreeting({ c }: { c: BrzaContent['greeting'] }) {
  return (
    <section id="greeting" className="px-6 md:px-8 py-20 md:py-32 max-w-5xl mx-auto">
      {c.badge && (
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-mono text-xs font-medium tracking-widest text-text-secondary">{c.badge}</span>
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      <div className="mt-8 space-y-5">
        {c.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-lg md:text-2xl text-text-secondary leading-relaxed">
            {withBold(paragraph)}
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
