"use client"

import { useState } from "react"
import { User, Lock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ProfileScreen() {
  const [formData, setFormData] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Perfil do Usuário</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações de conta</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>Atualize seus dados básicos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input
                id="current-password"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-fit rounded-xl gradient-bg hover:opacity-90 transition-opacity">
          <Save className="size-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}