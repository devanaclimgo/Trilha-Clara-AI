import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Plus, Save, StickyNote, Trash2, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

export default function NotesScreen({
  savedNotes,
  onRemoveNote,
  onAddNote,
  onBackToHome,
}: {
  savedNotes: string[]
  onRemoveNote: (index: number) => void
  onAddNote: (note: string) => void
  onBackToHome?: () => void
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
              <h2 className="text-2xl font-bold gradient-text">Suas Anotações</h2>
              <p className="text-muted-foreground">Gerencie suas anotações salvas</p>
            </div>

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
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Digite sua anotação aqui..."
                    rows={4}
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none"
                  />
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
          </div>

          {savedNotes.length === 0 ? (
            <Card className="rounded-2xl shadow-xl bg-slate-50/80 backdrop-blur-sm border-slate-200/20 max-w-4xl mx-auto mt-12">
              <CardContent className="text-center py-12">
                <StickyNote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma anotação ainda</h3>
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
          ) : (
            <div className="grid gap-4 max-w-4xl mx-auto">
              {savedNotes.map((note, index) => (
                <Card
                  key={index}
                  className="rounded-2xl shadow-lg bg-slate-50/80 backdrop-blur-sm border-slate-200/20 hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6 flex items-start justify-between gap-4">
                    <p className="text-gray-700 flex-1">{note}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveNote(index)}
                      className="rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}