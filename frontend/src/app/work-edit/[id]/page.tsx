'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Save,
  FileText,
  BookOpen,
  User,
  Building,
  GraduationCap,
  Hash,
  FileDown,
} from 'lucide-react'
import { TccData } from '@/types/tcc'
import { useTccData } from '@/hooks/useTccData'

// Interface para campos dinâmicos do trabalho
interface WorkField {
  key: string
  label: string
  required: boolean
  type: 'input' | 'textarea'
}

export default function WorkEditPage() {
  const params = useParams()
  const router = useRouter()
  const { trabalhos, atualizarTrabalho } = useTccData()
  const [workData, setWorkData] = useState<TccData | null>(null)
  const [activeTab, setActiveTab] = useState('basico')

  useEffect(() => {
    if (params.id && trabalhos.length > 0) {
      const work = trabalhos.find((t) => t.id === params.id)
      if (work) {
        setWorkData(work)
      } else {
        router.push('/dashboard')
      }
    }
  }, [params.id, trabalhos, router])

  if (!workData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando trabalho...</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    if (workData) {
      atualizarTrabalho(workData)
      // Aqui você pode adicionar uma notificação de sucesso
    }
  }

  const handleDownload = (format: 'doc' | 'pdf') => {
    // Implementar download do documento formatado
    console.log(`Downloading as ${format}`)
  }

  const updateWorkData = (field: keyof TccData, value: string | number) => {
    setWorkData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const getFieldValue = (fieldKey: string): string => {
    if (!workData) return ''
    const value = (workData as unknown as Record<string, unknown>)[fieldKey]
    return String(value || '')
  }

  const getTrabalhoTypeFields = (): WorkField[] => {
    switch (workData.tipoTrabalho) {
      case 'tcc':
        return [
          { key: 'resumo', label: 'Resumo', required: true, type: 'textarea' },
          {
            key: 'palavrasChave',
            label: 'Palavras-chave',
            required: true,
            type: 'input',
          },
          {
            key: 'introducao',
            label: 'Introdução',
            required: true,
            type: 'textarea',
          },
          {
            key: 'objetivos',
            label: 'Objetivos',
            required: true,
            type: 'textarea',
          },
          {
            key: 'metodologia',
            label: 'Metodologia',
            required: true,
            type: 'textarea',
          },
          {
            key: 'desenvolvimento',
            label: 'Desenvolvimento',
            required: true,
            type: 'textarea',
          },
          {
            key: 'conclusao',
            label: 'Conclusão',
            required: true,
            type: 'textarea',
          },
          {
            key: 'referencias',
            label: 'Referências',
            required: true,
            type: 'textarea',
          },
        ]
      case 'monografia':
        return [
          { key: 'resumo', label: 'Resumo', required: true, type: 'textarea' },
          {
            key: 'palavrasChave',
            label: 'Palavras-chave',
            required: true,
            type: 'input',
          },
          {
            key: 'introducao',
            label: 'Introdução',
            required: true,
            type: 'textarea',
          },
          {
            key: 'objetivos',
            label: 'Objetivos',
            required: true,
            type: 'textarea',
          },
          {
            key: 'metodologia',
            label: 'Metodologia',
            required: true,
            type: 'textarea',
          },
          {
            key: 'revisaoLiteratura',
            label: 'Revisão da Literatura',
            required: true,
            type: 'textarea',
          },
          {
            key: 'desenvolvimento',
            label: 'Desenvolvimento',
            required: true,
            type: 'textarea',
          },
          {
            key: 'conclusao',
            label: 'Conclusão',
            required: true,
            type: 'textarea',
          },
          {
            key: 'referencias',
            label: 'Referências',
            required: true,
            type: 'textarea',
          },
        ]
      case 'dissertacao':
        return [
          { key: 'resumo', label: 'Resumo', required: true, type: 'textarea' },
          {
            key: 'palavrasChave',
            label: 'Palavras-chave',
            required: true,
            type: 'input',
          },
          {
            key: 'introducao',
            label: 'Introdução',
            required: true,
            type: 'textarea',
          },
          {
            key: 'objetivos',
            label: 'Objetivos',
            required: true,
            type: 'textarea',
          },
          {
            key: 'metodologia',
            label: 'Metodologia',
            required: true,
            type: 'textarea',
          },
          {
            key: 'revisaoLiteratura',
            label: 'Revisão da Literatura',
            required: true,
            type: 'textarea',
          },
          {
            key: 'desenvolvimento',
            label: 'Desenvolvimento',
            required: true,
            type: 'textarea',
          },
          {
            key: 'resultados',
            label: 'Resultados',
            required: true,
            type: 'textarea',
          },
          {
            key: 'discussao',
            label: 'Discussão',
            required: true,
            type: 'textarea',
          },
          {
            key: 'conclusao',
            label: 'Conclusão',
            required: true,
            type: 'textarea',
          },
          {
            key: 'referencias',
            label: 'Referências',
            required: true,
            type: 'textarea',
          },
        ]
      case 'tese':
        return [
          { key: 'resumo', label: 'Resumo', required: true, type: 'textarea' },
          {
            key: 'palavrasChave',
            label: 'Palavras-chave',
            required: true,
            type: 'input',
          },
          {
            key: 'introducao',
            label: 'Introdução',
            required: true,
            type: 'textarea',
          },
          {
            key: 'objetivos',
            label: 'Objetivos',
            required: true,
            type: 'textarea',
          },
          {
            key: 'metodologia',
            label: 'Metodologia',
            required: true,
            type: 'textarea',
          },
          {
            key: 'revisaoLiteratura',
            label: 'Revisão da Literatura',
            required: true,
            type: 'textarea',
          },
          {
            key: 'desenvolvimento',
            label: 'Desenvolvimento',
            required: true,
            type: 'textarea',
          },
          {
            key: 'resultados',
            label: 'Resultados',
            required: true,
            type: 'textarea',
          },
          {
            key: 'discussao',
            label: 'Discussão',
            required: true,
            type: 'textarea',
          },
          {
            key: 'conclusao',
            label: 'Conclusão',
            required: true,
            type: 'textarea',
          },
          {
            key: 'referencias',
            label: 'Referências',
            required: true,
            type: 'textarea',
          },
        ]
      default:
        return [
          { key: 'resumo', label: 'Resumo', required: true, type: 'textarea' },
          {
            key: 'palavrasChave',
            label: 'Palavras-chave',
            required: true,
            type: 'input',
          },
          {
            key: 'introducao',
            label: 'Introdução',
            required: true,
            type: 'textarea',
          },
          {
            key: 'objetivos',
            label: 'Objetivos',
            required: true,
            type: 'textarea',
          },
          {
            key: 'metodologia',
            label: 'Metodologia',
            required: true,
            type: 'textarea',
          },
          {
            key: 'desenvolvimento',
            label: 'Desenvolvimento',
            required: true,
            type: 'textarea',
          },
          {
            key: 'conclusao',
            label: 'Conclusão',
            required: true,
            type: 'textarea',
          },
          {
            key: 'referencias',
            label: 'Referências',
            required: true,
            type: 'textarea',
          },
        ]
    }
  }

  const fields = getTrabalhoTypeFields()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {workData.titulo}
                </h1>
                <p className="text-sm text-gray-600">{workData.curso}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload('doc')}
                  className="flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  DOC
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownload('pdf')}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basico">Informações Básicas</TabsTrigger>
            <TabsTrigger value="conteudo">Conteúdo do Trabalho</TabsTrigger>
            <TabsTrigger value="formatacao">Formatação ABNT</TabsTrigger>
          </TabsList>

          {/* Informações Básicas */}
          <TabsContent value="basico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título do Trabalho</Label>
                    <Input
                      id="titulo"
                      value={workData.titulo}
                      onChange={(e) => updateWorkData('titulo', e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitulo">Subtítulo</Label>
                    <Input
                      id="subtitulo"
                      value={workData.subtitulo}
                      onChange={(e) =>
                        updateWorkData('subtitulo', e.target.value)
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tema">Tema</Label>
                    <Input
                      id="tema"
                      value={workData.tema || ''}
                      onChange={(e) => updateWorkData('tema', e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="curso">Curso</Label>
                    <Input
                      id="curso"
                      value={workData.curso}
                      onChange={(e) => updateWorkData('curso', e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conteúdo do Trabalho */}
          <TabsContent value="conteudo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Conteúdo do Trabalho
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.key}
                        value={getFieldValue(field.key)}
                        onChange={(e) =>
                          updateWorkData(
                            field.key as keyof TccData,
                            e.target.value,
                          )
                        }
                        className="rounded-xl min-h-[120px]"
                        placeholder={`Digite ${field.label.toLowerCase()}...`}
                      />
                    ) : (
                      <Input
                        id={field.key}
                        value={getFieldValue(field.key)}
                        onChange={(e) =>
                          updateWorkData(
                            field.key as keyof TccData,
                            e.target.value,
                          )
                        }
                        className="rounded-xl"
                        placeholder={`Digite ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formatação ABNT */}
          <TabsContent value="formatacao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Formatação ABNT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="nomeAluno"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Nome do Aluno
                    </Label>
                    <Input
                      id="nomeAluno"
                      value={workData.nomeAluno || ''}
                      onChange={(e) =>
                        updateWorkData('nomeAluno', e.target.value)
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="instituicao"
                      className="flex items-center gap-2"
                    >
                      <Building className="h-4 w-4" />
                      Instituição
                    </Label>
                    <Input
                      id="instituicao"
                      value={workData.instituicao || ''}
                      onChange={(e) =>
                        updateWorkData('instituicao', e.target.value)
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="orientador"
                      className="flex items-center gap-2"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Orientador
                    </Label>
                    <Input
                      id="orientador"
                      value={workData.orientador || ''}
                      onChange={(e) =>
                        updateWorkData('orientador', e.target.value)
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="coorientador"
                      className="flex items-center gap-2"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Coorientador
                    </Label>
                    <Input
                      id="coorientador"
                      value={workData.coorientador || ''}
                      onChange={(e) =>
                        updateWorkData('coorientador', e.target.value)
                      }
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
