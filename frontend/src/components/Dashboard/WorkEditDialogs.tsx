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
  Mail,
  Phone,
  AlertCircle,
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Meu Perfil
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Usuário</h3>
                  <p className="text-sm text-gray-600">
                    Membro do Trilha Clara
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="text-sm font-medium">usuario@email.com</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Telefone</p>
                      <p className="text-sm font-medium">(11) 99999-9999</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-gray-600">Trabalhos</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Anotações</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  closeDialog()
                  // Navigate to dashboard profile screen
                  window.location.href = '/dashboard?screen=profile'
                }}
                className="gradient-bg text-white hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Editar Perfil Completo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Dialog */}
      <Dialog open={activeDialog === 'support'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Central de Suporte
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* FAQ Section */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Perguntas Frequentes
              </h3>

              <div className="space-y-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Como gerar conteúdo com IA?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Na aba "Conteúdo", expanda o card desejado, escreva suas
                    ideias iniciais e clique em "Gerar com IA". A IA irá
                    expandir seu conteúdo baseado no tema do trabalho.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Posso reordenar as seções do trabalho?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Sim! Use as 6 bolinhas (ícone de arrastar) que aparecem no
                    hover de cada card para reordenar as seções conforme sua
                    preferência.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Meu progresso é salvo automaticamente?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Sim! O sistema salva automaticamente suas alterações. Você
                    também pode clicar em "Salvar Tudo" para garantir que tudo
                    foi salvo.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Contato</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      anaclimgo@gmail.com
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Resposta em até 24h
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Dicas</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-blue-700">
                    Escreva suas ideias primeiro, depois use a IA para expandir
                  </p>
                  <p className="text-sm text-blue-700">
                    Use o preview ABNT para verificar a formatação final
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  closeDialog()
                  // Navigate to dashboard support screen
                  window.location.href = '/dashboard?screen=support'
                }}
                className="gradient-bg text-white hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Ver Suporte Completo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
