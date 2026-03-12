import { Card } from "@/components/ui/card";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Alerts = () => {
  // TODO: Fetch alerts from backend API
  const alerts: any[] = [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm">
            <div className="px-4 py-4 flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Alerts
              </h1>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 pb-32 max-w-4xl mx-auto w-full">
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <Card className="glass-card border-0 p-12 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-lg">No alerts yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    You'll see notifications about your bookings here
                  </p>
                </Card>
              ) : (
                alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`glass-card border-0 p-4 animate-fade-in ${
                !alert.read ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    alert.type === "success"
                      ? "bg-primary/10 text-primary"
                      : alert.type === "warning"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
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

export default Alerts;
