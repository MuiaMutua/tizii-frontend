import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface FilterState {
  priceRange: [number, number];
  amenities: string[];
  rating: number;
  availableNow: boolean;
}

interface AdvancedFiltersProps {
  onApplyFilters: (filters: FilterState) => void;
}

const AdvancedFilters = ({ onApplyFilters }: AdvancedFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    amenities: [],
    rating: 0,
    availableNow: false,
  });

  const amenitiesList = ["WiFi", "Parking", "Instruments", "AC", "Kitchen", "Lounge"];

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      priceRange: [0, 10000] as [number, number],
      amenities: [],
      rating: 0,
      availableNow: false,
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="shrink-0 h-12 w-12 glass-card border-0">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range (KSh/hour)</Label>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{filters.priceRange[0]}</span>
              <span>{filters.priceRange[1]}</span>
            </div>
            <Slider
              min={0}
              max={10000}
              step={100}
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
            />
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <Label>Minimum Rating</Label>
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[filters.rating]}
              onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value[0] }))}
            />
            <div className="text-sm text-muted-foreground">{filters.rating} stars and above</div>
          </div>

          {/* Available Now */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={filters.availableNow}
              onCheckedChange={(checked) => 
                setFilters(prev => ({ ...prev, availableNow: checked as boolean }))
              }
            />
            <Label htmlFor="available" className="cursor-pointer">
              Available Now
            </Label>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="space-y-2">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <Label htmlFor={amenity} className="cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button onClick={handleApply} className="w-full">
              Apply Filters
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFilters;
