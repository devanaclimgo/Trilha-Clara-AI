'use client'

import { CheckCircle, Loader2 } from 'lucide-react'

interface LoadingStatusProps {
  isLoading: boolean
  isCompleted: boolean
  loadingText?: string
}

export default function LoadingStatus({
  isLoading,
  isCompleted,
  loadingText = 'Gerando...',
}: LoadingStatusProps) {
  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Pronto!</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-purple-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">{loadingText}</span>
      </div>
    )
  }

  return null
}
