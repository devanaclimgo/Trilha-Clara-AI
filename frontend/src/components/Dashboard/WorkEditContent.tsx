'use client'

import { useState } from 'react'
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
}

export default function WorkEditContent({ }: WorkEditContentProps) {
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

  const [generating, setGenerating] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  const contentFields = [
    {
      key: 'resumo' as keyof WorkContent,
      label: 'Resumo',
      description:
        'Escreva as principais ideias do seu trabalho em poucas palavras',
      placeholder: 'Ex: Este trabalho analisa a aplicação de IA na educação...',
      icon: BookOpen,
      required: true,
    },
    {
      key: 'introducao' as keyof WorkContent,
      label: 'Introdução',
      description: 'Apresente o tema, problema de pesquisa e objetivos',
      placeholder:
        'Ex: A inteligência artificial tem revolucionado diversos setores...',
      icon: Target,
      required: true,
    },
    {
      key: 'objetivos' as keyof WorkContent,
      label: 'Objetivos',
      description: 'Defina os objetivos geral e específicos do trabalho',
      placeholder:
        'Ex: Objetivo geral: Analisar o impacto da IA na educação...',
      icon: Lightbulb,
      required: false,
    },
    {
      key: 'justificativa' as keyof WorkContent,
      label: 'Justificativa',
      description: 'Explique por que este tema é importante e relevante',
      placeholder:
        'Ex: A relevância deste estudo justifica-se pela necessidade de...',
      icon: Lightbulb,
      required: false,
    },
    {
      key: 'metodologia' as keyof WorkContent,
      label: 'Metodologia',
      description: 'Descreva como você pretende realizar a pesquisa',
      placeholder: 'Ex: Esta pesquisa utilizará uma abordagem qualitativa...',
      icon: Target,
      required: false,
    },
    {
      key: 'desenvolvimento' as keyof WorkContent,
      label: 'Desenvolvimento',
      description: 'Desenvolva os conceitos, análises e discussões principais',
      placeholder: 'Ex: A inteligência artificial na educação apresenta...',
      icon: FileText,
      required: true,
    },
    {
      key: 'conclusao' as keyof WorkContent,
      label: 'Conclusão',
      description: 'Sintetize os resultados e conclusões do trabalho',
      placeholder: 'Ex: Com base na análise realizada, pode-se concluir que...',
      icon: CheckCircle,
      required: true,
    },
    {
      key: 'referencias' as keyof WorkContent,
      label: 'Referências',
      description: 'Liste as fontes consultadas no formato ABNT',
      placeholder:
        'Ex: SILVA, João. Inteligência Artificial na Educação. 2023...',
      icon: BookOpen,
      required: true,
    },
  ]

  const handleContentChange = (key: keyof WorkContent, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }))
    setSaved(null)
  }

  const generateContent = async (field: keyof WorkContent) => {
    setGenerating(field)
    setSaved(null)

    try {
      // Simular chamada para IA (depois vamos implementar a API real)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock de conteúdo gerado pela IA
      const generatedContent = {
        resumo:
          'Este trabalho analisa a aplicação de Inteligência Artificial na educação, explorando suas potencialidades, desafios e impactos no processo de ensino-aprendizagem. A pesquisa demonstra como as tecnologias de IA podem personalizar o aprendizado, melhorar a eficiência educacional e preparar estudantes para um futuro digital. Através de revisão bibliográfica e análise de casos práticos, identificamos oportunidades significativas de implementação, bem como questões éticas e técnicas que precisam ser consideradas.',
        introducao:
          'A Inteligência Artificial (IA) tem se tornado uma das tecnologias mais transformadoras do século XXI, impactando diversos setores da sociedade, incluindo a educação. Com o avanço das tecnologias de machine learning, processamento de linguagem natural e sistemas adaptativos, novas possibilidades emergem para revolucionar como ensinamos e aprendemos. Este trabalho busca investigar como a IA pode ser aplicada de forma efetiva no contexto educacional, analisando tanto os benefícios quanto os desafios dessa integração.',
        objetivos:
          'Objetivo Geral: Analisar o impacto da aplicação de Inteligência Artificial na educação, identificando suas potencialidades, limitações e perspectivas futuras. Objetivos Específicos: 1) Mapear as principais tecnologias de IA aplicáveis ao contexto educacional; 2) Identificar benefícios e desafios da implementação de IA na educação; 3) Analisar casos práticos de sucesso em diferentes níveis educacionais; 4) Propor diretrizes para implementação ética e eficaz de IA na educação.',
        justificativa:
          'A relevância deste estudo justifica-se pela necessidade urgente de compreender e preparar o sistema educacional para as transformações digitais em curso. Com o crescimento exponencial das tecnologias de IA e sua crescente presença no cotidiano, torna-se fundamental investigar como essas ferramentas podem ser integradas de forma pedagógica e ética na educação.',
        metodologia:
          'Esta pesquisa utilizará uma abordagem qualitativa, baseada em revisão sistemática da literatura e análise de casos práticos. Serão analisados artigos científicos, relatórios técnicos e estudos de caso de implementação de IA na educação, com foco em experiências dos últimos cinco anos.',
        desenvolvimento:
          'A aplicação de Inteligência Artificial na educação apresenta múltiplas dimensões e possibilidades. Sistemas de tutoria inteligente podem adaptar o conteúdo às necessidades individuais de cada estudante, enquanto ferramentas de análise de dados educacionais oferecem insights valiosos sobre o processo de aprendizagem. Além disso, a IA pode automatizar tarefas administrativas, permitindo que educadores se concentrem no ensino e no relacionamento com os estudantes.',
        conclusao:
          'Com base na análise realizada, pode-se concluir que a Inteligência Artificial apresenta um potencial significativo para transformar a educação, oferecendo oportunidades de personalização, eficiência e inovação. No entanto, sua implementação requer cuidadosa consideração de aspectos éticos, técnicos e pedagógicos. O sucesso da integração de IA na educação dependerá da colaboração entre educadores, tecnólogos e formuladores de políticas, sempre priorizando o bem-estar e o desenvolvimento dos estudantes.',
        referencias:
          'SILVA, João. Inteligência Artificial na Educação: Desafios e Oportunidades. São Paulo: Editora Educacional, 2023. SANTOS, Maria. Tecnologias Emergentes e Aprendizagem Adaptativa. Revista de Educação Digital, v. 15, n. 2, p. 45-62, 2023. OLIVEIRA, Carlos. Ética e IA na Educação: Uma Perspectiva Crítica. Educação & Tecnologia, v. 8, n. 1, p. 78-95, 2023.',
      }

      setContent((prev) => ({ ...prev, [field]: generatedContent[field] }))
      setSaved(field)
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error)
    } finally {
      setGenerating(null)
    }
  }

  const saveContent = async () => {
    try {
      // Simular salvamento (depois vamos implementar a API real)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaved('all')
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error)
    }
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
              Escreva suas ideias e clique em &quot;Gerar com IA&quot; para expandir o
              conteúdo
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
                  value={content[field.key] || ''}
                  onChange={(e) =>
                    handleContentChange(field.key, e.target.value)
                  }
                  placeholder={field.placeholder}
                  className="min-h-[120px] rounded-xl border-2 focus:border-purple-300 transition-colors"
                />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{content[field.key]?.length || 0} caracteres</span>
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
