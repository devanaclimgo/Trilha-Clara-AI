import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Check } from 'lucide-react'

export default function TimelineScreen() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([1, 2])

  const atividades = [
    {
      id: 1,
      semana: 1,
      atividade: 'Escolher tema e delimitar problema',
      categoria: 'Planejamento',
    },
    {
      id: 2,
      semana: 2,
      atividade: 'Levantar referências bibliográficas',
      categoria: 'Pesquisa',
    },
    {
      id: 3,
      semana: 3,
      atividade: 'Escrever introdução e justificativa',
      categoria: 'Redação',
    },
    {
      id: 4,
      semana: 4,
      atividade: 'Redigir metodologia da pesquisa',
      categoria: 'Metodologia',
    },
    {
      id: 5,
      semana: 5,
      atividade: 'Desenvolver revisão bibliográfica',
      categoria: 'Pesquisa',
    },
    {
      id: 6,
      semana: 6,
      atividade: 'Aplicar instrumentos de coleta',
      categoria: 'Coleta de Dados',
    },
    {
      id: 7,
      semana: 7,
      atividade: 'Analisar dados coletados',
      categoria: 'Análise',
    },
    {
      id: 8,
      semana: 8,
      atividade: 'Escrever resultados e discussão',
      categoria: 'Redação',
    },
    {
      id: 9,
      semana: 9,
      atividade: 'Elaborar conclusões',
      categoria: 'Redação',
    },
    {
      id: 10,
      semana: 10,
      atividade: 'Revisão final e formatação ABNT',
      categoria: 'Finalização',
    },
  ]

  const toggleTask = (taskId: number) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    )
  }

  const progresso = (completedTasks.length / atividades.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold gradient-text">Cronograma do TCC</h2>
        <p className="text-muted-foreground">Acompanhe seu progresso semanal</p>
      </div>

      <Card className="rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-gray-700">Progresso Geral</span>
            <span className="font-bold gradient-text text-xl">
              {Math.round(progresso)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div
              className="gradient-bg h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
              style={{ width: `${progresso}%` }}
            >
              {progresso > 15 && (
                <span className="text-white text-sm font-medium">
                  {completedTasks.length}/{atividades.length}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {atividades.map((item) => {
          const isCompleted = completedTasks.includes(item.id)
          return (
            <Card
              key={item.id}
              className={`rounded-2xl shadow-lg backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                isCompleted
                  ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200'
                  : 'bg-white/80 hover:bg-white/90'
              }`}
              onClick={() => toggleTask(item.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'gradient-bg text-white'
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : item.semana}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`font-bold ${
                          isCompleted ? 'text-green-800' : 'text-gray-700'
                        }`}
                      >
                        Semana {item.semana}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          isCompleted
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {item.categoria}
                      </span>
                    </div>
                    <p
                      className={`font-medium ${
                        isCompleted ? 'text-green-800' : 'text-gray-700'
                      }`}
                    >
                      {item.atividade}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {isCompleted && <Check className="h-4 w-4 text-white" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="rounded-2xl shadow-xl bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border-purple-200">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold text-purple-900 mb-2">
            🎯 Dica de Produtividade
          </h3>
          <p className="text-purple-800 text-sm">
            Marque as tarefas como concluídas conforme você avança. Isso ajuda a
            manter a motivação e visualizar seu progresso!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
