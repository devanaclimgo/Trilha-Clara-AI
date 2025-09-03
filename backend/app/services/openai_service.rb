class OpenaiService
  DEFAULT_MODEL = "gpt-3.5-turbo".freeze

  def initialize(client: OpenAI::Client.new)
    @client = client
  end

  # método genérico pra conversar com o modelo
  def chat!(messages, model: DEFAULT_MODEL, temperature: 0.4, max_tokens: 700)
    resp = @client.chat(
      parameters: {
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: max_tokens
      }
    )
    resp.dig("choices", 0, "message", "content")
  end

  # explicação simplificada do enunciado
  def simplificar_enunciado!(enunciado:, curso:)
    messages = [
      { role: "system", content: "Você ajuda estudantes brasileiros a entender enunciados de TCC. Responda SEMPRE em português claro, direto, com bullets quando ajudar." },
      { role: "user", content: <<~TXT }
        Curso: #{curso}
        Enunciado: #{enunciado}

        Tarefa: explique, em linguagem simples e objetiva, o que o aluno precisa fazer.
        Dê passos práticos (ex.: escolher tema, definir problema, método etc.). Evite jargões.
      TXT
    ]
    chat!(messages)
  end

  # gerar sumário automático
  def gerar_sumario!(curso:)
    messages = [
      { role: "system", content: "Gere apenas uma lista numerada de capítulos para TCC, formato curto." },
      { role: "user", content: "Crie um sumário básico de TCC para o curso de #{curso}." }
    ]
    chat!(messages, temperature: 0.3, max_tokens: 300)
  end

  # gerar cronograma semanal simples
  def gerar_cronograma!(curso:, semanas: 8)
    messages = [
      { role: "system", content: "Monte um cronograma semanal, com tarefas objetivas, para TCC." },
      { role: "user", content: "Curso: #{curso}. Crie um cronograma de #{semanas} semanas, 1-2 tarefas por semana, claro e acionável." }
    ]
    chat!(messages, temperature: 0.3, max_tokens: 500)
  end
end