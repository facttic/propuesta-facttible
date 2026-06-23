export type IconName =
  | 'database' | 'shield-check' | 'git-branch' | 'arrow-right' | 'gem'
  | 'workflow' | 'clock' | 'server' | 'hexagon' | 'zap' | 'layers' | 'box'
  | 'check' | 'message-square' | 'info' | 'handshake' | 'globe' | 'wallet'
  | 'download' | 'message-circle' | 'calendar' | 'code' | 'brain' | 'users'
  | 'mail' | 'send' | 'github' | 'link'

export type BrzaContent = {
  meta: {
    title: string
    recipients: string[]
    template: 'brza'
  }
  cover: {
    eyebrow: string
    title: string
    subtitle: string
    date: string
    version: string
    preparedBy: string
  }
  greeting: {
    title: string
    paragraphs: string[]
    calloutLabel: string
    calloutText: string
  }
  // Proceso actual: flujo vertical por fases que converge en la oferta
  processFlow?: {
    badge: string
    title: string
    subtitle: string
    phases: {
      id: string
      label: string // "FASE A"
      name: string // "Captación y screening"
      steps: {
        n: string // "01"
        title: string
        output: string // resultado del paso
        docs?: string[] // documentos reales matcheados
      }[]
    }[]
    converge: {
      label: string
      title: string
      stats: { value: string; label: string }[]
    }
  }
  // Proceso con IA: carriles Hoy → Con IA, con human-in-the-loop
  aiFlow?: {
    badge: string
    title: string
    subtitle: string
    lanes: {
      phase: string // fase/etapa a la que aplica
      icon?: IconName
      origin?: 'kioshi' | 'facttic' // 'facttic' = idea propuesta por nosotros
      warning?: boolean // resalta los agentes de control de riesgo / multas
      hoy: { title: string; points: string[]; metric?: string }
      ia: { agent: string; automatiza: string; human: string; mejora: string }
    }[]
    note?: string
  }
  overview?: {
    badge: string
    title: string
    subtitle: string
    current: {
      label: string
      headline: string
      desc: string
      stats: { value: string; label: string }[]
    }
    target: {
      label: string
      headline: string
      desc: string
      stats: { value: string; label: string }[]
    }
  }
  scope?: {
    badge: string
    title: string
    subtitle: string
    items: { icon: IconName; title: string; desc: string }[]
    footer: string
  }
  implementation?: {
    badge: string
    title: string
    subtitle: string
    phases: { label: string; title: string; desc: string }[]
    estimate: {
      value: string
      label: string
      desc: string
    }
  }
  pricing?: {
    badge: string
    title: string
    subtitle: string
    total: string
    totalLabel: string
    breakdown: { label: string; value: string; accent?: boolean }[]
    notes: { icon: IconName; text: string }[]
  }
  proposal?: {
    badge: string
    title: string
    subtitle: string
    cards: { title: string; desc: string }[]
    closing: string
  }
  whatsNext: {
    badge: string
    title: string
    body: string
    ctas: { icon: IconName; label: string; href: string }[]
  }
}

export type ProposalContent = BrzaContent
