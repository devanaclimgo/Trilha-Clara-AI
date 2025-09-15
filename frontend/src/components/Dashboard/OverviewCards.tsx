'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BookOpen, Edit3, Calendar, FileText, Eye } from 'lucide-react'
import LoadingStatus from './LoadingStatus'

interface OverviewCardsProps {
  onViewExplanation: () => void
  onViewStructure: () => void
  onViewTimeline: () => void
  hasData: boolean
  workData?: {
    titulo: string
    curso: string
    tipoTrabalho: string
    tema?: string
    status: string
  }
  loadingStates?: {
    explanation: { isLoading: boolean; isCompleted: boolean }
    structure: { isLoading: boolean; isCompleted: boolean }
    timeline: { isLoading: boolean; isCompleted: boolean }
  }
}

export default function OverviewCards({
  onViewExplanation,
  onViewStructure,
  onViewTimeline,
  hasData,
  workData,
  loadingStates,
}: OverviewCardsProps) {
  const cards = [
    {
      title: 'Explicação Simplificada',
      description: 'Entenda o que o professor pediu de forma clara e objetiva',
      icon: BookOpen,
      onClick: onViewExplanation,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:border-blue-300 hover:text-blue-600',
      loadingKey: 'explanation' as const,
    },
    {
      title: 'Estrutura Sugerida',
      description: 'Veja como organizar seu TCC com a estrutura recomendada',
      icon: Edit3,
      onClick: onViewStructure,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:border-purple-300 hover:text-purple-600',
      loadingKey: 'structure' as const,
    },
    {
      title: 'Cronograma',
      description: 'Acompanhe suas atividades e prazos de forma organizada',
      icon: Calendar,
      onClick: onViewTimeline,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:border-green-300 hover:text-green-600',
      loadingKey: 'timeline' as const,
    },
  ]

  if (!hasData) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-6">Visão Geral</h2>
        <div className="text-center py-12 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/20">
          <div className="p-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {workData?.status === 'novo'
              ? 'Inicie seu trabalho'
              : 'Crie um trabalho primeiro'}
          </h3>
          <p className="text-gray-600">
            {workData?.status === 'novo'
              ? `Clique em "Iniciar" no trabalho "${workData.titulo}" para começar a preencher as informações e gerar conteúdo com IA.`
              : 'Para visualizar a estrutura, cronograma e explicação, você precisa criar um trabalho acadêmico.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold gradient-text mb-6">Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`bg-gradient-to-br ${card.bgColor} border ${card.borderColor} hover:shadow-xl transition-all duration-300 cursor-pointer group`}
            onClick={card.onClick}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-r ${card.color} shadow-lg flex-shrink-0`}
                >
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors mb-2">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed text-sm mb-3">
                    {card.description}
                  </CardDescription>
                  {loadingStates && (
                    <div className="flex justify-end">
                      <LoadingStatus
                        isLoading={loadingStates[card.loadingKey].isLoading}
                        isCompleted={loadingStates[card.loadingKey].isCompleted}
                        loadingText="IA gerando..."
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              <Button
                variant="outline"
                size="sm"
                className={`w-full border-2 ${card.borderColor} hover:bg-white/50 transition-all duration-300 group-hover:scale-105 ${card.hoverColor}`}
                onClick={(e) => {
                  e.stopPropagation()
                  card.onClick()
                }}
              >
                <Eye className={`h-4 w-4 mr-2 ${card.hoverColor}`} />
                Visualizar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
