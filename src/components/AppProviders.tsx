import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { KycProvider } from "@/contexts/KycContext";
import { LegalProvider } from "@/contexts/LegalContext";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { CaregiverProvider } from "@/contexts/CaregiverContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <LegalProvider>
            <KycProvider>
              <ServiceProvider>
                <PaymentProvider>
                  <CaregiverProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      {children}
                    </TooltipProvider>
                  </CaregiverProvider>
                </PaymentProvider>
              </ServiceProvider>
            </KycProvider>
          </LegalProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
