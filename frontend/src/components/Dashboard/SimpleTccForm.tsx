'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { LoadingSpinner } from '../ui/loading-spinner'
import { FileText, FileDown } from 'lucide-react'

interface SimpleTccFormProps {
  onSuccess?: (tccId: string) => void
}

export default function SimpleTccForm({ onSuccess }: SimpleTccFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    faculdade: '',
    curso: '',
    materia: '',
    tema: '',
    tipoTrabalho: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [tccId, setTccId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:4000/api/tcc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar TCC')
      }

      const data = await response.json()
      setTccId(data.id)
      onSuccess?.(data.id)

      // Redirecionar para o dashboard após sucesso
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } catch (err) {
      setError('Erro ao criar TCC. Tente novamente.')
      console.error('Erro:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadWord = async () => {
    if (!tccId) return

    try {
      const response = await fetch(
        `http://localhost:4000/api/tcc/${tccId}/export_word`,
      )
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `TCC_${formData.tema.replace(/\s+/g, '_')}.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error('Erro ao baixar Word:', err)
    }
  }

  const handleDownloadPdf = async () => {
    if (!tccId) return

    try {
      const response = await fetch(
        `http://localhost:4000/api/tcc/${tccId}/export_pdf`,
      )
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `TCC_${formData.tema.replace(/\s+/g, '_')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error('Erro ao baixar PDF:', err)
    }
  }

  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== '',
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-2xl shadow-xl bg-slate-50/80 backdrop-blur-sm border-slate-200/20">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold gradient-text">
            Criar TCC
          </CardTitle>
          <p className="text-muted-foreground">
            Preencha os dados básicos para gerar sua estrutura ABNT
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome do Aluno
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Faculdade/Escola
                </label>
                <input
                  type="text"
                  value={formData.faculdade}
                  onChange={(e) =>
                    handleInputChange('faculdade', e.target.value)
                  }
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  placeholder="Nome da faculdade/escola"
                />
              </div>
            </div>

            <div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Curso/Matéria
                </label>
                <input
                  type="text"
                  value={formData.curso}
                  onChange={(e) => handleInputChange('curso', e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  placeholder="Ex: Medicina, Direito, Matemática"
                />
              </div>

              <label className="block text-sm font-medium mb-2 mt-5">
                Tema/Assunto do Trabalho
              </label>
              <input
                type="text"
                value={formData.tema}
                onChange={(e) => handleInputChange('tema', e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                placeholder="Tema/Assunto principal do seu trabalho"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tipo de Trabalho
              </label>
              <select
                value={formData.tipoTrabalho}
                onChange={(e) =>
                  handleInputChange('tipoTrabalho', e.target.value)
                }
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
              >
                <option value="">Selecione o tipo de trabalho</option>
                <option value="tcc">
                  TCC (Trabalho de Conclusão de Curso)
                </option>
                <option value="artigo-cientifico">Artigo Científico</option>
                <option value="monografia">Monografia</option>
                <option value="dissertacao">Dissertação</option>
                <option value="tese">Tese</option>
                <option value="projeto-experimental">
                  Projeto Experimental
                </option>
                <option value="estudo-de-caso">Estudo de Caso</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full px-8 py-3 rounded-2xl gradient-bg text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? 'Gerando...' : 'Gerar Estrutura ABNT'}
              </Button>

              {tccId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Button
                    onClick={handleDownloadWord}
                    variant="outline"
                    className="w-full px-6 py-3 rounded-2xl border-purple-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-300 flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Baixar Word
                  </Button>

                  <Button
                    onClick={handleDownloadPdf}
                    variant="outline"
                    className="w-full px-6 py-3 rounded-2xl border-purple-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-300 flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Baixar PDF
                  </Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      {isLoading && <LoadingSpinner message="Gerando estrutura ABNT..." />}
    </div>
  )
}
