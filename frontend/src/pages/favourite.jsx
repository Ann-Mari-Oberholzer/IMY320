import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useUser } from "../contexts/UserContext";
import { FaTrash } from "react-icons/fa";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

const contentStyle = {
  flex: 1,
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const productGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  maxWidth: "1000px",
  width: "100%",
  margin: "0 auto",
};

const productCardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  textAlign: "center",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
};

const productImageStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "6px",
};

const productNameStyle = {
  fontWeight: "bold",
  margin: "0.5rem 0",
};

const removeButtonStyle = {
  marginTop: "0.5rem",
  padding: "0.3rem 0.6rem",
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const headerStyle = {
  textAlign: "center",
};

const titleStyle = {
  fontSize: "3.5rem",
  fontWeight: "800",
  background: "linear-gradient(90deg, #00AEBB, #F7CA66)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "1.5rem",
  lineHeight: "1.2",
};

function Favourites() {
  const { user } = useUser();

  const [favourites, setFavourites] = useState([
    { id: 1, name: "Game One", image: "/images/game1.jpg", price: "$49.99" },
    { id: 2, name: "Game Two", image: "/images/game2.jpg", price: "$39.99" },
    { id: 3, name: "Game Three", image: "/images/game3.jpg", price: "$59.99" },
  ]);

  const removeFromFavourites = (id) => {
    setFavourites((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <div style={containerStyle}>
      <NavBar currentPage="favourites" user={user} />
      <div style={headerStyle}>
        <h1 style={titleStyle}>Favourites</h1>
      </div>
      <div style={contentStyle}>
        {favourites.length === 0 ? (
          <p>You have no favourite products yet.</p>
        ) : (
          <div style={productGridStyle}>
            {favourites.map((product) => (
              <div
                key={product.id}
                style={productCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 174, 187, 0.3)";
                  e.currentTarget.style.borderColor = "#00AEBB";
                }}
                
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#ccc";
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={productImageStyle}
                />
                <div style={productNameStyle}>{product.name}</div>
                <div>{product.price}</div>
                <button
                  style={removeButtonStyle}
                  onClick={() => removeFromFavourites(product.id)}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Favourites;