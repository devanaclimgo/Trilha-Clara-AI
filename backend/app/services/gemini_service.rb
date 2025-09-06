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
      { role: "user", content: <<~PROMPT }
        Gere um sumário básico e curto para um TCC do curso de #{curso}.
        Responda em formato de lista numerada, apenas os capítulos principais.
      PROMPT
    ]

    chat!(messages)
  end

  # Gerar cronograma
  def gerar_cronograma!(curso:, semanas: 8)
    messages = [
      { role: "user", content: <<~PROMPT }
        Monte um cronograma semanal para um TCC do curso de #{curso}, com #{semanas} semanas.
        - Liste de 1 a 2 tarefas por semana
        - Seja claro, direto e acionável
        - Responda em português
      PROMPT
    ]

    chat!(messages)
  end
end
