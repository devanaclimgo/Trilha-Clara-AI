'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  GraduationCap,
  User,
  Mail,
  Phone,
  Lock,
  Edit3,
  Trash2,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
}

interface DashboardProfileScreenProps {
  onBackToHome?: () => void
}

export default function DashboardProfileScreen({
  onBackToHome,
}: DashboardProfileScreenProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState('')

  // Load profile data
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setEditForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        })
      } else {
        console.error('Erro ao carregar perfil')
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = () => {
    setEditDialogOpen(true)
    setErrors([])
    setSuccessMessage('')
  }

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/api/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: editForm }),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setEditDialogOpen(false)
        setSuccessMessage('Perfil atualizado com sucesso!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setErrors(errorData.errors || ['Erro ao atualizar perfil'])
      }
    } catch {
      setErrors(['Erro de conexão'])
    }
  }

  const handleChangePassword = () => {
    setPasswordDialogOpen(true)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setErrors([])
    setSuccessMessage('')
  }

  const handleSavePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrors(['As senhas não coincidem'])
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        'http://localhost:4000/api/profile/password',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: passwordForm }),
        },
      )

      if (response.ok) {
        setPasswordDialogOpen(false)
        setSuccessMessage('Senha atualizada com sucesso!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setErrors(errorData.errors || ['Erro ao atualizar senha'])
      }
    } catch {
      setErrors(['Erro de conexão'])
    }
  }

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true)
    setErrors([])
    setSuccessMessage('')
  }

  const confirmDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/api/profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      } else {
        const errorData = await response.json()
        setErrors(errorData.errors || ['Erro ao deletar conta'])
      }
    } catch {
      setErrors(['Erro de conexão'])
    }
  }

  const formatPhone = (phone: string) => {
    if (!phone) return 'Não informado'
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
          {onBackToHome && (
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
          )}
            <div>
              <h1 className="text-3xl font-bold gradient-text">Meu Perfil</h1>
              <p className="text-gray-600">
                Gerencie suas informações pessoais
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl text-green-800">
            {successMessage}
          </div>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-800">
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Profile Card */}
        <Card className="rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border-slate-200/20">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold gradient-text">
              {profile?.name || 'Usuário'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Profile Information */}
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Nome completo</p>
                  <p className="font-medium">
                    {profile?.name || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <Mail className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">E-mail</p>
                  <p className="font-medium">
                    {profile?.email || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <Phone className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">
                    {formatPhone(profile?.phone || '')}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleEditProfile}
                className="flex-1 rounded-xl gradient-bg text-white hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Editar Perfil
              </Button>

              <Button
                onClick={handleChangePassword}
                variant="outline"
                className="flex-1 rounded-xl border-purple-200 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Alterar Senha
              </Button>

              <Button
                onClick={handleDeleteAccount}
                variant="outline"
                className="flex-1 rounded-xl border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Deletar Conta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-gradient-trilha text-xl text-center">
                Editar Perfil
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={handleSaveProfile}
                  className="rounded-xl gradient-bg text-white hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  className="rounded-xl border-gray-300 hover:bg-gray-50 hover:text-purple-600 transition-all duration-300"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-gradient-trilha text-xl text-center">
                Alterar Senha
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha atual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                    placeholder="Digite sua senha atual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                    placeholder="Digite sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                    placeholder="Confirme sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={handleSavePassword}
                  className="rounded-xl gradient-bg text-white hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPasswordDialogOpen(false)}
                  className="rounded-xl border-gray-300 hover:bg-gray-50 hover:text-purple-600 transition-all duration-300"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-red-600 text-xl text-center">
                Deletar Conta
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-gray-700 mb-2">
                  Tem certeza que deseja deletar sua conta?
                </p>
                <p className="text-sm text-gray-500">
                  Esta ação não pode ser desfeita. Todos os seus dados serão
                  perdidos permanentemente.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={confirmDeleteAccount}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar Conta
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="rounded-xl border-gray-300 hover:bg-gray-50 hover:text-purple-600 transition-all duration-300"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
