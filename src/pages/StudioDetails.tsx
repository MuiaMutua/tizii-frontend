import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Wifi, Car, Music, Wind, Building2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { studiosApi } from "@/lib/api";
import RoomCard from "@/components/RoomCard";

const StudioDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [studio, setStudio] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudioAndRooms = async () => {
      try {
        const [studioRes, roomsRes] = await Promise.all([
          studiosApi.getById(id!),
          studiosApi.getRooms(id!)
        ]);
        
        // Backend returns { studio: {...} } and { rooms: [...] }
        const studioData = studioRes.data.studio || studioRes.data;
        const roomsData = roomsRes.data.rooms || (Array.isArray(roomsRes.data) ? roomsRes.data : []);
        
        const studioPhoto = studioData.gallery?.[0]?.url;
        
        setStudio({
          ...studioData,
          image_url: studioPhoto || studioData.image_url,
        });
        
        setRooms(roomsData);
        
        if (studioPhoto) {
          localStorage.setItem(`studio_image_${id}`, studioPhoto);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch studio details");
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchStudioAndRooms();
  }, [id, navigate]);

  const amenityIcons = { wifi: Wifi, parking: Car, instruments: Music, ac: Wind };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!studio) {
    return <div className="min-h-screen flex items-center justify-center">Studio not found</div>;
  }

  const studioImage = studio.image_url || localStorage.getItem(`studio_image_${studio.id}`) || "/placeholder.svg";

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-30 glass-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* Studio Hero */}
        <div className="glass-card border-0 rounded-3xl overflow-hidden animate-fade-in">
          <img 
            src={studioImage} 
            alt={studio.name} 
            className="w-full h-80 object-cover"
            onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
          />
        </div>

        {/* Studio Info */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{studio.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-medium">{studio.rating || "4.8"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>{studio.location}</span>
                </div>
              </div>
            </div>
            <Badge className="flex items-center gap-2 px-4 py-2 text-base">
              <Building2 className="h-4 w-4" />
              {rooms.length} Room{rooms.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {studio.description || "Professional recording studio with state-of-the-art equipment"}
          </p>

          {studio.amenities?.length > 0 && (
            <div className="flex gap-2 flex-wrap pt-2">
              {studio.amenities.map((amenity: string) => {
                const Icon = amenityIcons[amenity.toLowerCase() as keyof typeof amenityIcons];
                return (
                  <Badge key={amenity} variant="outline" className="px-4 py-2 gap-2 text-sm">
                    {Icon && <Icon className="h-4 w-4" />}
                    {amenity}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Rooms Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Available Rooms</h2>
            <p className="text-muted-foreground">Select a room to book</p>
          </div>

          {rooms.length === 0 ? (
            <div className="glass-card border-0 rounded-3xl p-12 text-center">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Rooms Available</h3>
              <p className="text-muted-foreground">
                This studio hasn't added any rooms yet. Check back later!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room: any) => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  studioId={studio.id}
                  name={room.name}
                  description={room.description}
                  type={room.type}
                  hourlyRate={Number(room.hourly_rate)}
                  overnightRate={room.overnight_rate ? Number(room.overnight_rate) : undefined}
                  equipment={room.equipment || []}
                  photos={room.photos || []}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default StudioDetails;
