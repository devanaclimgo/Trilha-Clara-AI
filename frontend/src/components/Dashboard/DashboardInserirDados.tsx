import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useState } from 'react'

export default function InserirDados({
  onNext,
  onSaveData,
}: {
  onNext: () => void
  onSaveData?: (data: { curso: string; enunciado: string }) => void
}) {
  const [curso, setCurso] = useState('')
  const [enunciado, setEnunciado] = useState('')

  return (
    <Card className="rounded-2xl shadow-xl bg-slate-50/80 backdrop-blur-sm border-slate-200/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold gradient-text">
          Inserir dados do trabalho
        </CardTitle>
        <p className="text-muted-foreground">
          Vamos começar com as informações básicas do seu TCC
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Curso</label>
          <select
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
          >
            <option value="">Selecione seu curso</option>
            <option value="administracao">Administração</option>
            <option value="direito">Direito</option>
            <option value="engenharia">Engenharia</option>
            <option value="psicologia">Psicologia</option>
            <option value="pedagogia">Pedagogia</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Enunciado do trabalho
          </label>
          <textarea
            value={enunciado}
            onChange={(e) => setEnunciado(e.target.value)}
            placeholder="Cole aqui o enunciado completo do seu TCC conforme fornecido pelo professor..."
            rows={8}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none"
          />
        </div>
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => {
              if (onSaveData) {
                onSaveData({ curso, enunciado })
              }
              onNext()
            }}
            disabled={!curso || !enunciado.trim()}
            className="px-8 py-3 rounded-2xl gradient-bg text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
