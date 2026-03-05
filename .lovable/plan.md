

## Plano: Preço e duração definidos pelo cuidador, não pela plataforma

### Resumo

Remover `pricePerHour`, `allowedDurationsMinutes`, `minHours`, `maxHours` do Service (catálogo do admin). O admin define apenas nome, descrição, certificação requerida e status. Cada cuidador define seu preço e durações por serviço no seu perfil.

### Modelo de dados

**Service (simplificado)**
Remover: `pricePerHour`, `allowedDurationsMinutes`, `minHours`, `maxHours`, `baseDurationMinutes`
Manter: `id`, `name`, `description`, `requiresCertificationTag`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`

**Novo tipo: CaregiverServiceOffer**
```ts
interface CaregiverServiceOffer {
  serviceId: string;
  pricePerHour: number;
  availableDurations: number[]; // em minutos, ex: [120, 240, 480]
}
```

**CaregiverProfileData (atualizado)**
- Remover `hourlyRate` (global) — preço agora é por serviço
- Trocar `serviceTags: string[]` por `serviceOffers: CaregiverServiceOffer[]`

### Arquivos alterados

| Arquivo | Ação |
|---------|------|
| `src/types/service.ts` | Remover campos de preço/duração do `Service`. Adicionar `CaregiverServiceOffer` |
| `src/types/caregiver.ts` | Trocar `serviceTags` + `hourlyRate` por `serviceOffers: CaregiverServiceOffer[]` |
| `src/contexts/ServiceContext.tsx` | Remover preço/duração dos seeds e do `createService`/`updateService` |
| `src/pages/admin/AdminServices.tsx` | Remover colunas "Preço/h" e "Durações" da tabela |
| `src/pages/admin/AdminServiceEdit.tsx` | Remover campos de preço, duração base, durações permitidas, min/max horas |
| `src/pages/caregiver/CaregiverProfileEdit.tsx` | Na seção "Serviços que Aceito", adicionar campos de preço e durações por serviço selecionado |
| `src/contexts/CaregiverContext.tsx` | Atualizar seeds dos perfis mock para usar `serviceOffers` |
| `src/pages/ServicesPage.tsx` | Remover exibição de preço fixo. Mostrar "Preços variam por cuidador" ou faixa de preço |
| `src/pages/BookingPage.tsx` | Buscar preço do cuidador selecionado (via `serviceOffers`) em vez do serviço |
| `src/pages/SearchCaregivers.tsx` | Exibir preço do cuidador por serviço filtrado (ou faixa) |
| `src/pages/CaregiverProfile.tsx` | Exibir tabela de serviços com preços do cuidador |

### Detalhamento

#### Admin (simplificado)
O admin gerencia apenas o catálogo: nome, descrição, se requer certificação, ativo/inativo. Sem preço nem duração — isso é decisão do profissional.

#### Perfil do cuidador (enriquecido)
Ao marcar um serviço, abrem-se campos inline:
- **Preço por hora (R$)**: input numérico obrigatório
- **Durações que aceita**: checkboxes (1h, 2h, 4h, 6h, 8h, 12h)

Salva como array de `CaregiverServiceOffer` no perfil.

#### Página de serviços (pública)
Em vez de "R$ 35/h", mostrar "A partir de R$ XX/h" calculado dinamicamente dos cuidadores ativos, ou "Consulte os cuidadores" se não houver dados.

#### Booking
Ao selecionar serviço no agendamento, o preço e durações vêm do `serviceOffers` do cuidador selecionado, não mais do catálogo.

#### Busca
O card do cuidador já mostra `hourlyRate` — será substituído por faixa (menor preço dos serviceOffers) ou preço do serviço filtrado.

### Ordem de execução

1. Tipos (`service.ts`, `caregiver.ts`)
2. Contextos (`ServiceContext`, `CaregiverContext`)
3. Admin (`AdminServices`, `AdminServiceEdit`)
4. Cuidador (`CaregiverProfileEdit`)
5. Páginas públicas (`ServicesPage`, `BookingPage`, `SearchCaregivers`, `CaregiverProfile`)

