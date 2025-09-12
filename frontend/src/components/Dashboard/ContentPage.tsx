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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {hasCompletedInitialData && (
            <Button
              variant="outline"
              onClick={onBackToHome}
              className="rounded-xl hover:bg-purple-50 border-purple-200 hover:border-purple-300 hover:text-purple-600 flex items-center gap-2 px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Voltar ao início</span>
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold gradient-text">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
