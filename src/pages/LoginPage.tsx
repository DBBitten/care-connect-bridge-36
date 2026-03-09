import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users, UserCheck, Mail, Lock, Shield } from "lucide-react";
import { CuidareLogo } from "@/components/CuidareLogo";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useLegal } from "@/contexts/LegalContext";
import { LegalAcceptanceModal } from "@/components/legal/LegalAcceptanceModal";

type LoginUserType = "cuidador" | "necessitado" | "admin";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated, userType: currentUserType } = useAuth();
  const { hasPendingInitialAcceptance } = useLegal();
  const initialType = searchParams.get("tipo") as LoginUserType | null;
  
  const [userType, setUserType] = useState<LoginUserType | null>(initialType);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Call login from context
    login(email, userType!);
    
    toast.success("Login realizado com sucesso!");
    
    // Check if user needs to accept terms
    const redirectPath = userType === "admin" ? "/admin" : userType === "cuidador" ? "/cuidador/dashboard" : "/cliente/dashboard";
    setPendingRedirect(redirectPath);
    setIsLoading(false);
    
    // Will check for pending acceptance in useEffect
  };

  // Check for pending legal acceptance after login
  useEffect(() => {
    if (isAuthenticated && pendingRedirect) {
      if (userType !== 'admin' && hasPendingInitialAcceptance()) {
        setShowLegalModal(true);
      } else {
        navigate(pendingRedirect);
        setPendingRedirect(null);
      }
    }
  }, [isAuthenticated, pendingRedirect, hasPendingInitialAcceptance, navigate]);

  const handleLegalAccepted = () => {
    setShowLegalModal(false);
    if (pendingRedirect) {
      navigate(pendingRedirect);
      setPendingRedirect(null);
    }
  };

  if (!userType) {
    return (
      <>
      <Navbar />
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>

          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <CuidareLogo size="md" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h1>
            <p className="text-muted-foreground">Como você quer entrar?</p>
          </div>

          <div className="space-y-4">
            <Card
              variant="feature"
              className="cursor-pointer"
              onClick={() => setUserType("necessitado")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Preciso de cuidador</h3>
                  <p className="text-sm text-muted-foreground">Sou familiar ou responsável</p>
                </div>
              </CardContent>
            </Card>

            <Card
              variant="feature"
              className="cursor-pointer"
              onClick={() => setUserType("cuidador")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <UserCheck className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Sou cuidador</h3>
                  <p className="text-sm text-muted-foreground">Quero oferecer meus serviços</p>
                </div>
              </CardContent>
            </Card>

            <Card
              variant="feature"
              className="cursor-pointer"
              onClick={() => setUserType("admin")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Sou administrador</h3>
                  <p className="text-sm text-muted-foreground">Acesso ao painel de gestão</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Não tem conta?{" "}
            <Link to="/cadastro" className="text-primary font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>
      </div>
    </div>
    </>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <Card variant="elevated">
          <CardHeader className="text-center">
            <CuidareLogo size="md" className="mx-auto mb-4" />
            <CardTitle>Entrar como {userType === "admin" ? "Administrador" : userType === "cuidador" ? "Cuidador" : "Familiar"}</CardTitle>
            <CardDescription>
              Digite seus dados para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
                    Esqueci a senha
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Não tem conta?{" "}
              <Link to={`/cadastro?tipo=${userType}`} className="text-primary font-medium hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
        
        {/* Legal Acceptance Modal */}
        <LegalAcceptanceModal
          open={showLegalModal}
          onAccepted={handleLegalAccepted}
          title="Termos de Uso"
          description="Para continuar usando a Cuidare, aceite nossos termos."
          requiredDocuments={['TERMS_OF_USE', 'PRIVACY_POLICY']}
        />
      </div>
    </div>
    </>
  );
};

export default LoginPage;
