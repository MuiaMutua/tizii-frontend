import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { studiosApi } from "@/lib/api";

interface StudioFormData {
  name: string;
  description: string;
  location: string;
  timezone: string;
  amenities: string[];
  payment_type: string;
  tizii_paybill: string;
  studio_paybill: string;
  till_number: string;
  payout_schedule: string;
}

interface StudioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studio?: any; // Existing studio for edit mode
  onSuccess: () => void;
  ownerId?: string;
}

const TIMEZONES = [
  "Africa/Nairobi",
  "Africa/Lagos",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
];

const PAYMENT_TYPES = [
  { value: "tizii_paybill", label: "Tizii Paybill" },
  { value: "studio_paybill", label: "Studio Paybill" },
  { value: "till_number", label: "Till Number" },
];

const PAYOUT_SCHEDULES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const COMMON_AMENITIES = [
  "WiFi",
  "Air Conditioning",
  "Parking",
  "Soundproofing",
  "Recording Equipment",
  "Mixing Console",
  "Microphones",
  "Headphones",
  "Monitors",
  "Lounge Area",
  "Kitchen",
  "Restroom",
];

export const StudioFormDialog = ({
  open,
  onOpenChange,
  studio,
  onSuccess,
  ownerId,
}: StudioFormDialogProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");

  const [formData, setFormData] = useState<StudioFormData>({
    name: studio?.name || "",
    description: studio?.description || "",
    location: studio?.location || "",
    timezone: studio?.timezone || "Africa/Nairobi",
    amenities: studio?.amenities || [],
    payment_type: studio?.payment_type || "tizii_paybill",
    tizii_paybill: studio?.tizii_paybill || "",
    studio_paybill: studio?.studio_paybill || "",
    till_number: studio?.till_number || "",
    payout_schedule: studio?.payout_schedule || "monthly",
  });

  const isEditMode = !!studio;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = Array.from(files);
    setSelectedPhotos((prev) => [...prev, ...newPhotos]);

    // Create preview URLs
    newPhotos.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
    }
    setNewAmenity("");
  };

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Studio name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      if (formData.description) {
        submitData.append("description", formData.description);
      }
      if (formData.location) {
        submitData.append("location", formData.location);
      }
      submitData.append("timezone", formData.timezone);
      
      // Send amenities as JSON array string (backend parses this)
      if (formData.amenities.length > 0) {
        submitData.append("amenities", JSON.stringify(formData.amenities));
      }
      
      submitData.append("payment_type", formData.payment_type);
      if (formData.tizii_paybill) {
        submitData.append("tizii_paybill", formData.tizii_paybill);
      }
      if (formData.studio_paybill) {
        submitData.append("studio_paybill", formData.studio_paybill);
      }
      if (formData.till_number) {
        submitData.append("till_number", formData.till_number);
      }
      submitData.append("payout_schedule", formData.payout_schedule);

      if (ownerId) {
        submitData.append("owner_id", ownerId);
      }

      // Add photos
      selectedPhotos.forEach((photo) => {
        submitData.append("photos", photo);
      });

      console.log("Creating studio with FormData, name:", formData.name, "owner_id:", ownerId);
      if (isEditMode) {
        await studiosApi.update(studio.id, submitData);
        toast({
          title: "Success",
          description: "Studio updated successfully",
        });
      } else {
        await studiosApi.create(submitData);
        toast({
          title: "Success",
          description: "Studio created successfully",
        });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Studio creation error:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${isEditMode ? "update" : "create"} studio`;
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      timezone: "Africa/Nairobi",
      amenities: [],
      payment_type: "tizii_paybill",
      tizii_paybill: "",
      studio_paybill: "",
      till_number: "",
      payout_schedule: "monthly",
    });
    setSelectedPhotos([]);
    setPhotoPreview([]);
    setNewAmenity("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Studio" : "Create New Studio"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Basic Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Studio Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter studio name"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your studio..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Nairobi, Kenya"
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Photos
              </h3>

              <div className="flex flex-wrap gap-3">
                {photoPreview.map((preview, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
                >
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Photo</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>

              {studio?.gallery && studio.gallery.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Existing photos:</p>
                  <div className="flex flex-wrap gap-2">
                    {studio.gallery.map((photo: any, index: number) => (
                      <div key={photo.id || index} className="w-16 h-16 rounded-lg overflow-hidden border">
                        <img src={photo.url} alt={photo.alt_text || `Photo ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Amenities
              </h3>

              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="gap-1">
                    {amenity}
                    <button type="button" onClick={() => removeAmenity(amenity)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add custom amenity..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAmenity(newAmenity);
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => addAmenity(newAmenity)}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {COMMON_AMENITIES.filter((a) => !formData.amenities.includes(a)).map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => addAmenity(amenity)}
                  >
                    + {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Payment Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Payment Settings
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="payment_type">Payment Type</Label>
                  <Select
                    value={formData.payment_type}
                    onValueChange={(value) => setFormData({ ...formData, payment_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payout_schedule">Payout Schedule</Label>
                  <Select
                    value={formData.payout_schedule}
                    onValueChange={(value) => setFormData({ ...formData, payout_schedule: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYOUT_SCHEDULES.map((schedule) => (
                        <SelectItem key={schedule.value} value={schedule.value}>
                          {schedule.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.payment_type === "tizii_paybill" && (
                  <div className="sm:col-span-2">
                    <Label htmlFor="tizii_paybill">Tizii Paybill Number</Label>
                    <Input
                      id="tizii_paybill"
                      value={formData.tizii_paybill}
                      onChange={(e) => setFormData({ ...formData, tizii_paybill: e.target.value })}
                      placeholder="Enter Tizii paybill number"
                    />
                  </div>
                )}

                {formData.payment_type === "studio_paybill" && (
                  <div className="sm:col-span-2">
                    <Label htmlFor="studio_paybill">Studio Paybill Number</Label>
                    <Input
                      id="studio_paybill"
                      value={formData.studio_paybill}
                      onChange={(e) => setFormData({ ...formData, studio_paybill: e.target.value })}
                      placeholder="Enter studio paybill number"
                    />
                  </div>
                )}

                {formData.payment_type === "till_number" && (
                  <div className="sm:col-span-2">
                    <Label htmlFor="till_number">Till Number</Label>
                    <Input
                      id="till_number"
                      value={formData.till_number}
                      onChange={(e) => setFormData({ ...formData, till_number: e.target.value })}
                      placeholder="Enter till number"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditMode ? "Update Studio" : "Create Studio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
