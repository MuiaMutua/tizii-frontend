import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { studiosApi, MOCK_SLOTS } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";

// Inline Icons
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
);
const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { studioId, roomId } = useParams();
  const [studio, setStudio] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studioRes = await studiosApi.getById(studioId!);
        const roomsRes = await studiosApi.getRooms(studioId!);
        setStudio(studioRes.data?.studio);
        const roomData = roomsRes.data?.rooms?.find((r: any) => r.id === roomId);
        setRoom(roomData || roomsRes.data?.rooms?.[0]);
      } catch (err) {
        console.error("Error fetching checkout data", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (studioId) fetchData();
  }, [studioId, roomId]);

  if (isLoading || !studio || !room) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="animate-pulse t-label">Allocating Architecture...</div>
      </div>
    );
  }

  const subtotal = room.hourly_rate * (selectedSlot !== null ? 3 : 0); // Mock 3-hour slots
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  return (
    <div className="flex-col">
      <Navbar />
      
      <main className="container section">
        <header className="mb-8">
          <p className="t-label mb-2">SETTLEMENT FLOW</p>
          <h1 className="t-headline">Slot Architecture</h1>
          <p className="t-body">Precision scheduling for high-end production sessions.</p>
        </header>

        <div className="grid-2" style={{ gridTemplateColumns: '1.4fr 0.6fr', gap: 48, alignItems: 'start' }}>
          {/* Main: Slot Selection */}
          <div className="flex-col gap-8">
            <div className="card">
              <div className="card-body-lg" style={{ borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="flex items-center gap-4">
                  <div className="btn btn-outline btn-sm" style={{ padding: '6px 12px' }}>LIST VIEW</div>
                  <div className="t-small text-muted">CALENDAR VIEW</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex gap-2">
                    <button className="btn btn-outline" style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}><ChevronLeftIcon /></button>
                    <button className="btn btn-outline" style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}><ChevronRightIcon /></button>
                  </div>
                  <span className="t-label" style={{ color: 'var(--text-primary)' }}>October 24 — 30, 2024</span>
                </div>
              </div>

              <div className="card-body-lg flex-col gap-6">
                {MOCK_SLOTS.map((slot, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${slot.status === 'Available' ? 'cursor-pointer hover:bg-subtle' : 'opacity-60'} ${selectedSlot === idx ? 'bg-paon text-white' : 'bg-elevated border border-border'}`}
                    style={selectedSlot === idx ? { borderColor: 'var(--paon)' } : {}}
                    onClick={() => slot.status === 'Available' && setSelectedSlot(idx)}
                  >
                    <div className="flex gap-8 items-center">
                      <div style={{ width: 80 }}>
                        <h4 className="t-title mb-1" style={selectedSlot === idx ? { color: 'white' } : {}}>{slot.date}</h4>
                        <p className="t-label" style={selectedSlot === idx ? { color: 'rgba(255,255,255,0.5)' } : {}}>{slot.day}</p>
                      </div>
                      <div className="flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <ClockIcon />
                          <span className="t-title" style={{ fontSize: '1rem', ...(selectedSlot === idx ? { color: 'white' } : {}) }}>{slot.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: slot.status === 'Available' ? 'var(--lemon)' : slot.status === 'Booked' ? '#014751' : '#888' }} />
                          <span className="t-small" style={selectedSlot === idx ? { color: 'rgba(255,255,255,0.7)' } : {}}>{slot.detail}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <StatusBadge status={slot.status === 'Available' && selectedSlot === idx ? 'SELECTED' : slot.status} variant={slot.status === 'Available' && selectedSlot === idx ? 'lemon' : undefined} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 card" style={{ background: 'var(--paon-muted)', borderStyle: 'dashed' }}>
              <div className="text-paon"><InfoIcon /></div>
              <div>
                <h5 className="t-title mb-1" style={{ fontSize: '0.875rem' }}>Architectural Policy</h5>
                <p className="t-small">Cancellations made 48 hours prior to the session start are eligible for a 100% refund. Late cancellations are subject to structural fees.</p>
              </div>
            </div>
          </div>

          {/* Sidebar: Booking Summary */}
          <div className="flex-col gap-6" style={{ position: 'sticky', top: 100 }}>
            <div className="card overflow-hidden">
              <div className="relative" style={{ height: 160 }}>
                <img src={studio.image_url} alt={studio.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-elevated), transparent)' }} />
              </div>
              
              <div className="card-body-lg">
                <div className="mb-6">
                  <h3 className="t-title mb-1">{studio.name}</h3>
                  <p className="t-small">{room.name}</p>
                </div>

                <div className="divider mb-6" />

                <div className="flex-col gap-4 mb-8">
                  <h4 className="t-label">Price Details</h4>
                  <div className="flex justify-between t-body">
                    <span>{selectedSlot !== null ? `3 hours @ KES ${room.hourly_rate.toLocaleString()}` : '0 hours'}</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between t-body">
                    <span className="flex items-center gap-1">
                      Service Fee
                      <InfoIcon />
                    </span>
                    <span>KES {serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between t-title" style={{ fontSize: '1.125rem', marginTop: 8 }}>
                    <span>Total (KES)</span>
                    <span>KES {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="divider mb-8" />

                <div className="flex-col gap-4 mb-8">
                  <h4 className="t-label">Payment Method</h4>
                  <div className="flex-col gap-2">
                    <label className={`btn btn-outline btn-full flex items-center justify-between cursor-pointer ${paymentMethod === 'mpesa' ? 'border-paon bg-paon-muted' : ''}`}>
                      <input type="radio" name="payment" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} style={{ display: 'none' }} />
                      <span className="flex items-center gap-3">
                        <div style={{ width: 32, height: 20, background: '#4CAF50', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 8, fontWeight: 900 }}>M-PESA</div>
                        M-Pesa Checkout
                      </span>
                      {paymentMethod === 'mpesa' && <div className="text-paon"><ShieldIcon /></div>}
                    </label>
                    <label className={`btn btn-outline btn-full flex items-center justify-between cursor-pointer ${paymentMethod === 'card' ? 'border-paon bg-paon-muted' : ''}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ display: 'none' }} />
                      <span className="flex items-center gap-3">
                        <div style={{ width: 32, height: 20, background: '#1A3035', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 8, fontWeight: 900 }}>CARD</div>
                        Credit/Debit Card
                      </span>
                      {paymentMethod === 'card' && <div className="text-paon"><ShieldIcon /></div>}
                    </label>
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-lg btn-full"
                  disabled={selectedSlot === null}
                  onClick={() => navigate('/booking-confirmed')}
                >
                  SETTLE BOOKING
                </button>
                
                <p className="text-center t-small mt-4" style={{ fontSize: '0.65rem' }}>
                  By clicking settle, you agree to the Tizii Architectural Terms of Service and Cancellation Policy.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center text-muted t-small">
              <ShieldIcon />
              Secure Architectural Payment
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
