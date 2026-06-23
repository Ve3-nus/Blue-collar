class Api::V1::MessagesController < ApplicationController
  before_action :authorize_request

  def index
    messages = Message.where(job_id: params[:job_id])

    render json: messages
  end

  def create
    message = Message.create!(
      job_id: params[:job_id],
      sender_id: current_user.id,
      receiver_id: params[:receiver_id],
      content: params[:content]
    )

    render json: message, status: :created
  end
  def chat_history
  messages = Message.where(job_id: params[:job_id])
                     .order(created_at: :asc)

  render json: messages
end
end