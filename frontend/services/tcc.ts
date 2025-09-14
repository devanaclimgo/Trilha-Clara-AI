export async function criarTCC(
  tema: string,
  curso: string,
  tipoTrabalho: string = 'tcc',
  semanas: number = 8,
) {
  const response = await fetch('http://localhost:4000/api/tcc/criar.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: tema,
      faculdade: 'Universidade',
      curso: curso,
      materia: curso,
      tema: tema,
      tipo_trabalho: tipoTrabalho,
    }),
  })

  if (!response.ok) {
    throw new Error('Erro ao gerar TCC')
  }

  return response.json()
}