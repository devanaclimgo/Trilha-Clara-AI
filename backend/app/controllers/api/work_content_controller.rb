class Api::WorkContentController < ApplicationController
  before_action :authenticate_user!
  before_action :set_work, only: [:generate_content, :save_content, :get_content]

  rescue_from StandardError do |e|
    render json: { error: e.message }, status: :internal_server_error
  end

  # POST /api/work/:id/generate_content
  def generate_content
    field = params[:field]
    user_ideas = params[:user_ideas] || ''
    
    unless %w[resumo introducao objetivos justificativa metodologia desenvolvimento conclusao referencias].include?(field)
      return render json: { error: 'Campo inválido' }, status: :bad_request
    end

    gemini = GeminiService.new
    
    # Gerar conteúdo baseado no campo e nas ideias do usuário
    generated_content = gemini.generate_work_content!(
      field: field,
      user_ideas: user_ideas,
      work_data: {
        titulo: @work.titulo,
        tema: @work.tema,
        tipo_trabalho: @work.tipo_trabalho,
        curso: @work.curso,
        nome_aluno: @work.nome,
        instituicao: @work.faculdade,
        orientador: @work.orientador
      }
    )

    render json: {
      field: field,
      content: generated_content,
      generated_at: Time.current
    }
  end

  # POST /api/work/:id/save_content
  def save_content
    content_data = params[:content] || {}
    
    # Atualizar o conteúdo do trabalho
    @work.update!(
      resumo: content_data[:resumo],
      introducao: content_data[:introducao],
      objetivos: content_data[:objetivos],
      justificativa: content_data[:justificativa],
      metodologia: content_data[:metodologia],
      desenvolvimento: content_data[:desenvolvimento],
      conclusao: content_data[:conclusao],
      referencias: content_data[:referencias],
      updated_at: Time.current
    )

    render json: {
      message: 'Conteúdo salvo com sucesso',
      saved_at: Time.current
    }
  end

  # GET /api/work/:id/content
  def content
    render json: {
      resumo: @work.resumo,
      introducao: @work.introducao,
      objetivos: @work.objetivos,
      justificativa: @work.justificativa,
      metodologia: @work.metodologia,
      desenvolvimento: @work.desenvolvimento,
      conclusao: @work.conclusao,
      referencias: @work.referencias,
      updated_at: @work.updated_at
    }
  end

  private

  def set_work
    Rails.logger.info "Setting work for ID: #{params[:id]}"
    Rails.logger.info "Current user: #{current_user.id}"
    
    # Handle both legacy string IDs and database integer IDs
    if params[:id].to_s.start_with?('tcc-')
      Rails.logger.info "Handling legacy TCC ID: #{params[:id]}"
      # Legacy string ID format - create a new TCC record for this user
      # This ensures proper multi-tenant isolation
      begin
        @work = current_user.tccs.find_or_create_by(tema: "Trabalho Acadêmico - #{params[:id]}") do |tcc|
          # Set default values for a new TCC
          tcc.tema = "Trabalho Acadêmico"
          tcc.tipo_trabalho = "TCC"
          tcc.curso = "Curso"
          tcc.nome = current_user.name || "Estudante"
          tcc.faculdade = "Instituição"
        end
        Rails.logger.info "Created/found work: #{@work.id}"
      rescue => e
        Rails.logger.error "Error creating/finding work: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        raise e
      end
    else
      Rails.logger.info "Handling standard database ID: #{params[:id]}"
      # Standard database ID
      @work = current_user.tccs.find(params[:id])
    end
  end
end
