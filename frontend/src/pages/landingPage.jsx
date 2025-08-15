import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SiHeadphonezone, SiPlaystation} from "react-icons/si"; 
import { FaXbox } from 'react-icons/fa';
import NavBar from '../components/NavBar'; // Import the new NavBar component
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';
import {
  page,
  section,
  sectionTitle,
  productGrid,
  productTitle,
  productDescription,
  productImage,
  heroSection,
  heroLeft,
  heroRight,
  gradientHeading,
  heroText,
  pastelHeading,
  pastelText,
  darkSection,
} from "./landingStyles";

import "./landingStyles.css";

// QUICKSET: always use your backend port directly
const API_BASE = "http://localhost:4000";

function LandingPage() {
  const navigate = useNavigate();

  // User state - now managed through UserContext
  const { user, logout } = useUser();

  // ---- Featured Games state ----
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Build the URL to your backend: newest games, small payload
  const gamesUrl = useMemo(() => {
    const params = new URLSearchParams({
      limit: "6",
      sort: "original_release_date:desc",
      field_list: "id,name,deck,image,site_detail_url",
    });
    return `${API_BASE}/api/games?${params.toString()}`;
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(gamesUrl);

        // Helpful check if the proxy/URL is wrong and HTML is returned
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const text = await res.text();
          throw new Error(
            `Expected JSON, got ${ct}. First chars: ${text.slice(0, 60)}`
          );
        }

        if (!res.ok) throw new Error(`Backend error ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setGames(Array.isArray(data?.results) ? data.results : []);
      } catch (e) {
        setErr(e.message || "Failed to load games");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [gamesUrl]);

  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = React.useState(null);

  const handleLogout = () => {
    logout();
    // Add any additional logout logic here (clear tokens, etc.)
    console.log("User logged out");
  };

  const getCardStyle = (index) => ({
    backgroundColor: hoveredIndex === index ? "#00AEBB" : "#ffffff",
    color: hoveredIndex === index ? "#ffffff" : "#1E232C",
    borderRadius: "20px",
    padding: "1.5rem",
    width: "280px",
    cursor: "pointer",
    boxShadow:
      hoveredIndex === index
        ? "0 15px 30px rgba(0,0,0,0.1)"
        : "0 5px 15px rgba(0,0,0,0.05)",
    transform: hoveredIndex === index ? "translateY(-10px)" : "none",
    transition: "all 0.3s ease"
  });

  const getCategoryCardStyle = (index) => ({
    backgroundColor: hoveredCategoryIndex === index ? "#00AEBB" : "#ffffff",
    color: hoveredCategoryIndex === index ? "#ffffff" : "#1E232C",
    borderRadius: "20px",
    padding: "1.5rem",
    width: "280px",
    cursor: "pointer",
    boxShadow:
      hoveredCategoryIndex === index
        ? "0 15px 30px rgba(0,0,0,0.1)"
        : "0 5px 15px rgba(0,0,0,0.05)",
    transform: hoveredCategoryIndex === index ? "translateY(-10px)" : "none",
    transition: "all 0.3s ease",
    textAlign: "center"
  });

  const getPastelIconStyle = (index) => ({
    fontSize: "2.5rem",
    color: hoveredCategoryIndex === index ? "#ffffff" : "#00AEBB",
    marginBottom: "1rem",
    transition: "color 0.3s ease"
  });

  const getCategoryTextStyle = (index, isHeading = false) => ({
    ...(isHeading ? pastelHeading : pastelText),
    color: hoveredCategoryIndex === index ? "#000000" : (isHeading ? pastelHeading.color : pastelText.color)
  });

  return (
    <div style={page} className="landing-page-container">
      {/* NAVIGATION - Replace the old nav with the new NavBar component */}
      <NavBar 
        currentPage="home" 
        user={user} 
        onLogout={handleLogout}
      />

      {/* HERO SECTION */}
      <section style={heroSection}>
        <div style={heroLeft}>
          <h1 style={gradientHeading}>Create. Play. Repeat.</h1>
          <p style={heroText}>Jump into a world where every player is a creator.</p>
          <button className="cta-button" onClick={() => navigate("/register")}>
            Start Your Journey
          </button>
        </div>
        <div style={heroRight}>
          <img src="/Best_Video.png" alt="Game Visual" style={{
      width: "110%",
      height: "100%",
      objectFit: "cover"
    }}  />
        </div>
      </section>

      {/* FEATURED GAMES (live from backend) */}
      <section style={darkSection}>
        <h2 style={sectionTitle}>Featured Games</h2>

        {loading && (
          <div style={{ marginTop: "1rem", opacity: 0.9 }}>Loading…</div>
        )}

        {err && (
          <div style={{ marginTop: "1rem", color: "#ffb3b3" }}>
            {err}. Check that your backend is running at {API_BASE}.
          </div>
        )}

        {!loading && !err && (
          <div style={productGrid}>
            {games.map((g, index) => (
              <a
                key={g.id}
                href={g.site_detail_url}
                target="_blank"
                rel="noopener noreferrer"
                style={getCardStyle(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={g.image?.original || g.image?.square_small || "/controllers.jpg"}
                  alt={g.name}
                  style={productImage}
                />
                <h3 style={productTitle}>{g.name}</h3>
                <p style={productDescription}>
                  {g.deck || "No description provided."}
                </p>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* CATEGORIES SECTION */}
      <section style={section}>
        <h2 style={sectionTitle}>Our Categories</h2>
        <div style={productGrid}>
          {[
            {
              icon: (index) => <SiPlaystation style={getPastelIconStyle(index)} />,
              title: "Consoles",
              text: "From PS5 to Nintendo—find your power system."
            },
            {
              icon: (index) => <FaXbox style={getPastelIconStyle(index)} />,
              title: "Accessories",
              text: "High-performance gear built for serious play."
            },
            {
              icon: (index) => <SiHeadphonezone style={getPastelIconStyle(index)} />,
              title: "Tech Reviews",
              text: "Honest, in-depth looks at what's worth your coins."
            }
          ].map((item, index) => (
            <div
              key={index}
              style={getCategoryCardStyle(index)}
              onMouseEnter={() => setHoveredCategoryIndex(index)}
              onMouseLeave={() => setHoveredCategoryIndex(null)}
            >
              {item.icon(index)}
              <h3 style={getCategoryTextStyle(index, true)}>{item.title}</h3>
              <p style={getCategoryTextStyle(index)}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;