import React from 'react'
import { Button } from './ui/button'
import { Github, Info, Linkedin, Mail, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

const InfoButton = () => {
  return (
    <div className="fixed top-6 right-4 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white shadow-lg hover:bg-white/90 transition-all duration-300 border border-gray-200"
          >
            <Info className="h-5 w-5 text-primary" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[calc(100vw-4rem)] sm:max-w-md bg-white border border-gray-200 shadow-xl data-[state=open]:animate-dialogScaleIn data-[state=closed]:animate-dialogScaleOut">
          <DialogHeader>
            <DialogTitle className="text-gradient-trilha text-xl text-center">
              Sobre a Criadora
            </DialogTitle>
            <DialogDescription className="space-y-4 px-2 text-base text-center">
              Conheça <b>Ana Clara</b>, a mente por trás do projeto Trilha
              Clara.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="h-12 w-12 text-primary" />
              <span className="text-base text-muted-foreground">
                Olá! Sou apaixonada por usar IA para facilitar a vida acadêmica
                dos alunos. A <b>Trilha Clara</b> é a minha visão para
                transformar a forma como os alunos abordam seus projetos de
                tese.
              </span>
            </div>
            <div className="space-y-3">
              <a
                href="mailto:anaclimgo@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">anaclimgo@gmail.com</span>
              </a>
              <a
                href="https://github.com/devanaclimgo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Github className="h-4 w-4 text-primary" />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/ana-clara-gomes-48b83b224/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Linkedin className="h-4 w-4 text-primary" />
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InfoButton
