import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import StudioCard from "@/components/StudioCard";
import ThemeToggle from "@/components/ThemeToggle";
import BottomNav from "@/components/BottomNav";
import ChatBot from "@/components/ChatBot";
import WelcomeDialog from "@/components/WelcomeDialog";
import AdvancedFilters from "@/components/AdvancedFilters";
import MapView from "@/components/MapView";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Map, Grid3x3 } from "lucide-react";
import { studiosApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Autoplay from "embla-carousel-autoplay";
import heroAbstractBg from "@/assets/hero-abstract-bg.jpg";
import heroAbstract2 from "@/assets/hero-abstract-2.jpg";
import heroAbstract4 from "@/assets/hero-abstract-4.jpg";
import { Logo } from "@/components/Logo";

const Home = () => {
  const [studios, setStudios] = useState<any[]>([]);
  const [filteredStudios, setFilteredStudios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const heroImages = [heroAbstractBg, heroAbstract2, heroAbstract4];

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await studiosApi.getAll();
        
        // Handle different possible response structures
        let studiosData: any[] = [];
        
        if (Array.isArray(response.data)) {
          studiosData = response.data;
        } else if (response.data?.studios && Array.isArray(response.data.studios)) {
          studiosData = response.data.studios;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          studiosData = response.data.data;
        }
        
        // Fetch rooms for each studio to get complete data
        const studiosWithDetails = await Promise.all(
          studiosData.map(async (studio) => {
            try {
              const roomsRes = await studiosApi.getRooms(studio.id);
              const rooms = roomsRes.data || [];
              
              // Get first photo from gallery (studio_photos) or first room photo
              const studioPhoto = studio.gallery?.[0]?.url;
              const firstRoomPhoto = rooms[0]?.photos?.[0]?.url;
              
              return {
                ...studio,
                rooms,
                image_url: studioPhoto || firstRoomPhoto || null,
              };
            } catch {
              return { ...studio, rooms: [] };
            }
          })
        );
        
        setStudios(studiosWithDetails);
        setFilteredStudios(studiosWithDetails);
      } catch (error: any) {
        console.error("Failed to fetch studios:", error);
        const isTimeout = error.code === 'ECONNABORTED';
        toast({
          title: isTimeout ? "Server Starting Up" : "Connection Error",
          description: isTimeout 
            ? "Backend is waking up (Render cold start). Please wait a moment and refresh." 
            : "Unable to connect to backend. Please try again later.",
          variant: "destructive",
        });
        setStudios([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudios();
  }, [toast]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('tizii-visited');
    if (!hasVisited) {
      setTimeout(() => setShowWelcome(true), 1000);
      localStorage.setItem('tizii-visited', 'true');
    }
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    let filtered = [...studios];

    switch (filter) {
      case 'available':
        filtered = studios.filter(s => s.available !== false);
        break;
      case 'top-rated':
        filtered = studios.filter(s => (s.rating || 0) >= 4.5);
        break;
      case 'favorites':
        filtered = studios.filter(s => favorites.has(s.id));
        break;
      default:
        filtered = studios;
    }

    setFilteredStudios(filtered);
  };

  const handleAdvancedFilters = (filters: any) => {
    let filtered = [...studios];

    if (filters.availableNow) {
      filtered = filtered.filter(s => s.available !== false);
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(s => (s.rating || 0) >= filters.rating);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(s => 
        s.price_per_hour >= filters.priceRange[0] && 
        s.price_per_hour <= filters.priceRange[1]
      );
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(s => 
        filters.amenities.some((amenity: string) => 
          s.amenities?.some((a: string) => 
            a.toLowerCase() === amenity.toLowerCase()
          )
        )
      );
    }

    setFilteredStudios(filtered);
    toast({
      title: "Filters Applied",
      description: `Showing ${filtered.length} studio${filtered.length !== 1 ? 's' : ''}`,
    });
  };

  const toggleFavorite = (studioId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(studioId)) {
        newFavorites.delete(studioId);
      } else {
        newFavorites.add(studioId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Transparent Header Overlay */}
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent drop-shadow-md">
              Tizii
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Carousel Section */}
      <section className="relative h-[350px] md:h-[450px] overflow-hidden">
        <Carousel
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full h-full"
        >
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[350px] md:h-[450px]">
                  <img
                    src={image}
                    alt={`Studio showcase ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent flex items-end">
                    <div className="container mx-auto px-4 pb-8">
                      <h2 className="text-3xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
                        Find Your Sound
                      </h2>
                      <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
                        Premium studios at your fingertips
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Location & Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-1">Karibu Msanii</h2>
              <p className="text-muted-foreground">Discover amazing studios near you</p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <SearchBar />
            <AdvancedFilters onApplyFilters={handleAdvancedFilters} />
            <Button
              size="icon"
              variant={viewMode === 'map' ? 'default' : 'outline'}
              className="shrink-0 h-12 w-12 glass-card border-0"
              onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
            >
              {viewMode === 'grid' ? <Map className="h-5 w-5" /> : <Grid3x3 className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <Badge 
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 whitespace-nowrap hover:bg-secondary"
            onClick={() => handleFilterChange('all')}
          >
            All Studios
          </Badge>
          <Badge 
            variant={activeFilter === 'available' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 whitespace-nowrap hover:bg-secondary"
            onClick={() => handleFilterChange('available')}
          >
            Available Now
          </Badge>
          <Badge 
            variant={activeFilter === 'top-rated' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 whitespace-nowrap hover:bg-secondary"
            onClick={() => handleFilterChange('top-rated')}
          >
            Top Rated
          </Badge>
          <Badge 
            variant={activeFilter === 'favorites' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 whitespace-nowrap hover:bg-secondary"
            onClick={() => handleFilterChange('favorites')}
          >
            Favorites ({favorites.size})
          </Badge>
        </div>

        {/* Studios Grid or Map View */}
        {viewMode === 'map' ? (
          <MapView studios={filteredStudios} />
        ) : (
          <div className={`grid gap-6 ${
            !Array.isArray(filteredStudios) || filteredStudios.length === 0 
              ? 'grid-cols-1' 
              : filteredStudios.length === 1 
              ? 'grid-cols-1' 
              : filteredStudios.length === 2 
              ? 'grid-cols-1 lg:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading studios...</p>
                <p className="text-sm text-muted-foreground mt-2">This may take a moment if the server is starting up</p>
              </div>
            ) : !Array.isArray(filteredStudios) || filteredStudios.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === 'favorites' 
                    ? "No favorite studios yet. Click the heart icon on studios to add them to your favorites!"
                    : "No studios match your filters"}
                </p>
                {activeFilter !== 'all' && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => handleFilterChange('all')}
                  >
                    Show All Studios
                  </Button>
                )}
              </div>
            ) : (
              filteredStudios.map((studio) => (
                <StudioCard 
                  key={studio.id} 
                  id={studio.id}
                  name={studio.name}
                  location={studio.location}
                  rating={studio.rating || 4.5}
                  price={studio.price_per_hour}
                  image={studio.image_url}
                  available={studio.available !== false}
                  amenities={studio.amenities || []}
                  isFavorite={favorites.has(studio.id)}
                  onToggleFavorite={() => toggleFavorite(studio.id)}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* ChatBot */}
      <ChatBot />

      {/* Welcome Dialog */}
      <WelcomeDialog open={showWelcome} onOpenChange={setShowWelcome} />
    </div>
  );
};

export default Home;
