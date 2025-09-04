class OpenaiService
  DEFAULT_MODEL = "gpt-4o-mini".freeze

  def initialize(client: OpenAI::Client.new(api_key: ENV["OPENAI_API_KEY"]))
    @client = client
  end

  # método genérico pra conversar com o modelo
  def chat!(messages, model: DEFAULT_MODEL, temperature: 0.4, max_tokens: 1500)
    retries = 0
    max_retries = 5

    begin
      Rails.logger.info "OpenAI API Request - Messages: #{messages.size}, Tokens estimados: #{estimate_tokens(messages)}"
      resp = @client.chat(
          parameters: {
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: max_tokens
        }
      )
      resp.dig("choices", 0, "message", "content")
    rescue Faraday::TooManyRequestsError => e
      retries += 1
      if retries <= max_retries
        wait_time = 2 ** retries # backoff exponencial: 2, 4, 8, 16, 32 segundos
        Rails.logger.warn "Rate limit exceeded. Retrying in #{wait_time} seconds (attempt #{retries}/#{max_retries})"
        sleep(wait_time)
      retry
      else
        Rails.logger.error "Max retries reached. Giving up."
        raise e
      end
    rescue StandardError => e
      Rails.logger.error "OpenAI API Error: #{e.message}"
      raise e
    end
  end

  # explicação simplificada do enunciado
  def simplificar_enunciado!(enunciado:, curso:)
    cache_key = "simplify_#{Digest::MD5.hexdigest("#{enunciado}_#{curso}")}"
    cached = Rails.cache.read(cache_key)
    return cached if cached.present?

    messages = [
      { role: "system", content: "Você ajuda estudantes brasileiros a entender enunciados de TCC. Responda SEMPRE em português claro, direto, com bullets quando ajudar." },
      { role: "user", content: <<~TXT }
        Curso: #{curso}
        Enunciado: #{enunciado}

        Tarefa: explique, em linguagem simples e objetiva, o que o aluno precisa fazer.
        Dê passos práticos (ex.: escolher tema, definir problema, método etc.). Evite jargões.
      TXT
    ]
    result = chat!(messages)
  
    Rails.cache.write(cache_key, result, expires_in: 24.hours)
  
    result
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

  private

  def estimate_tokens(messages)
    messages.sum { |msg| msg[:content].split.size / 0.75 }
  end
end