import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CuidareLogo } from "@/components/CuidareLogo";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <CuidareLogo size="lg" className="mb-8" />
      <h1 className="mb-2 text-5xl font-bold text-foreground">404</h1>
      <p className="mb-6 text-lg text-muted-foreground text-center">
        Página não encontrada. O endereço que você procura não existe ou foi movido.
      </p>
      <Button asChild size="lg">
        <a href="/">Voltar ao Início</a>
      </Button>
    </div>
  );
};

export default NotFound;
