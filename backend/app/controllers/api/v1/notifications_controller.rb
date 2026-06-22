class Api::V1::NotificationsController < ApplicationController
  before_action :authorize_request

  def index
    notifications = current_user.notifications

    render json: notifications
  end

  def update
    notification = current_user.notifications.find(params[:id])

    if notification.update(read: true)
      render json: notification
    else
      render json: {
        errors: notification.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
end