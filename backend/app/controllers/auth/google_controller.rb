class Auth::GoogleController < ApplicationController
  respond_to :json

  def create
    email = params[:email]
    name = params[:name]
    google_id = params[:google_id]
    
    return render json: { error: 'Missing email' }, status: :bad_request if email.blank?
    
    begin
      # Find or create user
      user = User.find_or_create_by(email: email) do |u|
        u.name = name || email.split('@').first
        u.password = SecureRandom.hex(16) # Generate random password for Google users
        u.password_confirmation = u.password
      end
      
      if user.persisted?
        sign_in(user)
        token = request.env['warden-jwt_auth.token']
        render json: { 
          user: { id: user.id, name: user.name, email: user.email },
          token: token 
        }, status: :ok
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: 'Failed to create user' }, status: :unprocessable_entity
    end
  end
end