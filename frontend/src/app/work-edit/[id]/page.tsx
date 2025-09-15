'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, FileText, Download, Eye } from 'lucide-react'
import { TccData } from '@/types/tcc'
import WorkEditBasicInfo from '@/components/Dashboard/WorkEditBasicInfo'
import WorkEditContent from '@/components/Dashboard/WorkEditContent'
import WorkEditPreview from '@/components/Dashboard/WorkEditPreview'

export default function WorkEditPage() {
  const params = useParams()
  const router = useRouter()
  const workId = params.id as string

  const [workData, setWorkData] = useState<TccData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    // Buscar dados do trabalho
    const fetchWorkData = async () => {
      try {
        // Simular busca dos dados (depois vamos implementar a API real)
        const mockData: TccData = {
          id: workId,
          titulo: 'TCC sobre Inteligência Artificial',
          tema: 'Aplicação de Inteligência Artificial na Educação: Desafios e Oportunidades',
          tipoTrabalho: 'tcc',
          curso: 'desenvolvimento-de-sistemas',
          nomeAluno: 'João Silva',
          instituicao: 'Universidade Federal',
          orientador: 'Dr. Maria Santos',
          status: 'em_andamento',
          progresso: 45,
          dataCriacao: new Date().toISOString(),
          explicacao: [],
          estrutura: [],
          cronograma: [],
          sugestoes: [],
          dica: '',
          ultimaModificacao: new Date().toISOString(),
        }
        setWorkData(mockData)
      } catch (error) {
        console.error('Erro ao buscar dados do trabalho:', error)
      } finally {
        setLoading(false)
      }
    }

    if (workId) {
      fetchWorkData()
    }
  }, [workId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do trabalho...</p>
        </div>
      </div>
    )
  }

  if (!workData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Trabalho não encontrado
          </h1>
          <Button
            onClick={() => router.push('/dashboard')}
            className="gradient-bg text-white hover:scale-105 transition-all duration-300"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="hover:bg-purple-50 border border-purple-200 hover:border-purple-300 hover:text-purple-600 hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  {workData.titulo}
                </h1>
                <p className="text-gray-600 text-sm">
                  Editando trabalho acadêmico
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hover:bg-purple-50 hover:text-purple-600 border border-purple-200 hover:border-purple-300 hover:scale-105 transition-all duration-300"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button className="gradient-bg text-white hover:scale-105 transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
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
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 backdrop-blur-sm">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Dados Básicos
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-600" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <WorkEditBasicInfo workData={workData} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <WorkEditContent workData={workData} />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <WorkEditPreview workData={workData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
