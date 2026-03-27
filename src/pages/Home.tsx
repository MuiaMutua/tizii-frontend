import { useState, useEffect } from "react";
import { studiosApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudioCard from "@/components/StudioCard";

// Inline Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
);
const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const Home = () => {
  const [studios, setStudios] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    studiosApi.getAll().then(res => {
      setStudios(res.data?.studios || []);
    }).finally(() => setIsLoading(false));
  }, []);

  const categories = ["All", "Recording", "Production", "Analog", "Live Room", "Electronic", "Orchestral"];

  const filteredStudios = activeFilter === "All" 
    ? studios 
    : studios.filter(s => s.category === activeFilter);

  return (
    <div className="flex-col">
      <Navbar variant="transparent" />
      
      {/* Hero Section */}
      <section 
        className="hero-studio flex items-center" 
        style={{ 
          minHeight: '90vh', 
          backgroundImage: "url('/assets/studio-hero.png')" 
        }}
      >
        <div className="hero-overlay" />
        
        <div className="container relative z-10 animate-fadeUp">
          <div className="max-w-[720px] mx-auto md:mx-0">
            <div className="flex justify-center md:justify-start">
              <span className="badge badge-lemon mb-6 shadow-glow">PLATFORM ELITE</span>
            </div>
            <h1 className="t-display text-lemon mb-6 drop-shadow-2xl">
              Sonic Architecture <br /> for Modern Creators
            </h1>
            <p className="t-body text-white/80 text-lg md:text-xl mb-10 max-w-[540px]">
              Discover and book world-class recording spaces. Precision acoustics, legendary gear, and seamless sessions.
            </p>

            {/* Hero Search Bar */}
            <div className="hero-search glass-morphism-dark border-white/10">
              <div className="hero-search-field">
                <label className="text-lemon/70">Where</label>
                <div className="flex items-center gap-2 text-white">
                  <MapPinIcon />
                  <input type="text" placeholder="Search locations" className="placeholder:text-white/40 text-white" />
                </div>
              </div>
              <div className="hero-search-field">
                <label className="text-lemon/70">When</label>
                <div className="flex items-center gap-2 text-white">
                  <CalendarIcon />
                  <input type="text" placeholder="Add dates" className="placeholder:text-white/40 text-white" />
                </div>
              </div>
              <div className="hero-search-field">
                <label className="text-lemon/70">Guests</label>
                <div className="flex items-center gap-2 text-white">
                  <UsersIcon />
                  <input type="text" placeholder="Add artists" className="placeholder:text-white/40 text-white" />
                </div>
              </div>
              <button className="hero-search-btn hover:scale-105 transition-transform">
                <SearchIcon />
                <span className="hidden md:inline">SEARCH</span>
                <span className="md:hidden">FIND STUDIO</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery / Filter Section */}
      <section className="section bg-white dark:bg-black/20">
        <div className="container">
          <div className="section-header flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
            <div className="text-center md:text-left">
              <h2 className="t-headline">Explore Studios</h2>
              <p className="t-body">Find the perfect space for your signature sound.</p>
            </div>
            <div className="filter-chips">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`chip ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-3 mt-12 animate-fadeUp">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="card h-[360px] animate-pulse bg-gray-100 dark:bg-white/5" />
              ))
            ) : filteredStudios.map(studio => (
              <StudioCard 
                key={studio.id}
                id={studio.id}
                name={studio.name}
                location={studio.location}
                price={studio.price_per_hour}
                rating={studio.rating}
                imageUrl={studio.image_url}
                category={studio.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-lg" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="section-header text-center max-w-2xl mx-auto mb-16">
            <h2 className="t-headline">A Professional Edge</h2>
            <p className="t-body">A seamless bridge between vision and recording.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Discovery", desc: "Browse a curated network of elite studios with verified gear lists and acoustic specs." },
              { title: "Governance", desc: "Manage sessions, slots, and secure payments through our architectural framework." },
              { title: "Production", desc: "Unlock world-class output with seamless workflow and professional engineering support." }
            ].map((step, i) => (
              <div key={i} className="card-body bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 p-8 hover:shadow-xl transition-all">
                <div className="step-number mb-6">{i + 1}</div>
                <h3 className="t-title mb-4 text-xl">{step.title}</h3>
                <p className="t-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
