import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, Star, Settings, LogOut, Shield, ShieldCheck, FileText, Package, CreditCard, BarChart3, Bell, Map } from "lucide-react";
import { CuidareLogo } from "@/components/CuidareLogo";
import { cn } from "@/lib/utils";
import { useKyc } from "@/contexts/KycContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: BarChart3, label: "Métricas", href: "/admin/metrics" },
  { icon: ShieldCheck, label: "KYC", href: "/admin/kyc", showPendingBadge: true },
  { icon: FileText, label: "Documentos Legais", href: "/admin/legal" },
  { icon: Package, label: "Serviços", href: "/admin/services" },
  { icon: CreditCard, label: "Pagamentos", href: "/admin/payments" },
  { icon: Bell, label: "Notificações", href: "/notifications", showNotifBadge: true },
  { icon: Users, label: "Usuários", href: "/admin/usuarios" },
  { icon: Calendar, label: "Atendimentos", href: "/admin/atendimentos" },
  { icon: Star, label: "Avaliações", href: "/admin/avaliacoes" },
  { icon: Map, label: "Sitemap", href: "/admin/sitemap" },
  { icon: Settings, label: "Configurações", href: "/admin/settings" },
];

export function AdminSidebar() {
  const location = useLocation();
  const { pendingCount } = useKyc();
  const { unreadCount } = useNotifications();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-foreground/20">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <ShieldCheckLogo className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-xl font-bold text-background">Cuidare</span>
            <p className="text-xs text-background/60">Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-background/70 hover:bg-background/10 hover:text-background"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.showPendingBadge && pendingCount > 0 && !isActive && (
                <Badge className="ml-auto bg-primary text-primary-foreground text-xs">
                  {pendingCount}
                </Badge>
              )}
              {(item as any).showNotifBadge && unreadCount > 0 && !isActive && (
                <Badge className="ml-auto bg-primary text-primary-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-foreground/20">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/10 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-background truncate">Administrador</p>
            <p className="text-xs text-background/60">admin@cuidare.com.br</p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-background/70 hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </Link>
      </div>
    </aside>
  );
}
