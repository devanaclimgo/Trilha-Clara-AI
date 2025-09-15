'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TccData } from '@/types/tcc'
import {
  User,
  Building,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
} from 'lucide-react'

interface WorkEditBasicInfoProps {
  workData: TccData
}

export default function WorkEditBasicInfo({
  workData,
}: WorkEditBasicInfoProps) {
  const getTipoTrabalhoDisplayName = (tipo: string) => {
    const tipoMap: { [key: string]: string } = {
      tcc: 'TCC (Trabalho de Conclusão de Curso)',
      monografia: 'Monografia',
      dissertacao: 'Dissertação',
      tese: 'Tese',
      artigo: 'Artigo Científico',
      projeto: 'Projeto de Pesquisa',
      outros: 'Outros',
    }
    return tipoMap[tipo] || tipo
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

  const getStatusDisplayName = (status: string) => {
    const statusMap: { [key: string]: string } = {
      novo: 'Novo',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      novo: 'bg-blue-100 text-blue-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      concluido: 'bg-green-100 text-green-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Informações do Trabalho */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-purple-600" />
            Informações do Trabalho
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Título do Trabalho
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-800 font-medium">{workData.titulo}</p>
              </div>
            </div>

            {/* Tipo de Trabalho */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Tipo de Trabalho
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-800">
                  {getTipoTrabalhoDisplayName(workData.tipoTrabalho)}
                </p>
              </div>
            </div>

            {/* Curso */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Curso/Matéria
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-800">
                  {getCursoDisplayName(workData.curso)}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Status
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <Badge className={getStatusColor(workData.status)}>
                  {getStatusDisplayName(workData.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Tema/Enunciado */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tema/Enunciado do Trabalho
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border min-h-[120px]">
              <p className="text-gray-800 leading-relaxed">{workData.tema}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Pessoais */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-purple-600" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do Aluno */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome do Aluno
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-800">{workData.nomeAluno}</p>
              </div>
            </div>

            {/* Instituição */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Instituição de Ensino
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-800">{workData.instituicao}</p>
              </div>
            </div>

            {/* Orientador */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Orientador
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-800">
                  {workData.orientador || 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progresso */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-purple-600" />
            Progresso do Trabalho
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Progresso Geral
              </span>
              <span className="text-sm font-bold gradient-text">
                {workData.progresso}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="gradient-bg h-3 rounded-full transition-all duration-500"
                style={{ width: `${workData.progresso}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              Criado em{' '}
              {new Date(workData.dataCriacao).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
