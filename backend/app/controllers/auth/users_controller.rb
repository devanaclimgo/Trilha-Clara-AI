class Auth::UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    render json: { id: current_user.id, name: current_user.name, email: current_user.email }
  end
end