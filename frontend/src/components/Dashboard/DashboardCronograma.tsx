import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export default function Cronograma({ onNext }: { onNext: () => void }) {
  const atividades = [
    {
      semana: 1,
      atividade: 'Escolher tema e delimitar problema',
      concluida: true,
    },
    {
      semana: 2,
      atividade: 'Levantar referências bibliográficas',
      concluida: true,
    },
    {
      semana: 3,
      atividade: 'Escrever introdução e justificativa',
      concluida: false,
    },
    {
      semana: 4,
      atividade: 'Redigir metodologia da pesquisa',
      concluida: false,
    },
    {
      semana: 5,
      atividade: 'Desenvolver revisão bibliográfica',
      concluida: false,
    },
    {
      semana: 6,
      atividade: 'Aplicar instrumentos de coleta',
      concluida: false,
    },
    { semana: 7, atividade: 'Analisar dados coletados', concluida: false },
    {
      semana: 8,
      atividade: 'Escrever resultados e discussão',
      concluida: false,
    },
    { semana: 9, atividade: 'Elaborar conclusões', concluida: false },
    {
      semana: 10,
      atividade: 'Revisão final e formatação ABNT',
      concluida: false,
    },
  ]

  const progresso =
    (atividades.filter((a) => a.concluida).length / atividades.length) * 100

  return (
    <Card className="rounded-2xl shadow-xl bg-slate-50/80 backdrop-blur-sm border-slate-200/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold gradient-text">
          Cronograma de execução
        </CardTitle>
        <p className="text-muted-foreground">
          Planejamento semanal para seu TCC
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-100 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-gray-700">Progresso Geral</span>
            <span className="font-bold gradient-text">
              {Math.round(progresso)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="gradient-bg h-4 rounded-full transition-all duration-500"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>
        <div className="space-y-3">
          {atividades.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                item.concluida
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                  : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:shadow-md'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  item.concluida
                    ? 'bg-green-500 text-white'
                    : 'gradient-bg text-white'
                }`}
              >
                {item.semana}
              </div>
              <div className="flex-1">
                <span
                  className={`font-medium ${
                    item.concluida ? 'text-green-800' : 'text-gray-700'
                  }`}
                >
                  Semana {item.semana}: {item.atividade}
                </span>
              </div>
              {item.concluida && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-6">
          <Button
            onClick={onNext}
            className="px-8 py-3 rounded-2xl gradient-bg text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Ver Formatação ABNT
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
