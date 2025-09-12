'use client'

import { Button } from '@/components/ui/button'
import { FileText, ArrowRight } from 'lucide-react'
import { TccData } from '@/types/tcc'

interface WorkCardsProps {
  trabalhos: TccData[]
  trabalhoAtual: string | null
  trocarTrabalho: (workId: string) => void
  setShowNewProjectForm: (show: boolean) => void
  getCurrentWorkNotes: () => string[]
  setShowStepByStep: (show: boolean) => void
  currentStep: number
  steps: Array<{ id: number; title: string; icon: any }>
}

export default function WorkCards({
  trabalhos,
  trabalhoAtual,
  trocarTrabalho,
  setShowNewProjectForm,
  getCurrentWorkNotes,
  setShowStepByStep,
  currentStep,
  steps,
}: WorkCardsProps) {
  const getCursoDisplayName = (curso: string) => {
    const cursoMap: { [key: string]: string } = {
      medicina: 'Medicina',
      direito: 'Direito',
      engenharia: 'Engenharia',
      contabeis: 'Ciências Contábeis',
      psicologia: 'Psicologia',
      'desenvolvimento-de-sistemas': 'Análise e Desenvolvimento de Sistemas',
      publicidade: 'Publicidade e Propaganda',
      'seguranca-da-informacao': 'Segurança da Informação',
      outros: 'Outros',
    }
    return cursoMap[curso] || curso
  }

  return (
    <>
      {/* Meus Trabalhos */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Meus Trabalhos</h2>
          <Button
            onClick={() => setShowNewProjectForm(true)}
            className="px-6 py-3 rounded-2xl gradient-bg text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            + Novo Trabalho
          </Button>
        </div>

        {trabalhos.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/20">
            <div className="p-4 rounded-full gradient-bg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nenhum trabalho ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Comece criando seu primeiro trabalho acadêmico
            </p>
            <Button
              onClick={() => setShowNewProjectForm(true)}
              className="px-6 py-3 rounded-2xl gradient-bg text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Criar Primeiro Trabalho
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trabalhos.map((trabalho) => (
              <div
                key={trabalho.id}
                className={`bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  trabalhoAtual === trabalho.id ? 'ring-2 ring-purple-400' : ''
                }`}
                onClick={() => trocarTrabalho(trabalho.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl gradient-bg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {trabalho.titulo || 'Trabalho sem título'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getCursoDisplayName(trabalho.curso)}
                      </p>
                    </div>
                  </div>
                  {trabalhoAtual === trabalho.id && (
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progresso
                    </span>
                    <span className="text-sm font-bold gradient-text">
                      {trabalho.progresso}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="gradient-bg h-2 rounded-full transition-all duration-500"
                      style={{ width: `${trabalho.progresso}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {trabalho.enunciado.length > 100
                    ? `${trabalho.enunciado.substring(0, 100)}...`
                    : trabalho.enunciado}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Criado em{' '}
                    {new Date(trabalho.dataCriacao).toLocaleDateString('pt-BR')}
                  </span>
                  <span>
                    {trabalhoAtual === trabalho.id ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Continue Work Card */}
      {trabalhoAtual && (
        <div className="flex justify-center">
          <div
            className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20 hover:shadow-xl transition-all duration-300 cursor-pointer max-w-md"
            onClick={() => {
              setShowStepByStep(true)
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl gradient-bg">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Continuar Trabalho
                </h3>
                <p className="text-sm text-gray-600">
                  Próximo passo: {steps[currentStep - 1]?.title}
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Continue de onde parou no processo
            </p>
          </div>
        </div>
      )}
    </>
  )
}
