import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, MapPin, Home, FileText, Music } from "lucide-react";
import { format } from "date-fns";

interface ConfirmationState {
  studio?: any;
  room?: any;
  selectedDates?: Date[];
  selectedTimes?: Record<string, string[]>;
  totalAmount?: number;
  bookingId?: string;
}

const BookingConfirmed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ConfirmationState | undefined;

  const { studio, room, selectedDates, selectedTimes, totalAmount, bookingId } = state || {};

  if (!studio) {
    navigate("/home");
    return null;
  }

  // Parse dates if they came as strings
  const parsedDates = selectedDates?.map(d => new Date(d)) || [];

  // Get first room/studio image
  const imageUrl = room?.photos?.[0]?.url || studio?.gallery?.[0]?.url || "/placeholder.svg";

  // Generate booking reference
  const bookingRef = bookingId 
    ? `BK-${bookingId.slice(0, 8).toUpperCase()}`
    : `BK-${Date.now().toString().slice(-8)}`;

  // Calculate total slots
  const totalSlots = selectedTimes 
    ? Object.values(selectedTimes).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="glass-card border-0 p-8 max-w-md w-full space-y-6 animate-fade-in">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your studio session has been successfully booked
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          {/* Booking Reference */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Booking Reference</p>
              <p className="font-semibold font-mono">{bookingRef}</p>
            </div>
          </div>

          {/* Studio & Room Details */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
            <img
              src={imageUrl}
              alt={room?.name || studio?.name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
            />
            <div className="flex-1">
              <h3 className="font-semibold">{studio.name}</h3>
              {room && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Music className="h-3 w-3" />
                  {room.name}
                </p>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{studio.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time Details */}
          <div className="space-y-2">
            {parsedDates.map((date) => {
              const times = selectedTimes?.[date.toDateString()] || [];
              return (
                <div key={date.toDateString()} className="p-3 rounded-lg bg-secondary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pl-6">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{times.length > 0 ? times.join(", ") : "No times selected"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Amount */}
          {totalAmount && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="font-medium">Total Paid</span>
              <span className="font-bold text-lg text-primary">
                KES {totalAmount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Session Summary */}
          <div className="text-center text-sm text-muted-foreground py-2">
            {totalSlots} hour{totalSlots !== 1 ? "s" : ""} booked
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate("/bookings")}
          >
            View My Bookings
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate("/home")}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>A confirmation has been sent to your registered email.</p>
          <p className="mt-1">Please arrive 10 minutes before your session.</p>
        </div>
      </Card>
    </div>
  );
};

export default BookingConfirmed;
