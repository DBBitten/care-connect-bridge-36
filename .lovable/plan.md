

## Plano: Substituir "duração" por "horário de início e término"

### Resumo

Remover o conceito de "duração fixa" (availableDurations) e substituir por seleção de **horário de início** e **horário de término**. A duração é calculada automaticamente como a diferença entre os dois. O cuidador define apenas o preço por hora por serviço — não mais as durações permitidas.

### Modelo de dados

**CaregiverServiceOffer (simplificado)**
- Remover `availableDurations: number[]`
- Manter apenas `serviceId` e `pricePerHour`

**Appointment (atualizado)**
- Remover `durationHours`
- Trocar `startTime: string` por `startTime: string` + `endTime: string`
- Calcular horas como `(endTime - startTime)` para o cálculo de preço

### Arquivos alterados

| Arquivo | Ação |
|---------|------|
| `src/types/service.ts` | Remover `availableDurations` do `CaregiverServiceOffer` |
| `src/types/payment.ts` | Remover `durationHours`, adicionar `endTime: string` no `Appointment` |
| `src/pages/BookingPage.tsx` | Remover select de duração; adicionar select de "Horário de término" (filtrando apenas horários após o início); calcular horas automaticamente; atualizar resumo |
| `src/contexts/PaymentContext.tsx` | Atualizar `CreateAppointmentData` e cálculo de `totalPrice` para usar `endTime - startTime` |
| `src/contexts/CaregiverContext.tsx` | Remover `availableDurations` dos seeds dos perfis mock |
| `src/pages/caregiver/CaregiverProfileEdit.tsx` | Remover checkboxes de durações; manter apenas seleção de serviço + preço/h |
| `src/pages/CheckoutPage.tsx` | Exibir horário início–término em vez de duração |
| `src/pages/client/ClientCalendar.tsx` | Ajustar exibição para `startTime–endTime` |
| `src/pages/client/ClientDashboard.tsx` | Ajustar exibição |
| `src/pages/caregiver/CaregiverDashboard.tsx` | Ajustar exibição |
| `src/pages/client/ClientPayments.tsx` | Ajustar exibição |
| `src/pages/admin/AdminMetrics.tsx` | Ajustar referências a `durationHours` |

### Detalhamento

**Booking**: Dois selects — "Horário de início" (06:00–18:00) e "Horário de término" (dinâmico, só mostra opções após o horário de início selecionado, até 22:00). O total é calculado como `dias × horas × preço/h` onde `horas = endTime - startTime`.

**Perfil do cuidador**: Ao selecionar um serviço, o cuidador define apenas o preço por hora. Sem restrição de durações — o cliente escolhe livremente o intervalo.

**Resumo/Checkout**: Mostra "08:00 – 14:00 (6h)" em vez de apenas "6h".

