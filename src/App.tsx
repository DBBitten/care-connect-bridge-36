import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { KycProvider } from "@/contexts/KycContext";
import { LegalProvider } from "@/contexts/LegalContext";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { PaymentProvider } from "@/contexts/PaymentContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchCaregivers from "./pages/SearchCaregivers";
import CaregiverProfile from "./pages/CaregiverProfile";
import BookingPage from "./pages/BookingPage";
import ReviewPage from "./pages/ReviewPage";
import ServicesPage from "./pages/ServicesPage";
import CheckoutPage from "./pages/CheckoutPage";

// Legal Pages
import TermsOfUsePage from "./pages/legal/TermsOfUsePage";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import MarketplaceRulesPage from "./pages/legal/MarketplaceRulesPage";
import CaregiverTermPage from "./pages/legal/CaregiverTermPage";

// Caregiver Pages
import CaregiverDashboard from "./pages/caregiver/CaregiverDashboard";
import CaregiverTraining from "./pages/caregiver/CaregiverTraining";
import CaregiverKyc from "./pages/caregiver/CaregiverKyc";

// Client Pages
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProfile from "./pages/client/ClientProfile";
import ClientPayments from "./pages/client/ClientPayments";
import ClientCalendar from "./pages/client/ClientCalendar";
import ClientReviews from "./pages/client/ClientReviews";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminKycQueue from "./pages/admin/AdminKycQueue";
import AdminKycReview from "./pages/admin/AdminKycReview";
import AdminLegalDocuments from "./pages/admin/AdminLegalDocuments";
import AdminLegalDocumentEdit from "./pages/admin/AdminLegalDocumentEdit";
import AdminServices from "./pages/admin/AdminServices";
import AdminServiceEdit from "./pages/admin/AdminServiceEdit";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMetrics from "./pages/admin/AdminMetrics";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LegalProvider>
        <KycProvider>
          <ServiceProvider>
            <PaymentProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/cadastro" element={<RegisterPage />} />
                  <Route path="/buscar-cuidadores" element={<SearchCaregivers />} />
                  <Route path="/cuidador/:id" element={<CaregiverProfile />} />
                  <Route path="/agendar/:id" element={<BookingPage />} />
                  <Route path="/avaliar/:id" element={<ReviewPage />} />
                   <Route path="/services" element={<ServicesPage />} />
                   <Route path="/checkout/:appointmentId" element={<CheckoutPage />} />
                  
                  {/* Legal Routes */}
                  <Route path="/termos" element={<TermsOfUsePage />} />
                  <Route path="/privacidade" element={<PrivacyPolicyPage />} />
                  <Route path="/regras" element={<MarketplaceRulesPage />} />
                  <Route path="/termo-cuidador" element={<CaregiverTermPage />} />
                  
                  {/* Caregiver Routes */}
                  <Route path="/cuidador/dashboard" element={<CaregiverDashboard />} />
                  <Route path="/cuidador/formacao" element={<CaregiverTraining />} />
                  <Route path="/cuidador/verificacao" element={<CaregiverKyc />} />
                  
                  {/* Client Routes */}
                  <Route path="/cliente/dashboard" element={<ClientDashboard />} />
                  <Route path="/cliente/perfil" element={<ClientProfile />} />
                  <Route path="/cliente/pagamentos" element={<ClientPayments />} />
                  <Route path="/cliente/agenda" element={<ClientCalendar />} />
                  <Route path="/cliente/avaliacoes" element={<ClientReviews />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/kyc" element={<AdminKycQueue />} />
                  <Route path="/admin/kyc/:submissionId" element={<AdminKycReview />} />
                  <Route path="/admin/legal" element={<AdminLegalDocuments />} />
                  <Route path="/admin/legal/new" element={<AdminLegalDocumentEdit />} />
                  <Route path="/admin/legal/edit/:key" element={<AdminLegalDocumentEdit />} />
                  <Route path="/admin/services" element={<AdminServices />} />
                   <Route path="/admin/services/new" element={<AdminServiceEdit />} />
                   <Route path="/admin/services/:id" element={<AdminServiceEdit />} />
                   <Route path="/admin/payments" element={<AdminPayments />} />
                   <Route path="/admin/settings" element={<AdminSettings />} />
                   <Route path="/admin/metrics" element={<AdminMetrics />} />
                  
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
            </PaymentProvider>
          </ServiceProvider>
        </KycProvider>
      </LegalProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
