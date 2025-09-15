import { useState, useEffect } from 'react'
import { TccData, NotesData, NoteItem } from '@/types/tcc'

export const useTccData = () => {
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
    status: 'novo',
  })
  const [savedNotes, setSavedNotes] = useState<NotesData>({})
  const [hasCompletedInitialData, setHasCompletedInitialData] = useState(false)

  // Carregar dados do localStorage
  useEffect(() => {
    const savedTrabalhos = localStorage.getItem('tcc-trabalhos')
    const savedNotesData = localStorage.getItem('tcc-notes')

    if (savedTrabalhos) {
      const trabalhosData = JSON.parse(savedTrabalhos)
      setTrabalhos(trabalhosData)
      setHasCompletedInitialData(true)

      // Se há trabalhos, carrega o primeiro como padrão
      if (trabalhosData.length > 0) {
        setTrabalhoAtual(trabalhosData[0].id)
        setTccData(trabalhosData[0])
      }
    }

    if (savedNotesData) {
      const parsedNotes = JSON.parse(savedNotesData)

      // Migração: converter anotações antigas (string[]) para novo formato (NoteItem[])
      const migratedNotes: NotesData = {}
      Object.entries(parsedNotes).forEach(([workId, notes]) => {
        if (Array.isArray(notes)) {
          migratedNotes[workId] = notes.map((note) => {
            if (typeof note === 'string') {
              // Anotação antiga - converter para novo formato
              return {
                text: note,
                createdAt: new Date().toISOString(), // Data atual como fallback
              }
            }
            // Já está no novo formato
            return note
          })
        }
      })

      setSavedNotes(migratedNotes)
      // Salvar a versão migrada de volta no localStorage
      localStorage.setItem('tcc-notes', JSON.stringify(migratedNotes))
    }
  }, [])

  const salvarTrabalho = async (trabalho: TccData) => {
    const trabalhosAtualizados = trabalhos.filter((t) => t.id !== trabalho.id)
    trabalhosAtualizados.push(trabalho)
    setTrabalhos(trabalhosAtualizados)
    localStorage.setItem('tcc-trabalhos', JSON.stringify(trabalhosAtualizados))

    // Sincronizar com a API se o trabalho tiver ID da API
    if (trabalho.id && trabalho.id.startsWith('tcc_')) {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          await fetch(`http://localhost:4000/api/tcc/${trabalho.id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              titulo: trabalho.titulo,
              tema: trabalho.tema,
              tipo_trabalho: trabalho.tipoTrabalho,
              curso: trabalho.curso,
              nome: trabalho.nomeAluno,
              faculdade: trabalho.instituicao,
              orientador: trabalho.orientador,
            }),
          })
        }
      } catch (error) {
        console.error('Erro ao sincronizar com API:', error)
      }
    }
  }

  const criarNovoTrabalho = (titulo: string, curso: string, tema: string) => {
    const novoId = `tcc-${Date.now()}`
    const novoTrabalho: TccData = {
      id: novoId,
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
      status: 'novo',
    }

    const trabalhosAtualizados = [...trabalhos, novoTrabalho]
    setTrabalhos(trabalhosAtualizados)
    setTrabalhoAtual(novoId)
    setTccData(novoTrabalho)
    localStorage.setItem('tcc-trabalhos', JSON.stringify(trabalhosAtualizados))
  }

  const trocarTrabalho = (trabalhoId: string) => {
    const trabalho = trabalhos.find((t) => t.id === trabalhoId)
    if (trabalho) {
      setTrabalhoAtual(trabalhoId)
      setTccData(trabalho)
    }
  }

  const atualizarProgresso = (novoProgresso: number) => {
    if (trabalhoAtual) {
      const trabalhoAtualizado = {
        ...tccData,
        progresso: novoProgresso,
        ultimaModificacao: new Date().toISOString(),
      }
      setTccData(trabalhoAtualizado)
      salvarTrabalho(trabalhoAtualizado)
    }
  }

  const atualizarTrabalho = (trabalhoAtualizado: TccData) => {
    setTccData(trabalhoAtualizado)
    salvarTrabalho(trabalhoAtualizado)
  }

  const saveNote = (note: string) => {
    if (!trabalhoAtual) return

    const noteItem: NoteItem = {
      text: note,
      createdAt: new Date().toISOString(),
    }

    setSavedNotes((prev) => {
      const newNotes = {
        ...prev,
        [trabalhoAtual]: [...(prev[trabalhoAtual] || []), noteItem],
      }
      localStorage.setItem('tcc-notes', JSON.stringify(newNotes))
      return newNotes
    })
  }

  const removeNote = (index: number) => {
    if (!trabalhoAtual) return

    setSavedNotes((prev) => {
      const workNotes = prev[trabalhoAtual] || []
      const newNotes = {
        ...prev,
        [trabalhoAtual]: workNotes.filter((_, i) => i !== index),
      }
      localStorage.setItem('tcc-notes', JSON.stringify(newNotes))
      return newNotes
    })
  }

  const getCurrentWorkNotes = () => {
    if (!trabalhoAtual) return []
    const notes = savedNotes[trabalhoAtual] || []
    return notes.map((note) => note.text)
  }

  const getCurrentWorkNotesWithDates = () => {
    if (!trabalhoAtual) return []
    return savedNotes[trabalhoAtual] || []
  }

  const getAllNotesWithDates = () => {
    const allNotes: Array<{
      workId: string
      workTitle: string
      workCourse: string
      note: NoteItem
      noteIndex: number
    }> = []

    trabalhos.forEach((work) => {
      const workNotes = savedNotes[work.id] || []
      workNotes.forEach((note, index) => {
        allNotes.push({
          workId: work.id,
          workTitle: work.titulo,
          workCourse: work.curso,
          note,
          noteIndex: index,
        })
      })
    })

    return allNotes.sort(
      (a, b) =>
        new Date(b.note.createdAt).getTime() -
        new Date(a.note.createdAt).getTime(),
    )
  }

  const getAllNotes = () => {
    const allNotes: Array<{
      workId: string
      workTitle: string
      workCourse: string
      note: string
      noteIndex: number
    }> = []

    Object.entries(savedNotes).forEach(([workId, notes]) => {
      const work = trabalhos.find((t) => t.id === workId)
      if (work) {
        notes.forEach((note, noteIndex) => {
          allNotes.push({
            workId,
            workTitle: work.titulo || 'Trabalho sem título',
            workCourse: work.curso,
            note: note.text,
            noteIndex,
          })
        })
      }
    })

    return allNotes
  }

  const deletarTrabalho = (trabalhoId: string) => {
    const trabalhosAtualizados = trabalhos.filter((t) => t.id !== trabalhoId)
    setTrabalhos(trabalhosAtualizados)
    localStorage.setItem('tcc-trabalhos', JSON.stringify(trabalhosAtualizados))

    // Se era o trabalho atual, limpa a seleção ou seleciona outro
    if (trabalhoAtual === trabalhoId) {
      if (trabalhosAtualizados.length > 0) {
        setTccData(trabalhosAtualizados[0])
        setTrabalhoAtual(trabalhosAtualizados[0].id)
      } else {
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
          status: 'novo',
        })
        setTrabalhoAtual(null)
      }
    }
  }

  const carregarDadosDaAPI = async (trabalhoId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null

      const response = await fetch(
        `http://localhost:4000/api/tcc/${trabalhoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        return {
          id: data.id,
          titulo: data.titulo || data.tema,
          tema: data.tema,
          tipoTrabalho: data.tipo_trabalho,
          curso: data.curso,
          nomeAluno: data.nome,
          instituicao: data.faculdade,
          orientador: data.orientador || '',
          status: 'em_andamento' as const,
          progresso: 45,
          dataCriacao: data.created_at,
          explicacao: [],
          estrutura: [],
          cronograma: [],
          sugestoes: [],
          dica: '',
          ultimaModificacao: data.updated_at,
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados da API:', error)
    }
    return null
  }

  return {
    trabalhos,
    trabalhoAtual,
    tccData,
    savedNotes,
    hasCompletedInitialData,
    setTccData,
    setTrabalhoAtual,
    salvarTrabalho,
    criarNovoTrabalho,
    trocarTrabalho,
    atualizarProgresso,
    atualizarTrabalho,
    saveNote,
    removeNote,
    getCurrentWorkNotes,
    getCurrentWorkNotesWithDates,
    getAllNotes,
    getAllNotesWithDates,
    deletarTrabalho,
    carregarDadosDaAPI,
  }
}
