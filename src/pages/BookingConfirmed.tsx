import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Inline Icons
const CheckCircleIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--lemon)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
);
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
);
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const BookingConfirmed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-col">
      <Navbar />
      
      <main className="container section-lg flex-col items-center justify-center text-center animate-fadeUp">
        <div className="mb-8 p-6" style={{ background: 'var(--paon)', borderRadius: '100%', boxShadow: '0 0 40px rgba(216, 255, 42, 0.2)' }}>
          <CheckCircleIcon />
        </div>
        
        <p className="t-label mb-3" style={{ color: 'var(--paon)' }}>SESSION ARCHITECTURE SETTLED</p>
        <h1 className="t-display mb-6" style={{ fontSize: '3rem' }}>Booking Confirmed</h1>
        <p className="t-body mb-12" style={{ maxWidth: 540, fontSize: '1.125rem' }}>
          Your recording session at **The Echo Chamber** has been secured. A notification has been sent to the studio manager and house engineer.
        </p>

        <div className="card mb-12" style={{ maxWidth: 480, width: '100%', textAlign: 'left' }}>
          <div className="card-body-lg flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="t-title mb-1">Session Summary</h3>
                <p className="t-small">Ref: #TZ-90822-EC</p>
              </div>
              <div className="badge badge-settled">PAID</div>
            </div>

            <div className="divider" />

            <div className="flex-col gap-4">
              <div className="flex justify-between t-body">
                <span className="text-muted">Studio</span>
                <span className="font-700">The Echo Chamber</span>
              </div>
              <div className="flex justify-between t-body">
                <span className="text-muted">Room</span>
                <span className="font-700">Control Room A</span>
              </div>
              <div className="flex justify-between t-body">
                <span className="text-muted">Date</span>
                <span className="font-700">Monday, Oct 24</span>
              </div>
              <div className="flex justify-between t-body">
                <span className="text-muted">Time</span>
                <span className="font-700">09:00 AM — 12:00 PM (3 hrs)</span>
              </div>
            </div>

            <div className="divider" />

            <div className="flex justify-between t-title" style={{ fontSize: '1.125rem' }}>
              <span>Amount Settled</span>
              <span className="text-paon">KES 11,025</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="btn btn-paon" style={{ padding: '14px 28px' }} onClick={() => navigate('/artist/dashboard')}>
            GO TO DASHBOARD
          </button>
          <button className="btn btn-outline" style={{ padding: '14px 28px' }}>
            <CalendarIcon />
            ADD TO CALENDAR
          </button>
        </div>

        <div className="flex gap-8 mt-12">
          <button className="btn btn-ghost t-small">
            <ShareIcon />
            Share session
          </button>
          <button className="btn btn-ghost t-small">
            <DownloadIcon />
            Download Receipt
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmed;
