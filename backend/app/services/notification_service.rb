class NotificationService
  def self.create(user, message)
    Notification.create(
      user: user,
      message: message,
      read: false
    )
  end
end