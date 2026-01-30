import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchCaregivers from "./pages/SearchCaregivers";
import CaregiverProfile from "./pages/CaregiverProfile";
import BookingPage from "./pages/BookingPage";
import ReviewPage from "./pages/ReviewPage";

// Caregiver Pages
import CaregiverDashboard from "./pages/caregiver/CaregiverDashboard";
import CaregiverTraining from "./pages/caregiver/CaregiverTraining";

// Client Pages
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProfile from "./pages/client/ClientProfile";
import ClientPayments from "./pages/client/ClientPayments";
import ClientCalendar from "./pages/client/ClientCalendar";
import ClientReviews from "./pages/client/ClientReviews";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
            
            {/* Caregiver Routes */}
            <Route path="/cuidador/dashboard" element={<CaregiverDashboard />} />
            <Route path="/cuidador/formacao" element={<CaregiverTraining />} />
            
            {/* Client Routes */}
            <Route path="/cliente/dashboard" element={<ClientDashboard />} />
            <Route path="/cliente/perfil" element={<ClientProfile />} />
            <Route path="/cliente/pagamentos" element={<ClientPayments />} />
            <Route path="/cliente/agenda" element={<ClientCalendar />} />
            <Route path="/cliente/avaliacoes" element={<ClientReviews />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
