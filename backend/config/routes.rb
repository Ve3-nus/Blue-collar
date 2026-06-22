Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do

      post '/register', to: 'auth#register'
      post '/login',    to: 'auth#login'
      get  '/me',       to: 'auth#me'

      # Customer Dashboard
      get '/my_jobs',
          to: 'jobs#my_jobs'
          get '/my_applications',
          to: 'job_applications#my_applications'

      # View applicants for a job
      get '/jobs/:id/applicants',
          to: 'jobs#applicants'

      get '/worker_profiles/:id/rating',
          to: 'worker_profiles#rating'

      get '/jobs/:id/matches',
    to: 'jobs#matches'
    get '/admin/users',
    to: 'admin#users'

get '/admin/jobs',
    to: 'admin#jobs'

get '/admin/applications',
    to: 'admin#applications'

get '/admin/reviews',
    to: 'admin#reviews'
patch '/admin/users/:id/suspend',
      to: 'admin#suspend_user'
patch '/admin/users/:id/activate',
      to: 'admin#activate_user'  
get '/admin/stats',
    to: 'admin#stats'

      resources :worker_profiles,
                only: [
                  :index,
                  :create,
                  :show,
                  :update
                ]

      resources :jobs,
                only: [
                  :index,
                  :create,
                  :show
                ]

      resources :worker_skills,
                only: [
                  :index,
                  :create,
                  :destroy
                ]

      resources :job_applications,
                only: [
                  :create,
                  :index,
                  :update
                ]

      resources :notifications,
                only: [
                  :index,
                  :update
                ]
resources :reviews,
          only: [
            :create,
            :index,
            :show
          ]
          
    end
  end
end