import api from '../src/app/api/api'

export async function criarTCC(
  tema: string,
  curso: string,
  tipoTrabalho: string = 'tcc',
  semanas: number = 8,
) {
  try {
    const response = await api.post('/api/tcc/criar', {
      nome: tema,
      faculdade: 'Universidade',
      curso: curso,
      materia: curso,
      tema: tema,
      tipo_trabalho: tipoTrabalho,
    })

    return response.data
  } catch (error) {
    console.error('Erro ao criar TCC:', error)
    throw new Error('Erro ao gerar TCC')
  }
}
