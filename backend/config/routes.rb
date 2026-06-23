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
patch '/worker_profiles/upload_photo',
      to: 'worker_profiles#upload_photo'

patch '/worker_profiles/upload_certification',
      to: 'worker_profiles#upload_certification'
patch '/jobs/:id/upload_images',
      to: 'jobs#upload_images'
get '/jobs/:id/messages',
    to: 'messages#index'
get '/analytics',
    to: 'analytics#overview'
get '/analytics/top_skills',
    to: 'analytics#top_skills'
get '/analytics/top_workers',
    to: 'analytics#top_workers'
get '/analytics/completion_rate',
    to: 'analytics#completion_rate'


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
          resources :messages, 
          only: 
          [:index, 
          :create]
          
    end
  end
end