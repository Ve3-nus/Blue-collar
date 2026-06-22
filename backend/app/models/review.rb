class Review < ApplicationRecord
  belongs_to :job

  belongs_to :customer,
             class_name: 'User'
  has_many_attached :images

  belongs_to :worker_profile

  validates :rating,
            inclusion: { in: 1..5 }
              validates :comment,
            presence: true
end