import { Home, Calendar, Bell, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Determine profile path based on user role
  const getProfilePath = () => {
    if (!user) return "/auth";
    
    const roleMap: Record<string, string> = {
      admin: "/admin/dashboard",
      studio_owner: "/studio-owner/dashboard",
      studio_manager: "/studio-manager/dashboard",
      studio_staff: "/studio-staff/dashboard",
      artist: "/artist/dashboard",
    };
    
    return roleMap[user.platform_role || user.role] || "/artist/dashboard";
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Calendar, label: "Bookings", path: "/bookings" },
    { icon: Bell, label: "Alerts", path: "/alerts" },
    { icon: User, label: "Profile", path: getProfilePath() },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Mobile view: full width */}
      <div className="md:hidden bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 w-full transition-all duration-300",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn("h-6 w-6", isActive && "stroke-[2.5]")}
                />
                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    isActive && "font-bold"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Laptop view: small, centered, floating */}
      <div className="hidden md:flex justify-center mb-4">
        <div className="glass-card border-0 rounded-[2rem] shadow-2xl backdrop-blur-xl md:px-6 px-2 py-3 md:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)] transition-all duration-300 pointer-events-auto md:max-w-fit">
          <div className="flex items-center justify-around md:gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center gap-1 px-5 py-3 rounded-2xl transition-all duration-300 relative group",
                    isActive
                      ? "bg-primary/10 text-primary scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-105"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl animate-pulse-glow" />
                  )}
                  <item.icon
                    className={cn(
                      "h-6 w-6 transition-all relative z-10",
                      isActive && "fill-primary/20 stroke-[2.5]"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-semibold relative z-10",
                      isActive && "font-bold"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
