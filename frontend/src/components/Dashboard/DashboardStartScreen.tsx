'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Clock,
  Download,
  FileText,
  BookOpen,
  Edit3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import WorkCards from './WorkCards'
import QuickAccessCards from './QuickAccessCards'
import ProgressOverview from './ProgressOverview'
import RecentActivity from './RecentActivity'
import StepProgress from './StepProgress'
import ContentPage from './ContentPage'
import NewProjectModal from './NewProjectModal'
import EditWorkModal from './EditWorkModal'
import DeleteWorkModal from './DeleteWorkModal'
import TimelineScreen from './DashboardTimelineScreen'
import NotesScreen from './DashboardNoteScreen'
import InserirDados from './DashboardInserirDados'
import ExplicacaoSimplificada from './DashboardExplicacaoSimplidicada'
import Estruturasugerida from './DashboardEstruturaSugerida'
import Cronograma from './DashboardCronograma'
import ExportacaoABNT from './DashboardExportacaoABNT'
import InfoButton from '../InfoButton'
import { useTccData } from '@/hooks/useTccData'
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
  const [showStepByStep, setShowStepByStep] = useState(false)
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [showEditWorkModal, setShowEditWorkModal] = useState(false)
  const [showDeleteWorkModal, setShowDeleteWorkModal] = useState(false)
  const [selectedWork, setSelectedWork] = useState<TccData | null>(null)
  const [showAllNotes, setShowAllNotes] = useState(false)

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
    getAllNotes,
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
    setCurrentStep(1)
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
    // Redirecionar para login
    window.location.href = '/login'
  }

  const handleShowAllNotes = () => {
    setShowAllNotes(true)
    setCurrentScreen('notes')
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
          {currentScreen === 'main' &&
            hasCompletedInitialData &&
            !showStepByStep && (
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold gradient-text mb-4">
                    Bem-vindo de volta! 👋
                  </h1>
                  <p className="text-lg text-gray-600">
                    Continue de onde parou no seu TCC
                  </p>
                </div>

                {/* Progress Overview */}
                <ProgressOverview
                  currentStep={currentStep}
                  steps={steps}
                  getProgressPercentage={getProgressPercentage}
                />

                {/* Work Cards */}
                <WorkCards
                  trabalhos={trabalhos}
                  trabalhoAtual={trabalhoAtual}
                  trocarTrabalho={handleTrocarTrabalho}
                  setShowNewProjectForm={setShowNewProjectForm}
                  setShowStepByStep={setShowStepByStep}
                  currentStep={currentStep}
                  steps={steps}
                  onEditWork={handleEditWork}
                  onDeleteWork={handleDeleteWork}
                />

                {/* Quick Access Cards */}
                {trabalhoAtual && (
                  <QuickAccessCards
                    getCurrentWorkNotes={getCurrentWorkNotes}
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

                {/* Recent Activity */}
                <RecentActivity getCurrentWorkNotes={getCurrentWorkNotes} />
              </div>
            )}
          {currentScreen === 'main' &&
            (!hasCompletedInitialData || showStepByStep) && (
              <>
                {hasCompletedInitialData && showStepByStep && (
                  <div className="flex items-center justify-between mb-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowStepByStep(false)}
                      className="rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600 flex items-center gap-2 px-4 py-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Voltar ao início
                      </span>
                    </Button>
                  </div>
                )}
                <StepProgress currentStep={currentStep} steps={steps} />
                <div className="max-w-4xl mx-auto">
                  {currentStep === 1 && (
                    <InserirDados
                      onNext={() => setCurrentStep(2)}
                      onSaveData={(data: TccData, explicacaoGerada: string) => {
                        const trabalhoAtualizado = {
                          ...tccData,
                          curso: data.curso,
                          subtitulo: data.subtitulo,
                          explicacao: explicacaoGerada,
                          sugestoes: data.sugestoes,
                          dica: data.dica,
                          estrutura: data.estrutura,
                          cronograma: data.cronograma,
                          progresso: 20, // 20% após inserir dados
                          ultimaModificacao: new Date().toISOString(),
                        }
                        setTccData(trabalhoAtualizado)
                        salvarTrabalho(trabalhoAtualizado)
                      }}
                    />
                  )}
                  {currentStep === 2 && (
                    <ExplicacaoSimplificada
                      explicacao={tccData.explicacao || []}
                      sugestoes={tccData.sugestoes || []}
                      dica={tccData.dica || ''}
                      onNext={() => {
                        setCurrentStep(3)
                        atualizarProgresso(40) // 40% após explicação
                      }}
                      onSaveNote={saveNote}
                    />
                  )}

                  {currentStep === 3 && (
                    <Estruturasugerida
                      estrutura={tccData.estrutura || []}
                      onNext={() => {
                        setCurrentStep(4)
                        atualizarProgresso(60) // 60% após estrutura
                      }}
                    />
                  )}
                  {currentStep === 4 && (
                    <Cronograma
                      atividades={tccData.cronograma || []}
                      onNext={() => {
                        setCurrentStep(5)
                        atualizarProgresso(80) // 80% após cronograma
                      }}
                    />
                  )}
                  {currentStep === 5 && <ExportacaoABNT />}
                </div>
              </>
            )}
          {currentScreen === 'notes' && (
            <NotesScreen
              savedNotes={getCurrentWorkNotes()}
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
              allNotes={getAllNotes()}
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
            <ContentPage
              title="Perfil do Usuário"
              description="Seu perfil de usuário"
              hasCompletedInitialData={hasCompletedInitialData}
              onBackToHome={() => setCurrentScreen('main')}
            >
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/20">
                <p className="text-gray-600">
                  Informações do perfil em desenvolvimento...
                </p>
              </div>
            </ContentPage>
          )}
          {currentScreen === 'support' && (
            <ContentPage
              title="Suporte"
              description="Central de suporte"
              hasCompletedInitialData={hasCompletedInitialData}
              onBackToHome={() => setCurrentScreen('main')}
            >
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/20">
                <p className="text-gray-600">
                  Central de suporte em desenvolvimento...
                </p>
              </div>
            </ContentPage>
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
