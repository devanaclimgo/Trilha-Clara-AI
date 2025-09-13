import { useState, useEffect } from 'react'
import { TccData, NotesData } from '@/types/tcc'

export const useTccData = () => {
  const [trabalhos, setTrabalhos] = useState<TccData[]>([])
  const [trabalhoAtual, setTrabalhoAtual] = useState<string | null>(null)
  const [tccData, setTccData] = useState<TccData>({
    id: '',
    titulo: '',
    curso: '',
    enunciado: '',
    explicacao: [],
    sugestoes: [],
    dica: '',
    estrutura: [],
    cronograma: [],
    dataCriacao: '',
    ultimaModificacao: '',
    progresso: 0,
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
      setSavedNotes(JSON.parse(savedNotesData))
    }
  }, [])

  const salvarTrabalho = (trabalho: TccData) => {
    const trabalhosAtualizados = trabalhos.filter((t) => t.id !== trabalho.id)
    trabalhosAtualizados.push(trabalho)
    setTrabalhos(trabalhosAtualizados)
    localStorage.setItem('tcc-trabalhos', JSON.stringify(trabalhosAtualizados))
  }

  const criarNovoTrabalho = (
    titulo: string,
    curso: string,
    enunciado: string,
  ) => {
    const novoId = `tcc-${Date.now()}`
    const novoTrabalho: TccData = {
      id: novoId,
      titulo,
      curso,
      enunciado,
      explicacao: [],
      sugestoes: [],
      dica: '',
      estrutura: [],
      cronograma: [],
      dataCriacao: new Date().toISOString(),
      ultimaModificacao: new Date().toISOString(),
      progresso: 0,
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

  const saveNote = (note: string) => {
    if (!trabalhoAtual) return

    setSavedNotes((prev) => {
      const newNotes = {
        ...prev,
        [trabalhoAtual]: [...(prev[trabalhoAtual] || []), note],
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
    return trabalhoAtual ? savedNotes[trabalhoAtual] || [] : []
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
          enunciado: '',
          explicacao: [],
          sugestoes: [],
          dica: '',
          estrutura: [],
          cronograma: [],
          dataCriacao: '',
          ultimaModificacao: '',
          progresso: 0,
        })
        setTrabalhoAtual(null)
      }
    }
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
    saveNote,
    removeNote,
    getCurrentWorkNotes,
    deletarTrabalho,
  }
}
