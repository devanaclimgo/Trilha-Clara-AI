# =====================================================
# ROTAS DA API - TCC EFFORTLESS
# =====================================================

# config/routes.rb
Rails.application.routes.draw do
  # Health check
  get '/health', to: 'health#index'

  # API namespace
  namespace :api do
    # Autenticação
    namespace :auth do
      post 'login', to: 'sessions#create'
      delete 'logout', to: 'sessions#destroy'
      post 'register', to: 'registrations#create'
      post 'google', to: 'google#create'
      get 'me', to: 'sessions#show'
    end

    # Usuários
    resources :users, only: [:show, :update] do
      member do
        get 'stats'
        get 'tccs'
      end
    end

    # TCCs
    resources :tccs do
      member do
        # Conteúdo
        get 'content', to: 'tccs#content'
        post 'save_content', to: 'tccs#save_content'
        post 'generate_content', to: 'tccs#generate_content'
        
        # Estrutura e IA
        get 'structure', to: 'tccs#structure'
        post 'generate_structure', to: 'tccs#generate_structure'
        get 'timeline', to: 'tccs#timeline'
        post 'generate_timeline', to: 'tccs#generate_timeline'
        get 'explanation', to: 'tccs#explanation'
        post 'generate_explanation', to: 'tccs#generate_explanation'
        
        # Seções customizadas
        post 'custom_sections', to: 'tccs#add_custom_section'
        patch 'custom_sections/:section_id', to: 'tccs#update_custom_section'
        delete 'custom_sections/:section_id', to: 'tccs#delete_custom_section'
        
        # Labels e ordem
        patch 'section_labels', to: 'tccs#update_section_labels'
        patch 'field_order', to: 'tccs#update_field_order'
        
        # Notas
        resources :notes, only: [:index, :create, :update, :destroy]
        
        # Histórico
        get 'history', to: 'tccs#history'
        post 'history/:history_id/restore', to: 'tccs#restore_from_history'
        
        # Export
        get 'export/word', to: 'tccs#export_word'
        get 'export/pdf', to: 'tccs#export_pdf'
      end
    end

    # Work (alias para TCCs para compatibilidade)
    namespace :work do
      resources :tccs, param: :id do
        member do
          get 'content', to: 'tccs#content'
          post 'save_content', to: 'tccs#save_content'
          post 'generate_content', to: 'tccs#generate_content'
        end
      end
    end
  end

  # Fallback para SPA
  get '*path', to: 'application#fallback', constraints: ->(req) do
    !req.xhr? && req.format.html?
  end
end

# =====================================================
# CONTROLLERS DA API
# =====================================================

# app/controllers/api/auth/sessions_controller.rb
class Api::Auth::SessionsController < ApplicationController
  before_action :authenticate_user!, only: [:show, :destroy]

  def create
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      token = generate_jwt_token(user)
      render json: {
        user: UserSerializer.new(user).serializable_hash[:data][:attributes],
        token: token
      }
    else
      render json: { error: 'Credenciais inválidas' }, status: :unauthorized
    end
  end

  def show
    render json: {
      user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
    }
  end

  def destroy
    # Adicionar token à denylist
    JwtDenylist.create!(
      jti: current_jti,
      expires_at: Time.at(current_payload['exp'])
    )
    
    render json: { message: 'Logout realizado com sucesso' }
  end

  private

  def generate_jwt_token(user)
    JWT.encode(
      {
        user_id: user.id,
        exp: 24.hours.from_now.to_i,
        jti: SecureRandom.uuid
      },
      Rails.application.credentials.secret_key_base
    )
  end
end

# app/controllers/api/tccs_controller.rb
class Api::TccsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_tcc, only: [:show, :update, :destroy, :content, :save_content, 
                                 :generate_content, :structure, :generate_structure,
                                 :timeline, :generate_timeline, :explanation, 
                                 :generate_explanation, :add_custom_section,
                                 :update_custom_section, :delete_custom_section,
                                 :update_section_labels, :update_field_order,
                                 :history, :restore_from_history, :export_word, :export_pdf]

  def index
    @tccs = current_user.tccs.includes(:tcc_content, :tcc_ai_structure, :tcc_ai_timeline)
    render json: TccSerializer.new(@tccs).serializable_hash
  end

  def show
    render json: TccSerializer.new(@tcc).serializable_hash
  end

  def create
    @tcc = current_user.tccs.build(tcc_params)
    
    if @tcc.save
      render json: TccSerializer.new(@tcc).serializable_hash, status: :created
    else
      render json: { errors: @tcc.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @tcc.update(tcc_params)
      render json: TccSerializer.new(@tcc).serializable_hash
    else
      render json: { errors: @tcc.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @tcc.destroy
    head :no_content
  end

  # Conteúdo
  def content
    content_service = TccContentService.new(@tcc)
    render json: content_service.get_complete_content
  end

  def save_content
    content_service = TccContentService.new(@tcc)
    content_service.update_content(content_params)
    render json: { message: 'Conteúdo salvo com sucesso' }
  end

  def generate_content
    # Integração com IA (Gemini)
    ai_service = AiContentService.new(@tcc)
    generated_content = ai_service.generate_content(params[:field], params[:user_ideas])
    
    @tcc.tcc_content.update(params[:field] => generated_content)
    @tcc.save_content_snapshot('ai_generation', "Generated content for #{params[:field]}")
    
    render json: { content: generated_content }
  end

  # Estrutura e IA
  def structure
    render json: { structure: @tcc.tcc_ai_structure&.structure_data || [] }
  end

  def generate_structure
    ai_service = AiDataService.new(@tcc)
    structure_data = ai_service.generate_structure(@tcc.tema, @tcc.area_conhecimento)
    ai_service.save_structure(structure_data)
    
    render json: { structure: structure_data }
  end

  def timeline
    render json: { timeline: @tcc.tcc_ai_timeline&.timeline_data || [] }
  end

  def generate_timeline
    ai_service = AiDataService.new(@tcc)
    timeline_data = ai_service.generate_timeline(@tcc.prazo_entrega)
    ai_service.save_timeline(timeline_data)
    
    render json: { timeline: timeline_data }
  end

  def explanation
    explanation_type = params[:type] || 'simplified'
    explanation = @tcc.tcc_ai_explanations.find_by(explanation_type: explanation_type)
    render json: { explanation: explanation&.content || '' }
  end

  def generate_explanation
    ai_service = AiDataService.new(@tcc)
    explanation_type = params[:type] || 'simplified'
    content = ai_service.generate_explanation(@tcc.tema, explanation_type)
    ai_service.save_explanation(explanation_type, content)
    
    render json: { explanation: content }
  end

  # Seções customizadas
  def add_custom_section
    content_service = TccContentService.new(@tcc)
    section = content_service.add_custom_section(
      params[:title], 
      params[:description]
    )
    
    render json: { section: section }
  end

  def update_custom_section
    section = @tcc.tcc_custom_sections.find(params[:section_id])
    section.update!(title: params[:title], description: params[:description])
    
    render json: { section: section }
  end

  def delete_custom_section
    section = @tcc.tcc_custom_sections.find(params[:section_id])
    section.destroy!
    
    render json: { message: 'Seção removida com sucesso' }
  end

  # Labels e ordem
  def update_section_labels
    content_service = TccContentService.new(@tcc)
    content_service.update_section_labels(params[:labels])
    
    render json: { message: 'Labels atualizados com sucesso' }
  end

  def update_field_order
    content_service = TccContentService.new(@tcc)
    content_service.update_field_order(params[:field_order])
    
    render json: { message: 'Ordem dos campos atualizada com sucesso' }
  end

  # Histórico
  def history
    @history = @tcc.tcc_content_history.recent.limit(50)
    render json: { history: @history }
  end

  def restore_from_history
    history_entry = @tcc.tcc_content_history.find(params[:history_id])
    
    # Restaurar conteúdo
    snapshot = history_entry.content_snapshot
    @tcc.tcc_content.update!(snapshot['content'])
    
    # Restaurar seções customizadas
    @tcc.tcc_custom_sections.destroy_all
    snapshot['custom_sections'].each do |section_data|
      @tcc.tcc_custom_sections.create!(
        section_key: section_data['key'],
        title: section_data['label'],
        description: section_data['description'],
        content: section_data['content'],
        order_index: section_data['order']
      )
    end
    
    # Restaurar labels
    @tcc.tcc_section_labels.destroy_all
    snapshot['field_labels'].each do |section_id, label|
      @tcc.tcc_section_labels.create!(section_id: section_id, label: label)
    end
    
    # Restaurar ordem
    field_order = @tcc.tcc_field_order || @tcc.create_tcc_field_order!
    field_order.update!(field_order: snapshot['field_order'])
    
    render json: { message: 'Estado restaurado com sucesso' }
  end

  # Export
  def export_word
    # Implementar geração de DOCX
    render json: { message: 'Export para Word em desenvolvimento' }
  end

  def export_pdf
    # Implementar geração de PDF
    render json: { message: 'Export para PDF em desenvolvimento' }
  end

  private

  def set_tcc
    @tcc = current_user.tccs.find(params[:id])
  end

  def tcc_params
    params.require(:tcc).permit(:titulo, :tema, :area_conhecimento, :tipo_trabalho, 
                               :prazo_entrega, :orientador_nome, :orientador_email, 
                               :instituicao, :curso)
  end

  def content_params
    params.require(:content).permit(:resumo, :introducao, :objetivos, :justificativa,
                                   :metodologia, :desenvolvimento, :conclusao, :referencias)
  end
end

# app/controllers/api/work/tccs_controller.rb
class Api::Work::TccsController < Api::TccsController
  # Herda todos os métodos de Api::TccsController
  # Mantido para compatibilidade com rotas existentes
end

# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  include ActionController::Cookies
  
  before_action :authenticate_user!
  before_action :set_current_user_id

  private

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    
    if token
      begin
        payload = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
        
        # Verificar se token não está na denylist
        if JwtDenylist.exists?(jti: payload['jti'])
          render json: { error: 'Token inválido' }, status: :unauthorized
          return
        end
        
        @current_user = User.find(payload['user_id'])
        @current_jti = payload['jti']
        @current_payload = payload
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { error: 'Token inválido' }, status: :unauthorized
      end
    else
      render json: { error: 'Token não fornecido' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def current_jti
    @current_jti
  end

  def current_payload
    @current_payload
  end

  def set_current_user_id
    if current_user
      # Para RLS (Row Level Security)
      ActiveRecord::Base.connection.execute(
        "SET app.current_user_id = '#{current_user.id}'"
      )
    end
  end
end

# app/controllers/health_controller.rb
class HealthController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    render json: {
      status: 'ok',
      timestamp: Time.current,
      database: database_status,
      version: Rails.application.config.version || '1.0.0'
    }
  end

  private

  def database_status
    ActiveRecord::Base.connection.execute('SELECT 1')
    'connected'
  rescue
    'disconnected'
  end
end
