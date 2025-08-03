import React from "react";
import { useNavigate } from "react-router-dom";
import { SiHeadphonezone, SiHeadspace, SiNintendo, SiPlaystation} from "react-icons/si";
    import { FaXbox } from 'react-icons/fa';
import {
  page,
  navBar,
  navItem,
  heading,
  subheading,
  section,
  footer,
  logo,
  navRight,
  joinButton,
  sectionTitle,
  productGrid,
  cardBase,
  mainCard,
  productTitle,
  productTitle2,
  productDescription,
  productDescription2,
  productImage,
  heroSection,
  heroLeft,
  heroRight,
  heroMascot,
  gradientHeading,
  heroText,
  ctaButton,
  pastelCard,
  pastelIcon,
  pastelHeading,
  pastelText,
  darkSection,
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
      <section style={heroSection}>
        <div style={heroLeft}>
          {/* <img src="/GameCraftMascot.png" alt="Game Mascot" style={heroMascot} /> */}
          <h1 style={gradientHeading}>Create. Play. Repeat.</h1>
          <p style={heroText}>Jump into a world where every player is a creator.</p>
          <button style={ctaButton} onClick={() => navigate("/register")}>
            Start Your Journey
          </button>
        </div>
        <div style={heroRight}>
          <img src="/Best_Video.png" alt="Game Visual" style={{ width: "100%", maxWidth: "600px", borderRadius: "16px" }} />
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={darkSection}>
        <h2 style={sectionTitle}>Featured Products</h2>
        <div style={productGrid}>
          <div style={cardBase}>
            <img src="/headphones.jpg" style={productImage} alt="Headphones" />
            <h3 style={productTitle}>Surround Sound Headphones</h3>
            <p style={productDescription}>Feel the game with immersive sound and deep bass clarity.</p>
          </div>

          <div style={mainCard}>
            <img src="/nintendo.jpg" style={productImage} alt="Nintendo Switch" />
            <h3 style={productTitle2}>Nintendo Switch</h3>
            <p style={productDescription2}>Switch between handheld and docked mode for non-stop fun.</p>
          </div>

          <div style={cardBase}>
            <img src="/controllers.jpg" style={productImage} alt="Controllers" />
            <h3 style={productTitle}>Pro Gaming Controllers</h3>
            <p style={productDescription}>Ergonomic design with ultra-responsive analog sticks.</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section style={section}>
        <h2 style={sectionTitle}>Our Categories</h2>
        <div style={productGrid}>
          <div style={pastelCard}>
            <SiPlaystation style={pastelIcon} />
            <h3 style={pastelHeading}>Consoles</h3>
            <p style={pastelText}>From PS5 to Nintendo—find your power system.</p>
          </div>
          <div style={pastelCard}>
            <FaXbox style={pastelIcon} />
            <h3 style={pastelHeading}>Accessories</h3>
            <p style={pastelText}>High-performance gear built for serious play.</p>
          </div>
          <div style={pastelCard}>
            <SiHeadphonezone style={pastelIcon} />
            <h3 style={pastelHeading}>Tech Reviews</h3>
            <p style={pastelText}>Honest, in-depth looks at what's worth your coins.</p>
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