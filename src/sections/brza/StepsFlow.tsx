import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import type { BrzaContent, AiCard, FlowStep, FlowItem, IconName } from '../../types'
import Icon from '../../components/Icon'
import Reveal from '../../components/Reveal'

gsap.registerPlugin(Draggable, InertiaPlugin)

type Props = { c: NonNullable<BrzaContent['flow']> }

// ── piezas chicas ────────────────────────────────────────────────

// Tipo de solución: separa lo determinístico (software) de lo probabilístico (IA)
// y lo que todavía hay que confirmar (a definir). Cada uno con su color e ícono.
const KIND: Record<
  NonNullable<AiCard['kind']>,
  { label: string; icon: IconName; badge: string; dot: string; bar: string }
> = {
  software: { label: 'Software', icon: 'workflow', badge: 'bg-secondary/15 border-secondary/40 text-secondary', dot: 'text-secondary', bar: 'border-secondary/50' },
  ia: { label: 'IA', icon: 'brain', badge: 'bg-accent/15 border-accent/40 text-accent', dot: 'text-accent', bar: 'border-accent/50' },
  definir: { label: 'A definir', icon: 'search', badge: 'border-dashed border-text-muted/60 text-text-muted', dot: 'text-text-muted', bar: 'border-text-muted/50' },
}

function DocList({ docs }: { docs: NonNullable<FlowItem['docs']> }) {
  return (
    <>
      <div className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-text-muted">
        {docs.length} documento{docs.length > 1 ? 's' : ''}
      </div>
      <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1">
        {docs.map((d) => {
          const name = typeof d === 'string' ? d : d.name
          const note = typeof d === 'string' ? undefined : d.note
          return (
            <div
              key={name}
              tabIndex={note ? 0 : undefined}
              className={`group relative flex items-start gap-1.5 rounded-md border border-border px-2 py-1.5 font-mono text-[10px] text-text-secondary leading-snug transition outline-none ${
                note
                  ? 'cursor-help hover:border-border-accent hover:bg-accent/[0.04] focus-visible:border-border-accent focus-visible:bg-accent/[0.04]'
                  : ''
              }`}
            >
              <Icon name="file-text" size={11} className="text-secondary shrink-0 mt-0.5" />
              <span className="break-words flex-1">{name}</span>
              {note && (
                <Icon name="info" size={11} className="text-text-muted shrink-0 mt-0.5 group-hover:text-accent group-focus-within:text-accent" />
              )}
              {note && (
                <div className="pointer-events-none absolute left-0 right-0 bottom-full z-20 mb-1.5 hidden group-hover:block group-focus-within:block rounded-lg border border-border-accent bg-bg p-2.5 font-sans text-[11px] leading-relaxed text-text-secondary shadow-xl">
                  {note}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

function InputItem({ it }: { it: FlowItem }) {
  const hasDocs = !!it.docs && it.docs.length > 0
  return (
    <div className="flex items-start gap-2">
      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary/15 text-secondary shrink-0" aria-hidden>
        <Icon name={it.icon} size={13} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] text-text-primary leading-snug break-words">{it.text}</div>
        {it.from && (
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-text-muted">desde {it.from}</div>
        )}
        {hasDocs && <DocList docs={it.docs!} />}
      </div>
    </div>
  )
}

function ProductItem({ it }: { it: FlowItem }) {
  const hasDocs = !!it.docs && it.docs.length > 0
  return (
    <div className="flex items-start gap-2">
      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-accent text-bg shrink-0" aria-hidden>
        <Icon name={it.icon} size={13} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-text-primary leading-snug break-words">{it.text}</div>
        {hasDocs && <DocList docs={it.docs!} />}
      </div>
    </div>
  )
}

// El tab de la card indica el tipo principal (ej. IA). Si un agente es de otro tipo
// (ej. "a definir"), se lo marca con su badge; si coincide con el tab, no se repite.
function AiBlock({ a, primaryKind }: { a: AiCard; primaryKind?: AiCard['kind'] }) {
  const kind = a.kind ? KIND[a.kind] : null
  const showBadge = !!a.kind && a.kind !== primaryKind
  return (
    <div className={`pl-3 border-l-2 ${kind?.bar ?? 'border-accent/50'}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <Icon name={kind?.icon ?? 'brain'} size={15} className={`shrink-0 ${kind?.dot ?? 'text-accent'}`} />
        <span className="text-[15px] font-bold text-text-primary">{a.agent}</span>
        {kind && showBadge && (
          <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${kind.badge}`}>
            {kind.label}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[13px] text-text-primary leading-relaxed">{a.mejora}</p>
      {a.human && (
        <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-secondary">Valida </span>
          {a.human}
        </p>
      )}
    </div>
  )
}

// Tarjeta del paso tal como se releva hoy: qué recibe y qué produce.
function StepCard({ s }: { s: FlowStep }) {
  return (
    <div className="h-full rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="shrink-0 inline-flex items-center justify-center min-w-[3.25rem] h-12 px-2.5 rounded-xl bg-surface-elevated font-mono text-2xl font-bold text-accent tabular-nums">
          {s.n}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-text-primary">{s.title}</h3>
          {s.desc && <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">{s.desc}</p>}
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {/* recibe */}
        <div className="rounded-xl border border-secondary/25 bg-secondary/[0.06] p-3.5">
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-widest uppercase text-secondary">
            <Icon name="download" size={11} /> Recibe
          </div>
          <div className="mt-2.5 space-y-2.5">
            {s.inputs.length ? (
              s.inputs.map((it) => <InputItem key={it.text} it={it} />)
            ) : (
              <div className="font-mono text-[11px] italic text-text-muted">Sin insumos externos</div>
            )}
          </div>
        </div>
        {/* flecha hacia abajo: recibe → produce */}
        <div className="flex justify-center text-border-accent" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </div>
        {/* produce */}
        <div className="rounded-xl border border-accent/25 bg-accent/[0.06] p-3.5">
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-widest uppercase text-accent">
            <Icon name="check" size={11} /> Produce
          </div>
          <div className="mt-2.5 space-y-2.5">
            {s.products.map((it) => (
              <ProductItem key={it.text} it={it} />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

// Slider horizontal FINITO y arrastrable con las tarjetas del proceso relevado (solo pantalla).
// Frena en la primera y en la última; la tarjeta centrada queda a escala plena y las
// laterales se achican y atenúan (coverflow).
function StepsSlider({ slides, hint }: { slides: ReactNode[]; hint?: string }) {
  const viewRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const apiRef = useRef<{ go: (d: 1 | -1) => void } | null>(null)
  // pista "deslizá para ver más": visible hasta la primera interacción
  const [hintVisible, setHintVisible] = useState(true)
  const dismissedRef = useRef(false)
  const dismissHint = () => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setHintVisible(false)
  }

  useLayoutEffect(() => {
    const view = viewRef.current
    const row = rowRef.current
    if (!view || !row) return
    const slides = gsap.utils.toArray<HTMLElement>('.step-slide', row)
    const inners = gsap.utils.toArray<HTMLElement>('.step-slide-inner', row)
    const n = slides.length
    const clamp01 = gsap.utils.clamp(0, 1)
    const clampIdx = gsap.utils.clamp(0, n - 1)
    const lerp = gsap.utils.interpolate
    let step = 0
    let minX = 0
    let draggable: Draggable | undefined

    // coverflow: escala/opacidad según distancia al centro del viewport (sobre el wrapper interno)
    const coverflow = () => {
      const b = view.getBoundingClientRect()
      const cx = b.left + b.width / 2
      const reach = b.width / 2
      slides.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const t = clamp01(Math.abs(cx - (r.left + r.width / 2)) / reach)
        gsap.set(inners[i], { scale: lerp(1, 0.84, t), opacity: lerp(1, 0.4, t) })
      })
    }

    // El enchufe arranca desconectado; recién conecta (con el "pop") cuando la card
    // se asienta en el centro. Al empezar a moverse, se desconecta para volver a animar.
    let connectCall: gsap.core.Tween | undefined
    const disconnect = () => slides.forEach((el) => el.classList.remove('is-centered'))
    const connect = (idx: number) => slides.forEach((el, i) => el.classList.toggle('is-centered', i === idx))
    const settle = (delay = 0.14) => {
      syncIndex()
      connectCall?.kill()
      disconnect()
      connectCall = gsap.delayedCall(delay, () => connect(indexRef.current))
    }

    // deja lugar para que la primera y la última tarjeta puedan centrarse
    const layout = () => {
      step = slides[0].offsetWidth
      const spacer = Math.max(0, (view.clientWidth - step) / 2)
      row.style.paddingLeft = `${spacer}px`
      row.style.paddingRight = `${spacer}px`
      minX = -step * (n - 1)
      gsap.set(row, { x: gsap.utils.clamp(minX, 0, -indexRef.current * step) })
      draggable?.applyBounds({ minX, maxX: 0 })
      coverflow()
    }

    const syncIndex = () => {
      indexRef.current = clampIdx(Math.round((-(gsap.getProperty(row, 'x') as number)) / step))
    }

    draggable = Draggable.create(row, {
      type: 'x',
      inertia: true,
      allowNativeTouchScrolling: true, // en mobile: arrastre horizontal sin bloquear el scroll vertical
      bounds: { minX: 0, maxX: 0 },
      edgeResistance: 0.9,
      dragResistance: 0.05,
      snap: { x: (v) => gsap.utils.snap(step, v) },
      onPress: () => {
        disconnect() // al agarrar, se "desenchufa"
        dismissHint()
      },
      onDrag: coverflow,
      onThrowUpdate: coverflow,
      onThrowComplete: () => settle(), // al asentarse en el centro, conecta con el pop
    })[0]

    layout()
    // recalcular cuando las fuentes cargan (las alturas de card cambian con el texto)
    if (document.fonts?.ready) document.fonts.ready.then(() => layout())
    gsap.ticker.add(coverflow)
    window.addEventListener('resize', layout)
    // conexión inicial de la card visible al montar
    connectCall = gsap.delayedCall(0.35, () => connect(indexRef.current))

    apiRef.current = {
      go: (d) => {
        dismissHint()
        indexRef.current = clampIdx(indexRef.current + d)
        connectCall?.kill()
        disconnect()
        gsap.to(row, {
          x: -indexRef.current * step,
          duration: 0.5,
          ease: 'power2.inOut',
          onUpdate: coverflow,
          onComplete: () => {
            draggable?.update()
            connectCall = gsap.delayedCall(0.12, () => connect(indexRef.current))
          },
        })
      },
    }

    return () => {
      gsap.ticker.remove(coverflow)
      window.removeEventListener('resize', layout)
      connectCall?.kill()
      draggable?.kill()
    }
  }, [])

  const go = (dir: 1 | -1) => apiRef.current?.go(dir)

  return (
    <div className="relative">
      <div
        ref={viewRef}
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
          maskImage: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
        }}
      >
        <div ref={rowRef} className="flex items-center py-4">
          {slides.map((node, i) => (
            <div key={i} className="step-slide shrink-0 w-[86vw] sm:w-[540px] lg:w-[640px] px-3">
              <div className="step-slide-inner h-full will-change-transform">{node}</div>
            </div>
          ))}
        </div>
        {/* pista de deslizamiento: desaparece a la primera interacción */}
        <div
          className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-500 ${
            hintVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border-accent bg-bg/85 backdrop-blur px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary shadow-lg">
            <svg
              className="slide-hint text-accent"
              width="22"
              height="12"
              viewBox="0 0 22 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M4 2 L9 6 L4 10" />
              <path d="M11 2 L16 6 L11 10" />
            </svg>
            Deslizá para ver más
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Paso anterior"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border bg-surface text-text-secondary transition hover:text-text-primary hover:border-border-accent"
          >
            <Icon name="arrow-right" size={18} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Paso siguiente"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border bg-surface text-text-secondary transition hover:text-text-primary hover:border-border-accent"
          >
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
        <span className="font-mono text-[11px] text-text-muted">
          {hint ?? 'Arrastrá las tarjetas o usá las flechas · 17 pasos'}
        </span>
      </div>
    </div>
  )
}

// Módulo de IA que se encastra al paso: header + agentes.
// Color del marco según el/los tipo(s) del paso: teal (software), naranja (IA),
// gris (a definir) — o un degradé entre ellos cuando conviven en el mismo paso.
const KIND_RGB: Record<NonNullable<AiCard['kind']>, string> = {
  software: '87, 195, 200',
  ia: '255, 82, 41',
  definir: '138, 138, 138',
}
const KIND_ORDER = ['software', 'ia', 'definir'] as const

type Frame = {
  primary: string
  borderBg: string
  solidBg: string
  moduleBorder: string
}

function frameStyle(kinds: NonNullable<AiCard['kind']>[]): Frame {
  const list = (KIND_ORDER.filter((k) => kinds.includes(k)).map((k) => KIND_RGB[k]) as string[])
  const rgbs = list.length ? list : [KIND_RGB.ia]
  const primary = kinds.includes('ia') ? KIND_RGB.ia : rgbs[0]
  const grad = rgbs.length > 1
  return {
    primary,
    // borde del wrapper: color o degradé (algo más tenue para no gritar)
    borderBg: grad ? `linear-gradient(135deg, ${rgbs.map((c) => `rgba(${c}, 0.7)`).join(', ')})` : `rgba(${rgbs[0]}, 0.65)`,
    // tab sólido
    solidBg: grad ? `linear-gradient(135deg, ${rgbs.map((c) => `rgb(${c})`).join(', ')})` : `rgb(${rgbs[0]})`,
    moduleBorder: grad
      ? `linear-gradient(135deg, ${rgbs.map((c) => `rgba(${c}, 0.55)`).join(', ')})`
      : `rgba(${rgbs[0]}, 0.5)`,
  }
}

// Robotito para el módulo de IA (marca visual del "cerebro" que se enchufa).
function RobotIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* antena */}
      <path d="M12 2.6 V5.6" />
      <circle cx="12" cy="2.3" r="1.1" fill="currentColor" stroke="none" />
      {/* cabeza + orejas */}
      <rect x="4.5" y="6" width="15" height="12" rx="3.6" />
      <path d="M2.6 11 v3 M21.4 11 v3" />
      {/* ojos + boca */}
      <circle cx="9.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <path d="M10 15.3 h4" />
    </svg>
  )
}

// Enchufe con halo eléctrico: la IA se "enchufa" a la etapa. Arriba, el enchufe cuelga
// de la etapa; abajo, la toma pertenece al módulo de IA. Al centrar la card, el enchufe
// baja, se conecta en la toma y se enciende el halo (ver .plug-body / .plug-spark en CSS).
function PlugConnector({ color }: { color: string }) {
  return (
    <span className="inline-block leading-none" style={{ color }} aria-hidden>
      <svg width="52" height="60" viewBox="0 0 52 60" fill="none">
        {/* toma de corriente (pertenece al módulo, queda fija) */}
        <rect
          x="12"
          y="40"
          width="28"
          height="14"
          rx="4"
          fill="var(--c-surface-elevated)"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
        <rect x="21.4" y="42" width="3.2" height="7" rx="1.6" fill="currentColor" fillOpacity="0.5" />
        <rect x="27.4" y="42" width="3.2" height="7" rx="1.6" fill="currentColor" fillOpacity="0.5" />
        {/* chispas eléctricas al conectar */}
        <path className="plug-spark" d="M6 30 l-4 6 h3 l-2.5 6 6 -8 h-3 l2 -4 z" fill="currentColor" />
        <path className="plug-spark" d="M46 30 l4 6 h-3 l2.5 6 -6 -8 h3 l-2 -4 z" fill="currentColor" />
        {/* enchufe: baja hasta el fondo y tapa los agujeros */}
        <g className="plug-body">
          {/* cordón hacia la etapa */}
          <path d="M26 16 v8" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          {/* cuerpo */}
          <rect x="15" y="24" width="22" height="16" rx="6" fill="currentColor" />
          {/* patas cortas (entran en la toma) */}
          <rect x="21.4" y="40" width="3.2" height="9" rx="1.6" fill="currentColor" />
          <rect x="27.4" y="40" width="3.2" height="9" rx="1.6" fill="currentColor" />
        </g>
      </svg>
    </span>
  )
}

function AiModule({ ai, frame, primaryKind }: { ai: AiCard[]; frame: Frame; primaryKind?: AiCard['kind'] }) {
  return (
    // borde de color (no fondo, para que en dark no se tiña la card).
    // ai-module-glow: prende recién cuando la card se centra y se enchufa.
    <div
      className="ai-module-glow h-full rounded-xl border-[1.5px] bg-surface p-4"
      style={{ borderColor: frame.moduleBorder, ['--glow' as string]: `rgba(${frame.primary}, 0.7)` }}
    >
      <div
        className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase"
        style={{ color: `rgb(${frame.primary})` }}
      >
        <span className="plug-glow inline-flex" style={{ color: `rgb(${frame.primary})` }}>
          <RobotIcon size={16} />
        </span>
        Qué se automatiza en esta etapa
      </div>
      <div className="mt-3 space-y-4">
        {ai.map((a, i) => (
          <AiBlock key={i} a={a} primaryKind={primaryKind} />
        ))}
      </div>
    </div>
  )
}

// Cabecera compacta del paso (nº + título + descripción), sin recibe/produce.
// Se usa en la vista "con IA", donde el detalle de insumos/productos ya se vio arriba.
function StepHeader({ s, muted }: { s: FlowStep; muted?: boolean }) {
  return (
    <div className="h-full rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span
          className={`shrink-0 inline-flex items-center justify-center min-w-[3.25rem] h-12 px-2.5 rounded-xl bg-surface-elevated font-mono text-2xl font-bold tabular-nums ${
            muted ? 'text-text-muted' : 'text-accent'
          }`}
        >
          {s.n}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-text-primary">{s.title}</h3>
          {s.desc && <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">{s.desc}</p>}
        </div>
      </div>
    </div>
  )
}

// Marco gris para las etapas que quedan manuales (se ven "desactivadas").
const GRAY_FRAME: Frame = {
  primary: '138, 138, 138',
  borderBg: 'rgba(138, 138, 138, 0.4)',
  solidBg: 'rgb(138, 138, 138)',
  moduleBorder: 'rgba(138, 138, 138, 0.4)',
}

// Persona tipeando en un teclado (flat, prolijo) para las etapas que quedan manuales.
// Las manos suben y bajan alternadas (tecleo). Paleta acorde al resto de las ilustraciones.
function ManualIllustration({ className = '' }: { className?: string }) {
  const skin = '#f2c9a0'
  const keyRows = [91, 94.4, 97.8]
  // una mano dibujada en la posición izquierda; la derecha es su espejo
  const hand = (
    <>
      <rect x="40" y="66" width="24" height="15" rx="7" fill={skin} />
      <rect x="60.5" y="72" width="4" height="9" rx="2" fill={skin} transform="rotate(22 62 76)" />
      {[43, 48.2, 53.4, 58.6].map((fx) => (
        <rect key={fx} x={fx} y="78" width="4.2" height="9" rx="2.1" fill={skin} />
      ))}
    </>
  )
  return (
    <svg viewBox="0 0 140 116" className={className} fill="none" aria-hidden>
      {/* hombros / remera */}
      <path d="M22 96 C22 70 40 58 70 58 C100 58 118 70 118 96 Z" fill="#3fb5ba" />
      <path d="M58 60 Q70 68 82 60 L82 66 Q70 74 58 66 Z" fill="#2f9ea3" />
      {/* cuello */}
      <rect x="62" y="42" width="16" height="18" rx="7" fill="#e3b083" />
      {/* orejas */}
      <ellipse cx="49" cy="32" rx="4" ry="6.5" fill="#e3b083" />
      <ellipse cx="91" cy="32" rx="4" ry="6.5" fill="#e3b083" />
      {/* cabeza */}
      <ellipse cx="70" cy="30" rx="21" ry="23" fill={skin} />
      {/* pelo */}
      <path
        d="M48 33 C47 15 58 6 71 6 C85 6 94 16 92 33 C87 25 80 21 73 23 C70 19 66 19 63 24 C57 22 52 26 48 33 Z"
        fill="#8a5f3c"
      />
      {/* teclado */}
      <rect x="15" y="100" width="110" height="8" rx="3" fill="#c2beb7" />
      <rect x="18" y="89" width="104" height="14" rx="3" fill="#dcd9d3" />
      {keyRows.map((y, r) =>
        Array.from({ length: 15 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={24 + c * 6.2} y={y} width="4.6" height="2.4" rx="1" fill="#c5c1ba" />
        )),
      )}
      <rect x="48" y="100.4" width="44" height="2.6" rx="1.3" fill="#c5c1ba" />
      {/* manos que tipean */}
      <g className="type-hand-l">{hand}</g>
      <g transform="translate(140 0) scale(-1 1)">
        <g className="type-hand-r">{hand}</g>
      </g>
    </svg>
  )
}

// Vista "con IA": las etapas potenciadas quedan "encastradas" en un módulo del color del tipo.
// Las manuales se ven en gris (desactivadas), ocupando toda la card, con una ilustración.
function AiStepCard({ s }: { s: FlowStep }) {
  const boosted = !!(s.ai && s.ai.length)

  if (!boosted) {
    return (
      <div
        className="relative h-full flex flex-col rounded-[1.4rem] border-2 bg-surface p-5 md:p-6 pt-7 opacity-90"
        style={{ borderColor: GRAY_FRAME.borderBg }}
      >
        <div
          className="absolute -top-3 left-6 z-30 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-bg shadow-md"
          style={{ background: GRAY_FRAME.solidBg }}
        >
          <Icon name="users" size={11} /> Etapa manual
        </div>
        <div className="flex items-start gap-3">
          <span className="shrink-0 inline-flex items-center justify-center min-w-[3.25rem] h-12 px-2.5 rounded-xl bg-surface-elevated font-mono text-2xl font-bold text-text-muted tabular-nums">
            {s.n}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-text-primary">{s.title}</h3>
            {s.desc && <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">{s.desc}</p>}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center py-6">
          <ManualIllustration className="w-32 md:w-40" />
        </div>
      </div>
    )
  }

  const kinds = Array.from(
    new Set(s.ai!.map((a) => a.kind).filter(Boolean)),
  ) as NonNullable<AiCard['kind']>[]
  // tipo principal (para el tab y el marco): un solo color, sin degradé.
  // Prioridad IA › Software › A definir; los agentes de otro tipo llevan su propio badge.
  const KIND_PRIORITY = ['ia', 'software', 'definir'] as const
  const primaryKind = KIND_PRIORITY.find((k) => kinds.includes(k))
  const tabLabel = primaryKind ? KIND[primaryKind].label : 'Automatizable'
  const f = frameStyle(primaryKind ? [primaryKind] : [])
  return (
    // sin reborde general: las dos cards quedan sueltas y el enchufe muestra la conexión
    <div className="relative h-full flex flex-col">
      {/* la etapa (crece para repartir el alto sobrante) */}
      <div className="relative z-10 grow flex flex-col">
        <StepHeader s={s} />
      </div>
      {/* enchufe: cuelga de la etapa y baja a la toma del módulo (halo eléctrico) */}
      <div className="relative z-20 -mt-4 -mb-3 flex justify-center shrink-0">
        <PlugConnector color={`rgb(${f.primary})`} />
      </div>
      {/* módulo de IA con la toma donde se enchufa (crece igual que la etapa) */}
      <div className="relative grow flex flex-col">
        {/* etiqueta de tipo sobre el módulo (lo que se enchufa) */}
        <div
          className="absolute -top-3 left-6 z-30 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-bg shadow-md"
          style={{ background: f.solidBg }}
        >
          <Icon name="zap" size={11} /> {tabLabel}
        </div>
        <AiModule ai={s.ai!} frame={f} primaryKind={primaryKind} />
      </div>
    </div>
  )
}

// Carpeta con hojas que "pasan" en loop, para la card del resultado.
function FolderRiffle({ className = '' }: { className?: string }) {
  const leaves = [0, 1, 2, 3, 4]
  return (
    <svg viewBox="0 0 84 76" className={className} fill="none" aria-hidden>
      {/* pestaña + fondo de la carpeta */}
      <path
        d="M10 16 h16 l5 -6 h30 a4 4 0 0 1 4 4 v46 a4 4 0 0 1 -4 4 H14 a4 4 0 0 1 -4 -4 Z"
        fill="#c73e1f"
      />
      {/* hojas apiladas que pasan una tras otra */}
      {leaves.map((i) => (
        <g key={i} className="riffle-leaf" style={{ animationDelay: `${(4 - i) * 0.42}s` }}>
          <rect x="20" y="6" width="44" height="40" rx="3" fill="#f7f6f4" stroke="#e2ddd6" strokeWidth="0.6" />
          <rect x="26" y="14" width={26 + (i % 3) * 6} height="2.4" rx="1.2" fill="#57c3c8" />
          <rect x="26" y="21" width={32 - (i % 2) * 8} height="2.4" rx="1.2" fill="#cfc9c1" />
          <rect x="26" y="28" width={22 + (i % 2) * 10} height="2.4" rx="1.2" fill="#cfc9c1" />
          <rect x="26" y="35" width="18" height="2.4" rx="1.2" fill="#ff5229" />
        </g>
      ))}
      {/* frente de la carpeta */}
      <path d="M8 40 h68 v22 a4 4 0 0 1 -4 4 H12 a4 4 0 0 1 -4 -4 Z" fill="#ff5229" />
      <path d="M8 40 h68" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  )
}

function Connector() {
  return (
    <div className="flex justify-center py-1" aria-hidden>
      <div className="h-6 w-px bg-border-accent/50" />
    </div>
  )
}

// Radar con barrido giratorio (para la transversal "antes de iniciar").
function RadarIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <g stroke="currentColor" className="opacity-30">
        <circle cx="60" cy="60" r="52" strokeWidth="2" />
        <circle cx="60" cy="60" r="36" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="20" strokeWidth="1.5" />
        <path d="M60 8 V112 M8 60 H112" strokeWidth="1" />
      </g>
      <g className="radar-sweep">
        <path d="M60 60 L60 8 A52 52 0 0 1 105 34 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M60 60 L60 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <circle cx="84" cy="44" r="4" fill="currentColor" className="radar-blip" />
      <circle cx="60" cy="60" r="3.5" fill="currentColor" />
    </svg>
  )
}

// Pila de ofertas archivadas (para la transversal "memoria de ofertas").
function MemoryIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <g className="memory-stack">
        <g transform="rotate(-10 60 66)">
          <rect x="36" y="34" width="48" height="62" rx="6" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
        </g>
        <g transform="rotate(-3 60 66)">
          <rect x="36" y="32" width="48" height="62" rx="6" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
        </g>
        <g transform="rotate(6 60 66)">
          <rect x="36" y="30" width="48" height="62" rx="6" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.5" />
          <rect x="44" y="42" width="28" height="3.2" rx="1.6" fill="currentColor" fillOpacity="0.75" />
          <rect x="44" y="51" width="32" height="3.2" rx="1.6" fill="currentColor" fillOpacity="0.4" />
          <rect x="44" y="60" width="22" height="3.2" rx="1.6" fill="currentColor" fillOpacity="0.4" />
        </g>
      </g>
    </svg>
  )
}

// Tarjeta transversal (radar / memoria): mismo estilo que las etapas (marco + tab + módulo),
// coloreada por su tipo, con una ilustración en el espacio libre.
function Transversal({ a, kicker, art, n }: { a: AiCard; kicker: string; art: ReactNode; n?: string }) {
  const f = frameStyle(a.kind ? [a.kind] : [])
  const kindLabel = a.kind ? KIND[a.kind].label : 'Transversal'
  return (
    <div
      data-pdf-atomic
      className="relative h-full flex flex-col rounded-[1.4rem] border-2 bg-surface p-5 md:p-6 pt-7"
      style={{ borderColor: f.borderBg }}
    >
      <div
        className="absolute -top-3 left-6 z-30 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-bg shadow-md"
        style={{ background: f.solidBg }}
      >
        <Icon name="zap" size={11} /> {kindLabel}
      </div>
      <div className="flex items-start gap-3">
          {n && (
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <span
                className="inline-flex items-center justify-center min-w-[3.25rem] h-12 px-2.5 rounded-xl bg-surface-elevated font-mono text-2xl font-bold tabular-nums"
                style={{ color: `rgb(${f.primary})` }}
              >
                {n}
              </span>
              <span
                className="rounded-full border px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider whitespace-nowrap"
                style={{ color: `rgb(${f.primary})`, borderColor: `rgb(${f.primary})` }}
              >
                Paso nuevo
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[9px] font-bold tracking-widest uppercase" style={{ color: `rgb(${f.primary})` }}>
              {kicker}
            </div>
            {/* título con el mismo estilo que las etapas */}
            <div className="mt-1">
              <h3 className="text-lg md:text-xl font-bold text-text-primary">{a.agent}</h3>
            </div>
            <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">{a.mejora}</p>
            {a.human && (
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-secondary">Valida </span>
                {a.human}
              </p>
            )}
          </div>
        </div>
      <div className="flex-1 flex items-center justify-center py-4" style={{ color: `rgb(${f.primary})` }}>
        {art}
      </div>
    </div>
  )
}

// ── sección ──────────────────────────────────────────────────────

export default function StepsFlow({ c }: Props) {
  const steps = c.nodes.filter((n): n is Extract<typeof n, { type: 'step' }> => n.type === 'step')

  // conteo por tipo de solución (software / IA / a definir) para el cierre honesto
  const counts = { software: 0, ia: 0, definir: 0 }
  const tally = (cards?: AiCard[]) =>
    cards?.forEach((a) => {
      if (a.kind) counts[a.kind]++
    })
  tally(c.preAi)
  tally(c.postAi)
  steps.forEach((s) => tally(s.ai))

  return (
    <section id="flow" className="px-6 md:px-8 py-20 md:py-32 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="font-mono text-xs font-medium tracking-widest text-text-secondary">{c.badge}</span>
      </div>
      <h2 className="mt-8 text-3xl md:text-5xl font-bold text-text-primary">{c.title}</h2>
      <p className="mt-6 text-lg text-text-secondary leading-relaxed">{c.subtitle}</p>

      {/* ══════════ VISTA 1 · el proceso tal como se releva hoy ══════════ */}
      <div className="mt-14 flex items-center gap-3">
        <span className="font-mono text-xs font-bold tracking-widest uppercase text-text-secondary whitespace-nowrap">
          El proceso hoy
        </span>
        <span className="flex-1 h-px bg-border" />
        <span className="hidden sm:inline font-mono text-[11px] text-text-muted whitespace-nowrap">
          17 pasos · qué recibe y qué produce cada uno
        </span>
      </div>

      {/* pantalla: slider horizontal */}
      <div className="steps-slider-web mt-8">
        <StepsSlider slides={steps.map((s) => <StepCard key={s.n} s={s} />)} />
      </div>
      {/* PDF: pila vertical (un slider no tiene sentido en papel) */}
      <div className="pdf-steps mt-8 space-y-0">
        {steps.map((s, idx) => (
          <div key={s.n} data-pdf-atomic>
            {idx > 0 && <Connector />}
            <StepCard s={s} />
          </div>
        ))}
      </div>

      {/* flecha gruesa que baja al resultado, con bob */}
      <div className="flex justify-center pt-8 pb-7" aria-hidden>
        <svg width="44" height="60" viewBox="0 0 44 60" fill="none" className="text-accent overflow-visible">
          <path
            className="converge-arrow"
            d="M15 2 H29 V26 H41 L22 50 L3 26 H15 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* convergencia: el resultado del proceso */}
      <Reveal>
        <div data-pdf-atomic className="rounded-2xl border-2 border-accent/60 bg-accent/[0.06] p-6 md:p-8 shadow-[0_0_60px_-18px] shadow-accent/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-accent">{c.converge.label}</div>
              <h3 className="mt-2 text-2xl md:text-3xl font-bold text-text-primary">{c.converge.title}</h3>
            </div>
            <FolderRiffle className="hidden sm:block shrink-0 w-16 h-16 md:w-20 md:h-20" />
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.converge.stats.map((st) => (
              <div key={st.label} className="rounded-xl border border-border bg-surface-elevated p-4">
                <div className="text-2xl md:text-3xl font-bold text-accent">{st.value}</div>
                <div className="mt-1 font-mono text-[10px] tracking-wider text-text-secondary leading-tight">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ══════════ VISTA 2 · el mismo proceso, con software e IA ══════════ */}
      <div className="mt-24 pt-16 border-t border-border">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-accent bg-accent-glow">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-mono text-xs font-medium tracking-widest text-accent">CON SOFTWARE E IA</span>
        </div>
        <h3 className="mt-6 text-2xl md:text-4xl font-bold text-text-primary">El mismo proceso, potenciado</h3>
        <p className="mt-4 text-lg text-text-secondary leading-relaxed">
          Presentamos nuevamente el proceso, indicando en qué etapas el software y la inteligencia artificial
          pueden aportar valor. Cada oportunidad se clasifica según su naturaleza para precisar su alcance.
          Se trata de ideas preliminares, a validar y priorizar durante el Discovery.
        </p>

        {/* leyenda de tipos de solución */}
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[10px] text-text-muted">
          <span><span className="font-bold text-secondary">Software</span> · automatización determinística: reglas, cálculos, integraciones</span>
          <span><span className="font-bold text-accent">IA</span> · modelos que asisten; siempre se validan</span>
          <span><span className="font-bold text-text-muted">A definir</span> · a explorar y confirmar en el Discovery</span>
        </div>

        {/* pantalla: slider con radar (primero), las 17 etapas y la memoria (último) */}
        <div className="steps-slider-web mt-10">
          <StepsSlider
            slides={[
              ...(c.preAi ?? []).map((a, i) => (
                <Transversal
                  key={`pre${i}`}
                  a={a}
                  n="00"
                  kicker="Antes de iniciar · monitoreo continuo"
                  art={<RadarIllustration className="w-28 md:w-36" />}
                />
              )),
              ...steps.map((s) => <AiStepCard key={s.n} s={s} />),
              ...(c.postAi ?? []).map((a, i) => (
                <Transversal
                  key={`post${i}`}
                  a={a}
                  n="18"
                  kicker="Al finalizar · aprende de cada oferta"
                  art={<MemoryIllustration className="w-28 md:w-36" />}
                />
              )),
            ]}
            hint="Arrastrá o usá las flechas · el radar, las 17 etapas y la memoria"
          />
        </div>
        {/* PDF: pila vertical */}
        <div className="pdf-steps mt-10 space-y-0">
          {c.preAi?.map((a, i) => (
            <div key={`pre${i}`}>
              <Transversal a={a} n="00" kicker="Antes de iniciar · monitoreo continuo" art={<RadarIllustration className="w-32" />} />
              <Connector />
            </div>
          ))}
          {steps.map((s, idx) => (
            <div key={s.n} data-pdf-atomic>
              {idx > 0 && <Connector />}
              <AiStepCard s={s} />
            </div>
          ))}
          {c.postAi?.map((a, i) => (
            <div key={`post${i}`}>
              <Connector />
              <Transversal a={a} n="18" kicker="Al finalizar · aprende de cada oferta" art={<MemoryIllustration className="w-32" />} />
            </div>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-[11px] text-text-muted">
          <span className="text-secondary font-bold">{counts.software}</span> de software ·{' '}
          <span className="text-accent font-bold">{counts.ia}</span> de IA ·{' '}
          <span className="font-bold">{counts.definir}</span> a definir — oportunidades identificadas a lo largo del proceso.
        </p>
      </div>
    </section>
  )
}
