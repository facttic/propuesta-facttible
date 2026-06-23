import { useEffect, useState } from 'react'

type Props = {
  sectionIds: { id: string; label: string }[]
}

export default function SectionNav({ sectionIds }: Props) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    function update() {
      const line = window.innerHeight * 0.35
      let best = 0
      let bestDist = Infinity
      sectionIds.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        // distance from the reference line to the section's top (only if section has started)
        if (rect.top <= line) {
          const dist = line - rect.top
          if (dist < bestDist) {
            bestDist = dist
            best = i
          }
        }
      })
      setActive(best)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sectionIds])

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3">
      {sectionIds.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="group relative flex items-center justify-end"
          aria-label={s.label}
        >
          <span className="absolute right-6 whitespace-nowrap text-xs font-mono text-text-muted opacity-0 group-hover:opacity-100 transition">
            {s.label}
          </span>
          <span
            className={`block w-2 h-2 rounded-full transition-all ${
              active === i
                ? 'bg-accent scale-150 shadow-[0_0_12px_rgba(255,82,41,0.8)]'
                : 'bg-text-muted/40 group-hover:bg-accent/60'
            }`}
          />
        </a>
      ))}
    </nav>
  )
}
