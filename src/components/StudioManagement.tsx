import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Building2, Image, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { studiosApi } from "@/lib/api";
import { StudioFormDialog } from "./StudioFormDialog";
import { RoomFormDialog } from "./RoomFormDialog";
import { AvailabilityScheduleDialog } from "./AvailabilityScheduleDialog";

interface Studio {
  id: string;
  name: string;
  location?: string;
  description?: string;
  timezone?: string;
  amenities?: string[];
  gallery?: any[];
  rooms?: any[];
  availability?: any[];
}

interface StudioManagementProps {
  studios: Studio[];
  onRefresh: () => void;
  showCreateStudio?: boolean;
  canManageStudios?: boolean;
}

export const StudioManagement = ({ 
  studios, 
  onRefresh, 
  showCreateStudio = true, 
  canManageStudios = true 
}: StudioManagementProps) => {
  const { toast } = useToast();
  
  // Studio dialogs
  const [editStudioDialogOpen, setEditStudioDialogOpen] = useState(false);
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);
  
  // Availability dialog
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [availabilityStudio, setAvailabilityStudio] = useState<Studio | null>(null);
  
  // Room dialogs
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editRoomDialogOpen, setEditRoomDialogOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  const handleDeleteStudio = async (studioId: string) => {
    if (!confirm("Are you sure you want to delete this studio? All rooms will be deleted too.")) return;
    try {
      await studiosApi.delete(studioId);

      toast({
        title: "Success",
        description: "Studio deleted successfully",
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete studio",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://tizii-backend.onrender.com'}/api/studios/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {studios.map((studio) => (
        <Card key={studio.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{studio.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{studio.location}</p>
                {studio.description && (
                  <p className="text-xs text-muted-foreground mt-1">{studio.description}</p>
                )}
                {studio.gallery && studio.gallery.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <Image className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{studio.gallery.length} photos</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {canManageStudios && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingStudio(studio);
                        setEditStudioDialogOpen(true);
                      }}
                      title="Edit Studio"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteStudio(studio.id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete Studio"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setAvailabilityStudio(studio);
                    setAvailabilityDialogOpen(true);
                  }}
                >
                  <Clock className="h-4 w-4" />
                  Hours
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => {
                    setSelectedStudio(studio);
                    setRoomDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Room
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {studio.rooms && studio.rooms.length > 0 ? (
              <div className="space-y-2">
                {studio.rooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{room.name}</p>
                        {room.photos && room.photos.length > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Image className="h-3 w-3" />
                            {room.photos.length}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{room.type}</p>
                      <p className="text-sm text-primary font-semibold">
                        KES {Number(room.hourly_rate).toLocaleString()}/hour
                        {room.overnight_rate && (
                          <span className="text-muted-foreground font-normal">
                            {" "}• KES {Number(room.overnight_rate).toLocaleString()}/night
                          </span>
                        )}
                      </p>
                      {room.equipment && room.equipment.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {room.equipment.slice(0, 3).join(", ")}
                          {room.equipment.length > 3 && ` +${room.equipment.length - 3} more`}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingRoom(room);
                          setSelectedStudio(studio);
                          setEditRoomDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No rooms yet. Click "Add Room" to create one.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Edit Studio Dialog */}
      <StudioFormDialog
        open={editStudioDialogOpen}
        onOpenChange={setEditStudioDialogOpen}
        studio={editingStudio}
        onSuccess={() => {
          setEditingStudio(null);
          onRefresh();
        }}
      />

      {/* Create Room Dialog */}
      {selectedStudio && (
        <RoomFormDialog
          open={roomDialogOpen}
          onOpenChange={setRoomDialogOpen}
          studioId={selectedStudio.id}
          studioName={selectedStudio.name}
          onSuccess={() => {
            setSelectedStudio(null);
            onRefresh();
          }}
        />
      )}

      {/* Edit Room Dialog */}
      {selectedStudio && editingRoom && (
        <RoomFormDialog
          open={editRoomDialogOpen}
          onOpenChange={setEditRoomDialogOpen}
          studioId={selectedStudio.id}
          studioName={selectedStudio.name}
          room={editingRoom}
          onSuccess={() => {
            setEditingRoom(null);
            setSelectedStudio(null);
            onRefresh();
          }}
        />
      )}

      {/* Availability Schedule Dialog */}
      {availabilityStudio && (
        <AvailabilityScheduleDialog
          open={availabilityDialogOpen}
          onOpenChange={setAvailabilityDialogOpen}
          studioId={availabilityStudio.id}
          studioName={availabilityStudio.name}
          existingAvailability={availabilityStudio.availability}
          onSuccess={() => {
            setAvailabilityStudio(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};
