import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { studiosApi, bookingsApi, authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { SkeletonCard } from "@/components/ui/skeleton";
import CreateUserDialog from "@/components/CreateUserDialog";
import { 
  Calendar as CalendarIcon, 
  DollarSign, 
  Users, 
  Building2, 
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Plus,
  Trash2,
  Settings,
  Menu,
  X,
  Edit,
  UserPlus
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { StudioManagement } from "@/components/StudioManagement";
import { StudioFormDialog } from "@/components/StudioFormDialog";
import { Logo } from "@/components/Logo";

const AdminDashboard = () => {
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
    if (!user || user.role !== "admin") {
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
      
      // Backend returns { studios: [...] } and handle both formats
      let studiosData = studiosRes.data.studios || (Array.isArray(studiosRes.data) ? studiosRes.data : []);
      
      // Fetch rooms for each studio
      const studiosWithRooms = await Promise.all(
        studiosData.map(async (studio) => {
          try {
            const roomsRes = await studiosApi.getRooms(studio.id);
            // Backend returns { rooms: [...] }
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
      console.error("Failed to fetch admin data:", error);
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

  // Studio creation/edit is now handled by StudioFormDialog

  const [activeTab, setActiveTab] = useState("dashboard");

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Tizii Admin
          </h1>
        </div>
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
          Studios & Rooms
        </Button>
        <Button 
          variant={activeTab === "bookings" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => { setActiveTab("bookings"); navigate("/bookings"); }}
        >
          <Users className="h-5 w-5" />
          Bookings
        </Button>
        
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mt-6 mb-2">Finance</p>
        <Button 
          variant={activeTab === "payments" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("payments")}
        >
          <DollarSign className="h-5 w-5" />
          Payments
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-12 w-48 bg-muted animate-pulse rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const activeStudios = studios.filter(s => s.is_active !== false).length;
  const revenueChange = 13.5; // Mock data - calculate from actual data

  // Mock data for charts - replace with real data
  const revenueData = [
    { month: "JAN", revenue: 15000 },
    { month: "FEB", revenue: 18000 },
    { month: "MAR", revenue: 22000 },
    { month: "APR", revenue: 25000 },
    { month: "MAY", revenue: 28000 },
    { month: "JUN", revenue: 32000 },
    { month: "JUL", revenue: 35000 },
    { month: "AUG", revenue: 33000 },
    { month: "SEP", revenue: 38000 },
    { month: "OCT", revenue: 42000 },
    { month: "NOV", revenue: 40000 },
    { month: "DEC", revenue: 45000 },
  ];

  const studioStats = [
    { name: "Recording", count: Math.floor(studios.length * 0.4), color: "hsl(var(--primary))" },
    { name: "Rehearsal", count: Math.floor(studios.length * 0.3), color: "hsl(var(--accent))" },
    { name: "Production", count: Math.floor(studios.length * 0.2), color: "hsl(var(--secondary))" },
    { name: "Mix/Master", count: Math.floor(studios.length * 0.1), color: "hsl(var(--muted))" },
  ];

  const todaysBookings = bookings.filter(b => {
    const bookingDate = new Date(b.start_time);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  }).slice(0, 3);

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
              role="studio_owner" 
              buttonLabel="Create Studio Owner"
              title="Create Studio Owner"
            />
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
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
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+6.4%</span> vs last year
                </p>
              </CardContent>
            </Card>

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
                  <span className="text-green-500">+{revenueChange}%</span> vs last year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Studios
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeStudios}</div>
              </CardContent>
            </Card>
          </div>

          {/* Studio and Room Management */}
          <Card className="mb-6 lg:mb-8">
            <CardHeader>
              <CardTitle>Studios & Rooms Management</CardTitle>
            </CardHeader>
            <CardContent>
              <StudioManagement studios={studios} onRefresh={fetchData} canManageStudios={true} />
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm text-muted-foreground">Revenue 2024</CardTitle>
                    <p className="text-2xl font-bold mt-1">
                      KES {(totalRevenue / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      +{revenueChange}% vs last year
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Daily</Button>
                    <Button variant="ghost" size="sm">Weekly</Button>
                    <Button variant="default" size="sm">Monthly</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Today's Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">Today's Bookings</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mb-4"
                />
                <div className="space-y-3">
                  {todaysBookings.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No bookings today
                    </p>
                  ) : (
                    todaysBookings.map((booking) => (
                      <div key={booking.id} className="flex gap-3 p-3 rounded-lg bg-secondary/50">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={booking.studio?.image} />
                          <AvatarFallback>
                            {booking.studio?.name?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {booking.studio?.name || "Unknown Studio"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(booking.start_time).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        <Badge 
                          variant={booking.status === "confirmed" ? "default" : "secondary"}
                          className="h-6"
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
