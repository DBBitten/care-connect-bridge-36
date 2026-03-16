import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/components/AppProviders";

// Lazy-loaded pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const SearchCaregivers = lazy(() => import("./pages/SearchCaregivers"));
const CaregiverProfile = lazy(() => import("./pages/CaregiverProfile"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const ReviewPage = lazy(() => import("./pages/ReviewPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

const TermsOfUsePage = lazy(() => import("./pages/legal/TermsOfUsePage"));
const PrivacyPolicyPage = lazy(() => import("./pages/legal/PrivacyPolicyPage"));
const MarketplaceRulesPage = lazy(() => import("./pages/legal/MarketplaceRulesPage"));
const CaregiverTermPage = lazy(() => import("./pages/legal/CaregiverTermPage"));

const CaregiverDashboard = lazy(() => import("./pages/caregiver/CaregiverDashboard"));
const CaregiverTraining = lazy(() => import("./pages/caregiver/CaregiverTraining"));
const CaregiverKyc = lazy(() => import("./pages/caregiver/CaregiverKyc"));
const CaregiverProfileEdit = lazy(() => import("./pages/caregiver/CaregiverProfileEdit"));

const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const ClientProfile = lazy(() => import("./pages/client/ClientProfile"));
const ClientPayments = lazy(() => import("./pages/client/ClientPayments"));
const ClientCalendar = lazy(() => import("./pages/client/ClientCalendar"));
const ClientReviews = lazy(() => import("./pages/client/ClientReviews"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminKycQueue = lazy(() => import("./pages/admin/AdminKycQueue"));
const AdminKycReview = lazy(() => import("./pages/admin/AdminKycReview"));
const AdminLegalDocuments = lazy(() => import("./pages/admin/AdminLegalDocuments"));
const AdminLegalDocumentEdit = lazy(() => import("./pages/admin/AdminLegalDocumentEdit"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminServiceEdit = lazy(() => import("./pages/admin/AdminServiceEdit"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminMetrics = lazy(() => import("./pages/admin/AdminMetrics"));
const AdminSitemap = lazy(() => import("./pages/admin/AdminSitemap"));

const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            Carregando...
          </div>
        }
      >
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
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Legal Routes */}
          <Route path="/termos" element={<TermsOfUsePage />} />
          <Route path="/privacidade" element={<PrivacyPolicyPage />} />
          <Route path="/regras" element={<MarketplaceRulesPage />} />
          <Route path="/termo-cuidador" element={<CaregiverTermPage />} />

          {/* Caregiver Routes */}
          <Route path="/cuidador/dashboard" element={<CaregiverDashboard />} />
          <Route path="/cuidador/formacao" element={<CaregiverTraining />} />
          <Route path="/cuidador/verificacao" element={<CaregiverKyc />} />
          <Route path="/cuidador/perfil" element={<CaregiverProfileEdit />} />

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
          <Route path="/admin/sitemap" element={<AdminSitemap />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </AppProviders>
);

export default App;
