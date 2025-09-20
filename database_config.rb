# =====================================================
# CONFIGURAÇÃO DO BANCO DE DADOS - TCC EFFORTLESS
# =====================================================

# config/database.yml
# Configuração para PostgreSQL em produção

production:
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  database: <%= ENV['DATABASE_NAME'] || 'tcc_effortless_production' %>
  username: <%= ENV['DATABASE_USERNAME'] || 'tcc_effortless_user' %>
  password: <%= ENV['DATABASE_PASSWORD'] %>
  host: <%= ENV['DATABASE_HOST'] || 'localhost' %>
  port: <%= ENV['DATABASE_PORT'] || 5432 %>
  timeout: 5000
  sslmode: require

development:
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  database: tcc_effortless_development
  username: <%= ENV['DATABASE_USERNAME'] || 'postgres' %>
  password: <%= ENV['DATABASE_PASSWORD'] || 'password' %>
  host: <%= ENV['DATABASE_HOST'] || 'localhost' %>
  port: <%= ENV['DATABASE_PORT'] || 5432 %>

test:
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  database: tcc_effortless_test
  username: <%= ENV['DATABASE_USERNAME'] || 'postgres' %>
  password: <%= ENV['DATABASE_PASSWORD'] || 'password' %>
  host: <%= ENV['DATABASE_HOST'] || 'localhost' %>
  port: <%= ENV['DATABASE_PORT'] || 5432 %>

# =====================================================
# VARIÁVEIS DE AMBIENTE NECESSÁRIAS
# =====================================================

# .env.production
# DATABASE_NAME=tcc_effortless_production
# DATABASE_USERNAME=tcc_effortless_user
# DATABASE_PASSWORD=your_secure_password_here
# DATABASE_HOST=your_postgres_host
# DATABASE_PORT=5432
# RAILS_MAX_THREADS=5

# .env.development
# DATABASE_NAME=tcc_effortless_development
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=password
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# RAILS_MAX_THREADS=5
