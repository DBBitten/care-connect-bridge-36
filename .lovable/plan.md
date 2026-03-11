

## Plano: Renomear "Cuidare" para "Curami"

### Escopo

Substituição global do nome "Cuidare" → "Curami" e "cuidare" → "curami" em todos os arquivos do projeto (20 arquivos, ~300 ocorrências).

### Arquivos afetados

| Arquivo | Tipo de alteração |
|---|---|
| `index.html` | Title, meta tags, twitter site |
| `src/components/layout/Navbar.tsx` | Texto do logo |
| `src/components/layout/Footer.tsx` | Texto do logo, descrição |
| `src/components/client/ClientSidebar.tsx` | Texto do logo |
| `src/components/caregiver/CaregiverSidebar.tsx` | Texto do logo |
| `src/components/admin/AdminSidebar.tsx` | Texto do logo, email admin |
| `src/components/CuidareLogo.tsx` | Renomear componente para `CuramiLogo` |
| `src/components/landing/HeroSection.tsx` | Import do asset (nome do arquivo mantido) |
| `src/components/landing/CTASection.tsx` | Textos |
| `src/components/landing/HowItWorksSection.tsx` | Textos |
| `src/components/landing/TrustSection.tsx` | Textos |
| `src/data/legalDocuments.ts` | Todas menções a "Cuidare", emails `@cuidare.com.br` → `@curami.com.br` |
| `src/types/legal.ts` | Descrição |
| `src/pages/LoginPage.tsx` | Textos |
| `src/pages/RegisterPage.tsx` | Textos |
| `src/pages/LandingPage.tsx` | Textos |
| `src/pages/BookingPage.tsx` | Email |
| `src/contexts/PaymentContext.tsx` | Email |
| `src/components/kyc/*` | Textos se houver |
| `src/components/legal/*` | Textos se houver |

### Detalhes
- `CuidareLogo` componente será renomeado para `CuramiLogo` e todos os imports atualizados
- O arquivo de asset `cuidare-logo.png` / `cuidare-logo-white.png` / `hero-cuidare.png` serão mantidos (não é possível renomear assets), mas os imports continuarão funcionando
- Emails `@cuidare.com.br` → `@curami.com.br`
- Twitter `@Cuidare` → `@Curami`

