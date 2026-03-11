import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Curami</span>
            </Link>
            <p className="text-background/70 max-w-md">
              Conectando quem precisa de cuidado com quem sabe cuidar. 
              Uma plataforma segura e confiável para encontrar cuidadores verificados.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#como-funciona" className="text-background/70 hover:text-background transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <Link to="/buscar-cuidadores" className="text-background/70 hover:text-background transition-colors">
                  Encontrar Cuidador
                </Link>
              </li>
              <li>
                <Link to="/cadastro?tipo=cuidador" className="text-background/70 hover:text-background transition-colors">
                  Seja um Cuidador
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/termos" className="text-background/70 hover:text-background transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-background/70 hover:text-background transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/regras" className="text-background/70 hover:text-background transition-colors">
                  Regras do Marketplace
                </Link>
              </li>
              <li>
                <Link to="/termo-cuidador" className="text-background/70 hover:text-background transition-colors">
                  Termo do Cuidador
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/50">
          <p>&copy; {new Date().getFullYear()} Cuidare. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
