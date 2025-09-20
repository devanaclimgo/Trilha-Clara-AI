# =====================================================
# MIGRAÇÕES DO RAILS - TCC EFFORTLESS
# =====================================================

# db/migrate/001_create_users.rb
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users, id: :uuid do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest
      t.string :nome, null: false
      t.string :instituicao
      t.string :curso
      t.string :telefone
      t.text :avatar_url
      t.boolean :is_active, default: true
      t.boolean :email_verified, default: false
      t.timestamp :last_login

      t.timestamps
    end
  end
end

# db/migrate/002_create_jwt_denylists.rb
class CreateJwtDenylists < ActiveRecord::Migration[7.0]
  def change
    create_table :jwt_denylists, id: :uuid do |t|
      t.string :jti, null: false, index: { unique: true }
      t.timestamp :expires_at, null: false

      t.timestamps
    end
  end
end

# db/migrate/003_create_tccs.rb
class CreateTccs < ActiveRecord::Migration[7.0]
  def change
    create_table :tccs, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :titulo, null: false, limit: 500
      t.string :tema, limit: 500
      t.string :area_conhecimento, limit: 100
      t.string :tipo_trabalho, default: 'TCC', limit: 50
      t.string :status, default: 'draft', limit: 20
      t.date :prazo_entrega
      t.string :orientador_nome, limit: 255
      t.string :orientador_email, limit: 255
      t.string :instituicao, limit: 255
      t.string :curso, limit: 255

      t.timestamps
    end

    add_index :tccs, :user_id
    add_index :tccs, :status
    add_index :tccs, :created_at
    add_index :tccs, [:user_id, :status]
    add_index :tccs, [:user_id, :created_at], order: { created_at: :desc }

    add_check_constraint :tccs, "status IN ('draft', 'in_progress', 'completed', 'archived')", name: 'valid_status'
  end
end

# db/migrate/004_create_tcc_content.rb
class CreateTccContent < ActiveRecord::Migration[7.0]
  def change
    create_table :tcc_content, id: :uuid do |t|
      t.references :tcc, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.text :resumo
      t.text :introducao
      t.text :objetivos
      t.text :justificativa
      t.text :metodologia
      t.text :desenvolvimento
      t.text :conclusao
      t.text :referencias

      t.timestamps
    end
  end
end

# db/migrate/005_create_tcc_custom_sections.rb
class CreateTccCustomSections < ActiveRecord::Migration[7.0]
  def change
    create_table :tcc_custom_sections, id: :uuid do |t|
      t.references :tcc, null: false, foreign_key: true, type: :uuid
      t.string :section_key, null: false, limit: 100
      t.string :title, null: false, limit: 255
      t.text :description
      t.text :content
      t.integer :order_index, null: false

      t.timestamps
    end

    add_index :tcc_custom_sections, [:tcc_id, :section_key], unique: true
    add_index :tcc_custom_sections, [:tcc_id, :order_index]
  end
end

# db/migrate/006_create_tcc_section_labels.rb
class CreateTccSectionLabels < ActiveRecord::Migration[7.0]
  def change
    create_table :tcc_section_labels, id: :uuid do |t|
      t.references :tcc, null: false, foreign_key: true, type: :uuid
      t.string :section_id, null: false, limit: 100
      t.string :label, null: false, limit: 255

      t.timestamps
    end

    add_index :tcc_section_labels, [:tcc_id, :section_id], unique: true
  end
end

# db/migrate/007_create_tcc_field_order.rb
class CreateTccFieldOrder < ActiveRecord::Migration[7.0]
  def change
    create_table :tcc_field_order, id: :uuid do |t|
      t.references :tcc, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.jsonb :field_order, null: false

      t.timestamps
    end

    add_index :tcc_field_order, :field_order, using: :gin
  end
end

# db/migrate/008_create_tcc_ai_explanations.rb
class CreateTccAiExplanations < ActiveRecord::Migration[7.0]
  def change
    create_table :tcc_ai_explanations, id: :uuid do |t|
      t.references :tcc, null: false, foreign_key: true, type: :uuid
      t.string :explanation_type, null: false, limit: 50
      t.text :content, null: false

      t.timestamps
    end

    add_index :tcc_ai_explanations, [:tcc_id, :explanation_type], unique: true
  end
end

# db/migrate/009_create_tcc_ai_structures.rb
class CreateTccAiStructures < ActiveRecord::Migration[7.0]
  def change
    create_table :tcc_ai_structures, id: :uuid do |t|
      t.references :tcc, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.jsonb :structure_data, null: false

      t.timestamps
    end

    add_index :tcc_ai_structures, :structure_data, using: :gin
  end
end

# db/migrate/010_create_tcc_ai_timelines.rb
class CreateTccAiTimelines < ActiveRecord::Migration[7.0]
  def change
    create_table :tcc_ai_timelines, id: :uuid do |t|
      t.references :tcc, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.jsonb :timeline_data, null: false
      t.integer :total_weeks

      t.timestamps
    end

    add_index :tcc_ai_timelines, :timeline_data, using: :gin
  end
end

# db/migrate/011_create_tcc_notes.rb
class CreateTccNotes < ActiveRecord::Migration[7.0]
  def change
    create_table :tcc_notes, id: :uuid do |t|
      t.references :tcc, null: false, foreign_key: true, type: :uuid
      t.string :note_type, default: 'general', limit: 50
      t.string :title, limit: 255
      t.text :content, null: false
      t.boolean :is_important, default: false
      t.date :due_date

      t.timestamps
    end

    add_index :tcc_notes, :tcc_id
    add_index :tcc_notes, :note_type
    add_index :tcc_notes, :is_important
    add_index :tcc_notes, [:tcc_id, :is_important]
  end
end

# db/migrate/012_create_tcc_content_history.rb
class CreateTccContentHistory < ActiveRecord::Migration[7.0]
  def change
    create_table :tcc_content_history, id: :uuid do |t|
      t.references :tcc, null: false, foreign_key: true, type: :uuid
      t.jsonb :content_snapshot, null: false
      t.string :change_type, null: false, limit: 50
      t.text :change_description

      t.timestamps
    end

    add_index :tcc_content_history, :tcc_id
    add_index :tcc_content_history, :created_at
    add_index :tcc_content_history, [:tcc_id, :created_at], order: { created_at: :desc }
    add_index :tcc_content_history, :content_snapshot, using: :gin
  end
end

# db/migrate/013_create_user_preferences.rb
class CreateUserPreferences < ActiveRecord::Migration[7.0]
  def change
    create_table :user_preferences, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.jsonb :preferences, null: false, default: '{}'

      t.timestamps
    end

    add_index :user_preferences, :preferences, using: :gin
  end
end

# db/migrate/014_create_tcc_settings.rb
class CreateTccSettings < ActiveRecord::Migration[7.0]
  def change
    create_table :tcc_settings, id: :uuid do |t|
      t.references :tcc, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.jsonb :settings, null: false, default: '{}'

      t.timestamps
    end

    add_index :tcc_settings, :settings, using: :gin
  end
end

# db/migrate/015_add_updated_at_triggers.rb
class AddUpdatedAtTriggers < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    SQL

    # Aplicar triggers em todas as tabelas com updated_at
    tables_with_updated_at = [
      'users', 'tccs', 'tcc_content', 'tcc_custom_sections', 
      'tcc_section_labels', 'tcc_field_order', 'tcc_ai_structures', 
      'tcc_ai_timelines', 'tcc_notes', 'user_preferences', 'tcc_settings'
    ]

    tables_with_updated_at.each do |table|
      execute <<-SQL
        CREATE TRIGGER update_#{table}_updated_at 
        BEFORE UPDATE ON #{table} 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      SQL
    end
  end

  def down
    execute "DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;"
  end
end

# db/migrate/016_create_views.rb
class CreateViews < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      CREATE VIEW tcc_complete_data AS
      SELECT 
          t.id,
          t.user_id,
          t.titulo,
          t.tema,
          t.area_conhecimento,
          t.tipo_trabalho,
          t.status,
          t.prazo_entrega,
          t.orientador_nome,
          t.orientador_email,
          t.instituicao,
          t.curso,
          t.created_at,
          t.updated_at,
          u.nome as user_nome,
          u.email as user_email,
          u.instituicao as user_instituicao,
          u.curso as user_curso
      FROM tccs t
      JOIN users u ON t.user_id = u.id;
    SQL

    execute <<-SQL
      CREATE VIEW user_stats AS
      SELECT 
          u.id as user_id,
          u.nome,
          u.email,
          COUNT(t.id) as total_tccs,
          COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tccs,
          COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress_tccs,
          COUNT(CASE WHEN t.status = 'draft' THEN 1 END) as draft_tccs,
          MAX(t.created_at) as last_tcc_created
      FROM users u
      LEFT JOIN tccs t ON u.id = t.user_id
      GROUP BY u.id, u.nome, u.email;
    SQL
  end

  def down
    execute "DROP VIEW IF EXISTS user_stats;"
    execute "DROP VIEW IF EXISTS tcc_complete_data;"
  end
end

# db/migrate/017_enable_rls.rb
class EnableRls < ActiveRecord::Migration[7.0]
  def up
    # Habilitar RLS nas tabelas principais
    rls_tables = [
      'tccs', 'tcc_content', 'tcc_custom_sections', 'tcc_section_labels',
      'tcc_field_order', 'tcc_ai_explanations', 'tcc_ai_structures',
      'tcc_ai_timelines', 'tcc_notes', 'tcc_content_history', 'tcc_settings'
    ]

    rls_tables.each do |table|
      execute "ALTER TABLE #{table} ENABLE ROW LEVEL SECURITY;"
    end

    # Criar políticas de segurança
    execute <<-SQL
      CREATE POLICY tcc_user_policy ON tccs
          FOR ALL TO authenticated
          USING (user_id = current_setting('app.current_user_id')::uuid);
    SQL

    execute <<-SQL
      CREATE POLICY tcc_content_policy ON tcc_content
          FOR ALL TO authenticated
          USING (tcc_id IN (
              SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
          ));
    SQL

    # Adicionar mais políticas conforme necessário...
  end

  def down
    execute "DROP POLICY IF EXISTS tcc_user_policy ON tccs;"
    execute "DROP POLICY IF EXISTS tcc_content_policy ON tcc_content;"
    # Remover outras políticas...
  end
end
