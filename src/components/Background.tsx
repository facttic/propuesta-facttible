export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-bg" />

      {/* ambient orange glow baked into a gradient (no blur filter) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,82,41,0.16) 0%, rgba(255,111,74,0.05) 35%, transparent 70%)',
        }}
      />
      {/* secondary teal glow, offset for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 80%, rgba(87,195,200,0.10) 0%, transparent 60%)',
        }}
      />

      {/* single large glass pane — pure gradients + borders, no blur filter */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96vw] h-[96vh] rounded-[32px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,82,41,0.06) 0%, rgba(255,82,41,0.012) 45%, rgba(87,195,200,0.05) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 80px rgba(255,82,41,0.04)',
        }}
      >
        {/* diagonal shine streak */}
        <div
          className="absolute inset-0 rounded-[32px]"
          style={{
            background:
              'linear-gradient(120deg, transparent 35%, rgba(255,111,74,0.08) 50%, transparent 65%)',
          }}
        />
        {/* top edge highlight */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(12,12,12,0.7) 100%)',
        }}
      />
    </div>
  )
}
