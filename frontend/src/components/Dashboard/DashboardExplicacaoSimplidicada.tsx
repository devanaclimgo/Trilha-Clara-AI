import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

type ExplicacaoSimplificadaProps = {
  explicacao: string | string[] | null
  sugestoes?: string[]
  dica: string
  onNext: () => void
  onSaveNote: (note: string) => void
}

export default function ExplicacaoSimplificada({
  explicacao,
  sugestoes = [],
  dica,
  onNext,
  onSaveNote,
}: ExplicacaoSimplificadaProps) {
  console.log('explicacao:', explicacao, typeof explicacao)

  const explicacaoArray = Array.isArray(explicacao)
    ? explicacao
    : typeof explicacao === 'string'
    ? explicacao.split('\n').filter((line) => line.trim() !== '')
    : []

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      ),
    )
  }

  return (
    <Card className="rounded-2xl shadow-xl bg-slate-50/80 backdrop-blur-sm border-slate-200/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold gradient-text">
          O que o professor pediu foi:
        </CardTitle>
        <p className="text-muted-foreground">
          Aqui está uma explicação simplificada dos requisitos
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {explicacaoArray.map((item: string, idx: number) => (
            <p
              key={idx}
              className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-100"
            >
              {formatText(item)}
            </p>
          ))}
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
          <h3 className="font-semibold text-purple-900 mb-3">
            💡 Sugestões de pesquisa:
          </h3>
          <ul className="space-y-2 text-purple-800 text-sm">
            {sugestoes.length > 0 ? (
              sugestoes.map((s, idx) => <li key={idx}>{s}</li>)
            ) : (
              <p>Sem sugestões no momento</p>
            )}
          </ul>
          <Button
            onClick={() => onSaveNote(sugestoes.join('\n'))}
            className="mt-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
          >
            Salvar sugestões
          </Button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            ✅ Dica importante:
          </h3>
          <p className="text-blue-800 text-sm">{dica}</p>
        </div>
        <div className="flex justify-center pt-6">
          <Button
            onClick={onNext}
            className="px-8 py-3 rounded-2xl gradient-bg text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Ir para Estrutura do TCC
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
