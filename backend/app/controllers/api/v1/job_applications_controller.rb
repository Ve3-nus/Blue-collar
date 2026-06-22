class Api::V1::JobApplicationsController < ApplicationController
  before_action :authorize_request

  def create
    application = JobApplication.create(
      job_id: params[:job_id],
      worker_profile_id: current_user.worker_profile.id,
      status: "pending"
    )

    render json: application,
           status: :created
  end

  def index
    render json: JobApplication.all
  end

  def my_applications
    applications = current_user
                     .worker_profile
                     .job_applications

    render json: applications
  end

  def update
    application = JobApplication.find(params[:id])

    if application.update(status: params[:status])
      render json: application
    else
      render json: {
        errors: application.errors.full_messages
      }
    end
  end
end