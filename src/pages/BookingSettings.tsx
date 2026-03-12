import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import BottomNav from "@/components/BottomNav";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const BookingSettings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm">
            <div className="px-4 py-4 flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Booking Settings
              </h1>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 pb-32 max-w-4xl mx-auto w-full">
            <div className="space-y-6">
              <Card className="glass-card border-0 animate-fade-in">
                <CardHeader>
                  <CardTitle>Booking Preferences</CardTitle>
                  <CardDescription>Manage your booking notifications and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="booking-reminders">Booking Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified before your scheduled sessions
                      </p>
                    </div>
                    <Switch id="booking-reminders" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cancellation-alerts">Cancellation Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when bookings are cancelled
                      </p>
                    </div>
                    <Switch id="cancellation-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="confirmation-emails">Confirmation Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Send booking confirmations to your email
                      </p>
                    </div>
                    <Switch id="confirmation-emails" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

        <BottomNav />
      </div>
    </SidebarProvider>
  );
};

export default BookingSettings;
