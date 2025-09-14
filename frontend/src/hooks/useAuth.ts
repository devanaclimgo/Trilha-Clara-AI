'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      if (token) {
        setIsAuthenticated(true)
        // Se estiver na home e estiver logado, redirecionar para dashboard
        if (window.location.pathname === '/') {
          router.push('/dashboard')
        }
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    router.push('/')
  }

  return {
    isAuthenticated,
    isLoading,
    logout,
  }
}
