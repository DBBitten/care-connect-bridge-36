import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
