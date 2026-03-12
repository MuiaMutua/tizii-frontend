import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import BottomNav from "@/components/BottomNav";
import { Camera, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { usersApi } from "@/lib/api";

const Settings = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(user?.profile_img || "");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailUnique, setEmailUnique] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" });

  useEffect(() => {
    if (formData.password) {
      const strength = checkPasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: "" });
    }
  }, [formData.password]);

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = "";

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score === 0) feedback = "Too weak";
    else if (score <= 2) feedback = "Weak";
    else if (score === 3) feedback = "Fair";
    else if (score === 4) feedback = "Good";
    else feedback = "Strong";

    return { score, feedback };
  };

  const checkEmailUniqueness = async (email: string) => {
    if (email === user?.email) {
      setEmailUnique(true);
      return;
    }

    setEmailChecking(true);
    try {
      await usersApi.checkEmailUnique(email);
      setEmailUnique(true);
    } catch (error: any) {
      if (error.response?.status === 409) {
        setEmailUnique(false);
      }
    } finally {
      setEmailChecking(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "email") {
      const timeoutId = setTimeout(() => checkEmailUniqueness(value), 500);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsImageUploading(true);
    setProfileImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
      toast.success("Profile image ready to upload");
    };
    reader.readAsDataURL(file);
    setIsImageUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailUnique) {
      toast.error("Email is already taken");
      return;
    }

    if (formData.password && passwordStrength.score < 3) {
      toast.error("Please use a stronger password");
      return;
    }

    setIsLoading(true);

    try {
      const updateData = new FormData();
      updateData.append("full_name", formData.full_name);
      updateData.append("email", formData.email);
      updateData.append("phone", formData.phone);
      
      if (formData.password) {
        updateData.append("password", formData.password);
      }

      if (profileImageFile) {
        updateData.append("photo", profileImageFile);
      }

      const response = await usersApi.updateProfile(user?.id || "", updateData);
      
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setProfileImageFile(null);
      setFormData({ ...formData, password: "" });
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="glass-card border-b sticky top-0 z-30">
            <div className="px-4 py-4 flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Settings
              </h1>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 pb-32 max-w-4xl mx-auto w-full">
            <div className="space-y-6">
              {/* Profile Image Section */}
              <Card className="glass-card border-0 animate-fade-in">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile image</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        {profileImage ? (
                          <AvatarImage src={profileImage} alt={user?.full_name || "User"} />
                        ) : null}
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                          {user?.full_name ? getInitials(user.full_name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="profile-image-upload"
                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                      >
                        {isImageUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </label>
                      <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isImageUploading}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Click the camera icon to upload a new profile picture
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card className="glass-card border-0 animate-fade-in">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className={!emailUnique ? "border-destructive" : ""}
                        />
                        {emailChecking && (
                          <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        {!emailChecking && formData.email && formData.email !== user?.email && (
                          emailUnique ? (
                            <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="absolute right-3 top-3 h-4 w-4 text-destructive" />
                          )
                        )}
                      </div>
                      {!emailUnique && (
                        <p className="text-xs text-destructive">This email is already taken</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">New Password (optional)</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Leave blank to keep current password"
                      />
                      {formData.password && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${
                                  passwordStrength.score <= 1 ? "w-1/5 bg-destructive" :
                                  passwordStrength.score === 2 ? "w-2/5 bg-orange-500" :
                                  passwordStrength.score === 3 ? "w-3/5 bg-yellow-500" :
                                  passwordStrength.score === 4 ? "w-4/5 bg-lime-500" :
                                  "w-full bg-green-500"
                                }`}
                              />
                            </div>
                            <span className="text-xs font-medium">{passwordStrength.feedback}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Use 8+ characters with mix of letters, numbers & symbols
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Account Details (Read-only) */}
              <Card className="glass-card border-0 animate-fade-in">
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>View your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm text-muted-foreground">User ID</p>
                      <p className="font-medium text-xs">{user?.id || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">{user?.platform_role || user?.role || "Artist"}</p>
                    </div>
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

export default Settings;
