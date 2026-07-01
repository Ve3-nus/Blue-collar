class Api::V1::ReviewsController < ApplicationController
  before_action :authorize_request

  def index
    render json: Review.all
  end

  def show
    review = Review.find(params[:id])

    render json: review
  end

  def for_job
    review = Review.find_by(
      job_id: params[:id],
      customer_id: current_user.id
    )
    if review
      render json: review
    else
      render json: nil
    end
  end

  def create
    # Prevent workers/admins from submitting reviews
    unless current_user.role == "customer"
      return render json: { error: "Only customers can leave reviews" },
                    status: :forbidden
    end

    job = Job.find_by(id: params[:job_id])

    unless job
      return render json: { error: "Job not found" }, status: :not_found
    end

    # Only the customer who posted the job can review it
    unless job.customer_id == current_user.id
      return render json: { error: "You can only review workers on your own jobs" },
                    status: :forbidden
    end

    unless job.status == "completed"
      return render json: { error: "Job must be completed before leaving a review" },
                    status: :unprocessable_entity
    end

    # Prevent duplicate reviews
    if Review.exists?(job_id: job.id, customer_id: current_user.id)
      return render json: { error: "You have already reviewed this job" },
                    status: :unprocessable_entity
    end

    review = Review.new(
      review_params.merge(customer_id: current_user.id)
    )

    if review.save
      NotificationService.create(
        review.worker_profile.user,
        "You received a new #{review.rating}★ review"
      )

      render json: review, status: :created
    else
      render json: {
        errors: review.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def review_params
    params.permit(
      :job_id,
      :worker_profile_id,
      :rating,
      :comment
    )
  end
end