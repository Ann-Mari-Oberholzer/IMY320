import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useUser } from "../contexts/UserContext";
import { FaTrash, FaShoppingCart, FaHeart, FaGamepad, FaStore } from "react-icons/fa";
import apiServiceInstance from "../services/api";
import favoritesService from "../services/FavouritesService";
import { useNavigate } from "react-router-dom";

import {
  containerStyle,
  contentStyle,
  productGridStyle,
  productCardStyle,
  productImageStyle,
  productImageContainerStyle,
  productInfoStyle,
  productNameStyle,
  productDescriptionStyle,
  priceStyle,
  removeButtonStyle,
  addToCartButtonStyle,
  buttonContainerStyle,
  headerStyle,
  titleStyle,
  subtitleStyle,
  emptyStateStyle,
  emptyStateIconStyle,
  emptyStateTitleStyle,
  emptyStateTextStyle,
  browseButtonStyle,
} from "./favourite.js";

function Favourites() {
  const { user } = useUser();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add bounce animation styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user]);

  const navigate = useNavigate();
  
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
    if (price === null || price === undefined || isNaN(price)) return 'Price not available';
    return `$${price.toFixed(2)}`;
  };

  if (!user) {
    return (
      <div style={containerStyle}>
        <NavBar currentPage="favourites" user={user} />
        <div style={contentStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>My Wishlist</h1>
            <p style={subtitleStyle}>Your favorite games and accessories</p>
          </div>
          <div style={emptyStateStyle}>
            <FaHeart style={emptyStateIconStyle} />
            <h2 style={emptyStateTitleStyle}>Please Log In</h2>
            <p style={emptyStateTextStyle}>
              You need to be logged in to view your wishlist.
            </p>
            <button
              style={browseButtonStyle}
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <NavBar currentPage="favourites" user={user} />
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(248, 249, 250, 0.95)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <FaGamepad style={{ fontSize: '3rem', color: '#00AEBB', animation: 'bounce 1s infinite' }} />
            <FaGamepad style={{ fontSize: '3rem', color: '#F7CA66', animation: 'bounce 1s infinite 0.2s' }} />
            <FaGamepad style={{ fontSize: '3rem', color: '#00AEBB', animation: 'bounce 1s infinite 0.4s' }} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <NavBar currentPage="favourites" user={user} />
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>My Wishlist</h1>
          <p style={subtitleStyle}>Your favorite games and accessories</p>
        </div>

        {favourites.length === 0 ? (
          <div style={emptyStateStyle}>
            <FaHeart style={emptyStateIconStyle} />
            <h2 style={emptyStateTitleStyle}>Your Wishlist is Empty</h2>
            <p style={emptyStateTextStyle}>
              You haven't added any products to your wishlist yet.
            </p>
            <p style={emptyStateTextStyle}>
              Browse our catalogue and click the heart icon to save items for later!
            </p>
            <button
              style={browseButtonStyle}
              onClick={() => navigate('/catalogue')}
            >
              <FaStore />
              Browse Catalogue
            </button>
          </div>
        ) : (
          <div style={productGridStyle}>
            {favourites.filter(product => product && product.id).map((product) => (
              <div
                key={product.id}
                style={productCardStyle}
                className="wishlist-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div
                  style={productImageContainerStyle}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.name || 'Product'}
                    style={productImageStyle}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>

                <div style={productInfoStyle}>
                  <h3
                    style={productNameStyle}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name || 'Unnamed Product'}
                  </h3>

                  {product.description && (
                    <p style={productDescriptionStyle}>{product.description}</p>
                  )}

                  <div style={priceStyle}>{formatPrice(product.price)}</div>

                  {/* Buttons */}
                  <div style={buttonContainerStyle}>
                    <button
                      style={{
                        ...addToCartButtonStyle,
                        backgroundColor: product.inStock !== false ? '#F7CA66' : '#ccc',
                        cursor: product.inStock !== false ? 'pointer' : 'not-allowed'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.inStock === false}
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>

                    <button
                      style={removeButtonStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavourites(product.id);
                      }}
                      title="Remove from wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
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