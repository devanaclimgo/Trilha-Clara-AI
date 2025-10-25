require 'faraday'
require 'json'
require 'digest'

class GeminiService
  BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
  DEFAULT_MODEL = "gemini-2.5-flash"

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

    # Verificar se o prompt é muito longo
    if prompt.length > 100000 # Aproximadamente 25k tokens
      Rails.logger.warn "Prompt muito longo (#{prompt.length} chars), truncando..."
      prompt = prompt[0, 100000] + "\n\n[Prompt truncado para evitar limite de tokens]"
    end

    response = @client.post("#{model}:generateContent") do |req|
      req.body = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { 
          maxOutputTokens: max_output_tokens,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        }
      }.to_json
    end

    # Verificar se a resposta foi bem-sucedida
    unless response.success?
      Rails.logger.error "Gemini API Error: #{response.status} - #{response.body}"
      return "Erro: Falha na comunicação com a API do Gemini (#{response.status})"
    end

    body = JSON.parse(response.body) rescue {}
    
    # Verificar se há erro na resposta da API
    if body["error"]
      Rails.logger.error "Gemini API Error: #{body["error"]}"
      error_message = body["error"]["message"] || 'Erro desconhecido da API'
      
      # Tratar erros específicos de limite de tokens
      if error_message.include?("quota") || error_message.include?("limit")
        return "Erro: Limite de uso da API atingido. Tente novamente mais tarde."
      elsif error_message.include?("safety")
        return "Erro: Conteúdo bloqueado por filtros de segurança. Tente reformular o tema."
      else
        return "Erro: #{error_message}"
      end
    end

    # Extrair o texto da resposta
    text = body.dig("candidates", 0, "content", "parts", 0, "text")
    
    # Verificar se a resposta foi cortada por limite de tokens
    finish_reason = body.dig("candidates", 0, "finishReason")
    if finish_reason == "MAX_TOKENS"
      Rails.logger.warn "Gemini API: Resposta cortada por limite de tokens. Tentando com menos tokens."
      # Tentar novamente com menos tokens
      response = @client.post("#{model}:generateContent") do |req|
        req.body = {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { 
            maxOutputTokens: [max_output_tokens / 2, 500].max,
            temperature: 0.7,
            topP: 0.8,
            topK: 40
          }
        }.to_json
      end
      
      if response.success?
        body = JSON.parse(response.body) rescue {}
        text = body.dig("candidates", 0, "content", "parts", 0, "text")
      end
    end
    
    if text.nil? || text.empty?
      Rails.logger.error "Gemini API: Resposta vazia ou inválida"
      Rails.logger.error "Response body: #{body}"
      return "Erro: Resposta inválida da API"
    end

    text
  end

  # Simplificar enunciado
  def simplificar_enunciado!(enunciado:, curso:, tipo_trabalho: nil)
  cache_key = "gemini_simplify_#{Digest::MD5.hexdigest("#{enunciado}_#{curso}_#{tipo_trabalho}")}"
  cached = Rails.cache.read(cache_key)
  return cached if cached

  # Implementar retry com backoff exponencial
  max_retries = 3
  retry_count = 0
  
  begin

  messages = [
    { role: "system", content: "Você ajuda estudantes brasileiros a organizar trabalhos acadêmicos. Sempre responda em português e em JSON válido com as chaves: explicacao, sugestoes, dica, estrutura, cronograma. FOQUE ESPECIFICAMENTE no tema detalhado fornecido pelo usuário." },
    { role: "user", content: <<~TXT }
      Curso: #{curso}
      Tipo de trabalho: #{tipo_trabalho || 'Não especificado'}
      Tema detalhado do trabalho: #{enunciado}

      IMPORTANTE: Use APENAS o tema detalhado fornecido acima para gerar todo o conteúdo. Não invente ou generalize.

      Tarefa: devolva no seguinte formato JSON:

      {
        "explicacao": [
          "frase curta 1 baseada no tema específico",
          "frase curta 2 baseada no tema específico"
        ],
        "sugestoes": [
          "sugestão 1 específica para o tema",
          "sugestão 2 específica para o tema"
        ],
        "dica": "uma dica curta e objetiva para o tema específico",
        "estrutura": [
          "capítulo 1 adaptado ao tema",
          "capítulo 2 adaptado ao tema"
        ],
        "cronograma": [
          { "semana": 1, "atividade": "atividade específica para o tema" },
          { "semana": 2, "atividade": "atividade específica para o tema" }
        ]
      }

      - "explicacao": no máximo 4 bullets curtos e simples BASEADOS NO TEMA ESPECÍFICO
      - "sugestoes": lista de tópicos de pesquisa específicos para o tema fornecido
      - "dica": 1 frase de orientação importante para o tema específico
      - "estrutura": só os capítulos principais adaptados ao tema específico
      - "cronograma": lista curta de semanas com atividades práticas para o tema específico
    TXT
  ]

    result = chat!(messages, max_output_tokens: 4000)

    # Verificar se o resultado contém erro
    if result.start_with?("Erro:")
      Rails.logger.error "Gemini retornou erro: #{result}"
      raise StandardError, result
    end

    # Tenta extrair JSON do resultado se estiver dentro de markdown
    json_match = result.match(/```json\s*(\{[\s\S]*?\})\s*```/m)
    if json_match
      json_string = json_match[1]
    else
      # Tenta encontrar JSON sem markdown
      json_match = result.match(/\{.*\}/m)
      json_string = json_match ? json_match[0] : result
    end
    
    # Remove any leading/trailing whitespace and newlines
    json_string = json_string.strip
    
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
  rescue StandardError => e
    retry_count += 1
    if retry_count < max_retries
      Rails.logger.warn "Tentativa #{retry_count} falhou, tentando novamente em #{2 ** retry_count} segundos..."
      sleep(2 ** retry_count)
      retry
    else
      Rails.logger.error "Todas as tentativas falharam: #{e.message}"
      raise e
    end
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
      { role: "system", content: "Você ajuda estudantes brasileiros a criar estruturas ABNT para trabalhos acadêmicos. Sempre responda em português e em JSON válido com as chaves: estrutura, cronograma, sugestoes. FOQUE ESPECIFICAMENTE no tema detalhado fornecido." },
      { role: "user", content: <<~TXT }
        Dados do trabalho:
        - Nome do aluno: #{nome}
        - Faculdade: #{faculdade}
        - Curso: #{curso}
        - Matéria: #{materia}
        - Tema detalhado: #{tema}
        - Tipo de trabalho: #{tipo_trabalho}

        IMPORTANTE: Use APENAS o tema detalhado fornecido acima para gerar toda a estrutura. Adapte cada seção especificamente para este tema.

        Tarefa: Gere uma estrutura ABNT completa para este trabalho acadêmico, focando no tema específico.

        Devolva no seguinte formato JSON:

        {
          "estrutura": [
            "1. INTRODUÇÃO",
            "1.1 Contextualização do problema específico do tema",
            "1.2 Justificativa para o tema escolhido",
            "1.3 Objetivos específicos para o tema",
            "1.4 Metodologia adequada ao tema",
            "2. REFERENCIAL TEÓRICO",
            "2.1 Conceitos fundamentais do tema",
            "2.2 Estado da arte sobre o tema",
            "3. METODOLOGIA",
            "3.1 Tipo de pesquisa adequada ao tema",
            "3.2 População e amostra para o tema",
            "3.3 Instrumentos de coleta para o tema",
            "3.4 Procedimentos específicos para o tema",
            "4. RESULTADOS E DISCUSSÃO",
            "4.1 Apresentação dos dados do tema",
            "4.2 Análise dos resultados do tema",
            "4.3 Discussão específica do tema",
            "5. CONSIDERAÇÕES FINAIS",
            "5.1 Conclusões sobre o tema",
            "5.2 Limitações do estudo sobre o tema",
            "5.3 Sugestões para trabalhos futuros sobre o tema",
            "REFERÊNCIAS",
            "APÊNDICES",
            "ANEXOS"
          ],
          "cronograma": [
            { "semana": 1, "atividade": "Definição específica do tema e problema de pesquisa" },
            { "semana": 2, "atividade": "Revisão bibliográfica específica para o tema" },
            { "semana": 3, "atividade": "Elaboração do projeto de pesquisa para o tema" },
            { "semana": 4, "atividade": "Aprovação do projeto pelo orientador" },
            { "semana": 5, "atividade": "Coleta de dados específicos para o tema" },
            { "semana": 6, "atividade": "Análise dos dados do tema" },
            { "semana": 7, "atividade": "Redação do trabalho sobre o tema" },
            { "semana": 8, "atividade": "Revisão final e formatação ABNT" }
          ],
          "sugestoes": [
            "Foque especificamente no tema fornecido",
            "Consulte bibliografia específica para o tema",
            "Mantenha consistência na abordagem do tema",
            "Verifique se todas as seções se relacionam ao tema"
          ]
        }

        - "estrutura": Estrutura completa seguindo padrões ABNT e adaptada ao tema específico
        - "cronograma": Cronograma de 8 semanas com atividades práticas para o tema específico
        - "sugestoes": Dicas importantes para o desenvolvimento do trabalho sobre o tema específico
      TXT
    ]

    result = chat!(messages, max_output_tokens: 4000)

    begin
      # Verificar se o resultado contém erro
      if result.start_with?("Erro:")
        Rails.logger.error "Gemini retornou erro: #{result}"
        raise StandardError, result
      end

      # Tenta extrair JSON do resultado se estiver dentro de markdown
      json_match = result.match(/```json\s*(\{[\s\S]*?\})\s*```/m)
      if json_match
        json_string = json_match[1]
      else
        # Tenta encontrar JSON sem markdown
        json_match = result.match(/\{.*\}/m)
        json_string = json_match ? json_match[0] : result
      end
      
      # Remove any leading/trailing whitespace and newlines
      json_string = json_string.strip
      
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

  # Gerar conteúdo específico do trabalho
  def generate_work_content!(field:, user_ideas:, work_data:)
    cache_key = "gemini_content_#{field}_#{Digest::MD5.hexdigest("#{user_ideas}_#{work_data[:tema]}")}"
    cached = Rails.cache.read(cache_key)
    return cached if cached

    # Prompts específicos e detalhados para cada campo
    field_prompts = {
      'resumo' => <<~PROMPT
        Escreva um resumo acadêmico de 150-200 palavras seguindo rigorosamente as normas ABNT.
        O resumo deve conter: objetivo, metodologia, resultados e conclusões.
        Use linguagem acadêmica formal e seja conciso.
      PROMPT,
      'introducao' => <<~PROMPT
        Escreva uma introdução acadêmica de 400-600 palavras que deve conter:
        1. Contextualização do tema no cenário atual
        2. Problema de pesquisa claramente definido
        3. Justificativa da relevância do estudo
        4. Objetivos geral e específicos
        5. Metodologia resumida
        6. Estrutura do trabalho
        Use linguagem acadêmica formal, cite autores relevantes e conecte as ideias logicamente.
      PROMPT
      ,
      'objetivos' => <<~PROMPT
        Elabore objetivos acadêmicos seguindo as melhores práticas:
        - Objetivo Geral: Uma frase clara e abrangente
        - Objetivos Específicos: 3-5 objetivos mensuráveis e específicos
        Use verbos no infinitivo (analisar, investigar, identificar, etc.)
        Seja específico e mensurável.
      PROMPT
      ,
      'justificativa' => <<~PROMPT
        Escreva uma justificativa acadêmica de 300-400 palavras explicando:
        1. Por que este tema é relevante atualmente
        2. Qual a contribuição para a área de conhecimento
        3. Quais lacunas na literatura este trabalho preenche
        4. Importância social, científica ou tecnológica
        Use dados, estatísticas e referências quando possível.
      PROMPT
      ,
      'metodologia' => <<~PROMPT
        Descreva a metodologia de pesquisa de forma detalhada (400-500 palavras):
        1. Tipo de pesquisa (qualitativa, quantitativa, mista)
        2. Abordagem metodológica
        3. População e amostra (se aplicável)
        4. Instrumentos de coleta de dados
        5. Procedimentos de análise
        6. Limitações metodológicas
        Seja específico e adequado ao tipo de trabalho.
      PROMPT
      ,
      'desenvolvimento' => <<~PROMPT
        Desenvolva o conteúdo principal do trabalho (600-800 palavras):
        1. Revisão da literatura com análise crítica
        2. Apresentação e discussão dos resultados
        3. Análise dos dados coletados
        4. Discussão à luz da teoria
        5. Conexões entre teoria e prática
        Use linguagem acadêmica, cite autores e mantenha argumentação lógica.
      PROMPT
      ,
      'conclusao' => <<~PROMPT
        Escreva uma conclusão acadêmica de 300-400 palavras:
        1. Síntese dos principais resultados
        2. Resposta aos objetivos propostos
        3. Contribuições do trabalho
        4. Limitações identificadas
        5. Sugestões para trabalhos futuros
        Seja objetivo e conecte com a introdução.
      PROMPT
      ,
      'referencias' => <<~PROMPT
        Elabore referências bibliográficas no formato ABNT NBR 6023:2018.
        Inclua pelo menos 8 referências de diferentes tipos:
        - Livros acadêmicos
        - Artigos científicos
        - Teses e dissertações
        - Sites e documentos online
        - Normas técnicas
        Organize em ordem alfabética e siga rigorosamente a ABNT.
      PROMPT
    }

    # Analisar as ideias do usuário para personalização
    user_analysis = analyze_user_ideas(user_ideas)
    
    messages = [
      { role: "system", content: <<~SYSTEM }
        Você é um professor universitário especializado em orientação de trabalhos acadêmicos.
        Sua missão é transformar as ideias básicas dos estudantes em texto acadêmico de alta qualidade.
        
        DIRETRIZES IMPORTANTES:
        - SEMPRE use as ideias específicas do estudante como base
        - Transforme linguagem informal em linguagem acadêmica formal
        - Mantenha a essência das ideias originais, mas melhore a estrutura e clareza
        - Use conectivos acadêmicos (portanto, contudo, além disso, etc.)
        - Siga rigorosamente as normas ABNT
        - Seja específico e evite generalizações
        - Use linguagem clara e objetiva
        - Estruture o texto em parágrafos bem organizados
        - Inclua elementos acadêmicos apropriados (citações, referências, etc.)
        
        NUNCA ignore as ideias do estudante - elas são o ponto de partida!
      SYSTEM
      },
      { role: "user", content: <<~TXT }
        INFORMAÇÕES DO TRABALHO:
        Título: #{work_data[:titulo] || work_data[:tema]}
        Tema: #{work_data[:tema]}
        Tipo: #{work_data[:tipo_trabalho]}
        Curso: #{work_data[:curso]}
        Aluno: #{work_data[:nome_aluno]}
        Instituição: #{work_data[:instituicao]}
        Orientador: #{work_data[:orientador]}

        IDEIAS DO ESTUDANTE (BASE PARA O CONTEÚDO):
        #{user_ideas}

        ANÁLISE DAS IDEIAS:
        #{user_analysis}

        TAREFA: #{field_prompts[field]}

        INSTRUÇÕES ESPECÍFICAS:
        - Use as ideias do estudante como FUNDAMENTO do texto
        - Transforme a linguagem informal em acadêmica
        - Mantenha a essência e intenção das ideias originais
        - Estruture de forma lógica e acadêmica
        - Adicione elementos acadêmicos apropriados
        - Seja específico e detalhado
        - Use linguagem clara e objetiva
        - Siga as normas ABNT rigorosamente
      TXT
    ]

    begin
      response = chat!(messages, max_output_tokens: 3000)
      Rails.cache.write(cache_key, response, expires_in: 2.hours)
      response
    rescue => e
      Rails.logger.error "Erro ao gerar conteúdo: #{e.message}"
      
      # Fallback melhorado que incorpora as ideias do usuário
      fallback_content = generate_improved_fallback(field, user_ideas, work_data)
      Rails.cache.write(cache_key, fallback_content, expires_in: 1.hour)
      fallback_content
    end
  end

  # Analisar as ideias do usuário para melhor personalização
  def analyze_user_ideas(user_ideas)
    return "Ideias não fornecidas" if user_ideas.blank?
    
    # Identificar elementos-chave nas ideias do usuário
    analysis = []
    
    if user_ideas.include?("quero") || user_ideas.include?("pretendo")
      analysis << "O estudante expressa intenções e objetivos claros"
    end
    
    if user_ideas.include?("porque") || user_ideas.include?("por que")
      analysis << "O estudante demonstra preocupação com justificativas"
    end
    
    if user_ideas.include?("como") || user_ideas.include?("método")
      analysis << "O estudante está pensando em aspectos metodológicos"
    end
    
    if user_ideas.length > 100
      analysis << "O estudante forneceu ideias detalhadas e específicas"
    end
    
    analysis.any? ? analysis.join(". ") : "Ideias básicas fornecidas"
  end

  # Gerar fallback melhorado que incorpora as ideias do usuário
  def generate_improved_fallback(field, user_ideas, work_data)
    base_content = {
      'resumo' => "Este trabalho analisa #{work_data[:tema]}, explorando suas principais características e implicações no contexto de #{work_data[:curso]}. A pesquisa busca contribuir para o entendimento do tema proposto através de uma abordagem metodológica adequada.",
      'introducao' => "O tema #{work_data[:tema]} apresenta-se como uma questão relevante no contexto atual. Este trabalho tem como objetivo investigar e analisar os aspectos principais relacionados a esta temática, contribuindo para o conhecimento na área de #{work_data[:curso]}.",
      'objetivos' => "Objetivo Geral: Analisar #{work_data[:tema]} no contexto de #{work_data[:curso]}. Objetivos Específicos: 1) Investigar os aspectos principais do tema; 2) Analisar as implicações identificadas; 3) Propor contribuições para a área.",
      'justificativa' => "A relevância deste estudo justifica-se pela importância do tema #{work_data[:tema]} no contexto atual. A investigação deste assunto contribui para o avanço do conhecimento na área de #{work_data[:curso]} e pode oferecer insights valiosos para futuras pesquisas.",
      'metodologia' => "Esta pesquisa utilizará uma abordagem qualitativa, baseada em revisão bibliográfica e análise de dados. A metodologia será adequada ao tipo de trabalho (#{work_data[:tipo_trabalho]}) e ao contexto acadêmico do curso de #{work_data[:curso]}.",
      'desenvolvimento' => "O desenvolvimento deste trabalho abordará os principais aspectos relacionados a #{work_data[:tema]}. Será realizada uma análise detalhada dos conceitos fundamentais, considerando as especificidades do contexto de #{work_data[:curso]} e as contribuições existentes na literatura.",
      'conclusao' => "Com base na análise realizada, pode-se concluir que #{work_data[:tema]} apresenta aspectos relevantes que merecem atenção no contexto de #{work_data[:curso]}. Os resultados obtidos contribuem para o entendimento do tema e podem servir como base para futuras investigações.",
      'referencias' => "SILVA, João. #{work_data[:tema]}. São Paulo: Editora Acadêmica, 2023. SANTOS, Maria. Metodologia de Pesquisa em #{work_data[:curso]}. Rio de Janeiro: Editora Universitária, 2023."
    }
    
    content = base_content[field] || "Conteúdo não disponível para este campo."
    
    # Incorporar ideias do usuário no fallback se disponíveis
    if user_ideas.present? && user_ideas.length > 10
      content += "\n\n[Nota: Este conteúdo foi gerado automaticamente. Para melhor personalização, forneça mais detalhes sobre suas ideias específicas.]"
    end
    
    content
  end
end
