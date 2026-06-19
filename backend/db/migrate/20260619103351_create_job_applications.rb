class CreateJobApplications < ActiveRecord::Migration[8.1]
  def change
    create_table :job_applications do |t|
      t.references :job,
                   null: false,
                   foreign_key: true

      t.references :worker_profile,
                   null: false,
                   foreign_key: true

      t.string :status

      t.timestamps
    end
  end
end