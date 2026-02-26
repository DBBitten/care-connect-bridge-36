

## Plano: Sistema de Notificacoes Transacionais — ElderCare

### Resumo

Implementar sistema de notificacoes internas com modelo Notification, contexto centralizado, icone de sino no header, pagina `/notifications`, gatilhos automaticos nos fluxos existentes (appointment, payment, cancelamento, KYC), e job manual de lembretes para reducao de no-show.

### Analise do Estado Atual

- **PaymentContext**: Gerencia appointments, payments, refunds — sera o principal emissor de notificacoes
- **KycContext**: Gerencia status KYC — emitira notificacoes quando admin muda status
- **AuthContext**: Fornece `user.email` como userId
- **Navbar**: Header publico com logo + links — recebera icone de sino
- **Sidebars** (Client, Caregiver, Admin): Receberao item "Notificacoes" na navegacao
- **Nao existe**: Nenhum sistema de notificacoes, nem persistencia de reviews
- **E-mail**: Nao ha infra de envio — sera omitido no MVP, apenas notificacoes internas

### Arquivos Novos

| Arquivo | Descricao |
|---------|-----------|
| `src/types/notification.ts` | Tipo Notification e enum NotificationType |
| `src/contexts/NotificationContext.tsx` | Contexto com CRUD de notificacoes, persistencia em localStorage, funcao de criar notificacao |
| `src/pages/NotificationsPage.tsx` | Pagina `/notifications` com lista completa de notificacoes |
| `src/components/notifications/NotificationBell.tsx` | Icone de sino com badge de contagem + dropdown com ultimas notificacoes |

### Arquivos Modificados

| Arquivo | Alteracao |
|---------|-----------|
| `src/App.tsx` | Adicionar NotificationProvider (envolvendo tudo), rota `/notifications` |
| `src/components/layout/Navbar.tsx` | Adicionar NotificationBell ao lado dos botoes de auth |
| `src/components/client/ClientSidebar.tsx` | Adicionar item "Notificacoes" com badge |
| `src/components/caregiver/CaregiverSidebar.tsx` | Adicionar item "Notificacoes" com badge |
| `src/components/admin/AdminSidebar.tsx` | Adicionar item "Notificacoes" com badge |
| `src/contexts/PaymentContext.tsx` | Chamar `addNotification` nos gatilhos: createAppointment, processPayment, cancelAppointment |
| `src/contexts/KycContext.tsx` | Chamar `addNotification` nos gatilhos: approveSubmission, rejectSubmission, requestMoreInfo |

### Detalhamento Tecnico

#### 1. Tipos (`src/types/notification.ts`)

```text
NotificationType =
  'APPOINTMENT_REQUESTED'
  'APPOINTMENT_CONFIRMED'
  'PAYMENT_PENDING'
  'PAYMENT_CONFIRMED'
  'APPOINTMENT_REMINDER_24H'
  'APPOINTMENT_REMINDER_2H'
  'APPOINTMENT_CANCELED'
  'APPOINTMENT_COMPLETED_REVIEW_REQUEST'
  'KYC_STATUS_CHANGED'

Notification {
  id: string
  userId: string          // email do destinatario
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  linkUrl: string         // rota interna para acao
  createdAt: string
}
```

#### 2. NotificationContext (`src/contexts/NotificationContext.tsx`)

Estado em localStorage key `eldercare_notifications`.

Operacoes expostas:
- `notifications` — array completo
- `unreadCount` — contagem de nao lidas para o usuario logado
- `userNotifications` — filtradas pelo user.email logado
- `addNotification(data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>)` — cria com id unico, isRead=false
- `markAsRead(id: string)` — marca uma como lida
- `markAllAsRead()` — marca todas do usuario como lidas
- `runReminderJob()` — funcao que varre appointments PAID, verifica se faltam ~24h ou ~2h, e cria notificacoes de lembrete (idempotente, nao duplica)

O provider nao depende de PaymentContext nem KycContext (para evitar dependencia circular). Em vez disso, os contexts existentes importarao `useNotifications` e chamarao `addNotification` diretamente.

#### 3. NotificationBell (`src/components/notifications/NotificationBell.tsx`)

- Icone `Bell` do lucide-react
- Badge vermelho com `unreadCount` (se > 0)
- Ao clicar: abre Popover com lista das ultimas 5 notificacoes
  - Cada item mostra titulo, body truncado, tempo relativo ("ha 2h")
  - Clique no item: navega para `linkUrl` e marca como lida
- Link "Ver todas" → `/notifications`
- Botao "Marcar todas como lidas"

#### 4. NotificationsPage (`/notifications`)

- Layout com Navbar + Footer (pagina publica-like, acessivel por qualquer usuario logado)
- Lista completa de notificacoes do usuario logado, ordenada por data desc
- Cada item mostra: icone por tipo, titulo, body, data, status lida/nao-lida
- Clique navega para linkUrl
- Botao "Marcar todas como lidas" no topo

#### 5. Gatilhos — PaymentContext

Modificar as funcoes existentes para chamar `addNotification`:

**createAppointment**: Apos criar appointment:
- Notificar cliente: tipo `PAYMENT_PENDING`, titulo "Agendamento criado", body "Seu agendamento com {caregiverName} esta aguardando pagamento", link `/checkout/{id}`
- Notificar cuidador: tipo `APPOINTMENT_REQUESTED`, titulo "Novo agendamento", body "Voce tem um novo agendamento de {clientEmail} para {date}", link `/cuidador/dashboard`

**processPayment**: Apos pagar:
- Notificar cliente: tipo `PAYMENT_CONFIRMED`, titulo "Pagamento confirmado", body "Seu pagamento de R$ {totalPrice} foi confirmado", link `/cliente/pagamentos`
- Notificar cuidador: tipo `APPOINTMENT_CONFIRMED`, titulo "Atendimento confirmado", body "O atendimento de {date} as {startTime} foi confirmado", link `/cuidador/dashboard`

**cancelAppointment**: Apos cancelar:
- Notificar cliente: tipo `APPOINTMENT_CANCELED`, titulo "Agendamento cancelado", body com info de reembolso, link `/cliente/pagamentos`
- Notificar cuidador: tipo `APPOINTMENT_CANCELED`, titulo "Atendimento cancelado", body "O atendimento de {date} foi cancelado", link `/cuidador/dashboard`

**Implementacao tecnica**: PaymentContext sera modificado para aceitar uma funcao `onNotify` opcional via um ref/callback pattern, ou mais simplesmente, o PaymentProvider importara `useNotifications` internamente. Como ambos sao providers no App.tsx, NotificationProvider ficara **acima** de PaymentProvider na arvore.

#### 6. Gatilhos — KycContext

Modificar as funcoes admin para chamar `addNotification`:

**approveSubmission**: Notificar cuidador (userEmail da submission): tipo `KYC_STATUS_CHANGED`, titulo "KYC Aprovado!", body "Sua verificacao foi aprovada. Voce ja pode receber agendamentos.", link `/cuidador/verificacao`

**rejectSubmission**: Notificar cuidador: titulo "KYC Reprovado", body "Sua verificacao foi reprovada: {reason}", link `/cuidador/verificacao`

**requestMoreInfo**: Notificar cuidador: titulo "Pendencias no KYC", body "Sua verificacao precisa de ajustes", link `/cuidador/verificacao`

#### 7. Job de Lembretes (`runReminderJob`)

Funcao dentro do NotificationContext que:
1. Le appointments do localStorage diretamente (para evitar dependencia circular)
2. Para cada appointment com status PAID:
   - Calcula horas ate `{date}T{startTime}`
   - Se entre 23h-25h e nao existe notificacao REMINDER_24H para esse appointment → cria para cliente e cuidador
   - Se entre 1.5h-2.5h e nao existe REMINDER_2H → cria para ambos
3. A idempotencia e garantida verificando se ja existe notificacao com mesmo tipo + userId + body contendo o appointment id

**Acionamento**: Botao "Executar lembretes" na pagina `/admin/settings` para rodar manualmente no MVP.

#### 8. Navegacao — Sidebars

Adicionar em cada sidebar:
- ClientSidebar: `{ icon: Bell, label: "Notificacoes", href: "/notifications" }` com badge de unreadCount
- CaregiverSidebar: mesmo
- AdminSidebar: mesmo

#### 9. Seguranca — Dados Sensiveis

- Notificacoes nunca contem telefone, CPF, endereco completo
- Body usa apenas primeiro nome, data e valor
- linkUrl aponta para paginas internas que aplicam seus proprios gates

#### 10. Ordem de Implementacao

1. `src/types/notification.ts`
2. `src/contexts/NotificationContext.tsx`
3. `src/components/notifications/NotificationBell.tsx`
4. `src/pages/NotificationsPage.tsx`
5. `src/contexts/PaymentContext.tsx` (adicionar gatilhos)
6. `src/contexts/KycContext.tsx` (adicionar gatilhos)
7. `src/components/layout/Navbar.tsx` (adicionar bell)
8. `src/components/client/ClientSidebar.tsx` (adicionar item)
9. `src/components/caregiver/CaregiverSidebar.tsx` (adicionar item)
10. `src/components/admin/AdminSidebar.tsx` (adicionar item)
11. `src/pages/admin/AdminSettings.tsx` (botao de rodar lembretes)
12. `src/App.tsx` (provider + rota)

