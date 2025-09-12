'use client'

import { StickyNote } from 'lucide-react'

interface RecentActivityProps {
  getCurrentWorkNotes: () => string[]
}

export default function RecentActivity({
  getCurrentWorkNotes,
}: RecentActivityProps) {
  return (
    <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20">
      <h3 className="text-xl font-bold gradient-text mb-4">
        Atividade Recente
      </h3>
      <div className="space-y-3">
        {getCurrentWorkNotes()
          .slice(0, 3)
          .map((note, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-white/50 rounded-xl"
            >
              <StickyNote className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700 flex-1">
                {note.length > 80 ? `${note.substring(0, 80)}...` : note}
              </p>
            </div>
          ))}
        {getCurrentWorkNotes().length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Nenhuma atividade recente. Comece adicionando anotações!
          </p>
        )}
      </div>
    </div>
  )
}
