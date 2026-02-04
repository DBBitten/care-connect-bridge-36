import { Link, useLocation } from "react-router-dom";
import { Heart, LayoutDashboard, GraduationCap, Calendar, User, LogOut, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKyc } from "@/contexts/KycContext";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/cuidador/dashboard" },
  { icon: ShieldCheck, label: "Verificação", href: "/cuidador/verificacao", showKycBadge: true },
  { icon: GraduationCap, label: "Formação", href: "/cuidador/formacao" },
  { icon: Calendar, label: "Agenda", href: "/cuidador/agenda" },
  { icon: User, label: "Meu Perfil", href: "/cuidador/perfil" },
  { icon: Settings, label: "Configurações", href: "/cuidador/configuracoes" },
];

export function CaregiverSidebar() {
  const location = useLocation();
  const { kycStatus } = useKyc();

  const getKycBadge = () => {
    switch (kycStatus) {
      case 'APPROVED':
        return <Badge variant="secondary" className="ml-auto text-xs bg-success/20 text-success border-0">✓</Badge>;
      case 'SUBMITTED':
        return <Badge variant="outline" className="ml-auto text-xs">Análise</Badge>;
      case 'REJECTED':
      case 'NEEDS_MORE_INFO':
        return <Badge variant="destructive" className="ml-auto text-xs">!</Badge>;
      default:
        return <Badge variant="outline" className="ml-auto text-xs">Pendente</Badge>;
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">ElderCare</span>
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
              {item.showKycBadge && !isActive && getKycBadge()}
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
            <p className="text-sm font-medium text-foreground truncate">Maria Silva</p>
            <p className="text-xs text-muted-foreground">Cuidador</p>
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
