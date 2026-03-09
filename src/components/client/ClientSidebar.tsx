import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, CreditCard, Star, User, LogOut, Settings, Search, Bell } from "lucide-react";
import { CuidareLogo } from "@/components/CuidareLogo";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";

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

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <CuidareLogo size="md" />
          <span className="text-xl font-bold text-foreground">Cuidare</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {(item as any).showBadge && unreadCount > 0 && !isActive && (
                <Badge className="ml-auto text-xs">{unreadCount}</Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted mb-2">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">João Oliveira</p>
            <p className="text-xs text-muted-foreground">Familiar</p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </Link>
      </div>
    </aside>
  );
}
