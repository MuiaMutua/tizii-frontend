import { Heart, MapPin, Star, Wifi, ParkingCircle, Music, Snowflake } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface StudioCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  available: boolean;
  amenities: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  parking: ParkingCircle,
  instruments: Music,
  ac: Snowflake,
};

const StudioCard = ({ 
  id, 
  name, 
  location, 
  rating, 
  price, 
  image, 
  available, 
  amenities,
  isFavorite = false,
  onToggleFavorite
}: StudioCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group glass-card overflow-hidden hover:shadow-xl transition-all duration-300 border-0 animate-fade-in">
      <div className="relative h-[190px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40" />
        {available && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-0">
            Available Now
          </Badge>
        )}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-3 right-3 rounded-full glass",
            isFavorite && "text-red-500"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg leading-tight">{name}</h3>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium text-sm">{rating}</span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {amenities.slice(0, 4).map((amenity) => {
                const Icon = amenityIcons[amenity.toLowerCase()];
                return Icon ? (
                  <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon className="h-3 w-3" />
                    <span className="capitalize">{amenity}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          
          <Button 
            size="sm"
            className="neu-btn bg-primary hover:bg-primary/90 shrink-0"
            onClick={() => navigate(`/studio/${id}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StudioCard;
