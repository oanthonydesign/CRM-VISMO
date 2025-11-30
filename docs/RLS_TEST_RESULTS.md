# Resultados dos Testes de RLS (Row-Level Security)

Este documento detalha as políticas de segurança implementadas e o comportamento esperado para diferentes perfis de usuário.

## Perfis de Teste

| Perfil | Role | Permissões Gerais |
|--------|------|-------------------|
| **Admin** | `admin` | Acesso total a todas as tabelas (CRUD) |
| **Membro** | `member` | Leitura na maioria dos módulos, edição limitada |

## Matriz de Permissões

### 1. Módulos Principais (Empresas, Contatos, Oportunidades, Projetos)

| Tabela | Ação | Admin | Membro | Comportamento Esperado |
|--------|------|-------|--------|------------------------|
| `empresas` | SELECT | ✅ | ✅ | Ambos podem ver todas as empresas |
| `empresas` | INSERT | ✅ | ❌ | Apenas Admin cadastra empresas |
| `empresas` | UPDATE | ✅ | ❌ | Apenas Admin edita empresas |
| `empresas` | DELETE | ✅ | ❌ | Apenas Admin remove empresas |

*Aplica-se também a: `contatos`, `deals`, `projects`*

### 2. Tarefas e Colaboração

| Tabela | Ação | Admin | Membro | Comportamento Esperado |
|--------|------|-------|--------|------------------------|
| `tasks` | SELECT | ✅ | ✅ | Todos veem todas as tarefas |
| `tasks` | UPDATE | ✅ | ⚠️ | Membro só edita se `assignee_id = auth.uid()` |
| `project_updates` | INSERT | ✅ | ✅ | Todos podem postar atualizações |

### 3. Financeiro e Estratégico

| Tabela | Ação | Admin | Membro | Comportamento Esperado |
|--------|------|-------|--------|------------------------|
| `contracts` | ALL | ✅ | ❌ | Membro não vê contratos |
| `installments` | ALL | ✅ | ❌ | Membro não vê parcelas |
| `transactions` | ALL | ✅ | ❌ | Membro não vê fluxo de caixa |
| `goals` | SELECT | ✅ | ✅ | Membro vê metas |
| `goals` | UPDATE | ✅ | ❌ | Apenas Admin define metas |

## Como Verificar Manualmente

1. **Criar Usuário Admin:**
   - No Supabase Auth, crie um usuário `admin@vismo.com`
   - Na tabela `profiles`, defina `role = 'admin'`

2. **Criar Usuário Membro:**
   - No Supabase Auth, crie um usuário `member@vismo.com`
   - Na tabela `profiles`, defina `role = 'member'` (padrão)

3. **Teste de Acesso Financeiro:**
   - Login como `member@vismo.com`
   - Tente acessar `/financeiro`
   - **Resultado Esperado:** Página deve mostrar erro de permissão ou dados vazios (dependendo do tratamento de erro do frontend), pois o select retornará 0 linhas.

4. **Teste de Edição de Tarefa:**
   - Login como `member@vismo.com`
   - Tente editar uma tarefa atribuída a outro usuário
   - **Resultado Esperado:** O update falhará (sem erro visível ou toast de erro).
