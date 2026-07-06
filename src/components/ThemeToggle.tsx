import { useEffect, useState } from 'react'

// Botón flotante para alternar tema claro/oscuro.
// El tema se aplica con la clase .light en <html>; la elección se guarda en localStorage.
// El script inline en index.html fija el tema inicial (sin parpadeo).
export default function ThemeToggle() {
  const [light, setLight] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('light'),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
    try {
      localStorage.setItem('theme', light ? 'light' : 'dark')
    } catch {
      /* localStorage puede no estar disponible */
    }
  }, [light])

  return (
    <button
      type="button"
      onClick={() => setLight((v) => !v)}
      aria-label={light ? 'Activar tema oscuro' : 'Activar tema claro'}
      title={light ? 'Tema oscuro' : 'Tema claro'}
      className="pdf-ignore fixed top-5 right-5 z-30 inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface text-text-secondary backdrop-card transition hover:text-text-primary hover:border-border-accent"
    >
      {light ? (
        // luna → cambia a oscuro
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        </svg>
      ) : (
        // sol → cambia a claro
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  )
}
