import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, FileText, Users } from "lucide-react"

const FeaturesGrid = () => {
  return (
    <div>
      {' '}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">Enunciado Simplificado</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center leading-relaxed">
              Transforme enunciados complexos em listas claras e objetivas com
              IA
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">Estrutura Sugerida</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center leading-relaxed">
              Receba sugestões de capítulos e seções personalizadas para seu
              trabalho
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">Cronograma Inteligente</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center leading-relaxed">
              Timeline semanal com progresso visual e lembretes por email
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">Formatação ABNT</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center leading-relaxed">
              Export automático em Word e PDF com formatação ABNT perfeita
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FeaturesGrid
