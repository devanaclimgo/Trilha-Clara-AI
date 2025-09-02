class OpenaiService
  def initialize
    @client = OpenAI::Client.new(access_token: Rails.application.credentials.openai[:api_key])
  end

  # Explicação simplificada do enunciado
  def simplificar_enunciado(enunciado, curso)
    prompt = <<~PROMPT
      Você é um assistente que transforma enunciados de TCC em português claro.
      Curso: #{curso}
      Enunciado: #{enunciado}
      Explique de forma simples e clara o que o aluno precisa fazer.
    PROMPT

    response = @client.chat(
      parameters: {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      }
    )

    response.dig("choices", 0, "message", "content")
  end

  # Gerar sumário automático
  def gerar_sumario(curso)
    prompt = <<~PROMPT
      Você é um assistente que sugere sumários de TCC.
      Curso: #{curso}
      Crie uma estrutura básica de capítulos.
    PROMPT

    response = @client.chat(
      parameters: {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 300
      }
    )

    response.dig("choices", 0, "message", "content")
  end
end