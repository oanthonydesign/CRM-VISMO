-- Prospecção: transforma a tabela "prospeccoes" (já usada pelo módulo antigo de Leads,
-- mas nunca migrada) na entidade Prospect completa do funil de prospecção pessoal
-- (Radar -> Pipeline -> Fechado/Perdido), com timeline de interações e playbook de
-- estratégias por segmento.

create table if not exists prospeccoes (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  empresa text,
  email text,
  telefone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- colunas novas (idempotente: cobre tanto criação nova quanto tabela já existente)
alter table prospeccoes add column if not exists instagram text;
alter table prospeccoes add column if not exists tipo text default 'empresa'; -- empresa, microempresa, profissional_liberal
alter table prospeccoes add column if not exists segmento text; -- nicho: padaria, salão, contador...
alter table prospeccoes add column if not exists canal text default 'whatsapp'; -- whatsapp, instagram, ambos
alter table prospeccoes add column if not exists origem text; -- explore, indicacao, maps, evento...
alter table prospeccoes add column if not exists status text not null default 'novo'; -- novo, abordado, respondeu, em_conversa, fechado, perdido
alter table prospeccoes add column if not exists oportunidade text; -- o que dá pra implementar na empresa dela
alter table prospeccoes add column if not exists como_ajudar text; -- qual dor isso resolve
alter table prospeccoes add column if not exists ideia_abordagem text; -- gancho/mensagem usada ou planejada
alter table prospeccoes add column if not exists observacoes text;
alter table prospeccoes add column if not exists data_encontrado date default current_date;
alter table prospeccoes add column if not exists data_abordagem date;
alter table prospeccoes add column if not exists data_ultima_interacao timestamptz;
alter table prospeccoes add column if not exists proxima_acao_data date;
alter table prospeccoes add column if not exists responsavel_id uuid references profiles(id);

-- reseta status antigo do módulo de Leads (novo/qualificando/arquivado) pro funil de prospecção
update prospeccoes set status = 'novo' where status in ('qualificando', 'arquivado');

create index if not exists prospeccoes_status_idx on prospeccoes (status);

-- timeline de interações por prospect (whatsapp, instagram, ligação, nota)
create table if not exists prospeccao_interacoes (
  id uuid default uuid_generate_v4() primary key,
  prospeccao_id uuid not null references prospeccoes(id) on delete cascade,
  tipo text not null, -- whatsapp, instagram, ligacao, nota
  descricao text not null,
  proximo_passo text,
  responsavel_id uuid references profiles(id),
  created_at timestamptz default now()
);

create index if not exists prospeccao_interacoes_prospeccao_id_idx on prospeccao_interacoes (prospeccao_id);

-- playbook reutilizável: gancho de abordagem + oferta por segmento (não é por pessoa)
create table if not exists estrategias_abordagem (
  id uuid default uuid_generate_v4() primary key,
  segmento text not null,
  titulo text not null,
  gancho text,
  oferta text,
  canal_recomendado text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table prospeccoes enable row level security;
alter table prospeccao_interacoes enable row level security;
alter table estrategias_abordagem enable row level security;

drop policy if exists "Members can view prospeccoes" on prospeccoes;
drop policy if exists "Admins can manage prospeccoes" on prospeccoes;
create policy "Members can view prospeccoes" on prospeccoes for select using (true);
create policy "Admins can manage prospeccoes" on prospeccoes for all using (is_admin());

drop policy if exists "Members can view interacoes" on prospeccao_interacoes;
drop policy if exists "Admins can manage interacoes" on prospeccao_interacoes;
create policy "Members can view interacoes" on prospeccao_interacoes for select using (true);
create policy "Admins can manage interacoes" on prospeccao_interacoes for all using (is_admin());

drop policy if exists "Members can view estrategias" on estrategias_abordagem;
drop policy if exists "Admins can manage estrategias" on estrategias_abordagem;
create policy "Members can view estrategias" on estrategias_abordagem for select using (true);
create policy "Admins can manage estrategias" on estrategias_abordagem for all using (is_admin());
