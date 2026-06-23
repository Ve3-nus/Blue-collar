class Api::V1::AnalyticsController < ApplicationController
  before_action :authorize_request

  def overview
    render json: {
      users: User.count,
      workers: User.where(role: "worker").count,
      customers: User.where(role: "customer").count,
      jobs: Job.count,
      applications: JobApplication.count,
      reviews: Review.count,
      average_rating:
        Review.average(:rating)&.round(2)
    }
  end
def top_skills
  skills =
    Job.group(:skill_required)
       .count
       .sort_by { |_, count| -count }

  render json: skills
end
def top_workers
  workers =
    WorkerProfile.all.sort_by(
      &:average_rating
    ).reverse.first(10)

  render json: workers.map { |worker|
    {
      id: worker.id,
      rating: worker.average_rating,
      location: worker.location
    }
  }
end
def completion_rate
  total = Job.count

  completed =
    Job.where(
      status: "completed"
    ).count

  rate =
    total.zero? ? 0 :
    ((completed.to_f / total) * 100).round(2)

  render json: {
    completion_rate: rate
  }
end
end