import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse blur-3xl bg-primary/20 rounded-full" />
          <h1 className="relative text-9xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            404
          </h1>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/home">
              <Search className="h-5 w-5" />
              Browse Studios
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
