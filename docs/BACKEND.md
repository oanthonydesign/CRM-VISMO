# Vismo CRM - Backend Architecture

This document provides an overview of the backend implementation.

## Stack
- **Database**: Supabase (PostgreSQL)
- **ORM**: Supabase Client
- **Backend**: Next.js Server Actions
- **API**: Next.js App Router API Routes

## Directory Structure

```
app/
├── actions/              # Server Actions
│   ├── empresas.ts      # Companies CRUD
│   ├── deals.ts         # Opportunities CRUD
│   ├── projects.ts      # Projects & Tasks CRUD
│   ├── finance.ts       # Financial operations
│   └── dashboard.ts     # Metrics & KPIs
├── api/                 # REST API endpoints
│   ├── empresas/
│   ├── deals/
│   ├── projetos/
│   ├── financeiro/
│   ├── kpis/
│   └── metas/
supabase/
└── migrations/
    └── 20251130010000_full_schema.sql  # Database schema
```

## Usage Examples

### Server Component
```tsx
import { getEmpresas } from '@/app/actions/empresas'

export default async function Page() {
  const empresas = await getEmpresas()
  return <div>{/* render */}</div>
}
```

### Client Component with Server Action
```tsx
'use client'
import { createEmpresa } from '@/app/actions/empresas'

export function Form() {
  async function handleSubmit(formData: FormData) {
    const result = await createEmpresa(formData)
    if (result.error) {
      alert(result.error)
    }
  }
  
  return <form action={handleSubmit}>{/* form fields */}</form>
}
```

### API Route
```tsx
// External consumption
const response = await fetch('/api/empresas')
const data = await response.json()
```

## Security

### Row Level Security (RLS)
All tables have RLS enabled. Policies enforce:
- **Admin**: Full access
- **Member**: Limited access (no Finance data)

### Helper Function
```sql
is_admin() -- Returns true if current user is admin
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
