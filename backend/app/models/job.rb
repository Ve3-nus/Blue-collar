class Job < ApplicationRecord
  belongs_to :customer,
             class_name: 'User'

  has_many :job_applications,
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
end