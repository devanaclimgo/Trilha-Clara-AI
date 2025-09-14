Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }, skip: [:sessions, :registrations, :passwords]

  scope :auth, defaults: { format: :json } do
    post   "signup", to: "auth/registrations#create"
    post   "login",  to: "auth/sessions#create"
    delete "logout", to: "auth/sessions#destroy"
    get    "me",     to: "auth/users#me"
    post "google", to: "auth/google#create"
    get '/auth/:provider/callback', to: 'auth/sessions#google'
  end

  namespace :api, defaults: { format: :json } do
    # TCC routes - nova versão com model
    resources :tcc, only: [:create, :show] do
      member do
        get :export_word
        get :export_pdf
      end
    end
    
    # Compatibilidade com versão antiga
    post "tcc/criar", to: "tcc#criar"
    
    # Profile routes
    get "profile", to: "profile#show"
    put "profile", to: "profile#update"
    patch "profile", to: "profile#update"
    put "profile/password", to: "profile#update_password"
    patch "profile/password", to: "profile#update_password"
    delete "profile", to: "profile#destroy"
  end
end