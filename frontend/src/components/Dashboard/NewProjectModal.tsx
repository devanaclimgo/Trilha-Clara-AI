'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface NewProjectModalProps {
  show: boolean
  onClose: () => void
  onCreateProject: (titulo: string, curso: string, subtitulo: string) => void
}

export default function NewProjectModal({
  show,
  onClose,
  onCreateProject,
}: NewProjectModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    curso: '',
    subtitulo: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.titulo && formData.curso && formData.subtitulo) {
      onCreateProject(formData.titulo, formData.curso, formData.subtitulo)
      setFormData({ titulo: '', curso: '', subtitulo: '' })
      onClose()
    }
  }

  const handleCancel = () => {
    setFormData({ titulo: '', curso: '', subtitulo: '' })
    onClose()
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Novo Trabalho</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="rounded-xl hover:bg-purple-50 hover:text-purple-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Título do Trabalho
            </label>
            <input
              type="text"
              placeholder="Ex: Análise de Campanhas Digitais"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Curso</label>
            <select
              value={formData.curso}
              onChange={(e) =>
                setFormData({ ...formData, curso: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
              required
            >
              <option value="">Selecione seu curso</option>
              <option value="medicina">Medicina</option>
              <option value="direito">Direito</option>
              <option value="engenharia">Engenharia</option>
              <option value="contabeis">Ciências Contábeis</option>
              <option value="psicologia">Psicologia</option>
              <option value="desenvolvimento-de-sistemas">
                Análise e Desenvolvimento de Sistemas
              </option>
              <option value="publicidade">Publicidade e Propaganda</option>
              <option value="seguranca-da-informacao">
                Segurança da Informação
              </option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subtítulo do Trabalho
            </label>
            <textarea
              placeholder="Cole aqui o subtitulo do seu TCC conforme fornecido pelo professor..."
              rows={4}
              value={formData.subtitulo}
              onChange={(e) =>
                setFormData({ ...formData, subtitulo: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Criar Trabalho
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
