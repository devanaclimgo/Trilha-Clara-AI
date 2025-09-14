class Api::TccController < ApplicationController
  rescue_from StandardError do |e|
    render json: { error: e.message }, status: :internal_server_error
  end

  def criar
    # Dados do formulário simples
    nome = params[:nome]
    faculdade = params[:faculdade]
    curso = params[:curso]
    materia = params[:materia]
    tema = params[:tema]
    tipo_trabalho = params[:tipoTrabalho]
    
    # Dados do formulário antigo (para compatibilidade)
    enunciado = params[:enunciado]
    semanas = params[:semanas] || 8

    # Gerar ID único para o TCC
    tcc_id = "tcc_#{Time.current.to_i}_#{SecureRandom.hex(4)}"

    gemini = GeminiService.new

    if enunciado.present?
      # Fluxo antigo - com enunciado
      dados_estruturados = gemini.simplificar_enunciado!(enunciado: enunciado, curso: curso, tipo_trabalho: tipo_trabalho)
      
      render json: {
        id: tcc_id,
        explicacao: dados_estruturados["explicacao"] || [],
        sugestoes: dados_estruturados["sugestoes"] || [],
        dica: dados_estruturados["dica"] || "",
        estrutura: dados_estruturados["estrutura"] || [],
        cronograma: dados_estruturados["cronograma"] || []
      }
    else
      # Fluxo novo - formulário simples
      # Primeiro gera a explicação simplificada baseada no tema
      explicacao_dados = gemini.simplificar_enunciado!(
        enunciado: "Desenvolver um #{tipo_trabalho || 'trabalho acadêmico'} sobre #{tema} na disciplina de #{materia}",
        curso: curso,
        tipo_trabalho: tipo_trabalho
      )
      
      # Depois gera a estrutura ABNT completa
      estrutura_dados = gemini.gerar_estrutura_abnt!(
        nome: nome,
        faculdade: faculdade,
        curso: curso,
        materia: materia,
        tema: tema,
        tipo_trabalho: tipo_trabalho
      )
      
      render json: {
        id: tcc_id,
        nome: nome,
        faculdade: faculdade,
        curso: curso,
        materia: materia,
        tema: tema,
        tipo_trabalho: tipo_trabalho,
        explicacao: explicacao_dados["explicacao"] || [],
        sugestoes: explicacao_dados["sugestoes"] || [],
        dica: explicacao_dados["dica"] || "",
        estrutura: estrutura_dados["estrutura"] || [],
        cronograma: estrutura_dados["cronograma"] || []
      }
    end
  end

  def export_word
    tcc_id = params[:id]
    
    # Aqui você implementaria a lógica para gerar o arquivo Word
    # Por enquanto, retornamos um arquivo de exemplo
    send_file Rails.root.join('public', 'exemplo.docx'), 
              filename: "TCC_#{tcc_id}.docx", 
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  end

  def export_pdf
    tcc_id = params[:id]
    
    # Aqui você implementaria a lógica para gerar o arquivo PDF
    # Por enquanto, retornamos um arquivo de exemplo
    send_file Rails.root.join('public', 'exemplo.pdf'), 
              filename: "TCC_#{tcc_id}.pdf", 
              type: 'application/pdf'
  end
end
