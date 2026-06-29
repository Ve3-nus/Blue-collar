class CreateJobs < ActiveRecord::Migration[8.1]
  def change
    create_table :jobs do |t|
      t.references :customer,
                   null: false,
                   foreign_key: { to_table: :users }

      t.string :title
      t.text :description
      t.string :jobs
      t.text :job_type
      t.string :location
      t.string :skills_required

      t.decimal :budget,
                precision: 10,
                scale: 2

      t.string :status

      t.timestamps
    end
  end
end