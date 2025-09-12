import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useState } from 'react'
import { TccData } from '@/types/tcc'

interface InserirDadosProps {
  onNext: () => void
  onSaveData?: (data: TccData, explicacaoGerada: string) => void
}

export default function InserirDados({
  onNext,
  onSaveData,
}: InserirDadosProps) {
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
            <option value="medicina">Medicina</option>
            <option value="direito">Direito</option>
            <option value="engenharia">Engenharia</option>
            <option value="contabeis">Ciências Contábeis</option>
            <option value="psicologia">Psicologia</option>
            <option value="desenvolvimento-de-sistemas">
              Análise e Desenvolvimento de Sistemas
            </option>
            <option value="publicidade">Publicidade e Propaganda</option>
            <option value="seguranca-da-informacao">
              Segurança da Informação
            </option>
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
            onClick={async () => {
              if (!curso || !enunciado.trim()) return
              try {
                const res = await fetch(
                  'http://localhost:4000/api/tcc/criar.json',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                    },
                    body: JSON.stringify({ curso, enunciado }),
                  },
                )

                const data = await res.json()

                if (onSaveData) {
                  onSaveData(
                    {
                      curso,
                      enunciado,
                      explicacao: data.explicacao,
                      sugestoes: data.sugestoes,
                      dica: data.dica,
                      estrutura: data.estrutura,
                      cronograma: data.cronograma,
                      id: '',
                      titulo: '',
                      dataCriacao: '',
                      ultimaModificacao: '',
                      progresso: 0
                    },
                    data.explicacao,
                  )
                }
                onNext()
              } catch (err) {
                console.error('Erro ao salvar dados:', err)
              }
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
