class CreateTccs < ActiveRecord::Migration[8.0]
  def change
    create_table :tccs do |t|
      t.string :nome
      t.string :faculdade
      t.string :curso
      t.string :materia
      t.string :tema
      t.string :tipo_trabalho
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
