class TccController < ApplicationController
  def criar
    enunciado = params[:enunciado]
    curso = params[:curso]

    gemini = GeminiService.new

    @explicacao = gemini.simplificar_enunciado!(enunciado: enunciado, curso: curso)
    @sumario = gemini.gerar_sumario!(curso: curso)

    render json: { explicacao: @explicacao, sumario: @sumario }
  end
end