class CreateAvailabilities < ActiveRecord::Migration[8.1]
  def change
    create_table :availabilities do |t|
      t.references :worker_profile, null: false, foreign_key: true
      t.date :date
      t.time :start_time
      t.time :end_time
      t.boolean :available

      t.timestamps
    end
  end
end