import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookingsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Music, 
  Clock, 
  DollarSign,
  TrendingUp,
  Home,
  Search,
  Bell,
  User,
  Settings,
  Menu,
  Star,
  Building2
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const ArtistDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "artist") {
      navigate("/home");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await bookingsApi.getAll();
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error("Failed to fetch artist bookings:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch bookings",
        variant: "destructive",
      });
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
          Artist Studio
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
          variant={activeTab === "browse" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => navigate("/home")}
        >
          <Building2 className="h-5 w-5" />
          Browse Studios
        </Button>
        <Button 
          variant={activeTab === "bookings" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => navigate("/bookings")}
        >
          <Music className="h-5 w-5" />
          My Bookings
        </Button>
        <Button 
          variant={activeTab === "favorites" ? "default" : "ghost"} 
          className="w-full justify-start gap-3"
          onClick={() => setActiveTab("favorites")}
        >
          <Star className="h-5 w-5" />
          Favorites
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
          <Music className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(
    b => b.status === "confirmed" && new Date(b.start_time) > new Date()
  );
  const totalSpent = bookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const totalHours = bookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => {
      const start = new Date(b.start_time);
      const end = new Date(b.end_time);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

  // Mock activity data
  const activityData = Array.from({ length: 6 }, (_, i) => ({
    month: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][i],
    hours: Math.floor(Math.random() * 20) + 10,
  }));

  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-card border-r flex-col z-40">
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
              <div>
                <h2 className="text-xl lg:text-2xl font-bold">Welcome, {user?.full_name?.split(' ')[0] || "Artist"}!</h2>
                <p className="text-xs lg:text-sm text-muted-foreground">Track your studio sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Bookings
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{bookings.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {upcomingBookings.length} upcoming
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Practice Hours
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.round(totalHours)}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12%</span> this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Spent
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  KES {(totalSpent / 1000).toFixed(1)}k
                </div>
              </CardContent>
            </Card>
          </div>

          {bookings.length === 0 ? (
            <Card className="p-12 text-center">
              <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your musical journey by booking your first studio session
              </p>
              <Button onClick={() => navigate("/home")}>
                Browse Studios
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
              {/* Activity Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Rehearsal Activity</CardTitle>
                  <p className="text-sm text-muted-foreground">Your practice hours over time</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
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
                        dataKey="hours" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fill="url(#colorHours)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium">Upcoming Sessions</CardTitle>
                  <Badge variant="secondary">{upcomingBookings.length}</Badge>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border mb-4"
                  />
                  <div className="space-y-3">
                    {upcomingBookings.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No upcoming sessions
                      </p>
                    ) : (
                      upcomingBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="p-3 rounded-lg bg-secondary/50">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-sm">
                              {booking.studio?.name || "Unknown Studio"}
                            </h4>
                            <Badge variant="default" className="text-xs">
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(booking.start_time).toLocaleDateString()} at{" "}
                            {new Date(booking.start_time).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ArtistDashboard;
