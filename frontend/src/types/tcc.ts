export interface TccData {
  id: string
  titulo: string
  curso: string
  tipoTrabalho: string
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
  // Status do trabalho
  status: 'novo' | 'iniciado' | 'em_andamento' | 'concluido'
  // Novos campos para formatação ABNT
  nomeAluno?: string
  tema?: string
  instituicao?: string
  orientador?: string
  coorientador?: string
  palavrasChave?: string
  resumo?: string
}

export interface NoteItem {
  text: string
  createdAt: string
}

export interface NotesData {
  [workId: string]: NoteItem[]
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
