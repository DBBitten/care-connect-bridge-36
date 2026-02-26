

## Plano: Modulo de Pagamentos MVP Simulado — ElderCare

### Resumo

Implementar o fluxo completo de pagamentos simulados: tipos de dados (Payment, Refund, PlatformSettings, Appointment), contexto centralizado, checkout do cliente, historico de pagamentos, painel admin com gestao de pagamentos/reembolsos e configuracao de taxa, e politica de cancelamento.

### Arquivos Novos

| Arquivo | Descricao |
|---------|-----------|
| `src/types/payment.ts` | Tipos Payment, Refund, PlatformSettings, Appointment, enums de status |
| `src/contexts/PaymentContext.tsx` | Context com CRUD de payments, refunds, appointments, platform settings, logica de calculo de fees |
| `src/pages/CheckoutPage.tsx` | Pagina `/checkout/:appointmentId` — resumo + pagamento simulado |
| `src/pages/admin/AdminPayments.tsx` | Lista de pagamentos com acao de reembolso |
| `src/pages/admin/AdminSettings.tsx` | Edicao da platformFeeRate |

### Arquivos Modificados

| Arquivo | Alteracao |
|---------|-----------|
| `src/App.tsx` | Adicionar PaymentProvider, rotas `/checkout/:appointmentId`, `/admin/payments`, `/admin/settings` |
| `src/pages/BookingPage.tsx` | Ao confirmar, criar Appointment em PAYMENT_PENDING e redirecionar para `/checkout/:appointmentId` |
| `src/pages/client/ClientPayments.tsx` | Reescrever para usar dados reais do PaymentContext em vez de mock hardcoded |
| `src/components/admin/AdminSidebar.tsx` | Adicionar itens "Pagamentos" e atualizar "Configuracoes" para `/admin/settings` |
| `src/components/client/ClientSidebar.tsx` | Nenhuma mudanca (ja aponta para `/cliente/pagamentos`) |

### Detalhamento Tecnico

#### 1. Tipos (`src/types/payment.ts`)

```text
AppointmentStatus = 'PAYMENT_PENDING' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
PaymentStatus = 'INITIATED' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELED'
PaymentMethod = 'SIMULATED' | 'PIX' | 'CARD'

Appointment {
  id: string
  clientEmail: string
  caregiverName: string
  serviceId: string
  serviceName: string
  date: string (ISO)
  startTime: string
  durationHours: number
  pricePerHour: number
  totalPrice: number
  platformFee: number
  caregiverPayout: number
  status: AppointmentStatus
  address?: string            // endereco completo, so visivel apos PAID
  createdAt: string
}

Payment {
  id: string
  appointmentId: string
  status: PaymentStatus
  amountTotal: number
  platformFee: number
  caregiverPayout: number
  method: PaymentMethod
  createdAt: string
  paidAt?: string
  refundedAt?: string
  metadata?: Record<string, any>
}

Refund {
  id: string
  paymentId: string
  amount: number
  reason: string
  createdAt: string
  createdBy: string
}

PlatformSettings {
  id: string
  platformFeeRate: number     // ex.: 0.18
  currency: string            // 'BRL'
  updatedAt: string
}
```

#### 2. PaymentContext (`src/contexts/PaymentContext.tsx`)

Estado em localStorage com keys separadas:
- `eldercare_appointments`
- `eldercare_payments`
- `eldercare_refunds`
- `eldercare_platform_settings`

Seed de PlatformSettings: `{ platformFeeRate: 0.18, currency: 'BRL' }`

Operacoes expostas:
- `getPlatformSettings()` / `updatePlatformFeeRate(rate: number)`
- `createAppointment(data)` — calcula totalPrice, platformFee, caregiverPayout usando settings.platformFeeRate
- `getAppointmentById(id)` / `getAppointmentsByClient(email)`
- `processPayment(appointmentId)` — cria Payment PAID, atualiza Appointment para PAID
- `cancelAppointment(appointmentId)` — aplica politica de cancelamento:
  - Se status != PAID: cancela sem refund
  - Se PAID e faltam >24h: refund total
  - Se PAID e faltam <=24h: refund 50%
  - Cria Refund, atualiza Payment para REFUNDED, Appointment para CANCELED
- `adminRefund(paymentId, reason)` — refund manual pelo admin
- `getPayments()` / `getPaymentByAppointment(appointmentId)`
- `getRefunds()`

Regra de calculo:
```text
totalPrice = durationHours * service.pricePerHour
platformFee = totalPrice * platformFeeRate
caregiverPayout = totalPrice - platformFee
```

#### 3. BookingPage — Mudancas

Ao clicar "Confirmar e pagar":
1. Chamar `createAppointment()` com dados do form (servico, data, horario, duracao)
2. Redirecionar para `/checkout/{appointmentId}` em vez de navegar para `/meus-agendamentos`
3. Remover a simulacao de delay atual

#### 4. CheckoutPage (`/checkout/:appointmentId`)

Layout: Navbar + Footer (mesmo padrao publico)

Conteudo:
- Card "Resumo do Atendimento": servico, cuidador, data/hora, duracao
- Card "Detalhamento de Valores":
  - Valor do servico: R$ X
  - Taxa da plataforma: inclusa (nota: "A taxa de servico esta inclusa no valor total" — conforme regra de fee embutida)
  - Total: R$ X
- Banner amarelo: "Pagamento simulado (MVP) — Nenhum valor sera cobrado"
- Checkbox obrigatorio: "Confirmo que li as Regras do Marketplace e a Politica de Cancelamento"
  - Links para /regras
  - Texto da politica de cancelamento inline
- Botao "Pagar agora (simulado)"
- Ao clicar: `processPayment(appointmentId)` → toast sucesso → redirecionar para `/cliente/pagamentos`

Gate: verificar se usuario aceitou termos via LegalContext

#### 5. ClientPayments — Reescrita

Substituir dados mock por dados reais do PaymentContext:
- Listar appointments do usuario logado (`getAppointmentsByClient(user.email)`)
- Mostrar status (PAYMENT_PENDING, PAID, CANCELED)
- Para cada appointment PAID, mostrar botao "Cancelar" com dialog de confirmacao
  - Exibir politica de cancelamento (>24h = total, <24h = 50%)
  - Ao confirmar: `cancelAppointment(appointmentId)`
- Remover secoes de "Formas de Pagamento" e "Endereco de Cobranca" (nao se aplicam ao MVP simulado)
- Manter layout ClientLayout

#### 6. AdminPayments (`/admin/payments`)

AdminLayout com titulo "Pagamentos"

Conteudo:
- Cards de resumo no topo: Total recebido, Taxa acumulada, Reembolsos
- Tabela com colunas: ID, Cliente, Servico, Valor, Taxa, Payout, Status, Data, Acoes
- Acao "Reembolsar" (dialog com campo de motivo obrigatorio)
  - Ao confirmar: `adminRefund(paymentId, reason)` → toast

#### 7. AdminSettings (`/admin/settings`)

AdminLayout com titulo "Configuracoes da Plataforma"

Conteudo:
- Card "Taxa da Plataforma":
  - Input numerico (slider ou input com %) — range 10% a 30%
  - Valor atual destacado
  - Botao "Salvar" → `updatePlatformFeeRate(rate)` → toast + audit log
- Nota: "A taxa e aplicada a novos agendamentos. Agendamentos existentes mantem a taxa original."

#### 8. AdminSidebar — Mudancas

Adicionar/atualizar itens:
- `{ icon: CreditCard, label: "Pagamentos", href: "/admin/payments" }` apos "Servicos"
- Atualizar href de "Configuracoes" de `/admin/configuracoes` para `/admin/settings`

#### 9. Rotas (App.tsx)

Adicionar:
```text
/checkout/:appointmentId → CheckoutPage
/admin/payments → AdminPayments
/admin/settings → AdminSettings
```

Envolver com PaymentProvider (dentro de ServiceProvider, pois precisa acessar servicos)

### Politica de Cancelamento — Texto exibido

```text
Politica de Cancelamento ElderCare:
- Cancelamento com mais de 24 horas de antecedencia: reembolso integral
- Cancelamento com menos de 24 horas: reembolso de 50% do valor total
- Apos o inicio do atendimento: sem reembolso
```

### Ordem de Implementacao

1. `src/types/payment.ts`
2. `src/contexts/PaymentContext.tsx`
3. `src/pages/CheckoutPage.tsx`
4. `src/pages/client/ClientPayments.tsx` (reescrita)
5. `src/pages/admin/AdminPayments.tsx`
6. `src/pages/admin/AdminSettings.tsx`
7. `src/pages/BookingPage.tsx` (integracao)
8. `src/components/admin/AdminSidebar.tsx`
9. `src/App.tsx` (rotas + provider)

