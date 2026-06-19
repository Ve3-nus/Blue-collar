# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_19_100354) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "availabilities", force: :cascade do |t|
    t.boolean "available"
    t.datetime "created_at", null: false
    t.date "date"
    t.time "end_time"
    t.time "start_time"
    t.datetime "updated_at", null: false
    t.bigint "worker_profile_id", null: false
    t.index ["worker_profile_id"], name: "index_availabilities_on_worker_profile_id"
  end

  create_table "skills", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "password_digest"
    t.string "phone"
    t.string "role", default: "customer"
    t.string "status", default: "active"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "worker_profiles", force: :cascade do |t|
    t.decimal "average_rating", precision: 3, scale: 2
    t.text "bio"
    t.datetime "created_at", null: false
    t.integer "experience_years"
    t.decimal "hourly_rate", precision: 10, scale: 2
    t.string "location"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.boolean "verified", default: false
    t.index ["user_id"], name: "index_worker_profiles_on_user_id"
  end

  create_table "worker_skills", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "skill_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "worker_profile_id", null: false
    t.index ["skill_id"], name: "index_worker_skills_on_skill_id"
    t.index ["worker_profile_id"], name: "index_worker_skills_on_worker_profile_id"
  end

  add_foreign_key "availabilities", "worker_profiles"
  add_foreign_key "worker_profiles", "users"
  add_foreign_key "worker_skills", "skills"
  add_foreign_key "worker_skills", "worker_profiles"
end
