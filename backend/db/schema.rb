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

ActiveRecord::Schema[8.0].define(version: 2025_09_15_173609) do
  create_schema "auth"
  create_schema "extensions"
  create_schema "graphql"
  create_schema "graphql_public"
  create_schema "pgbouncer"
  create_schema "realtime"
  create_schema "storage"
  create_schema "vault"

  # These are extensions that must be enabled in order to support this database
  enable_extension "extensions.pg_stat_statements"
  enable_extension "extensions.pgcrypto"
  enable_extension "extensions.uuid-ossp"
  enable_extension "graphql.pg_graphql"
  enable_extension "pg_catalog.plpgsql"
  enable_extension "vault.supabase_vault"

  create_table "jwt_denylist", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "jti", limit: 255, null: false
    t.timestamptz "expires_at", null: false
    t.timestamptz "created_at", default: -> { "now()" }

    t.unique_constraint ["jti"], name: "jwt_denylist_jti_key"
  end

  create_table "jwt_denylists", force: :cascade do |t|
    t.string "jti"
    t.datetime "exp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_denylists_on_jti"
  end

  create_table "tccs", comment: "Tabela principal de trabalhos acadêmicos", force: :cascade do |t|
    t.string "nome"
    t.string "faculdade"
    t.string "curso"
    t.string "materia"
    t.string "tema"
    t.string "tipo_trabalho"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "resumo"
    t.text "introducao"
    t.text "objetivos"
    t.text "justificativa"
    t.text "metodologia"
    t.text "desenvolvimento"
    t.text "conclusao"
    t.text "referencias"
    t.index ["created_at"], name: "idx_tccs_created_at"
    t.index ["user_id", "created_at"], name: "idx_tccs_user_created", order: { created_at: :desc }
    t.index ["user_id"], name: "idx_tccs_user_id"
    t.index ["user_id"], name: "index_tccs_on_user_id"
  end

  create_table "users", comment: "Tabela de usuários (estudantes) do sistema", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "phone"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "tccs", "users"
end
