import { useNavigate, Link } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: "#F2F2F2" }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: "#FF3D1F", textTransform: "uppercase", marginBottom: 16 }}>404 // PAGE NOT FOUND</p>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(80px, 15vw, 160px)", lineHeight: 0.9, color: "#fff", margin: "0 0 24px", letterSpacing: 4 }}>
        ERROR.
      </h1>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, marginBottom: 40 }}>The page you're looking for doesn't exist.</p>
      <Link to="/home" style={{ background: "#FF3D1F", color: "#fff", textDecoration: "none", padding: "14px 32px", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, textTransform: "uppercase" }}>
        GO HOME
      </Link>
    </div>
  );
};

export default NotFound;
