'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle, X } from 'lucide-react'
import { TccData } from '@/types/tcc'

interface DeleteWorkModalProps {
  show: boolean
  onClose: () => void
  onConfirm: (workId: string) => void
  work: TccData | null
}

export default function DeleteWorkModal({
  show,
  onClose,
  onConfirm,
  work,
}: DeleteWorkModalProps) {
  if (!show || !work) return null

  const handleConfirm = () => {
    onConfirm(work.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-red-600">Excluir Trabalho</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-xl hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Atenção!</h3>
              <p className="text-sm text-red-700">
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-700">
              Tem certeza que deseja excluir o trabalho:
            </p>
            <div className="p-3 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-800">{work.titulo}</h4>
              <p className="text-sm text-gray-600">{work.curso}</p>
            </div>
            <p className="text-sm text-gray-600">
              Todas as anotações e progresso serão perdidos permanentemente.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl hover:bg-gray-50 hover:text-gray-700 border-gray-200 hover:border-gray-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Excluir Trabalho
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
