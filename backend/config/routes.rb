Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do

      post '/register',
           to: 'auth#register'

      post '/login',
           to: 'auth#login'

      get '/me',
          to: 'auth#me'

      resources :worker_profiles,
          only: [
            :index,
            :create,
            :show,
            :update
          ]

    end
  end
end