import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import BookingSettings from "./pages/BookingSettings";
import AlertSettings from "./pages/AlertSettings";
import Bookings from "./pages/Bookings";
import Alerts from "./pages/Alerts";
import StudioDetails from "./pages/StudioDetails";
import RoomDetails from "./pages/RoomDetails";
import Checkout from "./pages/Checkout";
import BookingConfirmed from "./pages/BookingConfirmed";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import StudioManagerDashboard from "./pages/StudioManagerDashboard";
import StudioOwnerDashboard from "./pages/StudioOwnerDashboard";
import StudioStaffDashboard from "./pages/StudioStaffDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import HelpCenter from "./pages/HelpCenter";

import { DarkModeProvider } from "./contexts/DarkModeContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/studio/:id" element={<StudioDetails />} />
              <Route path="/studio/:studioId/room/:roomId" element={<RoomDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/settings" element={<BookingSettings />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/alerts/settings" element={<AlertSettings />} />
              <Route path="/checkout/:studioId/room/:roomId" element={<Checkout />} />
              <Route path="/booking-confirmed" element={<BookingConfirmed />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/studio-manager/dashboard" element={<StudioManagerDashboard />} />
              <Route path="/studio-owner/dashboard" element={<StudioOwnerDashboard />} />
              <Route path="/studio-staff/dashboard" element={<StudioStaffDashboard />} />
              <Route path="/artist/dashboard" element={<ArtistDashboard />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </DarkModeProvider>
  );
};

export default App;
