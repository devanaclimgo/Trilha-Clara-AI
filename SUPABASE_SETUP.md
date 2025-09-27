# 🚀 Configuração do Supabase para Trilha Clara IA

## 📋 Passo a Passo Completo

### 1. **Criar Conta no Supabase**

1. Acesse [supabase.com](https://supabase.com/)
2. Clique em "Start your project"
3. Faça login com GitHub/Google
4. Crie uma nova organização
5. Crie um novo projeto:
   - **Nome**: `trilha-clara`
   - **Senha**: Gere uma senha forte (salve em local seguro!)
   - **Região**: `South America (São Paulo)` (mais próximo do Brasil)

### 2. **Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na pasta `backend/` com suas credenciais:

```bash
# =====================================================
# CONFIGURAÇÕES DO SUPABASE
# =====================================================

# Encontre essas informações em: Settings > Database
DB_HOST=db.[SEU_PROJECT_ID].supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[SUA_SENHA_DO_PROJETO]

# Encontre essas informações em: Settings > API
SUPABASE_URL=https://[SEU_PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[SUA_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SUA_SERVICE_ROLE_KEY]

# =====================================================
# CONFIGURAÇÕES DE AUTENTICAÇÃO
# =====================================================

# Gere uma chave segura: rails secret
JWT_SECRET_KEY=[SUA_JWT_SECRET_KEY]

# =====================================================
# CONFIGURAÇÕES DO GOOGLE OAUTH
# =====================================================

GOOGLE_CLIENT_ID=[SEU_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[SEU_GOOGLE_CLIENT_SECRET]

# =====================================================
# CONFIGURAÇÕES DO GEMINI AI
# =====================================================

GEMINI_API_KEY=[SUA_GEMINI_API_KEY]

# =====================================================
# CONFIGURAÇÕES DE PRODUÇÃO
# =====================================================

RAILS_ENV=production
RAILS_SECRET_KEY_BASE=[SUA_SECRET_KEY_BASE]
CORS_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

### 3. **Configurar o Banco de Dados**

#### Opção A: Usar o Schema Personalizado (Recomendado)

```bash
# No terminal, dentro da pasta backend/
cd backend

# Configurar Supabase
rails supabase:setup
```

#### Opção B: Usar Migrações do Rails

```bash
# No terminal, dentro da pasta backend/
cd backend

# Executar migrações
rails db:migrate

# Executar schema personalizado
rails db:schema:load
```

### 4. **Configurar Row Level Security (RLS)**

No painel do Supabase, vá para **Authentication > Policies** e configure:

```sql
-- Habilitar RLS nas tabelas principais
ALTER TABLE tccs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcc_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcc_custom_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcc_section_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcc_field_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcc_ai_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcc_ai_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcc_ai_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcc_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcc_content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcc_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para TCCs (usuário só pode ver seus próprios TCCs)
CREATE POLICY tcc_user_policy ON tccs
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

-- Políticas para conteúdo (através do TCC)
CREATE POLICY tcc_content_policy ON tcc_content
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = auth.uid()
    ));
```

### 5. **Testar a Configuração**

```bash
# Testar conexão
rails supabase:test

# Se tudo estiver funcionando, você verá:
# ✅ Conexão estabelecida!
# 📊 Versão do PostgreSQL: PostgreSQL 15.x
# 📋 Tabela users: 0 registros
# 📋 Tabela tccs: 0 registros
# 📋 Tabela tcc_content: 0 registros
# 🎉 Teste concluído com sucesso!
```

### 6. **Configurar Deploy em Produção**

#### Opção A: Railway (Recomendado)

1. Conecte seu repositório GitHub ao Railway
2. Configure as variáveis de ambiente no Railway
3. Deploy automático!

#### Opção B: Vercel + Railway

1. Frontend (Next.js) no Vercel
2. Backend (Rails) no Railway
3. Banco de dados no Supabase

### 7. **Configurações de Segurança**

#### No Supabase Dashboard:

1. **Authentication > Settings**:

   - Configure domínios permitidos
   - Configure redirect URLs
   - Configure JWT settings

2. **Database > Settings**:

   - Configure backup automático
   - Configure point-in-time recovery
   - Configure connection pooling

3. **API > Settings**:
   - Configure rate limiting
   - Configure CORS
   - Configure API keys

### 8. **Monitoramento e Logs**

- **Dashboard**: Acompanhe uso de recursos
- **Logs**: Monitore queries e erros
- **Métricas**: Acompanhe performance
- **Alertas**: Configure notificações

## 🔧 Comandos Úteis

```bash
# Configurar Supabase
rails supabase:setup

# Testar conexão
rails supabase:test

# Resetar banco (CUIDADO!)
rails supabase:reset

# Executar migrações
rails db:migrate

# Executar seeds
rails db:seed

# Console do Rails
rails console

# Console do Supabase
rails supabase:console
```

## 🚨 Troubleshooting

### Erro de Conexão

```bash
# Verificar variáveis de ambiente
echo $DB_HOST
echo $DB_USER
echo $DB_PASSWORD

# Testar conexão manual
psql -h $DB_HOST -U $DB_USER -d $DB_NAME
```

### Erro de SSL

```bash
# Adicionar ao database.yml
sslmode: require
```

### Erro de Timeout

```bash
# Aumentar timeout no database.yml
connect_timeout: 30
checkout_timeout: 10
```

## 📞 Suporte

- **Documentação**: [supabase.com/docs](https://supabase.com/docs)
- **Comunidade**: [github.com/supabase/supabase](https://github.com/supabase/supabase)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)

## 🎉 Próximos Passos

1. ✅ Configurar Supabase
2. ✅ Testar conexão
3. ✅ Configurar RLS
4. ✅ Deploy em produção
5. ✅ Monitoramento
6. ✅ Backup automático
7. ✅ Escalabilidade

---

**💡 Dica**: Mantenha suas credenciais seguras e nunca as commite no Git!
