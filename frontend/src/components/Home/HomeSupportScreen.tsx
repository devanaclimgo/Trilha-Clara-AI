"use client"

import type React from "react"

import { useState } from "react"
import { HelpCircle, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SupportScreen() {
  const [formData, setFormData] = useState({
    subject: "",
    name: "",
    email: "",
    description: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: POST request would go here
    console.log("Support request:", formData)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ subject: "", name: "", email: "", description: "" })
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="rounded-2xl shadow-sm max-w-md w-full text-center">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                <CheckCircle className="size-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold gradient-text">Mensagem Enviada!</h3>
                <p className="text-muted-foreground text-sm">
                  Sua mensagem foi recebida com sucesso. Entraremos em contato por e-mail em breve.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Suporte</h1>
        <p className="text-muted-foreground">Precisa de ajuda? Entre em contato conosco</p>
      </div>

      <Card className="rounded-2xl shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="size-5" />
            Formulário de Contato
          </CardTitle>
          <CardDescription>Descreva sua dúvida ou problema e retornaremos em breve</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Ex: Dúvida sobre cronograma"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  className="rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu.email@exemplo.com"
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva detalhadamente sua dúvida ou problema..."
                className="rounded-xl min-h-[120px]"
                required
              />
            </div>

            <Button type="submit" className="w-full rounded-xl gradient-bg hover:opacity-90 transition-opacity">
              <Send className="size-4 mr-2" />
              Enviar Mensagem
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}