class Api::V1::AdminController < ApplicationController
  include AdminAuthorizable

  def users
    render json: User.all
  end
def stats
  render json: {
    users: User.count,
    workers: User.where(role: "worker").count,
    customers: User.where(role: "customer").count,
    jobs: Job.count,
    applications: JobApplication.count,
    reviews: Review.count
  }
end
  def jobs
    render json: Job.all
  end

  def applications
    render json: JobApplication.all
  end
def activate_user
  user = User.find(params[:id])

  user.update(
    status: "active"
  )

  render json: user
end
  def reviews
    render json: Review.all
  end
  def suspend_user
  user = User.find(params[:id])

  user.update(
    status: "suspended"
  )

  render json: user
end
end