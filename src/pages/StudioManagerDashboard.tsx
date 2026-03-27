import { useState } from "react";
import { MOCK_TRANSACTIONS } from "@/lib/api";
import SidebarNav from "@/components/SidebarNav";
import StatusBadge from "@/components/StatusBadge";

// Inline Icons
const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const ActivityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);

const StudioManagerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "PLATFORM REVENUE", value: "KES 2,429,100", trend: "+12.4%", icon: <TrendingUpIcon />, color: "var(--paon)" },
    { label: "GLOBAL BOOKINGS", value: "4,210", trend: "OPTIMAL", icon: <GlobeIcon />, color: "var(--paon)" },
    { label: "SYSTEM LATENCY", value: "24ms", trend: "STABLE", icon: <ActivityIcon />, color: "var(--paon)" },
  ];

  return (
    <div className="flex" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SidebarNav type="manager" />
      
      <main className="flex-1 p-12" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="t-label mb-2">SYSTEM ADMINISTRATION</p>
            <h1 className="t-headline">Platform Governance</h1>
          </div>
          <div className="flex gap-4 items-center">
             <div className="relative">
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}><SearchIcon /></div>
                <input 
                  type="text" 
                  placeholder="SEARCH LEDGER..." 
                  className="btn btn-outline" 
                  style={{ paddingLeft: 40, width: 240, textAlign: 'left', fontWeight: 400 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="avatar">AD</div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid-3 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="card">
              <div className="card-body">
                <div className="flex justify-between items-start mb-6">
                  <div style={{ color: stat.color }}>{stat.icon}</div>
                  <span className="t-label" style={{ color: 'var(--paon)' }}>{stat.trend}</span>
                </div>
                <p className="t-label mb-2">{stat.label}</p>
                <h3 className="t-headline" style={{ fontSize: '1.75rem' }}>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart Section (Visual Mock) */}
        <div className="card mb-12">
          <div className="card-body-lg" style={{ borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="t-title">Revenue Architecture</h3>
            <div className="flex gap-4">
              <span className="t-label">LAST 30 DAYS</span>
            </div>
          </div>
          <div className="card-body-lg">
             <div className="flex items-end gap-2" style={{ height: 200 }}>
                {[40, 60, 35, 90, 55, 75, 45, 85, 65, 95, 40, 70].map((h, i) => (
                  <div key={i} className="flex-1" style={{ background: i === 9 ? 'var(--lemon)' : 'var(--paon)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: i === 9 ? 1 : 0.2 }} />
                ))}
             </div>
             <div className="flex justify-between mt-4 t-label text-muted">
                <span>OCT 01</span>
                <span>OCT 15</span>
                <span>OCT 30</span>
             </div>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="card">
          <div className="card-body-lg" style={{ borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="t-title">Transaction Ledger</h3>
            <button className="btn btn-outline btn-sm">
              <FilterIcon />
              EXPORT CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full t-small">
              <thead>
                <tr style={{ background: 'var(--bg-subtle)' }}>
                  <th className="p-4 text-left t-label">TXN ID</th>
                  <th className="p-4 text-left t-label">STUDIO ENTITY</th>
                  <th className="p-4 text-left t-label">LEAD ARTIST</th>
                  <th className="p-4 text-left t-label">AMOUNT</th>
                  <th className="p-4 text-left t-label">STATUS</th>
                  <th className="p-4 text-left t-label">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map((tx, i) => (
                  <tr key={i} className="border-b border-border hover:bg-subtle transition-colors">
                    <td className="p-4 font-700 text-paon" style={{ color: 'var(--paon)' }}>{tx.id}</td>
                    <td className="p-4 font-700">{tx.entity}</td>
                    <td className="p-4 text-muted">{tx.artist}</td>
                    <td className="p-4 font-700">KES {tx.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="p-4 text-muted">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-body flex justify-between items-center text-muted" style={{ background: 'var(--bg-subtle)' }}>
            <p className="t-small">SHOWING 1-6 OF 12,402 ENTRIES</p>
            <div className="flex gap-2">
               <div className="btn btn-outline btn-sm" style={{ width: 32, padding: 0 }}>1</div>
               <div className="btn btn-paon btn-sm" style={{ width: 32, padding: 0 }}>2</div>
               <div className="btn btn-outline btn-sm" style={{ width: 32, padding: 0 }}>3</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudioManagerDashboard;