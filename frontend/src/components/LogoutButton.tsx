'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { LogOut, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

interface LogoutButtonProps {
  onLogout: () => void
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem('tcc-trabalhos')
    localStorage.removeItem('tcc-notes')
    localStorage.removeItem('auth-token')

    // Chamar função de logout
    onLogout()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl hover:bg-red-50 border-red-200 hover:border-red-300 hover:text-red-600 flex items-center gap-2 px-4 py-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Sair</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-red-600 text-xl text-center flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Saída
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Tem certeza que deseja sair da sua conta?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Seus dados locais (trabalhos e
              anotações) serão mantidos, mas você precisará fazer login
              novamente para acessá-los.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-xl hover:bg-gray-50 border-gray-200 hover:border-gray-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Sair da Conta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
