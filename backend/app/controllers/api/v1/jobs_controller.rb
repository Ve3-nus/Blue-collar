class Api::V1::JobsController < ApplicationController
  before_action :authorize_request

  def index
    jobs = Job.all

    render json: jobs
  end
    def show
    job = Job.find(params[:id])

    accepted = job.job_applications.find_by(status: "accepted")

    render json: job.as_json.merge(
      accepted_worker_profile_id: accepted&.worker_profile_id
    )
  end
def applicants
  job = Job.find(params[:id])

  applications = job.job_applications.includes(
    worker_profile: :user
  )

  render json: applications.as_json(
    include: {
      worker_profile: {
        only: [:id, :bio, :location, :experience_years, :hourly_rate, :verified],
        include: {
          user: { only: [:id, :first_name, :last_name, :email] }
        }
      }
    }
  )
end
def my_jobs
  jobs = current_user.jobs

  render json: jobs
end
def matches
  job = Job.find(params[:id])

  workers = WorkerMatcher.match(job)

  render json: workers
end
def upload_images
  job = Job.find(params[:id])

  job.images.attach(
    params[:images]
  )

  render json: {
    message: "Images uploaded"
  }
end
  def update_status
    job = Job.find(params[:id])

    allowed_statuses = if current_user.role == "admin"
      %w[open in_progress completed cancelled closed]
    elsif current_user.role == "worker"
      %w[in_progress completed]
    elsif current_user.role == "customer"
      # Customer can only update their own jobs
      unless job.customer_id == current_user.id
        return render json: { error: "You can only update your own jobs" },
                      status: :forbidden
      end
      %w[in_progress completed cancelled]
    else
      []
    end

    unless allowed_statuses.include?(params[:status])
      return render json: { error: "Not permitted to set this status" },
                    status: :forbidden
    end

    if job.update(status: params[:status])
      # Notify the worker when customer marks job complete
      if params[:status] == "completed"
        accepted_app = job.job_applications.find_by(status: "accepted")
        if accepted_app
          NotificationService.create(
            accepted_app.worker_profile.user,
            "The customer has marked '#{job.title}' as completed"
          )
        end
      end

      render json: job.as_json.merge(
        accepted_worker_profile_id: job.job_applications.find_by(status: "accepted")&.worker_profile_id
      )
    else
      render json: { errors: job.errors.full_messages },
             status: :unprocessable_entity
    end
  end


  def create
    job = current_user.jobs.build(
      job_params.merge(status: "open"
      )
    )

    if job.save
      render json: job,
             status: :created
    else
      render json: {
        errors: job.errors.full_messages
      }
    end
  end

  private

  def job_params
    params.permit(
      :title,
      :description,
      :location,
      :skill_required,
      :budget
    )
  end
end