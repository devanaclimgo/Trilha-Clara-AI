'use client'

import { FileText, BookOpen, Edit3, Calendar } from 'lucide-react'
import { formatNoteDateRelative } from '@/lib/dateUtils'

interface QuickAccessCardsProps {
  getCurrentWorkNotes: () => string[]
  getCurrentWorkNotesWithDates?: () => Array<{
    text: string
    createdAt: string
  }>
  setCurrentScreen: (screen: string) => void
}

export default function QuickAccessCards({
  getCurrentWorkNotes,
  getCurrentWorkNotesWithDates,
  setCurrentScreen,
}: QuickAccessCardsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold gradient-text mb-6">Ações Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Notes Card */}
        <div
          className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => {
            setCurrentScreen('notes')
            // Garantir que mostra apenas anotações do trabalho atual
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl gradient-bg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Anotações</h3>
              <p className="text-sm text-gray-600">
                {getCurrentWorkNotes().length} anotações salvas
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Revise suas anotações e ideias importantes
          </p>
          {getCurrentWorkNotesWithDates &&
            getCurrentWorkNotesWithDates().length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Última anotação:{' '}
                {formatNoteDateRelative(
                  getCurrentWorkNotesWithDates()[0].createdAt,
                )}
              </p>
            )}
        </div>

        {/* Explanation Card */}
        <div
          className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setCurrentScreen('explanation')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl gradient-bg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Explicação</h3>
              <p className="text-sm text-gray-600">Entenda o enunciado</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Veja a explicação simplificada do seu TCC
          </p>
        </div>

        {/* Structure Card */}
        <div
          className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setCurrentScreen('structure')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl gradient-bg">
              <Edit3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Estrutura</h3>
              <p className="text-sm text-gray-600">Organize seu trabalho</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Veja a estrutura sugerida para seu TCC
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
              <h3 className="text-lg font-bold text-gray-800">Cronograma</h3>
              <p className="text-sm text-gray-600">Acompanhe seu progresso</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Veja suas tarefas e prazos organizados
          </p>
        </div>
      </div>
    </div>
  )
}
