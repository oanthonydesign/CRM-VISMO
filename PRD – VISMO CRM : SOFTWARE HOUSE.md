PRD – VISMO CRM / SOFTWARE HOUSE

**Versão 1.0**

**Responsável:** O pica das galáxias

**Tipo:** CRM + Financeiro + Project OS próprio da Software House

**Origem:** Reestruturação operacional e criação de sistema interno proprietário

---

# 1. **Visão Geral**

Criar um CRM proprietário para uma software house com operação de:

- Prospecção e vendas
- Gerenciamento de clientes
- Gerenciamento de projetos
- Financeiro baseado em contratos e parcelas
- Geração automática de contratos
- Gestão de metas e KPIs da empresa

O sistema deve funcionar como **núcleo operacional** do negócio, substituindo Notion, planilhas, Pipefy e ferramentas dispersas.

---

# 2. **Objetivo do Produto**

1. Centralizar todo o ciclo do cliente:
    - Lead → Oportunidade → Contrato → Projeto → Financeiro
2. Ter clareza financeira:
    - Diferenciar **valor contratado**, **valor recebido**, **valor previsto**
3. Aumentar previsibilidade:
    - Ver cashflow futuro pela estrutura de parcelas
    - Ver capacidade de entrega do time
4. Criar inteligência de operação:
    - KPIs de vendas, entrega e financeiro
    - Metas mensais/trimestrais/anuais
5. Padronizar contratos:
    - Geração automática com variáveis
    - Templates dinâmicos

---

# 3. **Problemas que o sistema resolve**

- Falta de clareza sobre **quanto entrou**, **quanto vai entrar** e **quanto foi vendido**
- Perda de follow-ups e leads
- Falta de visão do pipeline
- Ruído em entregas e deadlines
- Contratos inconsistentes gerados manualmente
- Falta de um fluxo único para controlar projetos grandes pagos em parcelas
- Falta de visão de metas e KPIs reais da operação

---

# 4. **Usuários do Sistema**

### 4.1. CEO / Founder

- Acompanha metas
- Confere indicadores
- Cobra resultados
- Aprova contratos e propostas

### 4.2. Comercial

- Registra leads
- Gera oportunidades
- Faz follow-ups
- Registra propostas

### 4.3. Operações / Time de produto

- Visualiza projetos
- Atualiza status
- Garante entregas

### 4.4. Financeiro / Administrativo

- Registra entradas/saídas
- Marca parcelas pagas
- Gera relatórios

---

# 5. **Requisitos Funcionais**

A seguir, tudo o que o sistema deve fazer.

---

## 5.1. **Módulo – Empresas (Clientes/Leads)**

- Criar empresa
- Editar empresa
- Definir tipo: **lead**, **cliente**, **ex-cliente**
- Associar contatos
- Ver histórico de atividades
- Ver oportunidades associadas
- Ver contratos associados
- Ver projetos associados

---

## 5.2. **Módulo – Contatos**

- Criar contato vinculado a empresa
- Selecionar contato principal
- Registrar email/telefone/cargo

---

## 5.3. **Módulo – Prospeções / Leads**

- Criar lead
- Definir status:
    - novo
    - qualificando
    - proposta
    - negociando
    - perdido
- Registrar interesse
- Registrar origem
- Registrar ticket estimado

---

## 5.4. **Módulo – Oportunidades (Deals)**

- Criar oportunidade vinculada a empresa
- Etapas do funil:
    1. Descoberta
    2. Diagnóstico
    3. Proposta
    4. Negociação
    5. Fechado (ganho/perdido)
- Registrar valor total do contrato
- Registrar previsão de fechamento
- Registrar data real do fechamento
- Registrar motivo da perda

---

## 5.5. **Módulo – Atividades / Follow-ups**

- Criar atividade (ligação, reunião, WhatsApp, email)
- Registrar descrição
- Registrar próximo passo
- Registrar data para followup
- Marcar como concluído
- Vincular com Empresa ou Deal

---

## 5.6. **Módulo – Contratos**

- Criar contrato vinculado ao Deal
- Selecionar template
- Gerar contrato automático com variáveis
- Finalizar em PDF
- Registrar valor total
- Registrar condições de pagamento
- Gerar parcelas automaticamente
- Registrar assinatura (manual ou digital)

---

## 5.7. **Módulo – Financeiro**

### Entradas:

- Registro automático de parcelas
- Registro manual de entrada extra
- Marcar parcelas como pagas
- Atraso automático após vencimento
- Fluxo financeiro mensal / trimestral / anual

### Saídas:

- Registrar custos fixos
- Registrar custos variáveis
- Registrar imposto
- Associar saída a categoria

### Relatórios:

- Receita recebida
- Receita prevista
- Volume contratado
- Lucro
- Burn rate
- Inadimplência

---

## 5.8. **Módulo – Projetos**

- Criar projeto vinculado ao contrato ou deal
- Selecionar tipo (site, app, CRM, landing, etc.)
- Definir status:
    - Planejamento
    - Design
    - Desenvolvimento
    - QA
    - Entregue
    - Manutenção
- Registrar datas e deadlines
- Criar tasks (opcional)
- Acompanhar progresso

---

## 5.9. **Módulo – Metas & KPIs**

### KPIs de Vendas:

- Leads qualificados
- Oportunidades abertas
- Taxa de fechamento
- Ticket médio
- Tempo médio de ciclo de venda
- Faturamento contratado

### KPIs de Projetos:

- Projetos ativos
- Deadlines em risco
- Entregas no prazo
- Lead time médio

### KPIs Financeiros:

- Receita recebida
- Receita prevista
- Lucro
- Burn rate
- Inadimplência
- LTV
- CAC (se houver dados)

### Metas:

- Criar meta vinculada a KPI
- Definir período (mensal, trimestral, anual)
- Calcular progresso automático
- Exibir gráfico de evolução

---

# 6. Requisitos Não Funcionais

- Dashboard rápido (carregar em < 1s)
- API REST ou GraphQL
- Segurança de dados (criptografia)
- Multiuser com permissões
- Web-first, responsivo
- Logs de auditoria
- Escalável para mais usuários
- Fácil de integrar com outros sistemas

---

# 7. Modelo de Dados (Banco)

### Tabelas:

- empresas
- contatos
- prospeccoes
- deals
- atividades
- contratos
- parcelas
- entradas_saidas
- projetos
- tasks
- metas
- templates_contrato
- contratos_gerados

(O banco completo posso montar em SQL no próximo passo, se quiser.)

---

# 8. Fluxos Principais

## Fluxo 1 — Comercial

empresa → prospecção → deal → contrato → projeto

## Fluxo 2 — Financeiro

contrato → parcelas → entrada (pago) → relatório

## Fluxo 3 — Projetos

deal ganho → cria projeto → acompanha → entrega

## Fluxo 4 — Metas/KPIs

dados → cálculo automático → dashboards

---

# 9. Telas (UX em estrutura)

1. Dashboard Geral
2. Funil Comercial
3. Empresas
4. Contatos
5. Prospeções
6. Oportunidades
7. Projetos
8. Financeiro (Entradas / Saídas / Previsões)
9. Contratos
10. Templates de Contrato
11. Metas & KPIs
12. Perfil / Configurações

---

# 10. Regras de Negócio

- Um Deal só vira contrato quando marcado como “ganho”.
- Toda parcela gera impacto no financeiro automaticamente.
- Receita contratada ≠ receita recebida.
- Projetos só podem existir vinculados a Deal ou Contrato.
- KPIs sempre recalculam a partir dos registros reais do sistema.
- Metas não são editáveis após criadas (criando histórico).

---

# 11. Métricas de Sucesso do Produto

- Redução de perda de leads
- Aumento da taxa de fechamento
- Previsão de caixa mais precisa
- Redução de atrasos em projetos
- Diminuição da inadimplência
- Melhora na tomada de decisão mensal