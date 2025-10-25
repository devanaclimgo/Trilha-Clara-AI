export interface CronogramaItem {
  id: number
  semana: number
  atividade: string
  categoria: string
  concluida: boolean
}

export const generateCronograma = (semanas: number): CronogramaItem[] => {
  // Define the base activities that should be covered in any TCC
  const baseActivities = [
    {
      atividade: 'Escolher tema e delimitar problema',
      categoria: 'Planejamento',
      weekPercentage: 0.1, // 10% of total weeks
    },
    {
      atividade: 'Levantar referências bibliográficas',
      categoria: 'Pesquisa',
      weekPercentage: 0.15, // 15% of total weeks
    },
    {
      atividade: 'Escrever introdução e justificativa',
      categoria: 'Redação',
      weekPercentage: 0.2, // 20% of total weeks
    },
    {
      atividade: 'Redigir metodologia da pesquisa',
      categoria: 'Metodologia',
      weekPercentage: 0.25, // 25% of total weeks
    },
    {
      atividade: 'Desenvolver revisão bibliográfica',
      categoria: 'Pesquisa',
      weekPercentage: 0.3, // 30% of total weeks
    },
    {
      atividade: 'Aplicar instrumentos de coleta',
      categoria: 'Coleta de Dados',
      weekPercentage: 0.4, // 40% of total weeks
    },
    {
      atividade: 'Analisar dados coletados',
      categoria: 'Análise',
      weekPercentage: 0.5, // 50% of total weeks
    },
    {
      atividade: 'Escrever resultados e discussão',
      categoria: 'Redação',
      weekPercentage: 0.7, // 70% of total weeks
    },
    {
      atividade: 'Elaborar conclusões',
      categoria: 'Redação',
      weekPercentage: 0.85, // 85% of total weeks
    },
    {
      atividade: 'Revisão final e formatação ABNT',
      categoria: 'Finalização',
      weekPercentage: 1.0, // 100% of total weeks
    },
  ]

  // Calculate which week each activity should be in
  const activities = baseActivities.map((activity, index) => {
    const targetWeek = Math.max(
      1,
      Math.round(activity.weekPercentage * semanas),
    )
    return {
      id: index + 1,
      semana: targetWeek,
      atividade: activity.atividade,
      categoria: activity.categoria,
      concluida: index < 2, // First 2 activities are completed by default
    }
  })

  // If we have fewer weeks than activities, we need to adjust
  if (semanas < activities.length) {
    // For shorter timelines, combine some activities
    const adjustedActivities: CronogramaItem[] = []

    for (let i = 0; i < semanas; i++) {
      const weekNumber = i + 1
      let atividade = ''
      let categoria = ''

      if (weekNumber === 1) {
        atividade = 'Escolher tema e delimitar problema'
        categoria = 'Planejamento'
      } else if (weekNumber === 2) {
        atividade = 'Levantar referências bibliográficas'
        categoria = 'Pesquisa'
      } else if (weekNumber === semanas) {
        atividade = 'Revisão final e formatação ABNT'
        categoria = 'Finalização'
      } else if (weekNumber === semanas - 1) {
        atividade = 'Elaborar conclusões'
        categoria = 'Redação'
      } else if (weekNumber === semanas - 2) {
        atividade = 'Escrever resultados e discussão'
        categoria = 'Redação'
      } else if (weekNumber <= Math.ceil(semanas * 0.3)) {
        atividade = 'Escrever introdução e justificativa'
        categoria = 'Redação'
      } else if (weekNumber <= Math.ceil(semanas * 0.5)) {
        atividade = 'Redigir metodologia da pesquisa'
        categoria = 'Metodologia'
      } else if (weekNumber <= Math.ceil(semanas * 0.7)) {
        atividade = 'Desenvolver revisão bibliográfica'
        categoria = 'Pesquisa'
      } else {
        atividade = 'Aplicar instrumentos de coleta e análise'
        categoria = 'Coleta de Dados'
      }

      adjustedActivities.push({
        id: weekNumber,
        semana: weekNumber,
        atividade,
        categoria,
        concluida: weekNumber <= 2, // First 2 weeks completed by default
      })
    }

    return adjustedActivities
  }

  // For longer timelines, we can add more detailed activities
  if (semanas > activities.length) {
    const extendedActivities = [...activities]

    // Add intermediate activities for longer timelines
    const additionalWeeks = semanas - activities.length
    const startWeek = activities.length + 1

    for (let i = 0; i < additionalWeeks; i++) {
      const weekNumber = startWeek + i
      let atividade = ''
      let categoria = ''

      if (i < Math.floor(additionalWeeks / 3)) {
        atividade = 'Aprofundar revisão bibliográfica'
        categoria = 'Pesquisa'
      } else if (i < Math.floor((additionalWeeks * 2) / 3)) {
        atividade = 'Refinar metodologia e instrumentos'
        categoria = 'Metodologia'
      } else {
        atividade = 'Revisar e aprimorar conteúdo'
        categoria = 'Redação'
      }

      extendedActivities.push({
        id: weekNumber,
        semana: weekNumber,
        atividade,
        categoria,
        concluida: false,
      })
    }

    return extendedActivities
  }

  return activities
}

export const getCronogramaProgress = (cronograma: CronogramaItem[]): number => {
  const completedCount = cronograma.filter((item) => item.concluida).length
  return Math.round((completedCount / cronograma.length) * 100)
}

export const calculateWorkProgress = (workData: any): number => {
  // If workData has cronograma with completion tracking, use that
  if (
    workData.cronograma &&
    Array.isArray(workData.cronograma) &&
    workData.cronograma.length > 0
  ) {
    // Check if cronograma items have completion status
    const hasCompletionStatus = workData.cronograma.some(
      (item: any) => typeof item === 'object' && 'concluida' in item,
    )

    if (hasCompletionStatus) {
      return getCronogramaProgress(workData.cronograma)
    }
  }

  // Fallback to the existing progress field
  return workData.progresso || 0
}

export const toggleCronogramaTask = (
  cronograma: any[],
  taskId: number,
): any[] => {
  return cronograma.map((item, index) => {
    if (typeof item === 'object' && item.id === taskId) {
      return { ...item, concluida: !item.concluida }
    }
    // For string items, use index as ID
    if (typeof item === 'string' && index === taskId - 1) {
      return { id: taskId, semana: index + 1, atividade: item, concluida: true }
    }
    return item
  })
}
