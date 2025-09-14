'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface DashboardSupportScreenProps {
  onBackToHome: () => void
}

export default function DashboardSupportScreen({
  onBackToHome,
}: DashboardSupportScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'error',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simular envio do email (aqui você pode integrar com um serviço de email)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsSubmitted(true)
      toast({
        title: 'Mensagem enviada!',
        description:
          'Sua mensagem foi enviada com sucesso. Responderemos em breve!',
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Erro ao enviar',
        description: 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.',
        variant: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <div className="container mx-auto px-0 py-8">
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

            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold gradient-text">Suporte</h2>
                  <p className="text-muted-foreground">Central de suporte</p>
                </div>
              </div>

              <div className="flex items-center justify-center py-12">
                <Card className="w-full max-w-md text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Mensagem Enviada!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Sua mensagem foi enviada com sucesso. Responderemos em
                      breve!
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Enviar Nova Mensagem
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-0 py-8">
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

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold gradient-text">Suporte</h2>
                <p className="text-muted-foreground">Central de suporte</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Informações de Contato */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Mail className="h-5 w-5" />
                    Entre em Contato
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    Estou aqui para ajudar você com qualquer dúvida sobre o
                    Trilha Clara
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Mail className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Email de Suporte
                        </p>
                        <p className="text-sm text-purple-600 font-mono">
                          anaclimgo@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Tempo de Resposta
                        </p>
                        <p className="text-sm text-blue-600">Até 24 horas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulário de Contato */}
              <Card>
                <CardHeader>
                  <CardTitle>Envie sua Mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e eu responderei o mais rápido
                    possível
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Nome *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Seu nome completo"
                          className="rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          className="rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Assunto
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Qual é o assunto da sua mensagem?"
                        className="rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Mensagem *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Descreva sua dúvida ou problema detalhadamente..."
                        className="rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400 min-h-[120px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enviando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Enviar Mensagem
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
