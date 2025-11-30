# ANÁLISE DE DIVERGÊNCIAS E LACUNAS
**VISMO CRM - Software House**  
**Data:** 30 de Novembro de 2025  
**Comparação:** PRD Original vs. Sistema Atual  

---

## SUMÁRIO EXECUTIVO

### 📊 Visão Geral da Divergência

| Categoria | PRD Original | Sistema Atual | Gap % |
|-----------|--------------|---------------|-------|
| **Módulos** | 12 módulos | 10 telas | 17% faltando |
| **Funcionalidades** | 100% especificadas | 25% funcionais | 75% gap |
| **Fluxos de Negócio** | 4 fluxos completos | 0 fluxos funcionais | 100% gap |
| **Integrações** | Dados reais + automações | 100% mock data | 100% gap |
| **Autenticação** | Sistema completo | Desabilitada | 100% gap |

### 🎯 Classificação de Divergências

- 🔴 **CRÍTICAS:** 15 divergências (bloqueiam operação)
- 🟡 **IMPORTANTES:** 12 divergências (limitam funcionalidade)
- 🟢 **DESEJÁVEIS:** 8 divergências (melhorias UX)

---

## 1. DIVERGÊNCIAS POR MÓDULO

### 1.1. Módulo: EMPRESAS (Clientes/Leads)

#### PRD Original Especificava:
- ✅ Criar empresa
- ✅ Editar empresa
- ✅ Definir tipo: lead, cliente, ex-cliente
- ✅ Associar contatos
- ✅ Ver histórico de atividades
- ✅ Ver oportunidades associadas
- ✅ Ver contratos associados
- ✅ Ver projetos associados

#### Sistema Atual Tem:
- ✅ Tabela `empresas` no banco (completa)
- ✅ Tela de listagem (`/empresas`)
- ✅ Filtros por tipo (UI apenas)
- ✅ Busca (UI apenas)
- ✅ Server Action `getEmpresas()`
- ✅ Server Action `createEmpresa()`
- ✅ Server Action `updateEmpresa()`

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Dados Mock** - Tela usa `mockEmpresas` ao invés de `getEmpresas()`
2. **Botão "Nova Empresa" não funciona** - Sem modal de criação
3. **Botão "Ver" não funciona** - Sem página de detalhes
4. **Filtros não funcionam** - Apenas UI estática
5. **Busca não funciona** - Apenas UI estática

#### 🟡 DIVERGÊNCIAS IMPORTANTES:
6. **Sem página de detalhes** - PRD pede visualização completa
7. **Sem histórico de atividades** - Não implementado
8. **Sem visualização de oportunidades associadas** - Não implementado
9. **Sem visualização de contratos associados** - Não implementado
10. **Sem visualização de projetos associados** - Não implementado

#### 🟢 DIVERGÊNCIAS DESEJÁVEIS:
11. **Sem edição inline** - PRD não especifica mas é UX esperada
12. **Sem exportação** - Funcionalidade comum em CRMs

---

### 1.2. Módulo: CONTATOS

#### PRD Original Especificava:
- ✅ Criar contato vinculado a empresa
- ✅ Selecionar contato principal
- ✅ Registrar email/telefone/cargo

#### Sistema Atual Tem:
- ✅ Tabela `contatos` no banco (completa)
- ❌ **NENHUMA TELA** dedicada a contatos
- ❌ **NENHUMA SERVER ACTION** para contatos

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **MÓDULO COMPLETAMENTE AUSENTE** - Não há tela de contatos
2. **Sem CRUD de contatos** - Impossível gerenciar contatos
3. **Contatos não aparecem em Empresas** - Sem integração

#### **IMPACTO:** 🔴 ALTO - Contatos são essenciais para CRM, impossível fazer follow-ups sem isso.

---

### 1.3. Módulo: PROSPEÇÕES / LEADS

#### PRD Original Especificava:
- ✅ Criar lead
- ✅ Definir status: novo, qualificando, proposta, negociando, perdido
- ✅ Registrar interesse
- ✅ Registrar origem
- ✅ Registrar ticket estimado

#### Sistema Atual Tem:
- ⚠️ **CONFUSÃO CONCEITUAL:** Tela `/leads` existe mas é "Banco de Leads"
- ✅ Listagem de leads com filtros (UI)
- ✅ Status: novo, qualificando, arquivado (diferente do PRD)
- ✅ Origem: linkedin, site, indicação, instagram
- ❌ **Sem tabela `prospeccoes`** no banco
- ❌ Leads são empresas com tipo="lead"

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Modelo de dados diferente** - PRD pede tabela `prospeccoes`, sistema usa `empresas.tipo`
2. **Status diferentes** - PRD: novo/qualificando/proposta/negociando/perdido vs. Sistema: novo/qualificando/arquivado
3. **Sem ticket estimado** - Campo não existe
4. **Sem interesse** - Campo não existe
5. **Dados mock** - Tela usa `mockLeads`

#### 🟡 DIVERGÊNCIAS IMPORTANTES:
6. **Sem conversão Lead → Oportunidade** - Fluxo não implementado
7. **Botão "Importar" não funciona** - Funcionalidade crítica para vendas

#### **DECISÃO ARQUITETURAL NECESSÁRIA:** 
- Manter `empresas.tipo="lead"` (mais simples) OU
- Criar tabela `prospeccoes` separada (mais granular, como PRD)

---

### 1.4. Módulo: OPORTUNIDADES (Deals)

#### PRD Original Especificava:
- ✅ Criar oportunidade vinculada a empresa
- ✅ Etapas: Descoberta, Diagnóstico, Proposta, Negociação, Fechado (ganho/perdido)
- ✅ Registrar valor total do contrato
- ✅ Registrar previsão de fechamento
- ✅ Registrar data real do fechamento
- ✅ Registrar motivo da perda

#### Sistema Atual Tem:
- ✅ Tabela `deals` no banco (completa)
- ✅ Tela `/oportunidades` com Kanban
- ✅ 5 etapas: descoberta, diagnostico, proposta, negociacao, fechado
- ✅ Cards com empresa, valor, responsável
- ✅ Server Actions: `getDeals()`, `createDeal()`, `updateDeal()`

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Dados mock** - Tela usa `mockOportunidades`
2. **Kanban não funciona** - Não dá pra arrastar cards
3. **Sem modal de criação** - Botão não existe
4. **Sem modal de edição** - Não dá pra clicar nos cards
5. **Sem distinção fechado_ganho vs fechado_perdido** - Apenas "fechado"

#### 🟡 DIVERGÊNCIAS IMPORTANTES:
6. **Sem campo "motivo da perda"** - Não existe no banco
7. **Sem campo "data_fechamento_real"** - Não existe no banco
8. **Sem conversão Deal → Contrato** - Fluxo não implementado
9. **Sem filtros** - PRD não especifica mas é essencial

#### 🟢 DIVERGÊNCIAS DESEJÁVEIS:
10. **Sem probabilidade visual** - Campo existe no banco mas não aparece
11. **Sem previsão de fechamento** - Campo existe mas não aparece

---

### 1.5. Módulo: ATIVIDADES / FOLLOW-UPS

#### PRD Original Especificava:
- ✅ Criar atividade (ligação, reunião, WhatsApp, email)
- ✅ Registrar descrição
- ✅ Registrar próximo passo
- ✅ Registrar data para followup
- ✅ Marcar como concluído
- ✅ Vincular com Empresa ou Deal

#### Sistema Atual Tem:
- ❌ **NENHUMA TABELA** `atividades` no banco
- ⚠️ Apenas `mockAtividades` na tela `/dashboard`
- ❌ **NENHUMA TELA** dedicada a atividades
- ❌ **NENHUMA SERVER ACTION** para atividades

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **MÓDULO COMPLETAMENTE AUSENTE** - Crítico para CRM
2. **Sem gestão de follow-ups** - Impossível fazer vendas estruturadas
3. **Sem histórico de interações** - Perde contexto do cliente

#### **IMPACTO:** 🔴 CRÍTICO - Atividades são o coração de um CRM. Sem isso, não é CRM.

---

### 1.6. Módulo: CONTRATOS

#### PRD Original Especificava:
- ✅ Criar contrato vinculado ao Deal
- ✅ Selecionar template
- ✅ Gerar contrato automático com variáveis
- ✅ Finalizar em PDF
- ✅ Registrar valor total
- ✅ Registrar condições de pagamento
- ✅ Gerar parcelas automaticamente
- ✅ Registrar assinatura (manual ou digital)

#### Sistema Atual Tem:
- ✅ Tabela `contracts` no banco
- ✅ Tabela `installments` no banco
- ✅ Server Actions: `getContracts()`, `createContract()`
- ❌ **NENHUMA TELA** dedicada a contratos
- ❌ **NENHUMA TABELA** `templates_contrato`
- ❌ **NENHUMA TABELA** `contratos_gerados`

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **MÓDULO AUSENTE** - Sem tela de contratos
2. **Sem geração automática** - Funcionalidade core não implementada
3. **Sem templates** - Tabela não existe
4. **Sem geração de PDF** - Não implementado
5. **Sem geração automática de parcelas** - Lógica não existe
6. **Sem vinculação Deal → Contrato** - Fluxo não implementado

#### 🟡 DIVERGÊNCIAS IMPORTANTES:
7. **Contratos aparecem apenas em Financeiro** - Como parcelas, não como módulo
8. **Sem assinatura digital** - Não implementado

#### **IMPACTO:** 🔴 CRÍTICO - Geração de contratos é diferencial do sistema.

---

### 1.7. Módulo: FINANCEIRO

#### PRD Original Especificava:

**Entradas:**
- ✅ Registro automático de parcelas
- ✅ Registro manual de entrada extra
- ✅ Marcar parcelas como pagas
- ✅ Atraso automático após vencimento
- ✅ Fluxo financeiro mensal/trimestral/anual

**Saídas:**
- ✅ Registrar custos fixos
- ✅ Registrar custos variáveis
- ✅ Registrar imposto
- ✅ Associar saída a categoria

**Relatórios:**
- ✅ Receita recebida
- ✅ Receita prevista
- ✅ Volume contratado
- ✅ Lucro
- ✅ Burn rate
- ✅ Inadimplência

#### Sistema Atual Tem:
- ✅ Tabela `contracts` no banco
- ✅ Tabela `installments` no banco
- ✅ Tabela `transactions` no banco
- ✅ Tela `/financeiro` com KPIs + Gráfico + Parcelas
- ✅ Server Actions: `getContracts()`, `createContract()`, `registerTransaction()`, `getCashFlow()`

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Dados mock** - Tela usa `mockFinanceiro`, `mockFluxoCaixa`, `mockParcelas`
2. **Sem marcar parcela como paga** - Funcionalidade não implementada
3. **Sem registro de saídas** - Apenas visualização
4. **Sem atraso automático** - Lógica não existe
5. **Sem registro manual de entrada** - Apenas visualização

#### 🟡 DIVERGÊNCIAS IMPORTANTES:
6. **Sem categorização de despesas** - Campo existe mas sem UI
7. **Sem filtros de período** - Sempre mostra tudo
8. **Sem inadimplência** - KPI não calculado
9. **Sem volume contratado** - KPI não calculado

#### 🟢 DIVERGÊNCIAS DESEJÁVEIS:
10. **Sem exportação de relatórios** - Funcionalidade comum
11. **Sem dashboards customizáveis** - Sempre fixo

---

### 1.8. Módulo: PROJETOS

#### PRD Original Especificava:
- ✅ Criar projeto vinculado ao contrato ou deal
- ✅ Selecionar tipo (site, app, CRM, landing, etc.)
- ✅ Definir status: Planejamento, Design, Desenvolvimento, QA, Entregue, Manutenção
- ✅ Registrar datas e deadlines
- ✅ Criar tasks (opcional)
- ✅ Acompanhar progresso

#### Sistema Atual Tem:
- ✅ Tabela `projects` no banco
- ✅ Tabela `tasks` no banco
- ✅ Tabela `project_updates` no banco
- ✅ Tela `/projetos` com 3 visualizações (Portfolio, Board, Timeline)
- ✅ Status: planejamento, design, desenvolvimento, qa, entregue (falta "manutenção")
- ✅ Health: on_track, at_risk, off_track
- ✅ Server Actions: `getProjects()`, `createProject()`, `updateProject()`, `createTask()`

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Dados mock** - Componentes usam `mockProjetos`, `mockTasks`
2. **Botão "Novo Projeto" não funciona** - Sem modal
3. **Board não funciona** - Não dá pra arrastar cards
4. **Sem vinculação Deal → Projeto** - Fluxo não implementado
5. **Sem vinculação Contrato → Projeto** - Fluxo não implementado

#### 🟡 DIVERGÊNCIAS IMPORTANTES:
6. **Falta status "Manutenção"** - PRD especifica 6 status, sistema tem 5
7. **Sem campo "tipo"** - Não existe no banco (site, app, CRM, etc.)
8. **Tasks não aparecem** - Tabela existe mas sem UI
9. **Updates não aparecem** - Tabela existe mas sem UI

#### 🟢 DIVERGÊNCIAS DESEJÁVEIS:
10. **Timeline não é real** - Apenas mock visual
11. **Sem filtros por status/health** - Funcionalidade esperada

---

### 1.9. Módulo: METAS & KPIs

#### PRD Original Especificava:

**KPIs de Vendas:**
- ✅ Leads qualificados
- ✅ Oportunidades abertas
- ✅ Taxa de fechamento
- ✅ Ticket médio
- ✅ Tempo médio de ciclo de venda
- ✅ Faturamento contratado

**KPIs de Projetos:**
- ✅ Projetos ativos
- ✅ Deadlines em risco
- ✅ Entregas no prazo
- ✅ Lead time médio

**KPIs Financeiros:**
- ✅ Receita recebida
- ✅ Receita prevista
- ✅ Lucro
- ✅ Burn rate
- ✅ Inadimplência
- ✅ LTV
- ✅ CAC (se houver dados)

**Metas:**
- ✅ Criar meta vinculada a KPI
- ✅ Definir período (mensal, trimestral, anual)
- ✅ Calcular progresso automático
- ✅ Exibir gráfico de evolução

#### Sistema Atual Tem:
- ✅ Tabela `goals` no banco
- ✅ Tela `/metas` com progress bars
- ✅ Tela `/hq` com KPIs vitais + OKRs
- ✅ Server Action: `getGoals()`, `getKPIs()`

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Dados mock** - Telas usam `mockMetas`, `mockKPIs`
2. **KPIs não calculados** - Todos os valores são hardcoded
3. **Sem cálculo automático** - Não há lógica de agregação
4. **Botão "Nova Meta" não funciona** - Sem modal

#### 🟡 DIVERGÊNCIAS IMPORTANTES:
5. **Faltam KPIs de Vendas:**
   - Leads qualificados ❌
   - Tempo médio de ciclo ❌
   - Faturamento contratado ❌

6. **Faltam KPIs de Projetos:**
   - Deadlines em risco ❌
   - Entregas no prazo ❌
   - Lead time médio ❌

7. **Faltam KPIs Financeiros:**
   - Inadimplência ❌
   - LTV ❌
   - CAC ❌

8. **Sem gráfico de evolução** - Apenas progress bar estática

#### 🟢 DIVERGÊNCIAS DESEJÁVEIS:
9. **Sem edição de metas** - PRD diz que não deve ser editável, mas sem UI pra criar
10. **Sem histórico de metas** - Não implementado

---

### 1.10. Módulo: PERFIL / CONFIGURAÇÕES

#### PRD Original Especificava:
- ✅ Tela de perfil
- ✅ Tela de configurações

#### Sistema Atual Tem:
- ❌ **NENHUMA TELA** de perfil
- ❌ **NENHUMA TELA** de configurações
- ⚠️ Avatar hardcoded na sidebar ("John Snow")

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **MÓDULO COMPLETAMENTE AUSENTE**
2. **Sem gestão de perfil de usuário**
3. **Sem configurações do sistema**

---

### 1.11. Módulo: EQUIPE / COLABORADORES

#### PRD Original Especificava:
- ⚠️ **NÃO ESTAVA NO PRD ORIGINAL**

#### Sistema Atual Tem:
- ✅ Tela `/equipe` - Grid de colaboradores
- ✅ Tela `/colaboradores` - Tabela de colaboradores
- ✅ Dados mock: `mockTeamMembers`
- ❌ **NENHUMA TABELA** no banco para colaboradores (além de `profiles`)

#### 🟡 DIVERGÊNCIAS IMPORTANTES:
1. **Módulo extra não especificado no PRD** - Decisão de implementação
2. **Duplicação de conceito** - `/equipe` vs `/colaboradores` fazem coisas similares
3. **Sem tabela dedicada** - Usa `profiles` mas sem campos específicos (categoria fixo/freela)
4. **Dados mock** - Não integrado com `profiles`

#### **DECISÃO NECESSÁRIA:**
- Manter ambas as telas OU consolidar em uma?
- Criar tabela `colaboradores` separada OU usar `profiles`?

---

## 2. DIVERGÊNCIAS NOS FLUXOS DE NEGÓCIO

### 2.1. Fluxo Comercial

#### PRD Especificava:
```
empresa → prospecção → deal → contrato → projeto
```

#### Sistema Atual:
```
empresa (mock) → ❌ → deal (mock) → ❌ → projeto (mock)
```

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Sem conversão Lead → Oportunidade** - Fluxo quebrado
2. **Sem conversão Deal → Contrato** - Fluxo quebrado
3. **Sem vinculação Contrato → Projeto** - Fluxo quebrado
4. **Nenhuma automação** - Tudo manual e desconectado

#### **IMPACTO:** 🔴 CRÍTICO - Fluxo comercial é o core do CRM.

---

### 2.2. Fluxo Financeiro

#### PRD Especificava:
```
contrato → parcelas (automáticas) → entrada (pago) → relatório
```

#### Sistema Atual:
```
contract (mock) → installments (mock) → ❌ → relatório (mock)
```

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Sem geração automática de parcelas** - Lógica não existe
2. **Sem marcar parcela como paga** - Funcionalidade não implementada
3. **Sem impacto automático no financeiro** - Não há trigger
4. **Sem cálculo de inadimplência** - Lógica não existe

#### **IMPACTO:** 🔴 CRÍTICO - Financeiro não funciona sem isso.

---

### 2.3. Fluxo de Projetos

#### PRD Especificava:
```
deal ganho → cria projeto → acompanha → entrega
```

#### Sistema Atual:
```
deal (mock) → ❌ → projeto (mock) → ❌ → ❌
```

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Sem criação automática de projeto** - Ao ganhar deal
2. **Sem acompanhamento real** - Tasks e updates não aparecem
3. **Sem marcação de entrega** - Status existe mas sem workflow

#### **IMPACTO:** 🟡 IMPORTANTE - Projetos funcionam isolados, sem conexão com vendas.

---

### 2.4. Fluxo de Metas/KPIs

#### PRD Especificava:
```
dados reais → cálculo automático → dashboards atualizados
```

#### Sistema Atual:
```
mock data → ❌ → dashboards estáticos
```

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Sem cálculo automático** - Todos os KPIs são hardcoded
2. **Sem agregação de dados** - Não há queries de agregação
3. **Sem atualização em tempo real** - Dashboards estáticos

#### **IMPACTO:** 🔴 CRÍTICO - KPIs são inúteis se não refletem realidade.

---

## 3. DIVERGÊNCIAS NA ARQUITETURA DE DADOS

### 3.1. Tabelas Faltantes (PRD vs. Sistema)

| Tabela PRD | Existe no Sistema? | Impacto |
|------------|-------------------|---------|
| `empresas` | ✅ Sim | - |
| `contatos` | ✅ Sim | ⚠️ Sem UI |
| `prospeccoes` | ❌ **NÃO** | 🔴 Usa `empresas.tipo` |
| `deals` | ✅ Sim | - |
| `atividades` | ❌ **NÃO** | 🔴 Módulo ausente |
| `contratos` | ✅ Sim (como `contracts`) | - |
| `parcelas` | ✅ Sim (como `installments`) | - |
| `entradas_saidas` | ✅ Sim (como `transactions`) | - |
| `projetos` | ✅ Sim (como `projects`) | - |
| `tasks` | ✅ Sim | ⚠️ Sem UI |
| `metas` | ✅ Sim (como `goals`) | - |
| `templates_contrato` | ❌ **NÃO** | 🔴 Geração não funciona |
| `contratos_gerados` | ❌ **NÃO** | 🔴 Histórico perdido |

### 3.2. Tabelas Extras (Sistema vs. PRD)

| Tabela Sistema | Estava no PRD? | Justificativa |
|----------------|----------------|---------------|
| `profiles` | ❌ NÃO | Necessária para Supabase Auth |
| `project_updates` | ❌ NÃO | Boa adição para acompanhamento |

### 3.3. Campos Faltantes

#### Tabela `deals`:
- ❌ `motivo_perda` - PRD especifica
- ❌ `data_fechamento_real` - PRD especifica
- ⚠️ `estagio` - Não distingue `fechado_ganho` vs `fechado_perdido`

#### Tabela `projects`:
- ❌ `tipo` - PRD especifica (site, app, CRM, landing)
- ⚠️ `status` - Falta "manutenção"

#### Tabela `empresas`:
- ❌ Campos de endereço completo (apenas `endereco`, `cidade`, `estado`)

---

## 4. DIVERGÊNCIAS NAS REGRAS DE NEGÓCIO

### 4.1. Regras do PRD vs. Sistema

| Regra PRD | Implementada? | Status |
|-----------|---------------|--------|
| Deal só vira contrato quando "ganho" | ❌ NÃO | 🔴 Fluxo não existe |
| Parcela gera impacto automático no financeiro | ❌ NÃO | 🔴 Sem trigger |
| Receita contratada ≠ receita recebida | ⚠️ PARCIAL | 🟡 Conceito existe mas não calculado |
| Projetos só existem vinculados a Deal/Contrato | ❌ NÃO | 🔴 Sem validação |
| KPIs recalculam a partir de dados reais | ❌ NÃO | 🔴 Tudo hardcoded |
| Metas não editáveis após criadas | ❌ NÃO | 🟡 Nem criação existe |

---

## 5. DIVERGÊNCIAS NA EXPERIÊNCIA DO USUÁRIO

### 5.1. Funcionalidades Esperadas vs. Implementadas

| Funcionalidade | PRD | Sistema | Gap |
|----------------|-----|---------|-----|
| **Criar registros** | ✅ Todos módulos | ❌ Nenhum funciona | 100% |
| **Editar registros** | ✅ Todos módulos | ❌ Nenhum funciona | 100% |
| **Deletar registros** | ⚠️ Implícito | ❌ Não implementado | 100% |
| **Filtrar dados** | ⚠️ Implícito | ⚠️ UI apenas | 100% |
| **Buscar dados** | ⚠️ Implícito | ⚠️ UI apenas | 100% |
| **Exportar dados** | ❌ Não especificado | ❌ Não implementado | - |
| **Notificações** | ❌ Não especificado | ❌ Não implementado | - |

### 5.2. Interações Quebradas

#### Botões que não funcionam:
1. ❌ "Nova Empresa" (`/empresas`)
2. ❌ "Novo Lead" (`/leads`)
3. ❌ "Importar" (`/leads`)
4. ❌ "Novo Projeto" (`/projetos`)
5. ❌ "Nova Meta" (`/metas`)
6. ❌ "Novo Colaborador" (`/colaboradores`)
7. ❌ "Ver" (todos os módulos)

#### Funcionalidades visuais que não funcionam:
1. ❌ Drag & drop no Kanban de Oportunidades
2. ❌ Drag & drop no Board de Projetos
3. ❌ Filtros de busca (todos os módulos)
4. ❌ Ordenação de tabelas
5. ❌ Paginação

---

## 6. DIVERGÊNCIAS NA AUTENTICAÇÃO E PERMISSÕES

### 6.1. PRD Especificava

#### Usuários:
1. **CEO / Founder** - Acompanha metas, confere indicadores, aprova contratos
2. **Comercial** - Registra leads, gera oportunidades, follow-ups
3. **Operações** - Visualiza projetos, atualiza status
4. **Financeiro** - Registra entradas/saídas, marca parcelas pagas

#### Permissões:
- ⚠️ PRD não especifica sistema de permissões detalhado
- ⚠️ Menciona "multiuser com permissões" nos requisitos não funcionais

### 6.2. Sistema Atual Tem

#### RLS Policies:
- ✅ `admin` - Acesso total
- ✅ `member` - Leitura em tudo, escrita limitada

#### Middleware:
- ❌ **DESABILITADO** - Comentado para desenvolvimento
- ❌ Sem proteção de rotas
- ❌ Sem gestão de sessão

#### 🔴 DIVERGÊNCIAS CRÍTICAS:
1. **Autenticação desabilitada** - Sistema aberto
2. **Sem gestão de usuários** - Não dá pra criar/editar usuários
3. **Sem atribuição de roles** - Hardcoded
4. **Sem login/logout** - Não implementado
5. **Sem tela de onboarding** - Não implementado

---

## 7. DIVERGÊNCIAS NOS REQUISITOS NÃO FUNCIONAIS

### 7.1. PRD Especificava

| Requisito | Especificação | Sistema Atual | Status |
|-----------|---------------|---------------|--------|
| **Performance** | Dashboard < 1s | ⚠️ Não medido | 🟡 Provável OK (mock) |
| **API** | REST ou GraphQL | ✅ REST (Next.js) | ✅ OK |
| **Segurança** | Criptografia de dados | ✅ Supabase | ✅ OK |
| **Multiuser** | Com permissões | ⚠️ RLS existe | 🟡 Parcial |
| **Responsivo** | Web-first | ✅ Tailwind | ✅ OK |
| **Logs** | Auditoria | ❌ Não implementado | 🔴 Ausente |
| **Escalável** | Mais usuários | ✅ Supabase | ✅ OK |
| **Integrações** | Fácil integrar | ✅ API Routes | ✅ OK |

### 7.2. Gaps Críticos

1. **Sem logs de auditoria** - Impossível rastrear mudanças
2. **Sem validação de dados** - Aceita qualquer coisa
3. **Sem tratamento de erros** - Crashes silenciosos
4. **Sem loading states** - UX ruim
5. **Sem mensagens de feedback** - Usuário não sabe o que aconteceu

---

## 8. PROBLEMAS ESTRUTURAIS IDENTIFICADOS

### 8.1. Arquitetura

#### 🔴 PROBLEMA 1: Desconexão Frontend-Backend
- **Sintoma:** Server Actions existem mas não são usadas
- **Causa:** Desenvolvimento focou em UI primeiro
- **Impacto:** Sistema não funcional
- **Solução:** Integrar todas as páginas com Server Actions

#### 🔴 PROBLEMA 2: Dados Mock Hardcoded
- **Sintoma:** `mockData` em todas as páginas
- **Causa:** Desenvolvimento sem backend conectado
- **Impacto:** Impossível testar fluxos reais
- **Solução:** Substituir todos os mocks por queries reais

#### 🔴 PROBLEMA 3: Fluxos Desconectados
- **Sintoma:** Módulos não conversam entre si
- **Causa:** Falta de lógica de negócio
- **Impacto:** CRM não funciona como sistema integrado
- **Solução:** Implementar workflows e automações

### 8.2. Código

#### 🟡 PROBLEMA 4: Duplicação de Conceitos
- **Sintoma:** `/equipe` vs `/colaboradores`, `/dashboard` vs `/hq`
- **Causa:** Falta de planejamento de rotas
- **Impacto:** Confusão para usuário
- **Solução:** Consolidar ou diferenciar claramente

#### 🟡 PROBLEMA 5: Componentes Não Reutilizados
- **Sintoma:** Código repetido em várias páginas
- **Causa:** Desenvolvimento rápido sem refatoração
- **Impacto:** Manutenção difícil
- **Solução:** Criar componentes compartilhados

### 8.3. UX

#### 🟡 PROBLEMA 6: Botões Não Funcionais
- **Sintoma:** Todos os botões de ação não fazem nada
- **Causa:** UI implementada sem backend
- **Impacto:** Frustração do usuário
- **Solução:** Implementar modais e formulários

#### 🟢 PROBLEMA 7: Falta de Feedback Visual
- **Sintoma:** Sem loading, sem mensagens de erro/sucesso
- **Causa:** Foco em happy path
- **Impacto:** UX ruim
- **Solução:** Adicionar estados de loading e toasts

---

## 9. INCONSISTÊNCIAS ENTRE VISÃO INICIAL E CÓDIGO

### 9.1. Visão do PRD

> "Criar um CRM proprietário para uma software house com operação de prospecção e vendas, gerenciamento de clientes, gerenciamento de projetos, financeiro baseado em contratos e parcelas, geração automática de contratos, gestão de metas e KPIs."

### 9.2. Realidade do Código

> "Protótipo visual de um CRM com design system robusto, telas principais implementadas, mas sem funcionalidade real. Todos os dados são mock, nenhum fluxo de negócio funciona, módulos críticos estão ausentes."

### 9.3. Principais Inconsistências

1. **PRD promete "núcleo operacional do negócio"** → Sistema é apenas interface
2. **PRD promete "substituir Notion, planilhas, Pipefy"** → Sistema não substitui nada ainda
3. **PRD promete "geração automática de contratos"** → Funcionalidade não existe
4. **PRD promete "clareza financeira"** → Dados são fictícios
5. **PRD promete "inteligência de operação"** → KPIs não calculam nada

---

## 10. MATRIZ DE PRIORIZAÇÃO

### 10.1. Critérios

- **Impacto no Negócio:** Quanto afeta a operação?
- **Complexidade:** Quanto esforço para implementar?
- **Dependências:** Bloqueia outras features?

### 10.2. Divergências Priorizadas

#### 🔴 P0 - CRÍTICAS (Fazer AGORA)

| # | Divergência | Impacto | Complexidade | Esforço |
|---|-------------|---------|--------------|---------|
| 1 | Integrar Supabase em todas as páginas | 🔴 Alto | 🟡 Média | 2-3 semanas |
| 2 | Implementar CRUD completo (modais) | 🔴 Alto | 🟡 Média | 3-4 semanas |
| 3 | Criar módulo de Atividades | 🔴 Alto | 🟡 Média | 2 semanas |
| 4 | Criar módulo de Contatos | 🔴 Alto | 🟢 Baixa | 1 semana |
| 5 | Implementar fluxo Deal → Contrato | 🔴 Alto | 🔴 Alta | 2 semanas |
| 6 | Implementar geração automática de parcelas | 🔴 Alto | 🟡 Média | 1 semana |
| 7 | Habilitar autenticação | 🔴 Alto | 🟢 Baixa | 3 dias |
| 8 | Implementar cálculo real de KPIs | 🔴 Alto | 🟡 Média | 1-2 semanas |

#### 🟡 P1 - IMPORTANTES (Fazer DEPOIS)

| # | Divergência | Impacto | Complexidade | Esforço |
|---|-------------|---------|--------------|---------|
| 9 | Criar módulo de Contratos | 🟡 Médio | 🟡 Média | 1-2 semanas |
| 10 | Implementar templates de contrato | 🟡 Médio | 🔴 Alta | 2-3 semanas |
| 11 | Implementar geração de PDF | 🟡 Médio | 🟡 Média | 1 semana |
| 12 | Criar página de detalhes (empresa, deal, projeto) | 🟡 Médio | 🟢 Baixa | 1-2 semanas |
| 13 | Implementar filtros funcionais | 🟡 Médio | 🟢 Baixa | 1 semana |
| 14 | Implementar busca funcional | 🟡 Médio | 🟢 Baixa | 1 semana |
| 15 | Adicionar validações de formulário | 🟡 Médio | 🟢 Baixa | 1 semana |

#### 🟢 P2 - DESEJÁVEIS (Fazer QUANDO POSSÍVEL)

| # | Divergência | Impacto | Complexidade | Esforço |
|---|-------------|---------|--------------|---------|
| 16 | Implementar drag & drop em Kanbans | 🟢 Baixo | 🟡 Média | 1 semana |
| 17 | Adicionar exportação de dados | 🟢 Baixo | 🟢 Baixa | 3 dias |
| 18 | Implementar notificações | 🟢 Baixo | 🟡 Média | 1 semana |
| 19 | Adicionar logs de auditoria | 🟢 Baixo | 🟡 Média | 1 semana |
| 20 | Melhorar UX (loading, empty states) | 🟢 Baixo | 🟢 Baixa | 1 semana |

---

## 11. RESUMO EXECUTIVO DAS DIVERGÊNCIAS

### 11.1. Números

- **Módulos Faltantes:** 3 (Contatos, Atividades, Contratos dedicado)
- **Funcionalidades Faltantes:** ~40 features críticas
- **Fluxos Quebrados:** 4 de 4 (100%)
- **Tabelas Faltantes:** 3 (atividades, templates_contrato, contratos_gerados)
- **Campos Faltantes:** ~15 campos em várias tabelas
- **Regras de Negócio Não Implementadas:** 6 de 6 (100%)

### 11.2. Classificação Geral

| Categoria | Status | % Completo |
|-----------|--------|------------|
| **UI/Design** | ✅ Excelente | 85% |
| **Estrutura de Dados** | ✅ Boa | 70% |
| **Backend (Server Actions)** | ⚠️ Parcial | 40% |
| **Integração Frontend-Backend** | ❌ Ausente | 0% |
| **Fluxos de Negócio** | ❌ Ausente | 0% |
| **Autenticação** | ❌ Desabilitada | 0% |
| **CRUD Completo** | ❌ Ausente | 0% |
| **Automações** | ❌ Ausente | 0% |

### 11.3. Veredito

**O sistema atual é um PROTÓTIPO VISUAL de alta qualidade, mas NÃO é um CRM funcional.**

#### Pontos Fortes:
- ✅ Design system excepcional
- ✅ Arquitetura de dados bem pensada
- ✅ Componentes reutilizáveis
- ✅ Estrutura de código organizada

#### Pontos Fracos:
- ❌ Nenhuma funcionalidade real
- ❌ Dados 100% fictícios
- ❌ Fluxos de negócio ausentes
- ❌ Módulos críticos faltando

#### Risco:
**🔴 CRÍTICO** - Sistema não pode ser usado. Precisa de 3-5 meses de desenvolvimento para ser viável.

---

## 12. RECOMENDAÇÕES PARA O PRD 2.0

### 12.1. Decisões Arquiteturais Necessárias

1. **Prospecções:** Manter `empresas.tipo="lead"` OU criar tabela `prospeccoes`?
2. **Equipe:** Consolidar `/equipe` e `/colaboradores` OU manter separados?
3. **Dashboard:** Manter `/dashboard` e `/hq` OU consolidar?
4. **Contatos:** Módulo separado OU integrado em Empresas?

### 12.2. Prioridades para PRD 2.0

1. **Focar em funcionalidade** antes de novas features
2. **Conectar módulos existentes** antes de criar novos
3. **Implementar fluxos de negócio** como prioridade máxima
4. **Adicionar validações e tratamento de erros**
5. **Habilitar autenticação e permissões**

### 12.3. Escopo Sugerido para MVP

**Incluir:**
- ✅ Empresas (CRUD completo)
- ✅ Contatos (CRUD completo)
- ✅ Oportunidades (Kanban funcional)
- ✅ Atividades (módulo novo)
- ✅ Projetos (CRUD completo)
- ✅ Financeiro (parcelas + transações)
- ✅ Dashboard (KPIs reais)
- ✅ Autenticação

**Deixar para V2:**
- ⏸️ Geração automática de contratos
- ⏸️ Templates de contrato
- ⏸️ Metas customizáveis
- ⏸️ Relatórios avançados
- ⏸️ Integrações externas

---

**FIM DA ANÁLISE DE DIVERGÊNCIAS**
