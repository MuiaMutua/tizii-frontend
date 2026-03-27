import { useState, useEffect } from "react";
import { studiosApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudioCard from "@/components/StudioCard";

// Inline Icons
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const BookingsSearch = () => {
  const [studios, setStudios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState("All");
  const [priceRange, setPriceRange] = useState(10000);

  useEffect(() => {
    studiosApi.getAll().then(res => {
      setStudios(res.data?.studios || []);
    }).finally(() => setIsLoading(false));
  }, []);

  const genres = ["All", "Hip-Hop", "Rock", "Electronic", "Acoustic", "Voiceover"];

  const filteredStudios = activeGenre === "All" 
    ? studios 
    : studios.filter(s => s.category?.includes(activeGenre));

  return (
    <div className="flex-col" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      
      <main className="container section flex gap-12 items-start">
        {/* Sidebar Filters */}
        <aside className="w-64 flex-col gap-8 sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <h3 className="t-title flex items-center gap-2">
              <FilterIcon />
              FILTERS
            </h3>
            <button className="t-label text-paon underline cursor-pointer" onClick={() => {setActiveGenre("All"); setPriceRange(10000);}}>RESET</button>
          </div>

          <div className="flex-col gap-4">
            <p className="t-label text-muted">GENRE ARCHITECTURE</p>
            <div className="flex-col gap-2">
              {genres.map(g => (
                <label key={g} className="flex gap-3 items-center cursor-pointer t-body" style={{ fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={activeGenre === g} 
                    onChange={() => setActiveGenre(g)} 
                    className="checkbox"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <div className="divider" />

          <div className="flex-col gap-4">
            <p className="t-label text-muted">PRICE HOURLY (MAX)</p>
            <input 
              type="range" 
              min="1000" 
              max="15000" 
              step="500" 
              value={priceRange} 
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="range"
            />
            <div className="flex justify-between t-label text-muted">
              <span>KES 1K</span>
              <span className="text-paon">KES {(priceRange/1000).toFixed(1)}K</span>
            </div>
          </div>

          <div className="divider" />

          <div className="flex-col gap-4">
            <p className="t-label text-muted">ACOUSTIC SPEC</p>
            {["SSL CONSOLE", "NEUMANN MICS", "VOCAL BOOTH", "LIVE ROOM"].map(feat => (
              <label key={feat} className="flex gap-3 items-center cursor-pointer t-body" style={{ fontSize: '0.9rem' }}>
                <input type="checkbox" className="checkbox" />
                {feat}
              </label>
            ))}
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          <header className="flex justify-between items-center mb-8">
            <h2 className="t-headline" style={{ fontSize: '1.75rem' }}>{filteredStudios.length} Studios Found</h2>
            <div className="flex gap-4">
              <div className="btn btn-outline btn-sm">SORT: RELEVANCE</div>
            </div>
          </header>

          <div className="grid-2 animate-fadeUp">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="card animate-pulse" style={{ height: 350 }} />
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
          
          {!isLoading && filteredStudios.length === 0 && (
            <div className="section-lg text-center flex-col items-center gap-4">
               <p className="t-body text-muted">No studios match your architectural requirements.</p>
               <button className="btn btn-paon" onClick={() => setActiveGenre("All")}>CLEAR FILTERS</button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingsSearch;
