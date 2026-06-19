class Skill < ApplicationRecord
  has_many :worker_skills,
           dependent: :destroy

  has_many :worker_profiles,
           through: :worker_skills

  validates :name,
            presence: true,
            uniqueness: true
end