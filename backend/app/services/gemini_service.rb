require 'faraday'
require 'json'
require 'digest'

class GeminiService
  BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
  DEFAULT_MODEL = "gemini-1.5-flash"

  def initialize(api_key: ENV["GEMINI_API_KEY"])
    @api_key = Rails.application.config.gemini_api_key || api_key
    raise "GEMINI_API_KEY não está configurada" unless @api_key
    @client = Faraday.new(
      url: BASE_URL,
      params: { key: @api_key },
      headers: { "Content-Type" => "application/json" }
    )
  end

  # Método genérico para conversar com Gemini
  def chat!(messages, model: DEFAULT_MODEL, max_output_tokens: 1000)
    prompt = messages.map { |m| m[:content] }.join("\n")

    response = @client.post("#{model}:generateContent") do |req|
      req.body = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: max_output_tokens }
      }.to_json
    end

    body = JSON.parse(response.body) rescue {}
    body.dig("candidates", 0, "content", "parts", 0, "text") || "Erro: resposta inválida"
  end

  # Simplificar enunciado
  def simplificar_enunciado!(enunciado:, curso:)
    cache_key = "gemini_simplify_#{Digest::MD5.hexdigest("#{enunciado}_#{curso}")}"
    cached = Rails.cache.read(cache_key)
    return cached if cached

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
    Rails.cache.write(cache_key, result, expires_in: 1.week)
    result
  end

  # Gerar sumário
  def gerar_sumario!(curso:)
    messages = [
      { role: "system", content: "Gere apenas uma lista numerada de capítulos para TCC, formato curto." },
      { role: "user", content: "Crie um sumário básico de TCC para o curso de #{curso}." }
    ]
    chat!(messages, max_output_tokens: 400)
  end

  # Gerar cronograma
  def gerar_cronograma!(curso:, semanas: 8)
    messages = [
      { role: "system", content: "Monte um cronograma semanal, com tarefas objetivas, para TCC." },
      { role: "user", content: "Curso: #{curso}. Crie um cronograma de #{semanas} semanas, 1-2 tarefas por semana, claro e acionável." }
    ]
    chat!(messages, max_output_tokens: 600)
  end
end
