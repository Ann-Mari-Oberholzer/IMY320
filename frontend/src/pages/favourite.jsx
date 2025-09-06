import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useUser } from "../contexts/UserContext";
import { FaTrash } from "react-icons/fa";

import {
  containerStyle,
  contentStyle,
  productGridStyle,
  productCardStyle,
  productImageStyle,
  productNameStyle,
  removeButtonStyle,
  headerStyle,
  titleStyle,
} from "./favourite.js"

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