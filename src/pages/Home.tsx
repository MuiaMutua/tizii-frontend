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

// Studio Decorations
const Waveform = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
    <path d="M0 10 Q 5 0, 10 10 T 20 10 T 30 10 T 40 10 T 50 10 T 60 10 T 70 10 T 80 10 T 90 10 T 100 10" stroke="currentColor" strokeWidth="0.5" fill="none" />
    <path d="M0 10 Q 5 2, 10 10 T 20 10 T 30 10 T 40 10 T 50 10 T 60 10 T 70 10 T 80 10 T 90 10 T 100 10" stroke="currentColor" strokeWidth="0.2" fill="none" opacity="0.5" />
  </svg>
);

const Knob = ({ className }: { className?: string }) => (
  <div className={`w-8 h-8 rounded-full border-2 border-white/20 bg-black/40 relative ${className}`}>
    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-lemon rounded-full" />
  </div>
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
    <div className="flex-col relative">
      <Navbar variant="transparent" />
      
      {/* Hero Section - Asymmetric Layout */}
      <section 
        className="hero-studio min-h-[100vh] flex items-center pt-20 overflow-hidden" 
        style={{ 
          backgroundImage: "url('/assets/studio-hero.png')" 
        }}
      >
        <div className="hero-overlay" />
        
        {/* Decorative Waveforms */}
        <Waveform className="absolute bottom-20 left-0 w-full h-32 text-lemon/10 z-0 pointer-events-none" />
        <Waveform className="absolute top-40 right-[-10%] w-[50%] h-64 text-paon-light/20 rotate-12 z-0 pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 animate-fadeUp">
              
              <h1 className="t-display text-white mb-8 leading-[0.9] tracking-tighter">
                The <span className="text-lemon">Standard</span> for <br />
                Sonic Precision.
              </h1>
              
              <p className="t-body text-white/70 text-lg md:text-xl mb-12 max-w-[500px] leading-relaxed">
                Connect with the world's most prestigious recording facilities. From analog tracking to spatial mixing.
              </p>

              {/* Floating Equipment Icons (Visual Interest) */}
              <div className="hidden lg:flex items-center gap-8 mb-12 opacity-50">
                <div className="flex flex-col items-center gap-2">
                  <Knob className="hover:rotate-45 transition-transform duration-500" />
                  <span className="text-[10px] uppercase font-black text-white/40 tracking-widest">Gain</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Knob className="rotate-[-30deg] hover:rotate-0 transition-transform duration-500" />
                  <span className="text-[10px] uppercase font-black text-white/40 tracking-widest">Freq</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-1 bg-white/20 rounded-full relative">
                    <div className="absolute top-[-4px] left-[60%] w-2 h-3 bg-lemon rounded-sm" />
                  </div>
                  <span className="text-[10px] uppercase font-black text-white/40 tracking-widest">Ratio</span>
                </div>
              </div>
            </div>

            {/* Right Placeholder / Dynamic Element */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative animate-floating">
                <div className="w-full aspect-square glass-morphism-dark rounded-[40px] border-white/5 flex items-center justify-center overflow-hidden group">
                  <img 
                    src="/assets/studio-hero.png" 
                    className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000"
                    alt="Studio atmosphere"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-paon/80 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-lemon font-bold text-sm mb-1 uppercase tracking-widest">Featured Space</p>
                    <p className="text-white text-2xl font-black">Neve VR-60 Console</p>
                  </div>
                </div>
                {/* Visual Accent */}
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-lemon/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-lemon/40 flex items-center justify-center animate-spin-slow">
                    <div className="w-2 h-2 bg-lemon rounded-full" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Overlapping Search Bar */}
          <div className="mt-12 lg:mt-[-40px] relative z-20">
            <div className="hero-search glass-morphism-dark border-white/10 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="hero-search-field group">
                <label className="text-lemon/50 group-focus-within:text-lemon transition-colors">Where</label>
                <div className="flex items-center gap-2 text-white">
                  <MapPinIcon />
                  <input type="text" placeholder="Location" className="placeholder:text-paon/30 dark:placeholder:text-white/20 text-paon dark:text-white" />
                </div>
              </div>
              <div className="hero-search-field group">
                <label className="text-lemon/50 group-focus-within:text-lemon transition-colors">When</label>
                <div className="flex items-center gap-2 text-paon dark:text-white">
                  <CalendarIcon />
                  <input type="text" placeholder="Dates" className="placeholder:text-paon/30 dark:placeholder:text-white/20 text-paon dark:text-white" />
                </div>
              </div>
              <div className="hero-search-field group">
                <label className="text-lemon/50 group-focus-within:text-lemon transition-colors">Artists</label>
                <div className="flex items-center gap-2 text-paon dark:text-white">
                  <UsersIcon />
                  <input type="text" placeholder="Count" className="placeholder:text-paon/30 dark:placeholder:text-white/20 text-paon dark:text-white" />
                </div>
              </div>
              <button className="hero-search-btn h-14 md:h-auto hover:bg-white hover:text-black transition-all">
                <SearchIcon />
                <span className="font-black tracking-widest uppercase">Book Session</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Section - Varied Grid */}
      <section className="section bg-white dark:bg-[#0A1214] overflow-hidden">
        <div className="container relative">
          <div className="section-header flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
            <div className="max-w-xl">
              <h2 className="t-headline mb-4">Discovery Engine</h2>
              <p className="t-body">Our curated network spans across legendary hubs and boutique hidden gems worldwide.</p>
            </div>
            <div className="filter-chips p-1 bg-black/5 dark:bg-white/5 rounded-full overflow-x-auto whitespace-nowrap">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`chip border-none px-6 ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 animate-fadeUp">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className={`card animate-pulse bg-gray-100 dark:bg-white/5 ${i === 0 ? 'lg:col-span-8 h-[500px]' : 'lg:col-span-4 h-[500px]'}`} />
              ))
            ) : filteredStudios.map((studio, i) => (
              <div key={studio.id} className={`${i % 3 === 0 ? 'lg:col-span-12' : 'lg:col-span-6'} xl:${i === 0 ? 'lg:col-span-8' : 'lg:col-span-4'}`}>
                <StudioCard 
                  id={studio.id}
                  name={studio.name}
                  location={studio.location}
                  price={studio.price_per_hour}
                  rating={studio.rating}
                  imageUrl={studio.image_url}
                  category={studio.category}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique "Slider" Features Section */}
      <section className="section-lg text-white overflow-hidden relative" style={{ backgroundColor: 'var(--paon)' }}>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-lemon/5 -skew-x-12 transform translate-x-1/2" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="t-headline text-lemon mb-8">Architectural Control.</h2>
              <div className="space-y-12">
                {[
                  { title: "Precision Discovery", desc: "Browse a curated network of elite studios with verified gear lists and acoustic specs.", icon: "01" },
                  { title: "Governance Layer", desc: "Manage sessions, slots, and secure payments through our architectural framework.", icon: "02" },
                  { title: "Production Alpha", desc: "Unlock world-class output with seamless workflow and professional engineering support.", icon: "03" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="text-4xl font-black text-lemon/20 flex-shrink-0 group-hover:text-lemon transition-colors">{item.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="text-white/60 text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 rounded-3xl bg-white/10 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover grayscale brightness-50" alt="Mixing board" />
                </div>
                <div className="h-40 rounded-3xl bg-lemon flex items-center justify-center p-8 text-paon font-black text-3xl leading-none">
                  99% PRECISION
                </div>
              </div>
              <div className="pt-12 space-y-4">
                 <div className="h-48 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Waveform className="w-full h-full p-12 text-lemon" />
                 </div>
                 <div className="h-64 rounded-3xl bg-paon-light overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale" alt="Studio Gear" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
