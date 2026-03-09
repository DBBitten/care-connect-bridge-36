

## Plano: Adicionar sidebar na página de Notificações

### Alteração

**`src/pages/NotificationsPage.tsx`**

- Remover `Navbar` e `Footer`
- Envolver o conteúdo com `ClientLayout` (mesmo padrão usado em `ClientDashboard`, `ClientProfile`, etc.)
- Título: "Notificações", subtitle opcional com contagem de não lidas
- Manter todo o conteúdo interno (lista de notificações, botão marcar todas como lidas, estado vazio)

