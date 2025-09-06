import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft, FaGamepad, FaCheck } from "react-icons/fa";
import NavBar from "../components/NavBar";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";
import { generateRandomPrice, generateRandomRating } from "../utils/gameDataGenerators";
import {
  container,
  big,
  card,
  imageSection,
  bigImage,
  details,
  title,
  price,
  description,
  specs,
  categories,
  button,
  wishlistButton,
  category,
  ratingContainer,
  starStyle,
  ratingStyle,
  bounceAnimation,
  spinAnimation
} from "./productStyles";

// API configuration
const API_BASE = "http://localhost:4000";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [priceInfo, setPriceInfo] = useState(null);
  const [rating, setRating] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Similar products state
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [similarWishlist, setSimilarWishlist] = useState([]);
  const [similarAddedToCart, setSimilarAddedToCart] = useState({});
  const [similarGameDataCache, setSimilarGameDataCache] = useState({});
  const [similarQuantities, setSimilarQuantities] = useState({});

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/games/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();
        
        // Check if we got valid product data
        if (!data || !data.id) {
          throw new Error('Invalid product data received');
        }
        
        setProduct(data);
        
        // Generate price and rating only once when product is loaded
        setPriceInfo(generateRandomPrice(data.id));
        setRating(generateRandomRating(data.id));
        
      } catch (err) {
        setError(err.message || "Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Fetch similar products based on current product's genres or platforms
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!product) return;
      
      setLoadingSimilar(true);
      try {
        let searchFilter = '';
        
        // First try to find by genres
        if (product.genres && product.genres.length > 0) {
          // Use the first genre for filtering
          const genreName = product.genres[0].name;
          searchFilter = genreName;
        } else if (product.platforms && product.platforms.length > 0) {
          // Fallback to platform if no genres
          const platformIds = product.platforms.map(p => p.id).slice(0, 2).join(',');
          searchFilter = `platforms:${platformIds}`;
        }

        if (searchFilter) {
          const response = await fetch(
            `${API_BASE}/api/games?${
              product.genres && product.genres.length > 0 
                ? `search=${encodeURIComponent(searchFilter)}`
                : `filter=${encodeURIComponent(searchFilter)}`
            }&limit=6&field_list=id,name,image,deck,genres,platforms,original_release_date`
          );
          
          if (response.ok) {
            const data = await response.json();
            // Filter out the current product and limit to 6 items
            const filtered = (data.results || [])
              .filter(game => game.id !== parseInt(id))
              .slice(0, 6);
            setSimilarProducts(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarProducts();
  }, [product, id]);

  // Inject CSS animations and responsive styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = bounceAnimation + spinAnimation + `
      @media (max-width: 768px) {
        .product-card {
          flex-direction: column !important;
          max-width: 100% !important;
        }
        .product-image-section {
          min-width: 100% !important;
          max-width: 100% !important;
          height: 300px !important;
        }
        .product-details {
          min-width: 100% !important;
          padding: 16px !important;
        }
        .similar-card {
          flex-direction: column !important;
          min-height: auto !important;
        }
        .similar-card-image {
          width: 100% !important;
          height: 200px !important;
        }
        .similar-card-buttons {
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 1rem !important;
        }
        .similar-card-button {
          width: 48% !important;
        }
      }
      @media (max-width: 480px) {
        .product-container {
          padding: 10px !important;
        }
        .back-button {
          padding: 0.5rem 1rem !important;
          font-size: 0.9rem !important;
        }
        .similar-section {
          padding: 1rem !important;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Generate and cache data for similar products
  const getSimilarGameData = (gameId) => {
    if (!similarGameDataCache[gameId]) {
      const newData = {
        rating: generateRandomRating(gameId),
        priceInfo: generateRandomPrice(gameId)
      };
      setSimilarGameDataCache(prev => ({ ...prev, [gameId]: newData }));
      return newData;
    }
    return similarGameDataCache[gameId];
  };

  const handleSimilarAddToCart = async (game) => {
    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }

    const gameData = getSimilarGameData(game.id);
    const productData = {
      id: game.id,
      name: game.name,
      description: game.deck || 'No description available',
      image: game.image?.original_url || game.image?.small_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
      price: parseFloat(gameData.priceInfo.currentPrice),
      originalPrice: gameData.priceInfo.originalPrice ? parseFloat(gameData.priceInfo.originalPrice) : null,
      tags: game.genres?.map(g => g.name) || [],
      hasDiscount: gameData.priceInfo.hasDiscount
    };

    const quantity = similarQuantities[game.id] || 1;
    const success = await addToCart(productData, quantity);
    if (success) {
      setSimilarAddedToCart(prev => ({ ...prev, [game.id]: true }));
      setTimeout(() => {
        setSimilarAddedToCart(prev => ({ ...prev, [game.id]: false }));
      }, 3000);
    }
  };

  const toggleSimilarWishlist = (gameId) => {
    setSimilarWishlist(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  // Get the main product image - prioritize original, then fallback to others
  const getMainProductImage = () => {
    if (!product) return "/controllers.jpg";
    
    if (product.image?.original) return product.image.original;
    // if (product.image?.square_small) return product.image.square_small;
    // if (product.image?.square_tiny) return product.image.square_tiny;
    
    return "/controllers.jpg";
  };

  // Similar Products Component - Catalogue style
  const SimilarProductCard = ({ game }) => {
    const { rating, priceInfo } = getSimilarGameData(game.id);
    
    return (
      <div
        className="similar-card"
        style={{
          backgroundColor: '#fff',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer',
          display: 'flex',
          minHeight: '200px',
          border: '1px solid #e5e7eb',
          width: '100%',
          boxSizing: 'border-box'
        }}
        onClick={() => navigate(`/product/${game.id}`)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}
      >
        {/* Image Section */}
        <div 
          className="similar-card-image"
          style={{
            position: 'relative',
            width: '230px',
            height: '270px',
            backgroundColor: '#f0f0f0',
            flexShrink: 0
          }}
        >
          {game.image?.original || game.image?.square_small ? (
            <img
              src={game.image.original || game.image.square_small}
              alt={game.name}
              style={{
                width: '100%',
                height: '100%',
                // objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e9ecef'
            }}>
              <FaGamepad style={{ fontSize: '3rem', color: '#adb5bd' }} />
            </div>
          )}
          
          {/* Discount badge */}
          {priceInfo.hasDiscount && (
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              backgroundColor: '#e74c3c',
              color: '#fff',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              -{Math.round(((priceInfo.originalPrice - priceInfo.currentPrice) / priceInfo.originalPrice) * 100)}%
            </div>
          )}
        </div>

        {/* Info Section */}
        <div style={{
          padding: '1.5rem',
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Title and Description */}
          <div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1E232C',
              margin: '0 0 0.5rem 0',
              transition: 'color 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.color = '#00AEBB'}
            onMouseLeave={(e) => e.target.style.color = '#1E232C'}
            >
              {game.name}
            </h3>
            
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              margin: '0 0 1rem 0',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {game.deck || "No description available."}
            </p>

            {/* Tags */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}>
              {game.genres?.slice(0, 2).map(genre => (
                <span key={genre.id} style={{
                  backgroundColor: '#f8f9fa',
                  color: '#666',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.8rem'
                }}>
                  {genre.name}
                </span>
              )) || game.platforms?.slice(0, 2).map(platform => (
                <span key={platform.id} style={{
                  backgroundColor: '#f8f9fa',
                  color: '#666',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.8rem'
                }}>
                  {platform.abbreviation || platform.name}
                </span>
              )) || (
                <span style={{
                  backgroundColor: '#f8f9fa',
                  color: '#666',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.8rem'
                }}>
                  Game
                </span>
              )}
            </div>

            {/* Rating */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <FaStar style={{ color: '#F7CA66', fontSize: '1rem' }} />
              <span style={{ fontWeight: '600', color: '#1E232C' }}>{rating}</span>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                (150 reviews)
              </span>
            </div>
          </div>

          {/* Price and Buttons Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 'auto'
          }}>
            {/* Price */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {priceInfo.hasDiscount && (
                <span style={{
                  textDecoration: 'line-through',
                  color: '#999',
                  fontSize: '0.9rem'
                }}>
                  ${priceInfo.originalPrice.toFixed(2)}
                </span>
              )}
              <span style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#00AEBB'
              }}>
                ${priceInfo.currentPrice.toFixed(2)}
              </span>
            </div>

            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              justifyContent: 'flex-end'
            }}>
              <label style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#333'
              }}>
                Qty:
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '0.25rem',
                overflow: 'hidden'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSimilarQuantities(prev => ({
                      ...prev,
                      [game.id]: Math.max(1, (prev[game.id] || 1) - 1)
                    }));
                  }}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#666',
                    transition: 'all 0.3s ease'
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={similarQuantities[game.id] || 1}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setSimilarQuantities(prev => ({
                      ...prev,
                      [game.id]: Math.max(1, Math.min(99, value))
                    }));
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '40px',
                    padding: '0.25rem',
                    textAlign: 'center',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSimilarQuantities(prev => ({
                      ...prev,
                      [game.id]: Math.min(99, (prev[game.id] || 1) + 1)
                    }));
                  }}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#666',
                    transition: 'all 0.3s ease'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div 
              className="similar-card-buttons"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'flex-end'
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSimilarWishlist(game.id);
                }}
                className="similar-card-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem 1rem',
                  backgroundColor: similarWishlist.includes(game.id) ? '#e74c3c' : '#fff',
                  color: similarWishlist.includes(game.id) ? '#fff' : '#666',
                  border: `2px solid ${similarWishlist.includes(game.id) ? '#e74c3c' : '#ddd'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '160px',
                  boxSizing: 'border-box'
                }}
                title={similarWishlist.includes(game.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FaHeart style={{ marginRight: '0.5rem' }} />
                {similarWishlist.includes(game.id) ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSimilarAddToCart(game);
                }}
                className="similar-card-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem 1rem',
                  backgroundColor: similarAddedToCart[game.id] ? '#27ae60' : '#F7CA66',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '160px',
                  boxSizing: 'border-box'
                }}
                disabled={similarAddedToCart[game.id]}
                onMouseEnter={(e) => {
                  if (!similarAddedToCart[game.id]) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 12px rgba(247, 202, 102, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!similarAddedToCart[game.id]) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {similarAddedToCart[game.id] ? (
                  <>
                    <FaCheck style={{ marginRight: '0.5rem' }} />
                    Added to cart
                  </>
                ) : (
                  <>
                    <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={big}>
        <NavBar currentPage="product" user={user} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <FaGamepad style={{ fontSize: '3rem', color: '#00AEBB', animation: 'bounce 1s infinite' }} />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={big}>
        <NavBar currentPage="product" user={user} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <p style={{ color: '#e74c3c' }}>Error: {error || 'Product not found'}</p>
          <button 
            onClick={() => navigate('/catalogue')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#00AEBB',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={big}>
      <NavBar currentPage="product" user={user} />
      <div style={container}>
        
        {/* Back button */}
        <button
          onClick={() => navigate('/catalogue')}
          className="back-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f8f9fa',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '1rem',
            transition: 'all 0.3s ease',
            width: 'fit-content',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#00AEBB';
            e.target.style.color = '#fff';
            e.target.style.borderColor = '#00AEBB';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f8f9fa';
            e.target.style.color = '#666';
            e.target.style.borderColor = '#ddd';
          }}
        >
          <FaArrowLeft />
          Back to Catalogue
        </button>

        <div style={{...card}} className="product-card">
          {/* Left: Image Section - Now shows only one image */}
          <div style={{...imageSection}} className="product-image-section">
            <img
              src={getMainProductImage()}
              alt={product.name}
              style={bigImage}
            />
          </div>

          {/* Right: Product Details */}
          <div style={{...details}} className="product-details">
            <h3 style={title}>{product.name}</h3>
            <p style={description}>
              {product.deck || "No description available."}
            </p>

            {/* Categories/Tags */}
            <div style={categories}>
              {product.genres?.slice(0, 3).map(genre => (
                <span key={genre.id} style={category}>{genre.name}</span>
              )) || product.platforms?.slice(0, 3).map(platform => (
                <span key={platform.id} style={category}>
                  {platform.abbreviation || platform.name}
                </span>
              )) || (
                <span style={category}>Game</span>
              )}
            </div>

            {/* Rating */}
            <div style={ratingContainer}>
              <FaStar style={starStyle} />
              <span style={ratingStyle}>{rating}</span>
            </div>

            {/* Price */}
            <p style={price}>
              {priceInfo?.hasDiscount && (
                <span style={{
                  textDecoration: 'line-through',
                  color: '#999',
                  fontSize: '1rem',
                  marginRight: '1rem'
                }}>
                  ${priceInfo.originalPrice.toFixed(2)}
                </span>
              )}
              ${priceInfo?.currentPrice.toFixed(2)}
            </p>

            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <label style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#333'
              }}>
                Quantity:
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #ddd',
                borderRadius: '0.5rem',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  style={{
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#666',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#00AEBB';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.color = '#666';
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(99, value)));
                  }}
                  style={{
                    width: '60px',
                    padding: '0.5rem',
                    textAlign: 'center',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => setQuantity(prev => Math.min(99, prev + 1))}
                  style={{
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#666',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#00AEBB';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.color = '#666';
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div style={specs}>
              <h3>Game Details:</h3>
              <ul>
                {product.original_release_date && (
                  <li>Release Date: {new Date(product.original_release_date).toLocaleDateString()}</li>
                )}
                {product.platforms && (
                  <li>Platforms: {product.platforms.map(p => p.name || p.abbreviation).join(', ')}</li>
                )}
                {product.genres && (
                  <li>Genres: {product.genres.map(g => g.name).join(', ')}</li>
                )}
                {product.site_detail_url && (
                  <li>
                    <a 
                      href={product.site_detail_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#00AEBB', textDecoration: 'none' }}
                    >
                      View on GameSpot
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Buttons */}
            <div 
              className="button-row"
              style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
            >
              <button
                onClick={async () => {
                  if (!user) {
                    alert('Please log in to add items to cart');
                    return;
                  }

                  const productData = {
                    id: product.id,
                    name: product.name,
                    description: product.deck || 'No description available',
                    image: product.image?.original_url || product.image?.small_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
                    price: parseFloat(priceInfo?.currentPrice || 0),
                    originalPrice: priceInfo?.originalPrice ? parseFloat(priceInfo.originalPrice) : null,
                    tags: product.genres?.map(g => g.name) || [],
                    hasDiscount: priceInfo?.hasDiscount || false
                  };

                  const success = await addToCart(productData, quantity);
                  if (success) {
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 3000);
                  }
                }}
                className="main-button"
                style={{ 
                  ...button, 
                  flex: 7,
                  backgroundColor: addedToCart ? '#27ae60' : '#F7CA66'
                }}
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <FaCheck style={{ marginRight: '0.5rem' }} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                    Add to Cart
                  </>
                )}
              </button>
              <button 
                onClick={() => {
                  setWishlist(prev => 
                    prev.includes(product.id) 
                      ? prev.filter(id => id !== product.id)
                      : [...prev, product.id]
                  );
                  console.log(`Toggled wishlist for ${product.name}`);
                }}
                className="wishlist-button"
                style={{ 
                  ...wishlistButton, 
                  flex: 3,
                  backgroundColor: wishlist.includes(product.id) ? '#e74c3c' : '#fff',
                  color: wishlist.includes(product.id) ? '#fff' : 'rgba(0, 0, 0, 0.5)',
                  borderColor: wishlist.includes(product.id) ? '#e74c3c' : 'rgba(0, 0, 0, 0.3)'
                }}
              >
                <FaHeart />
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div 
            className="similar-section"
            style={{
              marginTop: '3rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '1rem',
              padding: '2rem',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#333',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              Similar Games You Might Like
            </h3>
            <p style={{
              textAlign: 'center',
              color: '#666',
              marginBottom: '2rem',
              fontSize: '1rem'
            }}>
              Discover more games based on your interests
            </p>
            
            {loadingSimilar ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <FaGamepad style={{ 
                  fontSize: '2rem', 
                  color: '#00AEBB', 
                  animation: 'bounce 1s infinite' 
                }} />
                <p style={{ color: '#666' }}>Loading similar games...</p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                {similarProducts.map(game => (
                  <SimilarProductCard key={game.id} game={game} />
                ))}
              </div>
            )}
            
            {similarProducts.length > 0 && !loadingSimilar && (
              <div style={{
                textAlign: 'center',
                marginTop: '2rem'
              }}>
                <button
                  onClick={() => navigate('/catalogue')}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#00AEBB',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 12px rgba(0, 174, 187, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  View All Games
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;