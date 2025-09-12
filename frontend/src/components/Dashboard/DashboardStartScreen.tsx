'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Edit3,
  FileText,
  X,
  Calendar,
  StickyNote,
} from 'lucide-react'
import DashboardHeader from './DashboardHeader'
import TimelineScreen from './DashboardTimelineScreen'
import NotesScreen from './DashboardNoteScreen'
import InserirDados from './DashboardInserirDados'
import ExplicacaoSimplificada from './DashboardExplicacaoSimplidicada'
import Estruturasugerida from './DashboardEstruturaSugerida'
import Cronograma from './DashboardCronograma'
import ExportacaoABNT from './DashboardExportacaoABNT'
import { Settings } from 'lucide-react'
import { User } from 'lucide-react'
import { HelpCircle } from 'lucide-react'

export interface TccData {
  curso: string
  enunciado: string
  explicacao: string | string[]
  sugestoes: string[]
  dica: string
  estrutura: string | string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cronograma: any[]
}

export default function DashboardStartScreen() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [savedNotes, setSavedNotes] = useState<string[]>([])
  const [currentScreen, setCurrentScreen] = useState<
    'main' | 'notes' | 'timeline' | 'settings' | 'profile' | 'support'
  >('main')
  const [showStepByStep, setShowStepByStep] = useState(false)

  const [tccData, setTccData] = useState<TccData>({
    curso: '',
    enunciado: '',
    explicacao: [],
    sugestoes: [],
    dica: '',
    estrutura: [],
    cronograma: [],
  })

  const [hasCompletedInitialData, setHasCompletedInitialData] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem('tcc-user-data')
    if (savedData) {
      setHasCompletedInitialData(true)
    }
  }, [])

  const menuItems = [
    {
      title: 'Anotações',
      icon: FileText,
      id: 'notes',
    },
    {
      title: 'Cronograma',
      icon: Calendar,
      id: 'timeline',
    },
    {
      title: 'Configurações',
      icon: Settings,
      id: 'settings',
    },
    {
      title: 'Perfil',
      icon: User,
      id: 'profile',
    },
    {
      title: 'Suporte',
      icon: HelpCircle,
      id: 'support',
    },
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false)
      }
    }
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarOpen])

  const steps = [
    { id: 1, title: 'Inserir Dados', icon: FileText },
    { id: 2, title: 'Explicação', icon: BookOpen },
    { id: 3, title: 'Estrutura', icon: Edit3 },
    { id: 4, title: 'Cronograma', icon: Clock },
    { id: 5, title: 'Exportar', icon: Download },
  ]

  const saveNote = (note: string) => {
    setSavedNotes((prev) => [...prev, note])
  }

  const removeNote = (index: number) => {
    setSavedNotes((prev) => prev.filter((_, i) => i !== index))
  }

  const getProgressPercentage = () => {
    return Math.round((currentStep / steps.length) * 100)
  }

  return (
    <div className="min-h-screen flex gradient-trilha-soft">
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-50/95 backdrop-blur-sm border-r border-slate-200/30 shadow-xl transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200/30">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold gradient-text">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="rounded-xl hover:bg-purple-50 hover:text-purple-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Navegação</h3>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start gap-3 p-3 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all"
                    onClick={() => {
                      if (item.id === 'notes') {
                        setCurrentScreen('notes')
                      } else if (item.id === 'timeline') {
                        setCurrentScreen('timeline')
                      } else if (item.id === 'settings') {
                        setCurrentScreen('settings')
                      } else if (item.id === 'profile') {
                        setCurrentScreen('profile')
                      } else if (item.id === 'support') {
                        setCurrentScreen('support')
                      }
                      setSidebarOpen(false)
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <StickyNote className="h-4 w-4" />
                  Anotações Salvas
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentScreen('notes')
                    setSidebarOpen(false)
                  }}
                  className="text-xs rounded-lg hover:bg-purple-50 hover:text-purple-600"
                >
                  Ver todas
                </Button>
              </div>
              <div className="space-y-2">
                {savedNotes.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    Nenhuma anotação salva ainda
                  </p>
                ) : (
                  savedNotes.slice(0, 3).map((note, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 text-sm"
                    >
                      {note.length > 50 ? `${note.substring(0, 50)}...` : note}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Progresso do TCC
                </h3>
                <div className="text-right">
                  <div className="text-lg font-bold gradient-text">
                    {getProgressPercentage()}%
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentScreen('timeline')
                      setSidebarOpen(false)
                    }}
                    className="text-xs rounded-lg hover:bg-purple-50 hover:text-purple-600"
                  >
                    Ver cronograma
                  </Button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="gradient-bg h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      currentStep > step.id
                        ? 'bg-green-50 border border-green-200'
                        : currentStep === step.id
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <step.icon
                      className={`h-4 w-4 ${
                        currentStep > step.id
                          ? 'text-green-600'
                          : currentStep === step.id
                          ? 'text-purple-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        currentStep > step.id
                          ? 'text-green-700'
                          : currentStep === step.id
                          ? 'text-purple-700'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                    {currentStep > step.id && (
                      <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
                <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold gradient-text">
                      Progresso do TCC
                    </h2>
                    <div className="text-right">
                      <div className="text-3xl font-bold gradient-text">
                        {getProgressPercentage()}%
                      </div>
                      <div className="text-sm text-gray-600">Concluído</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                    <div
                      className="gradient-bg h-4 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {steps.map((step) => (
                      <div
                        key={step.id}
                        className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                          currentStep > step.id
                            ? 'bg-green-50 border border-green-200'
                            : currentStep === step.id
                            ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <step.icon
                          className={`h-6 w-6 mb-2 ${
                            currentStep > step.id
                              ? 'text-green-600'
                              : currentStep === step.id
                              ? 'text-purple-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <span
                          className={`text-sm font-medium text-center ${
                            currentStep > step.id
                              ? 'text-green-700'
                              : currentStep === step.id
                              ? 'text-purple-700'
                              : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </span>
                        {currentStep > step.id && (
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Access Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Notes Card */}
                  <div
                    className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setCurrentScreen('notes')}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl gradient-bg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Anotações
                        </h3>
                        <p className="text-sm text-gray-600">
                          {savedNotes.length} anotações salvas
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Revise suas anotações e ideias importantes
                    </p>
                  </div>

                  {/* Timeline Card */}
                  <div
                    className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setCurrentScreen('timeline')}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl gradient-bg">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Cronograma
                        </h3>
                        <p className="text-sm text-gray-600">
                          Acompanhe seu progresso
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Veja suas tarefas e prazos organizados
                    </p>
                  </div>

                  {/* Continue Work Card */}
                  <div
                    className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      // Switch to the step-by-step view for the current step
                      setShowStepByStep(true)
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl gradient-bg">
                        <ArrowRight className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Continuar Trabalho
                        </h3>
                        <p className="text-sm text-gray-600">
                          Próximo passo: {steps[currentStep - 1]?.title}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Continue de onde parou no processo
                    </p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20">
                  <h3 className="text-xl font-bold gradient-text mb-4">
                    Atividade Recente
                  </h3>
                  <div className="space-y-3">
                    {savedNotes.slice(0, 3).map((note, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white/50 rounded-xl"
                      >
                        <StickyNote className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-700 flex-1">
                          {note.length > 80
                            ? `${note.substring(0, 80)}...`
                            : note}
                        </p>
                      </div>
                    ))}
                    {savedNotes.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        Nenhuma atividade recente. Comece adicionando anotações!
                      </p>
                    )}
                  </div>
                </div>
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
                <div className="flex justify-center mb-8">
                  <div className="flex items-center gap-4 bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200/20">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            currentStep === step.id
                              ? 'gradient-bg text-white shadow-lg'
                              : currentStep > step.id
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <step.icon className="h-4 w-4" />
                          <span className="text-sm font-medium hidden sm:block">
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="max-w-4xl mx-auto">
                  {currentStep === 1 && (
                    <InserirDados
                      onNext={() => setCurrentStep(2)}
                      onSaveData={(data: TccData, explicacaoGerada: string) => {
                        setTccData((prev) => ({
                          ...prev,
                          curso: data.curso,
                          enunciado: data.enunciado,
                          explicacao: explicacaoGerada,
                          sugestoes: data.sugestoes,
                          dica: data.dica,
                          estrutura: data.estrutura,
                          cronograma: data.cronograma,
                        }))
                      }}
                    />
                  )}
                  {currentStep === 2 && (
                    <ExplicacaoSimplificada
                      explicacao={tccData.explicacao || []}
                      sugestoes={tccData.sugestoes || []}
                      dica={tccData.dica || ''}
                      onNext={() => setCurrentStep(3)}
                      onSaveNote={saveNote}
                    />
                  )}

                  {currentStep === 3 && (
                    <Estruturasugerida
                      estrutura={tccData.estrutura || []}
                      onNext={() => setCurrentStep(4)}
                    />
                  )}
                  {currentStep === 4 && (
                    <Cronograma
                      atividades={tccData.cronograma || []}
                      onNext={() => setCurrentStep(5)}
                    />
                  )}
                  {currentStep === 5 && <ExportacaoABNT />}
                </div>
              </>
            )}
          {currentScreen === 'notes' && (
            <NotesScreen
              savedNotes={savedNotes}
              onRemoveNote={removeNote}
              onAddNote={saveNote}
              onBackToHome={
                hasCompletedInitialData
                  ? () => setCurrentScreen('main')
                  : undefined
              }
            />
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
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {hasCompletedInitialData && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentScreen('main')}
                      className="rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600 flex items-center gap-2 px-4 py-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Voltar ao início
                      </span>
                    </Button>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold gradient-text">
                      Configurações
                    </h2>
                    <p className="text-muted-foreground">
                      Configurações do sistema
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/20">
                <p className="text-gray-600">
                  Configurações do sistema em desenvolvimento...
                </p>
              </div>
            </div>
          )}
          {currentScreen === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {hasCompletedInitialData && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentScreen('main')}
                      className="rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600 flex items-center gap-2 px-4 py-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Voltar ao início
                      </span>
                    </Button>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold gradient-text">
                      Perfil do Usuário
                    </h2>
                    <p className="text-muted-foreground">
                      Seu perfil de usuário
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/20">
                <p className="text-gray-600">
                  Informações do perfil em desenvolvimento...
                </p>
              </div>
            </div>
          )}
          {currentScreen === 'support' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {hasCompletedInitialData && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentScreen('main')}
                      className="rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600 flex items-center gap-2 px-4 py-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Voltar ao início
                      </span>
                    </Button>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold gradient-text">
                      Suporte
                    </h2>
                    <p className="text-muted-foreground">Central de suporte</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/20">
                <p className="text-gray-600">
                  Central de suporte em desenvolvimento...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
