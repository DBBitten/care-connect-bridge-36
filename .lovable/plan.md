

## Plano: Rebrand para "Cuidare" — Reestilizacao Global

### Resumo

Aplicar nova identidade visual "Cuidare" (paleta Terracota & Creme, tipografia Inter, tom de confianca) em todo o produto, sem alterar rotas, funcionalidades ou arquitetura.

### Escopo de Arquivos

**Fase 1 — Tokens e Tipografia (3 arquivos)**

| Arquivo | Alteracao |
|---------|-----------|
| `src/index.css` | Substituir todas as CSS variables (paleta terracota/creme), trocar fonte para Inter, ajustar gradients e shadows |
| `tailwind.config.ts` | Atualizar fontFamily para Inter, ajustar shadows para nova paleta |
| `index.html` | Titulo "Cuidare", meta tags, lang="pt-BR" |

**Fase 2 — Componentes UI (3 arquivos)**

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/ui/button.tsx` | Ajustar variantes hero/hero-outline para terracota, garantir min-height 44px mobile |
| `src/components/ui/card.tsx` | Ajustar shadow-card para nova cor |
| `src/components/ui/input.tsx` | Garantir focus ring visivel e acessivel |

**Fase 3 — Layout (2 arquivos)**

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/layout/Navbar.tsx` | "ElderCare" → "Cuidare", icone ShieldCheck ao inves de Heart |
| `src/components/layout/Footer.tsx` | "ElderCare" → "Cuidare", icone ShieldCheck |

**Fase 4 — Telas e Copy (11+ arquivos)**

Substituir "ElderCare" → "Cuidare" em todos os arquivos que contem a string. Ajustar hero headline e sub conforme briefing. Arquivos afetados:

- `src/components/landing/HeroSection.tsx` — novo H1/sub, ajustar overlay e badge
- `src/components/landing/CTASection.tsx` — "ElderCare" → "Cuidare"
- `src/components/landing/TrustSection.tsx` — "ElderCare" → "Cuidare"
- `src/components/client/ClientSidebar.tsx` — logo text
- `src/components/caregiver/CaregiverSidebar.tsx` — logo text
- `src/components/admin/AdminSidebar.tsx` — logo text + admin email
- `src/pages/LoginPage.tsx` — "ElderCare" → "Cuidare"
- `src/pages/RegisterPage.tsx` — nenhuma ref direta mas revisar
- `src/pages/BookingPage.tsx` — "ElderCare" → "Cuidare"
- `src/pages/ServicesPage.tsx` — "ElderCare" → "Cuidare"
- `src/pages/caregiver/CaregiverKyc.tsx` — "ElderCare" → "Cuidare"
- `src/components/legal/RequireLegalAcceptance.tsx` — "ElderCare" → "Cuidare"
- `src/contexts/NotificationContext.tsx` — localStorage key permanece (nao quebrar dados)
- `src/types/legal.ts` — descricao "ElderCare" → "Cuidare"
- `src/data/legalDocuments.ts` — possiveis refs

### Detalhamento Tecnico

#### 1. CSS Variables (src/index.css)

Conversao dos hex para HSL:
- `#B5472A` → ~12 63% 44% (primary)
- `#7A2E1D` → ~12 61% 30% (primary hover/dark — usar como ring ou darker primary via utility)
- `#FBF4EC` → ~30 58% 96% (background)
- `#FFFDFB` → ~30 100% 99% (card)
- `#1F2937` → ~220 26% 17% (foreground)
- `#4B5563` → ~220 13% 34% (muted-foreground)
- `#E7D8CC` → ~25 33% 85% (border/input)

Trocar fonte de Plus Jakarta Sans para Inter. Atualizar `@import` do Google Fonts.

Ajustar dark mode proporcionalmente (manter funcional mas adaptar tons).

Atualizar gradients para terracota:
- `--gradient-hero`: gradiente de #B5472A para tom mais quente
- `--gradient-warm`: creme suave
- `--shadow-card`: sombra com tom terracota

#### 2. Tipografia

- Body: 16px base (ja esta), line-height 1.5+
- Headings: font-weight 700 (alterar de `font-semibold` para `font-bold` no base)
- Min font size: garantir via classes existentes

#### 3. Componentes

Botoes: variantes ja puxam de CSS vars, entao a mudanca de tokens e suficiente. Revisar `hero-outline` para funcionar com terracota (borda + backdrop). Garantir `min-h-[44px]` nos sizes default/sm.

Cards: ja usam `--card` e `--border` — tokens resolvem.

Inputs: adicionar `focus-visible:ring-offset-2` mais visivel se necessario.

#### 4. Copy

Trocar todas as 21+ ocorrencias de "ElderCare"/"eldercare" em textos visiveis ao usuario. Manter chaves de localStorage inalteradas para nao perder dados.

Hero novo:
- H1: "Cuidadores de confianca para quem voce ama."
- Sub: "Profissionais treinados e verificados para cuidar com seguranca e carinho."

#### 5. Acessibilidade

- Focus ring: ja usa `focus-visible:ring-2` — garantir que ring color tem contraste suficiente com fundo creme
- Min click target: 44px — verificar button sizes
- Contraste: texto #1F2937 em fundo #FBF4EC = ratio ~12:1 (excelente). Texto #4B5563 em #FBF4EC = ~7:1 (excelente). Botao #FFFFFF em #B5472A = ~4.8:1 (passa AA).

#### 6. Icone da marca

Trocar `Heart` por `ShieldCheck` no logo (Navbar, Footer, Sidebars) para reforcar confianca/seguranca.

### Ordem de Execucao

1. `index.html` + `src/index.css` + `tailwind.config.ts` (tokens)
2. `button.tsx` + `card.tsx` + `input.tsx` (componentes)
3. `Navbar.tsx` + `Footer.tsx` (layout)
4. Todas as paginas/contextos com "ElderCare" (copy batch)

