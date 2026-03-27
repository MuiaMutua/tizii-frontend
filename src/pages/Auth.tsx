import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Inline Icons
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);
const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("artist");
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login/signup logic
    if (role === "artist") navigate("/artist/dashboard");
    else if (role === "studio_manager") navigate("/studio-manager/dashboard");
    else if (role === "studio_owner") navigate("/studio-owner/dashboard");
  };

  return (
    <div className="flex-col" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      
      <main className="flex-1 container flex items-center justify-center py-24 animate-fadeUp">
        <div className="grid-2" style={{ gridTemplateColumns: '0.8fr 1.2fr', maxWidth: 1000, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }}>
          
          {/* Brand Panel */}
          <div className="p-12 hidden md:flex flex-col justify-between" style={{ background: 'var(--paon)', color: 'white' }}>
            <div className="t-label text-lemon">TIZII PORTAL</div>
            <div>
              <h2 className="t-headline text-lemon mb-4" style={{ fontSize: '2.5rem' }}>Sonic <br />Architecture</h2>
              <p className="t-body" style={{ color: 'rgba(255,255,255,0.6)' }}>Access the world's most elite recording network. Managed sessions, verified gear, and architectural precision.</p>
            </div>
            <div className="t-small" style={{ color: 'rgba(255,255,255,0.4)' }}>© 2024 Tizii Markets. All rights reserved.</div>
          </div>

          {/* Form Panel */}
          <div className="p-12 md:p-16 flex-col justify-center">
            <h2 className="t-headline mb-2">{isSignup ? 'Initialize Account' : 'Welcome Back'}</h2>
            <p className="t-body mb-10 text-muted">Please enter your credentials to access the platform.</p>

            <form onSubmit={handleAuth} className="flex-col gap-6">
              {isSignup && (
                <div className="flex-col gap-2">
                  <label className="t-label">FULL NAME</label>
                  <div className="relative">
                    <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}><UserIcon /></div>
                    <input type="text" placeholder="John Doe" className="btn btn-outline btn-full" style={{ textAlign: 'left', paddingLeft: 48, fontWeight: 400 }} required />
                  </div>
                </div>
              )}

              <div className="flex-col gap-2">
                <label className="t-label">EMAIL ADDRESS</label>
                <div className="relative">
                  <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}><MailIcon /></div>
                  <input type="email" placeholder="name@company.com" className="btn btn-outline btn-full" style={{ textAlign: 'left', paddingLeft: 48, fontWeight: 400 }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="flex-col gap-2">
                <label className="t-label">PASSWORD</label>
                <div className="relative">
                  <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}><LockIcon /></div>
                  <input type="password" placeholder="••••••••" className="btn btn-outline btn-full" style={{ textAlign: 'left', paddingLeft: 48, fontWeight: 400 }} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>

              <div className="flex-col gap-2">
                <label className="t-label">PLATFORM ROLE</label>
                <select className="btn btn-outline btn-full" style={{ textAlign: 'left', fontWeight: 400, appearance: 'none' }} value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="artist">Artist / Creator</option>
                  <option value="studio_manager">Studio Manager</option>
                  <option value="studio_owner">Studio Owner</option>
                </select>
              </div>

              <button type="submit" className="btn btn-paon btn-full btn-lg mt-4">
                {isSignup ? 'CREATE ACCOUNT' : 'SECURE LOG IN'}
              </button>
            </form>

            <div className="divider" style={{ margin: '32px 0' }} />

            <p className="text-center t-body">
              {isSignup ? "Already have an account?" : "No account yet?"}{" "}
              <button 
                className="text-paon font-700 underline"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Sign In" : "Initialize Account"}
              </button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
