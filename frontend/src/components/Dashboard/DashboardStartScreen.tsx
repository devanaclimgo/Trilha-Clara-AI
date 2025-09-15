'use client'

import { useEffect, useState } from 'react'
import { Clock, Download, FileText, BookOpen, Edit3 } from 'lucide-react'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import WorkCards from './WorkCards'
import QuickAccessCards from './QuickAccessCards'
import RecentActivity from './RecentActivity'
import OverviewCards from './OverviewCards'
import TccDataCard from './TccDataCard'
import ContentPage from './ContentPage'
import NewProjectModal from './NewProjectModal'
import EditWorkModal from './EditWorkModal'
import DeleteWorkModal from './DeleteWorkModal'
import TimelineScreen from './DashboardTimelineScreen'
import NotesScreen from './DashboardNoteScreen'
import ExplicacaoSimplificada from './DashboardExplicacaoSimplidicada'
import Estruturasugerida from './DashboardEstruturaSugerida'
import DashboardProfileScreen from './DashboardProfileScreen'
import DashboardSupportScreen from './DashboardSupportScreen'
import InfoButton from '../InfoButton'
import { useTccData } from '@/hooks/useTccData'
import { useAuth } from '@/hooks/useAuth'
import { TccData } from '@/types/tcc'

export default function DashboardStartScreen() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<
    | 'main'
    | 'notes'
    | 'explanation'
    | 'structure'
    | 'timeline'
    | 'settings'
    | 'profile'
    | 'support'
  >('main')
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [showEditWorkModal, setShowEditWorkModal] = useState(false)
  const [showDeleteWorkModal, setShowDeleteWorkModal] = useState(false)
  const [selectedWork, setSelectedWork] = useState<TccData | null>(null)
  const [showAllNotes, setShowAllNotes] = useState(false)
  const [loadingStates, setLoadingStates] = useState({
    explanation: { isLoading: false, isCompleted: false },
    structure: { isLoading: false, isCompleted: false },
    timeline: { isLoading: false, isCompleted: false },
  })

  const { logout } = useAuth()
  const {
    trabalhos,
    trabalhoAtual,
    tccData,
    hasCompletedInitialData,
    setTccData,
    salvarTrabalho,
    criarNovoTrabalho,
    trocarTrabalho,
    saveNote,
    removeNote,
    getCurrentWorkNotes,
    getCurrentWorkNotesWithDates,
    getAllNotesWithDates,
    deletarTrabalho,
    carregarDadosDaAPI,
  } = useTccData()

  // Função para trocar trabalho e voltar para main
  const handleTrocarTrabalho = (trabalhoId: string) => {
    trocarTrabalho(trabalhoId)
    setCurrentStep(1)
    setCurrentScreen('main')
  }

  const steps = [
    { id: 1, title: 'Inserir Dados', icon: FileText },
    { id: 2, title: 'Explicação', icon: BookOpen },
    { id: 3, title: 'Estrutura', icon: Edit3 },
    { id: 4, title: 'Cronograma', icon: Clock },
    { id: 5, title: 'Exportar', icon: Download },
  ]

  const getProgressPercentage = () => {
    return Math.round((currentStep / steps.length) * 100)
  }

  const handleCriarNovoTrabalho = (titulo: string, curso: string) => {
    criarNovoTrabalho(titulo, curso, '')
    setShowNewProjectForm(false)
  }

  const handleEditWork = (work: TccData) => {
    setSelectedWork(work)
    setShowEditWorkModal(true)
  }

  const handleDeleteWork = (work: TccData) => {
    setSelectedWork(work)
    setShowDeleteWorkModal(true)
  }

  const handleSaveEditWork = (
    workId: string,
    updatedWork: Partial<TccData>,
  ) => {
    const workIndex = trabalhos.findIndex((w) => w.id === workId)
    if (workIndex !== -1) {
      const updatedTrabalhos = [...trabalhos]
      updatedTrabalhos[workIndex] = {
        ...updatedTrabalhos[workIndex],
        ...updatedWork,
      }
      localStorage.setItem('tcc-trabalhos', JSON.stringify(updatedTrabalhos))

      // Se é o trabalho atual, atualiza o tccData
      if (trabalhoAtual === workId) {
        setTccData(updatedTrabalhos[workIndex])
      }
    }
  }

  const handleConfirmDeleteWork = (workId: string) => {
    deletarTrabalho(workId)
  }

  const handleLogout = () => {
    logout()
  }

  const handleShowAllNotes = () => {
    setShowAllNotes(true)
    setCurrentScreen('notes')
  }

  const handleStartWork = async (
    workId: string,
    data: {
      titulo: string
      tema: string
      tipoTrabalho: string
      curso: string
      semanas: number
      nomeAluno: string
      instituicao: string
      orientador: string
    },
  ) => {
    // Trocar para o trabalho selecionado
    trocarTrabalho(workId)

    // Atualizar dados do trabalho com status "iniciado"
    const updatedData = {
      ...tccData,
      tema: data.tema,
      tipoTrabalho: data.tipoTrabalho,
      curso: data.curso,
      progresso: 5,
      status: 'iniciado' as const,
      ultimaModificacao: new Date().toISOString(),
      nomeAluno: data.nomeAluno,
      instituicao: data.instituicao,
      orientador: data.orientador,
    }
    setTccData(updatedData)
    salvarTrabalho(updatedData)

    // Iniciar loading states
    setLoadingStates({
      explanation: { isLoading: true, isCompleted: false },
      structure: { isLoading: true, isCompleted: false },
      timeline: { isLoading: true, isCompleted: false },
    })

    // Chamar API real para gerar conteúdo pela IA
    try {
      // Chamar API do backend para gerar explicação, estrutura e cronograma
      const response = await fetch('http://localhost:4000/api/tcc/criar.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          nome: data.nomeAluno,
          faculdade: data.instituicao,
          curso: data.curso,
          materia: data.curso,
          tema: data.tema,
          tipo_trabalho: data.tipoTrabalho,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar conteúdo')
      }

      const apiData = await response.json()

      // Atualizar com dados da API
      const dataWithApiContent = {
        ...updatedData,
        explicacao: apiData.explicacao || [],
        sugestoes: apiData.sugestoes || [],
        dica: apiData.dica || '',
        estrutura: apiData.estrutura || [],
        cronograma: apiData.cronograma || [],
        progresso: 100,
        status: 'em_andamento' as const,
      }
      setTccData(dataWithApiContent)
      salvarTrabalho(dataWithApiContent)

      setLoadingStates({
        explanation: { isLoading: false, isCompleted: true },
        structure: { isLoading: false, isCompleted: true },
        timeline: { isLoading: false, isCompleted: true },
      })
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error)
      setLoadingStates({
        explanation: { isLoading: false, isCompleted: false },
        structure: { isLoading: false, isCompleted: false },
        timeline: { isLoading: false, isCompleted: false },
      })
    }
  }

  const handleContinueWork = (workId: string) => {
    // Trocar para o trabalho selecionado
    trocarTrabalho(workId)
    setCurrentScreen('explanation')
  }

  // Carregar dados da API quando necessário
  useEffect(() => {
    const loadDataFromAPI = async () => {
      if (trabalhoAtual && trabalhoAtual.startsWith('tcc_')) {
        const apiData = await carregarDadosDaAPI(trabalhoAtual)
        if (apiData) {
          setTccData(apiData)
          salvarTrabalho(apiData)
        }
      }
    }

    loadDataFromAPI()
  }, [trabalhoAtual, carregarDadosDaAPI, setTccData, salvarTrabalho])

  return (
    <div className="min-h-screen flex gradient-trilha-soft">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentScreen={currentScreen}
        setCurrentScreen={(screen: string) =>
          setCurrentScreen(
            screen as
              | 'main'
              | 'notes'
              | 'explanation'
              | 'structure'
              | 'timeline'
              | 'settings'
              | 'profile'
              | 'support',
          )
        }
        currentStep={currentStep}
        steps={steps}
        getCurrentWorkNotes={getCurrentWorkNotes}
        getCurrentWorkNotesWithDates={getCurrentWorkNotesWithDates}
        getProgressPercentage={getProgressPercentage}
        onShowAllNotes={handleShowAllNotes}
        onLogout={handleLogout}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1">
        <DashboardHeader
          setSidebarOpen={setSidebarOpen}
          currentScreen={currentScreen}
        />
        <div className="container mx-auto px-4 py-8">
          {currentScreen === 'main' && (
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Welcome Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold gradient-text mb-4">
                  {hasCompletedInitialData
                    ? 'Bem-vindo de volta! 👋'
                    : 'Bem-vindo! Vamos começar seu trabalho 🚀'}
                </h1>
                <p className="text-lg text-gray-600">
                  {hasCompletedInitialData
                    ? 'Continue de onde parou no seu trabalho acadêmico'
                    : 'Crie seu primeiro trabalho acadêmico para começar'}
                </p>
              </div>

              {/* Work Cards */}
              <WorkCards
                trabalhos={trabalhos}
                trabalhoAtual={trabalhoAtual || undefined}
                trocarTrabalho={handleTrocarTrabalho}
                onCriarNovo={() => setShowNewProjectForm(true)}
                setShowNewProjectForm={setShowNewProjectForm}
                setShowStepByStep={() => {}}
                onEditWork={handleEditWork}
                onDeleteWork={handleDeleteWork}
                onContinueWork={handleContinueWork}
                onStartWork={handleStartWork}
              />

              {/* Overview Cards - sempre visíveis */}
              <OverviewCards
                onViewExplanation={() => setCurrentScreen('explanation')}
                onViewStructure={() => setCurrentScreen('structure')}
                onViewTimeline={() => setCurrentScreen('timeline')}
                hasData={!!trabalhoAtual}
                workData={
                  tccData
                    ? {
                        titulo: tccData.titulo,
                        curso: tccData.curso,
                        tipoTrabalho: tccData.tipoTrabalho,
                        tema: tccData.tema,
                        status: tccData.status,
                      }
                    : undefined
                }
                loadingStates={loadingStates}
              />

              {/* TCC Data Card - sempre visível */}
              <TccDataCard
                tccData={tccData}
                onSaveData={(data) => {
                  const updatedData = { ...tccData, ...data }
                  setTccData(updatedData)
                  salvarTrabalho(updatedData)
                }}
                hasData={!!trabalhoAtual}
              />

              {/* Quick Access Cards - só aparece se tem trabalho */}
              {trabalhoAtual && (
                <QuickAccessCards
                  getCurrentWorkNotes={getCurrentWorkNotes}
                  getCurrentWorkNotesWithDates={getCurrentWorkNotesWithDates}
                  setCurrentScreen={(screen: string) =>
                    setCurrentScreen(
                      screen as
                        | 'main'
                        | 'notes'
                        | 'explanation'
                        | 'structure'
                        | 'timeline'
                        | 'settings'
                        | 'profile'
                        | 'support',
                    )
                  }
                />
              )}

              {/* Recent Activity - sempre visível */}
              <RecentActivity
                getCurrentWorkNotes={getCurrentWorkNotes}
                getCurrentWorkNotesWithDates={getCurrentWorkNotesWithDates}
              />
            </div>
          )}
          {currentScreen === 'notes' && (
            <NotesScreen
              savedNotes={getCurrentWorkNotes()}
              savedNotesWithDates={getCurrentWorkNotesWithDates()}
              onRemoveNote={removeNote}
              onAddNote={saveNote}
              onBackToHome={
                hasCompletedInitialData
                  ? () => {
                      setCurrentScreen('main')
                      setShowAllNotes(false)
                    }
                  : undefined
              }
              trabalhoAtual={tccData.id ? tccData : undefined}
              showAllNotes={showAllNotes}
              allNotes={getAllNotesWithDates()}
            />
          )}
          {currentScreen === 'explanation' && (
            <ContentPage
              title="Explicação Simplificada"
              description="Entenda o que o professor pediu de forma clara"
              hasCompletedInitialData={hasCompletedInitialData}
              onBackToHome={() => setCurrentScreen('main')}
            >
              <ExplicacaoSimplificada
                explicacao={tccData.explicacao || []}
                sugestoes={tccData.sugestoes || []}
                dica={tccData.dica || ''}
                onSaveNote={saveNote}
              />
            </ContentPage>
          )}
          {currentScreen === 'structure' && (
            <ContentPage
              title="Estrutura Sugerida"
              description="Organize seu TCC com a estrutura recomendada"
              hasCompletedInitialData={hasCompletedInitialData}
              onBackToHome={() => setCurrentScreen('main')}
            >
              <Estruturasugerida estrutura={tccData.estrutura || []} />
            </ContentPage>
          )}
          {currentScreen === 'timeline' && (
            <TimelineScreen
              cronograma={tccData?.cronograma || []}
              loadingStates={loadingStates}
              onBackToHome={
                hasCompletedInitialData
                  ? () => setCurrentScreen('main')
                  : undefined
              }
            />
          )}
          {currentScreen === 'settings' && (
            <ContentPage
              title="Configurações"
              description="Configurações do sistema"
              hasCompletedInitialData={hasCompletedInitialData}
              onBackToHome={() => setCurrentScreen('main')}
            >
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/20">
                <p className="text-gray-600">
                  Configurações do sistema em desenvolvimento...
                </p>
              </div>
            </ContentPage>
          )}
          {currentScreen === 'profile' && (
            <DashboardProfileScreen
              onBackToHome={() => setCurrentScreen('main')}
            />
          )}
          {currentScreen === 'support' && (
            <DashboardSupportScreen
              onBackToHome={() => setCurrentScreen('main')}
            />
          )}

          {/* Modal para Novo Trabalho */}
          <NewProjectModal
            show={showNewProjectForm}
            onClose={() => setShowNewProjectForm(false)}
            onCreateProject={handleCriarNovoTrabalho}
          />

          {/* Modal para Editar Trabalho */}
          <EditWorkModal
            show={showEditWorkModal}
            onClose={() => {
              setShowEditWorkModal(false)
              setSelectedWork(null)
            }}
            onSave={handleSaveEditWork}
            work={selectedWork}
          />

          {/* Modal para Deletar Trabalho */}
          <DeleteWorkModal
            show={showDeleteWorkModal}
            onClose={() => {
              setShowDeleteWorkModal(false)
              setSelectedWork(null)
            }}
            onConfirm={handleConfirmDeleteWork}
            work={selectedWork}
          />

          {/* Botão de informações */}
          <InfoButton />
        </div>
      </div>
    </div>
  )
}
