export default function ScrollHint() {
  return (
    <div className="pdf-ignore absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted">
      <span className="text-[11px] font-mono tracking-widest uppercase">Scroll</span>
      <div className="w-6 h-10 rounded-full border border-border-accent flex justify-center pt-2">
        <div className="w-1 h-2 rounded-full bg-accent animate-scroll-dot" />
      </div>
    </div>
  )
}
