# 🗄️ Configuração do Banco de Dados - TCC Effortless

## 📋 Visão Geral

Este documento detalha como configurar o banco de dados PostgreSQL para o TCC Effortless, um SaaS multi-tenant que permite que vários estudantes criem e gerenciem múltiplos trabalhos acadêmicos.

## 🎯 Objetivos

- **Multi-tenant**: Isolamento completo entre usuários
- **Escalabilidade**: Suporte a milhares de usuários e trabalhos
- **Segurança**: Row Level Security (RLS) e criptografia
- **Performance**: Índices otimizados e consultas eficientes
- **Backup**: Sistema de backup automático
- **Histórico**: Versionamento completo para undo/redo

## 🏗️ Estrutura do Banco

### Tabelas Principais

1. **users** - Dados dos estudantes
2. **tccs** - Trabalhos acadêmicos
3. **tcc_content** - Conteúdo principal (resumo, introdução, etc.)
4. **tcc_custom_sections** - Seções personalizadas
5. **tcc_section_labels** - Títulos editados das seções
6. **tcc_field_order** - Ordem dos campos na interface
7. **tcc*ai*\*** - Dados gerados pela IA
8. **tcc_notes** - Notas e observações
9. **tcc_content_history** - Histórico para undo/redo

### Relacionamentos

```
users (1) -----> (N) tccs
tccs (1) -----> (1) tcc_content
tccs (1) -----> (N) tcc_custom_sections
tccs (1) -----> (N) tcc_section_labels
tccs (1) -----> (1) tcc_field_order
tccs (1) -----> (N) tcc_ai_explanations
tccs (1) -----> (1) tcc_ai_structure
tccs (1) -----> (1) tcc_ai_timeline
tccs (1) -----> (N) tcc_notes
tccs (1) -----> (N) tcc_content_history
```

## 🚀 Instalação

### 1. Pré-requisitos

- PostgreSQL 13+ (recomendado 15)
- Ruby 3.2+
- Rails 7.0+
- Node.js 18+

### 2. Configuração Local

```bash
# Instalar PostgreSQL
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Baixar do site oficial: https://www.postgresql.org/download/windows/

# Iniciar serviço
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

### 3. Criar Banco de Dados

```bash
# Conectar como superuser
sudo -u postgres psql

# Criar usuário e banco
CREATE USER tcc_effortless_user WITH PASSWORD 'sua_senha_segura';
CREATE DATABASE tcc_effortless_development OWNER tcc_effortless_user;
CREATE DATABASE tcc_effortless_test OWNER tcc_effortless_user;
CREATE DATABASE tcc_effortless_production OWNER tcc_effortless_user;

# Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE tcc_effortless_development TO tcc_effortless_user;
GRANT ALL PRIVILEGES ON DATABASE tcc_effortless_test TO tcc_effortless_user;
GRANT ALL PRIVILEGES ON DATABASE tcc_effortless_production TO tcc_effortless_user;

# Sair
\q
```

### 4. Executar Schema

```bash
# Conectar ao banco de desenvolvimento
psql -U tcc_effortless_user -d tcc_effortless_development

# Executar schema
\i database_schema.sql

# Verificar tabelas
\dt

# Sair
\q
```

### 5. Configurar Rails

```bash
# Instalar gems
bundle install

# Executar migrações
rails db:migrate

# Executar seeds (opcional)
rails db:seed

# Verificar conexão
rails console
> ActiveRecord::Base.connection.execute("SELECT 1")
```

## 🔒 Segurança

### Row Level Security (RLS)

O banco implementa RLS para garantir isolamento entre usuários:

```sql
-- Exemplo: usuário só vê seus próprios TCCs
CREATE POLICY tcc_user_policy ON tccs
    FOR ALL TO authenticated
    USING (user_id = current_setting('app.current_user_id')::uuid);
```

### Criptografia

- **Senhas**: Hash com bcrypt
- **JWT**: Assinatura com chave secreta
- **Dados sensíveis**: Criptografia de campo quando necessário

### Backup

```bash
# Backup manual
pg_dump -U tcc_effortless_user -h localhost tcc_effortless_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup automático (cron)
0 2 * * * pg_dump -U tcc_effortless_user -h localhost tcc_effortless_production > /backups/backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql
```

## 📊 Performance

### Índices Otimizados

```sql
-- Índices para consultas frequentes
CREATE INDEX idx_tccs_user_id ON tccs(user_id);
CREATE INDEX idx_tccs_user_status ON tccs(user_id, status);
CREATE INDEX idx_tccs_user_created ON tccs(user_id, created_at DESC);

-- Índices para JSONB
CREATE INDEX idx_tcc_ai_structures_data ON tcc_ai_structures USING GIN (structure_data);
CREATE INDEX idx_tcc_field_order_data ON tcc_field_order USING GIN (field_order);
```

### Consultas Otimizadas

```sql
-- Buscar TCCs do usuário com conteúdo
SELECT t.*, tc.*, ts.structure_data, tt.timeline_data
FROM tccs t
LEFT JOIN tcc_content tc ON t.id = tc.tcc_id
LEFT JOIN tcc_ai_structures ts ON t.id = ts.tcc_id
LEFT JOIN tcc_ai_timelines tt ON t.id = tt.tcc_id
WHERE t.user_id = $1
ORDER BY t.created_at DESC;
```

## 🔄 Migrações

### Estrutura das Migrações

```ruby
# db/migrate/001_create_users.rb
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users, id: :uuid do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest
      t.string :nome, null: false
      # ... outros campos
      t.timestamps
    end
  end
end
```

### Executar Migrações

```bash
# Desenvolvimento
rails db:migrate

# Produção
RAILS_ENV=production rails db:migrate

# Rollback
rails db:rollback

# Reset completo
rails db:drop db:create db:migrate db:seed
```

## 📈 Monitoramento

### Métricas Importantes

- **Conexões ativas**: `SELECT count(*) FROM pg_stat_activity;`
- **Tamanho do banco**: `SELECT pg_size_pretty(pg_database_size('tcc_effortless_production'));`
- **Consultas lentas**: Habilitar `log_min_duration_statement`
- **Índices não utilizados**: `pg_stat_user_indexes`

### Logs

```sql
-- Configurar logs
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000; -- 1 segundo
SELECT pg_reload_conf();
```

## 🚀 Deploy em Produção

### 1. Configuração de Produção

```yaml
# config/database.yml
production:
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  database: <%= ENV['DATABASE_NAME'] %>
  username: <%= ENV['DATABASE_USERNAME'] %>
  password: <%= ENV['DATABASE_PASSWORD'] %>
  host: <%= ENV['DATABASE_HOST'] %>
  port: <%= ENV['DATABASE_PORT'] %>
  sslmode: require
```

### 2. Variáveis de Ambiente

```bash
# .env.production
DATABASE_NAME=tcc_effortless_production
DATABASE_USERNAME=tcc_effortless_user
DATABASE_PASSWORD=sua_senha_super_segura
DATABASE_HOST=seu-host-postgres.com
DATABASE_PORT=5432
RAILS_MAX_THREADS=5
```

### 3. Deploy com Docker

```bash
# Usar docker-compose.production.yml
docker-compose -f docker-compose.production.yml up -d

# Executar migrações
docker-compose -f docker-compose.production.yml exec web rails db:migrate
```

## 🔧 Manutenção

### Tarefas Regulares

1. **Backup diário**: Automatizado
2. **Limpeza de logs**: Semanal
3. **Análise de performance**: Mensal
4. **Atualizações de segurança**: Conforme necessário

### Comandos Úteis

```bash
# Verificar status
rails db:version

# Estatísticas do banco
rails console
> ActiveRecord::Base.connection.execute("SELECT schemaname,tablename,attname,n_distinct,correlation FROM pg_stats WHERE schemaname = 'public'")

# Limpar cache
rails tmp:clear

# Reindexar
rails db:reindex
```

## 🆘 Troubleshooting

### Problemas Comuns

1. **Erro de conexão**: Verificar credenciais e host
2. **Timeout**: Aumentar `timeout` no database.yml
3. **Memória**: Ajustar `pool` e `checkout_timeout`
4. **RLS**: Verificar se `app.current_user_id` está definido

### Logs de Debug

```ruby
# config/environments/development.rb
config.log_level = :debug
config.log_formatter = ::Logger::Formatter.new

# Habilitar logs SQL
ActiveRecord::Base.logger = Logger.new(STDOUT)
```

## 📚 Recursos Adicionais

- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [Rails Database Guide](https://guides.rubyonrails.org/active_record_migrations.html)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

## ✅ Checklist de Configuração

- [ ] PostgreSQL instalado e rodando
- [ ] Usuário e banco criados
- [ ] Schema executado com sucesso
- [ ] Rails conectando ao banco
- [ ] Migrações executadas
- [ ] RLS configurado
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] Deploy em produção testado

**Tempo estimado**: 30-60 minutos para setup completo
**Custo mensal**: $5-50 dependendo da infraestrutura
**Escalabilidade**: Suporta 10.000+ usuários simultâneos
