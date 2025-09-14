/**
 * Utilitários para formatação de datas
 */

export const formatNoteDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatNoteDateShort = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatNoteDateRelative = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) {
    return 'Agora mesmo'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}min atrás`
  } else if (diffInHours < 24) {
    return `${diffInHours}h atrás`
  } else if (diffInDays < 7) {
    return `${diffInDays}d atrás`
  } else {
    return formatNoteDateShort(dateString)
  }
}
