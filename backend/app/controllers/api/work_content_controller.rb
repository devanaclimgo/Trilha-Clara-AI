class Api::WorkContentController < ApplicationController
  before_action :authenticate_user!
  before_action :set_work, only: [:generate_content, :save_content, :content]

  rescue_from StandardError do |e|
    Rails.logger.error "StandardError in WorkContentController: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
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
    Rails.logger.info "Starting save_content for ID: #{params[:id]}"
    Rails.logger.info "Current user: #{current_user&.id}"
    Rails.logger.info "Work object: #{@work&.inspect}"
    
    content_data = params[:content] || {}
    Rails.logger.info "Content data: #{content_data.keys}"
    
    begin
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
      
      # Save custom fields and hierarchy structure
      custom_fields = params[:customFields] || []
      field_order = params[:fieldOrder] || []
      field_labels = params[:fieldLabels] || {}
      
      # Store the hierarchical structure as JSON in a dedicated field
      # This allows us to preserve the exact structure for preview
      hierarchical_structure = {
        custom_fields: custom_fields,
        field_order: field_order,
        field_labels: field_labels,
        saved_at: Time.current
      }
      
      # Update the work with the hierarchical structure
      @work.update!(
        structure: hierarchical_structure.to_json,
        updated_at: Time.current
      )
      
      Rails.logger.info "Successfully updated work content with hierarchical structure"

      render json: {
        message: 'Conteúdo salvo com sucesso',
        saved_at: Time.current,
        structure: hierarchical_structure
      }
    rescue => e
      Rails.logger.error "Error in save_content: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      raise e
    end
  end

  # GET /api/work/:id/content
  def content
    # Parse the structure if it exists
    structure = @work.structure ? JSON.parse(@work.structure) : {}
    
    render json: {
      resumo: @work.resumo,
      introducao: @work.introducao,
      objetivos: @work.objetivos,
      justificativa: @work.justificativa,
      metodologia: @work.metodologia,
      desenvolvimento: @work.desenvolvimento,
      conclusao: @work.conclusao,
      referencias: @work.referencias,
      updated_at: @work.updated_at,
      structure: structure
    }
  end

  private

  def set_work
    Rails.logger.info "=== SET_WORK CALLED ==="
    Rails.logger.info "Setting work for ID: #{params[:id]}"
    Rails.logger.info "Current user: #{current_user&.id}"
    
    # Handle both legacy string IDs and database integer IDs
    if params[:id].to_s.start_with?('tcc-')
      Rails.logger.info "Handling legacy TCC ID: #{params[:id]}"
      # Legacy string ID format - create a new TCC record for this user
      # This ensures proper multi-tenant isolation
      begin
        @work = current_user.tccs.find_or_create_by(tema: "Trabalho Acadêmico - #{params[:id]}") do |tcc|
          # Set default values for a new TCC
          # Note: tcc.tema is already set to the unique identifier above
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
    Rails.logger.info "=== SET_WORK COMPLETED ==="
  end
end
