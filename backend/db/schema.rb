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

ActiveRecord::Schema[8.1].define(version: 2026_06_22_112253) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

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

  create_table "job_applications", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.string "status"
    t.datetime "updated_at", null: false
    t.bigint "worker_profile_id", null: false
    t.index ["job_id"], name: "index_job_applications_on_job_id"
    t.index ["worker_profile_id"], name: "index_job_applications_on_worker_profile_id"
  end

  create_table "jobs", force: :cascade do |t|
    t.decimal "budget", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.bigint "customer_id", null: false
    t.text "description"
    t.string "location"
    t.string "skill_required"
    t.string "status"
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_jobs_on_customer_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.integer "job_id"
    t.integer "receiver_id"
    t.integer "sender_id"
    t.datetime "updated_at", null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "message"
    t.boolean "read", default: false
    t.string "title"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.text "comment"
    t.datetime "created_at", null: false
    t.bigint "customer_id", null: false
    t.bigint "job_id", null: false
    t.integer "rating", null: false
    t.datetime "updated_at", null: false
    t.bigint "worker_profile_id", null: false
    t.index ["customer_id"], name: "index_reviews_on_customer_id"
    t.index ["job_id"], name: "index_reviews_on_job_id"
    t.index ["worker_profile_id"], name: "index_reviews_on_worker_profile_id"
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

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "availabilities", "worker_profiles"
  add_foreign_key "job_applications", "jobs"
  add_foreign_key "job_applications", "worker_profiles"
  add_foreign_key "jobs", "users", column: "customer_id"
  add_foreign_key "notifications", "users"
  add_foreign_key "reviews", "jobs"
  add_foreign_key "reviews", "users", column: "customer_id"
  add_foreign_key "reviews", "worker_profiles"
  add_foreign_key "worker_profiles", "users"
  add_foreign_key "worker_skills", "skills"
  add_foreign_key "worker_skills", "worker_profiles"
end
