"use client"

import { useState } from "react"
import { FileText, Plus, Trash2, Edit3, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Note {
  id: string
  title: string
  content: string
  date: string
  tags: string[]
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Metodologia de Pesquisa",
      content: "Importante considerar a abordagem qualitativa para análise dos dados coletados...",
      date: "2024-01-15",
      tags: ["metodologia", "pesquisa"],
    },
    {
      id: "2",
      title: "Referências Bibliográficas",
      content: "Lista de autores relevantes para o tema: Silva (2023), Santos (2022)...",
      date: "2024-01-14",
      tags: ["bibliografia", "referências"],
    },
    {
      id: "3",
      title: "Cronograma Atualizado",
      content: "Ajustar prazos considerando a complexidade da análise de dados...",
      date: "2024-01-13",
      tags: ["cronograma", "prazos"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  })

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSaveNote = () => {
    const newNote: Note = {
      id: editingNote?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      date: new Date().toISOString().split("T")[0],
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    if (editingNote) {
      setNotes(notes.map((note) => (note.id === editingNote.id ? newNote : note)))
    } else {
      setNotes([newNote, ...notes])
    }

    setFormData({ title: "", content: "", tags: "" })
    setEditingNote(null)
    setIsDialogOpen(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
    })
    setIsDialogOpen(true)
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const openNewNoteDialog = () => {
    setEditingNote(null)
    setFormData({ title: "", content: "", tags: "" })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Anotações</h1>
          <p className="text-muted-foreground">Gerencie suas anotações de pesquisa e estudos</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewNoteDialog} className="rounded-xl gradient-bg hover:opacity-90 transition-opacity">
              <Plus className="size-4 mr-2" />
              Nova Anotação
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNote ? "Editar Anotação" : "Nova Anotação"}</DialogTitle>
              <DialogDescription>
                {editingNote ? "Modifique sua anotação" : "Crie uma nova anotação para seus estudos"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título da anotação"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escreva sua anotação aqui..."
                  className="rounded-xl min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="metodologia, pesquisa, bibliografia"
                  className="rounded-xl"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSaveNote} className="rounded-xl gradient-bg hover:opacity-90 transition-opacity">
                {editingNote ? "Salvar Alterações" : "Criar Anotação"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar anotações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      <div className="grid gap-4">
        {filteredNotes.length === 0 ? (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma anotação encontrada</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? "Tente buscar por outros termos" : "Comece criando sua primeira anotação"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription>{note.date}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditNote(note)}
                      className="size-8 hover:bg-muted"
                    >
                      <Edit3 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                      className="size-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
