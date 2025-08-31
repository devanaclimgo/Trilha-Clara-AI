class Auth::GoogleController < ApplicationController
  respond_to :json

  def create
    id_token = params[:id_token]
    return render json: { error: "missing_id_token" }, status: :bad_request if id_token.blank?

    validator = GoogleIDToken::Validator.new
    payload = validator.check(id_token, ENV["GOOGLE_CLIENT_ID"])

    email = payload["email"]
    name  = payload["name"] || email.split("@").first

    user = User.find_or_initialize_by(email: email)
    if user.new_record?
      user.name = name
      user.password = SecureRandom.hex(16)
      user.save!
    end

    sign_in(user)
    token = request.env['warden-jwt_auth.token']
    render json: { user: { id: user.id, name: user.name, email: user.email }, token: token }
  rescue GoogleIDToken::ValidationError => e
    render json: { error: "invalid_google_token", detail: e.message }, status: :unauthorized
  end
end