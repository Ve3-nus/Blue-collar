class Job < ApplicationRecord
  belongs_to :customer,
             class_name: 'User'

  has_many :job_applications,
           dependent: :destroy
  has_many_attached :images
  
  has_one :review,
        dependent: :destroy

  validates :title,
            presence: true

  validates :description,
            presence: true

  validates :location,
            presence: true

  validates :skill_required,
            presence: true

  validates :status,
            presence: true
            validates :status,
          inclusion: {
            in: %w[
              open
              accepted
              in_progress
              completed
              cancelled
            ]
          }
end