'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface ContentPageProps {
  title: string
  description: string
  children: React.ReactNode
  hasCompletedInitialData: boolean
  onBackToHome: () => void
}

export default function ContentPage({
  title,
  description,
  children,
  hasCompletedInitialData,
  onBackToHome,
}: ContentPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-0 py-8">
          {hasCompletedInitialData && onBackToHome && (
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

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold gradient-text">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
