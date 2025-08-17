// Utility functions for generating consistent game data based on game ID
// This ensures the same game always has the same price, rating, and review count

export const generateRandomPrice = (gameId) => {
  // Use game ID to generate consistent prices
  const seed = gameId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = 10 + (seed % 51); // Price between 10-60
  const hasDiscount = (seed % 10) > 6; // 30% chance of discount
  const discount = hasDiscount ? 10 + (seed % 21) : 0; // Discount between 10-30%
  
  return {
    originalPrice: basePrice + (basePrice * discount / 100),
    currentPrice: basePrice,
    hasDiscount: hasDiscount
  };
};

export const generateRandomRating = (gameId) => {
  // Use game ID to generate consistent ratings
  const seed = gameId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseRating = 3 + ((seed % 21) / 10); // Rating between 3.0-5.0
  return Math.round(baseRating * 10) / 10;
};

export const generateRandomReviewsCount = (gameId) => {
  // Use game ID to generate consistent review counts
  const seed = gameId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 10 + (seed % 91); // Reviews between 10-100
};
