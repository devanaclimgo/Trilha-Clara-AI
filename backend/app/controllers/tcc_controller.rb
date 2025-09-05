class TccController < ApplicationController
  def criar
    enunciado = params[:enunciado]
    curso = params[:curso]

   # openai = OpenaiService.new

    @explicacao = openai.simplificar_enunciado!(enunciado: enunciado, curso: curso)
    @sumario = openai.gerar_sumario!(curso: curso)

    render json: { explicacao: @explicacao, sumario: @sumario }
  end
end