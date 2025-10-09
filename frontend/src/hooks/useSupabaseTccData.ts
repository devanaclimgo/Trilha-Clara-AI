'use client'

import { useState, useEffect, useCallback } from 'react'
import { TccData, NoteItem } from '@/types/tcc'
import { SupabaseService } from '@/services/supabaseService'
import { supabase } from '@/lib/supabase'

export const useSupabaseTccData = () => {
  const [trabalhos, setTrabalhos] = useState<TccData[]>([])
  const [trabalhoAtual, setTrabalhoAtual] = useState<string | null>(null)
  const [tccData, setTccData] = useState<TccData>({
    id: '',
    titulo: '',
    curso: '',
    tipoTrabalho: '',
    explicacao: [],
    sugestoes: [],
    dica: '',
    estrutura: [],
    cronograma: [],
    dataCriacao: '',
    ultimaModificacao: '',
    progresso: 0,
    status: 'pesquisando',
  })
  const [savedNotes, setSavedNotes] = useState<{
    [workId: string]: NoteItem[]
  }>({})
  const [hasCompletedInitialData, setHasCompletedInitialData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Initialize user and load data
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        if (error) throw error

        if (user) {
          setCurrentUser(user)
          await loadUserData(user.id)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error initializing user:', error)
        setIsLoading(false)
      }
    }

    initializeUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setCurrentUser(session.user)
        await loadUserData(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null)
        setTrabalhos([])
        setTrabalhoAtual(null)
        setTccData({
          id: '',
          titulo: '',
          curso: '',
          tipoTrabalho: '',
          explicacao: [],
          sugestoes: [],
          dica: '',
          estrutura: [],
          cronograma: [],
          dataCriacao: '',
          ultimaModificacao: '',
          progresso: 0,
          status: 'pesquisando',
        })
        setSavedNotes({})
        setHasCompletedInitialData(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (userId: string) => {
    try {
      setIsLoading(true)

      // Check if user has data in Supabase
      const userTccs = await SupabaseService.getUserTccs(userId)

      if (userTccs.length > 0) {
        setTrabalhos(userTccs)
        setTrabalhoAtual(userTccs[0].id)
        setTccData(userTccs[0])
        setHasCompletedInitialData(true)

        // Load notes for all works
        const notesData: { [workId: string]: NoteItem[] } = {}
        for (const trabalho of userTccs) {
          const notes = await SupabaseService.getTccNotes(trabalho.id, userId)
          notesData[trabalho.id] = notes
        }
        setSavedNotes(notesData)
      } else {
        // Check for localStorage data and migrate
        const hasLocalData =
          localStorage.getItem('tcc-trabalhos') ||
          localStorage.getItem('tcc-notes')
        if (hasLocalData) {
          await SupabaseService.migrateFromLocalStorage(userId)
          // Reload data after migration
          await loadUserData(userId)
          return
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const salvarTrabalho = useCallback(
    async (trabalho: TccData) => {
      if (!currentUser) return

      try {
        if (trabalho.id && trabalho.id.startsWith('tcc-')) {
          // Update existing work
          const updatedTrabalho = await SupabaseService.updateTcc(
            trabalho.id,
            currentUser.id,
            trabalho,
          )

          setTrabalhos((prev) =>
            prev.map((t) => (t.id === trabalho.id ? updatedTrabalho : t)),
          )
          if (trabalhoAtual === trabalho.id) {
            setTccData(updatedTrabalho)
          }
        } else {
          // Create new work
          const newTrabalho = await SupabaseService.createTcc(
            currentUser.id,
            trabalho,
          )

          setTrabalhos((prev) => [...prev, newTrabalho])
          setTrabalhoAtual(newTrabalho.id)
          setTccData(newTrabalho)
        }
      } catch (error) {
        console.error('Error saving work:', error)
        throw error
      }
    },
    [currentUser, trabalhoAtual],
  )

  const criarNovoTrabalho = useCallback(
    async (titulo: string, curso: string, tema: string) => {
      if (!currentUser) return

      const novoTrabalho: Partial<TccData> = {
        titulo,
        curso,
        tema,
        explicacao: [],
        sugestoes: [],
        dica: '',
        estrutura: [],
        cronograma: [],
        dataCriacao: new Date().toISOString(),
        ultimaModificacao: new Date().toISOString(),
        progresso: 0,
        tipoTrabalho: '',
        status: 'pesquisando',
      }

      try {
        const createdTrabalho = await SupabaseService.createTcc(
          currentUser.id,
          novoTrabalho,
        )

        setTrabalhos((prev) => [...prev, createdTrabalho])
        setTrabalhoAtual(createdTrabalho.id)
        setTccData(createdTrabalho)
      } catch (error) {
        console.error('Error creating new work:', error)
        throw error
      }
    },
    [currentUser],
  )

  const trocarTrabalho = useCallback(
    async (trabalhoId: string) => {
      if (!currentUser) return

      try {
        const trabalho = await SupabaseService.getTccById(
          trabalhoId,
          currentUser.id,
        )
        if (trabalho) {
          setTrabalhoAtual(trabalhoId)
          setTccData(trabalho)

          // Load notes for this work
          const notes = await SupabaseService.getTccNotes(
            trabalhoId,
            currentUser.id,
          )
          setSavedNotes((prev) => ({
            ...prev,
            [trabalhoId]: notes,
          }))
        }
      } catch (error) {
        console.error('Error switching work:', error)
      }
    },
    [currentUser],
  )

  const atualizarProgresso = useCallback(
    async (novoProgresso: number) => {
      if (!trabalhoAtual || !currentUser) return

      try {
        const trabalhoAtualizado = {
          ...tccData,
          progresso: novoProgresso,
          ultimaModificacao: new Date().toISOString(),
        }

        const updatedTrabalho = await SupabaseService.updateTcc(
          trabalhoAtual,
          currentUser.id,
          trabalhoAtualizado,
        )

        setTccData(updatedTrabalho)
        setTrabalhos((prev) =>
          prev.map((t) => (t.id === trabalhoAtual ? updatedTrabalho : t)),
        )
      } catch (error) {
        console.error('Error updating progress:', error)
      }
    },
    [trabalhoAtual, currentUser, tccData],
  )

  const atualizarTrabalho = useCallback(
    async (trabalhoAtualizado: TccData) => {
      if (!currentUser) return

      try {
        const updatedTrabalho = await SupabaseService.updateTcc(
          trabalhoAtualizado.id,
          currentUser.id,
          trabalhoAtualizado,
        )

        setTccData(updatedTrabalho)
        setTrabalhos((prev) =>
          prev.map((t) =>
            t.id === trabalhoAtualizado.id ? updatedTrabalho : t,
          ),
        )
      } catch (error) {
        console.error('Error updating work:', error)
      }
    },
    [currentUser],
  )

  const saveNote = useCallback(
    async (note: string) => {
      if (!trabalhoAtual || !currentUser) return

      try {
        const noteItem = await SupabaseService.createNote(
          trabalhoAtual,
          currentUser.id,
          note,
        )

        setSavedNotes((prev) => ({
          ...prev,
          [trabalhoAtual]: [...(prev[trabalhoAtual] || []), noteItem],
        }))
      } catch (error) {
        console.error('Error saving note:', error)
      }
    },
    [trabalhoAtual, currentUser],
  )

  const removeNote = useCallback(
    async (index: number) => {
      if (!trabalhoAtual || !currentUser) return

      try {
        const workNotes = savedNotes[trabalhoAtual] || []
        const noteToRemove = workNotes[index]

        if (noteToRemove) {
          // Find the note ID from the database
          const notes = await SupabaseService.getTccNotes(
            trabalhoAtual,
            currentUser.id,
          )
          const noteToDelete = notes.find(
            (n) =>
              n.text === noteToRemove.text &&
              n.createdAt === noteToRemove.createdAt,
          )

          if (noteToDelete) {
            await SupabaseService.deleteNote(noteToDelete.id, currentUser.id)
          }
        }

        setSavedNotes((prev) => {
          const newNotes = {
            ...prev,
            [trabalhoAtual]: (prev[trabalhoAtual] || []).filter(
              (_, i) => i !== index,
            ),
          }
          return newNotes
        })
      } catch (error) {
        console.error('Error removing note:', error)
      }
    },
    [trabalhoAtual, currentUser, savedNotes],
  )

  const getCurrentWorkNotes = useCallback(() => {
    if (!trabalhoAtual) return []
    const notes = savedNotes[trabalhoAtual] || []
    return notes.map((note) => note.text)
  }, [trabalhoAtual, savedNotes])

  const getCurrentWorkNotesWithDates = useCallback(() => {
    if (!trabalhoAtual) return []
    return savedNotes[trabalhoAtual] || []
  }, [trabalhoAtual, savedNotes])

  const getAllNotesWithDates = useCallback(() => {
    const allNotes: Array<{
      workId: string
      workTitle: string
      notes: NoteItem[]
    }> = []

    trabalhos.forEach((trabalho) => {
      const notes = savedNotes[trabalho.id] || []
      if (notes.length > 0) {
        allNotes.push({
          workId: trabalho.id,
          workTitle: trabalho.titulo,
          notes,
        })
      }
    })

    return allNotes
  }, [trabalhos, savedNotes])

  const deleteTrabalho = useCallback(
    async (trabalhoId: string) => {
      if (!currentUser) return

      try {
        await SupabaseService.deleteTcc(trabalhoId, currentUser.id)

        setTrabalhos((prev) => prev.filter((t) => t.id !== trabalhoId))

        if (trabalhoAtual === trabalhoId) {
          const remainingTrabalhos = trabalhos.filter(
            (t) => t.id !== trabalhoId,
          )
          if (remainingTrabalhos.length > 0) {
            setTrabalhoAtual(remainingTrabalhos[0].id)
            setTccData(remainingTrabalhos[0])
          } else {
            setTrabalhoAtual(null)
            setTccData({
              id: '',
              titulo: '',
              curso: '',
              tipoTrabalho: '',
              explicacao: [],
              sugestoes: [],
              dica: '',
              estrutura: [],
              cronograma: [],
              dataCriacao: '',
              ultimaModificacao: '',
              progresso: 0,
              status: 'pesquisando',
            })
          }
        }

        // Remove notes for deleted work
        setSavedNotes((prev) => {
          const newNotes = { ...prev }
          delete newNotes[trabalhoId]
          return newNotes
        })
      } catch (error) {
        console.error('Error deleting work:', error)
      }
    },
    [currentUser, trabalhoAtual, trabalhos],
  )

  return {
    // State
    trabalhos,
    trabalhoAtual,
    tccData,
    savedNotes,
    hasCompletedInitialData,
    isLoading,
    currentUser,

    // Actions
    salvarTrabalho,
    criarNovoTrabalho,
    trocarTrabalho,
    atualizarProgresso,
    atualizarTrabalho,
    saveNote,
    removeNote,
    getCurrentWorkNotes,
    getCurrentWorkNotesWithDates,
    getAllNotesWithDates,
    deleteTrabalho,
  }
}
