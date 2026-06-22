class Api::V1::AuthController < ApplicationController

  before_action :authorize_request, only: [:me]

  def register
    user = User.new(user_params)

    if user.save
      token = JsonWebToken.encode(user_id: user.id)

      render json: {
        token: token,
        user: user
      }, status: :created
    else
      render json: {
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])

  if user.status == "suspended"
    return render json: {
      error: "Account suspended"
    }, status: :forbidden
  end

      token = JsonWebToken.encode(
        user_id: user.id
      )

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