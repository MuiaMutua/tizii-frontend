import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoadingScreen from "./components/LoadingScreen";
import BottomNav from "./components/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
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

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has seen loading screen before
    const hasSeenLoading = sessionStorage.getItem("hasSeenLoading");
    if (hasSeenLoading) {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("hasSeenLoading", "true");
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/studio/:id" element={<StudioDetails />} />
            <Route path="/studio/:studioId/room/:roomId" element={<RoomDetails />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
            <Route path="/bookings/settings" element={<ProtectedRoute><BookingSettings /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path="/alerts/settings" element={<ProtectedRoute><AlertSettings /></ProtectedRoute>} />
            <Route path="/checkout/:studioId/room/:roomId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/booking-confirmed" element={<ProtectedRoute><BookingConfirmed /></ProtectedRoute>} />
            
            {/* Role-Based Protected Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/studio-manager/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["studio_manager"]}>
                  <StudioManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/studio-owner/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["studio_owner"]}>
                  <StudioOwnerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/studio-staff/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["studio_staff"]}>
                  <StudioStaffDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/artist/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["artist"]}>
                  <ArtistDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
