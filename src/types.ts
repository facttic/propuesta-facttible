export type IconName =
  | 'database' | 'shield-check' | 'git-branch' | 'arrow-right' | 'gem'
  | 'workflow' | 'clock' | 'server' | 'hexagon' | 'zap' | 'layers' | 'box'
  | 'check' | 'message-square' | 'info' | 'handshake' | 'globe' | 'wallet'
  | 'download' | 'message-circle' | 'calendar' | 'code' | 'brain' | 'users'
  | 'mail' | 'send' | 'github' | 'link'
  | 'bell' | 'search' | 'file-text' | 'building' | 'flag'
  | 'clipboard' | 'map-pin' | 'pencil' | 'folder'

// Mejora de IA que entra en un paso del flujo (human-in-the-loop)
export type AiCard = {
  agent: string
  mejora: string
  human?: string
  phase?: string // "Fase 1" — ubica la mejora en el roadmap (simple → complejo)
  warning?: boolean // resalta riesgo de multas / penalidades
  origin?: 'kioshi' | 'facttic'
  // 'potencia' acelera el paso humano · 'reemplaza' hace el grueso y el humano valida · 'nuevo' capacidad que hoy no existe
  impact?: 'potencia' | 'reemplaza' | 'nuevo'
  // tipo de solución, para no vender humo:
  // 'software' automatización determinística (reglas, cálculos, integraciones) ·
  // 'ia' modelos que asisten y siempre se validan · 'definir' a confirmar en el Discovery
  kind?: 'software' | 'ia' | 'definir'
}

// Documento producido: nombre a secas o con una nota que explica qué contiene (tooltip)
export type DocRef = { name: string; note?: string }

export type FlowItem = { icon: IconName; text: string; from?: string; docs?: (string | DocRef)[] }

export type FlowStep = {
  n: string
  title: string
  desc?: string // qué hace el paso, en 1-2 frases
  inputs: FlowItem[]
  products: FlowItem[]
  ai?: AiCard[]
}

// Nodo del flujo: paso simple, bifurcación (split), tramo en paralelo o unión (merge)
export type FlowNode =
  | ({ type: 'step' } & FlowStep)
  | { type: 'split'; label: string; note?: string }
  | { type: 'parallel'; phase?: string; lanes: { name: string; tag?: string; steps: FlowStep[] }[] }
  | { type: 'merge'; label: string; note?: string }

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
    badge?: string
    title: string
    paragraphs: string[]
    calloutLabel: string
    calloutText: string
  }
  // Presentación de FACTTIC (quiénes somos)
  intro?: {
    badge: string
    title: string
    subtitle: string
    stats: { value: string; label: string }[]
    points?: string[]
  }
  // Flujo interactivo: mismo proceso con switch Hoy ⇄ Con IA
  flow?: {
    badge: string
    title: string
    subtitle: string
    toggle: { off: string; on: string }
    preAi?: AiCard[] // mejoras transversales antes del flujo (radar)
    nodes: FlowNode[]
    postAi?: AiCard[] // mejoras transversales (memoria de ofertas)
    converge: { label: string; title: string; note?: string; stats: { value: string; label: string }[] }
  }
  // (legacy) Proceso actual: flujo vertical por fases que converge en la oferta
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
  // Roadmap evolutivo: fases que van sumando funcionalidad (simple → complejo)
  roadmap?: {
    badge: string
    title: string
    subtitle: string
    axisFrom?: string // ej. "Simple · alto valor"
    axisTo?: string // ej. "Complejo · alto esfuerzo"
    phases: {
      label: string // "FASE 0"
      name: string
      duration?: string // "3 semanas"
      focus: string
      capabilities: string[]
      status: 'priced' | 'later'
      price?: string // "USD 8.400"
      effort?: 'baja' | 'media' | 'alta' // complejidad de implementación (explícita en el plan)
      value?: 'medio' | 'alto' // valor que aporta
    }[]
    note?: string
  }
  // Inversión detallada de las fases presupuestadas (0 y 1)
  investment?: {
    badge: string
    title: string
    subtitle: string
    rate: string // "USD 35 / hora por persona"
    phases: {
      label: string
      duration: string
      rows: { role: string; dedication: string; hours: number; desc?: string }[]
      subtotalHours: number
      subtotal: string
    }[]
    total: string
    notes: { icon: IconName; text: string }[]
    // Entregable del Discovery: qué documento queda y por qué vale por sí mismo
    deliverable?: {
      badge: string
      title: string
      lead: string
      items: string[]
      note: string
    }
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
