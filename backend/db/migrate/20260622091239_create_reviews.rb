class CreateReviews < ActiveRecord::Migration[8.1]
  def change
    create_table :reviews do |t|
      t.references :job, null: false, foreign_key: true
      t.references :customer, null: false, foreign_key: { to_table: :users }
      t.references :worker_profile, null: false, foreign_key: true
      t.integer :rating, null: false
      t.text :comment

      t.timestamps
    end
  end
end