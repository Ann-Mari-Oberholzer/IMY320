import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaShoppingCart, FaHeart, FaGamepad } from 'react-icons/fa';
import NavBar from '../components/NavBar';
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

const sampleGames = [
  {
    id: 1,
    title: "Cyber Quest 2077",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    image: "/game1.jpg",
    rating: 4.8,
    reviews: 2543,
    category: "Action",
    tags: ["Cyberpunk", "Open World", "RPG"],
    description: "An immersive cyberpunk adventure in a dystopian future."
  },
  {
    id: 2,
    title: "Fantasy Realms",
    price: 39.99,
    image: "/game2.jpg",
    rating: 4.6,
    reviews: 1876,
    category: "RPG",
    tags: ["Fantasy", "Magic", "Adventure"],
    description: "Explore magical worlds and cast powerful spells."
  },
  {
    id: 3,
    title: "Speed Racer X",
    price: 29.99,
    originalPrice: 49.99,
    discount: 40,
    image: "/game3.jpg",
    rating: 4.4,
    reviews: 987,
    category: "Racing",
    tags: ["Racing", "Cars", "Multiplayer"],
    description: "High-speed racing action with customizable vehicles."
  },
  {
    id: 4,
    title: "Puzzle Master",
    price: 19.99,
    image: "/game4.jpg",
    rating: 4.9,
    reviews: 3241,
    category: "Puzzle",
    tags: ["Puzzle", "Brain Training", "Casual"],
    description: "Challenge your mind with hundreds of unique puzzles."
  },
  {
    id: 5,
    title: "Space Commander",
    price: 44.99,
    originalPrice: 54.99,
    discount: 18,
    image: "/game5.jpg",
    rating: 4.7,
    reviews: 1654,
    category: "Strategy",
    tags: ["Space", "Strategy", "Sci-Fi"],
    description: "Command your fleet in epic space battles."
  },
  {
    id: 6,
    title: "Medieval Wars",
    price: 34.99,
    image: "/game6.jpg",
    rating: 4.5,
    reviews: 2198,
    category: "Strategy",
    tags: ["Medieval", "War", "Strategy"],
    description: "Build your kingdom and conquer your enemies."
  }
];

const categories = ["All", "Action", "RPG", "Racing", "Puzzle", "Strategy"];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" }
];

function Catalogue() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const filteredGames = sampleGames
    .filter(game => 
      (selectedCategory === "All" || game.category === selectedCategory) &&
      (searchTerm === "" || game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       game.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        default: return b.reviews - a.reviews;
      }
    });

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

  return (
    <div style={containerStyle}>
      <NavBar currentPage="catalogue" user={user} />
      
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
              placeholder="Search games or accesories..."
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
          </div>
        )}

        <div style={resultsInfoStyle}>
          <span>{filteredGames.length} items found</span>
        </div>

        <div style={gamesGridStyle}>
          {filteredGames.map(game => (
            <div key={game.id} style={gameCardStyle}>
              <div style={gameImageContainerStyle}>
                <div style={gameImagePlaceholderStyle}>
                  <FaGamepad style={gameIconStyle} />
                </div>
                
                {/* {game.discount && (
                  <div style={discountBadgeStyle}>
                    -{game.discount}%
                  </div>
                )} */}

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
                <h3 style={gameTitleStyle}>{game.title}</h3>
                <p style={gameDescriptionStyle}>{game.description}</p>

                <div style={gameTagsStyle}>
                  {game.tags.slice(0, 2).map(tag => (
                    <span key={tag} style={gameTagStyle}>{tag}</span>
                  ))}
                </div>

                <div style={gameRatingStyle}>
                  <FaStar style={starStyle} />
                  <span style={ratingTextStyle}>{game.rating}</span>
                  <span style={reviewsTextStyle}>({game.reviews.toLocaleString()})</span>
                </div>

                <div style={gamePriceRowStyle}>
                  <div style={priceContainerStyle}>
                    {/* {game.originalPrice && (
                      <span style={originalPriceStyle}>${game.originalPrice}</span>
                    )} */}
                    <span style={currentPriceStyle}>${game.price}</span>
                  </div>
                  
                  <button style={addToCartButtonStyle}>
                    <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={loadMoreContainerStyle}>
          <button style={loadMoreButtonStyle}>
            Load More Games
          </button>
        </div>
      </div>
    </div>
  );
}

export default Catalogue;