import { useState, useEffect } from "react";
import { bookingsApi } from "@/lib/api";
import SidebarNav from "@/components/SidebarNav";
import StatusBadge from "@/components/StatusBadge";

// Inline Icons
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
);

const ArtistDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookingsApi.getAll().then(res => {
      setBookings(res.data?.bookings || []);
    }).finally(() => setIsLoading(false));
  }, []);

  const stats = [
    { label: "RECORDED HOURS", value: "124 hrs", icon: <ClockIcon /> },
    { label: "SESSIONS COMPLETED", value: "42", icon: <CheckCircleIcon /> },
    { label: "TOTAL SETTLEMENTS", value: "KES 142,500", icon: <WalletIcon /> },
  ];

  return (
    <div className="flex" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SidebarNav type="artist" />
      
      <main className="flex-1 p-12" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="t-label mb-2">ARTIST OVERVIEW</p>
            <h1 className="t-headline">Dashboard</h1>
          </div>
          <div className="flex gap-4">
            <button className="btn btn-outline btn-sm">GENERATE SESSIONS REPORT</button>
            <div className="avatar">PA</div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid-3 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="card">
              <div className="card-body">
                <div className="text-paon mb-4">{stat.icon}</div>
                <p className="t-label mb-2">{stat.label}</p>
                <h3 className="t-headline" style={{ fontSize: '1.75rem' }}>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="card">
          <div className="card-body-lg" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="t-title">Managed Sessions</h3>
          </div>
          <div className="card-body-lg flex-col gap-6">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse" style={{ height: 60, background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }} />
              ))
            ) : bookings.length > 0 ? (
              bookings.map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-elevated border border-border">
                  <div className="flex gap-6 items-center">
                    <div className="card overflow-hidden" style={{ width: 64, height: 64 }}>
                      <img src={booking.studios?.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 className="t-title mb-1" style={{ fontSize: '1rem' }}>{booking.studios?.name}</h4>
                      <div className="flex items-center gap-3 t-small text-muted">
                        <span className="flex items-center gap-1"><CalendarIcon /> {new Date(booking.start_time).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{booking.rooms?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-col gap-2">
                    <div className="t-title" style={{ fontSize: '1rem' }}>KES {booking.total_price.toLocaleString()}</div>
                    <StatusBadge status={booking.status.toUpperCase()} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="t-body text-muted">No active sessions found.</p>
                <button className="btn btn-paon mt-4" onClick={() => (window.location.href = '/home')}>EXPLORE STUDIOS</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistDashboard;
