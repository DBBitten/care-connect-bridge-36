

## Plano: Sidebar colapsável com botão de toggle

### O que muda

A sidebar do cliente será refatorada para usar o componente `Sidebar` do Shadcn (já disponível em `ui/sidebar.tsx`), que tem suporte nativo a colapsar/expandir com animação. Quando colapsada, mostra apenas os ícones. Um botão de toggle fica visível no topo da área de conteúdo.

### Arquivos alterados

**1. `src/components/client/ClientSidebar.tsx`** — Reescrever usando os componentes Shadcn:
- `Sidebar` com `collapsible="icon"`
- `SidebarHeader` com logo (quando colapsado, mostra só o ícone)
- `SidebarContent` > `SidebarMenu` com `SidebarMenuItem` + `SidebarMenuButton` para cada nav item, usando `tooltip` para mostrar label quando colapsado
- `SidebarFooter` com seção do usuário e botão sair
- Manter highlight do item ativo e badge de notificações

**2. `src/components/client/ClientLayout.tsx`** — Adaptar o layout:
- Envolver tudo com `SidebarProvider`
- Usar `SidebarInset` em vez de `<main className="ml-64">`
- Adicionar `SidebarTrigger` no header da área de conteúdo (sempre visível)
- O layout se ajusta automaticamente quando a sidebar colapsa/expande

### Comportamento
- Desktop: sidebar começa expandida (16rem), ao clicar no trigger colapsa para modo ícone (3rem) mostrando apenas ícones com tooltips
- Mobile: sidebar abre como Sheet (overlay), com trigger sempre visível
- Atalho de teclado Ctrl+B funciona automaticamente

