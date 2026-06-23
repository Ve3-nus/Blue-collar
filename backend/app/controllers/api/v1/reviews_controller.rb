class Api::V1::ReviewsController < ApplicationController
  before_action :authorize_request

  def index
    render json: Review.all
  end

  def show
    review = Review.find(params[:id])

    render json: review
  end

  def create
    review = Review.new(review_params)

    if review.save
      NotificationService.create(
        review.worker_profile.user,
        "You received a new review"
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