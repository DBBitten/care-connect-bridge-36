

## Plano: Modulo Catalogo de Servicos — ElderCare

### Resumo

Criar o modulo de catalogo de servicos com 3 frentes: tipos/dados, paginas publicas e admin, e integracao com o fluxo de agendamento existente.

### Arquivos Novos

| Arquivo | Descricao |
|---------|-----------|
| `src/types/service.ts` | Tipos Service e ServicePriceRule |
| `src/contexts/ServiceContext.tsx` | Context com CRUD, seed de 5 servicos, estado global |
| `src/pages/ServicesPage.tsx` | Pagina publica `/services` com cards dos servicos ativos |
| `src/pages/admin/AdminServices.tsx` | Tabela admin com ativar/desativar, ordenar, editar |
| `src/pages/admin/AdminServiceEdit.tsx` | Form completo de criacao/edicao de servico |

### Arquivos Modificados

| Arquivo | Alteracao |
|---------|-----------|
| `src/App.tsx` | Adicionar ServiceProvider e rotas `/services`, `/admin/services`, `/admin/services/new`, `/admin/services/:id` |
| `src/components/admin/AdminSidebar.tsx` | Adicionar item "Servicos" no menu com icone Package |
| `src/components/layout/Navbar.tsx` | Adicionar link "Servicos" na navegacao desktop e mobile |
| `src/pages/BookingPage.tsx` | Ler `serviceId` da query string, pre-selecionar servico, usar duracao/preco do servico selecionado |

### Detalhamento Tecnico

#### 1. Tipos (`src/types/service.ts`)

```text
Service {
  id: string
  name: string
  description: string
  baseDurationMinutes: number
  allowedDurationsMinutes: number[]
  pricePerHour: number
  minHours: number (default 2)
  maxHours: number (default 12)
  requiresCertificationTag?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

ServicePriceRule {
  id: string
  serviceId: string
  ruleType: 'WEEKEND' | 'NIGHT' | 'URGENT'
  multiplier: number
  isActive: boolean
}
```

#### 2. ServiceContext (`src/contexts/ServiceContext.tsx`)

- Estado: lista de servicos em memoria (mock/localStorage)
- Operacoes: `getActiveServices()`, `getServiceById(id)`, `createService()`, `updateService()`, `toggleActive(id)`, `reorder(id, newSortOrder)`
- Seed com 5 servicos ativos:
  1. Companhia e supervisao — R$ 35/h — [120, 240, 480]
  2. Apoio em mobilidade leve — R$ 40/h — [120, 240] — tag BASIC_MOBILITY
  3. Apoio em alimentacao/hidratacao — R$ 38/h — [120, 240]
  4. Higiene nao invasiva — R$ 42/h — [120, 240]
  5. Acompanhamento em consulta (logistica) — R$ 45/h — [120, 240, 480]

#### 3. Pagina publica `/services` (`src/pages/ServicesPage.tsx`)

- Layout com Navbar + Footer (mesmo padrao de SearchCaregivers)
- Header: "Nossos Servicos" + subtitulo
- Grid de cards (servicos ativos, ordenados por sortOrder):
  - Nome, descricao
  - "A partir de R$ X/h"
  - Duracoes disponiveis como badges
  - Botao "Agendar" → navega para `/agendar/1?serviceId={id}` (usa cuidador mock ID 1 por ora)

#### 4. Admin — Lista (`src/pages/admin/AdminServices.tsx`)

- AdminLayout com titulo "Servicos"
- Botao "Criar servico" → `/admin/services/new`
- Tabela com colunas: Ordem, Nome, Preco/h, Duracoes, Status (badge), Acoes
- Toggle ativar/desativar inline (Switch)
- Botao "Editar" por linha

#### 5. Admin — Form (`src/pages/admin/AdminServiceEdit.tsx`)

- AdminLayout com titulo dinamico "Novo Servico" ou "Editar Servico"
- Campos: name (obrigatorio), description (textarea), pricePerHour (number > 0), baseDurationMinutes, allowedDurationsMinutes (checkboxes: 1h, 2h, 4h, 6h, 8h, 12h), minHours, maxHours, requiresCertificationTag (select opcional), sortOrder, isActive (switch)
- Validacoes: name obrigatorio, pricePerHour > 0, pelo menos 1 duracao selecionada
- Salvar → redirecionar para `/admin/services` com toast de sucesso

#### 6. Integracao com BookingPage

- Ler `serviceId` de `useSearchParams`
- Se presente, buscar servico via `getServiceById`
- Exibir nome do servico no resumo
- Substituir opcoes de duracao fixas pelas `allowedDurationsMinutes` do servico
- Usar `pricePerHour` do servico em vez do `caregiver.hourlyRate` fixo
- Adicionar Select de servico no topo caso nao venha pre-selecionado (lista dos ativos)

#### 7. Navegacao

- AdminSidebar: novo item `{ icon: Package, label: "Servicos", href: "/admin/services" }` entre "Documentos Legais" e "Usuarios"
- Navbar: link "Servicos" apontando para `/services` na navegacao desktop e mobile

### Ordem de Implementacao

1. `src/types/service.ts`
2. `src/contexts/ServiceContext.tsx`
3. `src/pages/ServicesPage.tsx`
4. `src/pages/admin/AdminServices.tsx`
5. `src/pages/admin/AdminServiceEdit.tsx`
6. `src/App.tsx` (rotas + provider)
7. `src/components/admin/AdminSidebar.tsx`
8. `src/components/layout/Navbar.tsx`
9. `src/pages/BookingPage.tsx`

