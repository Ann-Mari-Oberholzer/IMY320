import React from "react";
import { useNavigate } from "react-router-dom";
import { SiHeadphonezone, SiHeadspace, SiNintendo, SiPlaystation} from "react-icons/si"; 
import { FaXbox,FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import {
  page,
  navBar,
  logo,
  navRight,
  heroSection,
  heroLeft,
  heroRight,
  gradientHeading,
  heroText,
  productGrid,
  cardBase,
  mainCard,
  productImage,
  productTitle,
  productTitle2,
  productDescription,
  productDescription2,
  pastelCard,
  pastelIcon,
  pastelHeading,
  pastelText,
  darkSection,
  section,
  sectionTitle,
} from "./landingStyles";

import "./landingStyles.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={page}>
      {/* NAVIGATION */}
      <nav style={navBar}>
        <img src="/GameCraft3-1.png" alt="Game Craft Logo" style={logo} />
        <div style={navRight}>
          <span className="nav-item">Home</span>
          <span className="nav-item" onClick={() => navigate("/about")}>About</span>
          <span className="nav-item" onClick={() => navigate("/login")}>Sign Up</span>
        </div>
      </nav>

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

      {/* FEATURED PRODUCTS */}
      <section style={darkSection}>
        <h2 style={sectionTitle}>Featured Products</h2>
        <div style={productGrid}>
          <div className="card-base" style={cardBase}>
            <img src="/headphones.jpg" style={productImage} alt="Headphones" />
            <h3 style={productTitle}>Surround Sound Headphones</h3>
            <p style={productDescription}>Feel the game with immersive sound and deep bass clarity.</p>
          </div>

          <div className="main-card" style={mainCard}>
            <img src="/nintendo.jpg" style={productImage} alt="Nintendo Switch" />
            <h3 style={productTitle2}>Nintendo Switch</h3>
            <p style={productDescription2}>Switch between handheld and docked mode for non-stop fun.</p>
          </div>

          <div className="card-base" style={cardBase}>
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
          <div className="pastel-card" style={pastelCard}>
            <SiPlaystation style={pastelIcon} />
            <h3 style={pastelHeading}>Consoles</h3>
            <p style={pastelText}>From PS5 to Nintendo—find your power system.</p>
          </div>
          <div className="pastel-card" style={pastelCard}>
            <FaXbox style={pastelIcon} />
            <h3 style={pastelHeading}>Accessories</h3>
            <p style={pastelText}>High-performance gear built for serious play.</p>
          </div>
          <div className="pastel-card" style={pastelCard}>
            <SiHeadphonezone style={pastelIcon} />
            <h3 style={pastelHeading}>Tech Reviews</h3>
            <p style={pastelText}>Honest, in-depth looks at what's worth your coins.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
      <div className="footer-container">

        {/* Brand / Logo */}
        <div className="footer-brand">
          <img src="/GameCraft3-1.png" alt="GameCraft Logo" className="footer-logo" />
          <p className="brand-tagline">Play. Create. Connect.</p>
        </div>

        {/* Navigation */}
        <div className="footer-nav">
          <a href="#home" className="footer-link">Home</a>
          <a href="#about" className="footer-link">About</a>
          <a href="#services" className="footer-link">Services</a>
          <a href="#contact" className="footer-link">Contact</a>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
<p>KEEP PLAYING UNTIL YOU FIND YOUR STYLE</p> <p>© GameCraft {new Date().getFullYear()}</p>      </div>
    </footer>
    </div>
  );
}

export default LandingPage;