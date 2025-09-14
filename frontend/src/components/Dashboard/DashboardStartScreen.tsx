'use client'

import { useState } from 'react'
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
    atualizarProgresso,
    saveNote,
    removeNote,
    getCurrentWorkNotes,
    getCurrentWorkNotesWithDates,
    getAllNotesWithDates,
    deletarTrabalho,
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

  const handleCriarNovoTrabalho = (
    titulo: string,
    curso: string,
    enunciado: string,
  ) => {
    criarNovoTrabalho(titulo, curso, enunciado)
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

  const handleContinueWork = async (
    workId: string,
    data: {
      tema: string
      tipoTrabalho: string
      curso: string
      semanas: number
      enunciado: string
    },
  ) => {
    // Trocar para o trabalho selecionado
    trocarTrabalho(workId)

    // Atualizar dados do trabalho
    const updatedData = {
      ...tccData,
      tema: data.tema,
      tipoTrabalho: data.tipoTrabalho,
      curso: data.curso,
      subtitulo: data.enunciado,
      progresso: 10,
      ultimaModificacao: new Date().toISOString(),
    }
    setTccData(updatedData)
    salvarTrabalho(updatedData)

    // Iniciar loading states
    setLoadingStates({
      explanation: { isLoading: true, isCompleted: false },
      structure: { isLoading: true, isCompleted: false },
      timeline: { isLoading: true, isCompleted: false },
    })

    // Simular geração de conteúdo pela IA
    try {
      // Simular delay para geração da explicação
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular geração da explicação
      const explicacaoGerada = [
        `Com base no tema "${data.tema}", este trabalho tem como objetivo principal analisar e compreender os aspectos fundamentais da questão proposta.`,
        `A metodologia sugerida envolve pesquisa bibliográfica, análise de dados e elaboração de conclusões baseadas em evidências científicas.`,
        `O prazo de ${data.semanas} semanas permite um desenvolvimento adequado do trabalho, com fases bem definidas para cada etapa.`,
      ]

      const sugestoes = [
        `Foque na relevância do tema para o curso de ${data.curso}`,
        `Considere as diretrizes específicas para ${data.tipoTrabalho}`,
        `Mantenha um cronograma realista considerando o prazo de ${data.semanas} semanas`,
      ]

      const dica = `Para um ${data.tipoTrabalho} em ${data.curso}, é importante seguir as normas ABNT e manter consistência metodológica.`

      // Atualizar com explicação
      const dataWithExplanation = {
        ...updatedData,
        explicacao: explicacaoGerada,
        sugestoes: sugestoes,
        dica: dica,
        progresso: 30,
      }
      setTccData(dataWithExplanation)
      salvarTrabalho(dataWithExplanation)

      setLoadingStates((prev) => ({
        ...prev,
        explanation: { isLoading: false, isCompleted: true },
      }))

      // Simular delay para geração da estrutura
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simular geração da estrutura
      const estruturaGerada = [
        'Introdução - Apresentação do tema, justificativa e objetivos (2 semanas)',
        'Revisão de Literatura - Fundamentação teórica e estado da arte (3 semanas)',
        'Metodologia - Descrição dos métodos e procedimentos utilizados (2 semanas)',
        'Desenvolvimento - Análise e discussão dos resultados (4 semanas)',
        'Conclusão - Síntese dos resultados e considerações finais (1 semana)',
      ]

      const dataWithStructure = {
        ...dataWithExplanation,
        estrutura: estruturaGerada,
        progresso: 60,
      }
      setTccData(dataWithStructure)
      salvarTrabalho(dataWithStructure)

      setLoadingStates((prev) => ({
        ...prev,
        structure: { isLoading: false, isCompleted: true },
      }))

      // Simular delay para geração do cronograma
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simular geração do cronograma
      const cronogramaGerado = [
        {
          atividade: 'Pesquisa bibliográfica',
          prazo: 'Semana 1-2',
          status: 'pendente',
        },
        {
          atividade: 'Elaboração da introdução',
          prazo: 'Semana 3-4',
          status: 'pendente',
        },
        {
          atividade: 'Revisão de literatura',
          prazo: 'Semana 5-7',
          status: 'pendente',
        },
        {
          atividade: 'Desenvolvimento metodológico',
          prazo: 'Semana 8-9',
          status: 'pendente',
        },
        {
          atividade: 'Análise e discussão',
          prazo: 'Semana 10-11',
          status: 'pendente',
        },
        {
          atividade: 'Conclusão e revisão final',
          prazo: 'Semana 12',
          status: 'pendente',
        },
      ]

      const dataWithTimeline = {
        ...dataWithStructure,
        cronograma: cronogramaGerado,
        progresso: 80,
      }
      setTccData(dataWithTimeline)
      salvarTrabalho(dataWithTimeline)

      setLoadingStates((prev) => ({
        ...prev,
        timeline: { isLoading: false, isCompleted: true },
      }))
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error)
      // Reset loading states em caso de erro
      setLoadingStates({
        explanation: { isLoading: false, isCompleted: false },
        structure: { isLoading: false, isCompleted: false },
        timeline: { isLoading: false, isCompleted: false },
      })
    }
  }

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
                trabalhoAtual={trabalhoAtual}
                trocarTrabalho={handleTrocarTrabalho}
                setShowNewProjectForm={setShowNewProjectForm}
                setShowStepByStep={() => {}}
                onEditWork={handleEditWork}
                onDeleteWork={handleDeleteWork}
                onContinueWork={handleContinueWork}
              />

              {/* Overview Cards - sempre visíveis */}
              <OverviewCards
                onViewExplanation={() => setCurrentScreen('explanation')}
                onViewStructure={() => setCurrentScreen('structure')}
                onViewTimeline={() => setCurrentScreen('timeline')}
                hasData={!!trabalhoAtual}
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
                onNext={() => {
                  setCurrentScreen('structure')
                  atualizarProgresso(40)
                }}
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
              <Estruturasugerida
                estrutura={tccData.estrutura || []}
                onNext={() => {
                  setCurrentScreen('timeline')
                  atualizarProgresso(60)
                }}
              />
            </ContentPage>
          )}
          {currentScreen === 'timeline' && (
            <TimelineScreen
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
