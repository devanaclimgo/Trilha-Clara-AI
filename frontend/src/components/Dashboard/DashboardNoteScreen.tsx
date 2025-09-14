import React, { useState } from 'react'
import { Button } from '../ui/button'
import {
  Plus,
  Save,
  StickyNote,
  Trash2,
  ArrowLeft,
  FileText,
  BookOpen,
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { formatNoteDate } from '@/lib/dateUtils'

interface TccData {
  id: string
  titulo: string
  curso: string
  subtitulo: string
  explicacao: string | string[]
  sugestoes: string[]
  dica: string
  estrutura: string | string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cronograma: any[]
  dataCriacao: string
  ultimaModificacao: string
  progresso: number
}

export default function NotesScreen({
  savedNotes,
  onRemoveNote,
  onAddNote,
  onBackToHome,
  trabalhoAtual,
  showAllNotes = false,
  allNotes = [],
  savedNotesWithDates = [],
}: {
  savedNotes: string[]
  onRemoveNote: (index: number) => void
  onAddNote: (note: string) => void
  onBackToHome?: () => void
  trabalhoAtual?: TccData
  showAllNotes?: boolean
  allNotes?: Array<{
    workId: string
    workTitle: string
    workCourse: string
    note: {
      text: string
      createdAt: string
    }
    noteIndex: number
  }>
  savedNotesWithDates?: Array<{ text: string; createdAt: string }>
}) {
  const [newNote, setNewNote] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim())
      setNewNote('')
      setDialogOpen(false)
    }
  }

  const handleCancel = () => {
    setNewNote('')
    setDialogOpen(false)
  }

  const formatNoteText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ))
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-0 py-8">
          {onBackToHome && (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={onBackToHome}
                className="rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600 flex items-center gap-2 px-4 py-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Voltar ao início</span>
              </Button>
            </div>
          )}

          <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold gradient-text">
                {showAllNotes ? 'Todas as Anotações' : 'Suas Anotações'}
              </h2>
              <p className="text-muted-foreground">
                {showAllNotes
                  ? 'Visualize todas as anotações de todos os trabalhos'
                  : 'Gerencie suas anotações salvas'}
              </p>
              {showAllNotes ? (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">
                    {allNotes.length} anotações de{' '}
                    {new Set(allNotes.map((n) => n.workId)).size} trabalhos
                  </span>
                </div>
              ) : (
                trabalhoAtual && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">
                      {trabalhoAtual.titulo || 'Trabalho sem título'}
                    </span>
                    <span>•</span>
                    <span>{getCursoDisplayName(trabalhoAtual.curso)}</span>
                  </div>
                )
              )}
            </div>

            {!showAllNotes && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl gradient-bg text-white hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Anotação
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100vw-4rem)] sm:max-w-md bg-white border border-gray-200 shadow-xl data-[state=open]:animate-dialogScaleIn data-[state=closed]:animate-dialogScaleOut">
                  <DialogHeader>
                    <DialogTitle className="text-gradient-trilha text-xl text-center">
                      Adicionar Nova Anotação
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conteúdo da Anotação
                      </label>
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Digite sua anotação aqui...&#10;&#10;Você pode usar quebras de linha para organizar melhor suas ideias."
                        rows={6}
                        className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none leading-relaxed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Dica: Use Enter para quebrar linhas e organizar suas
                        ideias
                      </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className="rounded-xl gradient-bg text-white hover:scale-105 transition-all duration-300"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="rounded-xl border-gray-300 hover:bg-gray-50 hover:text-purple-600 transition-all duration-300"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {(showAllNotes ? allNotes.length === 0 : savedNotes.length === 0) ? (
            <Card className="rounded-2xl shadow-xl bg-slate-50/80 backdrop-blur-sm border-slate-200/20 max-w-4xl mx-auto mt-12">
              <CardContent className="text-center py-12">
                <StickyNote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma anotação ainda
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece adicionando suas primeiras anotações para o TCC
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="rounded-2xl gradient-bg text-white hover:scale-105 transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  Criar primeira anotação
                </Button>
              </CardContent>
            </Card>
          ) : showAllNotes ? (
            <div className="grid gap-4 max-w-4xl mx-auto">
              {allNotes.map((noteData) => (
                <Card
                  key={`${noteData.workId}-${noteData.noteIndex}`}
                  className="rounded-2xl shadow-lg bg-slate-50/80 backdrop-blur-sm border-slate-200/20 hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    {/* Header com indicador de trabalho */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/30">
                      <div className="p-1.5 rounded-lg gradient-bg">
                        <BookOpen className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">
                          {noteData.workTitle}
                        </span>
                        <span>•</span>
                        <span>{getCursoDisplayName(noteData.workCourse)}</span>
                        <span>•</span>
                        <span className="text-gray-500">
                          {formatNoteDate(noteData.note.createdAt)}
                        </span>
                      </div>
                      <div className="ml-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveNote(noteData.noteIndex)}
                          className="rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Conteúdo da anotação com quebras de linha */}
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {formatNoteText(noteData.note.text)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 max-w-4xl mx-auto">
              {(savedNotesWithDates.length > 0
                ? savedNotesWithDates
                : savedNotes.map((text) => ({ text, createdAt: '' }))
              ).map((note, index) => {
                // Verificação de compatibilidade para anotações antigas
                const noteText = typeof note === 'string' ? note : note.text
                const noteDate = typeof note === 'string' ? '' : note.createdAt

                return (
                  <Card
                    key={index}
                    className="rounded-2xl shadow-lg bg-slate-50/80 backdrop-blur-sm border-slate-200/20 hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      {/* Header com indicador de trabalho */}
                      {trabalhoAtual && (
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/30">
                          <div className="p-1.5 rounded-lg gradient-bg">
                            <BookOpen className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium">
                              {trabalhoAtual.titulo || 'Trabalho sem título'}
                            </span>
                            <span>•</span>
                            <span>
                              {getCursoDisplayName(trabalhoAtual.curso)}
                            </span>
                            {noteDate && (
                              <>
                                <span>•</span>
                                <span className="text-gray-500">
                                  {formatNoteDate(noteDate)}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="ml-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveNote(index)}
                              className="rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Conteúdo da anotação com quebras de linha */}
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {formatNoteText(noteText)}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
