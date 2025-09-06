export async function criarTCC(enunciado: string, curso: string, semanas: number = 8) {
  const response = await fetch("http://localhost:3000/tcc/criar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ enunciado, curso, semanas }),
  });

  if (!response.ok) {
    throw new Error("Erro ao gerar TCC");
  }

  return response.json();
}