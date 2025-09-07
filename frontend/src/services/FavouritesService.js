// Favorites service to handle localStorage operations
class FavoritesService {
  constructor() {
    // Memory fallback for environments without localStorage
    this.memoryFavorites = {};
  }

  getFavorites(userId) {
    if (typeof localStorage === 'undefined') {
      // Fallback for environments without localStorage
      return this.memoryFavorites[userId] || [];
    }
    try {
      const favorites = localStorage.getItem(`favorites_${userId}`);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites from localStorage:', error);
      return [];
    }
  }

  addToFavorites(userId, product) {
    if (typeof localStorage === 'undefined') {
      // Fallback for environments without localStorage
      if (!this.memoryFavorites[userId]) {
        this.memoryFavorites[userId] = [];
      }
      if (!this.memoryFavorites[userId].find(fav => fav.id === product.id)) {
        this.memoryFavorites[userId].push(product);
      }
      return;
    }
    
    try {
      const favorites = this.getFavorites(userId);
      if (!favorites.find(fav => fav.id === product.id)) {
        favorites.push(product);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  removeFromFavorites(userId, productId) {
    if (typeof localStorage === 'undefined') {
      // Fallback for environments without localStorage
      if (this.memoryFavorites[userId]) {
        this.memoryFavorites[userId] = this.memoryFavorites[userId].filter(fav => fav.id !== productId);
      }
      return;
    }
    
    try {
      const favorites = this.getFavorites(userId);
      const updatedFavorites = favorites.filter(fav => fav.id !== productId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  isFavorite(userId, productId) {
    const favorites = this.getFavorites(userId);
    return favorites.some(fav => fav.id === productId);
  }

  clearFavorites(userId) {
    if (typeof localStorage === 'undefined') {
      // Fallback for environments without localStorage
      if (this.memoryFavorites[userId]) {
        this.memoryFavorites[userId] = [];
      }
      return;
    }

    try {
      localStorage.removeItem(`favorites_${userId}`);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }

  getFavoritesCount(userId) {
    const favorites = this.getFavorites(userId);
    return favorites.length;
  }
}

// Create a single instance and export it
const favoritesServiceInstance = new FavoritesService();
export default favoritesServiceInstance;