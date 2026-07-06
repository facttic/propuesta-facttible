export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* fondo carbón plano, como facttic.org.ar */}
      <div className="absolute inset-0 bg-bg" />

      {/* textura de grilla de puntos muy sutil (apenas perceptible) */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(var(--c-bg-dot) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* viñeta sutil en el mismo fondo (sin color) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, transparent 55%, var(--c-bg-vignette) 100%)',
        }}
      />
    </div>
  )
}
