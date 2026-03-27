import { Link, useLocation } from "react-router-dom";

// Inline Icons
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

interface SidebarNavProps {
  type: "artist" | "manager" | "owner";
}

const SidebarNav = ({ type }: SidebarNavProps) => {
  const location = useLocation();

  const commonItems = [
    { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  const roleItems = {
    artist: [
      { label: "Feed", path: "/home", icon: <HomeIcon /> },
      { label: "My Sessions", path: "/artist/dashboard", icon: <CalendarIcon /> },
      { label: "Profile", path: "/profile", icon: <UserIcon /> },
    ],
    manager: [
      { label: "Insights", path: "/studio-manager/dashboard", icon: <HomeIcon /> },
      { label: "All Bookings", path: "/bookings", icon: <CalendarIcon /> },
    ],
    owner: [
      { label: "Governance", path: "/studio-owner/dashboard", icon: <HomeIcon /> },
      { label: "My Studios", path: "/owner/studios", icon: <CalendarIcon /> },
    ],
  };

  const navItems = [...roleItems[type], ...commonItems];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <h1>Tizii</h1>
          <p>{type === "artist" ? "Artist Portal" : type === "manager" ? "Manager Studio" : "Studio Governance"}</p>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item" style={{ marginTop: "auto" }}>
          <LogOutIcon />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default SidebarNav;
