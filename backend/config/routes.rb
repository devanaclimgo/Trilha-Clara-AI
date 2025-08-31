Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }, skip: [:sessions, :registrations, :passwords]

  scope :auth, defaults: { format: :json } do
    post   "signup", to: "registrations#create"
    post   "login",  to: "sessions#create"
    delete "logout", to: "sessions#destroy"
    get    "me",     to: "users#me"
  end
end