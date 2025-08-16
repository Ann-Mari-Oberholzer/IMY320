import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaHeart, FaGamepad, FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';
import {
  globalReset,
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
  discountBadgeStyle,
  wishlistButtonStyle,
  gameInfoStyle,
  gameTitleStyle,
  gameDescriptionStyle,
  gameTagsStyle,
  gameTagStyle,
  gameRatingStyle,
  starStyle,
  ratingTextStyle,
  reviewsTextStyle,
  gamePriceRowStyle,
  priceContainerStyle,
  originalPriceStyle,
  currentPriceStyle,
  addToCartButtonStyle,
  loadMoreContainerStyle,
  loadMoreButtonStyle
} from './catalogue';

// API configuration - same as landing page
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

function Catalogue() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

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

  // Handle add to cart
  const handleAddToCart = (gameId) => {
    // Set the game as added to cart
    setAddedToCart(prev => ({ ...prev, [gameId]: true }));
    
    // Reset the added state after 3 seconds
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [gameId]: false }));
    }, 3000);
    
    // Here you would typically call your API to add the item to cart
    console.log(`Added game ${gameId} to cart`);
  };

  // Fetch games from API
  const fetchGames = async (search = "", category = "All", sort = "popular", page = 1) => {
    try {
      setLoading(true);
      setError("");

      const offset = (page - 1) * gamesPerPage;

      // Build query parameters
      const params = new URLSearchParams({
        limit: gamesPerPage.toString(),
        offset: offset.toString(),
        field_list: "id,name,deck,image,site_detail_url,original_release_date,platforms,genres"
      });

      // Add search filter if provided
      if (search) {
        params.set("search", search);
      }

      // Add category filter if not "All"
      if (category !== "All") {
        // Map our categories to GameSpot genres/platforms if needed
        // For now, we'll use the search parameter for category filtering
        if (category) {
          params.set("search", category);
        }
      }

      // Add sorting
      switch (sort) {
        case "newest":
          params.set("sort", "original_release_date:desc");
          break;
        case "rating":
          // GameSpot doesn't have rating sorting, so we'll use popularity
          params.set("sort", "original_release_date:desc");
          break;
        default: // popular
          params.set("sort", "original_release_date:desc");
          break;
      }

      const response = await fetch(`${API_BASE}/api/games?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Backend error ${response.status}`);
      }

      const data = await response.json();
      
      setGames(Array.isArray(data?.results) ? data.results : []);
      
      // Calculate total pages based on total results
      // Note: GameSpot API might not always return total count, so we'll estimate
      const estimatedTotal = data?.total_count || (data?.results?.length === gamesPerPage ? 1000 : data?.results?.length);
      setTotalResults(estimatedTotal);
      setTotalPages(Math.ceil(estimatedTotal / gamesPerPage));
      
    } catch (err) {
      setError(err.message || "Failed to load games");
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle games per page change
  const handleGamesPerPageChange = (newGamesPerPage) => {
    setGamesPerPage(newGamesPerPage);
    setCurrentPage(1); // Reset to first page when changing games per page
  };

  // Filter and search games
  const filteredGames = games.filter(game => {
    const matchesSearch = searchTerm === "" || 
      game.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.deck?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || 
      game.genres?.some(genre => genre.name === selectedCategory) ||
      game.platforms?.some(platform => platform.name === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Initial load and when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchGames(searchTerm, selectedCategory, sortBy, 1);
  }, [searchTerm, selectedCategory, sortBy]);

  // Fetch games when page changes
  useEffect(() => {
    fetchGames(searchTerm, selectedCategory, sortBy, currentPage);
  }, [currentPage]);

  // Fetch games when games per page changes
  useEffect(() => {
    setCurrentPage(1);
    fetchGames(searchTerm, selectedCategory, sortBy, 1);
  }, [gamesPerPage]);

  const toggleWishlist = (gameId) => {
    setWishlist(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalReset;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // Adjust start if we're near the end
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div style={containerStyle}>
      <NavBar currentPage="catalogue" user={user} />
      
      {/* Full Page Loading Overlay */}
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
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <FaGamepad style={{
              fontSize: '3rem',
              color: '#00AEBB',
              animation: 'bounce 1s infinite'
            }} />
            <FaGamepad style={{
              fontSize: '3rem',
              color: '#F7CA66',
              animation: 'bounce 1s infinite 0.2s'
            }} />
            <FaGamepad style={{
              fontSize: '3rem',
              color: '#00AEBB',
              animation: 'bounce 1s infinite 0.4s'
            }} />
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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={selectStyle}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={filterGroupStyle}>
              <h3 style={filterTitleStyle}>Games Per Page</h3>
              <select
                value={gamesPerPage}
                onChange={(e) => handleGamesPerPageChange(Number(e.target.value))}
                style={selectStyle}
              >
                {gamesPerPageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
            </span>
          )}
        </div>

        <div style={gamesGridStyle}>
          {filteredGames.map(game => (
            <div key={game.id} style={gameCardStyle}>
              <div style={gameImageContainerStyle}>
                {game.image?.original || game.image?.square_small ? (
                  <img
                    src={game.image.original || game.image.square_small}
                    alt={game.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                <div style={gameImagePlaceholderStyle}>
                  <FaGamepad style={gameIconStyle} />
                </div>
                )}

                <button
                  onClick={() => toggleWishlist(game.id)}
                  style={{
                    ...wishlistButtonStyle,
                    color: wishlist.includes(game.id) ? '#e74c3c' : '#fff'
                  }}
                >
                  <FaHeart />
                </button>
              </div>

              <div style={gameInfoStyle}>
                <h3 style={gameTitleStyle}>{game.name}</h3>
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
                  <span style={ratingTextStyle}>4.5</span>
                  <span style={reviewsTextStyle}>(New)</span>
                </div>

                <div style={gamePriceRowStyle}>
                  <div style={priceContainerStyle}>
                    <span style={currentPriceStyle}>$59.99</span>
                  </div>
                  
                  <button 
                    style={{
                      ...addToCartButtonStyle,
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleAddToCart(game.id)}
                    disabled={addedToCart[game.id]}
                  >
                    {addedToCart[game.id] ? (
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
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && !loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Previous Page Button */}
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

            {/* Page Numbers */}
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

            {/* Next Page Button */}
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