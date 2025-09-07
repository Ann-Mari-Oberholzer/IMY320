import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaShoppingCart, FaArrowLeft, FaGamepad, FaCheck, FaChevronLeft, FaChevronRight, FaTruck } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
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
  spinAnimation,
  similarSection,
  similarSectionTitle,
  similarSectionSubtitle,
  similarGridContainer,
  similarCardItem,
  similarItemImage,
  similarItemContent,
  similarItemTitle,
  similarItemDescription,
  similarItemMeta,
  similarItemRating,
  similarItemPrice,
  similarItemActions,
  similarItemButton,
  similarItemAddButton,
  similarItemWishlistButton,
  carouselContainer,
  carouselTrack,
  carouselSlide,
  carouselNavigation,
  carouselButton,
  carouselButtonLeft,
  carouselButtonRight,
  carouselButtonDisabled,
  carouselDots,
  carouselDot,
  carouselDotActive,
  productInfoSection,
  productInfoTitle,
  productInfoGrid,
  productInfoCard,
  productInfoCardTitle,
  productInfoList,
  productInfoListItem,
  productInfoLabel,
  productInfoValue,
  productDescription,
  productDescriptionTitle,
  productDescriptionText
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
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

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
        
        // Ensure loading screen shows for at least 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (err) {
        setError(err.message || "Failed to load product");
        console.error("Error fetching product:", err);
        // Still wait 3 seconds even on error for consistent UX
        await new Promise(resolve => setTimeout(resolve, 3000));
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
              }&limit=3&field_list=id,name,image,deck,genres,platforms,original_release_date`
            );
            
            if (response.ok) {
              const data = await response.json();
              // Filter out the current product and limit to 3 items for carousel
              const filtered = (data.results || [])
                .filter(game => game.id !== parseInt(id))
                .slice(0, 3);
              setSimilarProducts(filtered);
            }
        }
        
        // Ensure loading screen shows for at least 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error('Error fetching similar products:', error);
        // Still wait 3 seconds even on error for consistent UX
        await new Promise(resolve => setTimeout(resolve, 3000));
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
      @media (max-width: 1024px) {
        .product-layout {
          flex-direction: column !important;
        }
        .product-layout > div:first-child {
          flex: none !important;
          min-width: 100% !important;
        }
        .product-layout > div:last-child {
          flex: none !important;
          max-width: 100% !important;
          position: static !important;
        }
        .carousel-container {
          max-width: 100% !important;
          gap: 12px !important;
          padding: 0 50px !important;
          overflow: visible !important;
        }
        .carousel-track {
          gap: 1rem !important;
          overflow: visible !important;
          justify-content: flex-start !important;
          padding-left: 0px !important;
          margin-left: -15px !important;
        }
        .carousel-slide {
          width: 280px !important;
          flex: 0 0 280px !important;
          justify-content: center !important;
        }
        .carousel-button {
          width: 45px !important;
          height: 45px !important;
          font-size: 1.1rem !important;
        }
      }
      @media (max-width: 768px) {
        .product-container {
          padding: 16px !important;
        }
        .product-layout > div:first-child > div:first-child {
          flex-direction: column !important;
          text-align: center !important;
        }
        .product-layout > div:first-child > div:first-child img {
          width: 100% !important;
          max-width: 300px !important;
          height: 300px !important;
          margin: 0 auto !important;
        }
        .carousel-container {
          max-width: 100% !important;
          gap: 8px !important;
          padding: 0 40px !important;
          overflow: visible !important;
        }
        .carousel-track {
          gap: 0.75rem !important;
          overflow: visible !important;
          justify-content: flex-start !important;
          padding-left: 0px !important;
          margin-left: -10px !important;
        }
        .carousel-slide {
          width: 240px !important;
          flex: 0 0 240px !important;
          justify-content: center !important;
        }
        .carousel-button {
          width: 40px !important;
          height: 40px !important;
          font-size: 1rem !important;
        }
      }
      @media (max-width: 480px) {
        .product-container {
          padding: 12px !important;
        }
        .back-button {
          padding: 0.5rem 1rem !important;
          font-size: 0.9rem !important;
        }
        .similar-section {
          padding: 20px !important;
        }
        .product-layout > div:first-child > div:first-child img {
          height: 250px !important;
        }
        .carousel-container {
          max-width: 100% !important;
          gap: 4px !important;
          padding: 0 30px !important;
          overflow: visible !important;
        }
        .carousel-track {
          gap: 0.5rem !important;
          overflow: visible !important;
          justify-content: flex-start !important;
          padding-left: 0px !important;
          margin-left: -8px !important;
        }
        .carousel-slide {
          width: 200px !important;
          flex: 0 0 200px !important;
          justify-content: center !important;
        }
        .carousel-button {
          width: 35px !important;
          height: 35px !important;
          font-size: 0.9rem !important;
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
      description: game.deck || 'Immerse yourself in an exciting gaming adventure that combines engaging gameplay mechanics with stunning visuals and immersive storytelling. This game delivers hours of entertainment with its carefully crafted world, challenging objectives, and rewarding progression system. Whether you\'re a casual gamer or a hardcore enthusiast, this title offers something for everyone with its diverse gameplay elements and polished presentation.',
      image: game.image?.original || game.image?.square_small || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
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

  // Carousel navigation functions for 3-card display
  const nextSlide = () => {
    if (similarProducts.length <= 3) return;
    setCurrentSlide((prev) => Math.min(prev + 1, similarProducts.length - 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Get the 3 products to display
  const getVisibleProducts = () => {
    if (similarProducts.length <= 3) {
      return similarProducts;
    }
    return similarProducts.slice(currentSlide, currentSlide + 3);
  };

  // Get the main product image - prioritize original, then fallback to others
  const getMainProductImage = () => {
    if (!product) return "/controllers.jpg";
    
    if (product.image?.original) return product.image.original;
    
    return "/controllers.jpg";
  };

  // Handle tag click - navigate to catalogue with filter
  const handleTagClick = (tagName, event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/catalogue?search=${encodeURIComponent(tagName)}`);
  };

  // Similar Products Component - Image-focused carousel card
  const SimilarProductCard = ({ game }) => {
    const { rating, priceInfo } = getSimilarGameData(game.id);
    
    return (
      <div
        className="similar-card-item"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "0",
          width: "300px",
          cursor: "pointer",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          border: "1px solid #f0f0f0",
          overflow: "hidden",
          position: "relative",
        }}
        onClick={() => navigate(`/product/${game.id}`)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
        }}
      >
        {/* Image Container with Overlay */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "200px",
          overflow: "hidden",
          borderRadius: "20px 20px 0 0",
        }}>
          <img
            src={game.image?.original || game.image?.square_small || "/controllers.jpg"}
            alt={game.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          />
          
          {/* Gradient Overlay */}
          <div style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "60px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            display: "flex",
            alignItems: "flex-end",
            padding: "12px",
          }}>
            {/* Rating Badge */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#1E232C",
            }}>
              <FaStar style={{ color: '#F7CA66', fontSize: '0.7rem' }} />
              {rating}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          flex: "1"
        }}>
          <h3 style={{
            fontSize: "1.1rem",
            fontWeight: "700",
            color: "#1E232C",
            margin: "0",
            lineHeight: "1.3",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {game.name}
          </h3>

          {/* Tags */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            flexWrap: 'wrap',
            marginBottom: '0.5rem'
          }}>
            {game.genres?.slice(0, 2).map(genre => (
              <span 
                key={genre.id} 
                onClick={(e) => handleTagClick(genre.name, e)}
                style={{
                  backgroundColor: '#f0f7ff',
                  color: '#00AEBB',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#00AEBB';
                  e.target.style.color = '#fff';
                  e.target.style.borderColor = '#00AEBB';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f0f7ff';
                  e.target.style.color = '#00AEBB';
                  e.target.style.borderColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {genre.name}
              </span>
            )) || game.platforms?.slice(0, 2).map(platform => (
              <span 
                key={platform.id} 
                onClick={(e) => handleTagClick(platform.abbreviation || platform.name, e)}
                style={{
                  backgroundColor: '#f0f7ff',
                  color: '#00AEBB',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#00AEBB';
                  e.target.style.color = '#fff';
                  e.target.style.borderColor = '#00AEBB';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f0f7ff';
                  e.target.style.color = '#00AEBB';
                  e.target.style.borderColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {platform.abbreviation || platform.name}
              </span>
            ))}
          </div>

          {/* Price */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px"
          }}>
            {priceInfo.hasDiscount && (
              <span style={{
                textDecoration: "line-through",
                color: "#999",
                fontSize: "0.9rem",
                fontWeight: "500"
              }}>
                ${priceInfo.originalPrice.toFixed(2)}
              </span>
            )}
            <span style={{
              fontSize: "1.3rem",
              fontWeight: "800",
              color: "#00AEBB"
            }}>
              ${priceInfo.currentPrice.toFixed(2)}
            </span>
            {priceInfo.hasDiscount && (
              <span style={{
                backgroundColor: "#e74c3c",
                color: "#fff",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.7rem",
                fontWeight: "600"
              }}>
                SAVE
              </span>
            )}
          </div>

          {/* Action Buttons - Compact */}
          <div style={{
            display: "flex",
            gap: "8px",
            marginTop: "auto"
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSimilarAddToCart(game);
              }}
              style={{
                padding: "12px 20px",
                backgroundColor: similarAddedToCart[game.id] ? '#27ae60' : '#F7CA66',
                color: "#fff",
                fontSize: "0.9rem",
                fontWeight: "600",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                flex: "1",
                boxShadow: "0 4px 12px rgba(247, 202, 102, 0.4)",
              }}
              disabled={similarAddedToCart[game.id]}
            >
              {similarAddedToCart[game.id] ? (
                <>
                  <FaCheck />
                  Added
                </>
              ) : (
                <>
                  <FaShoppingCart />
                  Add to Cart
                </>
              )}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSimilarWishlist(game.id);
              }}
              style={{
                padding: "12px 16px",
                backgroundColor: similarWishlist.includes(game.id) ? '#e74c3c' : '#fff',
                color: similarWishlist.includes(game.id) ? '#fff' : 'rgba(0, 0, 0, 0.5)',
                fontSize: "0.9rem",
                border: `2px solid ${similarWishlist.includes(game.id) ? '#e74c3c' : 'rgba(0, 0, 0, 0.2)'}`,
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.3s ease",
                minWidth: "50px",
                boxShadow: similarWishlist.includes(game.id) ? "0 4px 12px rgba(231, 76, 60, 0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <FaHeart />
            </button>
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
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 1000
        }}>
          <FaGamepad style={{ fontSize: '3rem', color: '#00AEBB', animation: 'bounce 1s infinite' }} />
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
      <div style={container} className="product-container">
        
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
            marginBottom: '0.5rem',
            transition: 'all 0.3s ease',
            width: 'fit-content',
            boxSizing: 'border-box',
            alignSelf: 'flex-start'
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

        {/* Main Product Layout - Similar to Shopping Cart */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }} className="product-layout">
          
          {/* Left: Product Details */}
          <div style={{
            flex: '3',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            minWidth: '400px'
          }}>
            {/* Product Image and Basic Info with Game Details */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              gap: '2rem',
              alignItems: 'flex-start'
            }}>
              <img
                src={getMainProductImage()}
                alt={product.name}
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '0.5rem',
                  objectFit: 'cover',
                  backgroundColor: '#f0f0f0',
                  flexShrink: 0
                }}
              />
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#1E232C',
                  margin: '0 0 1rem 0',
                  lineHeight: '1.2'
                }}>
                  {product.name}
                </h1>
                
                <p style={{
                  fontSize: '1rem',
                  color: '#666',
                  margin: '0 0 1rem 0',
                  lineHeight: '1.6'
                }}>
                  {product.deck || "Immerse yourself in an exciting gaming adventure that combines engaging gameplay mechanics with stunning visuals and immersive storytelling. This game delivers hours of entertainment with its carefully crafted world, challenging objectives, and rewarding progression system. Whether you're a casual gamer or a hardcore enthusiast, this title offers something for everyone with its diverse gameplay elements and polished presentation."}
                </p>

                {/* Categories/Tags */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  marginBottom: '1rem'
                }}>
                  {product.genres?.slice(0, 4).map(genre => (
                    <span 
                      key={genre.id} 
                      onClick={(e) => handleTagClick(genre.name, e)}
                      style={{
                        backgroundColor: '#f0f7ff',
                        color: '#00AEBB',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#00AEBB';
                        e.target.style.color = '#fff';
                        e.target.style.borderColor = '#00AEBB';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f0f7ff';
                        e.target.style.color = '#00AEBB';
                        e.target.style.borderColor = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {genre.name}
                    </span>
                  )) || product.platforms?.slice(0, 3).map(platform => (
                    <span 
                      key={platform.id} 
                      onClick={(e) => handleTagClick(platform.abbreviation || platform.name, e)}
                      style={{
                        backgroundColor: '#f0f7ff',
                        color: '#00AEBB',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#00AEBB';
                        e.target.style.color = '#fff';
                        e.target.style.borderColor = '#00AEBB';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f0f7ff';
                        e.target.style.color = '#00AEBB';
                        e.target.style.borderColor = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {platform.abbreviation || platform.name}
                    </span>
                  )) || (
                    <span style={{
                      backgroundColor: '#f0f7ff',
                      color: '#00AEBB',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.8rem',
                      fontWeight: '500'
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
                  <FaStar style={{ color: '#F7CA66', fontSize: '1.1rem' }} />
                  <span style={{
                    fontWeight: '700',
                    color: '#1E232C',
                    fontSize: '1.1rem'
                  }}>
                    {rating}
                  </span>
                  <span style={{color: '#999', fontSize: '0.9rem'}}>(150 reviews)</span>
            </div>

                {/* Game Details - Inline */}
              <div style={{
                backgroundColor: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                color: '#444',
                  border: '1px solid #e9ecef',
                  marginTop: '1rem'
              }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', lineHeight: '1.5' }}>
                  {product.original_release_date && (
                      <div><strong>Release Date:</strong> {new Date(product.original_release_date).toLocaleDateString()}</div>
                  )}
                  {product.platforms && (
                      <div><strong>Platforms:</strong> {product.platforms.map(p => p.name || p.abbreviation).join(', ')}</div>
                  )}
                  {product.genres && (
                      <div><strong>Genres:</strong> {product.genres.map(g => g.name).join(', ')}</div>
                  )}
                  {product.site_detail_url && (
                      <div>
                        <strong>More Info:</strong> 
                      <a 
                        href={product.site_detail_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                          style={{ color: '#00AEBB', textDecoration: 'none', marginLeft: '4px' }}
                      >
                        View on GameSpot
                      </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Moved to Game Info Section */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  marginTop: '1.5rem',
                  justifyContent: 'flex-start'
                }}>
                  <button
                    onClick={async () => {
                      if (!user) {
                        alert('Please log in to add items to cart');
                        return;
                      }

                      const productData = {
                        id: product.id,
                        name: product.name,
                        description: product.deck || 'Immerse yourself in an exciting gaming adventure that combines engaging gameplay mechanics with stunning visuals and immersive storytelling. This game delivers hours of entertainment with its carefully crafted world, challenging objectives, and rewarding progression system. Whether you\'re a casual gamer or a hardcore enthusiast, this title offers something for everyone with its diverse gameplay elements and polished presentation.',
                        image: product.image?.original || product.image?.square_small || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
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
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: addedToCart ? '#27ae60' : '#F7CA66',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: addedToCart ? 'default' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      minWidth: '140px'
                    }}
                    disabled={addedToCart}
                  >
                    {addedToCart ? (
                      <>
                        <FaCheck />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <FaShoppingCart />
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
                    style={{
                      padding: '0.75rem 1.25rem',
                      backgroundColor: wishlist.includes(product.id) ? '#e74c3c' : '#fff',
                      color: wishlist.includes(product.id) ? '#fff' : '#666',
                      border: `2px solid ${wishlist.includes(product.id) ? '#e74c3c' : '#e9ecef'}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      minWidth: '140px'
                    }}
                  >
                    <FaHeart />
                    {wishlist.includes(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Add to Cart Summary - Compact */}
          <div style={{
            flex: '1',
            maxWidth: '320px',
            backgroundColor: '#fff',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            height: 'fit-content',
            position: 'sticky',
            top: '2rem'
          }}>

            {/* Price Display - Compact */}
            <div style={{
              textAlign: 'center',
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '0.5rem',
              border: '1px solid #e9ecef'
            }}>
              {priceInfo?.hasDiscount && (
                <div style={{
                  fontSize: '0.9rem',
                  color: '#999',
                  textDecoration: 'line-through',
                  marginBottom: '0.25rem'
                }}>
                  ${priceInfo.originalPrice.toFixed(2)}
                </div>
              )}
              <div style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                color: '#1E232C'
              }}>
                ${priceInfo?.currentPrice.toFixed(2)}
              </div>
              {priceInfo?.hasDiscount && (
                <div style={{
                  fontSize: '0.8rem',
                  color: '#27ae60',
                  fontWeight: '600',
                  marginTop: '0.25rem'
                }}>
                  Save ${(priceInfo.originalPrice - priceInfo.currentPrice).toFixed(2)}!
                </div>
              )}
            </div>

            {/* Quantity Selector - Ultra Compact */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#333',
                marginBottom: '0.4rem'
              }}>
                Quantity:
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e9ecef',
                borderRadius: '0.4rem',
                overflow: 'hidden',
                backgroundColor: '#fff',
                width: 'fit-content'
              }}>
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  style={{
                    padding: '0.2rem 0.4rem',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#666',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    height: '28px'
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
                    width: '30px',
                    padding: '0.2rem 0.1rem',
                    textAlign: 'center',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    outline: 'none',
                    backgroundColor: '#fff',
                    height: '28px'
                  }}
                />
                <button
                  onClick={() => setQuantity(prev => Math.min(99, prev + 1))}
                  style={{
                    padding: '0.2rem 0.4rem',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#666',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    height: '28px'
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

            {/* Total Price - Compact */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderTop: '2px solid #00AEBB',
              marginBottom: '0.75rem'
            }}>
              <span style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#1E232C'
              }}>
                Total:
              </span>
              <span style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: '#1E232C'
              }}>
                ${((priceInfo?.currentPrice || 0) * quantity).toFixed(2)}
              </span>
            </div>

            {/* Free Delivery Message */}
            <div style={{
              textAlign: 'center',
              padding: '0.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '0.4rem',
              fontSize: '0.8rem',
              color: '#666',
              border: '1px solid #e9ecef',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <FaTruck style={{ color: '#00AEBB', fontSize: '0.75rem' }} />
                <span style={{ fontWeight: '600' }}>Free Delivery</span>
              </div>
              <div>Orders over $50 qualify for free shipping</div>
            </div>

          </div>
        </div>

        {/* Detailed Product Information Section - Moved Higher */}
        <div style={productInfoSection}>
          <h2 style={{
            ...productInfoTitle,
            fontSize: '1.8rem',
            marginBottom: '1.5rem'
          }}>
            Product Information
          </h2>
          
          {/* Description Section */}
          <div style={productDescription}>
            <h3 style={productDescriptionTitle}>
              <FaGamepad style={{ color: '#00AEBB' }} />
              About This Game
            </h3>
            <p style={productDescriptionText}>
              {product.deck || "Immerse yourself in an exciting gaming adventure that combines engaging gameplay mechanics with stunning visuals and immersive storytelling. This game delivers hours of entertainment with its carefully crafted world, challenging objectives, and rewarding progression system. Whether you're a casual gamer or a hardcore enthusiast, this title offers something for everyone with its diverse gameplay elements and polished presentation."}
            </p>
          </div>

          {/* Information Grid */}
          <div style={productInfoGrid}>
            {/* Game Details Card */}
            <div style={productInfoCard}>
              <h3 style={productInfoCardTitle}>
                <FaGamepad style={{ color: '#00AEBB' }} />
                Game Details
              </h3>
              <ul style={productInfoList}>
                {product.original_release_date && (
                  <li style={productInfoListItem}>
                    <span style={productInfoLabel}>Release Date:</span>
                    <span style={productInfoValue}>
                      {new Date(product.original_release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </li>
                )}
                {product.genres && product.genres.length > 0 && (
                  <li style={productInfoListItem}>
                    <span style={productInfoLabel}>Genres:</span>
                    <span style={productInfoValue}>
                      {product.genres.map(g => g.name).join(', ')}
                    </span>
                  </li>
                )}
                {product.platforms && product.platforms.length > 0 && (
                  <li style={productInfoListItem}>
                    <span style={productInfoLabel}>Platforms:</span>
                    <span style={productInfoValue}>
                      {product.platforms.map(p => p.name || p.abbreviation).join(', ')}
                    </span>
                  </li>
                )}
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Rating:</span>
                  <span style={productInfoValue}>
                    {rating} / 5.0 ({Math.floor(Math.random() * 500) + 100} reviews)
                  </span>
                </li>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Price:</span>
                  <span style={productInfoValue}>
                    ${priceInfo?.currentPrice.toFixed(2)}
                    {priceInfo?.hasDiscount && (
                      <span style={{ 
                        textDecoration: 'line-through', 
                        color: '#999', 
                        marginLeft: '8px' 
                      }}>
                        ${priceInfo.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </span>
                </li>
              </ul>
            </div>

            {/* Technical Specifications Card */}
            <div style={productInfoCard}>
              <h3 style={productInfoCardTitle}>
                <FaGamepad style={{ color: '#00AEBB' }} />
                Technical Specs
              </h3>
              <ul style={productInfoList}>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Game ID:</span>
                  <span style={productInfoValue}>{product.id}</span>
                </li>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Developer:</span>
                  <span style={productInfoValue}>
                    {product.developers?.[0]?.name || 'Kimberly Stern'}
                  </span>
                </li>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Publisher:</span>
                  <span style={productInfoValue}>
                    {product.publishers?.[0]?.name || 'Sthembiso Khuzwayo'}
                  </span>
                </li>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>ESRB Rating:</span>
                  <span style={productInfoValue}>
                    {product.original_game_rating?.[0]?.name || 'Not Rated'}
                  </span>
                </li>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Game Type:</span>
                  <span style={productInfoValue}>
                    {product.game_type || 'Digital Game'}
                  </span>
                </li>
                {product.site_detail_url && (
                  <li style={productInfoListItem}>
                    <span style={productInfoLabel}>External Link:</span>
                    <span style={productInfoValue}>
                      <a 
                        href={product.site_detail_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#00AEBB', 
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        View on GameSpot
                      </a>
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Purchase Information Card */}
            <div style={productInfoCard}>
              <h3 style={productInfoCardTitle}>
                <FaShoppingCart style={{ color: '#00AEBB' }} />
                Purchase Info
              </h3>
              <ul style={productInfoList}>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Availability:</span>
                  <span style={productInfoValue}>In Stock</span>
                </li>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Delivery:</span>
                  <span style={productInfoValue}>Instant Download</span>
                </li>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Platform Support:</span>
                  <span style={productInfoValue}>
                    {product.platforms?.length || 1} Platform{(product.platforms?.length || 1) > 1 ? 's' : ''}
                  </span>
                </li>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Warranty:</span>
                  <span style={productInfoValue}>30-Day Money Back</span>
                </li>
                <li style={productInfoListItem}>
                  <span style={productInfoLabel}>Support:</span>
                  <span style={productInfoValue}>24/7 Customer Service</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Products Section - Carousel Layout */}
        {similarProducts.length > 0 && (
          <div style={similarSection} className="similar-section">
            <h2 style={similarSectionTitle}>
              Similar Games You Might Like
            </h2>
            <p style={similarSectionSubtitle}>
      
            </p>
            
            {loadingSimilar ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px',
                flexDirection: 'column',
                gap: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '1rem',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <FaGamepad style={{ 
                  fontSize: '2.5rem', 
                  color: '#00AEBB', 
                  animation: 'bounce 1s infinite' 
                }} />
                <p style={{ 
                  color: '#1E232C', 
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  background: 'linear-gradient(90deg, #00AEBB, #F7CA66)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Loading similar games...</p>
              </div>
            ) : (
              <div style={carouselContainer} className="carousel-container">
                {/* Left Navigation Arrow */}
                {similarProducts.length > 3 && (
                  <button
                    onClick={prevSlide}
                    style={{
                      ...carouselButton,
                      ...carouselButtonLeft,
                      ...(currentSlide === 0 ? carouselButtonDisabled : {})
                    }}
                    disabled={currentSlide === 0}
                    onMouseEnter={(e) => {
                      if (currentSlide > 0) {
                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                        e.target.style.boxShadow = '0 6px 16px rgba(0, 174, 187, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentSlide > 0) {
                        e.target.style.transform = 'translateY(-50%) scale(1)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 174, 187, 0.3)';
                      }
                    }}
                  >
                    <FaChevronLeft />
                  </button>
                )}

                {/* 3 Cards Display */}
                <div style={carouselTrack}>
                  {getVisibleProducts().map((game, index) => (
                    <div key={game.id} style={carouselSlide}>
                      <SimilarProductCard game={game} />
                    </div>
                  ))}
                </div>

                {/* Right Navigation Arrow */}
                {similarProducts.length > 3 && (
                  <button
                    onClick={nextSlide}
                    style={{
                      ...carouselButton,
                      ...carouselButtonRight,
                      ...(currentSlide >= similarProducts.length - 3 ? carouselButtonDisabled : {})
                    }}
                    disabled={currentSlide >= similarProducts.length - 3}
                    onMouseEnter={(e) => {
                      if (currentSlide < similarProducts.length - 3) {
                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                        e.target.style.boxShadow = '0 6px 16px rgba(0, 174, 187, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentSlide < similarProducts.length - 3) {
                        e.target.style.transform = 'translateY(-50%) scale(1)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 174, 187, 0.3)';
                      }
                    }}
                  >
                    <FaChevronRight />
                  </button>
                )}
                
                {/* Arrow Indicators */}
                {similarProducts.length > 3 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '30px',
                    marginBottom: '20px'
                  }}>
                    {Array.from({ length: Math.ceil(similarProducts.length / 3) }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index * 3)}
                        style={{
                          width: '0',
                          height: '0',
                          borderLeft: currentSlide === index * 3 ? '8px solid #00AEBB' : '8px solid #ddd',
                          borderTop: '6px solid transparent',
                          borderBottom: '6px solid transparent',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: currentSlide === index * 3 ? 'scale(1.2)' : 'scale(1)',
                          boxShadow: currentSlide === index * 3 ? '0 2px 6px rgba(0, 174, 187, 0.3)' : 'none',
                          margin: '0 4px',
                        }}
                        onMouseEnter={(e) => {
                          if (currentSlide !== index * 3) {
                            e.target.style.borderLeftColor = '#bbb';
                            e.target.style.transform = 'scale(1.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentSlide !== index * 3) {
                            e.target.style.borderLeftColor = '#ddd';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {similarProducts.length > 0 && !loadingSimilar && (
              <div style={{
                textAlign: 'center',
                marginTop: '60px',
                marginBottom: '20px'
              }}>
                 <p style={similarSectionSubtitle}>
      
      </p>
      
                <button
                  onClick={() => navigate('/catalogue')}
                  style={{
                    padding: '14px 32px',
                    backgroundColor: '#00AEBB',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    margin: '0 auto',
                    display: 'block'
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ProductPage;