import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import BottomNav from "@/components/BottomNav";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AlertSettings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm">
            <div className="px-4 py-4 flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Alert Settings
              </h1>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 pb-32 max-w-4xl mx-auto w-full">
            <div className="space-y-6">
              <Card className="glass-card border-0 animate-fade-in">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Customize which alerts you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get alerts sent to your email address
                      </p>
                    </div>
                    <Switch id="email-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-alerts">SMS Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important alerts via SMS
                      </p>
                    </div>
                    <Switch id="sms-alerts" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-updates">Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive news about new features and offers
                      </p>
                    </div>
                    <Switch id="marketing-updates" />
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

export default AlertSettings;
