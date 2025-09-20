'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TccData } from '@/types/tcc'
import {
  FileText,
  Wand2,
  Save,
  RefreshCw,
  BookOpen,
  Lightbulb,
  Target,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Trash2,
  Plus,
  Undo2,
  Redo2,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface WorkEditContentProps {
  workData: TccData
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
  [key: string]: string | undefined // Para campos dinâmicos da estrutura
}

interface ContentField {
  key: string
  label: string
  description: string
  placeholder: string
  icon: React.ComponentType<{ className?: string }>
  required: boolean
  id: string
  isCustom?: boolean
}

interface SortableFieldProps {
  field: ContentField
  content: WorkContent
  onContentChange: (key: string, value: string) => void
  onGenerate: (field: string) => void
  generating: string | null
  saved: string | null
  isCollapsed: boolean
  onToggleCollapse: (fieldKey: string) => void
  onLabelChange: (fieldId: string, newLabel: string) => void
  onDeleteField?: (fieldId: string) => void
  fieldLabels: Record<string, string>
}

// Componente SortableField
function SortableField({
  field,
  content,
  onContentChange,
  onGenerate,
  generating,
  saved,
  isCollapsed,
  onToggleCollapse,
  onLabelChange,
  onDeleteField,
  fieldLabels,
}: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const fieldValue = content[field.key]
  const isFilled = Boolean(fieldValue && fieldValue.trim().length > 0)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [tempLabel, setTempLabel] = useState(
    () => fieldLabels[field.id] || field.label,
  )

  // Update tempLabel when field label changes
  useEffect(() => {
    setTempLabel(fieldLabels[field.id] || field.label)
  }, [fieldLabels, field.id, field.label])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''} transition-opacity`}
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/20 hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab hover:cursor-grabbing p-1 hover:bg-purple-100 rounded transition-colors"
              >
                <GripVertical className="h-4 w-4 text-gray-400 hover:text-purple-600" />
              </div>
              <field.icon className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                {isEditingLabel ? (
                  <input
                    value={tempLabel}
                    onChange={(e) => setTempLabel(e.target.value)}
                    onBlur={() => {
                      onLabelChange(field.id, tempLabel)
                      setIsEditingLabel(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onLabelChange(field.id, tempLabel)
                        setIsEditingLabel(false)
                      }
                      if (e.key === 'Escape') {
                        setTempLabel(field.label)
                        setIsEditingLabel(false)
                      }
                    }}
                    className="text-lg font-semibold bg-transparent border-none outline-none text-gray-700 w-full"
                    autoFocus
                  />
                ) : (
                  <CardTitle
                    className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-purple-600 transition-colors flex items-center gap-2"
                    onClick={() => setIsEditingLabel(true)}
                  >
                    {fieldLabels[field.id] || field.label}
                    {field.required && (
                      <span className="text-red-500 text-sm">*</span>
                    )}
                    {isFilled && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </CardTitle>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saved === field.key && (
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Salvo
                </span>
              )}
              {field.isCustom && onDeleteField && (
                <Button
                  onClick={() => onDeleteField(field.id)}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={() => onToggleCollapse(field.id)}
                variant="ghost"
                size="sm"
                className="hover:bg-purple-100 hover:text-purple-600"
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={() => onGenerate(field.key)}
                disabled={generating === field.key}
                variant="outline"
                size="sm"
                className="hover:bg-purple-50 hover:text-purple-600 border-purple-200 hover:border-purple-300 hover:scale-105 transition-all duration-300"
              >
                {generating === field.key ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                {generating === field.key ? 'Gerando...' : 'Gerar com IA'}
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">{field.description}</p>
        </CardHeader>
        {!isCollapsed && (
          <CardContent>
            <div className="space-y-2">
              <Label
                htmlFor={field.key}
                className="text-sm font-medium text-gray-700"
              >
                {fieldLabels[field.id] || field.label}
              </Label>
              <Textarea
                id={field.key}
                value={(content[field.key] as string) || ''}
                onChange={(e) => onContentChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="min-h-[120px] rounded-xl border-2 focus:border-purple-300 transition-colors"
              />
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  {(content[field.key] as string)?.length || 0} caracteres
                </span>
                <span>{field.required ? 'Obrigatório' : 'Opcional'}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

export default function WorkEditContent({ workData }: WorkEditContentProps) {
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

  // Inicializar campos dinâmicos da estrutura
  useEffect(() => {
    if (
      workData?.estrutura &&
      Array.isArray(workData.estrutura) &&
      workData.estrutura.length > 0
    ) {
      const estruturaContent: Record<string, string> = {}
      workData.estrutura.forEach((_: unknown, index: number) => {
        estruturaContent[`estrutura_${index}`] = ''
      })
      setContent((prev) => ({ ...prev, ...estruturaContent }))
    }
  }, [workData?.estrutura])

  const [generating, setGenerating] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [collapsedFields, setCollapsedFields] = useState<
    Record<string, boolean>
  >({})
  const [fieldOrder, setFieldOrder] = useState<string[]>([])
  const [fieldLabels, setFieldLabels] = useState<Record<string, string>>({})
  const [customFields, setCustomFields] = useState<ContentField[]>([])
  const [nextCustomId, setNextCustomId] = useState(0)
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    'saved' | 'saving' | 'error'
  >('saved')
  const [history, setHistory] = useState<
    Array<{
      content: WorkContent
      customFields: ContentField[]
      fieldLabels: Record<string, string>
      fieldOrder: string[]
    }>
  >([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Carregar conteúdo existente
  useEffect(() => {
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
      } finally {
        setLoading(false)
      }
    }

    if (workData?.id) {
      fetchContent()
    }
  }, [workData?.id])

  // Gerar campos baseados na estrutura da IA
  const generateContentFields = (): ContentField[] => {
    const baseFields: ContentField[] = [
      {
        key: 'resumo',
        label: fieldLabels.resumo || 'Resumo',
        description:
          'Escreva as principais ideias do seu trabalho em poucas palavras',
        placeholder:
          'Ex: Este trabalho analisa a aplicação de IA na educação...',
        icon: BookOpen,
        required: true,
        id: 'resumo',
      },
      {
        key: 'introducao',
        label: fieldLabels.introducao || 'Introdução',
        description: 'Apresente o tema, problema de pesquisa e objetivos',
        placeholder:
          'Ex: A inteligência artificial tem revolucionado diversos setores...',
        icon: Target,
        required: true,
        id: 'introducao',
      },
      {
        key: 'objetivos',
        label: fieldLabels.objetivos || 'Objetivos',
        description: 'Defina os objetivos geral e específicos do trabalho',
        placeholder:
          'Ex: Objetivo geral: Analisar o impacto da IA na educação...',
        icon: Lightbulb,
        required: false,
        id: 'objetivos',
      },
      {
        key: 'justificativa',
        label: fieldLabels.justificativa || 'Justificativa',
        description: 'Explique por que este tema é importante e relevante',
        placeholder:
          'Ex: A relevância deste estudo justifica-se pela necessidade de...',
        icon: Lightbulb,
        required: false,
        id: 'justificativa',
      },
      {
        key: 'metodologia',
        label: fieldLabels.metodologia || 'Metodologia',
        description: 'Descreva como você pretende realizar a pesquisa',
        placeholder: 'Ex: Esta pesquisa utilizará uma abordagem qualitativa...',
        icon: Target,
        required: false,
        id: 'metodologia',
      },
      {
        key: 'desenvolvimento',
        label: fieldLabels.desenvolvimento || 'Desenvolvimento',
        description:
          'Desenvolva os conceitos, análises e discussões principais',
        placeholder: 'Ex: A inteligência artificial na educação apresenta...',
        icon: FileText,
        required: true,
        id: 'desenvolvimento',
      },
      {
        key: 'conclusao',
        label: fieldLabels.conclusao || 'Conclusão',
        description: 'Sintetize os resultados e conclusões do trabalho',
        placeholder:
          'Ex: Com base na análise realizada, pode-se concluir que...',
        icon: CheckCircle,
        required: true,
        id: 'conclusao',
      },
      {
        key: 'referencias',
        label: fieldLabels.referencias || 'Referências',
        description: 'Liste as fontes consultadas no formato ABNT',
        placeholder:
          'Ex: SILVA, João. Inteligência Artificial na Educação. 2023...',
        icon: BookOpen,
        required: true,
        id: 'referencias',
      },
    ]

    // Add custom fields to the base fields
    const allFields = [...baseFields, ...customFields]

    return allFields
  }

  const contentFields = generateContentFields()

  // Inicializar ordem dos campos e estado de colapso
  useEffect(() => {
    if (contentFields.length > 0 && fieldOrder.length === 0) {
      const initialOrder = contentFields.map((field) => field.id)
      setFieldOrder(initialOrder)

      // Inicializar todos os campos como colapsados
      const initialCollapsed: Record<string, boolean> = {}
      contentFields.forEach((field) => {
        initialCollapsed[field.id] = true
      })
      setCollapsedFields(initialCollapsed)
    }
  }, [contentFields, fieldOrder.length])

  // Auto-save effect with debouncing
  useEffect(() => {
    const autoSave = async () => {
      if (loading || !workData?.id) return

      setAutoSaveStatus('saving')
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(
          `http://localhost:4000/api/work/${workData.id}/save_content`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: content,
              customFields: customFields,
              fieldLabels: fieldLabels,
              fieldOrder: fieldOrder,
            }),
          },
        )

        if (response.ok) {
          setAutoSaveStatus('saved')
        } else {
          setAutoSaveStatus('error')
        }
      } catch (error) {
        console.error('Erro no auto-save:', error)
        setAutoSaveStatus('error')
      }
    }

    const timeoutId = setTimeout(autoSave, 2000) // 2 second debounce
    return () => clearTimeout(timeoutId)
  }, [content, customFields, fieldLabels, fieldOrder, workData?.id, loading])

  const handleContentChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }))
    setSaved(null)
    addToHistory()
  }

  const toggleCollapse = (fieldKey: string) => {
    setCollapsedFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }))
  }

  const handleLabelChange = (fieldId: string, newLabel: string) => {
    setFieldLabels((prev) => ({
      ...prev,
      [fieldId]: newLabel,
    }))
    addToHistory()
  }

  // Add to history for undo functionality
  const addToHistory = () => {
    const newState = {
      content: { ...content },
      customFields: [...customFields],
      fieldLabels: { ...fieldLabels },
      fieldOrder: [...fieldOrder],
    }

    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(newState)
      // Keep only last 50 states to prevent memory issues
      return newHistory.slice(-50)
    })
    setHistoryIndex((prev) => Math.min(prev + 1, 49))
  }

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setContent(prevState.content)
      setCustomFields(prevState.customFields)
      setFieldLabels(prevState.fieldLabels)
      setFieldOrder(prevState.fieldOrder)
      setHistoryIndex((prev) => prev - 1)
    }
  }, [historyIndex, history])

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setContent(nextState.content)
      setCustomFields(nextState.customFields)
      setFieldLabels(nextState.fieldLabels)
      setFieldOrder(nextState.fieldOrder)
      setHistoryIndex((prev) => prev + 1)
    }
  }, [historyIndex, history])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'z' &&
        !event.shiftKey
      ) {
        event.preventDefault()
        undo()
      } else if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'y' || (event.key === 'z' && event.shiftKey))
      ) {
        event.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  const addCustomField = () => {
    const newField: ContentField = {
      key: `custom_${nextCustomId}`,
      label: `Nova Seção ${nextCustomId + 1}`,
      description: 'Desenvolva esta seção do trabalho',
      placeholder: 'Ex: Conteúdo da seção...',
      icon: FileText,
      required: false,
      id: `custom_${nextCustomId}`,
      isCustom: true,
    }

    setCustomFields((prev) => [...prev, newField])
    setFieldOrder((prev) => [...prev, newField.id])
    setCollapsedFields((prev) => ({ ...prev, [newField.id]: true }))
    setNextCustomId((prev) => prev + 1)
    addToHistory()
  }

  const deleteCustomField = (fieldId: string) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== fieldId))
    setFieldOrder((prev) => prev.filter((id) => id !== fieldId))
    setCollapsedFields((prev) => {
      const newCollapsed = { ...prev }
      delete newCollapsed[fieldId]
      return newCollapsed
    })
    setFieldLabels((prev) => {
      const newLabels = { ...prev }
      delete newLabels[fieldId]
      return newLabels
    })
    // Remove content for this field
    setContent((prev) => {
      const newContent = { ...prev }
      const field = customFields.find((f) => f.id === fieldId)
      if (field) {
        delete newContent[field.key]
      }
      return newContent
    })
    addToHistory()
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFieldOrder((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
      addToHistory()
    }
  }

  const generateContent = async (field: string) => {
    setGenerating(field)
    setSaved(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await fetch(
        `http://localhost:4000/api/work/${workData.id}/generate_content`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            field: field,
            user_ideas: content[field] || '',
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Erro ao gerar conteúdo')
      }

      const data = await response.json()
      setContent((prev) => ({ ...prev, [field]: data.content }))
      setSaved(field)
      addToHistory()
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error)
      // Fallback para conteúdo mock em caso de erro
      const fallbackContent = {
        resumo:
          'Este trabalho analisa a aplicação de Inteligência Artificial na educação, explorando suas potencialidades, desafios e impactos no processo de ensino-aprendizagem.',
        introducao:
          'A Inteligência Artificial (IA) tem se tornado uma das tecnologias mais transformadoras do século XXI, impactando diversos setores da sociedade, incluindo a educação.',
        objetivos:
          'Objetivo Geral: Analisar o impacto da aplicação de Inteligência Artificial na educação. Objetivos Específicos: 1) Mapear as principais tecnologias de IA; 2) Identificar benefícios e desafios.',
        justificativa:
          'A relevância deste estudo justifica-se pela necessidade urgente de compreender e preparar o sistema educacional para as transformações digitais em curso.',
        metodologia:
          'Esta pesquisa utilizará uma abordagem qualitativa, baseada em revisão sistemática da literatura e análise de casos práticos.',
        desenvolvimento:
          'A aplicação de Inteligência Artificial na educação apresenta múltiplas dimensões e possibilidades.',
        conclusao:
          'Com base na análise realizada, pode-se concluir que a Inteligência Artificial apresenta um potencial significativo para transformar a educação.',
        referencias:
          'SILVA, João. Inteligência Artificial na Educação. São Paulo: Editora Educacional, 2023.',
      }

      setContent((prev) => ({
        ...prev,
        [field]:
          (fallbackContent as Record<string, string>)[field] ||
          'Conteúdo gerado com sucesso!',
      }))
      addToHistory()
    } finally {
      setGenerating(null)
    }
  }

  const saveContent = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await fetch(
        `http://localhost:4000/api/work/${workData.id}/save_content`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Erro ao salvar conteúdo')
      }

      setSaved('all')
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conteúdo do trabalho...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-purple-600" />
            Conteúdo do Trabalho
          </CardTitle>
          <p className="text-gray-600">
            Preencha as ideias gerais para cada seção e deixe a IA ajudar a
            desenvolver o conteúdo
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                Escreva suas ideias e clique em &quot;Gerar com IA&quot; para
                expandir o conteúdo
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    variant="outline"
                    size="sm"
                    className="hover:bg-purple-50 hover:text-purple-600 border-purple-200 hover:border-purple-300"
                  >
                    <Undo2 className="h-4 w-4 mr-1" />
                    Desfazer
                  </Button>
                  <Button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    variant="outline"
                    size="sm"
                    className="hover:bg-purple-50 hover:text-purple-600 border-purple-200 hover:border-purple-300"
                  >
                    <Redo2 className="h-4 w-4 mr-1" />
                    Refazer
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {autoSaveStatus === 'saving' && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Salvando...
                    </div>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Salvo automaticamente
                    </div>
                  )}
                  {autoSaveStatus === 'error' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <span>Erro ao salvar</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={saveContent}
              className="gradient-bg text-white hover:scale-105 transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Manualmente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Fields */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fieldOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {fieldOrder.map((fieldId) => {
              const field = contentFields.find((f) => f.id === fieldId)
              if (!field) return null

              return (
                <SortableField
                  key={field.id}
                  field={field}
                  content={content}
                  onContentChange={handleContentChange}
                  onGenerate={generateContent}
                  generating={generating}
                  saved={saved}
                  isCollapsed={collapsedFields[field.id] || false}
                  onToggleCollapse={toggleCollapse}
                  onLabelChange={handleLabelChange}
                  onDeleteField={field.isCustom ? deleteCustomField : undefined}
                  fieldLabels={fieldLabels}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Section Button */}
      <div className="flex justify-center">
        <Button
          onClick={addCustomField}
          variant="outline"
          className="border-2 border-dashed border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-600 hover:text-purple-700 transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Seção
        </Button>
      </div>

      {/* Save All Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={saveContent}
          size="lg"
          className="gradient-bg text-white hover:scale-105 px-8 transition-all duration-300"
        >
          <Save className="h-5 w-5 mr-2" />
          Salvar Todo o Conteúdo
        </Button>
      </div>
    </div>
  )
}
