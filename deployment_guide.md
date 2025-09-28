# 🚀 Guia de Deploy - TCC Effortless (SaaS Multi-tenant)

## 📋 Visão Geral

Este guia detalha como configurar e fazer deploy do Trilha Clara em produção, incluindo:

- Configuração do PostgreSQL
- Deploy da aplicação Rails
- Configuração de segurança
- Monitoramento e backup

## 🗄️ Configuração do Banco de Dados

### 1. PostgreSQL em Produção

#### Opção A: PostgreSQL Gerenciado (Recomendado)

- **AWS RDS**: `db.t3.micro` (gratuito por 12 meses)
- **Google Cloud SQL**: `db-f1-micro`
- **DigitalOcean Managed Database**: $15/mês
- **Railway**: $5/mês

#### Opção B: VPS com PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Configurar PostgreSQL
sudo -u postgres psql
CREATE DATABASE tcc_effortless_production;
CREATE USER tcc_effortless_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE tcc_effortless_production TO tcc_effortless_user;
```

### 2. Configuração de Segurança

```sql
-- Conectar como superuser
\c tcc_effortless_production

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Executar o schema completo
\i database_schema.sql

-- Configurar RLS (Row Level Security)
-- As políticas já estão incluídas no schema
```

## 🚀 Deploy da Aplicação

### 1. Plataformas de Deploy

#### Opção A: Railway (Recomendado para MVP)

```yaml
# railway.json
{
  'build': { 'builder': 'NIXPACKS' },
  'deploy':
    {
      'startCommand': 'bundle exec rails server -p $PORT',
      'healthcheckPath': '/health',
    },
}
```

#### Opção B: Heroku

```bash
# Instalar Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login e criar app
heroku login
heroku create tcc-effortless-prod

# Configurar variáveis de ambiente
heroku config:set DATABASE_URL=postgres://...
heroku config:set RAILS_MASTER_KEY=your_master_key
heroku config:set SECRET_KEY_BASE=your_secret_key

# Deploy
git push heroku main
```

#### Opção C: DigitalOcean App Platform

```yaml
# .do/app.yaml
name: tcc-effortless
services:
  - name: web
    source_dir: /
    github:
      repo: your-username/tcc-effortless
      branch: main
    run_command: bundle exec rails server -p $PORT
    environment_slug: ruby
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: RAILS_ENV
        value: production
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
databases:
  - name: db
    engine: PG
    version: '13'
```

### 2. Variáveis de Ambiente

```bash
# .env.production
RAILS_ENV=production
DATABASE_URL=postgres://tcc_effortless_user:password@host:5432/tcc_effortless_production
SECRET_KEY_BASE=your_secret_key_here
RAILS_MASTER_KEY=your_master_key_here

# JWT
JWT_SECRET_KEY=your_jwt_secret_here

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Storage (opcional)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=tcc-effortless-storage
```

## 🔒 Configuração de Segurança

### 1. SSL/TLS

- **Let's Encrypt**: Gratuito, automático
- **Cloudflare**: CDN + SSL gratuito
- **AWS Certificate Manager**: Integrado com ALB

### 2. Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 3. Configuração Rails de Produção

```ruby
# config/environments/production.rb
Rails.application.configure do
  # Segurança
  config.force_ssl = true
  config.ssl_options = { redirect: { exclude: -> request { request.path =~ /health/ } } }

  # CORS
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins ENV['ALLOWED_ORIGINS']&.split(',') || ['https://yourdomain.com']
      resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head]
    end
  end

  # Rate Limiting
  config.middleware.use Rack::Attack

  # Logs
  config.log_level = :info
  config.log_formatter = ::Logger::Formatter.new

  # Assets
  config.assets.compile = false
  config.assets.digest = true

  # Cache
  config.cache_store = :redis_cache_store, { url: ENV['REDIS_URL'] }
end
```

## 📊 Monitoramento

### 1. Health Check

```ruby
# app/controllers/health_controller.rb
class HealthController < ApplicationController
  def index
    render json: {
      status: 'ok',
      timestamp: Time.current,
      database: database_status,
      version: Rails.application.config.version
    }
  end

  private

  def database_status
    ActiveRecord::Base.connection.execute('SELECT 1')
    'connected'
  rescue
    'disconnected'
  end
end
```

### 2. Logs e Métricas

- **Sentry**: Error tracking
- **New Relic**: APM (gratuito até 100GB/mês)
- **LogRocket**: Session replay
- **Uptime Robot**: Monitoramento de uptime

### 3. Backup Automático

```bash
#!/bin/bash
# backup.sh
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
aws s3 cp backup_*.sql s3://tcc-effortless-backups/
```

## 💰 Estimativa de Custos

### MVP (0-100 usuários)

- **Railway**: $5/mês (app) + $5/mês (PostgreSQL)
- **Total**: $10/mês

### Crescimento (100-1000 usuários)

- **DigitalOcean**: $12/mês (app) + $15/mês (PostgreSQL)
- **Cloudflare**: Gratuito
- **Total**: $27/mês

### Escala (1000+ usuários)

- **AWS/GCP**: $50-200/mês (dependendo do uso)
- **Total**: $50-200/mês

## 🚀 Scripts de Deploy

### 1. Deploy Automático

```bash
#!/bin/bash
# deploy.sh
set -e

echo "🚀 Iniciando deploy..."

# Backup do banco
echo "📦 Fazendo backup..."
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Deploy da aplicação
echo "🔄 Deployando aplicação..."
git push heroku main

# Migrações
echo "🗄️ Executando migrações..."
heroku run rails db:migrate

# Seed (se necessário)
echo "🌱 Executando seed..."
heroku run rails db:seed

echo "✅ Deploy concluído!"
```

### 2. Rollback

```bash
#!/bin/bash
# rollback.sh
echo "⏪ Fazendo rollback..."
heroku rollback
echo "✅ Rollback concluído!"
```

## 📈 Escalabilidade

### 1. Horizontal Scaling

- **Load Balancer**: Distribuir carga entre instâncias
- **Database Read Replicas**: Para consultas de leitura
- **Redis Cluster**: Para cache distribuído

### 2. Otimizações

- **Database Indexing**: Índices otimizados já incluídos
- **Query Optimization**: N+1 queries resolvidas
- **Caching**: Redis para sessões e cache
- **CDN**: Cloudflare para assets estáticos

### 3. Monitoramento de Performance

```ruby
# Gemfile
gem 'rack-mini-profiler'
gem 'memory_profiler'
gem 'stackprof'
```

## 🔧 Manutenção

### 1. Atualizações Regulares

- **Dependências**: `bundle update` mensal
- **Ruby/Rails**: Atualizações de segurança
- **PostgreSQL**: Patches de segurança

### 2. Backup e Recovery

- **Backup Diário**: Automatizado
- **Teste de Restore**: Mensal
- **Disaster Recovery**: Plano documentado

### 3. Monitoramento

- **Uptime**: 99.9% SLA
- **Performance**: < 200ms response time
- **Errors**: < 0.1% error rate

## 📞 Suporte

### 1. Documentação

- **API Docs**: Swagger/OpenAPI
- **User Guide**: Wiki/GitBook
- **Troubleshooting**: FAQ

### 2. Comunicação

- **Status Page**: Para incidentes
- **Email Support**: Para usuários
- **Slack/Discord**: Para equipe

---

## 🎯 Próximos Passos

1. **Configurar PostgreSQL** em produção
2. **Fazer deploy** da aplicação
3. **Configurar monitoramento** básico
4. **Testar** todas as funcionalidades
5. **Configurar backup** automático
6. **Documentar** processos de manutenção

**Tempo estimado**: 2-4 horas para setup inicial
**Custo mensal**: $10-50 dependendo da plataforma
**Escalabilidade**: Suporta milhares de usuários
