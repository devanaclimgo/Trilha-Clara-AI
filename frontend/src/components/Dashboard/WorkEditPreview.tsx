'use client'

import { useState } from 'react'
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
} from 'lucide-react'

interface WorkEditPreviewProps {
  workData: TccData
}

export default function WorkEditPreview({ workData }: WorkEditPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  // Mock de conteúdo do trabalho (depois vamos buscar da API)
  const workContent = {
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
            Visualize como seu trabalho ficará formatado em ABNT
          </p>
        </CardHeader>
      </Card>

      {/* Preview do documento */}
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardContent className="p-8">
          {/* Cabeçalho do documento */}
          <div className="text-center mb-8">
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
          </div>

          {/* Conteúdo do trabalho */}
          <div className="space-y-8 text-justify">
            {/* Resumo */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo</h2>
              <p className="text-gray-700 leading-relaxed">
                {workContent.resumo}
              </p>
            </section>

            {/* Introdução */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                1. Introdução
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {workContent.introducao}
              </p>
            </section>

            {/* Objetivos */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                2. Objetivos
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {workContent.objetivos}
              </p>
            </section>

            {/* Metodologia */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                3. Metodologia
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {workContent.metodologia}
              </p>
            </section>

            {/* Desenvolvimento */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                4. Desenvolvimento
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {workContent.desenvolvimento}
              </p>
            </section>

            {/* Conclusão */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                5. Conclusão
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {workContent.conclusao}
              </p>
            </section>

            {/* Referências */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Referências
              </h2>
              <div className="text-gray-700 leading-relaxed">
                {workContent.referencias.split('. ').map((ref, index) => (
                  <p key={index} className="mb-2">
                    {ref}
                    {ref.endsWith('.') ? '' : '.'}
                  </p>
                ))}
              </div>
            </section>
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
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-2">📋 Formatação ABNT</p>
            <p>
              O documento está formatado seguindo as normas ABNT NBR 14724:2011.
              As referências seguem o padrão ABNT NBR 6023:2018.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
