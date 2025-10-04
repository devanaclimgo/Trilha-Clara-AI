'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TccData } from '@/types/tcc'
import {
  X,
  Plus,
  Trash2,
  FileText,
  BookOpen,
  Edit3,
  Calendar,
  Settings,
  User,
  HelpCircle,
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatNoteDateShort } from '@/lib/dateUtils'

interface WorkEditDialogsProps {
  workData: TccData
  getCurrentWorkNotes: () => string[]
  getCurrentWorkNotesWithDates: () => Array<{ text: string; createdAt: string }>
  saveNote: (note: string) => void
  removeNote: (index: number) => void
  activeDialog: string | null
  onCloseDialog: () => void
}

export default function WorkEditDialogs({
  workData,
  getCurrentWorkNotes,
  getCurrentWorkNotesWithDates,
  saveNote,
  removeNote,
  activeDialog,
  onCloseDialog,
}: WorkEditDialogsProps) {
  const [newNote, setNewNote] = useState('')

  const closeDialog = () => {
    onCloseDialog()
    setNewNote('')
  }

  const handleSaveNote = () => {
    if (newNote.trim()) {
      saveNote(newNote.trim())
      setNewNote('')
    }
  }

  const handleRemoveNote = (index: number) => {
    removeNote(index)
  }

  return (
    <>
      {/* Notes Dialog */}
      <Dialog open={activeDialog === 'notes'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Anotações do Trabalho
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add new note */}
            <div className="space-y-2">
              <Label htmlFor="new-note">Adicionar nova anotação</Label>
              <div className="flex gap-2">
                <Textarea
                  id="new-note"
                  placeholder="Digite sua anotação aqui..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1"
                  rows={3}
                />
                <Button onClick={handleSaveNote} disabled={!newNote.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Existing notes */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Anotações Salvas</h4>
              {getCurrentWorkNotesWithDates().length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  Nenhuma anotação salva ainda
                </p>
              ) : (
                <div className="space-y-2">
                  {getCurrentWorkNotesWithDates().map((note, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm">{note.text}</p>
                          {note.createdAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatNoteDateShort(note.createdAt)}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveNote(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Explanation Dialog */}
      <Dialog open={activeDialog === 'explanation'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Explicação Simplificada
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">
                O que o professor pediu:
              </h4>
              <div className="space-y-2">
                {workData.explicacao && workData.explicacao.length > 0 ? (
                  workData.explicacao.map((item, index) => (
                    <Card key={index} className="p-4">
                      <p className="text-sm">{item}</p>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Explicação não disponível ainda
                  </p>
                )}
              </div>
            </div>

            {workData.sugestoes && workData.sugestoes.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Sugestões de pesquisa:
                </h4>
                <div className="space-y-2">
                  {workData.sugestoes.map((sugestao, index) => (
                    <Card key={index} className="p-4">
                      <p className="text-sm">{sugestao}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {workData.dica && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Dica importante:
                </h4>
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-800">{workData.dica}</p>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Structure Dialog */}
      <Dialog open={activeDialog === 'structure'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Estrutura Sugerida
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">
                Estrutura do seu trabalho:
              </h4>
              {workData.estrutura && workData.estrutura.length > 0 ? (
                <div className="space-y-2">
                  {workData.estrutura.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-0.5">
                          {index + 1}
                        </Badge>
                        <p className="text-sm flex-1">{item}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Estrutura não disponível ainda
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Timeline Dialog */}
      <Dialog open={activeDialog === 'timeline'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Cronograma do Trabalho
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">
                Cronograma sugerido:
              </h4>
              {workData.cronograma && workData.cronograma.length > 0 ? (
                <div className="space-y-3">
                  {workData.cronograma.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-0.5">
                          Semana {item.semana || index + 1}
                        </Badge>
                        <p className="text-sm flex-1">
                          {item.atividade || item}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Cronograma não disponível ainda
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={activeDialog === 'settings'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Configurações do sistema em desenvolvimento...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={activeDialog === 'profile'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Usuário
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Perfil do usuário em desenvolvimento...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Dialog */}
      <Dialog open={activeDialog === 'support'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Central de Suporte
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Central de suporte em desenvolvimento...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
