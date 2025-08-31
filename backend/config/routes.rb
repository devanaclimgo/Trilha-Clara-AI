Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }, skip: [:sessions, :registrations, :passwords]

  scope :auth, defaults: { format: :json } do
    post   "signup", to: "auth/registrations#create"
    post   "login",  to: "auth/sessions#create"
    delete "logout", to: "auth/sessions#destroy"
    get    "me",     to: "auth/users#me"
  end
end