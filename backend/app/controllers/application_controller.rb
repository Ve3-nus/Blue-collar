class ApplicationController < ActionController::API

  def current_user

    header = request.headers['Authorization']

    token = header.split(' ').last if header

    decoded = JsonWebToken.decode(token)

    return nil unless decoded

    @current_user ||= User.find_by(
      id: decoded[:user_id]
    )
  end

  def authorize_request

    render json: {
      error: "Unauthorized"
    }, status: :unauthorized unless current_user

  end

end