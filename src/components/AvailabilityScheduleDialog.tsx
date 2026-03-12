import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Clock, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface AvailabilityScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioId: string;
  studioName: string;
  existingAvailability?: any[];
  onSuccess: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour.toString().padStart(2, "0");
      const m = minute.toString().padStart(2, "0");
      times.push(`${h}:${m}`);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

const formatTime12Hour = (time24: string) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const DEFAULT_SCHEDULE: Record<number, DaySchedule> = {
  0: { isOpen: false, openTime: "09:00", closeTime: "17:00" }, // Sunday closed by default
  1: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
  2: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
  3: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
  4: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
  5: { isOpen: true, openTime: "09:00", closeTime: "21:00" },
  6: { isOpen: true, openTime: "10:00", closeTime: "18:00" }, // Saturday shorter hours
};

export const AvailabilityScheduleDialog = ({
  open,
  onOpenChange,
  studioId,
  studioName,
  existingAvailability,
  onSuccess,
}: AvailabilityScheduleDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schedule, setSchedule] = useState<Record<number, DaySchedule>>(DEFAULT_SCHEDULE);

  // Initialize from existing availability
  useEffect(() => {
    if (existingAvailability && existingAvailability.length > 0) {
      const newSchedule = { ...DEFAULT_SCHEDULE };
      
      // Mark all days as closed first if we have existing data
      DAYS_OF_WEEK.forEach(day => {
        newSchedule[day.value] = { ...DEFAULT_SCHEDULE[day.value], isOpen: false };
      });

      // Then set the days that have availability
      existingAvailability.forEach((avail: any) => {
        newSchedule[avail.day_of_week] = {
          isOpen: true,
          openTime: avail.open_time,
          closeTime: avail.close_time,
        };
      });

      setSchedule(newSchedule);
    } else {
      setSchedule(DEFAULT_SCHEDULE);
    }
  }, [existingAvailability, open]);

  const updateDay = (dayOfWeek: number, updates: Partial<DaySchedule>) => {
    setSchedule(prev => ({
      ...prev,
      [dayOfWeek]: { ...prev[dayOfWeek], ...updates },
    }));
  };

  const copyToAllDays = (sourceDayOfWeek: number) => {
    const sourceSchedule = schedule[sourceDayOfWeek];
    const newSchedule = { ...schedule };
    
    DAYS_OF_WEEK.forEach(day => {
      if (day.value !== sourceDayOfWeek) {
        newSchedule[day.value] = { ...sourceSchedule };
      }
    });

    setSchedule(newSchedule);
    toast({
      title: "Copied",
      description: `${DAYS_OF_WEEK[sourceDayOfWeek].label}'s schedule copied to all days`,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tizii-backend.onrender.com';
      const token = localStorage.getItem('token');

      // First, we need to delete existing availability (if API supports it)
      // For now, we'll just create new entries - backend should handle upsert or replacement

      const availabilityEntries = DAYS_OF_WEEK
        .filter(day => schedule[day.value].isOpen)
        .map(day => ({
          day_of_week: day.value,
          open_time: schedule[day.value].openTime,
          close_time: schedule[day.value].closeTime,
        }));

      // Submit each day's availability
      const results = await Promise.allSettled(
        availabilityEntries.map(entry =>
          fetch(`${API_BASE_URL}/api/studios/${studioId}/availability`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(entry),
          })
        )
      );

      const failures = results.filter(r => r.status === "rejected");
      
      if (failures.length > 0) {
        toast({
          title: "Warning",
          description: `${availabilityEntries.length - failures.length} of ${availabilityEntries.length} schedules saved`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Studio availability schedule saved successfully",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save availability schedule",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Availability Schedule
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{studioName}</p>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] pr-4">
          <div className="space-y-4 py-2">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day.value}
                className={`p-4 rounded-lg border transition-colors ${
                  schedule[day.value].isOpen ? "bg-card" : "bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={schedule[day.value].isOpen}
                      onCheckedChange={(checked) => updateDay(day.value, { isOpen: checked })}
                    />
                    <Label className="font-medium">{day.label}</Label>
                  </div>
                  
                  {schedule[day.value].isOpen && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToAllDays(day.value)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy to all
                    </Button>
                  )}
                </div>

                {schedule[day.value].isOpen ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Opens</Label>
                      <Select
                        value={schedule[day.value].openTime}
                        onValueChange={(value) => updateDay(day.value, { openTime: value })}
                      >
                        <SelectTrigger className="mt-1 bg-background">
                          <SelectValue>
                            {formatTime12Hour(schedule[day.value].openTime)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] bg-popover z-50">
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={`open-${day.value}-${time}`} value={time}>
                              {formatTime12Hour(time)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Closes</Label>
                      <Select
                        value={schedule[day.value].closeTime}
                        onValueChange={(value) => updateDay(day.value, { closeTime: value })}
                      >
                        <SelectTrigger className="mt-1 bg-background">
                          <SelectValue>
                            {formatTime12Hour(schedule[day.value].closeTime)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] bg-popover z-50">
                          {TIME_OPTIONS.filter(
                            (time) => time > schedule[day.value].openTime
                          ).map((time) => (
                            <SelectItem key={`close-${day.value}-${time}`} value={time}>
                              {formatTime12Hour(time)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Closed</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>
              {DAYS_OF_WEEK.filter(d => schedule[d.value].isOpen).length} days open
            </span>
            <span>
              {schedule[1].isOpen && `Mon-Fri: ${formatTime12Hour(schedule[1].openTime)} - ${formatTime12Hour(schedule[1].closeTime)}`}
            </span>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Schedule
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
