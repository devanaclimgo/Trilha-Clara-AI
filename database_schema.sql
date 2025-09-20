-- =====================================================
-- SCHEMA DO BANCO DE DADOS - TCC EFFORTLESS (SaaS Multi-tenant)
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELAS DE USUÁRIOS E AUTENTICAÇÃO
-- =====================================================

-- Tabela de usuários (estudantes)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Para login tradicional
    nome VARCHAR(255) NOT NULL,
    instituicao VARCHAR(255),
    curso VARCHAR(255),
    telefone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Tabela de tokens JWT (para logout)
CREATE TABLE jwt_denylist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jti VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELAS DE TRABALHOS ACADÊMICOS
-- =====================================================

-- Tabela principal de trabalhos
CREATE TABLE tccs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titulo VARCHAR(500) NOT NULL,
    tema VARCHAR(500),
    area_conhecimento VARCHAR(100),
    tipo_trabalho VARCHAR(50) DEFAULT 'TCC', -- TCC, Monografia, Dissertação, etc.
    status VARCHAR(20) DEFAULT 'draft', -- draft, in_progress, completed, archived
    prazo_entrega DATE,
    orientador_nome VARCHAR(255),
    orientador_email VARCHAR(255),
    instituicao VARCHAR(255),
    curso VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para performance
    CONSTRAINT valid_status CHECK (status IN ('draft', 'in_progress', 'completed', 'archived'))
);

-- Índices para consultas frequentes
CREATE INDEX idx_tccs_user_id ON tccs(user_id);
CREATE INDEX idx_tccs_status ON tccs(status);
CREATE INDEX idx_tccs_created_at ON tccs(created_at);

-- =====================================================
-- TABELAS DE CONTEÚDO DOS TRABALHOS
-- =====================================================

-- Tabela de conteúdo principal
CREATE TABLE tcc_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tcc_id UUID NOT NULL REFERENCES tccs(id) ON DELETE CASCADE,
    resumo TEXT,
    introducao TEXT,
    objetivos TEXT,
    justificativa TEXT,
    metodologia TEXT,
    desenvolvimento TEXT,
    conclusao TEXT,
    referencias TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que só existe um registro por TCC
    UNIQUE(tcc_id)
);

-- Tabela de seções customizadas
CREATE TABLE tcc_custom_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tcc_id UUID NOT NULL REFERENCES tccs(id) ON DELETE CASCADE,
    section_key VARCHAR(100) NOT NULL, -- custom_0, custom_1, etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que não há duplicatas de chave por TCC
    UNIQUE(tcc_id, section_key)
);

-- Tabela de labels editados (títulos das seções)
CREATE TABLE tcc_section_labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tcc_id UUID NOT NULL REFERENCES tccs(id) ON DELETE CASCADE,
    section_id VARCHAR(100) NOT NULL, -- ID da seção (resumo, introducao, custom_0, etc.)
    label VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que só existe um label por seção por TCC
    UNIQUE(tcc_id, section_id)
);

-- Tabela de ordem dos campos
CREATE TABLE tcc_field_order (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tcc_id UUID NOT NULL REFERENCES tccs(id) ON DELETE CASCADE,
    field_order JSONB NOT NULL, -- Array de IDs dos campos na ordem correta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que só existe uma ordem por TCC
    UNIQUE(tcc_id)
);

-- =====================================================
-- TABELAS DE DADOS GERADOS PELA IA
-- =====================================================

-- Tabela de explicações simplificadas
CREATE TABLE tcc_ai_explanations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tcc_id UUID NOT NULL REFERENCES tccs(id) ON DELETE CASCADE,
    explanation_type VARCHAR(50) NOT NULL, -- 'simplified', 'detailed', 'technical'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que só existe uma explicação por tipo por TCC
    UNIQUE(tcc_id, explanation_type)
);

-- Tabela de estruturas sugeridas
CREATE TABLE tcc_ai_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tcc_id UUID NOT NULL REFERENCES tccs(id) ON DELETE CASCADE,
    structure_data JSONB NOT NULL, -- Array de objetos com título e descrição
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que só existe uma estrutura por TCC
    UNIQUE(tcc_id)
);

-- Tabela de cronogramas
CREATE TABLE tcc_ai_timelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tcc_id UUID NOT NULL REFERENCES tccs(id) ON DELETE CASCADE,
    timeline_data JSONB NOT NULL, -- Array de objetos com tarefas e datas
    total_weeks INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que só existe um cronograma por TCC
    UNIQUE(tcc_id)
);

-- Tabela de notas e observações
CREATE TABLE tcc_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tcc_id UUID NOT NULL REFERENCES tccs(id) ON DELETE CASCADE,
    note_type VARCHAR(50) DEFAULT 'general', -- 'general', 'meeting', 'reminder', 'idea'
    title VARCHAR(255),
    content TEXT NOT NULL,
    is_important BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para notas
CREATE INDEX idx_tcc_notes_tcc_id ON tcc_notes(tcc_id);
CREATE INDEX idx_tcc_notes_type ON tcc_notes(note_type);
CREATE INDEX idx_tcc_notes_important ON tcc_notes(is_important);

-- =====================================================
-- TABELAS DE HISTÓRICO E VERSIONAMENTO
-- =====================================================

-- Tabela de histórico de mudanças
CREATE TABLE tcc_content_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tcc_id UUID NOT NULL REFERENCES tccs(id) ON DELETE CASCADE,
    content_snapshot JSONB NOT NULL, -- Snapshot completo do conteúdo
    change_type VARCHAR(50) NOT NULL, -- 'content', 'structure', 'ai_generation'
    change_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para histórico
CREATE INDEX idx_tcc_history_tcc_id ON tcc_content_history(tcc_id);
CREATE INDEX idx_tcc_history_created_at ON tcc_content_history(created_at);

-- =====================================================
-- TABELAS DE CONFIGURAÇÕES E PREFERÊNCIAS
-- =====================================================

-- Tabela de configurações do usuário
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferences JSONB NOT NULL DEFAULT '{}', -- Configurações personalizadas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que só existe uma configuração por usuário
    UNIQUE(user_id)
);

-- Tabela de configurações por TCC
CREATE TABLE tcc_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tcc_id UUID NOT NULL REFERENCES tccs(id) ON DELETE CASCADE,
    settings JSONB NOT NULL DEFAULT '{}', -- Configurações específicas do TCC
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que só existe uma configuração por TCC
    UNIQUE(tcc_id)
);

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA DE TIMESTAMPS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tccs_updated_at BEFORE UPDATE ON tccs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tcc_content_updated_at BEFORE UPDATE ON tcc_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tcc_custom_sections_updated_at BEFORE UPDATE ON tcc_custom_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tcc_section_labels_updated_at BEFORE UPDATE ON tcc_section_labels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tcc_field_order_updated_at BEFORE UPDATE ON tcc_field_order FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tcc_ai_structures_updated_at BEFORE UPDATE ON tcc_ai_structures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tcc_ai_timelines_updated_at BEFORE UPDATE ON tcc_ai_timelines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tcc_notes_updated_at BEFORE UPDATE ON tcc_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tcc_settings_updated_at BEFORE UPDATE ON tcc_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS PARA CONSULTAS FREQUENTES
-- =====================================================

-- View para dados completos do TCC
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

-- View para estatísticas do usuário
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

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY)
-- =====================================================

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
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- Políticas para conteúdo (através do TCC)
CREATE POLICY tcc_content_policy ON tcc_content
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

-- Políticas para seções customizadas
CREATE POLICY tcc_custom_sections_policy ON tcc_custom_sections
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

-- Políticas para labels
CREATE POLICY tcc_section_labels_policy ON tcc_section_labels
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

-- Políticas para ordem dos campos
CREATE POLICY tcc_field_order_policy ON tcc_field_order
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

-- Políticas para dados da IA
CREATE POLICY tcc_ai_explanations_policy ON tcc_ai_explanations
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

CREATE POLICY tcc_ai_structures_policy ON tcc_ai_structures
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

CREATE POLICY tcc_ai_timelines_policy ON tcc_ai_timelines
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

-- Políticas para notas
CREATE POLICY tcc_notes_policy ON tcc_notes
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

-- Políticas para histórico
CREATE POLICY tcc_content_history_policy ON tcc_content_history
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

-- Políticas para configurações
CREATE POLICY tcc_settings_policy ON tcc_settings
    FOR ALL TO authenticated
    USING (tcc_id IN (
        SELECT id FROM tccs WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

-- =====================================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =====================================================

-- Índices compostos para consultas frequentes
CREATE INDEX idx_tccs_user_status ON tccs(user_id, status);
CREATE INDEX idx_tccs_user_created ON tccs(user_id, created_at DESC);
CREATE INDEX idx_tcc_notes_tcc_important ON tcc_notes(tcc_id, is_important);
CREATE INDEX idx_tcc_content_history_tcc_created ON tcc_content_history(tcc_id, created_at DESC);

-- Índices para JSONB
CREATE INDEX idx_tcc_ai_structures_data ON tcc_ai_structures USING GIN (structure_data);
CREATE INDEX idx_tcc_ai_timelines_data ON tcc_ai_timelines USING GIN (timeline_data);
CREATE INDEX idx_tcc_field_order_data ON tcc_field_order USING GIN (field_order);
CREATE INDEX idx_tcc_content_history_snapshot ON tcc_content_history USING GIN (content_snapshot);

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE users IS 'Tabela de usuários (estudantes) do sistema';
COMMENT ON TABLE tccs IS 'Tabela principal de trabalhos acadêmicos';
COMMENT ON TABLE tcc_content IS 'Conteúdo principal dos trabalhos (resumo, introdução, etc.)';
COMMENT ON TABLE tcc_custom_sections IS 'Seções customizadas criadas pelos usuários';
COMMENT ON TABLE tcc_section_labels IS 'Títulos editados das seções';
COMMENT ON TABLE tcc_field_order IS 'Ordem dos campos na interface';
COMMENT ON TABLE tcc_ai_explanations IS 'Explicações geradas pela IA';
COMMENT ON TABLE tcc_ai_structures IS 'Estruturas sugeridas pela IA';
COMMENT ON TABLE tcc_ai_timelines IS 'Cronogramas gerados pela IA';
COMMENT ON TABLE tcc_notes IS 'Notas e observações dos usuários';
COMMENT ON TABLE tcc_content_history IS 'Histórico de mudanças para undo/redo';
COMMENT ON TABLE user_preferences IS 'Preferências e configurações do usuário';
COMMENT ON TABLE tcc_settings IS 'Configurações específicas por TCC';

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
