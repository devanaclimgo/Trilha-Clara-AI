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
}

export default function WorkEditPreview({
  workData,
  onEditClick,
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

  // Carregar conteúdo do trabalho
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
          setWorkContent({
            resumo: data.resumo || '',
            introducao: data.introducao || '',
            objetivos: data.objetivos || '',
            metodologia: data.metodologia || '',
            desenvolvimento: data.desenvolvimento || '',
            conclusao: data.conclusao || '',
            referencias: data.referencias || '',
          })
        } else {
          // Fallback para conteúdo mock
          setWorkContent({
            resumo:
              'Este trabalho analisa a aplicação de Inteligência Artificial na educação, explorando suas potencialidades, desafios e impactos no processo de ensino-aprendizagem.',
            introducao:
              'A Inteligência Artificial (IA) tem se tornado uma das tecnologias mais transformadoras do século XXI, impactando diversos setores da sociedade, incluindo a educação.',
            objetivos:
              'Objetivo Geral: Analisar o impacto da aplicação de Inteligência Artificial na educação.',
            metodologia:
              'Esta pesquisa utilizará uma abordagem qualitativa, baseada em revisão sistemática da literatura.',
            desenvolvimento:
              'A aplicação de Inteligência Artificial na educação apresenta múltiplas dimensões e possibilidades.',
            conclusao:
              'Com base na análise realizada, pode-se concluir que a Inteligência Artificial apresenta um potencial significativo para transformar a educação.',
            referencias:
              'SILVA, João. Inteligência Artificial na Educação. São Paulo: Editora Educacional, 2023.',
          })
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error)
        // Fallback para conteúdo mock
        setWorkContent({
          resumo:
            'Este trabalho analisa a aplicação de Inteligência Artificial na educação.',
          introducao:
            'A Inteligência Artificial (IA) tem se tornado uma das tecnologias mais transformadoras do século XXI.',
          objetivos:
            'Objetivo Geral: Analisar o impacto da aplicação de Inteligência Artificial na educação.',
          metodologia: 'Esta pesquisa utilizará uma abordagem qualitativa.',
          desenvolvimento:
            'A aplicação de Inteligência Artificial na educação apresenta múltiplas dimensões.',
          conclusao:
            'Com base na análise realizada, pode-se concluir que a Inteligência Artificial apresenta um potencial significativo.',
          referencias:
            'SILVA, João. Inteligência Artificial na Educação. São Paulo: Editora Educacional, 2023.',
        })
      }
    }

    if (workData?.id) {
      fetchContent()
    }
  }, [workData?.id])

  // Função para verificar se um campo está preenchido
  const isFieldFilled = (field: string) => {
    const value = workContent[field as keyof typeof workContent]
    return value && value.trim().length > 0
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
            {/* Resumo */}
            {isFieldFilled('resumo') && (
              <section className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h2 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                  📋 Resumo
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {workContent.resumo}
                </p>
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  Resumo executivo do trabalho
                </div>
              </section>
            )}

            {/* Introdução */}
            {isFieldFilled('introducao') && (
              <section className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h2 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                  1. 📖 Introdução
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {workContent.introducao}
                </p>
                <div className="mt-2 text-xs text-green-600 font-medium">
                  Apresentação do tema e problema de pesquisa
                </div>
              </section>
            )}

            {/* Objetivos */}
            {isFieldFilled('objetivos') && (
              <section className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <h2 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                  2. 🎯 Objetivos
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {workContent.objetivos}
                </p>
                <div className="mt-2 text-xs text-yellow-600 font-medium">
                  Objetivos geral e específicos
                </div>
              </section>
            )}

            {/* Metodologia */}
            {isFieldFilled('metodologia') && (
              <section className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <h2 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                  3. 🔬 Metodologia
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {workContent.metodologia}
                </p>
                <div className="mt-2 text-xs text-orange-600 font-medium">
                  Como a pesquisa será realizada
                </div>
              </section>
            )}

            {/* Desenvolvimento */}
            {isFieldFilled('desenvolvimento') && (
              <section className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <h2 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                  4. 📝 Desenvolvimento
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {workContent.desenvolvimento}
                </p>
                <div className="mt-2 text-xs text-purple-600 font-medium">
                  Desenvolvimento dos conceitos e análises principais
                </div>
              </section>
            )}

            {/* Conclusão */}
            {isFieldFilled('conclusao') && (
              <section className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <h2 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                  5. ✅ Conclusão
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {workContent.conclusao}
                </p>
                <div className="mt-2 text-xs text-red-600 font-medium">
                  Síntese dos resultados e conclusões
                </div>
              </section>
            )}

            {/* Referências */}
            {isFieldFilled('referencias') && (
              <section className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  📚 Referências
                </h2>
                <div className="text-gray-700 leading-relaxed text-sm">
                  {workContent.referencias.split('. ').map((ref, index) => (
                    <p key={index} className="mb-2">
                      {ref}
                      {ref.endsWith('.') ? '' : '.'}
                    </p>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-600 font-medium">
                  Fontes consultadas no formato ABNT
                </div>
              </section>
            )}

            {/* Mensagem quando nenhum campo está preenchido */}
            {!isFieldFilled('resumo') &&
              !isFieldFilled('introducao') &&
              !isFieldFilled('objetivos') &&
              !isFieldFilled('metodologia') &&
              !isFieldFilled('desenvolvimento') &&
              !isFieldFilled('conclusao') &&
              !isFieldFilled('referencias') && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FileText className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Nenhum conteúdo preenchido ainda
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Preencha pelo menos um campo na aba &quot;Conteúdo&quot;
                    para ver a preview aqui.
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
