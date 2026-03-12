import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RoomFormData {
  name: string;
  description: string;
  type: string;
  hourly_rate: string;
  overnight_rate: string;
  visible: boolean;
  equipment: string[];
}

interface RoomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioId: string;
  studioName: string;
  room?: any; // Existing room for edit mode
  onSuccess: () => void;
}

const ROOM_TYPES = [
  "recording",
  "rehearsal",
  "production",
  "mixing",
  "mastering",
  "vocal booth",
  "live room",
  "control room",
];

const COMMON_EQUIPMENT = [
  "Microphone",
  "Mixer",
  "Headphones",
  "Studio Monitors",
  "Audio Interface",
  "MIDI Keyboard",
  "Preamp",
  "Compressor",
  "Equalizer",
  "Vocal Booth",
  "Drum Kit",
  "Guitar Amp",
  "Bass Amp",
  "PA System",
  "Lighting",
];

export const RoomFormDialog = ({
  open,
  onOpenChange,
  studioId,
  studioName,
  room,
  onSuccess,
}: RoomFormDialogProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState("");

  const [formData, setFormData] = useState<RoomFormData>({
    name: "",
    description: "",
    type: "recording",
    hourly_rate: "",
    overnight_rate: "",
    visible: true,
    equipment: [],
  });

  const isEditMode = !!room;

  // Update form when room changes
  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || "",
        description: room.description || "",
        type: room.type || "recording",
        hourly_rate: room.hourly_rate?.toString() || "",
        overnight_rate: room.overnight_rate?.toString() || "",
        visible: room.visible !== false,
        equipment: Array.isArray(room.equipment) ? room.equipment : [],
      });
    } else {
      resetForm();
    }
  }, [room]);

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

  const addEquipment = (item: string) => {
    if (item && !formData.equipment.includes(item)) {
      setFormData((prev) => ({
        ...prev,
        equipment: [...prev.equipment, item],
      }));
    }
    setNewEquipment("");
  };

  const removeEquipment = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((e) => e !== item),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Room name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.hourly_rate || parseFloat(formData.hourly_rate) <= 0) {
      toast({
        title: "Error",
        description: "Valid hourly rate is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tizii-backend.onrender.com';
      const token = localStorage.getItem('token');

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("type", formData.type);
      submitData.append("hourly_rate", formData.hourly_rate);
      if (formData.overnight_rate) {
        submitData.append("overnight_rate", formData.overnight_rate);
      }
      submitData.append("visible", String(formData.visible));
      submitData.append("equipment", JSON.stringify(formData.equipment));

      // Add photos
      selectedPhotos.forEach((photo) => {
        submitData.append("photos", photo);
      });

      const url = isEditMode
        ? `${API_BASE_URL}/api/studios/rooms/${room.id}`
        : `${API_BASE_URL}/api/studios/${studioId}/rooms`;

      const response = await fetch(url, {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditMode ? "update" : "create"} room`);
      }

      toast({
        title: "Success",
        description: `Room ${isEditMode ? "updated" : "created"} successfully`,
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditMode ? "update" : "create"} room`,
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
      type: "recording",
      hourly_rate: "",
      overnight_rate: "",
      visible: true,
      equipment: [],
    });
    setSelectedPhotos([]);
    setPhotoPreview([]);
    setNewEquipment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Room" : `Create Room for ${studioName}`}
          </DialogTitle>
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
                  <Label htmlFor="room-name">Room Name *</Label>
                  <Input
                    id="room-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter room name"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="room-description">Description</Label>
                  <Textarea
                    id="room-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the room..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="room-type">Room Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="visible">Visible</Label>
                    <p className="text-xs text-muted-foreground">Show in listings</p>
                  </div>
                  <Switch
                    id="visible"
                    checked={formData.visible}
                    onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Pricing
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="hourly-rate">Hourly Rate (KES) *</Label>
                  <Input
                    id="hourly-rate"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                    placeholder="e.g., 2000"
                  />
                </div>

                <div>
                  <Label htmlFor="overnight-rate">Overnight Rate (KES)</Label>
                  <Input
                    id="overnight-rate"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.overnight_rate}
                    onChange={(e) => setFormData({ ...formData, overnight_rate: e.target.value })}
                    placeholder="e.g., 10000 (optional)"
                  />
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

              {room?.photos && room.photos.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Existing photos:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.photos.map((photo: any, index: number) => (
                      <div key={photo.id || index} className="w-16 h-16 rounded-lg overflow-hidden border">
                        <img src={photo.url} alt={photo.alt_text || `Photo ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Equipment */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Equipment
              </h3>

              <div className="flex flex-wrap gap-2">
                {formData.equipment.map((item) => (
                  <Badge key={item} variant="secondary" className="gap-1">
                    {item}
                    <button type="button" onClick={() => removeEquipment(item)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  placeholder="Add custom equipment..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEquipment(newEquipment);
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => addEquipment(newEquipment)}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {COMMON_EQUIPMENT.filter((e) => !formData.equipment.includes(e)).map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => addEquipment(item)}
                  >
                    + {item}
                  </Badge>
                ))}
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
            {isEditMode ? "Update Room" : "Create Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
