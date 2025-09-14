import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Hero = () => {
  return (
    <div>
      {' '}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6">
          Trilha Clara
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Simplifique sua jornada acadêmica. Organize, estruture e finalize seu
          TCC com confiança e clareza.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/signup">Criar Conta</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 rounded-2xl border-2 hover:bg-primary/20 transition-all duration-300 bg-white/50"
          >
            <Link href="/login">Fazer Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Hero
