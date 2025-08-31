class Auth::SessionsController < ApplicationController
  respond_to :json

  def create
    user = User.find_for_database_authentication(email: params[:email])
    return render json: { error: "invalid_credentials" }, status: :unauthorized unless user&.valid_password?(params[:password])

    sign_in(user) # devise-jwt adds token to env
    token = request.env['warden-jwt_auth.token']
    render json: { user: { id: user.id, name: user.name, email: user.email }, token: token }
  end

  def destroy
    sign_out(current_user) if current_user
    head :no_content
  end
end