'use client'

import { useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

interface TimelineItem {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

export default function TimelineScreen() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    {
      id: '1',
      title: 'Definição do Tema',
      description: 'Escolher e delimitar o tema de pesquisa do TCC',
      dueDate: '2024-02-01',
      completed: true,
      priority: 'high',
    },
    {
      id: '2',
      title: 'Revisão Bibliográfica',
      description: 'Pesquisar e analisar referências teóricas relevantes',
      dueDate: '2024-02-15',
      completed: true,
      priority: 'high',
    },
    {
      id: '3',
      title: 'Elaboração do Projeto',
      description: 'Desenvolver o projeto de pesquisa com metodologia',
      dueDate: '2024-03-01',
      completed: true,
      priority: 'high',
    },
    {
      id: '4',
      title: 'Coleta de Dados',
      description: 'Realizar pesquisa de campo e coleta de informações',
      dueDate: '2024-03-30',
      completed: false,
      priority: 'high',
    },
    {
      id: '5',
      title: 'Análise dos Dados',
      description: 'Processar e analisar os dados coletados',
      dueDate: '2024-04-15',
      completed: false,
      priority: 'medium',
    },
    {
      id: '6',
      title: 'Redação do TCC',
      description: 'Escrever a versão completa do trabalho',
      dueDate: '2024-05-15',
      completed: false,
      priority: 'high',
    },
    {
      id: '7',
      title: 'Revisão e Formatação',
      description: 'Revisar texto e aplicar normas ABNT',
      dueDate: '2024-05-30',
      completed: false,
      priority: 'medium',
    },
    {
      id: '8',
      title: 'Preparação da Apresentação',
      description: 'Criar slides e preparar defesa oral',
      dueDate: '2024-06-10',
      completed: false,
      priority: 'medium',
    },
    {
      id: '9',
      title: 'Defesa do TCC',
      description: 'Apresentação final para a banca examinadora',
      dueDate: '2024-06-20',
      completed: false,
      priority: 'high',
    },
  ])

  const completedItems = timelineItems.filter((item) => item.completed).length
  const totalItems = timelineItems.length
  const progressPercentage = Math.round((completedItems / totalItems) * 100)

  const toggleItemCompletion = (id: string) => {
    setTimelineItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    )
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <Badge variant="destructive" className="text-xs">
            Alta
          </Badge>
        )
      case 'medium':
        return (
          <Badge variant="secondary" className="text-xs">
            Média
          </Badge>
        )
      case 'low':
        return (
          <Badge variant="outline" className="text-xs">
            Baixa
          </Badge>
        )
      default:
        return null
    }
  }

  const handleExport = () => {
    // Placeholder for export functionality
    console.log('Exportando cronograma...')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">
            Cronograma do TCC
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e gerencie prazos
          </p>
        </div>

        <Button
          onClick={handleExport}
          variant="outline"
          className="rounded-xl bg-transparent"
        >
          <Download className="size-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5 text-chart-1" />
              Progresso Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Concluído</span>
                <span>{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedItems} de {totalItems} etapas concluídas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-chart-2" />
              Próxima Etapa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const nextItem = timelineItems.find((item) => !item.completed)
              return nextItem ? (
                <div className="space-y-2">
                  <p className="font-medium text-sm">{nextItem.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Prazo:{' '}
                    {new Date(nextItem.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                  {getPriorityBadge(nextItem.priority)}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Todas as etapas concluídas! 🎉
                </p>
              )
            })()}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-chart-3" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Etapas restantes:</span>
                <span className="font-medium">
                  {totalItems - completedItems}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Alta prioridade:</span>
                <span className="font-medium text-red-500">
                  {
                    timelineItems.filter(
                      (item) => !item.completed && item.priority === 'high',
                    ).length
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Cronograma Detalhado</CardTitle>
          <CardDescription>
            Marque as etapas conforme você as completa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                  item.completed
                    ? 'bg-muted/50 border-muted'
                    : 'bg-background hover:bg-muted/30 border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItemCompletion(item.id)}
                      className="size-5"
                    />
                    {index < timelineItems.length - 1 && (
                      <div
                        className={`w-px h-8 mt-2 ${
                          item.completed ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-center size-8 rounded-full bg-muted">
                    {item.completed ? (
                      <CheckCircle2 className="size-4 text-primary" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-medium ${
                        item.completed
                          ? 'text-muted-foreground line-through'
                          : ''
                      }`}
                    >
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(item.priority)}
                      <Badge variant="outline" className="text-xs">
                        {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                  </div>
                  <p
                    className={`text-sm ${
                      item.completed
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
