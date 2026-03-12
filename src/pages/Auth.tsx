import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Chrome, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async () => {
    // Input validation
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (isSignup && !fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide your full name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let userData;
      if (isSignup) {
        await signup(fullName, email, password, "artist");
        userData = JSON.parse(localStorage.getItem('user') || '{}');
        toast({
          title: "Welcome to Tizii!",
          description: "Your account has been created successfully",
        });
      } else {
        await login(email, password);
        userData = JSON.parse(localStorage.getItem('user') || '{}');
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully",
        });
      }
      
      // Redirect based on user role from backend
      switch (userData?.platform_role || userData?.role) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "studio_owner":
          navigate("/studio-owner/dashboard", { replace: true });
          break;
        case "studio_manager":
          navigate("/studio-manager/dashboard", { replace: true });
          break;
        case "studio_staff":
          navigate("/studio-staff/dashboard", { replace: true });
          break;
        case "artist":
        default:
          navigate("/artist/dashboard", { replace: true });
          break;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during authentication";
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const authMethods = [
    { icon: Phone, label: "Phone", variant: "outline" as const },
    { icon: Chrome, label: "Google", variant: "outline" as const },
    { icon: Apple, label: "Apple", variant: "outline" as const },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background pb-24">
      <Card className="w-full max-w-5xl glass-card border-0 overflow-hidden animate-scale-in">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Welcome */}
          <div className="p-12 flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center flex-1 space-y-8">
              {/* Logo */}
              <Logo size={200} className="animate-fade-in" />
              
              {/* Brand Name and Tagline */}
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold text-primary">Tizii</p>
                <p className="text-sm text-muted-foreground">Book. Create. Inspire.</p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="p-12 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">
                  {isSignup ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-muted-foreground">
                  {isSignup ? "Sign up to get started" : "Sign in to continue"}
                </p>
              </div>

              {!showEmailForm ? (
                <div className="space-y-4">
                  {/* Email Button - Primary */}
                  <Button
                    variant="default"
                    className="w-full h-12 gap-2 bg-primary hover:bg-primary/90"
                    onClick={() => setShowEmailForm(true)}
                  >
                    <Mail className="h-5 w-5" />
                    Continue with Email
                  </Button>

                  <div className="relative py-4">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
                      or continue with
                    </span>
                  </div>

                  {/* Other Auth Methods */}
                  <div className="grid grid-cols-3 gap-3">
                    {authMethods.map((method) => (
                      <Button
                        key={method.label}
                        variant={method.variant}
                        className="h-12 gap-2 glass-card border-0 hover:bg-secondary"
                      >
                        <method.icon className="h-5 w-5" />
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  {isSignup && (
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="glass-card border-0 h-12"
                    />
                  )}
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-card border-0 h-12"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-card border-0 h-12"
                  />
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 h-12"
                    onClick={handleAuth}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : isSignup ? "Sign Up" : "Log In"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowEmailForm(false)}
                  >
                    Back to options
                  </Button>
                </div>
              )}

              {/* Footer */}
              <p className="text-center text-sm text-muted-foreground pt-4">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button 
                  className="text-primary hover:underline font-medium"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Log in" : "Sign up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
