'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Clock,
  BookOpen,
  Edit3,
  Menu,
} from 'lucide-react'
import { TccData } from '@/types/tcc'
import WorkEditBasicInfo from '@/components/Dashboard/WorkEditBasicInfo'
import WorkEditContent from '@/components/Dashboard/WorkEditContent'
import WorkEditPreview from '@/components/Dashboard/WorkEditPreview'
import AbntPreviewModal from '@/components/Dashboard/AbntPreviewModal'
import WorkEditSidebar from '@/components/Dashboard/WorkEditSidebar'
import WorkEditDialogs from '@/components/Dashboard/WorkEditDialogs'
import { useTccData } from '@/hooks/useTccData'
import { useAuth } from '@/hooks/useAuth'

// Define interfaces for proper typing
interface WorkContent {
  resumo: string
  introducao: string
  desenvolvimento: string
  conclusao: string
  referencias: string
  metodologia?: string
  objetivos?: string
  justificativa?: string
  [key: string]: string | undefined // Para campos dinâmicos da estrutura
}

interface ContentField {
  key: string
  label: string
  description: string
  placeholder: string
  icon: React.ComponentType<{ className?: string }>
  required: boolean
  id: string
  isCustom?: boolean
}

export default function WorkEditPage() {
  const params = useParams()
  const router = useRouter()
  const workId = params.id as string

  const [workData, setWorkData] = useState<TccData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('basic')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [abntPreviewOpen, setAbntPreviewOpen] = useState(false)
  const [activeDialog, setActiveDialog] = useState<string | null>(null)

  // Shared content state
  const [sharedContent, setSharedContent] = useState<WorkContent>({
    resumo: '',
    introducao: '',
    desenvolvimento: '',
    conclusao: '',
    referencias: '',
    metodologia: '',
    objetivos: '',
    justificativa: '',
  })
  const [sharedCustomFields, setSharedCustomFields] = useState<ContentField[]>(
    [],
  )
  const [sharedFieldLabels, setSharedFieldLabels] = useState<
    Record<string, string>
  >({})
  const [sharedFieldOrder, setSharedFieldOrder] = useState<string[]>([])

  // Handler for content changes from WorkEditContent
  const handleContentChange = (
    content: WorkContent,
    customFields: ContentField[],
    fieldLabels: Record<string, string>,
    fieldOrder: string[],
  ) => {
    setSharedContent(content)
    setSharedCustomFields(customFields)
    setSharedFieldLabels(fieldLabels)
    setSharedFieldOrder(fieldOrder)
  }

  const { logout } = useAuth()
  const {
    tccData,
    getCurrentWorkNotes,
    getCurrentWorkNotesWithDates,
    carregarDadosDaAPI,
    saveNote,
    removeNote,
    atualizarTrabalho,
  } = useTccData()

  // Function to open dialogs
  const handleOpenDialog = (dialogType: string) => {
    setActiveDialog(dialogType)
  }

  // Function to handle cronograma updates
  const handleCronogramaUpdate = (updatedCronograma: any[]) => {
    if (workData) {
      const updatedWorkData = { ...workData, cronograma: updatedCronograma }
      setWorkData(updatedWorkData)
      atualizarTrabalho(updatedWorkData)
    }
  }

  const steps = [
    { id: 1, title: 'Inserir Dados', icon: FileText },
    { id: 2, title: 'Explicação', icon: BookOpen },
    { id: 3, title: 'Estrutura', icon: Edit3 },
    { id: 4, title: 'Cronograma', icon: Clock },
    { id: 5, title: 'Exportar', icon: Download },
  ]

  const getProgressPercentage = () => {
    if (workData) {
      // Use cronograma-based progress if available
      const { calculateWorkProgress } = require('@/lib/cronogramaUtils')
      return calculateWorkProgress(workData)
    }
    return Math.round((2 / steps.length) * 100) // Fallback to step-based progress
  }

  useEffect(() => {
    // Buscar dados do trabalho
    const fetchWorkData = async () => {
      try {
        // Primeiro tenta carregar do hook (dados locais)
        if (tccData && tccData.id === workId) {
          setWorkData(tccData)
          setLoading(false)
          return
        }

        // Se não encontrar localmente, busca na API
        const apiData = await carregarDadosDaAPI(workId)
        if (apiData) {
          setWorkData(apiData)
          setLoading(false)
          return
        }

        // Fallback para dados mock em caso de erro
        const mockData: TccData = {
          id: workId,
          titulo: 'TCC sobre Inteligência Artificial',
          tema: 'Aplicação de Inteligência Artificial na Educação: Desafios e Oportunidades',
          tipoTrabalho: 'tcc',
          curso: 'desenvolvimento-de-sistemas',
          nomeAluno: 'João Silva',
          instituicao: 'Universidade Federal',
          orientador: 'Dr. Maria Santos',
          status: 'em_andamento',
          progresso: 45,
          dataCriacao: new Date().toISOString(),
          explicacao: [],
          estrutura: [],
          cronograma: [],
          sugestoes: [],
          dica: '',
          ultimaModificacao: new Date().toISOString(),
        }
        setWorkData(mockData)
      } catch (error) {
        console.error('Erro ao buscar dados do trabalho:', error)
        // Fallback para dados mock em caso de erro
        const mockData: TccData = {
          id: workId,
          titulo: 'TCC sobre Inteligência Artificial',
          tema: 'Aplicação de Inteligência Artificial na Educação: Desafios e Oportunidades',
          tipoTrabalho: 'tcc',
          curso: 'desenvolvimento-de-sistemas',
          nomeAluno: 'João Silva',
          instituicao: 'Universidade Federal',
          orientador: 'Dr. Maria Santos',
          status: 'em_andamento',
          progresso: 45,
          dataCriacao: new Date().toISOString(),
          explicacao: [],
          estrutura: [],
          cronograma: [],
          sugestoes: [],
          dica: '',
          ultimaModificacao: new Date().toISOString(),
        }
        setWorkData(mockData)
      } finally {
        setLoading(false)
      }
    }

    if (workId) {
      fetchWorkData()
    }
  }, [workId, tccData, carregarDadosDaAPI])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do trabalho...</p>
        </div>
      </div>
    )
  }

  if (!workData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Trabalho não encontrado
          </h1>
          <Button
            onClick={() => router.push('/dashboard')}
            className="gradient-bg text-white hover:scale-105 transition-all duration-300"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex gradient-trilha-soft">
      <WorkEditSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentStep={2}
        steps={steps}
        getCurrentWorkNotes={getCurrentWorkNotes}
        getCurrentWorkNotesWithDates={getCurrentWorkNotesWithDates}
        getProgressPercentage={getProgressPercentage}
        onLogout={logout}
        onOpenDialog={handleOpenDialog}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`border transition-all duration-300 ${
                    sidebarOpen
                      ? 'bg-purple-50 border-purple-200 text-purple-600'
                      : 'hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600 hover:scale-105'
                  }`}
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Menu
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                  className="hover:bg-purple-50 border border-purple-200 hover:border-purple-300 hover:text-purple-600 hover:scale-105 transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    {workData.titulo}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Editando trabalho acadêmico
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAbntPreviewOpen(true)}
                  className="hover:bg-purple-50 hover:text-purple-600 border border-purple-200 hover:border-purple-300 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview do Trabalho
                </Button>
                <Button className="gradient-bg text-white hover:scale-105 transition-all duration-300">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 backdrop-blur-sm">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                Dados Básicos
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                Conteúdo
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-600" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <WorkEditBasicInfo workData={workData} />
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <WorkEditContent
                workData={workData}
                onContentChange={handleContentChange}
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <WorkEditPreview
                workData={workData}
                onEditClick={() => setActiveTab('content')}
                content={{
                  resumo: sharedContent.resumo,
                  introducao: sharedContent.introducao,
                  objetivos: sharedContent.objetivos || '',
                  metodologia: sharedContent.metodologia || '',
                  desenvolvimento: sharedContent.desenvolvimento,
                  conclusao: sharedContent.conclusao,
                  referencias: sharedContent.referencias,
                  justificativa: sharedContent.justificativa || '',
                }}
                customFields={sharedCustomFields}
                fieldLabels={sharedFieldLabels}
                fieldOrder={sharedFieldOrder}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Modal de Preview ABNT */}
        {workData && (
          <AbntPreviewModal
            isOpen={abntPreviewOpen}
            onClose={() => setAbntPreviewOpen(false)}
            workData={workData}
            content={{
              resumo: sharedContent.resumo,
              introducao: sharedContent.introducao,
              objetivos: sharedContent.objetivos || '',
              metodologia: sharedContent.metodologia || '',
              desenvolvimento: sharedContent.desenvolvimento,
              conclusao: sharedContent.conclusao,
              referencias: sharedContent.referencias,
              justificativa: sharedContent.justificativa || '',
            }}
            customFields={sharedCustomFields}
            fieldLabels={sharedFieldLabels}
            fieldOrder={sharedFieldOrder}
          />
        )}

        {/* Work Edit Dialogs */}
        {workData && (
          <WorkEditDialogs
            workData={workData}
            getCurrentWorkNotes={getCurrentWorkNotes}
            getCurrentWorkNotesWithDates={getCurrentWorkNotesWithDates}
            saveNote={saveNote}
            removeNote={removeNote}
            activeDialog={activeDialog}
            onCloseDialog={() => setActiveDialog(null)}
            onCronogramaUpdate={handleCronogramaUpdate}
          />
        )}
      </div>
    </div>
  )
}
