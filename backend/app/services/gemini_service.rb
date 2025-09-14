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
  def simplificar_enunciado!(enunciado:, curso:, tipo_trabalho: nil)
  cache_key = "gemini_simplify_#{Digest::MD5.hexdigest("#{enunciado}_#{curso}_#{tipo_trabalho}")}"
  cached = Rails.cache.read(cache_key)
  return cached if cached

  messages = [
    { role: "system", content: "Você ajuda estudantes brasileiros a organizar TCC. Sempre responda em português e em JSON válido com as chaves: explicacao, sugestoes, dica, estrutura, cronograma." },
    { role: "user", content: <<~TXT }
      Curso: #{curso}
      Tipo de trabalho: #{tipo_trabalho || 'Não especificado'}
      Enunciado: #{enunciado}

      Tarefa: devolva no seguinte formato JSON:

      {
        "explicacao": [
          "frase curta 1",
          "frase curta 2"
        ],
        "sugestoes": [
          "sugestão 1",
          "sugestão 2"
        ],
        "dica": "uma dica curta e objetiva",
        "estrutura": [
          "capítulo 1",
          "capítulo 2",
          "capítulo 3"
        ],
        "cronograma": [
          { "semana": 1, "atividade": "escolher tema" },
          { "semana": 2, "atividade": "levantar bibliografia" }
        ]
      }

      - "explicacao": no máximo 4 bullets curtos e simples
      - "sugestoes": lista de tópicos de pesquisa específicos para o tipo de trabalho
      - "dica": 1 frase de orientação importante considerando o tipo de trabalho
      - "estrutura": só os capítulos principais adaptados ao tipo de trabalho
      - "cronograma": lista curta de semanas com atividades práticas específicas para o tipo de trabalho
    TXT
  ]

  result = chat!(messages)

  begin
    # Tenta extrair JSON do resultado se estiver dentro de markdown
    json_match = result.match(/```json\s*(\{.*?\})\s*```/m)
    json_string = json_match ? json_match[1] : result
    
    parsed = JSON.parse(json_string)
    Rails.cache.write(cache_key, parsed, expires_in: 1.week)
    parsed
  rescue JSON::ParserError => e
    Rails.logger.error "Erro ao fazer parse do JSON: #{e.message}"
    Rails.logger.error "Resultado bruto: #{result}"
    
    # Fallback: tenta extrair informações básicas do texto
    fallback_data = {
      "explicacao" => ["Erro ao processar explicação. Tente novamente."],
      "sugestoes" => ["Sugestões não disponíveis no momento"],
      "dica" => "Verifique se o enunciado está claro e tente novamente.",
      "estrutura" => ["Introdução", "Desenvolvimento", "Conclusão"],
      "cronograma" => [
        { "semana" => 1, "atividade" => "Definir tema" },
        { "semana" => 2, "atividade" => "Pesquisar bibliografia" }
      ]
    }
    
    Rails.cache.write(cache_key, fallback_data, expires_in: 1.hour)
    fallback_data
  end
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
        Dê passos práticos (ex.: escolher tema, definir problema, método etc.). Evite jargões.
      PROMPT
    ]

    chat!(messages)
  end

  # Gerar estrutura ABNT para formulário simples
  def gerar_estrutura_abnt!(nome:, faculdade:, curso:, materia:, tema:, tipo_trabalho:)
    cache_key = "gemini_abnt_#{Digest::MD5.hexdigest("#{nome}_#{faculdade}_#{curso}_#{materia}_#{tema}_#{tipo_trabalho}")}"
    cached = Rails.cache.read(cache_key)
    return cached if cached

    messages = [
      { role: "system", content: "Você ajuda estudantes brasileiros a criar estruturas ABNT para trabalhos acadêmicos. Sempre responda em português e em JSON válido com as chaves: estrutura, cronograma, sugestoes." },
      { role: "user", content: <<~TXT }
        Dados do trabalho:
        - Nome do aluno: #{nome}
        - Faculdade: #{faculdade}
        - Curso: #{curso}
        - Matéria: #{materia}
        - Tema: #{tema}
        - Tipo de trabalho: #{tipo_trabalho}

        Tarefa: Gere uma estrutura ABNT completa para este trabalho acadêmico.

        Devolva no seguinte formato JSON:

        {
          "estrutura": [
            "1. INTRODUÇÃO",
            "1.1 Contextualização do problema",
            "1.2 Justificativa",
            "1.3 Objetivos",
            "1.4 Metodologia",
            "2. REFERENCIAL TEÓRICO",
            "2.1 Conceitos fundamentais",
            "2.2 Estado da arte",
            "3. METODOLOGIA",
            "3.1 Tipo de pesquisa",
            "3.2 População e amostra",
            "3.3 Instrumentos de coleta",
            "3.4 Procedimentos",
            "4. RESULTADOS E DISCUSSÃO",
            "4.1 Apresentação dos dados",
            "4.2 Análise dos resultados",
            "4.3 Discussão",
            "5. CONSIDERAÇÕES FINAIS",
            "5.1 Conclusões",
            "5.2 Limitações",
            "5.3 Sugestões para trabalhos futuros",
            "REFERÊNCIAS",
            "APÊNDICES",
            "ANEXOS"
          ],
          "cronograma": [
            { "semana": 1, "atividade": "Definição do tema e problema de pesquisa" },
            { "semana": 2, "atividade": "Revisão bibliográfica inicial" },
            { "semana": 3, "atividade": "Elaboração do projeto de pesquisa" },
            { "semana": 4, "atividade": "Aprovação do projeto pelo orientador" },
            { "semana": 5, "atividade": "Coleta de dados" },
            { "semana": 6, "atividade": "Análise dos dados" },
            { "semana": 7, "atividade": "Redação do trabalho" },
            { "semana": 8, "atividade": "Revisão final e formatação ABNT" }
          ],
          "sugestoes": [
            "Consulte as normas ABNT mais recentes",
            "Mantenha consistência na formatação",
            "Revise a ortografia e gramática",
            "Verifique as citações e referências"
          ]
        }

        - "estrutura": Estrutura completa seguindo padrões ABNT
        - "cronograma": Cronograma de 8 semanas com atividades práticas
        - "sugestoes": Dicas importantes para o desenvolvimento do trabalho
      TXT
    ]

    result = chat!(messages, max_output_tokens: 2000)

    begin
      # Tenta extrair JSON do resultado se estiver dentro de markdown
      json_match = result.match(/```json\s*(\{.*?\})\s*```/m)
      json_string = json_match ? json_match[1] : result
      
      parsed = JSON.parse(json_string)
      Rails.cache.write(cache_key, parsed, expires_in: 1.week)
      parsed
    rescue JSON::ParserError => e
      Rails.logger.error "Erro ao fazer parse do JSON: #{e.message}"
      Rails.logger.error "Resultado bruto: #{result}"
      
      # Fallback: estrutura básica ABNT
      fallback_data = {
        "estrutura" => [
          "1. INTRODUÇÃO",
          "1.1 Contextualização do problema",
          "1.2 Justificativa",
          "1.3 Objetivos",
          "1.4 Metodologia",
          "2. REFERENCIAL TEÓRICO",
          "2.1 Conceitos fundamentais",
          "2.2 Estado da arte",
          "3. METODOLOGIA",
          "3.1 Tipo de pesquisa",
          "3.2 População e amostra",
          "3.3 Instrumentos de coleta",
          "3.4 Procedimentos",
          "4. RESULTADOS E DISCUSSÃO",
          "4.1 Apresentação dos dados",
          "4.2 Análise dos resultados",
          "4.3 Discussão",
          "5. CONSIDERAÇÕES FINAIS",
          "5.1 Conclusões",
          "5.2 Limitações",
          "5.3 Sugestões para trabalhos futuros",
          "REFERÊNCIAS",
          "APÊNDICES",
          "ANEXOS"
        ],
        "cronograma" => [
          { "semana" => 1, "atividade" => "Definição do tema e problema de pesquisa" },
          { "semana" => 2, "atividade" => "Revisão bibliográfica inicial" },
          { "semana" => 3, "atividade" => "Elaboração do projeto de pesquisa" },
          { "semana" => 4, "atividade" => "Aprovação do projeto pelo orientador" },
          { "semana" => 5, "atividade" => "Coleta de dados" },
          { "semana" => 6, "atividade" => "Análise dos dados" },
          { "semana" => 7, "atividade" => "Redação do trabalho" },
          { "semana" => 8, "atividade" => "Revisão final e formatação ABNT" }
        ],
        "sugestoes" => [
          "Consulte as normas ABNT mais recentes",
          "Mantenha consistência na formatação",
          "Revise a ortografia e gramática",
          "Verifique as citações e referências"
        ]
      }
      
      Rails.cache.write(cache_key, fallback_data, expires_in: 1.hour)
      fallback_data
    end
  end
end
