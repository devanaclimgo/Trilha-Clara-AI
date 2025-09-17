'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowLeft,
  Mail,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen,
  FileText,
  Download,
  Eye,
  Settings,
} from 'lucide-react'
import { useState } from 'react'

interface DashboardSupportScreenProps {
  onBackToHome: () => void
}

export default function DashboardSupportScreen({
  onBackToHome,
}: DashboardSupportScreenProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    )
  }

  const faqData = [
    {
      id: 'getting-started',
      title: 'Primeiros Passos',
      icon: BookOpen,
      questions: [
        {
          id: 'how-to-create-work',
          question: 'Como criar um novo trabalho?',
          answer:
            'Clique no botão "Novo Trabalho" na tela inicial, preencha os dados básicos (título, tipo de trabalho, curso) e clique em "Criar". O sistema irá gerar automaticamente uma estrutura sugerida para seu trabalho.',
        },
        {
          id: 'what-is-ai-help',
          question: 'Como a IA pode me ajudar?',
          answer:
            'A IA do Trilha Clara pode gerar conteúdo para cada seção do seu trabalho, criar estruturas personalizadas, sugerir cronogramas e formatar automaticamente seguindo as normas ABNT. Basta clicar em "Gerar com IA" em qualquer campo de conteúdo.',
        },
        {
          id: 'work-types',
          question: 'Quais tipos de trabalho são suportados?',
          answer:
            'Atualmente suportamos TCC, Monografia, Dissertação e Tese. Cada tipo tem estruturas e formatações específicas adaptadas para suas necessidades acadêmicas.',
        },
      ],
    },
    {
      id: 'content-creation',
      title: 'Criação de Conteúdo',
      icon: FileText,
      questions: [
        {
          id: 'how-to-generate-content',
          question: 'Como gerar conteúdo com IA?',
          answer:
            'Na aba "Conteúdo", expanda o card desejado, escreva suas ideias iniciais no campo de texto e clique em "Gerar com IA". A IA irá expandir e melhorar seu conteúdo baseado no tema do trabalho.',
        },
        {
          id: 'reorder-sections',
          question: 'Posso reordenar as seções do trabalho?',
          answer:
            'Sim! Use as 6 bolinhas (ícone de arrastar) que aparecem no hover de cada card para reordenar as seções conforme sua preferência. A ordem será mantida na preview e no documento final.',
        },
        {
          id: 'required-fields',
          question: 'Preciso preencher todos os campos?',
          answer:
            'Não! Você pode preencher apenas os campos que desejar. A preview e o download funcionarão com qualquer quantidade de conteúdo preenchido. Os campos obrigatórios são apenas sugeridos.',
        },
      ],
    },
    {
      id: 'preview-download',
      title: 'Preview e Download',
      icon: Download,
      questions: [
        {
          id: 'preview-types',
          question: 'Qual a diferença entre as previews?',
          answer:
            'A preview na aba "Preview" mostra uma visualização simplificada com cores e indicações. O "Preview do Trabalho" no cabeçalho mostra exatamente como ficará o documento final formatado em ABNT.',
        },
        {
          id: 'download-formats',
          question: 'Em quais formatos posso baixar?',
          answer:
            'Você pode baixar seu trabalho em DOCX (Word) e PDF. Ambos seguem a formatação ABNT completa com numeração de páginas, referências e estrutura acadêmica adequada.',
        },
        {
          id: 'page-navigation',
          question: 'Como navegar pelas páginas no preview?',
          answer:
            'No modal de preview ABNT, use as setas de navegação no cabeçalho para ver diferentes páginas do documento. O sistema calcula automaticamente quantas páginas seu trabalho terá.',
        },
      ],
    },
    {
      id: 'technical-issues',
      title: 'Problemas Técnicos',
      icon: Settings,
      questions: [
        {
          id: 'save-progress',
          question: 'Meu progresso é salvo automaticamente?',
          answer:
            'Sim! O sistema salva automaticamente suas alterações. Você também pode clicar em "Salvar Tudo" para garantir que tudo foi salvo. Seus dados ficam seguros na nuvem.',
        },
        {
          id: 'browser-compatibility',
          question: 'Qual navegador devo usar?',
          answer:
            'Recomendamos Chrome, Firefox, Safari ou Edge atualizados. O Trilha Clara funciona melhor em navegadores modernos com suporte a JavaScript ES6+.',
        },
        {
          id: 'data-security',
          question: 'Meus dados estão seguros?',
          answer:
            'Sim! Todos os dados são criptografados e armazenados de forma segura. Não compartilhamos suas informações com terceiros e seguimos as melhores práticas de segurança.',
        },
      ],
    },
  ]

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

            {/* FAQ Section */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <HelpCircle className="h-5 w-5" />
                  Perguntas Frequentes
                </CardTitle>
                <CardDescription className="text-purple-600">
                  Encontre respostas rápidas para as dúvidas mais comuns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqData.map((category) => (
                    <div
                      key={category.id}
                      className="border border-purple-100 rounded-xl overflow-hidden"
                    >
                      <Button
                        variant="ghost"
                        onClick={() => toggleItem(category.id)}
                        className="w-full justify-between p-4 h-auto bg-white/60 hover:bg-white/80 border-0 rounded-none"
                      >
                        <div className="flex items-center gap-3">
                          <category.icon className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-gray-800">
                            {category.title}
                          </span>
                        </div>
                        {openItems.includes(category.id) ? (
                          <ChevronUp className="h-4 w-4 text-purple-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-purple-600" />
                        )}
                      </Button>
                      {openItems.includes(category.id) && (
                        <div className="mt-2 space-y-2 p-4 bg-white/40 backdrop-blur-sm">
                          {category.questions.map((question) => (
                            <div
                              key={question.id}
                              className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-purple-100"
                            >
                              <h4 className="font-medium text-gray-800 mb-2">
                                {question.question}
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {question.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Mail className="h-5 w-5" />
                    Entre em Contato
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    Não encontrou sua resposta? Estou aqui para ajudar!
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

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Eye className="h-5 w-5" />
                    Dicas de Uso
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Aproveite ao máximo o Trilha Clara
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Use a IA estrategicamente
                        </p>
                        <p className="text-sm text-green-600">
                          Escreva suas ideias primeiro, depois use a IA para
                          expandir
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <Download className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Preview antes de baixar
                        </p>
                        <p className="text-sm text-emerald-600">
                          Use o preview ABNT para verificar a formatação final
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
