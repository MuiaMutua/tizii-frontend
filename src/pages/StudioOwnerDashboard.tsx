import { useState, useEffect } from "react";
import { studiosApi, MOCK_STUDIOS, MOCK_SLOTS } from "@/lib/api";
import SidebarNav from "@/components/SidebarNav";
import StatusBadge from "@/components/StatusBadge";

// Inline Icons
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
);
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);

const StudioOwnerDashboard = () => {
  const [myStudios, setMyStudios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In actual app, filter by owner_id. Mock: take first 3 studios.
    setMyStudios(MOCK_STUDIOS.slice(0, 3));
    setIsLoading(false);
  }, []);

  return (
    <div className="flex" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SidebarNav type="owner" />
      
      <main className="flex-1 p-12" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="t-label mb-2">OWNERSHIP GOVERNANCE</p>
            <h1 className="t-headline">Studio Governance</h1>
          </div>
          <div className="flex gap-4 items-center">
            <button className="btn btn-paon">
              <PlusIcon />
              LIST NEW STUDIO
            </button>
            <div className="avatar">SO</div>
          </div>
        </header>

        {/* Studio Grid */}
        <div className="grid-3 mb-12">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="card animate-pulse" style={{ height: 200 }} />)
          ) : myStudios.map(studio => (
            <div key={studio.id} className="card card-interactive">
              <div className="card-body">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-paon"><BuildingIcon /></div>
                  <button className="btn btn-ghost" style={{ padding: 4 }}><MoreIcon /></button>
                </div>
                <h3 className="t-title mb-1">{studio.name}</h3>
                <p className="t-small mb-4 text-muted">{studio.location}</p>
                <div className="divider mb-4" />
                <div className="flex justify-between items-end">
                   <div>
                      <p className="t-label mb-1">REVENUE (MTD)</p>
                      <span className="font-700">KES {(studio.price_per_hour * 40).toLocaleString()}</span>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <p className="t-label mb-1">UTILIZATION</p>
                      <span className="text-lemon font-700">74%</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* Slot Architecture Panel */}
          <div className="card">
            <div className="card-body-lg" style={{ borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <h3 className="t-title">Slot Architecture</h3>
              <button className="btn btn-outline btn-sm">MANAGE ALL</button>
            </div>
            <div className="card-body-lg flex-col gap-4">
               {MOCK_SLOTS.slice(0, 4).map((slot, i) => (
                 <div key={i} className="flex justify-between items-center p-4 rounded-lg bg-elevated border border-border">
                    <div className="flex gap-4 items-center">
                       <div>
                          <h4 className="t-title" style={{ fontSize: '1rem' }}>{slot.date}</h4>
                          <p className="t-label text-muted">{slot.time}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <StatusBadge status={slot.status} />
                       <button className="btn btn-ghost" style={{ padding: 4 }}><MoreIcon /></button>
                    </div>
                 </div>
               ))}
               <button className="btn btn-outline btn-full mt-4">VIEW FULL CALENDAR</button>
            </div>
          </div>

          {/* Activity / Notifications */}
          <div className="card">
            <div className="card-body-lg" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="t-title">Governance Alerts</h3>
            </div>
            <div className="card-body-lg flex-col gap-4">
               {[
                 { type: 'Booking', msg: 'New Session Confirmed: "The Echo Chamber" for Oct 24.', time: '2 mins ago' },
                 { type: 'Payment', msg: 'Settlement processed: KES 14,000 via M-Pesa.', time: '1 hour ago' },
                 { type: 'System', msg: 'New studio manager "Amira" added to network.', time: '4 hours ago' }
               ].map((alert, i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-lg bg-subtle border border-transparent">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lemon)', marginTop: 6 }} />
                    <div className="flex-1">
                       <div className="flex justify-between mb-1">
                          <span className="t-label text-paon">{alert.type}</span>
                          <span className="t-small text-muted">{alert.time}</span>
                       </div>
                       <p className="t-small" style={{ lineHeight: 1.4 }}>{alert.msg}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudioOwnerDashboard;