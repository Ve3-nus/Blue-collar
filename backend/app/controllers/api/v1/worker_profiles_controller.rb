class Api::V1::WorkerProfilesController < ApplicationController
  before_action :authorize_request

 def index
  workers = WorkerProfile.includes(:skills)

  if params[:skill].present?
    workers = workers.joins(:skills)
                     .where(skills: {
                       name: params[:skill]
                     })
  end

  render json: workers
end
  def create
    profile = current_user.create_worker_profile(
      worker_profile_params
    )

    if profile.save
      render json: profile, status: :created
    else
      render json: {
        errors: profile.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

 def show
  worker = WorkerProfile.find(params[:id])

  render json: {
    worker: worker,
    skills: worker.skills,
    reviews: worker.reviews,
    rating: worker.average_rating
  }
end

  def update
    profile = current_user.worker_profile

    if profile.update(worker_profile_params)
      render json: profile
    else
      render json: {
        errors: profile.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def rating
    worker = WorkerProfile.find(params[:id])

    render json: {
      average_rating: worker.average_rating,
      reviews_count: worker.reviews.count
    }
  end

  private

  def worker_profile_params
    params.permit(
      :bio,
      :location,
      :experience_years,
      :hourly_rate
    )
  end
end