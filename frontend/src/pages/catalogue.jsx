import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaHeart, FaGamepad, FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp, FaCheck, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import favoritesService from '../services/FavouritesService';
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
  { value: "newest", label: "Newest Arrivals" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-high", label: "Price: Highest to Lowest" },
  { value: "price-low", label: "Price: Lowest to Highest" }
];

const gamesPerPageOptions = [
  { value: 10, label: "10 per page" },
  { value: 20, label: "20 per page" },
  { value: 30, label: "30 per page" },
  { value: 100, label: "100 per page" }
];

const priceRangeOptions = [
  { value: "all", label: "All Prices", min: 0, max: Infinity },
  { value: "10-50", label: "$10 - $50", min: 10, max: 50 },
  { value: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { value: "100-200", label: "$100 - $200", min: 100, max: 200 },
  { value: "200-500", label: "$200 - $500", min: 200, max: 500 },
  { value: "500-1000", label: "$500 - $1,000", min: 500, max: 1000 },
  { value: "1000-5000", label: "$1,000 - $5,000", min: 1000, max: 5000 },
  { value: "5000-10000", label: "$5,000 - $10,000", min: 5000, max: 10000 },
  { value: "10000+", label: "$10,000+", min: 10000, max: Infinity }
];

const ratingOptions = [
  { value: 0, label: "All Ratings" },
  { value: 4, label: "4★ & up" },
  { value: 3, label: "3★ & up" },
  { value: 2, label: "2★ & up" },
  { value: 1, label: "1★ & up" }
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
  const location = useLocation();
  const { user } = useUser();
  const { addToCart, updateQuantity, removeFromCart, cartItems, getCartItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false); // Filters hidden by default
  const [selectOpen, setSelectOpen] = useState(false);
  const catalogueTopRef = React.useRef(null);

  // Pagination state
  const [allGames, setAllGames] = useState([]); // Store all fetched games
  const [games, setGames] = useState([]); // Display games for current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [gamesPerPage, setGamesPerPage] = useState(20);

  // Cart interaction state
  const [addedToCart, setAddedToCart] = useState({});
  const [cartQuantities, setCartQuantities] = useState({}); // Track quantity for each game in cart
  const [showDropdown, setShowDropdown] = useState({}); // Track which dropdowns are open
  const [selectedQuantity, setSelectedQuantity] = useState({}); // Track selected quantity before adding to cart

  // Cache for generated prices and ratings
  const [gameDataCache, setGameDataCache] = useState({});

  // Temporary filter states (before applying)
  const [tempPriceRange, setTempPriceRange] = useState("all");
  const [tempSelectedBrand, setTempSelectedBrand] = useState("all");
  const [tempMinRating, setTempMinRating] = useState(0);

  // Applied filter states (actual filters being used)
  const [priceRange, setPriceRange] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [minRating, setMinRating] = useState(0); // 0 means no filter


  // Handle URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
      setActiveSearchTerm(searchParam);
    }
  }, [location.search]);

  // Handle tag click - update search and filter
  const handleTagClick = (tagName, event) => {
    event.preventDefault();
    event.stopPropagation();
    setSearchTerm(tagName);
    setActiveSearchTerm(tagName);
    setCurrentPage(1);
    setLoading(true);
    navigate(`/catalogue?search=${encodeURIComponent(tagName)}`, { replace: true });
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setActiveSearchTerm(searchTerm);
      setCurrentPage(1);
      setLoading(true);
    }
  };

  const handleSearchClick = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
    setLoading(true);
  };

  const handleAddToCart = async (game, quantity = 1) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Close dropdown
    setShowDropdown(prev => ({ ...prev, [game.id]: false }));

    // Check if this is a custom product
    let productData;
    if (game.isCustomProduct && game.originalProduct) {
      // Use the original product data for custom products
      const original = game.originalProduct;
      console.log('Adding custom product to cart:', original);
      productData = {
        id: original.id,
        name: original.name,
        description: original.description || 'No description available',
        image: original.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
        price: parseFloat(original.price) || 0,
        originalPrice: null,
        tags: original.tags || original.features || [],
        hasDiscount: false,
        brand: original.brand,
        category: original.category,
        inStock: original.inStock !== false,
        rating: original.rating || 4.0
      };
    } else {
      // Get the same price data that's being displayed for API games
      const { priceInfo } = getGameData(game.id);

      productData = {
        id: game.id,
        name: game.name,
        description: game.deck || 'No description available',
        image: game.image?.original || game.image?.square_small || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
        price: priceInfo.currentPrice,
        originalPrice: priceInfo.hasDiscount ? priceInfo.originalPrice : null,
        tags: game.genres?.map(g => g.name) || [],
        hasDiscount: priceInfo.hasDiscount
      };
    }

    console.log('Final product data for cart:', productData);
    const success = await addToCart(productData, quantity);
    if (success) {
      // Show "Added to cart" confirmation
      setAddedToCart(prev => ({ ...prev, [game.id]: true }));

      // After 2 seconds, hide the confirmation and show yellow button again
      setTimeout(() => {
        setAddedToCart(prev => ({ ...prev, [game.id]: false }));
        setSelectedQuantity(prev => ({ ...prev, [game.id]: 1 })); // Reset to 1
      }, 2000);
    }
  };

  const toggleDropdown = (gameId) => {
    setShowDropdown(prev => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  const handleQuantitySelect = async (game, quantity) => {
    await handleAddToCart(game, quantity);
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

  // Get unique brands from all games (only custom products have brands)
  const availableBrands = React.useMemo(() => {
    const brands = new Set();
    allGames.forEach(game => {
      if (game.isCustomProduct && game.originalProduct?.brand) {
        brands.add(game.originalProduct.brand);
      }
    });
    return Array.from(brands).sort();
  }, [allGames]);

  // Apply filters function
  const applyFilters = async () => {
    setLoading(true);
    setPriceRange(tempPriceRange);
    setSelectedBrand(tempSelectedBrand);
    setMinRating(tempMinRating);
    setCurrentPage(1); // Reset to first page when filters are applied
    setShowFilters(false); // Close filters panel

    // Show loading animation for consistent UX
    await new Promise(resolve => setTimeout(resolve, 3000));
    setLoading(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setTempPriceRange("all");
    setTempSelectedBrand("all");
    setTempMinRating(0);
    setPriceRange("all");
    setSelectedBrand("all");
    setMinRating(0);
    setCurrentPage(1);
  };

  const fetchGames = useCallback(async (search = "") => {
    try {
      setLoading(true);
      setError("");

      // Fetch custom products from db.json
      let customProducts = [];
      try {
        const productsResponse = await fetch(`${API_BASE}/api/products`);
        if (productsResponse.ok) {
          customProducts = await productsResponse.json();
          console.log('Fetched custom products:', customProducts);
        }
      } catch (error) {
        console.warn('Could not fetch custom products:', error);
      }

      // Fetch games from GiantBomb API
      const params = new URLSearchParams({
        limit: "100",
        offset: "0",
        field_list: "id,name,deck,image,site_detail_url,original_release_date,platforms,genres"
      });

      if (search) params.set("search", search);

      // Note: Sorting and category filtering are done client-side for consistency
      // This ensures accurate filtering based on game genres/platforms

      const response = await fetch(`${API_BASE}/api/games?${params.toString()}`);

      if (!response.ok) throw new Error(`Backend error ${response.status}`);

      const data = await response.json();
      const apiGames = Array.isArray(data?.results) ? data.results : [];

      // Transform custom products to match API game format
      const transformedProducts = customProducts.map(product => ({
        id: product.id,
        name: product.name,
        deck: product.description || product.deck,
        image: {
          original: product.image,
          square_small: product.image
        },
        original_release_date: product.createdAt,
        platforms: product.platform ? [{ name: product.platform }] : [],
        genres: product.tags?.map(tag => ({ name: tag })) ||
                product.features?.map(feature => ({ name: feature })) ||
                [{ name: product.category }],
        // Custom product flag
        isCustomProduct: true,
        // Store original product data
        originalProduct: product
      }));

      // Merge custom products with API games (custom products first)
      const mergedGames = [...transformedProducts, ...apiGames];
      console.log('Merged games (custom + API):', mergedGames.length, 'total');

      setAllGames(mergedGames);

      const estimatedTotal = mergedGames.length;
      setTotalResults(estimatedTotal);

      // Ensure loading screen shows for at least 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (err) {
      setError(err.message || "Failed to load games");
      console.error("Error fetching games:", err);
      await new Promise(resolve => setTimeout(resolve, 3000));
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      // Scroll to top using multiple methods to ensure it works
      if (catalogueTopRef.current) {
        catalogueTopRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      setLoading(true);
      setCurrentPage(newPage);

      // Show loading animation for consistent UX
      await new Promise(resolve => setTimeout(resolve, 3000));
      setLoading(false);
    }
  };

  const handlePageChangeAndScroll = (pageNum) => {
    handlePageChange(pageNum);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleGamesPerPageChange = (newGamesPerPage) => {
    setGamesPerPage(newGamesPerPage);
    setCurrentPage(1);
  };

  // Filter and sort all games
  const filteredAndSortedGames = allGames.filter(game => {
    const matchesSearch = activeSearchTerm === "" ||
      game.name?.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      game.deck?.toLowerCase().includes(activeSearchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" ||
      game.genres?.some(genre => genre.name === selectedCategory) ||
      game.platforms?.some(platform => platform.name === selectedCategory);

    // Price filter
    const gamePrice = game.isCustomProduct && game.originalProduct?.price
      ? parseFloat(game.originalProduct.price)
      : getGameData(game.id).priceInfo.currentPrice;

    const selectedPriceRange = priceRangeOptions.find(opt => opt.value === priceRange);
    const matchesPrice = priceRange === "all" ||
      (gamePrice >= selectedPriceRange.min && gamePrice <= selectedPriceRange.max);

    // Brand filter
    const gameBrand = game.isCustomProduct && game.originalProduct?.brand
      ? game.originalProduct.brand
      : null;
    const matchesBrand = selectedBrand === "all" ||
      (gameBrand && gameBrand === selectedBrand);

    // Rating filter
    const gameRating = game.isCustomProduct && game.originalProduct?.rating
      ? parseFloat(game.originalProduct.rating)
      : getGameData(game.id).rating;
    const matchesRating = minRating === 0 || gameRating >= minRating;

    return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesRating;
  }).sort((a, b) => {
    // Client-side sorting based on the selected sort option
    switch (sortBy) {
      case "rating": {
        // Sort by highest rating
        // For custom products, use their stored rating, or generate one if missing
        let ratingA, ratingB;

        if (a.isCustomProduct) {
          ratingA = a.originalProduct?.rating
            ? parseFloat(a.originalProduct.rating)
            : getGameData(a.id).rating;
        } else {
          ratingA = getGameData(a.id).rating;
        }

        if (b.isCustomProduct) {
          ratingB = b.originalProduct?.rating
            ? parseFloat(b.originalProduct.rating)
            : getGameData(b.id).rating;
        } else {
          ratingB = getGameData(b.id).rating;
        }

        // Ensure we have valid numbers for comparison (default to 0 if invalid)
        const finalRatingA = isNaN(ratingA) || ratingA === undefined ? 0 : ratingA;
        const finalRatingB = isNaN(ratingB) || ratingB === undefined ? 0 : ratingB;

        return finalRatingB - finalRatingA; // Descending order
      }
      case "price-high": {
        // Sort by price: highest to lowest
        // For custom products, use their stored price
        const priceA = a.isCustomProduct && a.originalProduct?.price
          ? a.originalProduct.price
          : getGameData(a.id).priceInfo.currentPrice;
        const priceB = b.isCustomProduct && b.originalProduct?.price
          ? b.originalProduct.price
          : getGameData(b.id).priceInfo.currentPrice;
        return priceB - priceA; // Descending order
      }
      case "price-low": {
        // Sort by price: lowest to highest
        // For custom products, use their stored price
        const priceA = a.isCustomProduct && a.originalProduct?.price
          ? a.originalProduct.price
          : getGameData(a.id).priceInfo.currentPrice;
        const priceB = b.isCustomProduct && b.originalProduct?.price
          ? b.originalProduct.price
          : getGameData(b.id).priceInfo.currentPrice;
        return priceA - priceB; // Ascending order
      }
      case "newest": {
        // Sort by release date (newest first)
        // For custom products, use createdAt
        const dateA = a.isCustomProduct && a.originalProduct?.createdAt
          ? new Date(a.originalProduct.createdAt)
          : (a.original_release_date ? new Date(a.original_release_date) : new Date(0));
        const dateB = b.isCustomProduct && b.originalProduct?.createdAt
          ? new Date(b.originalProduct.createdAt)
          : (b.original_release_date ? new Date(b.original_release_date) : new Date(0));
        return dateB - dateA; // Descending order
      }
      default: {
        // Default: sort by rating (same as "rating" case)
        let ratingA, ratingB;

        if (a.isCustomProduct) {
          ratingA = a.originalProduct?.rating
            ? parseFloat(a.originalProduct.rating)
            : getGameData(a.id).rating;
        } else {
          ratingA = getGameData(a.id).rating;
        }

        if (b.isCustomProduct) {
          ratingB = b.originalProduct?.rating
            ? parseFloat(b.originalProduct.rating)
            : getGameData(b.id).rating;
        } else {
          ratingB = getGameData(b.id).rating;
        }

        // Ensure we have valid numbers for comparison (default to 0 if invalid)
        const finalRatingA = isNaN(ratingA) || ratingA === undefined ? 0 : ratingA;
        const finalRatingB = isNaN(ratingB) || ratingB === undefined ? 0 : ratingB;

        return finalRatingB - finalRatingA; // Descending order
      }
    }
  });

  // Apply client-side pagination
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const paginatedGames = filteredAndSortedGames.slice(startIndex, endIndex);

  const toggleWishlist = (game) => {
    if (!user?.id) {
      alert('Please log in to add items to your wishlist');
      return;
    }

    // Check if this is a custom product
    let productData;
    if (game.isCustomProduct && game.originalProduct) {
      const original = game.originalProduct;
      productData = {
        id: original.id,
        name: original.name,
        description: original.description || 'No description available',
        image: original.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
        price: parseFloat(original.price) || 0,
        originalPrice: null,
        tags: original.tags || original.features || [],
        hasDiscount: false
      };
    } else {
      const { priceInfo } = getGameData(game.id);
      productData = {
        id: game.id,
        name: game.name,
        description: game.deck || 'No description available',
        image: game.image?.original || game.image?.square_small || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
        price: priceInfo.currentPrice,
        originalPrice: priceInfo.hasDiscount ? priceInfo.originalPrice : null,
        tags: game.genres?.map(g => g.name) || [],
        hasDiscount: priceInfo.hasDiscount
      };
    }

    if (favoritesService.isFavorite(user.id, game.id)) {
      favoritesService.removeFromFavorites(user.id, game.id);
    } else {
      favoritesService.addToFavorites(user.id, productData);
    }
    
    // Force re-render
    setWishlistUpdated(prev => prev + 1);
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

  // Fetch games when search term changes (sorting and category filtering are client-side only)
  useEffect(() => {
    setCurrentPage(1);
    fetchGames(activeSearchTerm, "All");
  }, [activeSearchTerm, fetchGames]);

  // Reset to page 1 when category changes (without re-fetching)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Update pagination when filtered games or games per page changes
  useEffect(() => {
    const totalFiltered = filteredAndSortedGames.length;
    setTotalResults(totalFiltered);
    setTotalPages(Math.ceil(totalFiltered / gamesPerPage) || 1);

    // Reset to page 1 if current page is out of bounds
    if (currentPage > Math.ceil(totalFiltered / gamesPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredAndSortedGames.length, gamesPerPage, currentPage]);

  // Scroll to top when page changes
  useEffect(() => {
    if (catalogueTopRef.current) {
      catalogueTopRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentPage]);

   useEffect(() => {
     const styleElement = document.createElement("style");
     styleElement.textContent = globalReset + `
       @keyframes bounce {
         0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
         40% { transform: translateY(-10px); }
         60% { transform: translateY(-5px); }
       }
       
       @keyframes loadingProgress {
         0% {
           transform: translateX(-100%);
         }
         50% {
           transform: translateX(0%);
         }
         100% {
           transform: translateX(100%);
         }
       }
       
       @keyframes pulse {
         0%, 100% {
           opacity: 0.3;
           transform: scale(0.8);
         }
         50% {
           opacity: 1;
           transform: scale(1.2);
         }
       }
     `;
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
           backgroundColor: 'rgba(248, 249, 250, 1)',
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
        <div ref={catalogueTopRef} style={headerStyle}>
          <h1 style={titleStyle}>Game Catalogue</h1>
          <p style={subtitleStyle}>Discover amazing games and accessories for every player</p>
        </div>

        <div style={searchFilterStyle}>
          <div style={searchContainerStyle}>
            <input
              type="text"
              placeholder="Search games or accessories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              style={searchInputStyle}
            />
            <button
              onClick={handleSearchClick}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <FaSearch
                style={{
                  color: '#00AEBB',
                  fontSize: '1.5rem',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F7CA66')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#00AEBB')}
              />
            </button>
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
                       ...(selectedCategory === category ? activeCategoryStyle : {}),
                       transition: 'all 0.3s ease'
                     }}
                     onMouseEnter={(e) => {
                       if (selectedCategory !== category) {
                         e.target.style.backgroundColor = '#f0f7ff';
                         e.target.style.borderColor = '#00AEBB';
                         e.target.style.color = '#00AEBB';
                         e.target.style.transform = 'translateY(-2px)';
                         e.target.style.boxShadow = '0 4px 8px rgba(0, 174, 187, 0.15)';
                       }
                     }}
                     onMouseLeave={(e) => {
                       if (selectedCategory !== category) {
                         e.target.style.backgroundColor = '#fff';
                         e.target.style.borderColor = '#ddd';
                         e.target.style.color = '#666';
                         e.target.style.transform = 'translateY(0)';
                         e.target.style.boxShadow = 'none';
                       }
                     }}
                   >
                     {category}
                   </button>
                 ))}
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  color: '#1E232C'
                }}>
                  <input
                    type="checkbox"
                    checked={showOnSale}
                    onChange={(e) => setShowOnSale(e.target.checked)}
                    style={{
                      marginRight: '0.5rem',
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: '#00AEBB'
                    }}
                  />
                  Show only items on sale
                </label>
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

            {/* Price Range Filter */}
            <div style={filterGroupStyle}>
              <h3 style={filterTitleStyle}>Price Range</h3>
              <div style={enhancedSelectStyles.container}>
                <select
                  value={tempPriceRange}
                  onChange={(e) => setTempPriceRange(e.target.value)}
                  style={{ ...selectStyle, ...enhancedSelectStyles.select }}
                >
                  {priceRangeOptions.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                      style={enhancedSelectStyles.option}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown style={enhancedSelectStyles.icon} />
              </div>

              {/* Brand Filter - nested inside Price Range */}
              {availableBrands.length > 0 && (
                <>
                  <h3 style={filterTitleStyle}>Brand</h3>
                  <div style={enhancedSelectStyles.container}>
                    <select
                      value={tempSelectedBrand}
                      onChange={(e) => setTempSelectedBrand(e.target.value)}
                      style={{ ...selectStyle, ...enhancedSelectStyles.select }}
                    >
                      <option value="all" style={enhancedSelectStyles.option}>
                        All Brands
                      </option>
                      {availableBrands.map(brand => (
                        <option
                          key={brand}
                          value={brand}
                          style={enhancedSelectStyles.option}
                        >
                          {brand}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown style={enhancedSelectStyles.icon} />
                  </div>
                </>
              )}
            </div>

            {/* Rating Filter */}
            <div style={filterGroupStyle}>
              <h3 style={filterTitleStyle}>Minimum Rating</h3>
              <div style={enhancedSelectStyles.container}>
                <select
                  value={tempMinRating}
                  onChange={(e) => setTempMinRating(Number(e.target.value))}
                  style={{ ...selectStyle, ...enhancedSelectStyles.select }}
                >
                  {ratingOptions.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                      style={enhancedSelectStyles.option}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown style={enhancedSelectStyles.icon} />
              </div>

              {/* Filter Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e0e0e0'
            }}>
              <button
                onClick={applyFilters}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#00AEBB',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#008a99';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 174, 187, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#00AEBB';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <FaCheck />
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#fff',
                  color: '#666',
                  border: '2px solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.borderColor = '#999';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.borderColor = '#ddd';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <FaTimes />
                Clear
              </button>
            </div>
            </div>
          </div>
        )}

        <div style={resultsInfoStyle}>
          {error ? (
            <span style={{ color: '#e74c3c' }}>Error: {error}</span>
          ) : (
            <span>
              Showing {paginatedGames.length} games
              {totalResults > 0 && ` of ${totalResults.toLocaleString()}`}
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              {activeSearchTerm && <span style={{ fontStyle: 'italic' }}> for "{activeSearchTerm}"</span>}
            </span>
          )}
        </div>

        {paginatedGames.length === 0 && !loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            margin: '0 auto',
            maxWidth: '400px',
          }}>
            <FaGamepad style={{ fontSize: '3rem', color: '#ddd', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E232C', marginBottom: '0.75rem' }}>
              No Games Found
            </h2>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#00AEBB',
                color: '#fff',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                marginTop: '0.5rem'
              }}
              onClick={() => {
                setActiveSearchTerm("");
                setSearchTerm("");
                setSelectedCategory("All");
                clearFilters();
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(0, 174, 187, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FaGamepad />
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={gamesGridStyle}>
            {paginatedGames.map(game => {
            // Use custom product price if available, otherwise generate random price
            let rating, priceInfo;
            if (game.isCustomProduct && game.originalProduct) {
              rating = game.originalProduct.rating || 4.0;
              priceInfo = {
                currentPrice: game.originalProduct.price,
                originalPrice: null,
                hasDiscount: false
              };
            } else {
              const gameData = getGameData(game.id);
              rating = gameData.rating;
              priceInfo = gameData.priceInfo;
            }

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

                {priceInfo.hasDiscount && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: '#27ae60',
                    color: '#fff',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    zIndex: 10,
                  }}>
                    SALE
                  </div>
                )}

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
                      <span 
                        key={genre.id} 
                        onClick={(e) => handleTagClick(genre.name, e)}
                        style={{
                          ...gameTagStyle,
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
                    )) || game.platforms?.slice(0, 2).map(platform => (
                      <span 
                        key={platform.id} 
                        onClick={(e) => handleTagClick(platform.abbreviation || platform.name, e)}
                        style={{
                          ...gameTagStyle,
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
                        toggleWishlist(game);
                      }}
                      style={{
                        ...wishlistButtonNewStyle,
                        backgroundColor: isInWishlist ? '#3c89e7ff' : '#fff',
                        borderColor: isInWishlist ? '#3c89e7ff' : '#ddd',
                        color: isInWishlist ? '#fff' : '#666',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'translateY(0)',
                        boxShadow: isInWishlist ? '0 4px 12px rgba(60, 137, 231, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      onMouseEnter={(e) => {
                        if (isInWishlist) {
                          e.target.style.transform = 'translateY(-2px) scale(1.02)';
                          e.target.style.boxShadow = '0 6px 16px rgba(60, 137, 231, 0.4)';
                          e.target.style.backgroundColor = '#3c89e7ff';
                        } else {
                          e.target.style.transform = 'translateY(-2px) scale(1.02)';
                          e.target.style.boxShadow = '0 4px 12px rgba(60, 137, 231, 0.3)';
                          e.target.style.backgroundColor = '#3c89e7ff';
                          e.target.style.borderColor = '#3c89e7ff';
                          e.target.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isInWishlist) {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 4px 12px rgba(60, 137, 231, 0.3)';
                          e.target.style.backgroundColor = '#3c89e7ff';
                        } else {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          e.target.style.backgroundColor = '#fff';
                          e.target.style.borderColor = '#ddd';
                          e.target.style.color = '#666';
                        }
                      }}
                    >
                      <FaHeart style={{ marginRight: '0.5rem' }} />
                      {favoritesService.isFavorite(user?.id, game.id) ? 'In Wishlist' : 'Add to Wishlist'}
                    </button>
                    <div style={{ position: 'relative', width: '160px' }}>
                      {addedToCart[game.id] ? (
                        <button
                          style={{
                            ...addToCartButtonStyle,
                            backgroundColor: '#27ae60',
                            cursor: 'default',
                          }}
                          disabled
                        >
                          <FaCheck style={{ marginRight: '0.5rem' }} />
                          Added to Cart
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(game.id);
                            }}
                            style={{
                              ...addToCartButtonStyle,
                              backgroundColor: '#F7CA66',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                            Add to Cart
                            <FaChevronDown style={{ marginLeft: '0.25rem', fontSize: '0.8rem' }} />
                          </button>

                          {showDropdown[game.id] && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: '#fff',
                                border: '2px solid #F7CA66',
                                borderRadius: '0.5rem',
                                marginBottom: '0.25rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 100,
                                overflow: 'hidden'
                              }}
                            >
                              {[1, 2, 3, 4, 5].map(qty => (
                                <div
                                  key={qty}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantitySelect(game, qty);
                                  }}
                                  style={{
                                    padding: '0.75rem 1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    color: '#1E232C',
                                    borderBottom: qty < 5 ? '1px solid #f0f0f0' : 'none'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#FFF9E6';
                                    e.target.style.color = '#F7CA66';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#fff';
                                    e.target.style.color = '#1E232C';
                                  }}
                                >
                                  {qty} {qty === 1 ? 'item' : 'items'}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}

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
                onClick={() => handlePageChangeAndScroll(pageNum)}
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

            {/* Next page button */}
            <button
              onClick={() => handlePageChangeAndScroll(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                ...loadMoreButtonStyle,
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === totalPages ? '#ccc' : '#00AEBB',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.6 : 1
              }}
              title="Next page"
            >
              &gt;
            </button>

            {/* Last page button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                ...loadMoreButtonStyle,
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === totalPages ? '#ccc' : '#00AEBB',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.6 : 1
              }}
              title="Last page"
            >
              &gt;&gt;
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default Catalogue;