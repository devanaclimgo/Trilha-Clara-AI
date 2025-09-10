import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { ArrowRight, Edit3 } from 'lucide-react'

export default function Estruturasugerida({ onNext }: { onNext: () => void }) {
  const [estrutura, setEstrutura] = useState([
    'Introdução',
    'Revisão de literatura',
    'Referencial teórico',
    'Metodologia',
    'Coleta e análise de dados',
    'Resultados',
    'Discussão',
    'Conclusão',
  ])

  const [editando, setEditando] = useState(false)

  return (
    <Card className="rounded-2xl shadow-xl bg-slate-50/80 backdrop-blur-sm border-slate-200/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold gradient-text">
          Estrutura sugerida
        </CardTitle>
        <p className="text-muted-foreground">
          Baseada no seu enunciado, sugerimos esta estrutura
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {estrutura.map((capitulo, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:shadow-md transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            {editando ? (
              <input
                value={capitulo}
                onChange={(e) => {
                  const nova = [...estrutura]
                  nova[index] = e.target.value
                  setEstrutura(nova)
                }}
                className="flex-1 p-2 rounded-xl border border-slate-200 bg-slate-50/70"
              />
            ) : (
              <span className="flex-1 font-medium text-gray-700">
                {capitulo}
              </span>
            )}
          </div>
        ))}
        <div className="flex justify-center gap-4 pt-6">
          <Button
            variant="outline"
            onClick={() => setEditando(!editando)}
            className="px-6 py-3 rounded-2xl border-2 border-purple-200 hover:bg-purple-50 transition-all duration-300"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            {editando ? 'Salvar' : 'Editar'}
          </Button>
          <Button
            onClick={onNext}
            className="px-8 py-3 rounded-2xl gradient-bg text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
