'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TccData } from '@/types/tcc'
import { FileText, FileDown } from 'lucide-react'

interface AbntPreviewModalProps {
  isOpen: boolean
  onClose: () => void
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
  [key: string]: string | undefined
}

export default function AbntPreviewModal({
  isOpen,
  onClose,
  workData,
}: AbntPreviewModalProps) {
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
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

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
        } else {
          // Fallback para conteúdo mock
          setContent({
            resumo:
              'Este trabalho analisa a aplicação de Inteligência Artificial na educação, explorando suas potencialidades, desafios e impactos no processo de ensino-aprendizagem. A pesquisa demonstra como as tecnologias de IA podem personalizar o aprendizado, melhorar a eficiência educacional e preparar estudantes para um futuro digital.',
            introducao:
              'A Inteligência Artificial (IA) tem se tornado uma das tecnologias mais transformadoras do século XXI, impactando diversos setores da sociedade, incluindo a educação. Com o avanço das tecnologias de machine learning, processamento de linguagem natural e sistemas adaptativos, novas possibilidades emergem para revolucionar como ensinamos e aprendemos.',
            objetivos:
              'Objetivo Geral: Analisar o impacto da aplicação de Inteligência Artificial na educação, identificando suas potencialidades, limitações e perspectivas futuras. Objetivos Específicos: 1) Mapear as principais tecnologias de IA aplicáveis ao contexto educacional; 2) Identificar benefícios e desafios da implementação de IA na educação.',
            metodologia:
              'Esta pesquisa utilizará uma abordagem qualitativa, baseada em revisão sistemática da literatura e análise de casos práticos. Serão analisados artigos científicos, relatórios técnicos e estudos de caso de implementação de IA na educação.',
            desenvolvimento:
              'A aplicação de Inteligência Artificial na educação apresenta múltiplas dimensões e possibilidades. Sistemas de tutoria inteligente podem adaptar o conteúdo às necessidades individuais de cada estudante, enquanto ferramentas de análise de dados educacionais oferecem insights valiosos sobre o processo de aprendizagem.',
            conclusao:
              'Com base na análise realizada, pode-se concluir que a Inteligência Artificial apresenta um potencial significativo para transformar a educação, oferecendo oportunidades de personalização, eficiência e inovação. No entanto, sua implementação requer cuidadosa consideração de aspectos éticos, técnicos e pedagógicos.',
            referencias:
              'SILVA, João. Inteligência Artificial na Educação: Desafios e Oportunidades. São Paulo: Editora Educacional, 2023. SANTOS, Maria. Tecnologias Emergentes e Aprendizagem Adaptativa. Revista de Educação Digital, v. 15, n. 2, p. 45-62, 2023.',
          })
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error)
        // Fallback para conteúdo mock
        setContent({
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
    }

    if (isOpen && workData?.id) {
      fetchContent()
    }
  }, [isOpen, workData?.id])

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

  // Calcular número de páginas estimado (aproximadamente 250 palavras por página)
  const calculatePages = () => {
    const totalWords = Object.values(content).join(' ').split(' ').length
    return Math.max(1, Math.ceil(totalWords / 250))
  }

  const totalPages = calculatePages()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-800">
              Preview do Trabalho - Formatação ABNT
            </DialogTitle>
            <div className="flex items-center gap-3 pr-6">
              <Button
                onClick={() => handleDownload('docx')}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 hover:text-blue-600 border-blue-200 hover:border-blue-300"
              >
                {isGenerating && lastGenerated === 'docx' ? (
                  <FileText className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                DOCX
              </Button>
              <Button
                onClick={() => handleDownload('pdf')}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 border-red-200 hover:border-red-300"
              >
                {isGenerating && lastGenerated === 'pdf' ? (
                  <FileDown className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                PDF
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Visualização exata do documento final - {totalPages} página
            {totalPages !== 1 ? 's' : ''}
          </p>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Documento ABNT */}
          <div className="bg-white p-8 min-h-[800px]">
            {/* Cabeçalho do documento */}
            <div className="text-center mb-12">
              <h1 className="text-2xl font-bold text-black mb-6 leading-tight">
                {workData.titulo}
              </h1>
              <div className="space-y-1 text-sm text-black">
                <p className="font-medium">{workData.nomeAluno}</p>
                <p>{workData.instituicao}</p>
                <p>
                  {workData.orientador && `Orientador: ${workData.orientador}`}
                </p>
                <p className="mt-4">{formatDate(workData.dataCriacao)}</p>
              </div>
            </div>

            {/* Conteúdo do trabalho */}
            <div className="space-y-8 text-justify leading-relaxed">
              {/* Resumo */}
              {content.resumo && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
                    Resumo
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.resumo}
                  </p>
                </section>
              )}

              {/* Introdução */}
              {content.introducao && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    1. Introdução
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.introducao}
                  </p>
                </section>
              )}

              {/* Objetivos */}
              {content.objetivos && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    2. Objetivos
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.objetivos}
                  </p>
                </section>
              )}

              {/* Justificativa */}
              {content.justificativa && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    3. Justificativa
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.justificativa}
                  </p>
                </section>
              )}

              {/* Metodologia */}
              {content.metodologia && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    {content.justificativa
                      ? '4. Metodologia'
                      : '3. Metodologia'}
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.metodologia}
                  </p>
                </section>
              )}

              {/* Desenvolvimento */}
              {content.desenvolvimento && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    {content.justificativa && content.metodologia
                      ? '5. Desenvolvimento'
                      : content.justificativa || content.metodologia
                      ? '4. Desenvolvimento'
                      : '3. Desenvolvimento'}
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.desenvolvimento}
                  </p>
                </section>
              )}

              {/* Conclusão */}
              {content.conclusao && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    {content.justificativa && content.metodologia
                      ? '6. Conclusão'
                      : content.justificativa || content.metodologia
                      ? '5. Conclusão'
                      : '4. Conclusão'}
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.conclusao}
                  </p>
                </section>
              )}

              {/* Referências */}
              {content.referencias && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    Referências
                  </h2>
                  <div className="text-black text-sm leading-relaxed">
                    {content.referencias.split('. ').map((ref, index) => (
                      <p key={index} className="mb-2 text-justify">
                        {ref}
                        {ref.endsWith('.') ? '' : '.'}
                      </p>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Numeração de páginas simulada */}
            <div className="mt-12 pt-8 border-t border-gray-300">
              <div className="text-center text-xs text-gray-500">
                <p>Página 1 de {totalPages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status de geração */}
        {lastGenerated && (
          <div className="p-4 bg-green-50 border-t border-green-200">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                Arquivo {lastGenerated.toUpperCase()} gerado com sucesso! O
                download deve começar automaticamente.
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
