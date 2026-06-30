class Api::V1::AuthController < ApplicationController

  before_action :authorize_request, only: [:me]
def register
  user = User.new(user_params)
  user.role = "customer" unless %w[customer worker].include?(user.role)  # ← add this line

  if user.save
    if user.role == "worker"
      profile = user.build_worker_profile(
        bio: "", location: user_params[:location].presence || "Nairobi",
        experience_years: 0, hourly_rate: 0
      )
      profile.save  # logged below if it ever fails, instead of silently dropping
      Rails.logger.error("Worker profile failed to save for user #{user.id}: #{profile.errors.full_messages}") unless profile.persisted?
    end

    token = JsonWebToken.encode(user_id: user.id)
    render json: { token: token, user: user }, status: :created
  else
    render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
  end
end

  def login
    user = User.find_by(email: params[:email])

    if user && user.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)

      render json: {
        token: token,
        user: user
      }
    else
      render json: {
        error: "Invalid credentials"
      }, status: :unauthorized
    end
  end

  def me
    render json: current_user
  end

  private

  def user_params
    params.permit(
      :first_name,
      :last_name,
      :email,
      :phone,
      :password,
      :password_confirmation,
      :role
    )
  end
end