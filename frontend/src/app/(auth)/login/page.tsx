'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { useToast } from '@/hooks/use-toast'
import { GoogleButton } from '@/components/ui/google-button'

export default function LoginPage() {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const r = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            email: formData.email,
            password: formData.password,
          },
        }),
      })
      const data = await r.json()

      if (r.ok) {
        toast({
          variant: 'success',
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando para a página inicial...',
        })
        localStorage.setItem('token', data.token)
        setTimeout(() => {
          window.location.href = '/home'
        }, 1500)
      } else {
        const errorMessage = data.errors
          ? Array.isArray(data.errors)
            ? data.errors.join(', ')
            : data.errors
          : 'Falha no login'
        toast({
          variant: 'error',
          title: 'Erro no login',
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

  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const googleLogin = useGoogleLogin({
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
            title: 'Login com Google realizado!',
            description: 'Redirecionando para o dashboard...',
          })
          localStorage.setItem('token', data.token)
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 1500)
        } else {
          const errorMessage =
            data.error || data.errors || 'Falha no login com Google'
          toast({
            variant: 'error',
            title: 'Erro no login com Google',
            description: errorMessage,
          })
        }
      } catch (error) {
        console.error('Google login error:', error)
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
          title: 'Erro no login com Google',
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

  const handleGoogleLogin = () => googleLogin()

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
          className="mb-6 hover:bg-primary/10 rounded-xl"
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
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-base">
              Entre na sua conta para continuar organizando seu TCC
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="pl-10 pr-10 rounded-xl border-2 focus:border-primary/50 transition-colors"
                    required
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

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
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
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? 'Conectando...' : 'Continuar com Google'}
            </GoogleButton>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link
                href="/signup"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Criar conta
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
