import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studiosApi, bookingsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  DollarSign, 
  Users, 
  Building2, 
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Menu,
  Plus
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StudioManagement } from "@/components/StudioManagement";
import { StudioFormDialog } from "@/components/StudioFormDialog";

const StudioManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studios, setStudios] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Studio Creation
  const [studioDialogOpen, setStudioDialogOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "studio_manager") {
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
      
      // Filter studios where user is assigned as manager via studio_members table
      const myStudios = allStudios.filter((studio: any) => 
        studio.staff?.some((member: any) => member.user_id === user?.id && member.role === 'studio_manager')
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
      
      setStudios(studiosWithRooms);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
    } catch (error: any) {
      console.error("Failed to fetch studio manager data:", error);
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
          Studio Manager
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
          <Settings className="h-5 w-5" />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            logout();
            navigate("/auth");
          }}
        >
          <TrendingDown className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const totalRevenue = bookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  
  const totalBookings = bookings.length;
  const utilizationRate = studios.length > 0 
    ? Math.round((bookings.length / (studios.length * 30)) * 100) 
    : 0;

  // Mock revenue data - replace with actual data
  const revenueData = Array.from({ length: 12 }, (_, i) => ({
    month: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][i],
    revenue: 15000 + Math.random() * 10000,
  }));

  const pendingBookings = bookings.filter(b => b.status === "pending").slice(0, 5);

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
        <header className="border-b bg-card/50 backdrop-blur">
          <div className="px-8 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <input 
                type="search" 
                placeholder="Search bookings..." 
                className="w-full max-w-md px-4 py-2 rounded-lg border bg-background"
              />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8">
          {/* Action Buttons */}
          <div className="mb-6">
            <Button className="gap-2" onClick={() => setStudioDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Studio
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  KES {(totalRevenue / 1000).toFixed(1)}k
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+8.3%</span> vs last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Bookings
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalBookings}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">-2.5%</span> vs last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Utilization Rate
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{utilizationRate}%</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+4.2%</span> vs last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Studios & Rooms Management */}
          <Card className="mb-6 lg:mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">My Studios & Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              {studios.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No studios assigned yet. Contact your studio owner to get access.
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pending Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Pending Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingBookings.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No pending bookings
                    </p>
                  ) : (
                    pendingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {booking.artist?.full_name?.slice(0, 2) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {booking.artist?.full_name || "Artist"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(booking.start_time).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-green-500"
                            onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Section */}
          <Card className="mt-6 lg:mt-8">
            <CardHeader>
              <CardTitle className="text-base font-medium">Booking Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default StudioManagerDashboard;