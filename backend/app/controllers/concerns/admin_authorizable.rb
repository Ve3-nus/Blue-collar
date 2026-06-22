module AdminAuthorizable
  extend ActiveSupport::Concern

  included do
    before_action :authorize_admin
  end

  private

  def authorize_admin
    unless current_user&.role == "admin"
      render json: {
        error: "Admin access required"
      }, status: :forbidden
    end
  end
end