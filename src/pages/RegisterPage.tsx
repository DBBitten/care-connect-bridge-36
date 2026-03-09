import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, UserCheck, Mail, Lock, User, Phone, MapPin, Calendar, FileText, ExternalLink } from "lucide-react";
import { CuidareLogo } from "@/components/CuidareLogo";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useLegal } from "@/contexts/LegalContext";

type UserType = "cuidador" | "necessitado";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { acceptDocument, acceptMultipleDocuments } = useLegal();
  const initialType = searchParams.get("tipo") as UserType | null;
  
  const [userType, setUserType] = useState<UserType | null>(initialType);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    city: "",
    needType: "",
    availability: [] as string[],
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (!acceptTerms || !acceptPrivacy) {
      toast.error("Você precisa aceitar os termos de uso e política de privacidade");
      return;
    }

    setIsLoading(true);

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Record acceptance of legal documents
    acceptMultipleDocuments(['TERMS_OF_USE', 'PRIVACY_POLICY']);

    // Log in the user
    login(formData.email, userType!);

    toast.success("Cadastro realizado com sucesso!");
    
    // Redirect based on user type
    if (userType === "cuidador") {
      navigate("/cuidador/dashboard");
    } else {
      navigate("/buscar-cuidadores");
    }
    
    setIsLoading(false);
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
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Criar conta</h1>
            <p className="text-muted-foreground">Como você quer se cadastrar?</p>
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
                  <h3 className="font-semibold text-foreground">Quero ser cuidador</h3>
                  <p className="text-sm text-muted-foreground">Oferecer meus serviços de cuidado</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Entrar
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
    <div className="min-h-screen bg-background py-12 px-4 pt-20">
      <div className="w-full max-w-lg mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <Card variant="elevated">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
              {userType === "cuidador" ? (
                <UserCheck className="w-6 h-6 text-primary-foreground" />
              ) : (
                <Users className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
            <CardTitle>
              Cadastro de {userType === "cuidador" ? "Cuidador" : "Familiar"}
            </CardTitle>
            <CardDescription>
              {userType === "cuidador"
                ? "Preencha seus dados para oferecer seus serviços"
                : "Preencha seus dados para encontrar cuidadores"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Common fields */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Caregiver specific fields */}
              {userType === "cuidador" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        className="pl-10"
                        value={formData.cpf}
                        onChange={(e) => handleChange("cpf", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade/Região</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="city"
                        placeholder="São Paulo - SP"
                        className="pl-10"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Disponibilidade</Label>
                    <Select onValueChange={(value) => handleChange("availability", value)}>
                      <SelectTrigger>
                        <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                        <SelectValue placeholder="Selecione sua disponibilidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manha">Manhã (6h-12h)</SelectItem>
                        <SelectItem value="tarde">Tarde (12h-18h)</SelectItem>
                        <SelectItem value="noite">Noite (18h-22h)</SelectItem>
                        <SelectItem value="integral">Integral</SelectItem>
                        <SelectItem value="pernoite">Pernoite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Family specific fields */}
              {userType === "necessitado" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="city"
                        placeholder="São Paulo - SP"
                        className="pl-10"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de necessidade</Label>
                    <Select onValueChange={(value) => handleChange("needType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de cuidado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idoso">Cuidado de idoso</SelectItem>
                        <SelectItem value="especial">Necessidades especiais</SelectItem>
                        <SelectItem value="temporario">Cuidado temporário (pós-cirurgia, etc)</SelectItem>
                        <SelectItem value="companhia">Companhia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Password fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                    Li e aceito os{" "}
                    <Link to="/termos" target="_blank" className="text-primary hover:underline inline-flex items-center gap-1">
                      Termos de Uso
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </label>
                </div>
                
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="privacy"
                    checked={acceptPrivacy}
                    onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                  />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground leading-tight">
                    Li e aceito a{" "}
                    <Link to="/privacidade" target="_blank" className="text-primary hover:underline inline-flex items-center gap-1">
                      Política de Privacidade
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading || !acceptTerms || !acceptPrivacy}>
                {isLoading ? "Cadastrando..." : "Criar conta"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Já tem conta?{" "}
              <Link to={`/login?tipo=${userType}`} className="text-primary font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default RegisterPage;
