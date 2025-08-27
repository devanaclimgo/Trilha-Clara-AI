import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const CTASection = () => {
  return (
    <div>
      {' '}
      <Card className="rounded-2xl shadow-xl border-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Pronto para simplificar seu TCC?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de estudantes que já organizaram seus trabalhos
            acadêmicos com sucesso
          </p>
          <Button
            asChild
            size="lg"
            className="text-lg px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/auth/signup">Criar Conta Gratuita</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default CTASection
