'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TccData } from '@/types/tcc'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AbntPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  workData: TccData
  content?: {
    resumo: string
    introducao: string
    objetivos: string
    metodologia: string
    desenvolvimento: string
    conclusao: string
    referencias: string
    justificativa?: string
    [key: string]: string | undefined
  }
  customFields?: Array<{
    key: string
    label: string
    description: string
    placeholder: string
    icon: React.ComponentType<{ className?: string }>
    required: boolean
    id: string
    isCustom?: boolean
  }>
  fieldLabels?: Record<string, string>
  fieldOrder?: string[]
}

interface WorkContent {
  resumo: string
  introducao: string
  desenvolvimento: string
  conclusao: string
  referencias: string
  metodologia?: string
  objetivos?: string
  justificativa?: string
  [key: string]: string | undefined
}

export default function AbntPreviewModal({
  isOpen,
  onClose,
  workData,
  content: propContent,
  customFields = [],
  fieldLabels = {},
  fieldOrder = [],
}: AbntPreviewModalProps) {
  const [content, setContent] = useState<WorkContent>({
    resumo: '',
    introducao: '',
    desenvolvimento: '',
    conclusao: '',
    referencias: '',
    metodologia: '',
    objetivos: '',
    justificativa: '',
  })
  const [currentPage, setCurrentPage] = useState(1)

  // Use prop content if available, otherwise fetch from API
  useEffect(() => {
    if (propContent) {
      setContent({
        resumo: propContent.resumo || '',
        introducao: propContent.introducao || '',
        desenvolvimento: propContent.desenvolvimento || '',
        conclusao: propContent.conclusao || '',
        referencias: propContent.referencias || '',
        metodologia: propContent.metodologia || '',
        objetivos: propContent.objetivos || '',
        justificativa: propContent.justificativa || '',
      })
    } else if (isOpen && workData?.id) {
      // Fallback: fetch content from API
      const fetchContent = async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) return

          const response = await fetch(
            `http://localhost:4000/api/work/${workData.id}/content`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          )

          if (response.ok) {
            const data = await response.json()
            setContent({
              resumo: data.resumo || '',
              introducao: data.introducao || '',
              desenvolvimento: data.desenvolvimento || '',
              conclusao: data.conclusao || '',
              referencias: data.referencias || '',
              metodologia: data.metodologia || '',
              objetivos: data.objetivos || '',
              justificativa: data.justificativa || '',
            })
          }
        } catch (error) {
          console.error('Erro ao carregar conteúdo:', error)
        }
      }

      fetchContent()
    }
  }, [propContent, isOpen, workData?.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Get all fields in order (base fields + custom fields)
  const getAllFieldsInOrder = () => {
    const baseFields = [
      { key: 'resumo', label: 'Resumo' },
      { key: 'introducao', label: 'Introdução' },
      { key: 'objetivos', label: 'Objetivos' },
      { key: 'metodologia', label: 'Metodologia' },
      { key: 'desenvolvimento', label: 'Desenvolvimento' },
      { key: 'conclusao', label: 'Conclusão' },
      { key: 'referencias', label: 'Referências' },
    ]

    // Add custom fields
    const customFieldsList = customFields.map((field) => ({
      key: field.key,
      label: fieldLabels[field.id] || field.label,
    }))

    // Combine and order based on fieldOrder
    const allFields = [...baseFields, ...customFieldsList]

    if (fieldOrder.length > 0) {
      return fieldOrder.map((fieldId) => {
        const field = allFields.find((f) => f.key === fieldId)
        return field || { key: fieldId, label: fieldId }
      })
    }

    return allFields
  }

  // Calcular número de páginas estimado (aproximadamente 250 palavras por página)
  const calculatePages = () => {
    const totalWords = Object.values(content).join(' ').split(' ').length
    return Math.max(1, Math.ceil(totalWords / 250))
  }

  const totalPages = calculatePages()

  // Funções de navegação
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Resetar página quando modal abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-800">
              Preview do Trabalho - Formatação ABNT
            </DialogTitle>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Visualização exata do documento final - {totalPages} página
              {totalPages !== 1 ? 's' : ''}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[80px] text-center">
                  {currentPage} de {totalPages}
                </span>
                <Button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Documento ABNT */}
          <div className="bg-white p-8 min-h-[800px]">
            {/* Cabeçalho do documento */}
            <div className="text-center mb-12">
              <h1 className="text-2xl font-bold text-black mb-6 leading-tight">
                {workData.titulo}
              </h1>
              <div className="space-y-1 text-sm text-black">
                <p className="font-medium">{workData.nomeAluno}</p>
                <p>{workData.instituicao}</p>
                <p>
                  {workData.orientador && `Orientador: ${workData.orientador}`}
                </p>
                <p className="mt-4">{formatDate(workData.dataCriacao)}</p>
              </div>
            </div>

            {/* Conteúdo do trabalho */}
            <div className="space-y-8 text-justify leading-relaxed">
              {/* Resumo */}
              {content.resumo && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
                    Resumo
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.resumo}
                  </p>
                </section>
              )}

              {/* Introdução */}
              {content.introducao && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    1. Introdução
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.introducao}
                  </p>
                </section>
              )}

              {/* Objetivos */}
              {content.objetivos && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    2. Objetivos
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.objetivos}
                  </p>
                </section>
              )}

              {/* Justificativa */}
              {content.justificativa && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    3. Justificativa
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.justificativa}
                  </p>
                </section>
              )}

              {/* Metodologia */}
              {content.metodologia && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    {content.justificativa
                      ? '4. Metodologia'
                      : '3. Metodologia'}
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.metodologia}
                  </p>
                </section>
              )}

              {/* Desenvolvimento */}
              {content.desenvolvimento && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    {content.justificativa && content.metodologia
                      ? '5. Desenvolvimento'
                      : content.justificativa || content.metodologia
                      ? '4. Desenvolvimento'
                      : '3. Desenvolvimento'}
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.desenvolvimento}
                  </p>
                </section>
              )}

              {/* Conclusão */}
              {content.conclusao && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    {content.justificativa && content.metodologia
                      ? '6. Conclusão'
                      : content.justificativa || content.metodologia
                      ? '5. Conclusão'
                      : '4. Conclusão'}
                  </h2>
                  <p className="text-black text-sm leading-relaxed">
                    {content.conclusao}
                  </p>
                </section>
              )}

              {/* Referências */}
              {content.referencias && (
                <section>
                  <h2 className="text-lg font-bold text-black mb-4">
                    Referências
                  </h2>
                  <div className="text-black text-sm leading-relaxed">
                    {content.referencias.split('. ').map((ref, index) => (
                      <p key={index} className="mb-2 text-justify">
                        {ref}
                        {ref.endsWith('.') ? '' : '.'}
                      </p>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Numeração de páginas simulada */}
            <div className="mt-12 pt-8 border-t border-gray-300">
              <div className="text-center text-xs text-gray-500">
                <p>
                  Página {currentPage} de {totalPages}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
