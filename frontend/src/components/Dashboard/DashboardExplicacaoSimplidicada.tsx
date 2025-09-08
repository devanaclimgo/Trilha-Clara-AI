import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export default function ExplicacaoSimplificada({
  explicacao,
  onNext,
  onSaveNote
}: {
  explicacao: string
  onNext: () => void
  onSaveNote: (note: string) => void
}) {

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
        <div className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
          {explicacao}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            ✅ Dica importante:
          </h3>
          <p className="text-blue-800 text-sm">
            Seu TCC precisa seguir uma metodologia científica clara e apresentar
            resultados originais. Vamos te ajudar a estruturar tudo isso de
            forma organizada!
          </p>
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
