class Api::V1::JobApplicationsController < ApplicationController
  before_action :authorize_request

  def create
    application = JobApplication.new(
      job_id: params[:job_id],
      worker_profile_id: current_user.worker_profile.id,
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
    applications = current_user
                     .worker_profile
                     .job_applications

    render json: applications
  end

  def update
    application = JobApplication.find(params[:id])

    if application.update(status: params[:status])
      if params[:status] == "accepted"
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