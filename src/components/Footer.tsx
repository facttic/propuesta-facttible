import Icon from './Icon'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="px-8 py-12 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Logo className="text-lg text-text-primary" />
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-text-muted hover:text-accent transition"
          >
            CC BY-SA 4.0
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://facttic.org.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition"
          >
            <Icon name="link" size={16} />
            facttic.org.ar
          </a>
          <a
            href="https://github.com/facttic/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition"
          >
            <Icon name="github" size={16} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
