'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { GoogleButton } from '@/components/ui/google-button'

export default function SignupPage() {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'error',
        title: 'Erro de validação',
        description: 'As senhas não coincidem. Tente novamente.',
      })
      return
    }
    if (!formData.acceptTerms) {
      toast({
        variant: 'warning',
        title: 'Termos não aceitos',
        description: 'Você deve aceitar os termos de uso para continuar.',
      })
      return
    }
    setIsLoading(true)

    try {
      const r = await fetch('http://localhost:4000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
          },
        }),
      })

      const data = await r.json()

      if (r.ok) {
        console.log('Signup success!', data)
        toast({
          variant: 'success',
          title: 'Conta criada com sucesso!',
          description: 'Redirecionando para o dashboard...',
        })
        // Save token in localStorage (or cookie)
        localStorage.setItem('token', data.token)
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      } else {
        const errorMessage = data.errors
          ? Array.isArray(data.errors)
            ? data.errors.join(', ')
            : data.errors
          : 'Falha ao criar conta'
        toast({
          variant: 'error',
          title: 'Erro ao criar conta',
          description: errorMessage,
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        variant: 'error',
        title: 'Erro de conexão',
        description:
          'Não foi possível conectar ao servidor. Verifique sua conexão.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const googleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      setIsGoogleLoading(true)
      try {
        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`,
        )

        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info from Google')
        }

        const userInfo = await userInfoResponse.json()

        const r = await fetch('http://localhost:4000/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            google_id: userInfo.id,
          }),
        })

        const data = await r.json()

        if (r.ok && data.token) {
          toast({
            variant: 'success',
            title: 'Conta criada com Google!',
            description: 'Redirecionando para o dashboard...',
          })
          localStorage.setItem('token', data.token)
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 1500)
        } else {
          const errorMessage =
            data.error || data.errors || 'Falha no cadastro com Google'
          toast({
            variant: 'error',
            title: 'Erro no cadastro com Google',
            description: errorMessage,
          })
        }
      } catch (error) {
        console.error('Google signup error:', error)
        let errorMessage =
          'Não foi possível conectar com o Google. Tente novamente.'

        if (error instanceof Error) {
          if (error.message.includes('Failed to fetch user info')) {
            errorMessage = 'Erro ao obter informações do usuário do Google.'
          } else if (error.message.includes('network')) {
            errorMessage = 'Erro de conexão. Verifique sua internet.'
          }
        }

        toast({
          variant: 'error',
          title: 'Erro no cadastro com Google',
          description: errorMessage,
        })
      } finally {
        setIsGoogleLoading(false)
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error)
      setIsGoogleLoading(false)
      toast({
        variant: 'error',
        title: 'Erro de autenticação',
        description: 'Falha na autenticação com Google. Tente novamente.',
      })
    },
  })

  const handleGoogleSignup = () => googleSignup()

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 hover:bg-primary/10 hover:text-purple-600 transition-all duration-300 rounded-xl"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
        </Button>

        <Card className="rounded-2xl shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <span className="text-2xl font-bold text-white">TC</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Crie sua conta
            </CardTitle>
            <CardDescription className="text-base">
              Comece a organizar seu TCC de forma simples e eficiente
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="pl-10 rounded-xl border-2 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="pl-10 rounded-xl border-2 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="pl-10 pr-10 rounded-xl border-2 focus:border-primary/50 transition-colors"
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 rounded-lg hover:bg-primary/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateFormData('confirmPassword', e.target.value)
                    }
                    className="pl-10 pr-10 rounded-xl border-2 focus:border-primary/50 transition-colors"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 rounded-lg hover:bg-primary/10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked: boolean) =>
                    updateFormData('acceptTerms', checked as boolean)
                  }
                  className="rounded-md"
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  Aceito os{' '}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    termos de uso
                  </Link>{' '}
                  e{' '}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    política de privacidade
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  ou continue com
                </span>
              </div>
            </div>

            <GoogleButton
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? 'Conectando...' : 'Continuar com Google'}
            </GoogleButton>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
