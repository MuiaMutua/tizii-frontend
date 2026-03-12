import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Wifi, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  id: string;
  studioId: string;
  name: string;
  description?: string;
  type?: string;
  hourlyRate: number;
  overnightRate?: number;
  equipment?: string[];
  photos?: { url: string; alt_text?: string }[];
}

const equipmentIcons: Record<string, any> = {
  microphone: Music,
  wifi: Wifi,
  ac: Wind,
};

const RoomCard = ({
  id,
  studioId,
  name,
  description,
  type,
  hourlyRate,
  overnightRate,
  equipment,
  photos,
}: RoomCardProps) => {
  const navigate = useNavigate();

  const roomImage = photos?.[0]?.url || "/placeholder.svg";

  return (
    <Card className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={roomImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        {type && (
          <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
            {type}
          </Badge>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description || "Professional recording space"}
          </p>
        </div>

        {equipment && equipment.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {equipment.slice(0, 3).map((item) => {
              const Icon = equipmentIcons[item.toLowerCase()] || Music;
              return (
                <Badge key={item} variant="outline" className="gap-1 text-xs">
                  <Icon className="h-3 w-3" />
                  {item}
                </Badge>
              );
            })}
            {equipment.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{equipment.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">
              KES {hourlyRate.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">per hour</p>
            {overnightRate && (
              <p className="text-xs text-muted-foreground mt-1">
                KES {overnightRate.toLocaleString()} overnight
              </p>
            )}
          </div>
          <Button
            className="neu-btn bg-primary hover:bg-primary/90"
            onClick={() => navigate(`/studio/${studioId}/room/${id}`)}
          >
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RoomCard;
