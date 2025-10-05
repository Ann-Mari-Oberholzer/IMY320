import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";
import { FaTrash, FaShoppingCart, FaGamepad, FaCheck } from "react-icons/fa";
import favoritesService from "../services/FavouritesService";
import { useNavigate } from "react-router-dom";

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
} from "./favourite.js";

const addToCartButtonStyle = {
  backgroundColor: "#00AEBB",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "8px 12px",
  cursor: "pointer",
  marginTop: "10px",
  marginRight: "10px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "14px",
  transition: "all 0.3s ease",
  ':hover': {
    backgroundColor: "#028f9a",
    transform: "scale(1.05)",
  },
};

const removeFromCartButtonStyle = {
  backgroundColor: "#27ae60",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "8px 12px",
  cursor: "pointer",
  marginTop: "10px",
  marginRight: "10px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "14px",
  transition: "all 0.3s ease",
  ':hover': {
    backgroundColor: "#1e8449",
    transform: "scale(1.05)",
  },
};

const priceStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#00AEBB",
  margin: "10px 0",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
};

function Favourites() {
  const { user } = useUser();
  const { addToCart, removeFromCart, cart } = useCart();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState({});
  const navigate = useNavigate();

  // Sync addedToCart with cart context
  useEffect(() => {
    if (cart) {
      const cartState = {};
      console.log("Cart contents:", cart); // Debug: Log cart contents
      cart.forEach(item => {
        cartState[item.id] = true;
      });
      setAddedToCart(cartState);
      console.log("Updated addedToCart:", cartState); // Debug: Log addedToCart state
    }
  }, [cart]);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = () => {
    try {
      const userFavorites = favoritesService.getFavorites(user.id);
      console.log("Loaded favorites:", userFavorites); // Debug: Log favorites
      setFavourites(userFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
      alert("Failed to load favorites: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavourites = (productId) => {
    if (!user?.id) return;

    try {
      console.log("Removing from favorites:", productId); // Debug: Log removal
      favoritesService.removeFromFavorites(user.id, productId);
      setFavourites(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
      alert("Failed to remove item from favorites: " + error.message);
    }
  };

  const handleAddToCart = async (product) => {
    console.log("Add to cart clicked for product:", product); // Debug: Log product
    if (!user?.id) {
      alert("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    try {
      const productData = {
        id: product.id,
        name: product.name,
        description: product.description || "No description available",
        image: product.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop",
        price: product.price,
        originalPrice: product.originalPrice,
        tags: product.tags || [],
        hasDiscount: product.hasDiscount,
      };
      console.log("Adding to cart:", productData); // Debug: Log productData
      const success = await addToCart(productData, 1);
      if (success) {
        setAddedToCart(prev => ({ ...prev, [product.id]: true }));
        removeFromFavourites(product.id); // Remove from wishlist
      } else {
        throw new Error("addToCart returned false");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(`Failed to add ${product.name} to cart: ${error.message}`);
    }
  };

  const handleRemoveFromCart = (productId) => {
    console.log("Remove from cart clicked for productId:", productId); // Debug: Log productId
    try {
      removeFromCart(productId);
      setAddedToCart(prev => ({ ...prev, [productId]: false }));
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("Failed to remove item from cart: " + error.message);
    }
  };

  const formatPrice = (price) => {
    if (typeof price === "string") return price;
    if (price === null || price === undefined || isNaN(price)) return "Price not available";
    return `$${price.toFixed(2)}`;
  };

  if (!user) {
    return (
      <div style={containerStyle}>
        <NavBar currentPage="favourites" user={user} />
        <div style={headerStyle}>
          <h1 style={titleStyle}>Favourites</h1>
        </div>
        <div style={contentStyle}>
          <p>Please log in to view your favorites.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <NavBar currentPage="favourites" user={user} />
        <div style={headerStyle}>
          <h1 style={titleStyle}>Favourites</h1>
        </div>
        <div style={contentStyle}>
          <p>Loading your favorites...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <NavBar currentPage="favourites" user={user} />
      <div style={headerStyle}>
        <h1 style={titleStyle}>My Wishlist</h1>
      </div>
      <div style={contentStyle}>
        {favourites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "18px", color: "#666" }}>
              You haven't added any products to your favorites yet.
            </p>
            <p style={{ color: "#999" }}>
              Browse our products and click the heart icon to add items to your favorites!
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#00AEBB",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.75rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => navigate("/catalogue")}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#028f9a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00AEBB")}
              >
                <FaGamepad /> Browse Games
              </button>
            </div>
          </div>
        ) : (
          <div style={productGridStyle}>
            {favourites.filter(product => product && product.id).map((product) => (
              <div
                key={product.id}
                style={productCardStyle}
                onClick={() => navigate(`/product/${product.id}`)}
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
                  src={product.image || "/images/placeholder.jpg"}
                  alt={product.name || "Product"}
                  style={productImageStyle}
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
                <div style={productNameStyle}>{product.name || "Unnamed Product"}</div>
                <div style={priceStyle}>{formatPrice(product.price)}</div>

                <div style={buttonContainerStyle}>
                  <button
                    style={addedToCart[product.id] ? removeFromCartButtonStyle : addToCartButtonStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Cart button clicked for product:", product.id); // Debug: Log button click
                      if (addedToCart[product.id]) {
                        handleRemoveFromCart(product.id);
                      } else {
                        handleAddToCart(product);
                      }
                    }}
                    // disabled={!product.inStock} // Commented out to ensure button is clickable
                  >
                    {addedToCart[product.id] ? (
                      <>
                        <FaCheck style={{ marginRight: "0.5rem" }} />
                        Remove from Cart
                      </>
                    ) : (
                      <>
                        <FaShoppingCart style={{ marginRight: "0.5rem" }} />
                        Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    style={removeButtonStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Remove from wishlist clicked for product:", product.id); // Debug: Log wishlist removal
                      removeFromFavourites(product.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export { favoritesService };
export default Favourites;