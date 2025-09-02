import React from 'react'
import { Button } from '../ui/button'
import { Menu, ArrowLeft, GraduationCap } from 'lucide-react'

interface DashboardHeaderProps {
  setSidebarOpen: (open: boolean) => void
  currentScreen:
    | 'main'
    | 'notes'
    | 'timeline'
    | 'settings'
    | 'profile'
    | 'support'
  setCurrentScreen: (
    screen: 'main' | 'notes' | 'timeline' | 'settings' | 'profile' | 'support',
  ) => void
}

const DashboardHeader = ({
  setSidebarOpen,
  currentScreen,
  setCurrentScreen,
}: DashboardHeaderProps) => {
  return (
    <div>
      {' '}
      <header className="border-b border-white/20 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="default"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600 mr-2 flex items-center gap-2 px-4 py-2"
            >
              <Menu className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:block">Menu</span>
            </Button>
            {currentScreen !== 'main' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentScreen('main')}
                className="rounded-xl hover:bg-purple-50 mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="p-2 rounded-2xl gradient-bg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Trilha Clara</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            {currentScreen === 'main' && 'Seu assistente inteligente para TCC'}
            {currentScreen === 'notes' && 'Suas anotações salvas'}
            {currentScreen === 'timeline' && 'Cronograma do seu TCC'}
            {currentScreen === 'settings' && 'Configurações do sistema'}
            {currentScreen === 'profile' && 'Seu perfil de usuário'}
            {currentScreen === 'support' && 'Central de suporte'}
          </p>
        </div>
      </header>
    </div>
  )
}

export default DashboardHeader
