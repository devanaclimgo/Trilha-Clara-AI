'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { LoadingSpinner } from '../ui/loading-spinner'

interface SimpleTccFormProps {
  onSuccess?: (tccId: string) => void
}

export default function SimpleTccForm({ onSuccess }: SimpleTccFormProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    curso: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [, setTccId] = useState<string | null>(null)
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

  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== '',
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-2xl shadow-xl bg-slate-50/80 backdrop-blur-sm border-slate-200/20">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold gradient-text">
            Novo Trabalho
          </CardTitle>
          <p className="text-muted-foreground">
            Preencha as informações básicas do seu trabalho
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título do Trabalho
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                placeholder="Ex: Análise de Impacto Ambiental"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Curso</label>
              <select
                value={formData.curso}
                onChange={(e) => handleInputChange('curso', e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
              >
                <option value="">Selecione seu curso</option>
                <option value="medicina">Medicina</option>
                <option value="direito">Direito</option>
                <option value="engenharia">Engenharia</option>
                <option value="contabeis">Ciências Contábeis</option>
                <option value="psicologia">Psicologia</option>
                <option value="desenvolvimento-de-sistemas">
                  Análise e Desenvolvimento de Sistemas
                </option>
                <option value="publicidade">Publicidade e Propaganda</option>
                <option value="seguranca-da-informacao">
                  Segurança da Informação
                </option>
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
                {isLoading ? 'Criando...' : 'Criar Trabalho'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {isLoading && <LoadingSpinner message="Gerando estrutura ABNT..." />}
    </div>
  )
}
