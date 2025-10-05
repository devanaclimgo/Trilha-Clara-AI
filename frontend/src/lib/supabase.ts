import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tccs: {
        Row: {
          id: string
          user_id: string
          titulo: string
          curso: string
          tipo_trabalho: string
          tema: string | null
          nome_aluno: string | null
          instituicao: string | null
          orientador: string | null
          coorientador: string | null
          palavras_chave: string | null
          resumo: string | null
          status:
            | 'pesquisando'
            | 'em_andamento'
            | 'editando'
            | 'formatando'
            | 'concluido'
          progresso: number
          data_criacao: string
          ultima_modificacao: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          titulo: string
          curso: string
          tipo_trabalho: string
          tema?: string | null
          nome_aluno?: string | null
          instituicao?: string | null
          orientador?: string | null
          coorientador?: string | null
          palavras_chave?: string | null
          resumo?: string | null
          status?:
            | 'pesquisando'
            | 'em_andamento'
            | 'editando'
            | 'formatando'
            | 'concluido'
          progresso?: number
          data_criacao?: string
          ultima_modificacao?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          titulo?: string
          curso?: string
          tipo_trabalho?: string
          tema?: string | null
          nome_aluno?: string | null
          instituicao?: string | null
          orientador?: string | null
          coorientador?: string | null
          palavras_chave?: string | null
          resumo?: string | null
          status?:
            | 'pesquisando'
            | 'em_andamento'
            | 'editando'
            | 'formatando'
            | 'concluido'
          progresso?: number
          data_criacao?: string
          ultima_modificacao?: string
          created_at?: string
          updated_at?: string
        }
      }
      tcc_notes: {
        Row: {
          id: string
          tcc_id: string
          user_id: string
          text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tcc_id: string
          user_id: string
          text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tcc_id?: string
          user_id?: string
          text?: string
          created_at?: string
          updated_at?: string
        }
      }
      tcc_content: {
        Row: {
          id: string
          tcc_id: string
          section_type: string
          content: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tcc_id: string
          section_type: string
          content: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tcc_id?: string
          section_type?: string
          content?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
