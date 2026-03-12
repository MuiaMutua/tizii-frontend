import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, MapPin, Star, Music, Building2, Sun, Moon } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type TimeMode = "day" | "night";

const RoomDetails = () => {
  const { studioId, roomId } = useParams();
  const navigate = useNavigate();

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string[]>>({});
  const [room, setRoom] = useState<any>(null);
  const [studio, setStudio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeMode, setTimeMode] = useState<TimeMode>("day");

  const daytimeSlots = [
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];
  const nighttimeSlots = [
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM",
    "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM"
  ];
  const timeSlots = timeMode === "day" ? daytimeSlots : nighttimeSlots;

  useEffect(() => {
    const fetchRoomAndStudio = async () => {
      try {
        console.log(`Fetching room ${roomId} from studio ${studioId}`);
        
        const [roomRes, studioRes] = await Promise.all([
          api.get(`/api/studios/rooms/${roomId}`),
          api.get(`/api/studios/${studioId}`)
        ]);

        console.log("Room response:", roomRes.data);
        console.log("Studio response:", studioRes.data);

        // Backend returns { room: {...} } and { studio: {...} }
        const roomData = roomRes.data.room || roomRes.data;
        const studioData = studioRes.data.studio || studioRes.data;

        setRoom(roomData);
        setStudio(studioData);
      } catch (error: any) {
        console.error("Error fetching room details:", error);
        
        if (!error.response) {
          toast.error("Cannot connect to server. The backend might be starting up (this can take 1-2 minutes). Please wait and try again.");
        } else if (error.response.status === 404) {
          toast.error("Room not found");
        } else {
          toast.error(error.response?.data?.message || "Failed to fetch room details");
        }
        
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };

    if (studioId && roomId) fetchRoomAndStudio();
  }, [studioId, roomId, navigate]);

  const toggleDate = (dates: Date[]) => {
    setSelectedDates(dates);
    const updatedTimes: Record<string, string[]> = {};
    dates.forEach((d) => {
      const key = d.toDateString();
      updatedTimes[key] = selectedTimes[key] || [];
    });
    setSelectedTimes(updatedTimes);
  };

  const toggleTime = (date: Date, time: string) => {
    const key = date.toDateString();
    const currentTimes = selectedTimes[key] || [];
    const updatedTimes = currentTimes.includes(time)
      ? currentTimes.filter((t) => t !== time)
      : [...currentTimes, time];
    setSelectedTimes((prev) => ({ ...prev, [key]: updatedTimes }));
  };

  const totalSlots = useMemo(
    () => Object.values(selectedTimes).reduce((acc, arr) => acc + arr.length, 0),
    [selectedTimes]
  );

  const handleBooking = () => {
    if (!selectedDates.length) {
      toast.error("Please select at least one date");
      return;
    }
    const hasTimes = selectedDates.some(
      (d) => (selectedTimes[d.toDateString()] || []).length > 0
    );
    if (!hasTimes) {
      toast.error("Please select at least one time slot");
      return;
    }

    navigate(`/checkout/${studioId}/room/${roomId}`, {
      state: { studio, room, selectedDates, selectedTimes },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading room details...</p>
        <p className="text-xs text-muted-foreground max-w-md text-center">
          If this takes longer than expected, the server might be starting up. Please wait a moment.
        </p>
      </div>
    );
  }

  if (!room || !studio) {
    return <div className="min-h-screen flex items-center justify-center">Room not found</div>;
  }

  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSlotDisabled = (date: Date, time: string) => {
    const today = new Date();
    if (date.toDateString() !== today.toDateString()) return false;
    const [t, period] = time.split(" ");
    let [hours, minutes] = t.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return (
      hours < today.getHours() ||
      (hours === today.getHours() && (minutes || 0) <= today.getMinutes())
    );
  };

  const roomImage = room.photos?.[0]?.url || "/placeholder.svg";
  const hourlyRate = Number(room.hourly_rate);
  const totalPrice = hourlyRate * totalSlots;

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-30 glass-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/studio/${studioId}`)}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {/* Room Hero */}
        <div className="glass-card border-0 rounded-3xl overflow-hidden animate-fade-in">
          <img
            src={roomImage}
            alt={room.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Room Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 px-2 hover:bg-secondary"
              onClick={() => navigate(`/studio/${studioId}`)}
            >
              <Building2 className="h-4 w-4" />
              {studio.name}
            </Button>
            <span>/</span>
            <span className="font-medium">{room.name}</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                {room.type && <Badge variant="outline">{room.type}</Badge>}
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{studio.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                KES {hourlyRate.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">per hour</p>
              {room.overnight_rate && (
                <p className="text-xs text-muted-foreground mt-1">
                  KES {Number(room.overnight_rate).toLocaleString()} overnight
                </p>
              )}
            </div>
          </div>

          <p className="text-muted-foreground">
            {room.description || "Professional recording space with top-tier equipment"}
          </p>

          {room.equipment?.length > 0 && (
            <div className="flex gap-2 flex-wrap pt-2">
              {room.equipment.map((item: string) => (
                <Badge key={item} variant="outline" className="px-3 py-1 gap-1">
                  <Music className="h-3 w-3" />
                  {item}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Booking Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card border-0 p-6">
            <h2 className="text-xl font-semibold mb-4">Select Date(s)</h2>
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={toggleDate}
              className="rounded-2xl border-0"
              disabled={disablePastDates}
            />
          </Card>

          <Card className={cn(
            "glass-card border-0 p-6 flex flex-col transition-all duration-500",
            timeMode === "night" && "bg-gradient-to-br from-slate-900/90 via-indigo-950/80 to-slate-900/90 dark:from-slate-950 dark:via-indigo-950/50 dark:to-slate-950"
          )}>
            <h2 className={cn(
              "text-xl font-semibold mb-4 transition-colors duration-300",
              timeMode === "night" && "text-indigo-100"
            )}>Available Time Slots</h2>

            <div className="flex gap-2 mb-4">
              <Button
                variant={timeMode === "day" ? "default" : "outline"}
                onClick={() => setTimeMode("day")}
                className={cn(
                  "gap-2 transition-all duration-300",
                  timeMode === "day" 
                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25" 
                    : timeMode === "night" ? "border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/20" : ""
                )}
              >
                <Sun className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Day</span>
              </Button>
              <Button
                variant={timeMode === "night" ? "default" : "outline"}
                onClick={() => setTimeMode("night")}
                className={cn(
                  "gap-2 transition-all duration-300",
                  timeMode === "night" 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25" 
                    : ""
                )}
              >
                <Moon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Night</span>
              </Button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[400px]">
              {selectedDates.length === 0 && (
                <p className={cn(
                  "text-muted-foreground transition-colors duration-300",
                  timeMode === "night" && "text-indigo-300/70"
                )}>Select a date to pick time slots</p>
              )}
              {selectedDates.map((date) => (
                <div key={date.toDateString()}>
                  <p className={cn(
                    "font-medium mb-2 transition-colors duration-300",
                    timeMode === "night" && "text-indigo-100"
                  )}>{date.toDateString()}</p>
                  <div className="grid grid-cols-3 md:grid-cols-2 gap-2 mb-4">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTimes[date.toDateString()]?.includes(time);
                      const disabled = isSlotDisabled(date, time);
                      return (
                        <Button
                          key={time}
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "transition-all duration-300",
                            isSelected 
                              ? timeMode === "night" 
                                ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20" 
                                : "neu-btn"
                              : timeMode === "night"
                                ? "border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/20 bg-indigo-950/50"
                                : "glass-card border-0"
                          )}
                          onClick={() => !disabled && toggleTime(date, time)}
                          disabled={disabled}
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Price and Booking Button */}
        <div className="glass-card border-0 rounded-3xl p-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Total Price</p>
            <p className="text-2xl font-bold">
              KES {totalPrice.toLocaleString()} ({totalSlots} slot
              {totalSlots !== 1 ? "s" : ""})
            </p>
          </div>
          <Button
            size="lg"
            className="neu-btn bg-primary hover:bg-primary/90"
            onClick={handleBooking}
            disabled={totalSlots === 0}
          >
            Book Session
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default RoomDetails;
