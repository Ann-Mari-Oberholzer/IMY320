import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaHeart, FaGamepad, FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { generateRandomPrice, generateRandomRating } from '../utils/gameDataGenerators';
import {
  globalResetUpdated as globalReset,
  containerStyle,
  contentStyle,
  headerStyle,
  titleStyle,
  subtitleStyle,
  searchFilterStyle,
  searchContainerStyle,
  searchIconStyle,
  searchInputStyle,
  filterToggleStyle,
  filtersStyle,
  filterGroupStyle,
  filterTitleStyle,
  categoryButtonsStyle,
  categoryButtonStyle,
  activeCategoryStyle,
  selectStyle,
  resultsInfoStyle,
  gamesGridStyle,
  gameCardStyle,
  gameImageContainerStyle,
  gameImagePlaceholderStyle,
  gameIconStyle,
  gameInfoStyle,
  gameTitleStyle,
  gameDescriptionStyle,
  gameTagsStyle,
  gameTagStyle,
  gameRatingStyle,
  starStyle,
  ratingTextStyle,
  gamePriceRowStyle,
  priceContainerStyle,
  originalPriceStyle,
  currentPriceStyle,
  addToCartButtonStyle,
  loadMoreButtonStyle,
  wishlistButtonNewStyle,
  buttonColumnStyle
} from './catalogue.js';

// API configuration
const API_BASE = "http://localhost:4000";

const categories = ["All", "Action", "Adventure", "RPG", "Racing", "Puzzle", "Strategy", "Sports", "Simulation"];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" }
];

const gamesPerPageOptions = [
  { value: 10, label: "10 per page" },
  { value: 20, label: "20 per page" },
  { value: 30, label: "30 per page" },
  { value: 100, label: "100 per page" }
];

// Enhanced dropdown styles
const enhancedSelectStyles = {
  container: {
    position: 'relative',
    marginBottom: '1rem',
  },
  select: {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 1rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#333',
    backgroundColor: '#fff',
    border: '2px solid #ddd',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    ':hover': {
      borderColor: '#00AEBB',
    },
    ':focus': {
      outline: 'none',
      borderColor: '#00AEBB',
      boxShadow: '0 0 0 3px rgba(0, 174, 187, 0.2)',
    },
  },
  icon: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#666',
    transition: 'transform 0.3s ease',
  },
  option: {
    padding: '0.5rem 1rem',
    backgroundColor: '#fff',
    color: '#333',
    ':hover': {
      backgroundColor: '#f0f0f0',
    },
  },
};



function Catalogue() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addToCart, isInCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [selectOpen, setSelectOpen] = useState(false);

  // Pagination state
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [gamesPerPage, setGamesPerPage] = useState(20);

  // Cart interaction state
  const [addedToCart, setAddedToCart] = useState({});

  // Cache for generated prices and ratings
  const [gameDataCache, setGameDataCache] = useState({});

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setActiveSearchTerm(searchTerm);
      setCurrentPage(1);
    }
  };

  const handleAddToCart = async (game) => {
    const { rating, priceInfo } = getGameData(game.id);
    
    // Create product object that matches CartContext expectations
    const product = {
      id: game.id,
      name: game.name,
      description: game.deck || "No description available.",
      price: priceInfo.currentPrice,
      originalPrice: priceInfo.hasDiscount ? priceInfo.originalPrice : null,
      image: game.image?.original || game.image?.square_small || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop",
      tags: game.genres?.map(genre => genre.name) || game.platforms?.map(platform => platform.abbreviation || platform.name) || ["Game"],
      rating: rating
    };

    setAddedToCart(prev => ({ ...prev, [game.id]: true }));
    
    const success = await addToCart(product, 1);
    
    if (success) {
      setTimeout(() => {
        setAddedToCart(prev => ({ ...prev, [game.id]: false }));
      }, 3000);
    } else {
      setAddedToCart(prev => ({ ...prev, [game.id]: false }));
    }
  };

  // Generate and cache data for a game if not already cached
  const getGameData = (gameId) => {
    if (!gameDataCache[gameId]) {
      const newData = {
        rating: generateRandomRating(gameId),
        priceInfo: generateRandomPrice(gameId)
      };
      setGameDataCache(prev => ({ ...prev, [gameId]: newData }));
      return newData;
    }
    return gameDataCache[gameId];
  };

  const fetchGames = useCallback(async (search = "", category = "All", sort = "popular", page = 1) => {
    try {
      setLoading(true);
      setError("");

      const offset = (page - 1) * gamesPerPage;
      const params = new URLSearchParams({
        limit: gamesPerPage.toString(),
        offset: offset.toString(),
        field_list: "id,name,deck,image,site_detail_url,original_release_date,platforms,genres"
      });

      if (search) params.set("search", search);
      if (category !== "All") params.set("search", category);

      switch (sort) {
        case "newest":
          params.set("sort", "original_release_date:desc");
          break;
        case "rating":
          params.set("sort", "original_release_date:desc");
          break;
        default:
          params.set("sort", "original_release_date:desc");
          break;
      }

      const response = await fetch(`${API_BASE}/api/games?${params.toString()}`);
      
      if (!response.ok) throw new Error(`Backend error ${response.status}`);

      const data = await response.json();
      setGames(Array.isArray(data?.results) ? data.results : []);
      
      const estimatedTotal = data?.total_count || (data?.results?.length === gamesPerPage ? 1000 : data?.results?.length);
      setTotalResults(estimatedTotal);
      setTotalPages(Math.ceil(estimatedTotal / gamesPerPage));
      
    } catch (err) {
      setError(err.message || "Failed to load games");
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  }, [gamesPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGamesPerPageChange = (newGamesPerPage) => {
    setGamesPerPage(newGamesPerPage);
    setCurrentPage(1);
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = activeSearchTerm === "" || 
      game.name?.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      game.deck?.toLowerCase().includes(activeSearchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || 
      game.genres?.some(genre => genre.name === selectedCategory) ||
      game.platforms?.some(platform => platform.name === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const toggleWishlist = (gameId) => {
    setWishlist(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    
    return pages;
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchGames(activeSearchTerm, selectedCategory, sortBy, 1);
  }, [activeSearchTerm, selectedCategory, sortBy, fetchGames]);

  useEffect(() => {
    fetchGames(activeSearchTerm, selectedCategory, sortBy, currentPage);
  }, [currentPage, activeSearchTerm, selectedCategory, sortBy, fetchGames]);

  useEffect(() => {
    setCurrentPage(1);
    fetchGames(activeSearchTerm, selectedCategory, sortBy, 1);
  }, [gamesPerPage, activeSearchTerm, selectedCategory, sortBy, fetchGames]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalReset;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div style={containerStyle}>
      <NavBar currentPage="catalogue" user={user} />
      
      {loading && (
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
      )}
      
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Game Catalogue</h1>
          <p style={subtitleStyle}>Discover amazing games and accessories for every player</p>
        </div>

        <div style={searchFilterStyle}>
          <div style={searchContainerStyle}>
            <FaSearch style={searchIconStyle} />
            <input
              type="text"
              placeholder="Search games or accessories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              style={searchInputStyle}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            style={filterToggleStyle}
          >
            <FaFilter style={{ marginRight: '0.5rem' }} />
            Filters
            {showFilters ? (
              <FaChevronUp style={{ marginLeft: '0.5rem' }} />
            ) : (
              <FaChevronDown style={{ marginLeft: '0.5rem' }} />
            )}
          </button>
        </div>

        {showFilters && (
          <div style={filtersStyle}>
            <div style={filterGroupStyle}>
              <h3 style={filterTitleStyle}>Categories</h3>
              <div style={categoryButtonsStyle}>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      ...categoryButtonStyle,
                      ...(selectedCategory === category ? activeCategoryStyle : {})
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div style={filterGroupStyle}>
              <h3 style={filterTitleStyle}>Sort By</h3>
              <div style={enhancedSelectStyles.container}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  onFocus={() => setSelectOpen(true)}
                  onBlur={() => setSelectOpen(false)}
                  style={{ ...selectStyle, ...enhancedSelectStyles.select }}
                >
                  {sortOptions.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      style={enhancedSelectStyles.option}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown style={{ 
                  ...enhancedSelectStyles.icon,
                  transform: `translateY(-50%) ${selectOpen ? 'rotate(180deg)' : ''}`
                }} />
              </div>
              <h3 style={filterTitleStyle}>Games Per Page</h3>
              <div style={enhancedSelectStyles.container}>
                <select
                  value={gamesPerPage}
                  onChange={(e) => handleGamesPerPageChange(Number(e.target.value))}
                  onFocus={() => setSelectOpen(true)}
                  onBlur={() => setSelectOpen(false)}
                  style={{ ...selectStyle, ...enhancedSelectStyles.select }}
                >
                  {gamesPerPageOptions.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      style={enhancedSelectStyles.option}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown style={{ 
                  ...enhancedSelectStyles.icon,
                  transform: `translateY(-50%) ${selectOpen ? 'rotate(180deg)' : ''}`
                }} />
              </div>
            </div>
          </div>
        )}

        <div style={resultsInfoStyle}>
          {error ? (
            <span style={{ color: '#e74c3c' }}>Error: {error}</span>
          ) : (
            <span>
              Showing {filteredGames.length} games 
              {totalResults > 0 && ` of ${totalResults.toLocaleString()}`}
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              {activeSearchTerm && <span style={{ fontStyle: 'italic' }}> for "${activeSearchTerm}"</span>}
            </span>
          )}
        </div>

        <div style={gamesGridStyle}>
          {filteredGames.map(game => {
            const { rating, priceInfo } = getGameData(game.id);
            
            return (
              <div 
                key={game.id} 
                style={gameCardStyle}
                className="game-card"
                onClick={() => navigate(`/product/${game.id}`)}
                title="Click to view product details"
              >
                <div style={priceContainerStyle} className="price-container">
                  {priceInfo.hasDiscount && (
                    <span style={originalPriceStyle}>${priceInfo.originalPrice.toFixed(2)}</span>
                  )}
                  <span style={currentPriceStyle}>${priceInfo.currentPrice.toFixed(2)}</span>
                </div>

                <div style={gameImageContainerStyle}>
                  {game.image?.original || game.image?.square_small ? (
                    <img
                      src={game.image.original || game.image.square_small}
                      alt={game.name}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div style={gameImagePlaceholderStyle}>
                      <FaGamepad style={gameIconStyle} />
                    </div>
                  )}
                </div>

                <div style={gameInfoStyle}>
                  <h3 
                    className="game-title"
                    style={{
                      ...gameTitleStyle,
                      cursor: 'pointer',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#00AEBB'}
                    onMouseLeave={(e) => e.target.style.color = '#1E232C'}
                  >
                    {game.name}
                  </h3>
                  <p style={gameDescriptionStyle}>
                    {game.deck || "No description available."}
                  </p>

                  <div style={gameTagsStyle}>
                    {game.genres?.slice(0, 2).map(genre => (
                      <span key={genre.id} style={gameTagStyle}>{genre.name}</span>
                    )) || game.platforms?.slice(0, 2).map(platform => (
                      <span key={platform.id} style={gameTagStyle}>{platform.abbreviation || platform.name}</span>
                    )) || (
                      <span style={gameTagStyle}>Game</span>
                    )}
                  </div>

                  <div style={gameRatingStyle}>
                    <FaStar style={starStyle} />
                    <span style={ratingTextStyle}>{rating}</span>
                  </div>

                  <div style={buttonColumnStyle}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(game.id);
                      }}
                      style={{
                        ...wishlistButtonNewStyle,
                        backgroundColor: wishlist.includes(game.id) ? '#e74c3c' : '#fff',
                        borderColor: wishlist.includes(game.id) ? '#e74c3c' : '#ddd',
                        color: wishlist.includes(game.id) ? '#fff' : '#666',
                      }}
                      title={wishlist.includes(game.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FaHeart style={{ marginRight: '0.5rem' }} />
                      {wishlist.includes(game.id) ? 'In Wishlist' : 'Add to Wishlist'}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(game);
                      }}
                      style={{
                        ...addToCartButtonStyle,
                        backgroundColor: addedToCart[game.id] ? '#27ae60' : (isInCart(game.id) ? '#00AEBB' : '#F7CA66'),
                        transition: 'all 0.3s ease',
                      }}
                      disabled={addedToCart[game.id]}
                    >
                      {addedToCart[game.id] ? (
                        <>
                          <FaCheck style={{ marginRight: '0.5rem' }} />
                          Added to cart
                        </>
                      ) : isInCart(game.id) ? (
                        <>
                          <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                          In Cart
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
          })}
        </div>

        {totalPages > 1 && !loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '2rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                ...loadMoreButtonStyle,
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === 1 ? '#ccc' : '#00AEBB',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.6 : 1
              }}
            >
              <FaChevronLeft style={{ marginRight: '0.25rem' }} />
              Previous
            </button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                style={{
                  ...loadMoreButtonStyle,
                  padding: '0.5rem 0.75rem',
                  minWidth: '2.5rem',
                  backgroundColor: pageNum === currentPage ? '#F7CA66' : '#00AEBB',
                  fontWeight: pageNum === currentPage ? '700' : '500'
                }}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                ...loadMoreButtonStyle,
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === totalPages ? '#ccc' : '#00AEBB',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.6 : 1
              }}
            >
              Next
              <FaChevronRight style={{ marginLeft: '0.25rem' }} />
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default Catalogue;