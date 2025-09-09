class Api::TccController < ApplicationController
  rescue_from StandardError do |e|
    render json: { error: e.message }, status: :internal_server_error
  end

  def criar
    enunciado = params[:enunciado]
    curso = params[:curso]
    semanas = params[:semanas] || 8

    gemini = GeminiService.new

    explicacao = gemini.simplificar_enunciado!(enunciado: enunciado, curso: curso)
    sumario = gemini.gerar_sumario!(curso: curso)
    cronograma = gemini.gerar_cronograma!(curso: curso, semanas: semanas)

    render json: {
      explicacao: explicacao,
      sumario: sumario,
      cronograma: cronograma
    }
  end
end
