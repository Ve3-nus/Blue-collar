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
def my_profile
  profile = current_user.worker_profile ||
            current_user.create_worker_profile(
              bio: "", location: "Nairobi", experience_years: 0, hourly_rate: 0
            )

  render json: {
    id: profile.id,
    bio: profile.bio,
    location: profile.location,
    experience_years: profile.experience_years,
    hourly_rate: profile.hourly_rate,
    average_rating: profile.average_rating,   # add this
    reviews_count: profile.reviews.count,     # add this
    photo_url: profile.profile_photo.attached? ?
      url_for(profile.profile_photo) : nil
  }
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
  def upload_photo
    profile = current_user.worker_profile

    unless profile
      return render json: { error: "Worker profile not found. Please complete your profile first." },
                    status: :unprocessable_entity
    end

    profile.profile_photo.attach(
      params[:photo]
    )

    render json: {
      message: "Photo uploaded"
    }
  end
def upload_certification
  profile = current_user.worker_profile

  unless profile
    return render json: { error: "Worker profile not found. Please complete your profile first." },
                  status: :unprocessable_entity
  end

  profile.certifications.attach(
    params[:file]
  )

  render json: {
    message: "Certification uploaded"
  }
end

def show
  worker = WorkerProfile.find(params[:id])

  render json: {
    worker: worker,
    skills: worker.skills,
    reviews: worker.reviews,
    rating: worker.average_rating,
    profile_photo:
      worker.profile_photo.attached? ?
      url_for(worker.profile_photo) :
      nil
  }
end

  def update
    profile = current_user.worker_profile

    unless profile
      return render json: { error: "Worker profile not found. Please complete your profile first." },
                    status: :unprocessable_entity
    end

    if profile.update(worker_profile_params)
      render json: profile
    else
      render json: {
        errors: profile.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # Self-service update — scoped entirely to current_user, no :id needed in the URL.
  # Prevents the "PUT /worker_profiles/null" bug caused by stale/missing profile.id
  # on the frontend.
  def update_my_profile
    profile = current_user.worker_profile

    unless profile
      return render json: { error: "Worker profile not found. Please complete your profile first." },
                    status: :unprocessable_entity
    end

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