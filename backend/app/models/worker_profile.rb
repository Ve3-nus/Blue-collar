class WorkerProfile < ApplicationRecord
  belongs_to :user

  has_many :worker_skills,
           dependent: :destroy

  has_many :skills,
           through: :worker_skills
  
  has_many :job_applications,
         dependent: :destroy

  has_many :availabilities,
           dependent: :destroy

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
end