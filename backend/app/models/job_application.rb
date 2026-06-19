class JobApplication < ApplicationRecord
  belongs_to :job

  belongs_to :worker_profile

  validates :status,
            presence: true
end