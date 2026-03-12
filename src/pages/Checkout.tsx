import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Calendar, MapPin, Smartphone, Loader2, CheckCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "sonner";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { studiosApi, api } from "@/lib/api";

interface LocationState {
  studio?: any;
  room?: any;
  selectedDates?: Date[];
  selectedTimes?: Record<string, string[]>;
}

type PaymentStatus = "idle" | "sending" | "waiting" | "success" | "failed";

const Checkout = () => {
  const { studioId, roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [studioData, setStudioData] = useState<any>(state?.studio || null);
  const [roomData, setRoomData] = useState<any>(state?.room || null);
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    state?.selectedDates?.map(d => new Date(d)) || []
  );
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string[]>>(state?.selectedTimes || {});

  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card">("mpesa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!studioData && studioId) {
          const studioRes = await studiosApi.getById(studioId);
          setStudioData(studioRes.data.studio || studioRes.data);
        }
        if (!roomData && roomId) {
          const roomRes = await api.get(`/api/studios/rooms/${roomId}`);
          setRoomData(roomRes.data.room || roomRes.data);
        }
      } catch (err) {
        toast.error("Failed to load booking info");
        navigate("/home");
      }
    };

    if ((!studioData && studioId) || (!roomData && roomId)) {
      fetchData();
    }
  }, [studioId, roomId, studioData, roomData, navigate]);

  // Manual check payment status
  const checkPaymentStatus = async () => {
    if (!bookingId) return;
    
    try {
      const response = await api.get(`/api/bookings/${bookingId}`);
      const booking = response.data;
      
      if (booking.status === "confirmed") {
        setPaymentStatus("success");
        toast.success("Payment confirmed!");
        
        setTimeout(() => {
          navigate("/booking-confirmed", {
            state: { 
              studio: studioData, 
              room: roomData, 
              selectedDates, 
              selectedTimes, 
              totalAmount,
              bookingId 
            },
          });
        }, 1500);
      } else if (booking.payments?.[0]?.status === "failed") {
        setPaymentStatus("failed");
        toast.error("Payment failed. Please try again.");
      } else {
        toast.info("Payment still pending. Please complete the M-Pesa prompt on your phone.");
      }
    } catch (error) {
      console.error("Error checking booking status:", error);
      toast.error("Failed to check payment status");
    }
  };

  // Poll for payment confirmation
  useEffect(() => {
    if (paymentStatus !== "waiting" || !bookingId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await api.get(`/api/bookings/${bookingId}`);
        const booking = response.data;
        
        if (booking.status === "confirmed") {
          setPaymentStatus("success");
          clearInterval(pollInterval);
          toast.success("Payment confirmed!");
          
          setTimeout(() => {
            navigate("/booking-confirmed", {
              state: { 
                studio: studioData, 
                room: roomData, 
                selectedDates, 
                selectedTimes, 
                totalAmount,
                bookingId 
              },
            });
          }, 1500);
        } else if (booking.payments?.[0]?.status === "failed") {
          setPaymentStatus("failed");
          clearInterval(pollInterval);
          toast.error("Payment failed. Please try again.");
        }
      } catch (error) {
        console.error("Error polling booking status:", error);
      }
    }, 3000); // Poll every 3 seconds

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (paymentStatus === "waiting") {
        toast.error("Payment confirmation timed out. Use 'Check Status' button or try again.");
        setPaymentStatus("idle");
      }
    }, 120000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [paymentStatus, bookingId, navigate, studioData, roomData, selectedDates, selectedTimes]);

  // Calculate total selected slots
  const totalSlots = useMemo(() => {
    return Object.values(selectedTimes).reduce(
      (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
      0
    );
  }, [selectedTimes]);

  const pricePerHour = Number(roomData?.hourly_rate || 0);
  const totalAmount = pricePerHour * totalSlots;

  const roomImage = roomData?.photos?.[0]?.url || "/placeholder.svg";

  // Build slots array for backend
  const buildSlotsArray = () => {
    const slots: { start_time: string; end_time: string }[] = [];
    
    for (const date of selectedDates) {
      const times = selectedTimes[date.toDateString()] || [];
      for (const timeStr of times) {
        const [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        const startDateTime = new Date(date);
        startDateTime.setHours(hours, minutes || 0, 0, 0);

        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + 1);

        slots.push({
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
        });
      }
    }
    
    return slots;
  };

  const handlePayment = async () => {
    if (!selectedDates || selectedDates.length === 0) {
      toast.error("No dates selected");
      return;
    }

    if (totalSlots === 0) {
      toast.error("Please select at least one time slot");
      return;
    }

    // Format phone number for M-Pesa (must be 254XXXXXXXXX format)
    let formattedPhone = mpesaPhone.trim().replace(/\s+/g, "").replace(/-/g, "");
    
    if (paymentMethod === "mpesa") {
      if (!formattedPhone) {
        toast.error("Please enter your M-Pesa phone number");
        return;
      }

      // Remove any leading + sign
      if (formattedPhone.startsWith("+")) {
        formattedPhone = formattedPhone.slice(1);
      }
      
      // Convert 07XX to 2547XX format
      if (formattedPhone.startsWith("0") && formattedPhone.length === 10) {
        formattedPhone = "254" + formattedPhone.slice(1);
      }
      
      // Convert 7XX to 2547XX format (without leading 0)
      if (formattedPhone.startsWith("7") && formattedPhone.length === 9) {
        formattedPhone = "254" + formattedPhone;
      }

      // Validate final format: must be 2547XXXXXXXX (12 digits total)
      if (!/^254[71]\d{8}$/.test(formattedPhone)) {
        toast.error("Please enter a valid Safaricom number (e.g., 0712345678 or 254712345678)");
        return;
      }
      
      console.log("Formatted phone number for M-Pesa:", formattedPhone);
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        toast.error("Please fill in all card details");
        return;
      }
    }

    setPaymentStatus("sending");

    try {
      const slots = buildSlotsArray();
      
      // Create booking with slots and payment method
      const bookingPayload = {
        studio_id: studioData.id,
        room_id: roomData.id,
        slots,
        payment_method: paymentMethod === "mpesa" ? "online" : "offline",
        phone_number: paymentMethod === "mpesa" ? formattedPhone : undefined,
        currency: "KES",
        notes: `Booking for ${totalSlots} hour(s)`,
      };

      console.log("Creating booking with payload:", bookingPayload);
      
      const bookingResponse = await api.post("/api/bookings", bookingPayload);
      const booking = bookingResponse.data.booking || bookingResponse.data;
      
      console.log("Booking created:", booking);
      setBookingId(booking.id);

      if (paymentMethod === "mpesa") {
        toast.success("STK push sent! Please check your phone and enter your M-Pesa PIN.");
        setPaymentStatus("waiting");
      } else {
        // Offline payment - booking already confirmed
        toast.success("Booking confirmed!");
        setPaymentStatus("success");
        
        setTimeout(() => {
          navigate("/booking-confirmed", {
            state: { 
              studio: studioData, 
              room: roomData, 
              selectedDates, 
              selectedTimes, 
              totalAmount,
              bookingId: booking.id 
            },
          });
        }, 1500);
      }
    } catch (error: any) {
      console.error("Booking failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Booking failed. Please try again");
      setPaymentStatus("idle");
    }
  };

  const isProcessing = paymentStatus === "sending" || paymentStatus === "waiting";

  if (!studioData || !roomData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-background">
      <header className="sticky top-0 z-30 glass-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-secondary"
            disabled={isProcessing}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Checkout</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Payment Status Overlay */}
        {paymentStatus === "waiting" && (
          <Card className="glass-card border-0 p-6 bg-primary/5">
            <div className="flex items-center gap-4 mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div>
                <h3 className="font-semibold">Waiting for M-Pesa Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  Please enter your M-Pesa PIN on your phone. This may take a moment...
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkPaymentStatus}
                className="flex-1"
              >
                Check Status
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setPaymentStatus("idle");
                  setBookingId(null);
                }}
                className="flex-1"
              >
                Cancel & Retry
              </Button>
            </div>
          </Card>
        )}

        {paymentStatus === "success" && (
          <Card className="glass-card border-0 p-6 bg-green-500/10">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-700 dark:text-green-400">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Redirecting to confirmation page...
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Booking Summary */}
        <Card className="glass-card border-0 p-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
          <div className="flex items-start gap-3">
            <img
              src={roomImage}
              alt={roomData.name}
              className="w-20 h-20 rounded-xl object-cover"
              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
            />
            <div className="flex-1">
              <h3 className="font-semibold">{studioData.name}</h3>
              <p className="text-sm text-muted-foreground">{roomData.name}</p>
              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{studioData.location}</span>
                </div>
                {selectedDates.map((date) => (
                  <div key={date.toDateString()} className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(date, "PPP")}: {selectedTimes[date.toDateString()]?.join(", ") || "No times selected"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="glass-card border-0 p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          <Tabs
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as "mpesa" | "card")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="mpesa" className="flex items-center gap-2" disabled={isProcessing}>
                <Smartphone className="h-4 w-4" /> M-Pesa
              </TabsTrigger>
              <TabsTrigger value="card" className="flex items-center gap-2" disabled={isProcessing}>
                <CreditCard className="h-4 w-4" /> Pay Later
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mpesa" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">M-Pesa Phone Number</label>
                <Input
                  placeholder="0712345678"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  className="glass-card border-0"
                  type="tel"
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter your Safaricom number to receive an STK push payment request
                </p>
              </div>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">
                  <strong>Pay at Studio:</strong> Your booking will be confirmed and you can pay when you arrive at the studio.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Card Number (Optional)</label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="glass-card border-0"
                  maxLength={19}
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Cardholder Name</label>
                <Input
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="glass-card border-0"
                  disabled={isProcessing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Expiry Date</label>
                  <Input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="glass-card border-0"
                    maxLength={5}
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">CVV</label>
                  <Input
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="glass-card border-0"
                    maxLength={3}
                    type="password"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Total */}
        <Card className="glass-card border-0 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">
              {totalSlots} hour{totalSlots !== 1 ? "s" : ""} × KES {pricePerHour.toLocaleString()}
            </span>
            <span className="font-medium">KES {(pricePerHour * totalSlots).toLocaleString()}</span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-2xl text-primary">
                KES {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        <Button
          size="lg"
          className="w-full neu-btn bg-primary hover:bg-primary/90 h-14"
          onClick={handlePayment}
          disabled={isProcessing || totalSlots === 0}
        >
          {paymentStatus === "sending" && (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Creating Booking...
            </>
          )}
          {paymentStatus === "waiting" && (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Waiting for Payment...
            </>
          )}
          {paymentStatus === "idle" && (
            paymentMethod === "mpesa" ? "Pay with M-Pesa" : "Confirm Booking"
          )}
          {paymentStatus === "success" && (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Payment Complete
            </>
          )}
          {paymentStatus === "failed" && "Retry Payment"}
        </Button>

        {paymentStatus === "waiting" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setPaymentStatus("idle");
              setBookingId(null);
            }}
          >
            Cancel & Try Again
          </Button>
        )}
      </main>
    </div>
  );
};

export default Checkout;
