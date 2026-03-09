import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { CuidareLogo } from "@/components/CuidareLogo";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userType, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = userType === "cuidador" ? "/cuidador/dashboard" : "/cliente/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Cuidare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Início
            </a>
            <a href="/#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </a>
            <a href="/#sobre" className="text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
            <Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">
              Serviços
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Button variant="ghost" asChild>
                  <Link to={dashboardPath} className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Meu Painel
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link to="/cadastro">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <a
              href="/"
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Início
            </a>
            <a
              href="/#como-funciona"
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Como Funciona
            </a>
            <a
              href="/#sobre"
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </a>
            <Link
              to="/services"
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Serviços
            </Link>
            <div className="flex gap-3 pt-4 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to={dashboardPath} onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" />
                      Meu Painel
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/login" onClick={() => setIsOpen(false)}>Entrar</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link to="/cadastro" onClick={() => setIsOpen(false)}>Cadastrar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
