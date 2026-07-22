import { useRef, useState } from 'react'
import type { ProposalContent } from './types'
import PasswordGate from './components/PasswordGate'
import Background from './components/Background'
import Reveal from './components/Reveal'
import ThemeToggle from './components/ThemeToggle'
import SectionNav from './components/SectionNav'
import Footer from './components/Footer'
import BrzaCover from './sections/brza/BrzaCover'
import BrzaGreeting from './sections/brza/BrzaGreeting'
import BrzaOverview from './sections/brza/BrzaOverview'
import BrzaScope from './sections/brza/BrzaScope'
import BrzaImplementation from './sections/brza/BrzaImplementation'
import BrzaPricing from './sections/brza/BrzaPricing'
import BrzaProposal from './sections/brza/BrzaProposal'
import BrzaWhatsNext from './sections/brza/BrzaWhatsNext'
import Intro from './sections/brza/Intro'
import StepsFlow from './sections/brza/StepsFlow'
import Roadmap from './sections/brza/Roadmap'
import TentativeBudget from './sections/brza/TentativeBudget'

// La nav y el PDF se arman dinámicamente según qué secciones traiga el contenido.
function buildSections(content: ProposalContent) {
  const all: { id: string; label: string; present: boolean }[] = [
    { id: 'cover', label: 'Portada', present: true },
    { id: 'intro', label: 'Quiénes somos', present: !!content.intro },
    { id: 'greeting', label: 'Contexto', present: true },
    { id: 'flow', label: 'El proceso', present: !!content.flow },
    { id: 'process', label: 'Proceso actual', present: !!content.processFlow },
    { id: 'ai', label: 'Con IA', present: !!content.aiFlow },
    { id: 'roadmap', label: 'Plan e inversión', present: !!content.roadmap },
    { id: 'overview', label: 'Objetivo', present: !!content.overview },
    { id: 'scope', label: 'Alcance', present: !!content.scope },
    { id: 'implementation', label: 'Implementación', present: !!content.implementation },
    { id: 'pricing', label: 'Inversión', present: !!content.pricing },
    { id: 'proposal', label: 'Propuesta', present: !!content.proposal },
    { id: 'tentative-budget', label: 'Presupuesto por etapa', present: !!content.tentativeBudget },
    { id: 'whats-next', label: 'Siguientes pasos', present: true },
  ]
  return all.filter((s) => s.present).map(({ id, label }) => ({ id, label }))
}

function getPdfFilename(_content: ProposalContent) {
  return 'presupuesto-facttic.pdf'
}

export default function App() {
  const [content, setContent] = useState<ProposalContent | null>(null)
  const [generating, setGenerating] = useState(false)
  const proposalRef = useRef<HTMLDivElement>(null)

  function handleUnlock(nextContent: ProposalContent) {
    setContent(nextContent)
  }

  async function handleDownloadPdf() {
    if (!proposalRef.current || generating || !content) return
    setGenerating(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const sectionEls = buildSections(content)
        .map((section) => document.getElementById(section.id))
        .filter((el): el is HTMLElement => el !== null)

      const SCALE = 1.5
      const A4_W = 595.28
      const A4_H = 841.89
      const MARGIN = 24
      const GAP = 20
      const contentW = A4_W - MARGIN * 2
      const contentH = A4_H - MARGIN * 2

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
      let cursorY = MARGIN
      let placedAny = false

      function sliceCanvasToJpeg(canvas: HTMLCanvasElement, yStart: number, h: number): string {
        const slice = document.createElement('canvas')
        slice.width = canvas.width
        slice.height = Math.min(h, canvas.height - yStart)
        const ctx = slice.getContext('2d')!
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, slice.width, slice.height)
        ctx.drawImage(canvas, 0, -yStart)
        return slice.toDataURL('image/jpeg', 0.85)
      }

      for (const el of sectionEls) {
        const isCover = el.id === 'cover'
        // Medidas de los bloques que no deben cortarse entre páginas. Se toman dentro
        // del clon (ya con estilos de impresión), para que coincidan con el canvas.
        let atomicBottomsCss: number[] = []
        let sectionCssH = 0
        const canvas = await html2canvas(el, {
          backgroundColor: '#ffffff',
          scale: SCALE,
          useCORS: true,
          logging: false,
          windowWidth: el.scrollWidth,
          ignoreElements: (n) => n.classList.contains('pdf-ignore') || n.tagName === 'NAV',
          onclone: (clonedDoc) => {
            clonedDoc.body.classList.add('pdf-exporting')
            const badges = clonedDoc.querySelectorAll<HTMLElement>('.inline-flex.rounded-full')
            badges.forEach((badge) => {
              badge.style.display = 'inline-block'
              badge.style.padding = '0'
              badge.style.border = 'none'
              badge.style.background = 'transparent'
              badge.style.marginBottom = '8px'
              const spans = badge.querySelectorAll<HTMLElement>('span')
              if (spans.length >= 2) {
                spans[0].style.display = 'none'
                const text = spans[1]
                text.style.color = '#e0431c'
                text.style.fontWeight = '700'
                text.style.letterSpacing = '0.04em'
              }
            })
            const style = clonedDoc.createElement('style')
            style.textContent = `
              .tracking-widest { letter-spacing: 0.04em !important; }
              .tracking-wider { letter-spacing: 0.02em !important; }
              .inline-flex { white-space: nowrap; }
            `
            clonedDoc.head.appendChild(style)

            // medir los bloques atómicos ya con los estilos de impresión aplicados
            const clonedSection = clonedDoc.getElementById(el.id)
            if (clonedSection) {
              const secRect = clonedSection.getBoundingClientRect()
              sectionCssH = secRect.height
              atomicBottomsCss = Array.from(clonedSection.querySelectorAll<HTMLElement>('[data-pdf-atomic]'))
                .map((n) => n.getBoundingClientRect().bottom - secRect.top)
                .sort((a, b) => a - b)
            }
          },
        })
        const ratio = contentW / canvas.width
        const imgHeightPt = canvas.height * ratio

        if (isCover) {
          if (placedAny) pdf.addPage()
          let fitW = contentW
          let fitH = canvas.height * (contentW / canvas.width)
          if (fitH > contentH) {
            fitH = contentH
            fitW = canvas.width * (contentH / canvas.height)
          }
          const x = (A4_W - fitW) / 2
          const y = (A4_H - fitH) / 2
          const imgData = canvas.toDataURL('image/jpeg', 0.85)
          pdf.addImage(imgData, 'JPEG', x, y, fitW, fitH)
          cursorY = A4_H
          placedAny = true
          continue
        }

        const gapBefore = placedAny ? GAP : 0
        const availableOnPage = A4_H - MARGIN - cursorY

        if (imgHeightPt + gapBefore <= availableOnPage) {
          const imgData = canvas.toDataURL('image/jpeg', 0.85)
          cursorY += gapBefore
          pdf.addImage(imgData, 'JPEG', MARGIN, cursorY, contentW, imgHeightPt)
          cursorY += imgHeightPt
          placedAny = true
        } else if (imgHeightPt <= contentH) {
          pdf.addPage()
          cursorY = MARGIN
          const imgData = canvas.toDataURL('image/jpeg', 0.85)
          pdf.addImage(imgData, 'JPEG', MARGIN, cursorY, contentW, imgHeightPt)
          cursorY += imgHeightPt
          placedAny = true
        } else {
          if (placedAny && cursorY > MARGIN) {
            pdf.addPage()
            cursorY = MARGIN
          }
          const pxPerPage = Math.floor(contentH / ratio)
          // puntos de corte permitidos = bordes inferiores de los bloques atómicos (en px de canvas)
          const pxScale = sectionCssH > 0 ? canvas.height / sectionCssH : SCALE
          const cuts = Array.from(
            new Set(
              atomicBottomsCss
                .map((b) => Math.round(b * pxScale))
                .filter((y) => y > 0 && y < canvas.height),
            ),
          ).sort((a, b) => a - b)
          cuts.push(canvas.height)
          let yOffset = 0
          let firstSlice = true
          while (yOffset < canvas.height) {
            const maxCut = yOffset + pxPerPage
            // el borde de bloque más bajo que entra en la página; si ninguno entra
            // (un bloque más alto que una página), se corta duro al límite de página.
            let cut = -1
            for (const cand of cuts) {
              if (cand > yOffset && cand <= maxCut) cut = cand
            }
            if (cut < 0) cut = Math.min(maxCut, canvas.height)
            const sliceH = cut - yOffset
            const sliceImgData = sliceCanvasToJpeg(canvas, yOffset, sliceH)
            const sliceHeightPt = sliceH * ratio
            if (!firstSlice) {
              pdf.addPage()
              cursorY = MARGIN
            }
            firstSlice = false
            pdf.addImage(sliceImgData, 'JPEG', MARGIN, cursorY, contentW, sliceHeightPt)
            cursorY += sliceHeightPt
            yOffset = cut
          }
          placedAny = true
        }
      }

      pdf.save(getPdfFilename(content))
    } catch (err) {
      console.error('PDF generation failed', err)
      alert('PDF generation failed. Check the console for details.')
    } finally {
      setGenerating(false)
    }
  }

  if (!content) {
    return (
      <>
        <Background />
        <ThemeToggle />
        <PasswordGate onUnlock={handleUnlock} />
      </>
    )
  }

  return (
    <div ref={proposalRef} className="relative">
      <div className="pdf-ignore">
        <Background />
      </div>
      <ThemeToggle />
      <SectionNav sectionIds={buildSections(content)} />
      <BrzaCover c={content.cover} />
      {content.intro && <Reveal><Intro c={content.intro} /></Reveal>}
      <Reveal><BrzaGreeting c={content.greeting} /></Reveal>
      {content.flow && <StepsFlow c={content.flow} />}
      {content.roadmap && <Roadmap c={content.roadmap} inv={content.investment} />}
      {content.overview && <Reveal><BrzaOverview c={content.overview} /></Reveal>}
      {content.scope && <Reveal><BrzaScope c={content.scope} /></Reveal>}
      {content.implementation && <Reveal><BrzaImplementation c={content.implementation} /></Reveal>}
      {content.pricing && <Reveal><BrzaPricing c={content.pricing} /></Reveal>}
      {content.proposal && content.pricing && (
        <Reveal><BrzaProposal c={content.proposal} pricing={content.pricing} /></Reveal>
      )}
      {content.tentativeBudget && <Reveal><TentativeBudget c={content.tentativeBudget} /></Reveal>}
      <Reveal><BrzaWhatsNext c={content.whatsNext} onDownloadPdf={handleDownloadPdf} generating={generating} /></Reveal>
      <Footer />
    </div>
  )
}
