'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { GoogleButton } from '@/components/ui/google-button'
import { TermsDialog } from '@/components/ui/terms-dialog'
import { useGoogleLogin } from '@react-oauth/google'

export default function AuthCard() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true)
      try {
        const response = await fetch('http://localhost:4000/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        })

        const data = await response.json()

        if (response.ok) {
          // Verificar se é usuário novo ou existente
          if (data.isNewUser) {
            // Usuário novo - ir para primeira página do dashboard
            router.push('/dashboard?firstTime=true')
          } else {
            // Usuário existente - ir para página de boas-vindas
            router.push('/dashboard')
          }
        } else {
          throw new Error(data.message || 'Erro na autenticação')
        }
      } catch (error) {
        console.error('Erro na autenticação Google:', error)
        toast({
          variant: 'error',
          title: 'Erro de autenticação',
          description:
            'Não foi possível fazer login com Google. Tente novamente.',
        })
      } finally {
        setIsGoogleLoading(false)
      }
    },
    onError: () => {
      toast({
        variant: 'error',
        title: 'Erro de autenticação',
        description:
          'Não foi possível fazer login com Google. Tente novamente.',
      })
    },
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!acceptTerms) {
      toast({
        variant: 'warning',
        title: 'Termos não aceitos',
        description: 'Você deve aceitar os termos de uso para continuar.',
      })
      return
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        variant: 'error',
        title: 'Erro de validação',
        description: 'As senhas não coincidem. Tente novamente.',
      })
      return
    }

    setIsLoading(true)

    try {
      const endpoint = isLogin
        ? 'http://localhost:4000/auth/login'
        : 'http://localhost:4000/auth/signup'
      const body = isLogin
        ? { user: { email: formData.email, password: formData.password } }
        : {
            user: {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            },
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        if (isLogin) {
          router.push('/dashboard')
        } else {
          router.push('/dashboard?firstTime=true')
        }
      } else {
        throw new Error(data.message || 'Erro na autenticação')
      }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      toast({
        variant: 'error',
        title: 'Erro de autenticação',
        description: isLogin
          ? 'Email ou senha incorretos. Tente novamente.'
          : 'Erro ao criar conta. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div id="auth" className="flex justify-center py-16">
      <Card className="w-full max-w-md rounded-2xl shadow-xl bg-slate-50/80 backdrop-blur-sm border-slate-200/20">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold gradient-text">
            {isLogin ? 'Fazer Login' : 'Criar Conta'}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? 'Entre na sua conta para continuar'
              : 'Crie sua conta para começar'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="pl-10 rounded-xl"
                    placeholder="Seu nome completo"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="pl-10 rounded-xl"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="pl-10 pr-10 rounded-xl"
                  placeholder="Sua senha"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateFormData('confirmPassword', e.target.value)
                    }
                    className="pl-10 pr-10 rounded-xl"
                    placeholder="Confirme sua senha"
                    required={!isLogin}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked: boolean) =>
                  setAcceptTerms(checked as boolean)
                }
                className="rounded-md"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                Aceito os{' '}
                <TermsDialog type="terms">
                  <span className="text-primary hover:text-primary/80 transition-colors cursor-pointer underline">
                    termos de uso
                  </span>
                </TermsDialog>{' '}
                e{' '}
                <TermsDialog type="privacy">
                  <span className="text-primary hover:text-primary/80 transition-colors cursor-pointer underline">
                    política de privacidade
                  </span>
                </TermsDialog>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              disabled={isLoading || !acceptTerms}
            >
              {isLoading
                ? isLogin
                  ? 'Entrando...'
                  : 'Criando conta...'
                : isLogin
                ? 'Fazer Login'
                : 'Criar Conta'}
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

          <GoogleButton onClick={handleGoogleAuth} disabled={isGoogleLoading}>
            {isGoogleLoading ? 'Conectando...' : 'Entrar com Google'}
          </GoogleButton>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
            </span>
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80 font-medium transition-colors p-0 h-auto"
            >
              {isLogin ? 'Criar conta' : 'Fazer login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
