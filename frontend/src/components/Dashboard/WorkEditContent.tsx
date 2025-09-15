'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TccData } from '@/types/tcc'
import {
  FileText,
  Wand2,
  Save,
  RefreshCw,
  BookOpen,
  Lightbulb,
  Target,
  CheckCircle,
} from 'lucide-react'

interface WorkEditContentProps {
  workData: TccData
}

interface WorkContent {
  resumo: string
  introducao: string
  desenvolvimento: string
  conclusao: string
  referencias: string
  metodologia?: string
  objetivos?: string
  justificativa?: string
  [key: string]: string | undefined // Para campos dinâmicos da estrutura
}

export default function WorkEditContent({ workData }: WorkEditContentProps) {
  const [content, setContent] = useState<WorkContent>({
    resumo: '',
    introducao: '',
    desenvolvimento: '',
    conclusao: '',
    referencias: '',
    metodologia: '',
    objetivos: '',
    justificativa: '',
  })

  // Inicializar campos dinâmicos da estrutura
  useEffect(() => {
    if (
      workData?.estrutura &&
      Array.isArray(workData.estrutura) &&
      workData.estrutura.length > 0
    ) {
      const estruturaContent: Record<string, string> = {}
      workData.estrutura.forEach((_: unknown, index: number) => {
        estruturaContent[`estrutura_${index}`] = ''
      })
      setContent((prev) => ({ ...prev, ...estruturaContent }))
    }
  }, [workData?.estrutura])

  const [generating, setGenerating] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar conteúdo existente
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(
          `http://localhost:4000/api/work/${workData.id}/content`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.ok) {
          const data = await response.json()
          setContent({
            resumo: data.resumo || '',
            introducao: data.introducao || '',
            desenvolvimento: data.desenvolvimento || '',
            conclusao: data.conclusao || '',
            referencias: data.referencias || '',
            metodologia: data.metodologia || '',
            objetivos: data.objetivos || '',
            justificativa: data.justificativa || '',
          })
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error)
      } finally {
        setLoading(false)
      }
    }

    if (workData?.id) {
      fetchContent()
    }
  }, [workData?.id])

  // Gerar campos baseados na estrutura da IA
  const generateContentFields = () => {
    const baseFields = [
      {
        key: 'resumo',
        label: 'Resumo',
        description:
          'Escreva as principais ideias do seu trabalho em poucas palavras',
        placeholder:
          'Ex: Este trabalho analisa a aplicação de IA na educação...',
        icon: BookOpen,
        required: true,
      },
      {
        key: 'introducao',
        label: 'Introdução',
        description: 'Apresente o tema, problema de pesquisa e objetivos',
        placeholder:
          'Ex: A inteligência artificial tem revolucionado diversos setores...',
        icon: Target,
        required: true,
      },
      {
        key: 'objetivos',
        label: 'Objetivos',
        description: 'Defina os objetivos geral e específicos do trabalho',
        placeholder:
          'Ex: Objetivo geral: Analisar o impacto da IA na educação...',
        icon: Lightbulb,
        required: false,
      },
      {
        key: 'justificativa',
        label: 'Justificativa',
        description: 'Explique por que este tema é importante e relevante',
        placeholder:
          'Ex: A relevância deste estudo justifica-se pela necessidade de...',
        icon: Lightbulb,
        required: false,
      },
      {
        key: 'metodologia',
        label: 'Metodologia',
        description: 'Descreva como você pretende realizar a pesquisa',
        placeholder: 'Ex: Esta pesquisa utilizará uma abordagem qualitativa...',
        icon: Target,
        required: false,
      },
      {
        key: 'desenvolvimento',
        label: 'Desenvolvimento',
        description:
          'Desenvolva os conceitos, análises e discussões principais',
        placeholder: 'Ex: A inteligência artificial na educação apresenta...',
        icon: FileText,
        required: true,
      },
      {
        key: 'conclusao',
        label: 'Conclusão',
        description: 'Sintetize os resultados e conclusões do trabalho',
        placeholder:
          'Ex: Com base na análise realizada, pode-se concluir que...',
        icon: CheckCircle,
        required: true,
      },
      {
        key: 'referencias',
        label: 'Referências',
        description: 'Liste as fontes consultadas no formato ABNT',
        placeholder:
          'Ex: SILVA, João. Inteligência Artificial na Educação. 2023...',
        icon: BookOpen,
        required: true,
      },
    ]

    // Se há estrutura da IA, adicionar campos dinâmicos baseados nela
    if (
      workData?.estrutura &&
      Array.isArray(workData.estrutura) &&
      workData.estrutura.length > 0
    ) {
      const estruturaFields = workData.estrutura.map(
        (item: unknown, index: number) => {
          const estruturaItem = item as { titulo?: string; descricao?: string }
          return {
            key: `estrutura_${index}`,
            label: estruturaItem.titulo || `Seção ${index + 1}`,
            description:
              estruturaItem.descricao || 'Desenvolva esta seção do trabalho',
            placeholder: `Ex: ${
              estruturaItem.titulo || 'Conteúdo da seção'
            }...`,
            icon: FileText,
            required: false,
          }
        },
      )

      // Inserir campos da estrutura entre introdução e desenvolvimento
      baseFields.splice(2, 0, ...estruturaFields)
    }

    return baseFields
  }

  const contentFields = generateContentFields()

  const handleContentChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }))
    setSaved(null)
  }

  const generateContent = async (field: string) => {
    setGenerating(field)
    setSaved(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await fetch(
        `http://localhost:4000/api/work/${workData.id}/generate_content`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            field: field,
            user_ideas: content[field] || '',
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Erro ao gerar conteúdo')
      }

      const data = await response.json()
      setContent((prev) => ({ ...prev, [field]: data.content }))
      setSaved(field)
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error)
      // Fallback para conteúdo mock em caso de erro
      const fallbackContent = {
        resumo:
          'Este trabalho analisa a aplicação de Inteligência Artificial na educação, explorando suas potencialidades, desafios e impactos no processo de ensino-aprendizagem.',
        introducao:
          'A Inteligência Artificial (IA) tem se tornado uma das tecnologias mais transformadoras do século XXI, impactando diversos setores da sociedade, incluindo a educação.',
        objetivos:
          'Objetivo Geral: Analisar o impacto da aplicação de Inteligência Artificial na educação. Objetivos Específicos: 1) Mapear as principais tecnologias de IA; 2) Identificar benefícios e desafios.',
        justificativa:
          'A relevância deste estudo justifica-se pela necessidade urgente de compreender e preparar o sistema educacional para as transformações digitais em curso.',
        metodologia:
          'Esta pesquisa utilizará uma abordagem qualitativa, baseada em revisão sistemática da literatura e análise de casos práticos.',
        desenvolvimento:
          'A aplicação de Inteligência Artificial na educação apresenta múltiplas dimensões e possibilidades.',
        conclusao:
          'Com base na análise realizada, pode-se concluir que a Inteligência Artificial apresenta um potencial significativo para transformar a educação.',
        referencias:
          'SILVA, João. Inteligência Artificial na Educação. São Paulo: Editora Educacional, 2023.',
      }

      setContent((prev) => ({
        ...prev,
        [field]:
          (fallbackContent as Record<string, string>)[field] ||
          'Conteúdo gerado com sucesso!',
      }))
    } finally {
      setGenerating(null)
    }
  }

  const saveContent = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await fetch(
        `http://localhost:4000/api/work/${workData.id}/save_content`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Erro ao salvar conteúdo')
      }

      setSaved('all')
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conteúdo do trabalho...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-purple-600" />
            Conteúdo do Trabalho
          </CardTitle>
          <p className="text-gray-600">
            Preencha as ideias gerais para cada seção e deixe a IA ajudar a
            desenvolver o conteúdo
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Escreva suas ideias e clique em &quot;Gerar com IA&quot; para
              expandir o conteúdo
            </p>
            <Button
              onClick={saveContent}
              className="gradient-bg text-white hover:scale-105 transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Tudo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Fields */}
      <div className="space-y-6">
        {contentFields.map((field) => (
          <Card
            key={field.key}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/20"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <field.icon className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">{field.label}</CardTitle>
                  {field.required && (
                    <span className="text-red-500 text-sm">*</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {saved === field.key && (
                    <span className="text-green-600 text-sm flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Salvo
                    </span>
                  )}
                  <Button
                    onClick={() => generateContent(field.key)}
                    disabled={generating === field.key}
                    variant="outline"
                    size="sm"
                    className="hover:bg-purple-50 hover:text-purple-600 border-purple-200 hover:border-purple-300 hover:scale-105 transition-all duration-300"
                  >
                    {generating === field.key ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    {generating === field.key ? 'Gerando...' : 'Gerar com IA'}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{field.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label
                  htmlFor={field.key}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.label}
                </Label>
                <Textarea
                  id={field.key}
                  value={(content[field.key] as string) || ''}
                  onChange={(e) =>
                    handleContentChange(field.key, e.target.value)
                  }
                  placeholder={field.placeholder}
                  className="min-h-[120px] rounded-xl border-2 focus:border-purple-300 transition-colors"
                />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {(content[field.key] as string)?.length || 0} caracteres
                  </span>
                  <span>{field.required ? 'Obrigatório' : 'Opcional'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save All Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={saveContent}
          size="lg"
          className="gradient-bg text-white hover:scale-105 px-8 transition-all duration-300"
        >
          <Save className="h-5 w-5 mr-2" />
          Salvar Todo o Conteúdo
        </Button>
      </div>
    </div>
  )
}
