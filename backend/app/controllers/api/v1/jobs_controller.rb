class Api::V1::JobsController < ApplicationController
  before_action :authorize_request

  def index
    jobs = Job.all

    render json: jobs
  end
    def show
    jobs = Job.find(params[:id])

    render json: jobs
  end
def applicants
  job = Job.find(params[:id])

  render json: job.job_applications.includes(
    :worker_profile
  )
end
def my_jobs
  jobs = current_user.jobs

  render json: jobs
end

  def create
    job = current_user.jobs.build(
      job_params.merge(
        status: "open"
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