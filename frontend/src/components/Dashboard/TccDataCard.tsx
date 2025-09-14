'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  User,
  BookOpen,
  GraduationCap,
  Building,
  FileText,
  Save,
  Edit3,
} from 'lucide-react'
import { TccData } from '@/types/tcc'

interface TccDataCardProps {
  tccData: TccData
  onSaveData: (data: Partial<TccData>) => void
  hasData: boolean
}

export default function TccDataCard({
  tccData,
  onSaveData,
  hasData,
}: TccDataCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nomeAluno: tccData.nomeAluno || '',
    tema: tccData.tema || '',
    curso: tccData.curso || '',
    instituicao: tccData.instituicao || '',
    tipoTrabalho: tccData.tipoTrabalho || '',
    orientador: tccData.orientador || '',
    coorientador: tccData.coorientador || '',
    palavrasChave: tccData.palavrasChave || '',
    resumo: tccData.resumo || '',
  })

  const tiposTrabalho = [
    { value: 'tcc', label: 'TCC (Trabalho de Conclusão de Curso)' },
    { value: 'monografia', label: 'Monografia' },
    { value: 'dissertacao', label: 'Dissertação' },
    { value: 'tese', label: 'Tese' },
    { value: 'artigo', label: 'Artigo Científico' },
    { value: 'projeto', label: 'Projeto de Pesquisa' },
  ]

  const handleSave = () => {
    onSaveData(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      nomeAluno: tccData.nomeAluno || '',
      tema: tccData.tema || '',
      curso: tccData.curso || '',
      instituicao: tccData.instituicao || '',
      tipoTrabalho: tccData.tipoTrabalho || '',
      orientador: tccData.orientador || '',
      coorientador: tccData.coorientador || '',
      palavrasChave: tccData.palavrasChave || '',
      resumo: tccData.resumo || '',
    })
    setIsEditing(false)
  }

  if (!hasData) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-6">Dados do TCC</h2>
        <div className="text-center py-12 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/20">
          <div className="p-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Crie um trabalho primeiro
          </h3>
          <p className="text-gray-600">
            Para configurar os dados do TCC, você precisa criar um trabalho
            acadêmico.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Dados do TCC</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <FileText className="h-5 w-5" />
            Informações para Formatação ABNT
          </CardTitle>
          <CardDescription className="text-orange-700">
            Preencha os dados abaixo para gerar automaticamente a formatação
            ABNT do seu trabalho
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="pl-10 rounded-xl border-2 bg-white focus:border-orange-300 transition-colors"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

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
                      className="pl-10 rounded-xl border-2 bg-white focus:border-orange-300 transition-colors"
                      placeholder="Título do seu trabalho"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="curso"
                    className="text-sm font-medium text-gray-700"
                  >
                    Curso *
                  </Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="curso"
                      value={formData.curso}
                      onChange={(e) =>
                        setFormData({ ...formData, curso: e.target.value })
                      }
                      className="pl-10 rounded-xl border-2 bg-white focus:border-orange-300 transition-colors"
                      placeholder="Nome do curso"
                    />
                  </div>
                </div>

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
                        setFormData({
                          ...formData,
                          instituicao: e.target.value,
                        })
                      }
                      className="pl-10 rounded-xl border-2 bg-white focus:border-orange-300 transition-colors"
                      placeholder="Nome da faculdade/universidade"
                    />
                  </div>
                </div>

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
                  >
                    <SelectTrigger className="rounded-xl border-2 bg-white focus:border-orange-300 transition-colors">
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

                <div className="space-y-2">
                  <Label
                    htmlFor="orientador"
                    className="text-sm font-medium text-gray-700"
                  >
                    Orientador
                  </Label>
                  <Input
                    id="orientador"
                    value={formData.orientador}
                    onChange={(e) =>
                      setFormData({ ...formData, orientador: e.target.value })
                    }
                    className="rounded-xl border-2 bg-white focus:border-orange-300 transition-colors"
                    placeholder="Nome do orientador"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="coorientador"
                    className="text-sm font-medium text-gray-700"
                  >
                    Coorientador
                  </Label>
                  <Input
                    id="coorientador"
                    value={formData.coorientador}
                    onChange={(e) =>
                      setFormData({ ...formData, coorientador: e.target.value })
                    }
                    className="rounded-xl border-2 bg-white focus:border-orange-300 transition-colors"
                    placeholder="Nome do coorientador (opcional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="palavrasChave"
                    className="text-sm font-medium text-gray-700"
                  >
                    Palavras-chave
                  </Label>
                  <Input
                    id="palavrasChave"
                    value={formData.palavrasChave}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        palavrasChave: e.target.value,
                      })
                    }
                    className="rounded-xl border-2 bg-white focus:border-orange-300 transition-colors"
                    placeholder="Palavra1, Palavra2, Palavra3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="resumo"
                  className="text-sm font-medium text-gray-700"
                >
                  Resumo
                </Label>
                <Textarea
                  id="resumo"
                  value={formData.resumo}
                  onChange={(e) =>
                    setFormData({ ...formData, resumo: e.target.value })
                  }
                  className="rounded-xl border-2 bg-white focus:border-orange-300 transition-colors min-h-[120px]"
                  placeholder="Escreva um breve resumo do seu trabalho..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="rounded-xl hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Dados
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Nome do Aluno
                  </Label>
                  <p className="text-gray-800 font-medium">
                    {formData.nomeAluno || 'Não informado'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Tema/Título
                  </Label>
                  <p className="text-gray-800 font-medium">
                    {formData.tema || 'Não informado'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Curso
                  </Label>
                  <p className="text-gray-800 font-medium">
                    {formData.curso || 'Não informado'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Instituição
                  </Label>
                  <p className="text-gray-800 font-medium">
                    {formData.instituicao || 'Não informado'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Tipo de Trabalho
                  </Label>
                  <p className="text-gray-800 font-medium">
                    {tiposTrabalho.find(
                      (t) => t.value === formData.tipoTrabalho,
                    )?.label || 'Não informado'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Orientador
                  </Label>
                  <p className="text-gray-800 font-medium">
                    {formData.orientador || 'Não informado'}
                  </p>
                </div>
              </div>
              {formData.resumo && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Resumo
                  </Label>
                  <p className="text-gray-800 leading-relaxed">
                    {formData.resumo}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
