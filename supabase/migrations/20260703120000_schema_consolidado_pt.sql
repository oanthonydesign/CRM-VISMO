-- Schema consolidado do zero, 100% em português.
--
-- Substitui 20251130000000_vismo_os_schema.sql e 20251130010000_full_schema.sql,
-- que colidiam entre si (CREATE TABLE "tasks"/"project_updates" duplicado sem
-- IF NOT EXISTS) e não cobriam metade das tabelas que o código realmente
-- consulta (o app usa "entradas_saidas"/"metas"/"atividades" em português,
-- mas essas migrations antigas só criavam "transactions"/"goals" em inglês,
-- e nunca criavam "atividades" nem "contratos"/"parcelas" — que por sua vez
-- nunca foram lidas, pois o recurso de contratos foi removido do app).
--
-- Para reconstruir o banco do zero num projeto Supabase novo, rode SÓ este
-- arquivo + 20260704000000_prospeccao.sql (nessa ordem). Ignore os dois
-- arquivos antigos acima — eles ficam no histórico mas estão superados.

create extension if not exists "uuid-ossp";

create table if not exists profiles (
    id uuid references auth.users(id) primary key,
    email text,
    full_name text,
    role text check (role in ('admin', 'member')) default 'member',
    department text,
    avatar_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists empresas (
    id uuid default uuid_generate_v4() primary key,
    nome text not null,
    nome_fantasia text,
    cnpj text,
    tipo text check (tipo in ('cliente', 'parceiro', 'fornecedor', 'prospect', 'lead', 'ex-cliente')) default 'lead',
    status text default 'ativo',
    origem text,
    setor text,
    tamanho text,
    endereco text,
    cidade text,
    estado text,
    valor_total numeric(12,2) default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists contatos (
    id uuid default uuid_generate_v4() primary key,
    empresa_id uuid references empresas(id) on delete cascade,
    nome text not null,
    cargo text,
    email text,
    telefone text,
    linkedin text,
    is_primary boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists deals (
    id uuid default uuid_generate_v4() primary key,
    empresa_id uuid references empresas(id) on delete cascade,
    titulo text not null,
    valor numeric(12,2) default 0,
    estagio text not null default 'prospeccao', -- prospeccao, qualificacao, proposta, negociacao, fechado_ganho, fechado_perdido
    probabilidade integer default 0,
    data_fechamento_prevista date,
    responsavel_id uuid references profiles(id),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists projects (
    id uuid default uuid_generate_v4() primary key,
    empresa_id uuid references empresas(id) on delete cascade,
    nome text not null,
    descricao text,
    status text default 'planejamento', -- planejamento, design, desenvolvimento, qa, entregue
    health text default 'on_track', -- on_track, at_risk, off_track
    progress integer default 0,
    deadline date,
    owner_id uuid references profiles(id),
    valor_projeto numeric(12,2),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists tasks (
    id uuid default uuid_generate_v4() primary key,
    project_id uuid references projects(id) on delete cascade,
    title text not null,
    description text,
    status text default 'todo', -- todo, in_progress, review, done
    priority text default 'medium', -- low, medium, high, urgent
    assignee_id uuid references profiles(id),
    due_date date,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists project_updates (
    id uuid default uuid_generate_v4() primary key,
    project_id uuid references projects(id) on delete cascade,
    author_id uuid references profiles(id),
    content text not null,
    health text, -- on_track, at_risk, off_track
    created_at timestamptz default now()
);

-- financeiro (era "transactions" no código antigo; app foi ajustado pra
-- "entradas_saidas" nesta consolidação)
create table if not exists entradas_saidas (
    id uuid default uuid_generate_v4() primary key,
    descricao text not null,
    valor numeric(12,2) not null,
    tipo text check (tipo in ('entrada', 'saida')) not null,
    categoria text,
    data_transacao date not null,
    status text check (status in ('pendente', 'realizado', 'cancelado')) default 'realizado',
    comprovante_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- metas / OKRs (era "goals" no código antigo/morto)
create table if not exists metas (
    id uuid default uuid_generate_v4() primary key,
    titulo text not null,
    meta_valor numeric(12,2) not null,
    atual_valor numeric(12,2) default 0,
    periodo text check (periodo in ('mensal', 'trimestral', 'anual', 'customizado')),
    tipo text check (tipo in ('receita', 'vendas', 'projetos', 'clientes', 'leads', 'customizado')),
    owner_id uuid references profiles(id),
    data_inicio date,
    data_fim date,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- atividades / follow-ups (nunca teve migration; o dashboard já lia daqui)
create table if not exists atividades (
    id uuid default uuid_generate_v4() primary key,
    tipo text check (tipo in ('ligacao', 'reuniao', 'whatsapp', 'email')) not null,
    descricao text not null,
    proximo_passo text,
    concluido boolean default false,
    data_realizada timestamptz default now(),
    empresa_id uuid references empresas(id) on delete cascade,
    deal_id uuid references deals(id) on delete set null,
    responsavel_id uuid references profiles(id),
    created_at timestamptz default now()
);

create index if not exists deals_empresa_id_idx on deals (empresa_id);
create index if not exists contatos_empresa_id_idx on contatos (empresa_id);
create index if not exists tasks_project_id_idx on tasks (project_id);
create index if not exists atividades_empresa_id_idx on atividades (empresa_id);
create index if not exists entradas_saidas_data_idx on entradas_saidas (data_transacao);

-- ── RLS ──────────────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table empresas enable row level security;
alter table contatos enable row level security;
alter table deals enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table project_updates enable row level security;
alter table entradas_saidas enable row level security;
alter table metas enable row level security;
alter table atividades enable row level security;

create or replace function is_admin()
returns boolean as $$
begin
  return exists (select 1 from profiles where id = auth.uid() and role = 'admin');
end;
$$ language plpgsql security definer;

drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

drop policy if exists "Members can view empresas" on empresas;
create policy "Members can view empresas" on empresas for select using (true);
drop policy if exists "Admins can manage empresas" on empresas;
create policy "Admins can manage empresas" on empresas for all using (is_admin());

drop policy if exists "Members can view contatos" on contatos;
create policy "Members can view contatos" on contatos for select using (true);
drop policy if exists "Admins can manage contatos" on contatos;
create policy "Admins can manage contatos" on contatos for all using (is_admin());

drop policy if exists "Members can view deals" on deals;
create policy "Members can view deals" on deals for select using (true);
drop policy if exists "Admins can manage deals" on deals;
create policy "Admins can manage deals" on deals for all using (is_admin());

drop policy if exists "Members can view projects" on projects;
create policy "Members can view projects" on projects for select using (true);
drop policy if exists "Admins can manage projects" on projects;
create policy "Admins can manage projects" on projects for all using (is_admin());

drop policy if exists "Members can view tasks" on tasks;
create policy "Members can view tasks" on tasks for select using (true);
drop policy if exists "Members can update assigned tasks" on tasks;
create policy "Members can update assigned tasks" on tasks for update using (auth.uid() = assignee_id);
drop policy if exists "Admins can manage tasks" on tasks;
create policy "Admins can manage tasks" on tasks for all using (is_admin());

drop policy if exists "Members can view updates" on project_updates;
create policy "Members can view updates" on project_updates for select using (true);
drop policy if exists "Members can create updates" on project_updates;
create policy "Members can create updates" on project_updates for insert with check (auth.uid() = author_id);
drop policy if exists "Admins can manage updates" on project_updates;
create policy "Admins can manage updates" on project_updates for all using (is_admin());

drop policy if exists "Admins only entradas_saidas" on entradas_saidas;
create policy "Admins only entradas_saidas" on entradas_saidas for all using (is_admin());

drop policy if exists "Members can view metas" on metas;
create policy "Members can view metas" on metas for select using (true);
drop policy if exists "Admins can manage metas" on metas;
create policy "Admins can manage metas" on metas for all using (is_admin());

drop policy if exists "Members can view atividades" on atividades;
create policy "Members can view atividades" on atividades for select using (true);
drop policy if exists "Members can create atividades" on atividades;
create policy "Members can create atividades" on atividades for insert with check (auth.uid() = responsavel_id);
drop policy if exists "Admins can manage atividades" on atividades;
create policy "Admins can manage atividades" on atividades for all using (is_admin());
