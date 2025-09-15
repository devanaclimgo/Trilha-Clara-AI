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
import {
  BookOpen,
  GraduationCap,
  Clock,
  FileText,
  User,
  Building,
} from 'lucide-react'

interface StartWorkModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: (data: {
    titulo: string
    tipoTrabalho: string
    curso: string
    semanas: number
    tema: string
    nomeAluno: string
    instituicao: string
    orientador: string
  }) => void
  workTitle: string
}

export default function StartWorkModal({
  isOpen,
  onClose,
  onStart,
  workTitle,
}: StartWorkModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    tipoTrabalho: '',
    curso: '',
    semanas: 12,
    tema: '',
    nomeAluno: '',
    instituicao: '',
    orientador: '',
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
      formData.titulo &&
      formData.tipoTrabalho &&
      formData.curso &&
      formData.tema &&
      formData.nomeAluno &&
      formData.instituicao
    ) {
      onStart(formData)
    }
  }

  const handleClose = () => {
    setFormData({
      titulo: '',
      tipoTrabalho: '',
      curso: '',
      semanas: 12,
      tema: '',
      nomeAluno: '',
      instituicao: '',
      orientador: '',
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Iniciar Trabalho: {workTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Preencha as informações básicas do seu trabalho para que a IA possa
            gerar conteúdo personalizado e você possa começar a escrever.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Trabalho */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Informações do Trabalho
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título do Trabalho */}
              <div className="space-y-2">
                <Label
                  htmlFor="titulo"
                  className="text-sm font-medium text-gray-700"
                >
                  Título do Trabalho *
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    className="pl-10 rounded-xl border-2 focus:border-purple-300 transition-colors"
                    placeholder="Título do seu trabalho"
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

            {/* Tema/Enunciado */}
            <div className="space-y-2">
              <Label
                htmlFor="tema"
                className="text-sm font-medium text-gray-700"
              >
                Tema/Enunciado do Trabalho *
              </Label>
              <Textarea
                id="tema"
                value={formData.tema}
                onChange={(e) =>
                  setFormData({ ...formData, tema: e.target.value })
                }
                className="rounded-xl border-2 focus:border-purple-300 transition-colors min-h-[120px]"
                placeholder="Descreva o tema completo do seu trabalho, o que o professor pediu, os objetivos, metodologia sugerida, etc..."
                required
              />
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Informações Pessoais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome do Aluno */}
              <div className="space-y-2">
                <Label
                  htmlFor="nomeAluno"
                  className="text-sm font-medium text-gray-700"
                >
                  Nome do Aluno *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="nomeAluno"
                    value={formData.nomeAluno}
                    onChange={(e) =>
                      setFormData({ ...formData, nomeAluno: e.target.value })
                    }
                    className="pl-10 rounded-xl border-2 focus:border-purple-300 transition-colors"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              </div>

              {/* Instituição */}
              <div className="space-y-2">
                <Label
                  htmlFor="instituicao"
                  className="text-sm font-medium text-gray-700"
                >
                  Instituição de Ensino *
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="instituicao"
                    value={formData.instituicao}
                    onChange={(e) =>
                      setFormData({ ...formData, instituicao: e.target.value })
                    }
                    className="pl-10 rounded-xl border-2 focus:border-purple-300 transition-colors"
                    placeholder="Nome da universidade/faculdade"
                    required
                  />
                </div>
              </div>

              {/* Orientador */}
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="orientador"
                  className="text-sm font-medium text-gray-700"
                >
                  Orientador (opcional)
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="orientador"
                    value={formData.orientador}
                    onChange={(e) =>
                      setFormData({ ...formData, orientador: e.target.value })
                    }
                    className="pl-10 rounded-xl border-2 focus:border-purple-300 transition-colors"
                    placeholder="Nome do orientador (se houver)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl gradient-bg text-white hover:scale-105 transition-all duration-300"
            >
              <FileText className="h-4 w-4 mr-2" />
              Iniciar Trabalho
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
