import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';

// Inline SVG Icons
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

interface NavbarProps {
  variant?: 'default' | 'transparent';
}

const Navbar = ({ variant = 'default' }: NavbarProps) => {
  const { isDark, toggle } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Studios', path: '/bookings' },
    { label: 'Artists', path: '#artists' },
    { label: 'Explore', path: '/home' },
  ];

  return (
    <nav
      className="navbar"
      style={variant === 'transparent' ? {
        background: 'transparent',
        borderBottom: 'none',
        position: 'absolute',
        width: '100%',
        zIndex: 100,
      } : undefined}
    >
      {/* Logo */}
      <Link to="/home" className="navbar-logo">Tizii</Link>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden p-2 text-paon dark:text-lemon"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <MenuIcon />
      </button>

      {/* Center Nav Links */}
      <div className={`navbar-links ${mobileOpen ? 'mobile-show' : ''}`}>
        {navLinks.map(link => (
          <button
            key={link.label}
            className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => {
              navigate(link.path);
              setMobileOpen(false);
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className={`navbar-actions ${mobileOpen ? 'mobile-show' : ''}`}>
        <button className="dark-toggle" onClick={toggle} aria-label="Toggle dark mode">
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="hidden md:flex dark-toggle" aria-label="Notifications">
          <BellIcon />
        </button>
        <button
          className="hidden sm:flex btn btn-outline btn-sm"
          onClick={() => navigate('/auth')}
        >
          Sign in
        </button>
        <button
          className="btn btn-paon btn-sm"
          onClick={() => {
            navigate('/auth');
            setMobileOpen(false);
          }}
        >
          List Studio
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
