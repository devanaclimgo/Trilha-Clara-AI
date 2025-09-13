class Api::ProfileController < ApplicationController
  before_action :authenticate_user!
  respond_to :json

  def show
    render json: {
      id: current_user.id,
      name: current_user.name,
      email: current_user.email,
      phone: current_user.phone
    }
  end

  def update
    if current_user.update(profile_params)
      render json: {
        id: current_user.id,
        name: current_user.name,
        email: current_user.email,
        phone: current_user.phone
      }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update_password
    if current_user.update_with_password(password_params)
      render json: { message: 'Senha atualizada com sucesso' }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if current_user.destroy
      render json: { message: 'Conta deletada com sucesso' }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:user).permit(:name, :email, :phone)
  end

  def password_params
    params.require(:user).permit(:current_password, :password, :password_confirmation)
  end
end
