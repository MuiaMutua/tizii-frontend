import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studiosApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";

// Inline Icons
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const StudioDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studio, setStudio] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studioRes, roomsRes] = await Promise.all([
          studiosApi.getById(id!),
          studiosApi.getRooms(id!),
        ]);
        setStudio(studioRes.data?.studio);
        setRooms(roomsRes.data?.rooms || []);
      } catch (err) {
        console.error("Failed to fetch studio data", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (isLoading || !studio) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="animate-pulse t-label">Initializing Session...</div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <Navbar />
      
      <main className="container section">
        {/* Breadcrumb / Back */}
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm mb-6" style={{ paddingLeft: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to marketplace
        </button>

        <div className="grid-2" style={{ gridTemplateColumns: '1.4fr 0.6fr', gap: 48, alignItems: 'start' }}>
          {/* Left Column: Media & Info */}
          <div className="flex-col gap-8">
            {/* Gallery */}
            <div className="flex-col gap-4">
              <div className="card overflow-hidden" style={{ height: 480 }}>
                <img 
                  src={studio.gallery?.[activeImg] || studio.image_url} 
                  alt={studio.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div className="flex gap-4">
                {(studio.gallery || [studio.image_url]).map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    className="card overflow-hidden" 
                    style={{ width: 100, height: 70, opacity: activeImg === idx ? 1 : 0.5, border: activeImg === idx ? '2px solid var(--paon)' : '1px solid var(--border)', cursor: 'pointer' }}
                    onClick={() => setActiveImg(idx)}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Header / Description */}
            <div className="flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="t-headline mb-2">{studio.name}</h1>
                  <div className="flex items-center gap-4 text-muted">
                    <div className="flex items-center gap-1 font-700 text-primary">
                      <StarIcon />
                      {studio.rating}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPinIcon />
                      {studio.location}
                    </div>
                  </div>
                </div>
                <button className="btn btn-outline" style={{ borderRadius: '50%', width: 44, height: 44, padding: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>

              <div className="divider" style={{ margin: '8px 0' }} />

              <div className="flex-col gap-2">
                <h3 className="t-title">About this space</h3>
                <p className="t-body" style={{ fontSize: '1.05rem' }}>{studio.description}</p>
              </div>

              <div className="flex-col gap-4">
                <h3 className="t-title">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {studio.amenities?.map((a: string) => (
                    <div key={a} className="chip">{a}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Selection */}
            <div className="flex-col gap-6">
              <h3 className="t-headline" style={{ fontSize: '1.5rem' }}>Available Rooms</h3>
              <div className="flex-col gap-4">
                {rooms.map(room => (
                  <div key={room.id} className="card card-interactive">
                    <div className="card-body flex justify-between items-center">
                      <div style={{ maxWidth: '70%' }}>
                        <h4 className="t-title mb-1">{room.name}</h4>
                        <p className="t-small mb-3">{room.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {room.equipment.map((e: string) => (
                            <span key={e} className="t-label" style={{ background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: 4 }}>{e}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mb-3">
                          <span className="t-headline" style={{ fontSize: '1.5rem' }}>KES {room.hourly_rate.toLocaleString()}</span>
                          <span className="text-muted" style={{ fontSize: '0.75rem', marginLeft: 4 }}>/ hr</span>
                        </div>
                        <button 
                          className="btn btn-paon"
                          onClick={() => navigate(`/checkout/${studio.id}/room/${room.id}`)}
                        >
                          Book Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Stats / Owner */}
          <div className="flex-col gap-6" style={{ position: 'sticky', top: 100 }}>
            {/* Quick summary card */}
            <div className="card" style={{ background: 'var(--paon)', borderColor: 'var(--paon)', color: 'white' }}>
              <div className="card-body">
                <h3 className="t-title text-lemon mb-4">Availability Summary</h3>
                <div className="flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 t-small" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <ClockIcon />
                      Standard Hours
                    </div>
                    <span className="t-small">09:00 — 22:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 t-small" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <ShieldIcon />
                      Verification
                    </div>
                    <StatusBadge status="ELITE" variant="lemon" />
                  </div>
                </div>
                <div className="divider" style={{ background: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />
                <p className="t-small" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  Select a room to the left to see specific pricing and equipment manifests.
                </p>
              </div>
            </div>

            {/* Owner Section */}
            <div className="card">
              <div className="card-body flex items-center gap-4">
                <div className="avatar avatar-lg">
                  {studio.owner.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="t-title">{studio.owner.name}</h4>
                  <p className="t-small">Studio Professional</p>
                  <div className="flex items-center gap-1 text-paon mt-1" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    <CheckIcon />
                    Identity Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Protection Card */}
            <div className="flex items-start gap-4 p-4" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div className="text-paon" style={{ marginTop: 2 }}>
                <ShieldIcon />
              </div>
              <p className="t-small" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                To protect your payment, never transfer money or communicate outside of the Tizii website or app.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudioDetails;
