class Auth::SessionsController < ApplicationController
  respond_to :json

  def create
    user = User.find_for_database_authentication(email: params[:user][:email])

    if user && user.valid_password?(params[:user][:password])
      sign_in(user)
      token = request.env['warden-jwt_auth.token']
      render json: { 
        user: { id: user.id, name: user.name, email: user.email },
        token: token
      }, status: :ok
    else
      render json: { error: 'Invalid Email or Password' }, status: :unauthorized
    end
  end

  def destroy
    sign_out(current_user)
    render json: { message: 'Logged out successfully' }, status: :ok
  end
end