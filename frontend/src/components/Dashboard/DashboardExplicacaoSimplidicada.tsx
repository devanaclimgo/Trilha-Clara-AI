import { ArrowRight, CheckCircle, Save } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export default function ExplicacaoSimplificada({
  onNext,
  onSaveNote,
}: {
  onNext: () => void
  onSaveNote: (note: string) => void
}) {
  const requisitos = [
    'Definir tema específico e relevante para a área',
    'Fazer revisão bibliográfica com fontes acadêmicas',
    'Aplicar questionário ou entrevistas para coleta de dados',
    'Analisar resultados obtidos na pesquisa',
    'Elaborar conclusões baseadas nos dados coletados',
  ]

  const sugestoesPesquisa = [
    'Buscar artigos em bases como SciELO e Google Acadêmico',
    'Definir palavras-chave específicas para sua área',
    'Criar questionário com perguntas objetivas e subjetivas',
    'Estabelecer cronograma de coleta de dados',
    'Preparar roteiro de análise dos resultados',
  ]

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
        {requisitos.map((requisito, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 hover:shadow-md transition-all duration-300"
          >
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{requisito}</span>
          </div>
        ))}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-purple-900">
              💡 Sugestões de pesquisa:
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                sugestoesPesquisa.forEach((sugestao) => onSaveNote(sugestao))
              }}
              className="rounded-xl border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar sugestões
            </Button>
          </div>
          <div className="space-y-2">
            {sugestoesPesquisa.map((sugestao, index) => (
              <div
                key={index}
                className="text-purple-800 text-sm flex items-start gap-2"
              >
                <span className="text-purple-600">•</span>
                <span>{sugestao}</span>
              </div>
            ))}
          </div>
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
