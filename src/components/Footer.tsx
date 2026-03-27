const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, marginBottom: 0 }}>
          {/* Brand */}
          <div>
            <div className="footer-logo">Tizii</div>
            <p className="footer-tagline">
              The professional studio booking marketplace. Connect artists with world-class recording spaces across Africa.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <a
                href="#"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}
                aria-label="Twitter"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a
                href="#"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="footer-col">
            <h4>PLATFORM</h4>
            <a href="/home">Explore Studios</a>
            <a href="/bookings">Find a Studio</a>
            <a href="/artist/dashboard">Artist Portal</a>
            <a href="/studio-owner/dashboard">Host a Studio</a>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4>COMPANY</h4>
            <a href="#">About Tizii</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Press</a>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4>LEGAL</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Help Center</a>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p>2024 Tizii Sonic Architecture. All rights reserved.</p>
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>Built for creators across Africa.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
