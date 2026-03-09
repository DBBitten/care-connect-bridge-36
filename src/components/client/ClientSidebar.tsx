import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Star,
  User,
  LogOut,
  Settings,
  Search,
  Bell,
} from "lucide-react";
import { CuidareLogo } from "@/components/CuidareLogo";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/cliente/dashboard" },
  { icon: Search, label: "Buscar Cuidadores", href: "/buscar-cuidadores" },
  { icon: Bell, label: "Notificações", href: "/notifications", showBadge: true },
  { icon: Calendar, label: "Meus Agendamentos", href: "/cliente/agenda" },
  { icon: CreditCard, label: "Pagamentos", href: "/cliente/pagamentos" },
  { icon: Star, label: "Avaliações", href: "/cliente/avaliacoes" },
  { icon: User, label: "Meu Perfil", href: "/cliente/perfil" },
  { icon: Settings, label: "Configurações", href: "/cliente/configuracoes" },
];

export function ClientSidebar() {
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/" className="flex items-center gap-3">
          <CuidareLogo size="md" />
          {!collapsed && (
            <span className="text-xl font-bold text-primary">Cuidare</span>
          )}
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const button = (
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                );

                return (
                  <SidebarMenuItem key={item.href} className="relative">
                    {button}
                    {item.showBadge && unreadCount > 0 && !isActive && !collapsed && (
                      <Badge className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none">
                        {unreadCount}
                      </Badge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User section */}
      <SidebarFooter className="border-t border-border">
        {!collapsed && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">João Oliveira</p>
              <p className="text-xs text-muted-foreground">Familiar</p>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sair">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
