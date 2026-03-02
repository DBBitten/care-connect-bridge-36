

## Plano: Pagina Admin Sitemap — Mapa do Produto

### Resumo

Criar pagina `/admin/sitemap` com 4 tabs (Rotas, Gates, Fluxos, QA) que funciona como mapa completo do produto para facilitar QA e revisao.

### Arquivos

| Arquivo | Acao |
|---------|------|
| `src/pages/admin/AdminSitemap.tsx` | **Novo** — Pagina completa com tabs, dados estaticos das rotas, gates, fluxos e checklist |
| `src/components/admin/AdminSidebar.tsx` | **Editar** — Adicionar item "Sitemap" com icone Map |
| `src/App.tsx` | **Editar** — Importar AdminSitemap e adicionar rota `/admin/sitemap` |

### Detalhamento

#### AdminSitemap.tsx

Pagina unica com `AdminLayout` e 4 tabs via Radix Tabs:

**Tab 1 — Rotas**: Const array com todas as rotas do App.tsx, agrupadas por secao (Publico, Cliente, Cuidador, Admin). Cada entrada tem: `path`, `description`, `role` (tag colorida), `gates` (texto), `states` (texto). Campo de busca filtra por path/descricao. Links abrem em nova aba. Rotas listadas no requisito que nao existem no App.tsx atual serao marcadas "(nao implementada)".

**Tab 2 — Gates**: Tabela com colunas Recurso, Role, Condicao, Comportamento se falhar. Lista fixa baseada nas regras do MVP (KYC, termos, pagamento, suspensao, anti-bypass).

**Tab 3 — Fluxos**: 3 fluxos (Cliente agendar, Cuidador onboarding, Incidente) com passos numerados, cada passo e um link clicavel + descricao do estado. Fluxo de incidente marcado como "nao implementado" onde aplicavel.

**Tab 4 — QA**: Checklist com ~8 itens de verificacao, estado local (useState), nao persiste. Checkboxes com descricao.

Busca por texto no topo da tab Rotas. Tudo em portugues BR.

#### Rotas existentes vs solicitadas

Mapeamento das rotas solicitadas para as reais do projeto:
- `/search` → `/buscar-cuidadores`
- `/signup` → `/cadastro`
- `/client/*` → `/cliente/*`
- `/caregiver/*` → `/cuidador/*`
- `/book` → `/agendar/:id`
- Rotas nao existentes (incidentes, calendario cuidador, disponibilidade): marcadas como "(nao implementada)"

#### Sidebar + Rota

Adicionar `{ icon: Map, label: "Sitemap", href: "/admin/sitemap" }` ao AdminSidebar. Registrar rota no App.tsx.

