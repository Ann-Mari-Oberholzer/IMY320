import React from "react";
import { useNavigate } from "react-router-dom";
import {
  page,
  navBar,
  navItem,
  headerSection,
  heading,
  subheading,
  section,
  classCard,
  cardTitle,
  cardDescription,
  footer,
  logo,
  navRight,
  joinButton,
  section2,
  sectionTitle,
  productGrid,
  cardBase,
  mainCard,
  productTitle,
  productDescription,
  productImage,
} from "./landingStyles";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={page}>
      {/* NAVIGATION */}
      <nav style={navBar}>
        <img src="/GameCraft3-1.png" alt="Game Craft Logo" style={logo} />
        <div style={navRight}>
          <span style={navItem}>Home</span>
          <span style={navItem}>Store</span>
          <span style={navItem} onClick={() => navigate("/about")}>About</span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={headerSection}>
        <h1 style={heading}>Welcome to Game Craft</h1>
        <p style={subheading}>Your One-Stop Hub for Games, Gear, and Glory.</p>
        <button style={joinButton} onClick={() => navigate("/register")}>
          Join Us
        </button>
      </section>

      {/* IMAGES / CARDS */}
        <section style={section2}>
            <h2 style={sectionTitle}>Featured Products</h2>
            <div style={productGrid}>
                <div style={cardBase}>
                <img src="/headphones.jpg" style={productImage} />
                <h3 style={productTitle}>Surround Sound Headphones</h3>
                <p style={productDescription}>Feel the game with immersive sound and deep bass clarity.</p>
                </div>

                <div style={mainCard}>
                <img src="/nintendo.jpg" style={productImage} />
                <h3 style={productTitle}>Nintendo Switch</h3>
                <p style={productDescription}>Switch between handheld and docked mode for non-stop fun.</p>
                </div>

                <div style={cardBase}>
                <img src="/controllers.jpg" style={productImage} />
                <h3 style={productTitle}>Pro Gaming Controllers</h3>
                <p style={productDescription}>Ergonomic design with ultra-responsive analog sticks.</p>
                </div>
        </div>
    </section>


      
      {/* CLASSES SECTION */}
      <section style={section}>
        <h2 style={{color:"222831"}}>Our Categories</h2>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "1rem" }}>
          <div style={classCard}>
            <h3 style={cardTitle}>Consoles</h3>
            <p style={cardDescription}>From PS5 to Nintendo—find your power system.</p>
          </div>
          <div style={classCard}>
            <h3 style={cardTitle}>Accessories</h3>
            <p style={cardDescription}>High-performance gear built for serious play.</p>
          </div>
          <div style={classCard}>
            <h3 style={cardTitle}>Tech Reviews</h3>
            <p style={cardDescription}>Honest, in-depth looks at what’s worth your coins.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={footer}>
        <p>KEEP PLAYING UNTIL YOU FIND YOUR STYLE</p>
        <p>© GameCraft {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default LandingPage;

