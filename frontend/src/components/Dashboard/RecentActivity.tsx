'use client'

import { StickyNote } from 'lucide-react'
import { formatNoteDateRelative } from '@/lib/dateUtils'

interface RecentActivityProps {
  getCurrentWorkNotes: () => string[]
  getCurrentWorkNotesWithDates?: () => Array<{
    text: string
    createdAt: string
  }>
}

export default function RecentActivity({
  getCurrentWorkNotes,
  getCurrentWorkNotesWithDates,
}: RecentActivityProps) {
  return (
    <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20">
      <h3 className="text-xl font-bold gradient-text mb-4">
        Atividade Recente
      </h3>
      <div className="space-y-3">
        {(getCurrentWorkNotesWithDates
          ? getCurrentWorkNotesWithDates()
          : getCurrentWorkNotes().map((text) => ({ text, createdAt: '' }))
        )
          .slice(0, 3)
          .map((note, index) => {
            // Verificação de compatibilidade para anotações antigas
            const noteText = typeof note === 'string' ? note : note.text
            const noteDate = typeof note === 'string' ? '' : note.createdAt

            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/50 rounded-xl"
              >
                <StickyNote className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    {noteText && noteText.length > 80
                      ? `${noteText.substring(0, 80)}...`
                      : noteText}
                  </p>
                  {noteDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatNoteDateRelative(noteDate)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        {getCurrentWorkNotes().length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Nenhuma atividade recente. Comece adicionando anotações!
          </p>
        )}
      </div>
    </div>
  )
}
