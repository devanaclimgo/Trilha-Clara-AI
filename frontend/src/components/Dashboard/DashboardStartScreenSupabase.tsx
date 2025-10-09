'use client'

import { useEffect, useState } from 'react'
import { Clock, Download, FileText, BookOpen, Edit3 } from 'lucide-react'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import WorkCards from './WorkCards'
import QuickAccessCards from './QuickAccessCards'
import RecentActivity from './RecentActivity'
import OverviewCards from './OverviewCards'
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
import { useSupabaseTccData } from '@/hooks/useSupabaseTccData'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { TccData } from '@/types/tcc'

export default function DashboardStartScreenSupabase() {
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

  // Use Supabase hooks instead of localStorage hooks
  const { logout } = useSupabaseAuth()
  const {
    trabalhos,
    trabalhoAtual,
    tccData,
    savedNotes,
    hasCompletedInitialData,
    isLoading: dataLoading,
    currentUser,
    salvarTrabalho,
    criarNovoTrabalho,
    trocarTrabalho,
    atualizarProgresso,
    atualizarTrabalho,
    saveNote,
    removeNote,
    getCurrentWorkNotes,
    getCurrentWorkNotesWithDates,
    getAllNotesWithDates,
    deleteTrabalho,
  } = useSupabaseTccData()

  // Handle status changes from WorkEditBasicInfo
  const handleStatusChange = async (newStatus: TccData['status']) => {
    if (!tccData.id) return

    try {
      const updatedTrabalho = {
        ...tccData,
        status: newStatus,
        ultimaModificacao: new Date().toISOString(),
      }

      await atualizarTrabalho(updatedTrabalho)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Rest of the component logic remains the same...
  // The main difference is that all data operations now go through Supabase
  // instead of localStorage

  const handleStartWork = async (workId: string) => {
    try {
      await trocarTrabalho(workId)
      setCurrentStep(2)
    } catch (error) {
      console.error('Error starting work:', error)
    }
  }

  const handleContinueWork = async (workId: string) => {
    try {
      await trocarTrabalho(workId)
      setCurrentStep(2)
    } catch (error) {
      console.error('Error continuing work:', error)
    }
  }

  const handleCreateNewWork = async (data: {
    titulo: string
    curso: string
    tema: string
    tipoTrabalho: string
    nomeAluno: string
    instituicao: string
    orientador: string
  }) => {
    try {
      await criarNovoTrabalho(data.titulo, data.curso, data.tema)

      // Update the work with additional data
      if (trabalhoAtual) {
        const updatedWork = {
          ...tccData,
          tipoTrabalho: data.tipoTrabalho,
          nomeAluno: data.nomeAluno,
          instituicao: data.instituicao,
          orientador: data.orientador,
          progresso: 5,
          status: 'pesquisando' as const,
          ultimaModificacao: new Date().toISOString(),
        }

        await atualizarTrabalho(updatedWork)
      }

      setShowNewProjectForm(false)
      setCurrentStep(2)
    } catch (error) {
      console.error('Error creating new work:', error)
    }
  }

  const handleEditWork = async (workId: string, updates: Partial<TccData>) => {
    try {
      const updatedWork = { ...tccData, ...updates }
      await atualizarTrabalho(updatedWork)
      setShowEditWorkModal(false)
    } catch (error) {
      console.error('Error editing work:', error)
    }
  }

  const handleDeleteWork = async (workId: string) => {
    try {
      await deleteTrabalho(workId)
      setShowDeleteWorkModal(false)

      // If we deleted the current work, go back to main screen
      if (trabalhoAtual === workId) {
        setCurrentStep(1)
        setCurrentScreen('main')
      }
    } catch (error) {
      console.error('Error deleting work:', error)
    }
  }

  const handleSaveNote = async (note: string) => {
    try {
      await saveNote(note)
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const handleRemoveNote = async (index: number) => {
    try {
      await removeNote(index)
    } catch (error) {
      console.error('Error removing note:', error)
    }
  }

  // Show loading state while data is being fetched
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus trabalhos...</p>
        </div>
      </div>
    )
  }

  // Show authentication required if no user
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Acesso Necessário
          </h2>
          <p className="text-gray-600 mb-6">
            Faça login para acessar seus trabalhos.
          </p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }

  // Rest of the component JSX remains the same...
  // Just pass the new handlers to child components

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <DashboardHeader
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={logout}
        user={currentUser}
      />

      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onLogout={logout}
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {currentScreen === 'main' && (
          <>
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold gradient-text mb-4">
                    Bem-vindo ao Trilha Clara IA
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Sua plataforma inteligente para trabalhos acadêmicos
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <WorkCards
                      trabalhos={trabalhos}
                      trabalhoAtual={trabalhoAtual}
                      onStartWork={handleStartWork}
                      onContinueWork={handleContinueWork}
                      onEditWork={(work) => {
                        setSelectedWork(work)
                        setShowEditWorkModal(true)
                      }}
                      onDeleteWork={(work) => {
                        setSelectedWork(work)
                        setShowDeleteWorkModal(true)
                      }}
                    />
                  </div>

                  <div className="space-y-6">
                    <QuickAccessCards
                      onNewProject={() => setShowNewProjectForm(true)}
                      onViewNotes={() => setCurrentScreen('notes')}
                      onViewTimeline={() => setCurrentScreen('timeline')}
                    />
                  </div>
                </div>

                <OverviewCards workData={tccData} />
                <RecentActivity
                  notes={getAllNotesWithDates()}
                  onViewAllNotes={() => setShowAllNotes(true)}
                />
              </div>
            )}

            {currentStep === 2 && (
              <ContentPage
                tccData={tccData}
                onBackToHome={() => setCurrentStep(1)}
                onUpdateProgress={atualizarProgresso}
                onStatusChange={handleStatusChange}
              />
            )}
          </>
        )}

        {currentScreen === 'notes' && (
          <NotesScreen
            onBackToHome={() => setCurrentScreen('main')}
            notes={getCurrentWorkNotesWithDates()}
            onSaveNote={handleSaveNote}
            onRemoveNote={handleRemoveNote}
          />
        )}

        {currentScreen === 'explanation' && (
          <ExplicacaoSimplificada
            onBackToHome={() => setCurrentScreen('main')}
            tccData={tccData}
            onUpdateTccData={atualizarTrabalho}
          />
        )}

        {currentScreen === 'structure' && (
          <Estruturasugerida
            onBackToHome={() => setCurrentScreen('main')}
            tccData={tccData}
            onUpdateTccData={atualizarTrabalho}
          />
        )}

        {currentScreen === 'timeline' && (
          <TimelineScreen
            onBackToHome={() => setCurrentScreen('main')}
            tccData={tccData}
            onUpdateTccData={atualizarTrabalho}
          />
        )}

        {currentScreen === 'profile' && (
          <DashboardProfileScreen
            onBackToHome={() => setCurrentScreen('main')}
            user={currentUser}
          />
        )}

        {currentScreen === 'support' && (
          <DashboardSupportScreen
            onBackToHome={() => setCurrentScreen('main')}
          />
        )}
      </div>

      {/* Modals */}
      <NewProjectModal
        isOpen={showNewProjectForm}
        onClose={() => setShowNewProjectForm(false)}
        onSubmit={handleCreateNewWork}
      />

      <EditWorkModal
        isOpen={showEditWorkModal}
        onClose={() => setShowEditWorkModal(false)}
        work={selectedWork}
        onSave={handleEditWork}
      />

      <DeleteWorkModal
        isOpen={showDeleteWorkModal}
        onClose={() => setShowDeleteWorkModal(false)}
        work={selectedWork}
        onConfirm={handleDeleteWork}
      />

      <InfoButton />
    </div>
  )
}
