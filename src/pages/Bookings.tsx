import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { bookingsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import heroStudio from "@/assets/hero-studio.jpg";

const Bookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsApi.getAll();
        const bookingsData = Array.isArray(response.data) ? response.data : [];
        setBookings(bookingsData);
      } catch (error: any) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch bookings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm">
            <div className="px-4 py-4 flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                My Bookings
              </h1>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 pb-32 max-w-4xl mx-auto w-full">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading bookings...</p>
                </div>
              ) : !Array.isArray(bookings) || bookings.length === 0 ? (
                <Card className="glass-card border-0 p-12 text-center">
                  <p className="text-muted-foreground text-lg">No bookings yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Book your first studio session to get started
                  </p>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="glass-card border-0 p-4 flex gap-4 animate-fade-in hover:shadow-lg transition-all"
                  >
                    <img
                      src={booking.studio?.image_url || heroStudio}
                      alt={booking.studio?.name || "Studio"}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg">{booking.studio?.name || "Studio"}</h3>
                        <Badge
                          variant={booking.status === "confirmed" ? "default" : "secondary"}
                          className={
                            booking.status === "confirmed"
                              ? "bg-primary"
                              : "bg-secondary"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(booking.start_time), "EEEE, MMMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(booking.start_time), "h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.studio?.location || "Location"}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </main>
        </div>

        <BottomNav />
      </div>
    </SidebarProvider>
  );
};

export default Bookings;
