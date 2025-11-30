export const mockKPIs = {
    receitaMes: { value: 127500, change: 15.3 },
    contratosAtivos: { value: 12, change: 0 },
    oportunidadesAbertas: { value: 8, change: -12.5 },
    taxaFechamento: { value: 42, change: 8.2 },
};

export const mockReceitaChart = [
    { mes: "Jul", receita: 85000 },
    { mes: "Ago", receita: 92000 },
    { mes: "Set", receita: 78000 },
    { mes: "Out", receita: 115000 },
    { mes: "Nov", receita: 105000 },
    { mes: "Dez", receita: 127500 },
];

export const mockFunil = {
    descoberta: 12,
    diagnostico: 8,
    proposta: 6,
    negociacao: 4,
    fechado: 2,
};

export const mockOportunidades = [
    { id: 1, empresa: "Acme Corp", valor: 45000, etapa: "proposta", responsavel: "João" },
    { id: 2, empresa: "Tech Solutions", valor: 32000, etapa: "negociacao", responsavel: "Maria" },
    { id: 3, empresa: "StartupXYZ", valor: 18000, etapa: "diagnostico", responsavel: "Pedro" },
    { id: 4, empresa: "Global Inc", valor: 67000, etapa: "descoberta", responsavel: "Ana" },
    { id: 5, empresa: "Inovate Ltd", valor: 52000, etapa: "proposta", responsavel: "João" },
];

export const mockEmpresas = [
    { id: 1, nome: "Acme Corp", tipo: "cliente", contatos: 3, valorTotal: 125000 },
    { id: 2, nome: "Tech Solutions", tipo: "lead", contatos: 2, valorTotal: 0 },
    { id: 3, nome: "StartupXYZ", tipo: "lead", contatos: 1, valorTotal: 0 },
    { id: 4, nome: "Global Inc", tipo: "cliente", contatos: 5, valorTotal: 340000 },
    { id: 5, nome: "Inovate Ltd", tipo: "cliente", contatos: 2, valorTotal: 89000 },
];

export const mockProjetos = [
    { id: 1, nome: "Site Institucional", cliente: "Acme Corp", status: "desenvolvimento", deadline: "2024-02-15", progresso: 65 },
    { id: 2, nome: "App Mobile", cliente: "Global Inc", status: "design", deadline: "2024-03-20", progresso: 30 },
    { id: 3, nome: "Plataforma CRM", cliente: "Inovate Ltd", status: "planejamento", deadline: "2024-04-10", progresso: 15 },
    { id: 4, nome: "Landing Page", cliente: "Acme Corp", status: "qa", deadline: "2024-01-20", progresso: 90 },
];

export const mockFinanceiro = {
    receitaRecebida: { value: 215000, change: 12.5 },
    receitaPrevista: { value: 87500, change: -5.2 },
    lucro: { value: 142000, change: 18.7 },
    burnRate: { value: 73000, change: 3.1 },
};

export const mockFluxoCaixa = [
    { mes: "Jul", entradas: 85000, saidas: 62000 },
    { mes: "Ago", entradas: 92000, saidas: 68000 },
    { mes: "Set", entradas: 78000, saidas: 71000 },
    { mes: "Out", entradas: 115000, saidas: 69000 },
    { mes: "Nov", entradas: 105000, saidas: 72000 },
    { mes: "Dez", entradas: 127500, saidas: 73000 },
];

export const mockParcelas = [
    { id: 1, cliente: "Acme Corp", valor: 12500, vencimento: "2024-01-10", status: "pendente" },
    { id: 2, cliente: "Global Inc", valor: 25000, vencimento: "2024-01-15", status: "pendente" },
    { id: 3, cliente: "Inovate Ltd", valor: 8900, vencimento: "2024-01-20", status: "atrasada" },
    { id: 4, cliente: "Acme Corp", valor: 12500, vencimento: "2024-01-25", status: "pendente" },
];

export const mockMetas = [
    { id: 1, titulo: "Faturamento Q1 2024", meta: 400000, atual: 127500, periodo: "trimestral" },
    { id: 2, titulo: "Novos Contratos (Janeiro)", meta: 5, atual: 2, periodo: "mensal" },
    { id: 3, titulo: "Taxa de Fechamento Anual", meta: 50, atual: 42, periodo: "anual" },
];

export const mockAtividades = [
    { id: 1, tipo: "reuniao", empresa: "Acme Corp", descricao: "Alinhamento de projeto", data: "2024-01-05", responsavel: "João" },
    { id: 2, tipo: "ligacao", empresa: "Tech Solutions", descricao: "Follow-up proposta", data: "2024-01-04", responsavel: "Maria" },
    { id: 3, tipo: "email", empresa: "StartupXYZ", descricao: "Envio de proposta comercial", data: "2024-01-03", responsavel: "Pedro" },
];

export const mockTasks = [
    { id: 1, title: "Desenvolver Homepage", status: "in_progress", priority: "high", projectId: 1, assigneeId: 1, dueDate: "2024-02-01" },
    { id: 2, title: "Configurar Banco de Dados", status: "done", priority: "urgent", projectId: 1, assigneeId: 2, dueDate: "2024-01-15" },
    { id: 3, title: "Criar Wireframes", status: "review", priority: "medium", projectId: 2, assigneeId: 3, dueDate: "2024-03-01" },
    { id: 4, title: "Definir Arquitetura", status: "todo", priority: "high", projectId: 3, assigneeId: 2, dueDate: "2024-04-01" },
];

export const mockProjectUpdates = [
    { id: 1, projectId: 1, authorId: 1, content: "Homepage 80% concluída. Aguardando assets finais.", health: "on_track", createdAt: "2024-01-28T10:00:00Z" },
    { id: 2, projectId: 2, authorId: 3, content: "Atraso na aprovação dos wireframes pelo cliente.", health: "at_risk", createdAt: "2024-01-27T14:30:00Z" },
];

export const mockTeamMembers = [
    { id: 1, name: "João Silva", role: "admin", department: "Engineering", activeProjectsCount: 3, avatarUrl: "JS" },
    { id: 2, name: "Maria Santos", role: "member", department: "Design", activeProjectsCount: 2, avatarUrl: "MS" },
    { id: 3, name: "Pedro Costa", role: "member", department: "Product", activeProjectsCount: 4, avatarUrl: "PC" },
    { id: 4, name: "Ana Oliveira", role: "member", department: "Sales", activeProjectsCount: 1, avatarUrl: "AO" },
];


export const mockLeads = [
    { id: 1, nome: "Carlos Oliveira", empresa: "Oliveira Trade", email: "carlos@oliveira.com", telefone: "11 99999-1111", status: "novo", origem: "linkedin" },
    { id: 2, nome: "Fernanda Souza", empresa: "FS Consultoria", email: "fernanda@fs.com", telefone: "11 98888-2222", status: "qualificando", origem: "site" },
    { id: 3, nome: "Roberto Santos", empresa: "RS Logística", email: "roberto@rslog.com", telefone: "11 97777-3333", status: "arquivado", origem: "indicacao" },
    { id: 4, nome: "Amanda Lima", empresa: "Lima Tech", email: "amanda@limatech.com", telefone: "11 96666-4444", status: "novo", origem: "instagram" },
    { id: 5, nome: "Ricardo Pereira", empresa: "RP Engenharia", email: "ricardo@rpeng.com", telefone: "11 95555-5555", status: "qualificando", origem: "linkedin" },
];
