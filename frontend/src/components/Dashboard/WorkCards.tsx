'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  FileText,
  ArrowRight,
  Trash2,
  MoreVertical,
  Play,
  Edit,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TccData } from '@/types/tcc'
import StartWorkModal from './StartWorkModal'

interface WorkCardsProps {
  trabalhos: TccData[]
  trabalhoAtual?: string
  trocarTrabalho: (id: string) => void
  onCriarNovo: () => void
  setShowNewProjectForm: (value: boolean) => void
  setShowStepByStep: () => void
  onEditWork: (work: TccData) => void
  onDeleteWork: (work: TccData) => void
  onContinueWork: (id: string) => void
  onStartWork: (
    workId: string,
    data: {
      titulo: string
      tema: string
      tipoTrabalho: string
      curso: string
      semanas: number
      nomeAluno: string
      instituicao: string
      orientador: string
    },
  ) => void
}

export default function WorkCards({
  trabalhos,
  trabalhoAtual,
  trocarTrabalho,
  setShowNewProjectForm,
  onEditWork,
  onDeleteWork,
  onStartWork,
}: WorkCardsProps) {
  const [showStartWorkModal, setShowStartWorkModal] = useState(false)
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null)

  const handleStartWork = (workId: string) => {
    setSelectedWorkId(workId)
    setShowStartWorkModal(true)
  }

  const handleContinueWork = (workId: string) => {
    // Redirecionar para a página de edição do trabalho
    window.location.href = `/work-edit/${workId}`
  }

  const handleStartWorkSubmit = (data: {
    titulo: string
    tema: string
    tipoTrabalho: string
    curso: string
    semanas: number
    nomeAluno: string
    instituicao: string
    orientador: string
  }) => {
    if (selectedWorkId) {
      onStartWork(selectedWorkId, data)
      setShowStartWorkModal(false)
      setSelectedWorkId(null)
    }
  }

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
                className={`bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/20 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full ${
                  trabalhoAtual === trabalho.id ? 'ring-2 ring-purple-400' : ''
                }`}
                onClick={() => {
                  trocarTrabalho(trabalho.id)
                }}
              >
                {/* Header do card */}
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
                  <div className="flex items-center gap-2">
                    {trabalhoAtual === trabalho.id && (
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            onEditWork(trabalho)
                          }}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            onDeleteWork(trabalho)
                          }}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Progresso */}
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

                {/* Conteúdo flexível que cresce */}
                <div className="flex-1 flex flex-col">
                  {/* Informações de data e status */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>
                      Criado em{' '}
                      {new Date(trabalho.dataCriacao).toLocaleDateString(
                        'pt-BR',
                      )}
                    </span>
                    <span>
                      {trabalhoAtual === trabalho.id ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                {/* Botão Iniciar/Continuar - sempre alinhado na parte inferior */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (trabalhoAtual === trabalho.id) {
                      if (
                        trabalho.status === 'pesquisando' &&
                        trabalho.progresso === 0
                      ) {
                        handleStartWork(trabalho.id)
                      } else {
                        handleContinueWork(trabalho.id)
                      }
                    } else {
                      trocarTrabalho(trabalho.id)
                    }
                  }}
                  className={`w-full px-6 py-3 rounded-2xl font-medium transition-all duration-300 mt-auto ${
                    trabalhoAtual === trabalho.id
                      ? 'gradient-bg text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300 cursor-pointer'
                  }`}
                >
                  {trabalho.status === 'pesquisando' && trabalho.progresso === 0
                    ? 'Iniciar'
                    : 'Continuar'}
                  {trabalho.status === 'pesquisando' &&
                  trabalho.progresso === 0 ? (
                    <Play className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para iniciar trabalho */}
      <StartWorkModal
        isOpen={showStartWorkModal}
        onClose={() => {
          setShowStartWorkModal(false)
          setSelectedWorkId(null)
        }}
        onStart={handleStartWorkSubmit}
        workTitle={trabalhos.find((t) => t.id === selectedWorkId)?.titulo || ''}
      />
    </>
  )
}
