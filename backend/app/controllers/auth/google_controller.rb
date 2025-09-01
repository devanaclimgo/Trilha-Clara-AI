class Auth::GoogleController < ApplicationController
  respond_to :json

  def create
    email = params[:email]
    name = params[:name]
    google_id = params[:google_id]
    
    Rails.logger.info "Google auth attempt for email: #{email}, name: #{name}"
    
    return render json: { error: 'Email é obrigatório' }, status: :bad_request if email.blank?
    return render json: { error: 'Nome é obrigatório' }, status: :bad_request if name.blank?
    
    begin
      # Find or create user
      user = User.find_or_create_by(email: email) do |u|
        u.name = name
        u.password = SecureRandom.hex(16) # Generate random password for Google users
        u.password_confirmation = u.password
      end
      
      Rails.logger.info "User found/created: #{user.persisted?}, ID: #{user.id}"
      
      if user.persisted?
        begin
          # Use the same approach as the working login endpoint
          sign_in(user)
          Rails.logger.info "User signed in successfully"
          
          # Get the JWT token from the request environment
          token = request.env['warden-jwt_auth.token']
          Rails.logger.info "JWT token from warden: #{token.present? ? 'YES' : 'NO'}"
          
          if token.present?
            render json: { 
              user: { id: user.id, name: user.name, email: user.email },
              token: token 
            }, status: :ok
          else
            Rails.logger.error "JWT token is nil or empty, generating manually"
            # Manually generate JWT token using the same approach as Devise JWT
            begin
              require 'jwt'
              payload = {
                sub: user.id,
                scp: 'user',
                aud: nil,
                iat: Time.current.to_i,
                exp: 1.day.from_now.to_i,
                jti: SecureRandom.uuid
              }
              token = JWT.encode(payload, ENV['DEVISE_JWT_SECRET_KEY'], 'HS256')
              Rails.logger.info "Manual JWT token generated successfully"
              
              render json: { 
                user: { id: user.id, name: user.name, email: user.email },
                token: token 
              }, status: :ok
            rescue => e
              Rails.logger.error "Error generating manual JWT: #{e.message}"
              render json: { error: 'Erro ao gerar token de autenticação' }, status: :internal_server_error
            end
          end
        rescue => e
          Rails.logger.error "Error during sign_in or token generation: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: 'Erro durante autenticação' }, status: :internal_server_error
        end
      else
        error_messages = user.errors.full_messages.join(', ')
        Rails.logger.error "User creation failed: #{error_messages}"
        render json: { error: "Erro ao criar usuário: #{error_messages}" }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotUnique => e
      Rails.logger.error "Record not unique error: #{e.message}"
      render json: { error: 'Usuário já existe com este email' }, status: :conflict
    rescue => e
      Rails.logger.error "Google auth error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Erro interno do servidor' }, status: :internal_server_error
    end
  end
end