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

  const [hoveredIndex, setHoveredIndex] = React.useState(null);

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

  const [hoveredCategoryIndex, setHoveredCategoryIndex] = React.useState(null);

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
          {[
            {
              img: "/headphones.jpg",
              title: "Surround Sound Headphones",
              desc: "Feel the game with immersive sound and deep bass clarity."
            },
            {
              img: "/nintendo.jpg",
              title: "Nintendo Switch",
              desc: "Switch between handheld and docked mode for non-stop fun."
            },
            {
              img: "/controllers.jpg",
              title: "Pro Gaming Controllers",
              desc: "Ergonomic design with ultra-responsive analog sticks."
            }
          ].map((item, index) => (
            <div
              key={index}
              style={getCardStyle(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img src={item.img} style={productImage} alt={item.title} />
              <h3 style={hoveredIndex === index ? productTitle2 : productTitle}>
                {item.title}
              </h3>
              <p style={hoveredIndex === index ? productDescription2 : productDescription}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
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

      {/* FOOTER */}
      <footer style={footer}>
        <p>KEEP PLAYING UNTIL YOU FIND YOUR STYLE</p>
        <p>© GameCraft {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default LandingPage;