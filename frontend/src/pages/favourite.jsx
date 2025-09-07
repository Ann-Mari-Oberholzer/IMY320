import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useUser } from "../contexts/UserContext";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import apiServiceInstance from "../services/api";
import favoritesService from "../services/FavouritesService";

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
  fontSize: "14px"
};

const priceStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#00AEBB",
  margin: "10px 0"
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px"
};

function Favourites() {
  const { user } = useUser();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = () => {
    try {
      const userFavorites = favoritesService.getFavorites(user.id);
      setFavourites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavourites = (productId) => {
    if (!user?.id) return;
    
    try {
      favoritesService.removeFromFavorites(user.id, productId);
      setFavourites(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const addToCart = async (product) => {
    if (!user?.id) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      await apiServiceInstance.addToCartWithProduct(user.id, product, 1);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
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
        <h1 style={titleStyle}>My Favourites</h1>
      </div>
      <div style={contentStyle}>
        {favourites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>
              You haven't added any products to your favorites yet.
            </p>
            <p style={{ color: '#999' }}>
              Browse our products and click the heart icon to add items to your favorites!
            </p>
          </div>
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
                  src={product.image || '/images/placeholder.jpg'}
                  alt={product.name}
                  style={productImageStyle}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
                <div style={productNameStyle}>{product.name}</div>
                <div style={priceStyle}>{formatPrice(product.price)}</div>
                
                {/* Product features */}
                {product.features && product.features.length > 0 && (
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                    {product.features.slice(0, 2).join(' • ')}
                  </div>
                )}
                
                {/* Stock status */}
                <div style={{ 
                  fontSize: '12px', 
                  color: product.inStock ? '#4CAF50' : '#f44336',
                  marginBottom: '10px'
                }}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>

                {/* Buttons */}
                <div style={buttonContainerStyle}>
                  <button
                    style={{
                      ...addToCartButtonStyle,
                      backgroundColor: product.inStock ? '#00AEBB' : '#ccc',
                      cursor: product.inStock ? 'pointer' : 'not-allowed'
                    }}
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    onMouseEnter={(e) => {
                      if (product.inStock) {
                        e.target.style.backgroundColor = '#008A94';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (product.inStock) {
                        e.target.style.backgroundColor = '#00AEBB';
                      }
                    }}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  
                  <button
                    style={removeButtonStyle}
                    onClick={() => removeFromFavourites(product.id)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#d32f2f';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f44336';
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

// Export the favorites service for use in other components
export { favoritesService };
export default Favourites;