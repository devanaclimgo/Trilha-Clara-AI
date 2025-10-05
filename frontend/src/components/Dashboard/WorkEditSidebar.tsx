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
import { formatNoteDateShort } from '@/lib/dateUtils'

interface WorkEditSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentStep: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  steps: Array<{ id: number; title: string; icon: any }>
  getCurrentWorkNotes: () => string[]
  getCurrentWorkNotesWithDates?: () => Array<{
    text: string
    createdAt: string
  }>
  getProgressPercentage: () => number
  onLogout: () => void
  onOpenDialog: (dialogType: string) => void
}

export default function WorkEditSidebar({
  sidebarOpen,
  setSidebarOpen,
  currentStep,
  steps,
  getCurrentWorkNotes,
  getCurrentWorkNotesWithDates,
  getProgressPercentage,
  onLogout,
  onOpenDialog,
}: WorkEditSidebarProps) {
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
            <h3 className="font-semibold text-gray-700 mb-3">Ferramentas</h3>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start gap-3 p-3 rounded-xl transition-all hover:bg-purple-50 hover:text-purple-600"
                  onClick={() => {
                    onOpenDialog(item.id)
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
                  onOpenDialog('notes')
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
                (getCurrentWorkNotesWithDates
                  ? getCurrentWorkNotesWithDates()
                  : getCurrentWorkNotes().map((text) => ({
                      text,
                      createdAt: '',
                    }))
                )
                  .slice(0, 3)
                  .map((note, index) => {
                    // Verificação de compatibilidade para anotações antigas
                    const noteText = typeof note === 'string' ? note : note.text
                    const noteDate =
                      typeof note === 'string' ? '' : note.createdAt

                    return (
                      <div
                        key={index}
                        className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/30 hover:bg-white/80 transition-colors cursor-pointer"
                        onClick={() => {
                          onOpenDialog('notes')
                          setSidebarOpen(false)
                        }}
                      >
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {noteText}
                        </p>
                        {noteDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatNoteDateShort(noteDate)}
                          </p>
                        )}
                      </div>
                    )
                  })
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Progresso</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Conclusão</span>
                <span className="font-medium text-purple-600">
                  {getProgressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      step.id <= currentStep
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        step.id < currentStep
                          ? 'bg-green-500 text-white'
                          : step.id === currentStep
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Donation Section */}
          <DonationSection />

          {/* Logout */}
          <div className="pt-4 border-t border-slate-200/30">
            <LogoutButton onLogout={onLogout} />
          </div>
        </div>
      </div>
    </div>
  )
}
