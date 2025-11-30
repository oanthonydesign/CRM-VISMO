# PRD 2.0 – VISMO CRM / SOFTWARE HOUSE

**Versão:** 2.0  
**Data:** 30 de Novembro de 2025  
**Responsável:** Product Team  
**Tipo:** CRM + Financeiro + Project Management  

---

## 1. VISÃO DO PRODUTO

### 1.1. Objetivo

Criar um **CRM operacional completo** para software house que centraliza:
- Gestão de leads e clientes
- Pipeline de vendas (oportunidades)
- Acompanhamento de atividades e follow-ups
- Gestão de projetos e entregas
- Controle financeiro (receitas, despesas, parcelas)
- Metas e KPIs da operação

**Substituir:** Notion, planilhas, Pipefy e ferramentas dispersas.

### 1.2. Problemas que Resolve

- ✅ Falta de clareza sobre receita recebida vs. prevista vs. contratada
- ✅ Perda de follow-ups e leads
- ✅ Falta de visão do pipeline de vendas
- ✅ Ruído em entregas e deadlines de projetos
- ✅ Falta de visão de metas e KPIs reais

### 1.3. O que NÃO faz (Removido do Escopo)

- ❌ Geração automática de contratos
- ❌ Templates de contrato
- ❌ Assinatura digital de contratos
- ❌ Gestão de contratos complexa

**Justificativa:** Contratos serão gerenciados externamente ou manualmente. Foco em CRM operacional.

---

## 2. USUÁRIOS DO SISTEMA

### 2.1. Perfis

| Perfil | Responsabilidades | Permissões |
|--------|-------------------|------------|
| **Admin** | CEO/Founder - Gestão completa | Acesso total (CRUD em tudo) |
| **Comercial** | Vendas - Leads, Oportunidades, Atividades | CRUD em Empresas, Leads, Deals, Atividades |
| **Operações** | Projetos - Entregas e Tasks | CRUD em Projetos, Tasks, Updates |
| **Financeiro** | Finanças - Receitas e Despesas | CRUD em Transações, Parcelas |
| **Membro** | Visualização geral | Leitura em tudo, escrita limitada |

---

## 3. ARQUITETURA DE DADOS

### 3.1. Entidades do Banco

#### **profiles** (Usuários)
```sql
- id (UUID, FK auth.users)
- email (TEXT)
- full_name (TEXT)
- role (TEXT) -- admin, comercial, operacoes, financeiro, membro
- department (TEXT)
- avatar_url (TEXT)
- created_at, updated_at
```

#### **empresas** (Clientes & Leads)
```sql
- id (UUID)
- nome (TEXT) *required
- nome_fantasia (TEXT)
- cnpj (TEXT)
- tipo (TEXT) -- lead, cliente, ex-cliente
- status (TEXT) -- ativo, inativo, arquivado
- origem (TEXT) -- linkedin, site, indicacao, instagram, outros
- setor (TEXT)
- tamanho (TEXT) -- pequeno, medio, grande
- endereco (TEXT)
- cidade (TEXT)
- estado (TEXT)
- valor_total (DECIMAL) -- soma de contratos fechados
- created_at, updated_at
```

#### **contatos** (Contatos de Empresas)
```sql
- id (UUID)
- empresa_id (UUID, FK empresas)
- nome (TEXT) *required
- cargo (TEXT)
- email (TEXT)
- telefone (TEXT)
- linkedin (TEXT)
- is_primary (BOOLEAN) -- contato principal
- created_at, updated_at
```

#### **atividades** (Follow-ups e Interações) - **NOVA**
```sql
- id (UUID)
- empresa_id (UUID, FK empresas)
- deal_id (UUID, FK deals, nullable)
- tipo (TEXT) -- ligacao, reuniao, email, whatsapp, outros
- titulo (TEXT) *required
- descricao (TEXT)
- data_atividade (TIMESTAMP)
- proximo_passo (TEXT)
- data_followup (DATE)
- status (TEXT) -- pendente, concluido, cancelado
- responsavel_id (UUID, FK profiles)
- created_at, updated_at
```

#### **deals** (Oportunidades)
```sql
- id (UUID)
- empresa_id (UUID, FK empresas)
- titulo (TEXT) *required
- descricao (TEXT)
- valor (DECIMAL) *required
- estagio (TEXT) -- descoberta, diagnostico, proposta, negociacao, fechado_ganho, fechado_perdido
- probabilidade (INTEGER) -- 0-100
- data_fechamento_prevista (DATE)
- data_fechamento_real (DATE)
- motivo_perda (TEXT) -- se perdido
- responsavel_id (UUID, FK profiles)
- created_at, updated_at
```

#### **projects** (Projetos)
```sql
- id (UUID)
- empresa_id (UUID, FK empresas)
- deal_id (UUID, FK deals, nullable) -- vinculação opcional
- nome (TEXT) *required
- descricao (TEXT)
- tipo (TEXT) -- site, app, crm, landing, ecommerce, outros
- status (TEXT) -- planejamento, design, desenvolvimento, qa, entregue, manutencao
- health (TEXT) -- on_track, at_risk, off_track
- progress (INTEGER) -- 0-100
- deadline (DATE)
- owner_id (UUID, FK profiles)
- valor_projeto (DECIMAL)
- created_at, updated_at
```

#### **tasks** (Tarefas de Projetos)
```sql
- id (UUID)
- project_id (UUID, FK projects)
- title (TEXT) *required
- description (TEXT)
- status (TEXT) -- todo, in_progress, review, done
- priority (TEXT) -- low, medium, high, urgent
- assignee_id (UUID, FK profiles)
- due_date (DATE)
- created_at, updated_at
```

#### **project_updates** (Atualizações de Projetos)
```sql
- id (UUID)
- project_id (UUID, FK projects)
- author_id (UUID, FK profiles)
- content (TEXT) *required
- health (TEXT) -- snapshot do health
- created_at
```

#### **parcelas** (Recebíveis) - **RENOMEADA de installments**
```sql
- id (UUID)
- empresa_id (UUID, FK empresas)
- deal_id (UUID, FK deals, nullable)
- descricao (TEXT) *required
- numero_parcela (INTEGER)
- valor (DECIMAL) *required
- data_vencimento (DATE) *required
- data_pagamento (DATE)
- status (TEXT) -- pendente, pago, atrasado, cancelado
- observacoes (TEXT)
- created_at, updated_at
```

#### **transactions** (Fluxo de Caixa)
```sql
- id (UUID)
- descricao (TEXT) *required
- valor (DECIMAL) *required
- tipo (TEXT) -- entrada, saida
- categoria (TEXT) -- servico, produto, salario, infra, marketing, impostos, outros
- data_transacao (DATE) *required
- status (TEXT) -- realizado, previsto
- comprovante_url (TEXT)
- created_at, updated_at
```

#### **goals** (Metas)
```sql
- id (UUID)
- titulo (TEXT) *required
- meta (DECIMAL) *required
- atual (DECIMAL) -- calculado automaticamente
- periodo (TEXT) -- mensal, trimestral, anual
- tipo (TEXT) -- faturamento, vendas, leads, projetos
- data_inicio (DATE)
- data_fim (DATE)
- created_at, updated_at
```

### 3.2. Relacionamentos

```
empresas 1---N contatos
empresas 1---N atividades
empresas 1---N deals
empresas 1---N projects
empresas 1---N parcelas

deals 1---N atividades
deals 1---1 projects (opcional)
deals 1---N parcelas (opcional)

projects 1---N tasks
projects 1---N project_updates

profiles 1---N atividades (responsavel)
profiles 1---N deals (responsavel)
profiles 1---N projects (owner)
profiles 1---N tasks (assignee)
```

---

## 4. MÓDULOS E FUNCIONALIDADES

### 4.1. HQ (Headquarters) - Dashboard Estratégico

**Rota:** `/hq`

**Funcionalidades:**
- KPIs vitais (Receita Total, Lucro, Burn Rate, Runway)
- Metas e OKRs com progresso
- Saúde do time (capacidade, utilização)
- Visão executiva da operação

**Dados Exibidos:**
- Receita recebida (mês atual)
- Lucro líquido
- Burn rate
- Runway estimado (meses)
- Progresso de metas ativas
- Total de colaboradores
- Projetos ativos
- Utilização geral do time

### 4.2. Empresas

**Rota:** `/empresas`

**Funcionalidades:**
- ✅ Listar todas as empresas
- ✅ Filtrar por tipo (lead, cliente, ex-cliente)
- ✅ Buscar por nome
- ✅ Criar nova empresa (modal)
- ✅ Editar empresa (modal)
- ✅ Ver detalhes da empresa (página dedicada)
- ✅ Deletar empresa (com confirmação)

**Página de Detalhes (`/empresas/[id]`):**
- Informações da empresa
- Lista de contatos
- Histórico de atividades
- Oportunidades associadas
- Projetos associados
- Parcelas associadas

### 4.3. Contatos

**Rota:** `/empresas/[id]/contatos` (integrado em Empresas)

**Funcionalidades:**
- ✅ Listar contatos da empresa
- ✅ Criar novo contato (modal)
- ✅ Editar contato (modal)
- ✅ Marcar contato principal
- ✅ Deletar contato

### 4.4. Banco de Leads

**Rota:** `/leads`

**Funcionalidades:**
- ✅ Listar todos os leads (empresas com tipo="lead")
- ✅ Filtrar por status (novo, qualificando, arquivado)
- ✅ Filtrar por origem
- ✅ Buscar por nome/empresa
- ✅ Criar novo lead (modal)
- ✅ Importar leads (CSV)
- ✅ Converter lead em cliente
- ✅ Criar oportunidade a partir de lead

### 4.5. Atividades / Follow-ups - **NOVO MÓDULO**

**Rota:** `/atividades`

**Funcionalidades:**
- ✅ Listar todas as atividades
- ✅ Filtrar por tipo (ligação, reunião, email, whatsapp)
- ✅ Filtrar por status (pendente, concluído)
- ✅ Filtrar por responsável
- ✅ Criar nova atividade (modal)
- ✅ Editar atividade (modal)
- ✅ Marcar como concluída
- ✅ Agendar follow-up
- ✅ Vincular a empresa ou deal

**Visualizações:**
- Lista (padrão)
- Calendário (próximos follow-ups)
- Timeline (histórico)

### 4.6. Oportunidades (Pipeline de Vendas)

**Rota:** `/oportunidades`

**Funcionalidades:**
- ✅ Kanban com 5 etapas (descoberta → fechado)
- ✅ Drag & drop funcional
- ✅ Criar nova oportunidade (modal)
- ✅ Editar oportunidade (modal)
- ✅ Mover entre etapas
- ✅ Marcar como ganho/perdido
- ✅ Registrar motivo da perda
- ✅ Ver detalhes (modal ou página)
- ✅ Criar projeto ao ganhar deal
- ✅ Criar parcelas ao ganhar deal

**Etapas:**
1. Descoberta
2. Diagnóstico
3. Proposta
4. Negociação
5. Fechado (ganho/perdido)

**Cards exibem:**
- Nome da empresa
- Valor
- Responsável
- Probabilidade
- Data prevista de fechamento

### 4.7. Projetos

**Rota:** `/projetos`

**Funcionalidades:**
- ✅ 3 visualizações: Portfolio, Board, Timeline
- ✅ Criar novo projeto (modal)
- ✅ Editar projeto (modal)
- ✅ Atualizar status e health
- ✅ Atualizar progresso (0-100%)
- ✅ Criar tasks (modal)
- ✅ Atribuir tasks a membros
- ✅ Adicionar updates (modal)
- ✅ Ver detalhes do projeto (página dedicada)

**Página de Detalhes (`/projetos/[id]`):**
- Informações do projeto
- Lista de tasks (Kanban)
- Timeline de updates
- Membros do projeto
- Arquivos (futuro)

### 4.8. Financeiro

**Rota:** `/financeiro`

**Funcionalidades:**
- ✅ KPIs financeiros (Receita Recebida, Prevista, Lucro, Burn Rate)
- ✅ Gráfico de fluxo de caixa (entradas vs saídas)
- ✅ Lista de parcelas pendentes
- ✅ Marcar parcela como paga
- ✅ Registrar entrada manual (modal)
- ✅ Registrar saída (modal)
- ✅ Filtrar por período
- ✅ Exportar relatório

**Abas:**
1. Visão Geral (KPIs + Gráfico)
2. Parcelas (recebíveis)
3. Transações (entradas e saídas)

### 4.9. Metas & KPIs

**Rota:** `/metas`

**Funcionalidades:**
- ✅ Listar todas as metas
- ✅ Criar nova meta (modal)
- ✅ Editar meta (apenas se não iniciada)
- ✅ Ver progresso em tempo real
- ✅ Gráfico de evolução

**Tipos de Meta:**
- Faturamento (R$)
- Vendas (quantidade de deals)
- Leads (quantidade)
- Projetos (quantidade)

### 4.10. Equipe

**Rota:** `/equipe`

**Funcionalidades:**
- ✅ Grid de colaboradores
- ✅ Ver perfil do colaborador
- ✅ Ver projetos ativos
- ✅ Ver tasks atribuídas
- ✅ Convidar novo membro (admin)
- ✅ Editar permissões (admin)

---

## 5. FLUXOS DE NEGÓCIO

### 5.1. Fluxo Comercial

```
1. Lead criado (manual ou importação)
   ↓
2. Atividades registradas (follow-ups)
   ↓
3. Lead convertido em Cliente
   ↓
4. Oportunidade criada
   ↓
5. Oportunidade movida pelo pipeline
   ↓
6. Deal marcado como "Ganho"
   ↓
7. Sistema pergunta: "Criar projeto?" (opcional)
   ↓
8. Sistema pergunta: "Criar parcelas?" (opcional)
   ↓
9. Projeto criado automaticamente (se sim)
   ↓
10. Parcelas criadas (se sim)
```

### 5.2. Fluxo Financeiro

```
1. Parcelas criadas (manual ou via deal)
   ↓
2. Parcelas aparecem em "Pendentes"
   ↓
3. Usuário marca parcela como "Paga"
   ↓
4. Sistema registra data de pagamento
   ↓
5. Parcela vira "Entrada" em Transações
   ↓
6. KPIs recalculam automaticamente
   ↓
7. Dashboards atualizam
```

### 5.3. Fluxo de Projetos

```
1. Projeto criado (via deal ou manual)
   ↓
2. Tasks criadas
   ↓
3. Tasks atribuídas a membros
   ↓
4. Membros atualizam status das tasks
   ↓
5. Progresso do projeto atualiza automaticamente
   ↓
6. Updates adicionados (opcional)
   ↓
7. Health atualizado (manual)
   ↓
8. Projeto marcado como "Entregue"
```

### 5.4. Fluxo de KPIs

```
1. Dados inseridos no sistema (deals, parcelas, projetos)
   ↓
2. Triggers calculam KPIs automaticamente
   ↓
3. Metas comparam com valores atuais
   ↓
4. Dashboards atualizam em tempo real
```

---

## 6. REGRAS DE NEGÓCIO

### 6.1. Empresas
- Empresa pode ser lead, cliente ou ex-cliente
- Ao converter lead em cliente, tipo muda automaticamente
- Valor total = soma de todos os deals fechados

### 6.2. Deals
- Deal só pode ser marcado como "ganho" ou "perdido" no estágio "Fechado"
- Se perdido, motivo da perda é obrigatório
- Ao marcar como ganho, sistema oferece criar projeto e/ou parcelas
- Probabilidade aumenta conforme avança no pipeline (sugestão automática)

### 6.3. Parcelas
- Status muda automaticamente para "atrasado" se vencimento < hoje e status = pendente
- Ao marcar como "paga", data_pagamento = hoje (editável)
- Parcela paga cria transação de entrada automaticamente

### 6.4. Projetos
- Progresso calculado automaticamente: (tasks concluídas / total tasks) * 100
- Health atualizado manualmente pelo owner
- Projeto só pode ser deletado se não tiver tasks

### 6.5. KPIs
- Receita Recebida = soma de parcelas pagas
- Receita Prevista = soma de parcelas pendentes (não atrasadas)
- Lucro = Receita Recebida - Despesas
- Burn Rate = média de despesas dos últimos 3 meses
- Taxa de Fechamento = (deals ganhos / total deals fechados) * 100

### 6.6. Metas
- Progresso calculado automaticamente a partir de dados reais
- Meta não pode ser editada após data_inicio
- Meta pode ser deletada apenas se não iniciada

---

## 7. REQUISITOS NÃO FUNCIONAIS

### 7.1. Performance
- Dashboard deve carregar em < 2s
- Queries otimizadas com índices
- Paginação em listas com > 50 itens
- Lazy loading de imagens

### 7.2. Segurança
- RLS (Row Level Security) em todas as tabelas
- Autenticação obrigatória
- Permissões por role
- Logs de auditoria (quem fez o quê, quando)

### 7.3. UX/UI
- Design system MAINFRAME (já implementado)
- Loading states em todas as ações
- Mensagens de sucesso/erro (toasts)
- Confirmação antes de deletar
- Validação de formulários
- Empty states em listas vazias

### 7.4. Escalabilidade
- Suportar até 1000 empresas
- Suportar até 50 usuários simultâneos
- Backup automático diário

---

## 8. PRIORIZAÇÃO (MVP)

### 8.1. FASE 1 - Fundação (4 semanas)
**Objetivo:** Sistema funcional básico

- ✅ Autenticação habilitada
- ✅ Empresas (CRUD completo)
- ✅ Contatos (CRUD completo)
- ✅ Leads (listagem + criação)
- ✅ Integração Supabase em todas as páginas
- ✅ Validações de formulário

### 8.2. FASE 2 - Core CRM (4 semanas)
**Objetivo:** Pipeline de vendas funcional

- ✅ Atividades (módulo completo)
- ✅ Oportunidades (Kanban funcional)
- ✅ Fluxo Lead → Deal
- ✅ Fluxo Deal → Projeto
- ✅ Páginas de detalhes (empresa, deal)

### 8.3. FASE 3 - Projetos (3 semanas)
**Objetivo:** Gestão de entregas

- ✅ Projetos (CRUD completo)
- ✅ Tasks (Kanban funcional)
- ✅ Updates (timeline)
- ✅ Página de detalhes de projeto

### 8.4. FASE 4 - Financeiro (3 semanas)
**Objetivo:** Controle de caixa

- ✅ Parcelas (CRUD + marcar como pago)
- ✅ Transações (CRUD)
- ✅ Fluxo Deal → Parcelas
- ✅ Cálculo automático de KPIs
- ✅ Relatórios básicos

### 8.5. FASE 5 - Metas & Polimento (2 semanas)
**Objetivo:** Inteligência e refinamento

- ✅ Metas (CRUD + cálculo automático)
- ✅ Dashboards com dados reais
- ✅ Filtros funcionais em todos os módulos
- ✅ Exportação de dados
- ✅ Testes e correções

**TOTAL MVP:** 16 semanas (4 meses)

---

## 9. MÉTRICAS DE SUCESSO

### 9.1. Adoção
- 100% dos usuários ativos diariamente
- Redução de 80% no uso de planilhas

### 9.2. Operação
- Redução de 50% na perda de leads
- Aumento de 30% na taxa de fechamento
- Redução de 40% em atrasos de projetos

### 9.3. Financeiro
- Previsão de caixa com 90% de acurácia
- Redução de 60% na inadimplência

---

## 10. FORA DO ESCOPO (V2 ou Nunca)

### 10.1. Removido Definitivamente
- ❌ Geração automática de contratos
- ❌ Templates de contrato
- ❌ Assinatura digital
- ❌ Gestão de contratos complexa

### 10.2. Deixado para V2
- ⏸️ Integrações externas (Slack, email, etc.)
- ⏸️ Automações complexas (Zapier-like)
- ⏸️ Relatórios customizáveis
- ⏸️ Mobile app
- ⏸️ API pública
- ⏸️ Webhooks

---

**FIM DO PRD 2.0**
