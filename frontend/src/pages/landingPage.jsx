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
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  
  // New state for processed featured games
  const [featuredGames, setFeaturedGames] = useState([]);
  
  // Interactive state for buttons
  const [wishlist, setWishlist] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});

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
        
        const rawGames = Array.isArray(data?.results) ? data.results : [];
        
        // Process games once with ratings and sort by highest rating
        const processedGames = rawGames
          .map(g => ({
            ...g,
            rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0-5.0
            hasDiscount: Math.random() > 0.5,
            originalPrice: Math.random() > 0.5 ? (Math.random() * 40 + 20).toFixed(2) : null,
            currentPrice: (Math.random() * 30 + 15).toFixed(2),
            reviewsCount: Math.floor(Math.random() * 500) + 50
          }))
          .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)) // Sort by highest rating
          .slice(0, 3); // Take top 3
        
        setFeaturedGames(processedGames);
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

  // Interactive functions for featured games
  const toggleWishlist = (gameId) => {
    setWishlist(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleAddToCart = (gameId) => {
    setAddedToCart(prev => ({ ...prev, [gameId]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [gameId]: false }));
    }, 3000);
    console.log(`Added game ${gameId} to cart`);
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
          <img src="/Best_Video.png" alt="Game Visual"/>
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
            {featuredGames
              .map((g, index) => (
                <div
                  key={g.id}
                  style={getCardStyle(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <img
                    src={g.image?.original || g.image?.square_small || "/controllers.jpg"}
                    alt={g.name}
                    style={productImage}
                  />
                  
                  <div style={{
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem"
                  }}>
                    <h3 style={{ 
                      ...productTitle, 
                      color: hoveredIndex === index ? "#fff" : "#1E232C",
                      fontSize: "1.2rem",
                      marginBottom: "0.5rem"
                    }}>
                      {g.name}
                    </h3>

                    {/* Rating */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem"
                    }}>
                      <span style={{
                        color: hoveredIndex === index ? "#F7CA66" : "#F7CA66",
                        fontSize: "1rem"
                      }}>★</span>
                      <span style={{
                        fontWeight: "600",
                        color: hoveredIndex === index ? "#fff" : "#1E232C"
                      }}>
                        {g.rating}
                      </span>
                      <span style={{
                        color: hoveredIndex === index ? "#fff" : "#666",
                        fontSize: "0.8rem"
                      }}>
                        ({g.reviewsCount} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem"
                    }}>
                      {g.hasDiscount && (
                        <span style={{
                          textDecoration: "line-through",
                          color: hoveredIndex === index ? "#ccc" : "#999",
                          fontSize: "0.9rem"
                        }}>
                          ${g.originalPrice}
                        </span>
                      )}
                      <span style={{
                        fontSize: "1.3rem",
                        fontWeight: "700",
                        color: hoveredIndex === index ? "#F7CA66" : "#00AEBB"
                      }}>
                        ${g.currentPrice}
                      </span>
                    </div>

                    {/* Action Buttons - Using catalogue page styles */}
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      alignItems: "stretch"
                    }}>
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(g.id);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0.5rem 1rem",
                          backgroundColor: wishlist.includes(g.id) ? '#e74c3c' : (hoveredIndex === index ? '#fff' : '#fff'),
                          color: wishlist.includes(g.id) ? '#fff' : (hoveredIndex === index ? '#00AEBB' : '#666'),
                          border: `2px solid ${wishlist.includes(g.id) ? '#e74c3c' : (hoveredIndex === index ? '#fff' : '#ddd')}`,
                          borderRadius: "0.5rem",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          width: "100%"
                        }}
                        title={wishlist.includes(g.id) ? "Remove from wishlist" : "Add to wishlist"}
                        onMouseEnter={(e) => {
                          if (hoveredIndex === index && !wishlist.includes(g.id)) {
                            e.target.style.backgroundColor = '#f0f0f0';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (hoveredIndex === index && !wishlist.includes(g.id)) {
                            e.target.style.backgroundColor = '#fff';
                          }
                        }}
                      >
                        ♥ {wishlist.includes(g.id) ? 'In Wishlist' : 'Add to Wishlist'}
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(g.id);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0.5rem 1rem",
                          backgroundColor: addedToCart[g.id] ? '#27ae60' : '#F7CA66',
                          color: '#fff',
                          border: 'none',
                          borderRadius: "0.5rem",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          width: "100%"
                        }}
                        disabled={addedToCart[g.id]}
                        onMouseEnter={(e) => {
                          if (!addedToCart[g.id]) {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 12px rgba(247, 202, 102, 0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!addedToCart[g.id]) {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                      >
                        {addedToCart[g.id] ? (
                          <>
                            ✓ Added to cart
                          </>
                        ) : (
                          <>
                            🛒 Add to Cart
                          </>
                        )}
                      </button> */}
                    </div>
                  </div>
                </div>
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
              title: "New Releases",
              text: "Stay ahead with the hottest new titles across genres."
            },
            {
              icon: (index) => <FaXbox style={getPastelIconStyle(index)} />,
              title: "Top Rated Games",
              text: "Discover community favorites and critically acclaimed hits."
            },
            {
              icon: (index) => <SiHeadphonezone style={getPastelIconStyle(index)} />,
              title: "Game Reviews",
              text: "Honest insights to help you pick your next adventure."
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