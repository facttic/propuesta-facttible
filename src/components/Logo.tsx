type Props = {
  className?: string
}

/**
 * Wordmark FACT[TIC]: tipografía de marca (Space Grotesk) con los corchetes en
 * el naranja de FACTTIC. Texto puro: escala nítida y se exporta bien a PDF.
 */
export default function Logo({ className = '' }: Props) {
  return (
    <span className={`font-display font-bold tracking-tight leading-none ${className}`}>
      FACT<span className="text-accent">[</span>TIC<span className="text-accent">]</span>
    </span>
  )
}
