import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useNavigate } from "react-router-dom";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WelcomeDialog = ({ open, onOpenChange }: WelcomeDialogProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass border-0 shadow-2xl backdrop-blur-xl bg-background/80">
        <DialogHeader className="space-y-6 pt-2">
          <div className="flex justify-center animate-fade-in">
            <div className="p-4 rounded-full glass">
              <Logo size={100} />
            </div>
          </div>
          <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Welcome to Tizii
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-medium">
            Book. Create. Inspire.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-6">
          <p className="text-center text-muted-foreground text-base leading-relaxed px-4">
            Join thousands of artists discovering and booking premium recording studios across Kenya.
          </p>
          <div className="space-y-3 px-2">
            <Button 
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all" 
              onClick={() => {
                onOpenChange(false);
                navigate('/auth');
              }}
            >
              Sign Up Now
            </Button>
            <Button 
              variant="ghost" 
              className="w-full h-12 text-base glass hover:glass-card"
              onClick={() => onOpenChange(false)}
            >
              Continue Browsing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
