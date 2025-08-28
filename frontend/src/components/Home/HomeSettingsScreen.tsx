import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import ThemeToggle from './HomeThemeToggle'
import { Badge } from '../ui/badge'

export default function HomeSettingsScreen() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência no Trilha Clara</p>
      </div>

      <div className="grid gap-6">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Configure o tema e a aparência da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tema</p>
                <p className="text-sm text-muted-foreground">Escolha entre claro, escuro ou automático</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie como você recebe notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por email</p>
                <p className="text-sm text-muted-foreground">Receba lembretes sobre prazos</p>
              </div>
              <Badge variant="secondary">Em breve</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações push</p>
                <p className="text-sm text-muted-foreground">Alertas no navegador</p>
              </div>
              <Badge variant="secondary">Em breve</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Idioma</CardTitle>
            <CardDescription>Selecione o idioma da interface</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Português (Brasil)</p>
                <p className="text-sm text-muted-foreground">Idioma atual da interface</p>
              </div>
              <Badge variant="secondary">Padrão</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}