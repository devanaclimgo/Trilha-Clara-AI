'use client'

import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  FileText,
  BookOpen,
  Edit3,
  Calendar,
  Settings,
  User,
  HelpCircle,
  StickyNote,
  X,
  CheckCircle,
} from 'lucide-react'
import LogoutButton from '../LogoutButton'
import DonationSection from '../DonationSection'

interface DashboardSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentScreen: string
  setCurrentScreen: (screen: string) => void
  currentStep: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  steps: Array<{ id: number; title: string; icon: any }>
  getCurrentWorkNotes: () => string[]
  getProgressPercentage: () => number
  onShowAllNotes: () => void
  onLogout: () => void
}

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
  setCurrentScreen,
  currentStep,
  steps,
  getCurrentWorkNotes,
  getProgressPercentage,
  onShowAllNotes,
  onLogout,
}: DashboardSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)

  const menuItems = [
    {
      title: 'Anotações',
      icon: FileText,
      id: 'notes',
    },
    {
      title: 'Explicação',
      icon: BookOpen,
      id: 'explanation',
    },
    {
      title: 'Estrutura',
      icon: Edit3,
      id: 'structure',
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
  }, [sidebarOpen, setSidebarOpen])

  return (
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
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-purple">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Navegação</h3>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start gap-3 p-3 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all"
                  onClick={() => {
                    setCurrentScreen(item.id)
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
                  onShowAllNotes()
                  setSidebarOpen(false)
                }}
                className="text-xs rounded-lg hover:bg-purple-50 hover:text-purple-600"
              >
                Ver todas
              </Button>
            </div>
            <div className="space-y-2">
              {getCurrentWorkNotes().length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  Nenhuma anotação salva ainda
                </p>
              ) : (
                getCurrentWorkNotes()
                  .slice(0, 3)
                  .map((note, index) => (
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

        {/* Botões na parte inferior do sidebar */}
        <div className="p-4 border-t border-slate-200/30 space-y-3">
          <DonationSection />
          <LogoutButton onLogout={onLogout} />
        </div>
      </div>
    </div>
  )
}
