class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_#{params[:job_id]}"
  end

  def unsubscribed
    # cleanup if needed
  end

  def speak(data)
    message = Message.create!(
      job_id: data["job_id"],
      sender_id: data["sender_id"],
      receiver_id: data["receiver_id"],
      content: data["content"]
    )

    ActionCable.server.broadcast(
      "chat_#{data['job_id']}",
      {
        message: message,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id
      }
    )
  end
end