-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES (Users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    department TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EMPRESAS (Clients & Leads)
CREATE TABLE empresas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome TEXT NOT NULL,
    nome_fantasia TEXT,
    cnpj TEXT,
    tipo TEXT CHECK (tipo IN ('cliente', 'lead', 'ex-cliente')) DEFAULT 'lead',
    status TEXT DEFAULT 'ativo', -- ativo, inativo, arquivado
    origem TEXT, -- linkedin, site, indicação, etc.
    setor TEXT,
    tamanho TEXT,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    valor_total DECIMAL(12,2) DEFAULT 0, -- Total value of closed deals/contracts
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTATOS
CREATE TABLE contatos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    cargo TEXT,
    email TEXT,
    telefone TEXT,
    linkedin TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DEALS (Oportunidades)
CREATE TABLE deals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    valor DECIMAL(12,2) DEFAULT 0,
    estagio TEXT NOT NULL, -- descoberta, diagnostico, proposta, negociacao, fechado_ganho, fechado_perdido
    probabilidade INTEGER DEFAULT 0,
    data_fechamento_prevista DATE,
    responsavel_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    status TEXT DEFAULT 'planejamento', -- planejamento, design, desenvolvimento, qa, entregue
    health TEXT DEFAULT 'on_track', -- on_track, at_risk, off_track
    progress INTEGER DEFAULT 0,
    deadline DATE,
    owner_id UUID REFERENCES profiles(id),
    valor_projeto DECIMAL(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TASKS
CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo', -- todo, in_progress, review, done
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    assignee_id UUID REFERENCES profiles(id),
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECT UPDATES
CREATE TABLE project_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    health TEXT, -- Snapshot of project health at this update
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTRACTS (Financeiro)
CREATE TABLE contracts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    valor_total DECIMAL(12,2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status TEXT DEFAULT 'ativo', -- ativo, finalizado, cancelado
    arquivo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INSTALLMENTS (Parcelas / Recebíveis)
CREATE TABLE installments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    numero_parcela INTEGER NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status TEXT DEFAULT 'pendente', -- pendente, pago, atrasado, cancelado
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS (Fluxo de Caixa)
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    descricao TEXT NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    tipo TEXT CHECK (tipo IN ('entrada', 'saida')),
    categoria TEXT,
    data_transacao DATE NOT NULL,
    status TEXT DEFAULT 'realizado', -- realizado, previsto
    comprovante_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GOALS (Metas)
CREATE TABLE goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titulo TEXT NOT NULL,
    meta DECIMAL(12,2) NOT NULL,
    atual DECIMAL(12,2) DEFAULT 0,
    periodo TEXT, -- mensal, trimestral, anual
    tipo TEXT, -- faturamento, vendas, leads, etc.
    data_inicio DATE,
    data_fim DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Everyone can read basic info, Users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Empresas/Contatos/Deals/Projects: Read-only for members, Full access for Admin
CREATE POLICY "Members can view empresas" ON empresas FOR SELECT USING (true);
CREATE POLICY "Admins can manage empresas" ON empresas FOR ALL USING (is_admin());

CREATE POLICY "Members can view contatos" ON contatos FOR SELECT USING (true);
CREATE POLICY "Admins can manage contatos" ON contatos FOR ALL USING (is_admin());

CREATE POLICY "Members can view deals" ON deals FOR SELECT USING (true);
CREATE POLICY "Admins can manage deals" ON deals FOR ALL USING (is_admin());

CREATE POLICY "Members can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON projects FOR ALL USING (is_admin());

-- Tasks: Members can view all, but only update assigned tasks. Admins full access.
CREATE POLICY "Members can view tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Members can update assigned tasks" ON tasks FOR UPDATE USING (auth.uid() = assignee_id);
CREATE POLICY "Admins can manage tasks" ON tasks FOR ALL USING (is_admin());

-- Project Updates: Members can view all, create/update their own. Admins full access.
CREATE POLICY "Members can view updates" ON project_updates FOR SELECT USING (true);
CREATE POLICY "Members can create updates" ON project_updates FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Admins can manage updates" ON project_updates FOR ALL USING (is_admin());

-- Finance (Contracts, Installments, Transactions): Admin ONLY
CREATE POLICY "Admins only contracts" ON contracts FOR ALL USING (is_admin());
CREATE POLICY "Admins only installments" ON installments FOR ALL USING (is_admin());
CREATE POLICY "Admins only transactions" ON transactions FOR ALL USING (is_admin());

-- Goals: Read-only for members, Admin full access
CREATE POLICY "Members can view goals" ON goals FOR SELECT USING (true);
CREATE POLICY "Admins can manage goals" ON goals FOR ALL USING (is_admin());
