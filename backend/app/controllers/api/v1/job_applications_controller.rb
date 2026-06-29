class Api::V1::JobApplicationsController < ApplicationController
  before_action :authorize_request

  def create
    profile = current_user.worker_profile

    unless profile
      return render json: { error: "Worker profile not found. Please complete your profile first." },
                    status: :unprocessable_entity
    end

    application = JobApplication.new(
      job_id: params[:job_id],
      worker_profile_id: profile.id,
      status: "pending"
    )

    if application.save
      NotificationService.create(
        application.job.customer,
        "A worker has applied to your job"
      )

      render json: application, status: :created
    else
      render json: {
        errors: application.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def index
    render json: JobApplication.all
  end

  def my_applications
    profile = current_user.worker_profile

    # Return empty array instead of 500 when no profile exists yet
    unless profile
      return render json: []
    end

    applications = profile
                     .job_applications
                     .includes(:job)   # was .include — typo causing NoMethodError
                     .order(created_at: :desc)

    render json: applications.as_json(include: :job)
  end

 def update
  application = JobApplication.find(params[:id])

  if application.update(status: params[:status])
    if params[:status] == "accepted"
      application.job.update(status: "closed")  # ← add this

      NotificationService.create(
        application.worker_profile.user,
        "Your application was accepted"
      )
    end

    render json: application
  else
    render json: {
      errors: application.errors.full_messages
    }, status: :unprocessable_entity
  end
end
end
