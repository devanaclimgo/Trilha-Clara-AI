class Api::TccController < ApplicationController
  rescue_from StandardError do |e|
    render json: { error: e.message }, status: :internal_server_error
  end

  def criar
    enunciado = params[:enunciado]
    curso = params[:curso]
    semanas = params[:semanas] || 8

    gemini = GeminiService.new

    # O método simplificar_enunciado! já retorna um hash com todos os dados estruturados
    dados_estruturados = gemini.simplificar_enunciado!(enunciado: enunciado, curso: curso)

    render json: {
      explicacao: dados_estruturados["explicacao"] || [],
      sugestoes: dados_estruturados["sugestoes"] || [],
      dica: dados_estruturados["dica"] || "",
      estrutura: dados_estruturados["estrutura"] || [],
      cronograma: dados_estruturados["cronograma"] || []
    }
  end
end
