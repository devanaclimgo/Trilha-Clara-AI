// =====================================================
// CONFIGURAÇÃO DA API - FRONTEND TCC EFFORTLESS
// =====================================================

// config/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Tipos da API
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface User {
  id: string
  email: string
  nome: string
  instituicao?: string
  curso?: string
  telefone?: string
  avatar_url?: string
  is_active: boolean
  email_verified: boolean
  created_at: string
  last_login?: string
}

export interface TccData {
  id: string
  user_id: string
  titulo: string
  tema?: string
  area_conhecimento?: string
  tipo_trabalho: string
  status: 'draft' | 'in_progress' | 'completed' | 'archived'
  prazo_entrega?: string
  orientador_nome?: string
  orientador_email?: string
  instituicao?: string
  curso?: string
  created_at: string
  updated_at: string
  content_data: WorkContent
  custom_sections: CustomSection[]
  field_labels: Record<string, string>
  field_order: string[]
  ai_data: {
    explanations: Record<string, string>
    structure: any[]
    timeline: any[]
  }
}

export interface WorkContent {
  resumo: string
  introducao: string
  objetivos: string
  justificativa: string
  metodologia: string
  desenvolvimento: string
  conclusao: string
  referencias: string
  [key: string]: string
}

export interface CustomSection {
  key: string
  label: string
  description: string
  content: string
  order: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  nome: string
  instituicao?: string
  curso?: string
  telefone?: string
}

export interface GoogleAuthRequest {
  token: string
}

// Cliente da API
class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Autenticação
  async login(
    credentials: LoginRequest,
  ): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
    )

    this.token = response.data?.token || null
    if (this.token && typeof window !== 'undefined') {
      localStorage.setItem('token', this.token)
    }

    return response.data!
  }

  async register(
    userData: RegisterRequest,
  ): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
    )

    this.token = response.data?.token || null
    if (this.token && typeof window !== 'undefined') {
      localStorage.setItem('token', this.token)
    }

    return response.data!
  }

  async googleAuth(
    googleData: GoogleAuthRequest,
  ): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>(
      '/auth/google',
      {
        method: 'POST',
        body: JSON.stringify(googleData),
      },
    )

    this.token = response.data?.token || null
    if (this.token && typeof window !== 'undefined') {
      localStorage.setItem('token', this.token)
    }

    return response.data!
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', {
      method: 'DELETE',
    })

    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<{ user: User }>('/auth/me')
    return response.data!.user
  }

  // TCCs
  async getTccs(): Promise<TccData[]> {
    const response = await this.request<{ data: TccData[] }>('/tccs')
    return response.data || []
  }

  async getTcc(id: string): Promise<TccData> {
    const response = await this.request<TccData>(`/tccs/${id}`)
    return response.data!
  }

  async createTcc(tccData: Partial<TccData>): Promise<TccData> {
    const response = await this.request<TccData>('/tccs', {
      method: 'POST',
      body: JSON.stringify({ tcc: tccData }),
    })
    return response.data!
  }

  async updateTcc(id: string, tccData: Partial<TccData>): Promise<TccData> {
    const response = await this.request<TccData>(`/tccs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ tcc: tccData }),
    })
    return response.data!
  }

  async deleteTcc(id: string): Promise<void> {
    await this.request(`/tccs/${id}`, {
      method: 'DELETE',
    })
  }

  // Conteúdo
  async getTccContent(id: string): Promise<{
    content: WorkContent
    custom_sections: CustomSection[]
    field_labels: Record<string, string>
    field_order: string[]
  }> {
    const response = await this.request(`/tccs/${id}/content`)
    return response.data!
  }

  async saveTccContent(
    id: string,
    content: WorkContent,
    customFields: CustomSection[],
    fieldLabels: Record<string, string>,
    fieldOrder: string[],
  ): Promise<void> {
    await this.request(`/tccs/${id}/save_content`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        customFields,
        fieldLabels,
        fieldOrder,
      }),
    })
  }

  async generateContent(
    id: string,
    field: string,
    userIdeas?: string,
  ): Promise<{ content: string }> {
    const response = await this.request<{ content: string }>(
      `/tccs/${id}/generate_content`,
      {
        method: 'POST',
        body: JSON.stringify({
          field,
          user_ideas: userIdeas || '',
        }),
      },
    )
    return response.data!
  }

  // Estrutura e IA
  async getTccStructure(id: string): Promise<{ structure: any[] }> {
    const response = await this.request(`/tccs/${id}/structure`)
    return response.data!
  }

  async generateStructure(id: string): Promise<{ structure: any[] }> {
    const response = await this.request(`/tccs/${id}/generate_structure`, {
      method: 'POST',
    })
    return response.data!
  }

  async getTccTimeline(id: string): Promise<{ timeline: any[] }> {
    const response = await this.request(`/tccs/${id}/timeline`)
    return response.data!
  }

  async generateTimeline(id: string): Promise<{ timeline: any[] }> {
    const response = await this.request(`/tccs/${id}/generate_timeline`, {
      method: 'POST',
    })
    return response.data!
  }

  async getTccExplanation(
    id: string,
    type: string = 'simplified',
  ): Promise<{ explanation: string }> {
    const response = await this.request(`/tccs/${id}/explanation?type=${type}`)
    return response.data!
  }

  async generateExplanation(
    id: string,
    type: string = 'simplified',
  ): Promise<{ explanation: string }> {
    const response = await this.request(`/tccs/${id}/generate_explanation`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    })
    return response.data!
  }

  // Seções customizadas
  async addCustomSection(
    id: string,
    title: string,
    description?: string,
  ): Promise<{ section: CustomSection }> {
    const response = await this.request<{ section: CustomSection }>(
      `/tccs/${id}/custom_sections`,
      {
        method: 'POST',
        body: JSON.stringify({ title, description }),
      },
    )
    return response.data!
  }

  async updateCustomSection(
    id: string,
    sectionId: string,
    title: string,
    description?: string,
  ): Promise<{ section: CustomSection }> {
    const response = await this.request<{ section: CustomSection }>(
      `/tccs/${id}/custom_sections/${sectionId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ title, description }),
      },
    )
    return response.data!
  }

  async deleteCustomSection(id: string, sectionId: string): Promise<void> {
    await this.request(`/tccs/${id}/custom_sections/${sectionId}`, {
      method: 'DELETE',
    })
  }

  // Labels e ordem
  async updateSectionLabels(
    id: string,
    labels: Record<string, string>,
  ): Promise<void> {
    await this.request(`/tccs/${id}/section_labels`, {
      method: 'PATCH',
      body: JSON.stringify({ labels }),
    })
  }

  async updateFieldOrder(id: string, fieldOrder: string[]): Promise<void> {
    await this.request(`/tccs/${id}/field_order`, {
      method: 'PATCH',
      body: JSON.stringify({ field_order: fieldOrder }),
    })
  }

  // Histórico
  async getTccHistory(id: string): Promise<{ history: any[] }> {
    const response = await this.request(`/tccs/${id}/history`)
    return response.data!
  }

  async restoreFromHistory(id: string, historyId: string): Promise<void> {
    await this.request(`/tccs/${id}/history/${historyId}/restore`, {
      method: 'POST',
    })
  }

  // Export
  async exportWord(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/tccs/${id}/export/word`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
    return response.blob()
  }

  async exportPdf(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/tccs/${id}/export/pdf`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
    return response.blob()
  }

  // Health check
  async healthCheck(): Promise<{
    status: string
    timestamp: string
    database: string
    version: string
  }> {
    const response = await this.request('/health')
    return response.data!
  }
}

// Instância global da API
export const api = new ApiClient(API_BASE_URL)

// Hook para usar a API no React
export function useApi() {
  return api
}

// Utilitários
export function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Configuração do ambiente
export const config = {
  apiUrl: API_BASE_URL,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}
