class WorkerProfile < ApplicationRecord
  belongs_to :user

  has_many :worker_skills, dependent: :destroy
  has_one_attached :profile_photo
  has_many_attached :certifications

  has_many :skills, through: :worker_skills
  has_many :job_applications, dependent: :destroy
  # has_many :availabilities, dependent: :destroy  ← comment this out
  has_many :reviews, dependent: :destroy

  validates :location,
            presence: true

  validates :experience_years,
            numericality: {
              greater_than_or_equal_to: 0
            },
            allow_nil: true

  validates :hourly_rate,
            numericality: {
              greater_than_or_equal_to: 0
            },
            allow_nil: true
  def average_rating
    reviews.average(:rating)&.round(1) || 0
  end
end