import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface MapViewProps {
  studios: any[];
}

const MapView = ({ studios }: MapViewProps) => {
  return (
    <Card className="glass-card border-0 p-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h3 className="text-2xl font-bold">Map View</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Interactive map view coming soon! Explore {studios.length} studios on a map to find the perfect location near you.
        </p>
        <div className="text-sm text-muted-foreground">
          Will show studio locations, distances, and nearby amenities
        </div>
      </div>
    </Card>
  );
};

export default MapView;
