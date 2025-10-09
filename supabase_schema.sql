-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR TRILHA CLARA IA
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS TABLE (extends Supabase auth.users)
-- =====================================================

CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TCCS TABLE (Main academic works table)
-- =====================================================

CREATE TABLE public.tccs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    curso TEXT NOT NULL,
    tipo_trabalho TEXT NOT NULL,
    tema TEXT,
    nome_aluno TEXT,
    instituicao TEXT,
    orientador TEXT,
    coorientador TEXT,
    palavras_chave TEXT,
    resumo TEXT,
    status TEXT NOT NULL DEFAULT 'pesquisando' CHECK (status IN ('pesquisando', 'em_andamento', 'editando', 'formatando', 'concluido')),
    progresso INTEGER NOT NULL DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_modificacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TCC NOTES TABLE
-- =====================================================

CREATE TABLE public.tcc_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tcc_id UUID NOT NULL REFERENCES public.tccs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TCC CONTENT TABLE (for AI-generated content)
-- =====================================================

CREATE TABLE public.tcc_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tcc_id UUID NOT NULL REFERENCES public.tccs(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- 'explicacao', 'sugestoes', 'dica', 'estrutura', 'cronograma'
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tcc_id, section_type)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- TCCs indexes
CREATE INDEX idx_tccs_user_id ON public.tccs(user_id);
CREATE INDEX idx_tccs_status ON public.tccs(status);
CREATE INDEX idx_tccs_created_at ON public.tccs(created_at);
CREATE INDEX idx_tccs_user_created ON public.tccs(user_id, created_at DESC);

-- Notes indexes
CREATE INDEX idx_tcc_notes_tcc_id ON public.tcc_notes(tcc_id);
CREATE INDEX idx_tcc_notes_user_id ON public.tcc_notes(user_id);
CREATE INDEX idx_tcc_notes_created_at ON public.tcc_notes(created_at);

-- Content indexes
CREATE INDEX idx_tcc_content_tcc_id ON public.tcc_content(tcc_id);
CREATE INDEX idx_tcc_content_section_type ON public.tcc_content(section_type);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tccs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tcc_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tcc_content ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- TCCs policies
CREATE POLICY "Users can view own TCCs" ON public.tccs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own TCCs" ON public.tccs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own TCCs" ON public.tccs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own TCCs" ON public.tccs
    FOR DELETE USING (auth.uid() = user_id);

-- TCC Notes policies
CREATE POLICY "Users can view notes for own TCCs" ON public.tcc_notes
    FOR SELECT USING (
        auth.uid() = user_id OR 
        tcc_id IN (SELECT id FROM public.tccs WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can insert notes for own TCCs" ON public.tcc_notes
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        tcc_id IN (SELECT id FROM public.tccs WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can update own notes" ON public.tcc_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON public.tcc_notes
    FOR DELETE USING (auth.uid() = user_id);

-- TCC Content policies
CREATE POLICY "Users can view content for own TCCs" ON public.tcc_content
    FOR SELECT USING (
        tcc_id IN (SELECT id FROM public.tccs WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can insert content for own TCCs" ON public.tcc_content
    FOR INSERT WITH CHECK (
        tcc_id IN (SELECT id FROM public.tccs WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can update content for own TCCs" ON public.tcc_content
    FOR UPDATE USING (
        tcc_id IN (SELECT id FROM public.tccs WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can delete content for own TCCs" ON public.tcc_content
    FOR DELETE USING (
        tcc_id IN (SELECT id FROM public.tccs WHERE user_id = auth.uid())
    );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tccs_updated_at
    BEFORE UPDATE ON public.tccs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tcc_notes_updated_at
    BEFORE UPDATE ON public.tcc_notes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tcc_content_updated_at
    BEFORE UPDATE ON public.tcc_content
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for TCCs with user info
CREATE VIEW public.tccs_with_user AS
SELECT 
    t.*,
    u.name as user_name,
    u.email as user_email
FROM public.tccs t
JOIN public.users u ON t.user_id = u.id;

-- View for TCCs with note counts
CREATE VIEW public.tccs_with_stats AS
SELECT 
    t.*,
    COUNT(n.id) as note_count,
    MAX(n.created_at) as last_note_at
FROM public.tccs t
LEFT JOIN public.tcc_notes n ON t.id = n.tcc_id
GROUP BY t.id, t.user_id, t.titulo, t.curso, t.tipo_trabalho, t.tema, 
         t.nome_aluno, t.instituicao, t.orientador, t.coorientador, 
         t.palavras_chave, t.resumo, t.status, t.progresso, 
         t.data_criacao, t.ultima_modificacao, t.created_at, t.updated_at;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample user (this would be created via auth signup in real usage)
-- INSERT INTO public.users (id, email, name) VALUES 
-- ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User');

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.tccs IS 'Academic works (TCC, monographs, etc.)';
COMMENT ON TABLE public.tcc_notes IS 'User notes for each TCC';
COMMENT ON TABLE public.tcc_content IS 'AI-generated content for each TCC section';

COMMENT ON COLUMN public.tccs.status IS 'Current phase of the academic work';
COMMENT ON COLUMN public.tccs.progresso IS 'Progress percentage (0-100)';
COMMENT ON COLUMN public.tcc_content.section_type IS 'Type of content: explicacao, sugestoes, dica, estrutura, cronograma';
