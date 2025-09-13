export interface TccData {
  id: string
  titulo: string
  curso: string
  subtitulo: string
  explicacao: string | string[]
  sugestoes: string[]
  dica: string
  estrutura: string | string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cronograma: any[]
  dataCriacao: string
  ultimaModificacao: string
  progresso: number
}

export interface NotesData {
  [workId: string]: string[]
}

export interface DashboardState {
  currentStep: number
  currentScreen:
    | 'main'
    | 'notes'
    | 'explanation'
    | 'structure'
    | 'timeline'
    | 'settings'
    | 'profile'
    | 'support'
  sidebarOpen: boolean
  showStepByStep: boolean
  showNewProjectForm: boolean
  hasCompletedInitialData: boolean
  trabalhoAtual: string | null
  tccData: TccData
  trabalhos: TccData[]
  savedNotes: NotesData
}
