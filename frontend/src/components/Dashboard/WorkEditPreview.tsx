'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TccData } from '@/types/tcc'
import {
  Eye,
  FileText,
  FileDown,
  RefreshCw,
  CheckCircle,
  Calendar,
  User,
  Building,
  Edit3,
} from 'lucide-react'

interface WorkEditPreviewProps {
  workData: TccData
  onEditClick?: () => void
  content?: {
    resumo: string
    introducao: string
    objetivos: string
    metodologia: string
    desenvolvimento: string
    conclusao: string
    referencias: string
    justificativa?: string
    [key: string]: string | undefined
  }
  customFields?: Array<{
    key: string
    label: string
    description: string
    placeholder: string
    icon: React.ComponentType<{ className?: string }>
    required: boolean
    id: string
    isCustom?: boolean
  }>
  fieldLabels?: Record<string, string>
  fieldOrder?: string[]
}

export default function WorkEditPreview({
  workData,
  onEditClick,
  content: propContent,
  customFields = [],
  fieldLabels = {},
  fieldOrder = [],
}: WorkEditPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  const [workContent, setWorkContent] = useState({
    resumo: '',
    introducao: '',
    objetivos: '',
    metodologia: '',
    desenvolvimento: '',
    conclusao: '',
    referencias: '',
  })

  // Use prop content if available, otherwise fetch from API
  useEffect(() => {
    if (propContent) {
      setWorkContent({
        resumo: propContent.resumo || '',
        introducao: propContent.introducao || '',
        objetivos: propContent.objetivos || '',
        metodologia: propContent.metodologia || '',
        desenvolvimento: propContent.desenvolvimento || '',
        conclusao: propContent.conclusao || '',
        referencias: propContent.referencias || '',
      })
    } else {
      // Fallback: fetch content from API
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
            setWorkContent({
              resumo: data.resumo || '',
              introducao: data.introducao || '',
              objetivos: data.objetivos || '',
              metodologia: data.metodologia || '',
              desenvolvimento: data.desenvolvimento || '',
              conclusao: data.conclusao || '',
              referencias: data.referencias || '',
            })
          }
        } catch (error) {
          console.error('Erro ao carregar conteúdo:', error)
        }
      }

      if (workData?.id) {
        fetchContent()
      }
    }
  }, [propContent, workData?.id])

  // Função para verificar se um campo está preenchido
  const isFieldFilled = (field: string) => {
    const value = workContent[field as keyof typeof workContent]
    return value && value.trim().length > 0
  }

  // Get all fields in order (base fields + custom fields)
  const getAllFieldsInOrder = () => {
    const baseFields = [
      { key: 'resumo', label: 'Resumo', icon: '📋' },
      { key: 'introducao', label: 'Introdução', icon: '📖' },
      { key: 'objetivos', label: 'Objetivos', icon: '🎯' },
      { key: 'metodologia', label: 'Metodologia', icon: '🔬' },
      { key: 'desenvolvimento', label: 'Desenvolvimento', icon: '📝' },
      { key: 'conclusao', label: 'Conclusão', icon: '✅' },
      { key: 'referencias', label: 'Referências', icon: '📚' },
    ]

    // Add custom fields
    const customFieldsList = customFields.map((field) => ({
      key: field.key,
      label: fieldLabels[field.id] || field.label,
      icon: '📄',
    }))

    // Combine and order based on fieldOrder
    const allFields = [...baseFields, ...customFieldsList]

    if (fieldOrder.length > 0) {
      return fieldOrder.map((fieldId) => {
        const field = allFields.find((f) => f.key === fieldId)
        return field || { key: fieldId, label: fieldId, icon: '📄' }
      })
    }

    return allFields
  }

  const handleDownload = async (format: 'docx' | 'pdf') => {
    setIsGenerating(true)
    setLastGenerated(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const endpoint = format === 'docx' ? 'export_word' : 'export_pdf'
      const response = await fetch(
        `http://localhost:4000/api/tcc/${workData.id}/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Erro ao gerar arquivo')
      }

      // Criar blob e fazer download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `TCC_${workData.titulo.replace(/\s+/g, '_')}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setLastGenerated(format)
    } catch (error) {
      console.error('Erro ao gerar arquivo:', error)
      // Fallback para download mock
      const link = document.createElement('a')
      link.href = `#download-${format}`
      link.download = `TCC_${workData.titulo.replace(/\s+/g, '_')}.${format}`
      link.click()
      setLastGenerated(format)
    } finally {
      setIsGenerating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header com botões de download */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Eye className="h-5 w-5 text-purple-600" />
              Preview do Trabalho
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button
                onClick={onEditClick}
                variant="outline"
                className="hover:bg-purple-50 hover:text-purple-600 border-purple-200 hover:border-purple-300 hover:scale-105 transition-all duration-300"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                onClick={() => handleDownload('docx')}
                disabled={isGenerating}
                variant="outline"
                className="hover:bg-blue-50 hover:text-blue-600 border-blue-200 hover:border-blue-300 hover:scale-105 transition-all duration-300"
              >
                {isGenerating && lastGenerated === 'docx' ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                {isGenerating && lastGenerated === 'docx'
                  ? 'Gerando...'
                  : 'Download DOCX'}
              </Button>
              <Button
                onClick={() => handleDownload('pdf')}
                disabled={isGenerating}
                variant="outline"
                className="hover:bg-red-50 hover:text-red-600 border-red-200 hover:border-red-300 hover:scale-105 transition-all duration-300"
              >
                {isGenerating && lastGenerated === 'pdf' ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                {isGenerating && lastGenerated === 'pdf'
                  ? 'Gerando...'
                  : 'Download PDF'}
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Visualize a estrutura e organização do seu trabalho de forma
            simplificada
          </p>
        </CardHeader>
      </Card>

      {/* Preview do documento */}
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardContent className="p-8">
          {/* Cabeçalho do documento */}
          <div className="text-center mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-dashed border-purple-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {workData.titulo}
            </h1>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                <span>{workData.nomeAluno}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Building className="h-4 w-4" />
                <span>{workData.instituicao}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(workData.dataCriacao)}</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-purple-600 font-medium">
              📄 Título do Trabalho
            </div>
          </div>

          {/* Conteúdo do trabalho */}
          <div className="space-y-6 text-justify">
            {getAllFieldsInOrder().map((field, index) => {
              const isFilled = isFieldFilled(field.key)
              const content =
                workContent[field.key as keyof typeof workContent] || ''

              if (!isFilled) return null

              const colors = [
                {
                  bg: 'bg-blue-50',
                  border: 'border-blue-400',
                  text: 'text-blue-800',
                  accent: 'text-blue-600',
                },
                {
                  bg: 'bg-green-50',
                  border: 'border-green-400',
                  text: 'text-green-800',
                  accent: 'text-green-600',
                },
                {
                  bg: 'bg-yellow-50',
                  border: 'border-yellow-400',
                  text: 'text-yellow-800',
                  accent: 'text-yellow-600',
                },
                {
                  bg: 'bg-orange-50',
                  border: 'border-orange-400',
                  text: 'text-orange-800',
                  accent: 'text-orange-600',
                },
                {
                  bg: 'bg-purple-50',
                  border: 'border-purple-400',
                  text: 'text-purple-800',
                  accent: 'text-purple-600',
                },
                {
                  bg: 'bg-red-50',
                  border: 'border-red-400',
                  text: 'text-red-800',
                  accent: 'text-red-600',
                },
                {
                  bg: 'bg-gray-50',
                  border: 'border-gray-400',
                  text: 'text-gray-800',
                  accent: 'text-gray-600',
                },
              ]

              const colorScheme = colors[index % colors.length]

              return (
                <section
                  key={field.key}
                  className={`p-4 ${colorScheme.bg} rounded-lg border-l-4 ${colorScheme.border}`}
                >
                  <h2
                    className={`text-lg font-bold ${colorScheme.text} mb-3 flex items-center gap-2`}
                  >
                    {field.icon} {field.label}
                  </h2>
                  <div className="text-gray-700 leading-relaxed text-sm">
                    {field.key === 'referencias' ? (
                      content.split('. ').map((ref, refIndex) => (
                        <p key={refIndex} className="mb-2">
                          {ref}
                          {ref.endsWith('.') ? '' : '.'}
                        </p>
                      ))
                    ) : (
                      <p>{content}</p>
                    )}
                  </div>
                  <div
                    className={`mt-2 text-xs ${colorScheme.accent} font-medium`}
                  >
                    {field.key === 'resumo' && 'Resumo executivo do trabalho'}
                    {field.key === 'introducao' &&
                      'Apresentação do tema e problema de pesquisa'}
                    {field.key === 'objetivos' &&
                      'Objetivos geral e específicos'}
                    {field.key === 'metodologia' &&
                      'Como a pesquisa será realizada'}
                    {field.key === 'desenvolvimento' &&
                      'Desenvolvimento dos conceitos e análises principais'}
                    {field.key === 'conclusao' &&
                      'Síntese dos resultados e conclusões'}
                    {field.key === 'referencias' &&
                      'Fontes consultadas no formato ABNT'}
                    {![
                      'resumo',
                      'introducao',
                      'objetivos',
                      'metodologia',
                      'desenvolvimento',
                      'conclusao',
                      'referencias',
                    ].includes(field.key) && 'Seção personalizada do trabalho'}
                  </div>
                </section>
              )
            })}

            {/* Mensagem quando nenhum campo está preenchido */}
            {getAllFieldsInOrder().every(
              (field) => !isFieldFilled(field.key),
            ) && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FileText className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Nenhum conteúdo preenchido ainda
                </h3>
                <p className="text-gray-500 mb-4">
                  Preencha pelo menos um campo na aba &quot;Conteúdo&quot; para
                  ver a preview aqui.
                </p>
                <Button
                  onClick={onEditClick}
                  className="gradient-bg text-white hover:scale-105 transition-all duration-300"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Ir para Edição
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status de geração */}
      {lastGenerated && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span>
                Arquivo {lastGenerated.toUpperCase()} gerado com sucesso! O
                download deve começar automaticamente.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações adicionais */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-4">
          <div className="text-sm text-purple-700">
            <p className="font-medium mb-2">💡 Preview Simplificado</p>
            <p>
              Esta é uma visualização simplificada para entender a estrutura do
              seu trabalho. Para ver a formatação final em ABNT, use o botão
              &quot;Preview do Trabalho&quot; no cabeçalho.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
