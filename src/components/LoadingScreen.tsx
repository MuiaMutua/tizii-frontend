import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-glow blur-xl bg-primary/30 rounded-full" />
          <Logo size={120} className="relative animate-float" />
        </div>
        
        <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-float">
          Tizii
        </h1>
        
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-muted-foreground animate-pulse">Loading your studio experience...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
