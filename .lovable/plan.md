

## Plano: Agendamento em múltiplos dias (estilo Airbnb)

### Resumo

Trocar o calendário de seleção única (`mode="single"`) para seleção múltipla (`mode="multiple"`), permitindo que o cliente escolha vários dias consecutivos ou não para o atendimento. Cada dia terá o mesmo horário de início e duração, e o resumo mostrará todos os dias selecionados com o total acumulado.

### Alterações

| Arquivo | Ação |
|---------|------|
| `src/pages/BookingPage.tsx` | Trocar `mode="single"` por `mode="multiple"` no Calendar; ajustar state de `Date \| undefined` para `Date[]`; atualizar resumo para listar todos os dias; calcular total como `dias × horas × preço/h` |
| `src/types/payment.ts` | Alterar campo `date: string` para `dates: string[]` no `Appointment` |
| `src/contexts/PaymentContext.tsx` | Atualizar `createAppointment` para aceitar `dates: string[]` e calcular total proporcional |
| `src/pages/CheckoutPage.tsx` | Exibir lista de datas no resumo do checkout |
| `src/pages/client/ClientCalendar.tsx` | Ajustar leitura de `dates[]` em vez de `date` |
| `src/pages/client/ClientDashboard.tsx` | Ajustar exibição de datas no dashboard |
| `src/pages/caregiver/CaregiverDashboard.tsx` | Ajustar exibição de datas no dashboard |

### Detalhamento

**Calendário**: Usar `mode="multiple"` do react-day-picker. Os dias selecionados ficam destacados. O cliente escolhe livremente quantos dias quiser (desabilitar passados e domingos mantém).

**Resumo**: Listar cada data selecionada. Mostrar subtotal: `N dias × Xh × R$ Y/h = Total`.

**Appointment**: O campo `date` vira `dates: string[]`. Isso mantém tudo em um único agendamento (um pagamento, um registro), simplificando o MVP.

**Cálculo**: `totalPrice = dates.length × durationHours × pricePerHour`.

