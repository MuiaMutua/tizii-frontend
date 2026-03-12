import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Menu,
  Building2,
  Users,
  TrendingUp,
  Plus
} from "lucide-react";
import { studiosApi, bookingsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StudioManagement } from "@/components/StudioManagement";
import { StudioFormDialog } from "@/components/StudioFormDialog";
import { RoomFormDialog } from "@/components/RoomFormDialog";

const StudioStaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [studios, setStudios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Studio Creation
  const [studioDialogOpen, setStudioDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.role !== "studio_staff") {
      navigate("/home");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [bookingsRes, studiosRes] = await Promise.all([
        bookingsApi.getAll(),
        studiosApi.getAll(),
      ]);
      
      // Backend returns { studios: [...] }
      const allStudios = studiosRes.data.studios || (Array.isArray(studiosRes.data) ? studiosRes.data : []);
      
      // Filter studios where user is assigned as staff via studio_members table
      const myStudios = allStudios.filter((studio: any) => 
        studio.staff?.some((member: any) => member.user_id === user?.id && member.role === 'studio_staff')
      );
      
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
      
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      setStudios(studiosWithRooms);
    } catch (error: any) {
      console.error("Failed to fetch studio staff data:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch data",
        variant: "destructive",
      });
      setBookings([]);
      setStudios([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      await bookingsApi.updateStatus(bookingId, status);
      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update booking",
        variant: "destructive",
      });
    }
  };

  const [activeTab, setActiveTab] = useState("dashboard");

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Studio Staff
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
          Studios
        </Button>
        <Button 
          variant={activeTab === "bookings" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => navigate("/bookings")}
        >
          <Users className="h-5 w-5" />
          Bookings
        </Button>
        <Button 
          variant={activeTab === "schedule" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("schedule")}
        >
          <TrendingUp className="h-5 w-5" />
          Schedule
        </Button>
      </nav>

      <div className="p-3 space-y-2 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 hover:bg-accent"
          onClick={() => navigate("/settings")}
        >
          <Clock className="h-5 w-5" />
          Settings
        </Button>
      </div>
    </div>
  );

  const todayBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.start_time).toDateString();
    const today = new Date().toDateString();
    return bookingDate === today;
  });

  const upcomingBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.start_time);
    const today = new Date();
    return bookingDate > today;
  });

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
        <SheetContent side="left" className="w-64 p-0 flex-col">
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
                placeholder="Search bookings..." 
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
        <main className="p-4 lg:p-8 space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
                <CalendarIcon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayBookings.length}</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <User className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Studios & Rooms Management */}
          {studios.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>My Studios & Rooms</CardTitle>
                <CardDescription>Manage rooms in studios you're assigned to</CardDescription>
              </CardHeader>
              <CardContent>
                <StudioManagement studios={studios} onRefresh={fetchData} showCreateStudio={false} canManageStudios={false} />
              </CardContent>
            </Card>
          )}

          {/* Studio Form Dialog */}
          <StudioFormDialog
            open={studioDialogOpen}
            onOpenChange={setStudioDialogOpen}
            onSuccess={fetchData}
            ownerId={user?.id}
          />

          {/* Today's Bookings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Today's Bookings</CardTitle>
              <CardDescription>Manage bookings scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No bookings scheduled for today
                </p>
              ) : (
                <div className="space-y-4">
                  {todayBookings.map((booking) => (
                    <Card key={booking.id} className="glass-strong">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {studios.find((s) => s.id === booking.studio_id)?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.start_time).toLocaleTimeString()} -{" "}
                              {new Date(booking.end_time).toLocaleTimeString()}
                            </p>
                            <p className="text-sm font-medium">KES {booking.amount}</p>
                          </div>
                          <div className="flex gap-2">
                            {booking.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            {booking.status !== "pending" && (
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  booking.status === "confirmed"
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-red-500/20 text-red-500"
                                }`}
                              >
                                {booking.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Bookings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Future bookings scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming bookings
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 10).map((booking) => (
                    <Card key={booking.id} className="glass-strong">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {studios.find((s) => s.id === booking.studio_id)?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.start_time).toLocaleDateString()} at{" "}
                              {new Date(booking.start_time).toLocaleTimeString()}
                            </p>
                            <p className="text-sm font-medium">KES {booking.amount}</p>
                          </div>
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

export default StudioStaffDashboard;