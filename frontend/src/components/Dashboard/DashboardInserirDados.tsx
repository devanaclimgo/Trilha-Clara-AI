import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { LoadingSpinner } from '../ui/loading-spinner'
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
  const [titulo, setTitulo] = useState('')
  const [curso, setCurso] = useState('')
  const [tipoTrabalho, setTipoTrabalho] = useState('')
  const [tema, setTema] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
          <label className="block text-sm font-medium mb-2">
            Título do Trabalho
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
            placeholder="Ex: Análise de Impacto Ambiental"
          />
        </div>

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
            Tipo de Trabalho
          </label>
          <select
            value={tipoTrabalho}
            onChange={(e) => setTipoTrabalho(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
          >
            <option value="">Selecione o tipo de trabalho</option>
            <option value="tcc">TCC (Trabalho de Conclusão de Curso)</option>
            <option value="artigo-cientifico">Artigo Científico</option>
            <option value="monografia">Monografia</option>
            <option value="dissertacao">Dissertação</option>
            <option value="tese">Tese</option>
            <option value="projeto-experimental">Projeto Experimental</option>
            <option value="estudo-de-caso">Estudo de Caso</option>
            <option value="pesquisa-aplicada">Pesquisa Aplicada</option>
            <option value="revisao-sistematica">Revisão Sistemática</option>
            <option value="projeto-interdisciplinar">
              Projeto Interdisciplinar
            </option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tema do Trabalho
          </label>
          <textarea
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Descreva o tema principal do seu trabalho..."
            rows={6}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none"
          />
        </div>
        <div className="flex justify-center pt-4">
          <Button
            onClick={async () => {
              if (
                !titulo.trim() ||
                !curso ||
                !tipoTrabalho ||
                !tema.trim() ||
                isLoading
              )
                return
              setIsLoading(true)
              try {
                const res = await fetch('http://localhost:4000/api/tcc.json', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                  body: JSON.stringify({
                    tcc: {
                      nome: titulo,
                      faculdade: 'Universidade', // Pode ser um campo do formulário
                      curso: curso,
                      materia: curso, // Usando curso como matéria por enquanto
                      tema: tema,
                      tipo_trabalho: tipoTrabalho,
                    },
                  }),
                })

                const tccData = await res.json()

                if (onSaveData) {
                  onSaveData(
                    {
                      titulo: tccData.titulo,
                      curso: tccData.curso,
                      tipoTrabalho: tccData.tipo_trabalho,
                      status: 'em_andamento',
                      explicacao: tccData.explicacao,
                      sugestoes: tccData.sugestoes,
                      dica: tccData.dica,
                      estrutura: tccData.estrutura,
                      cronograma: tccData.cronograma,
                      id: tccData.id,
                      dataCriacao: tccData.created_at,
                      ultimaModificacao: tccData.updated_at,
                      progresso: 0,
                      tema: tccData.tema,
                      nomeAluno: tccData.nome,
                      instituicao: tccData.faculdade,
                    },
                    tccData.explicacao,
                  )
                }
                onNext()
              } catch (err) {
                console.error('Erro ao salvar dados:', err)
              } finally {
                setIsLoading(false)
              }
            }}
            disabled={
              !titulo.trim() ||
              !curso ||
              !tipoTrabalho ||
              !tema.trim() ||
              isLoading
            }
            className="px-8 py-3 rounded-2xl gradient-bg text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      {isLoading && <LoadingSpinner message="Analisando seu TCC..." />}
    </Card>
  )
}
