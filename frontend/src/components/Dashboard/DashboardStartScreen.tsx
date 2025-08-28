'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
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

export default function DashboardStartScreen() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [savedNotes, setSavedNotes] = useState<string[]>([])
  const [currentScreen, setCurrentScreen] = useState<
    'main' | 'notes' | 'timeline'
  >('main')

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-pink-50/30 flex">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/90 backdrop-blur-sm border-r border-white/20 shadow-xl transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold gradient-text">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="rounded-xl hover:bg-purple-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
                  className="text-xs rounded-lg hover:bg-purple-50"
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentScreen('timeline')
                    setSidebarOpen(false)
                  }}
                  className="text-xs rounded-lg hover:bg-purple-50"
                >
                  Ver cronograma
                </Button>
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
          setCurrentScreen={setCurrentScreen}
        />
        <div className="container mx-auto px-4 py-8">
          {currentScreen === 'main' && (
            <>
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
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
                  <InserirDados onNext={() => setCurrentStep(2)} />
                )}
                {currentStep === 2 && (
                  <ExplicacaoSimplificada
                    onNext={() => setCurrentStep(3)}
                    onSaveNote={saveNote}
                  />
                )}
                {currentStep === 3 && (
                  <Estruturasugerida onNext={() => setCurrentStep(4)} />
                )}
                {currentStep === 4 && (
                  <Cronograma onNext={() => setCurrentStep(5)} />
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
            />
          )}
          {currentScreen === 'timeline' && <TimelineScreen />}
        </div>
      </div>
    </div>
  )
}
