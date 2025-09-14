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
  const [isSaving, setIsSaving] = useState(false)

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

  const handleSave = async () => {
    if (workData) {
      setIsSaving(true)
      try {
        // Simular delay de salvamento
        await new Promise((resolve) => setTimeout(resolve, 1000))
        atualizarTrabalho(workData)
        // Aqui você pode adicionar uma notificação de sucesso
      } catch (error) {
        console.error('Erro ao salvar:', error)
      } finally {
        setIsSaving(false)
      }
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
    <div className="min-h-screen gradient-trilha-soft">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="flex items-center border gap-2 hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-bold gradient-text">
                  {workData.titulo}
                </h1>
                <p className="text-sm text-gray-600">{workData.curso}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${
                  isSaving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'gradient-bg hover:scale-105 active:scale-95'
                }`}
              >
                <Save className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload('doc')}
                  className="flex items-center gap-2 rounded-xl border-2 hover:bg-slate-50"
                >
                  <FileDown className="h-4 w-4" />
                  DOC
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownload('pdf')}
                  className="flex items-center gap-2 rounded-xl border-2 hover:bg-slate-50"
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
          <TabsList className="grid w-full grid-cols-3 bg-slate-50/80 backdrop-blur-sm border border-slate-200/20 rounded-2xl p-1">
            <TabsTrigger
              value="basico"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600"
            >
              Informações Básicas
            </TabsTrigger>
            <TabsTrigger
              value="conteudo"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600"
            >
              Conteúdo do Trabalho
            </TabsTrigger>
            <TabsTrigger
              value="formatacao"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600"
            >
              Formatação ABNT
            </TabsTrigger>
          </TabsList>

          {/* Informações Básicas */}
          <TabsContent value="basico" className="space-y-6">
            <Card className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/20 shadow-lg rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl font-bold gradient-text">
                  <FileText className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Configure as informações principais do seu trabalho
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="titulo"
                        className="text-sm font-medium text-gray-700"
                      >
                        Título do Trabalho
                      </Label>
                      <Input
                        id="titulo"
                        value={workData.titulo}
                        onChange={(e) =>
                          updateWorkData('titulo', e.target.value)
                        }
                        className="rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                        placeholder="Digite o título do seu trabalho"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="curso"
                        className="text-sm font-medium text-gray-700"
                      >
                        Curso
                      </Label>
                      <Input
                        id="curso"
                        value={workData.curso}
                        onChange={(e) =>
                          updateWorkData('curso', e.target.value)
                        }
                        className="rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                        placeholder="Ex: Medicina, Direito, Engenharia..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="tema"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tema/Enunciado do Trabalho
                    </Label>
                    <Textarea
                      id="tema"
                      value={workData.tema || ''}
                      onChange={(e) => updateWorkData('tema', e.target.value)}
                      className="rounded-xl min-h-[120px] border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="Descreva o tema completo do seu trabalho, o que o professor pediu, os objetivos, metodologia sugerida, etc..."
                    />
                    <p className="text-xs text-gray-500">
                      Este é o tema completo e enunciado do seu trabalho
                      acadêmico
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conteúdo do Trabalho */}
          <TabsContent value="conteudo" className="space-y-6">
            <Card className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/20 shadow-lg rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl font-bold gradient-text">
                  <BookOpen className="h-5 w-5" />
                  Conteúdo do Trabalho
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Preencha as seções do seu trabalho acadêmico
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label
                      htmlFor={field.key}
                      className="text-sm font-medium text-gray-700"
                    >
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
                        className="rounded-xl min-h-[120px] border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
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
                        className="rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
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
            <Card className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/20 shadow-lg rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl font-bold gradient-text">
                  <Hash className="h-5 w-5" />
                  Formatação ABNT
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Configure os dados para formatação acadêmica
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="nomeAluno"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700"
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
                      className="rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="instituicao"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700"
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
                      className="rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="Nome da universidade/faculdade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="orientador"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700"
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
                      className="rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="Nome do orientador"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="coorientador"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700"
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
                      className="rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="Nome do coorientador (opcional)"
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
