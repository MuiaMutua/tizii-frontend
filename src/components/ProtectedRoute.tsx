import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.platform_role || user.role)) {
    // Redirect to appropriate dashboard based on role
    const userRole = user.platform_role || user.role;
    const dashboardMap: Record<string, string> = {
      admin: "/admin/dashboard",
      studio_manager: "/studio-manager/dashboard",
      studio_owner: "/studio-owner/dashboard",
      studio_staff: "/studio-staff/dashboard",
      artist: "/artist/dashboard",
    };
    return <Navigate to={dashboardMap[userRole] || "/home"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
