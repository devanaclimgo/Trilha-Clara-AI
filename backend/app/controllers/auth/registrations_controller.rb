class Auth::RegistrationsController < ApplicationController
  respond_to :json

  def create
    user = User.new(user_params)
    if user.save
      sign_in(user)
      token = request.env['warden-jwt_auth.token']
      render json: { user: { id: user.id, name: user.name, email: user.email }, token: token }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end