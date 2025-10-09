import { supabase, TablesInsert, TablesUpdate } from '@/lib/supabase'
import { TccData, NoteItem } from '@/types/tcc'

export class SupabaseService {
  // =====================================================
  // USER MANAGEMENT
  // =====================================================

  static async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  static async updateUserProfile(
    userId: string,
    updates: Partial<TablesUpdate<'users'>>,
  ) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // =====================================================
  // TCC/WORK MANAGEMENT
  // =====================================================

  static async getUserTccs(userId: string): Promise<TccData[]> {
    const { data, error } = await supabase
      .from('tccs')
      .select(
        `
        *,
        tcc_content(*),
        tcc_notes(*)
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform Supabase data to TccData format
    return data.map(this.transformTccFromSupabase)
  }

  static async getTccById(
    tccId: string,
    userId: string,
  ): Promise<TccData | null> {
    const { data, error } = await supabase
      .from('tccs')
      .select(
        `
        *,
        tcc_content(*),
        tcc_notes(*)
      `,
      )
      .eq('id', tccId)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return this.transformTccFromSupabase(data)
  }

  static async createTcc(
    userId: string,
    tccData: Partial<TccData>,
  ): Promise<TccData> {
    const supabaseTcc: TablesInsert<'tccs'> = {
      user_id: userId,
      titulo: tccData.titulo || '',
      curso: tccData.curso || '',
      tipo_trabalho: tccData.tipoTrabalho || '',
      tema: tccData.tema || null,
      nome_aluno: tccData.nomeAluno || null,
      instituicao: tccData.instituicao || null,
      orientador: tccData.orientador || null,
      coorientador: tccData.coorientador || null,
      palavras_chave: tccData.palavrasChave || null,
      resumo: tccData.resumo || null,
      status: tccData.status || 'pesquisando',
      progresso: tccData.progresso || 0,
      data_criacao: tccData.dataCriacao || new Date().toISOString(),
      ultima_modificacao: tccData.ultimaModificacao || new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('tccs')
      .insert(supabaseTcc)
      .select(
        `
        *,
        tcc_content(*),
        tcc_notes(*)
      `,
      )
      .single()

    if (error) throw error
    return this.transformTccFromSupabase(data)
  }

  static async updateTcc(
    tccId: string,
    userId: string,
    updates: Partial<TccData>,
  ): Promise<TccData> {
    const supabaseUpdates: TablesUpdate<'tccs'> = {
      titulo: updates.titulo,
      curso: updates.curso,
      tipo_trabalho: updates.tipoTrabalho,
      tema: updates.tema,
      nome_aluno: updates.nomeAluno,
      instituicao: updates.instituicao,
      orientador: updates.orientador,
      coorientador: updates.coorientador,
      palavras_chave: updates.palavrasChave,
      resumo: updates.resumo,
      status: updates.status,
      progresso: updates.progresso,
      ultima_modificacao: new Date().toISOString(),
    }

    // Remove undefined values
    Object.keys(supabaseUpdates).forEach((key) => {
      if (supabaseUpdates[key as keyof typeof supabaseUpdates] === undefined) {
        delete supabaseUpdates[key as keyof typeof supabaseUpdates]
      }
    })

    const { data, error } = await supabase
      .from('tccs')
      .update(supabaseUpdates)
      .eq('id', tccId)
      .eq('user_id', userId)
      .select(
        `
        *,
        tcc_content(*),
        tcc_notes(*)
      `,
      )
      .single()

    if (error) throw error
    return this.transformTccFromSupabase(data)
  }

  static async deleteTcc(tccId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('tccs')
      .delete()
      .eq('id', tccId)
      .eq('user_id', userId)

    if (error) throw error
  }

  // =====================================================
  // NOTES MANAGEMENT
  // =====================================================

  static async getTccNotes(tccId: string, userId: string): Promise<NoteItem[]> {
    const { data, error } = await supabase
      .from('tcc_notes')
      .select('*')
      .eq('tcc_id', tccId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((note) => ({
      text: note.text,
      createdAt: note.created_at,
    }))
  }

  static async createNote(
    tccId: string,
    userId: string,
    text: string,
  ): Promise<NoteItem> {
    const { data, error } = await supabase
      .from('tcc_notes')
      .insert({
        tcc_id: tccId,
        user_id: userId,
        text: text,
      })
      .select()
      .single()

    if (error) throw error

    return {
      text: data.text,
      createdAt: data.created_at,
    }
  }

  static async updateNote(
    noteId: string,
    userId: string,
    text: string,
  ): Promise<NoteItem> {
    const { data, error } = await supabase
      .from('tcc_notes')
      .update({ text })
      .eq('id', noteId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return {
      text: data.text,
      createdAt: data.created_at,
    }
  }

  static async deleteNote(noteId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('tcc_notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', userId)

    if (error) throw error
  }

  // =====================================================
  // CONTENT MANAGEMENT
  // =====================================================

  static async saveTccContent(
    tccId: string,
    sectionType: string,
    content: unknown,
  ): Promise<void> {
    const { error } = await supabase.from('tcc_content').upsert({
      tcc_id: tccId,
      section_type: sectionType,
      content: content,
    })

    if (error) throw error
  }

  static async getTccContent(
    tccId: string,
    sectionType?: string,
  ): Promise<unknown> {
    let query = supabase.from('tcc_content').select('*').eq('tcc_id', tccId)

    if (sectionType) {
      query = query.eq('section_type', sectionType)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  // =====================================================
  // DATA TRANSFORMATION
  // =====================================================

  private static transformTccFromSupabase(data: {
    id: string
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
    status: string
    progresso: number
    data_criacao: string
    ultima_modificacao: string
    tcc_content?: Array<{
      section_type: string
      content: unknown
    }>
    tcc_notes?: Array<{
      text: string
      created_at: string
    }>
  }): TccData {
    // Transform content data
    const contentMap: { [key: string]: unknown } = {}
    if (data.tcc_content) {
      data.tcc_content.forEach((content) => {
        contentMap[content.section_type] = content.content
      })
    }

    // Transform notes data
    const notes: NoteItem[] = data.tcc_notes
      ? data.tcc_notes.map((note) => ({
          text: note.text,
          createdAt: note.created_at,
        }))
      : []

    return {
      id: data.id,
      titulo: data.titulo,
      curso: data.curso,
      tipoTrabalho: data.tipo_trabalho,
      tema: data.tema || undefined,
      nomeAluno: data.nome_aluno || undefined,
      instituicao: data.instituicao || undefined,
      orientador: data.orientador || undefined,
      coorientador: data.coorientador || undefined,
      palavrasChave: data.palavras_chave || undefined,
      resumo: data.resumo || undefined,
      status: data.status as TccData['status'],
      progresso: data.progresso,
      dataCriacao: data.data_criacao,
      ultimaModificacao: data.ultima_modificacao,
      // Transform content from Supabase format
      explicacao: (contentMap.explicacao as string[]) || [],
      sugestoes: (contentMap.sugestoes as string[]) || [],
      dica: (contentMap.dica as string) || '',
      estrutura: (contentMap.estrutura as string[]) || [],
      cronograma: (contentMap.cronograma as unknown[]) || [],
      // Notes are handled separately
      notas: notes.map((note) => note.text),
      notasWithDates: notes.map((note) => ({
        note: note.text,
        date: note.createdAt,
      })),
    }
  }

  // =====================================================
  // MIGRATION HELPERS
  // =====================================================

  static async migrateFromLocalStorage(userId: string): Promise<void> {
    try {
      // Get localStorage data
      const savedTrabalhos = localStorage.getItem('tcc-trabalhos')
      const savedNotes = localStorage.getItem('tcc-notes')

      if (savedTrabalhos) {
        const trabalhosData: TccData[] = JSON.parse(savedTrabalhos)

        for (const trabalho of trabalhosData) {
          // Create TCC in Supabase
          const supabaseTcc = await this.createTcc(userId, trabalho)

          // Migrate notes if they exist
          if (savedNotes) {
            const notesData: { [key: string]: NoteItem[] } =
              JSON.parse(savedNotes)
            const workNotes = notesData[trabalho.id] || []

            for (const note of workNotes) {
              await this.createNote(supabaseTcc.id, userId, note.text)
            }
          }
        }
      }

      // Clear localStorage after successful migration
      localStorage.removeItem('tcc-trabalhos')
      localStorage.removeItem('tcc-notes')
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    }
  }
}
