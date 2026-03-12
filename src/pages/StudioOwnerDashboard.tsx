import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studiosApi, bookingsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import CreateUserDialog from "@/components/CreateUserDialog";
import { 
  Calendar as CalendarIcon, 
  DollarSign, 
  Users, 
  Building2, 
  TrendingUp,
  Menu,
  Plus
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StudioManagement } from "@/components/StudioManagement";
import { StudioFormDialog } from "@/components/StudioFormDialog";

const StudioOwnerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studios, setStudios] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Studio Creation
  const [studioDialogOpen, setStudioDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.role !== "studio_owner") {
      navigate("/home");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [studiosRes, bookingsRes] = await Promise.all([
        studiosApi.getAll(),
        bookingsApi.getAll(),
      ]);
      
      // Backend returns { studios: [...] }
      const allStudios = studiosRes.data.studios || (Array.isArray(studiosRes.data) ? studiosRes.data : []);
      // Filter studios owned by this user
      const myStudios = allStudios.filter((studio: any) => studio.owner_id === user?.id);
      
      // Fetch rooms for each studio
      const studiosWithRooms = await Promise.all(
        myStudios.map(async (studio: any) => {
          try {
            const roomsRes = await studiosApi.getRooms(studio.id);
            const rooms = roomsRes.data.rooms || (Array.isArray(roomsRes.data) ? roomsRes.data : []);
            return { ...studio, rooms };
          } catch {
            return { ...studio, rooms: [] };
          }
        })
      );
      
      setStudios(studiosWithRooms);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
    } catch (error: any) {
      console.error("Failed to fetch studio owner data:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch data",
        variant: "destructive",
      });
      setStudios([]);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState("dashboard");

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Studio Owner
        </h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Overview</p>
        <Button 
          variant={activeTab === "dashboard" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("dashboard")}
        >
          <CalendarIcon className="h-5 w-5" />
          Dashboard
        </Button>
        <Button 
          variant={activeTab === "studios" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("studios")}
        >
          <Building2 className="h-5 w-5" />
          My Studios
        </Button>
        <Button 
          variant={activeTab === "bookings" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => navigate("/bookings")}
        >
          <Users className="h-5 w-5" />
          Bookings
        </Button>
        
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mt-6 mb-2">Finance</p>
        <Button 
          variant={activeTab === "revenue" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("revenue")}
        >
          <DollarSign className="h-5 w-5" />
          Revenue
        </Button>
        <Button 
          variant={activeTab === "analytics" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("analytics")}
        >
          <TrendingUp className="h-5 w-5" />
          Analytics
        </Button>
      </nav>

      <div className="p-3 space-y-2 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 hover:bg-accent"
          onClick={() => navigate("/settings")}
        >
          <DollarSign className="h-5 w-5" />
          Settings
        </Button>
      </div>
    </div>
  );

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-card border-r flex-col z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <input 
                type="search" 
                placeholder="Search..." 
                className="w-full max-w-md px-4 py-2 rounded-lg border bg-background text-sm"
              />
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <CreateUserDialog 
              role="studio_manager" 
              buttonLabel="Create Studio Manager"
              title="Create Studio Manager"
            />
            <CreateUserDialog 
              role="studio_staff" 
              buttonLabel="Create Studio Staff"
              title="Create Studio Staff"
            />

            <Button variant="outline" className="gap-2" onClick={() => setStudioDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Studio
            </Button>
          </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {(totalRevenue || 0).toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBookings}</div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Studios</CardTitle>
                  <Building2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studios.length}</div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingBookings.length}</div>
                </CardContent>
              </Card>
            </div>

          {/* Studios & Rooms Management */}
          <Card className="mb-6 lg:mb-8 mt-6">
            <CardHeader>
              <CardTitle>My Studios & Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              {studios.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No studios yet. Create your first studio above.
                </p>
              ) : (
                <StudioManagement studios={studios} onRefresh={fetchData} showCreateStudio={false} canManageStudios={true} />
              )}
            </CardContent>
          </Card>

          {/* Studio Form Dialog */}
          <StudioFormDialog
            open={studioDialogOpen}
            onOpenChange={setStudioDialogOpen}
            onSuccess={fetchData}
            ownerId={user?.id}
          />

            {/* Recent Bookings */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest bookings across all studios</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No bookings yet</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <Card key={booking.id} className="glass-strong">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {studios.find((s) => s.id === booking.studio_id)?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(booking.start_time).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">KES {booking.amount}</p>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  booking.status === "confirmed"
                                    ? "bg-green-500/20 text-green-500"
                                    : booking.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "bg-red-500/20 text-red-500"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
};

export default StudioOwnerDashboard;