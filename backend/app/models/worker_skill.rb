class WorkerSkill < ApplicationRecord
  belongs_to :worker_profile
  belongs_to :skill

  validates :skill_id,
            uniqueness: {
              scope: :worker_profile_id
            }
end