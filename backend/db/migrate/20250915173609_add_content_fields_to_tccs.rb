class AddContentFieldsToTccs < ActiveRecord::Migration[8.0]
  def change
    add_column :tccs, :resumo, :text
    add_column :tccs, :introducao, :text
    add_column :tccs, :objetivos, :text
    add_column :tccs, :justificativa, :text
    add_column :tccs, :metodologia, :text
    add_column :tccs, :desenvolvimento, :text
    add_column :tccs, :conclusao, :text
    add_column :tccs, :referencias, :text
  end
end
