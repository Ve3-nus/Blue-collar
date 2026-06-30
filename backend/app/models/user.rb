class User < ApplicationRecord
  has_secure_password

  has_one :worker_profile, dependent: :destroy
  has_many :jobs, foreign_key: :customer_id, dependent: :destroy   # keep only one
  has_many :notifications, dependent: :destroy
  # has_many :jobs, foreign_key: :customer_id, dependent: :destroy  ← remove this duplicate

  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, if: -> { password.present? }
  validates :role, inclusion: { in: %w[customer worker admin] }
end