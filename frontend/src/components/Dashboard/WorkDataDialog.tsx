'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, GraduationCap, Clock, FileText } from 'lucide-react'

interface WorkDataDialogProps {
  isOpen: boolean
  onClose: () => void
  onContinue: (data: {
    tema: string
    tipoTrabalho: string
    curso: string
    semanas: number
    enunciado: string
  }) => void
}

export default function WorkDataDialog({
  isOpen,
  onClose,
  onContinue,
}: WorkDataDialogProps) {
  const [formData, setFormData] = useState({
    tema: '',
    tipoTrabalho: '',
    curso: '',
    semanas: 12,
    enunciado: '',
  })

  const tiposTrabalho = [
    { value: 'tcc', label: 'TCC (Trabalho de Conclusão de Curso)' },
    { value: 'monografia', label: 'Monografia' },
    { value: 'dissertacao', label: 'Dissertação' },
    { value: 'tese', label: 'Tese' },
    { value: 'artigo', label: 'Artigo Científico' },
    { value: 'projeto', label: 'Projeto de Pesquisa' },
    { value: 'outros', label: 'Outros' },
  ]

  const cursos = [
    { value: 'medicina', label: 'Medicina' },
    { value: 'direito', label: 'Direito' },
    { value: 'engenharia', label: 'Engenharia' },
    { value: 'contabeis', label: 'Ciências Contábeis' },
    { value: 'psicologia', label: 'Psicologia' },
    {
      value: 'desenvolvimento-de-sistemas',
      label: 'Análise e Desenvolvimento de Sistemas',
    },
    { value: 'publicidade', label: 'Publicidade e Propaganda' },
    { value: 'seguranca-da-informacao', label: 'Segurança da Informação' },
    { value: 'outros', label: 'Outros' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.tema &&
      formData.tipoTrabalho &&
      formData.curso &&
      formData.enunciado
    ) {
      onContinue(formData)
    }
  }

  const handleClose = () => {
    setFormData({
      tema: '',
      tipoTrabalho: '',
      curso: '',
      semanas: 12,
      enunciado: '',
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Configurar Trabalho
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Preencha os dados abaixo para que a IA possa gerar a estrutura,
            explicação e cronograma personalizados para seu trabalho.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tema do Trabalho */}
            <div className="space-y-2">
              <Label
                htmlFor="tema"
                className="text-sm font-medium text-gray-700"
              >
                Tema/Título do Trabalho *
              </Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="tema"
                  value={formData.tema}
                  onChange={(e) =>
                    setFormData({ ...formData, tema: e.target.value })
                  }
                  className="pl-10 rounded-xl border-2 focus:border-purple-300 transition-colors"
                  placeholder="Ex: Análise do impacto da IA na educação"
                  required
                />
              </div>
            </div>

            {/* Tipo de Trabalho */}
            <div className="space-y-2">
              <Label
                htmlFor="tipoTrabalho"
                className="text-sm font-medium text-gray-700"
              >
                Tipo de Trabalho *
              </Label>
              <Select
                value={formData.tipoTrabalho}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipoTrabalho: value })
                }
                required
              >
                <SelectTrigger className="rounded-xl border-2 focus:border-purple-300 transition-colors">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposTrabalho.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Curso */}
            <div className="space-y-2">
              <Label
                htmlFor="curso"
                className="text-sm font-medium text-gray-700"
              >
                Curso/Matéria *
              </Label>
              <Select
                value={formData.curso}
                onValueChange={(value) =>
                  setFormData({ ...formData, curso: value })
                }
                required
              >
                <SelectTrigger className="rounded-xl border-2 focus:border-purple-300 transition-colors">
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem key={curso.value} value={curso.value}>
                      {curso.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semanas para Conclusão */}
            <div className="space-y-2">
              <Label
                htmlFor="semanas"
                className="text-sm font-medium text-gray-700"
              >
                Prazo (semanas) *
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="semanas"
                  type="number"
                  min="1"
                  max="52"
                  value={formData.semanas}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      semanas: parseInt(e.target.value) || 12,
                    })
                  }
                  className="pl-10 rounded-xl border-2 focus:border-purple-300 transition-colors"
                  placeholder="12"
                  required
                />
              </div>
            </div>
          </div>

          {/* Enunciado/Descrição */}
          <div className="space-y-2">
            <Label
              htmlFor="enunciado"
              className="text-sm font-medium text-gray-700"
            >
              Enunciado/Descrição do Trabalho *
            </Label>
            <Textarea
              id="enunciado"
              value={formData.enunciado}
              onChange={(e) =>
                setFormData({ ...formData, enunciado: e.target.value })
              }
              className="rounded-xl border-2 focus:border-purple-300 transition-colors min-h-[120px]"
              placeholder="Descreva o que o professor pediu, os objetivos do trabalho, metodologia sugerida, etc..."
              required
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl gradient-bg text-white hover:scale-105 transition-all duration-300"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Continuar e Gerar Conteúdo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
