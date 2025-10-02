export const big = {
  minHeight: "100vh",
  fontFamily: "'Inter', sans-serif",
  backgroundColor: "#f8f9fa",
  width: "100%",
  overflowX: "hidden",
};

export const container = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "24px 20px",
  minHeight: "auto",
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  boxSizing: "border-box",
  gap: "32px",
  overflow: "visible", // Ensure content is not cut off
};

export const card = {
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  maxWidth: "1200px",
  width: "100%",
  overflow: "visible", // Allow content to be visible
  position: "relative",
  margin: "0",
  minHeight: "400px",
  boxSizing: "border-box",
};

export const imageSection = {
  flex: "0 0 280px",
  minWidth: "250px",
  maxWidth: "320px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f8f9fa",
  padding: "20px",
  position: "relative",
  boxSizing: "border-box",
};

export const bigImage = {
  width: "100%",
  maxWidth: "280px",
  height: "auto",
  maxHeight: "300px",
  borderRadius: "12px",
  objectFit: "cover",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
};

export const details = {
  flex: "2",
  padding: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  minWidth: "400px",
  position: "relative",
  boxSizing: "border-box",
  justifyContent: "flex-start",
};

export const title = {
  fontSize: '2.2rem',
  fontWeight: '700',
  color: '#1E232C',
  margin: '0',
  lineHeight: '1.2',
};

export const price = {
  fontSize: "2.4rem",
  fontWeight: "700",
  color: "#00AEBB",
  margin: "0",
  display: "flex",
  alignItems: "baseline",
  gap: "0.5rem",
};

export const description = {
  lineHeight: "1.6",
  color: '#666',
  fontSize: '1rem',
  margin: '0',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
};

export const specs = {
  backgroundColor: "#f8f9fa",
  padding: "20px",
  borderRadius: "12px",
  fontSize: "15px",
  color: "#444",
  boxSizing: "border-box",
  border: "1px solid #e9ecef",
};

export const ratingContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

export const starStyle = {
  color: '#F7CA66',
  fontSize: '1.1rem',
};

export const ratingStyle = {
  fontWeight: '700',
  color: '#1E232C',
  fontSize: '1.1rem',
};

export const categories = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

export const category = {
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: '500',
  border: '1px solid #bbdefb',
};

export const button = {
  padding: "14px 24px",
  backgroundColor: "#F7CA66",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: "border-box",
  minWidth: 0,
  boxShadow: "0 4px 12px rgba(247, 202, 102, 0.3)",
};

export const wishlistButton = {
  padding: "14px 16px",
  backgroundColor: "#fff",
  color: "rgba(0, 0, 0, 0.5)",
  fontSize: "18px",
  border: "2px solid rgba(0, 0, 0, 0.3)",
  borderRadius: "10px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
  minWidth: 0,
  transition: "all 0.3s ease",
};

export const buttonHover = {
  backgroundColor: "#00AEBB",
};

// Add bounce animation for loading state
export const bounceAnimation = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

// Add spin animation for loading spinner
export const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Similar products section with improved layout
export const similarSection = {
  marginTop: "20px",
  backgroundColor: "#fff",
  borderRadius: "20px",
  padding: "40px 36px",
  width: "100%",
  boxSizing: "border-box",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
  border: "1px solid #f0f0f0",
  overflow: "visible", // Ensure content is not cut off
};

export const similarSectionTitle = {
  fontSize: "2.2rem",
  fontWeight: "700",
  color: "#1E232C",
  marginBottom: "12px",
  textAlign: "center",
  lineHeight: "1.2",
};

export const similarSectionSubtitle = {
  textAlign: "center",
  color: "#666",
  marginBottom: "32px",
  fontSize: "1.1rem",
  fontWeight: "400",
};

// Grid container for similar products
export const similarGridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "24px",
  maxWidth: "1000px",
  margin: "0 auto",
};

// Card item for similar products
export const similarCardItem = {
  backgroundColor: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  border: "1px solid #f0f0f0",
  display: "flex",
  flexDirection: "column",
  height: "100%",
};

export const similarItemImage = {
  width: "100%",
  height: "180px",
  overflow: "hidden",
  position: "relative",
  backgroundColor: "#f8f9fa",
};

export const similarItemContent = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  flex: "1",
};

export const similarItemTitle = {
  fontSize: "1.25rem",
  fontWeight: "600",
  color: "#1E232C",
  margin: "0",
  lineHeight: "1.3",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const similarItemDescription = {
  color: "#666",
  fontSize: "0.9rem",
  margin: "0",
  lineHeight: "1.5",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  flex: "1",
};

export const similarItemMeta = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "auto",
  paddingTop: "8px",
};

export const similarItemRating = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "0.9rem",
  color: "#666",
};

export const similarItemPrice = {
  fontSize: "1.2rem",
  fontWeight: "700",
  color: "#00AEBB",
  display: "flex",
  alignItems: "baseline",
  gap: "6px",
};

export const similarItemActions = {
  padding: "16px 20px 20px",
  display: "flex",
  gap: "8px",
  borderTop: "1px solid #f0f0f0",
  marginTop: "auto",
};

export const similarItemButton = {
  padding: "10px 16px",
  fontSize: "0.9rem",
  fontWeight: "500",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  justifyContent: "center",
  flex: "1",
};

export const similarItemAddButton = {
  backgroundColor: "#F7CA66",
  color: "#fff",
  boxShadow: "0 2px 8px rgba(247, 202, 102, 0.3)",
};

export const similarItemWishlistButton = {
  backgroundColor: "#fff",
  color: "#666",
  border: "1px solid #ddd",
  flex: "0 0 auto",
  minWidth: "44px",
  padding: "10px",
};

// Carousel styles for 3-card display - Image-focused
export const carouselContainer = {
  position: "relative",
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  padding: "0 60px", // Add padding to make room for arrows
  overflow: "visible", // Allow content to be visible
};

export const carouselTrack = {
  display: "flex",
  justifyContent: "flex-start",
  gap: "2rem",
  flexWrap: "nowrap",
  width: "100%",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "visible",
  paddingLeft: "0px",
  marginLeft: "-20px",
};

export const carouselSlide = {
  flex: "0 0 320px",
  width: "320px",
  display: "flex",
  justifyContent: "center",
  margin: "0 8px",
};

export const carouselNavigation = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  marginTop: "32px",
};

export const carouselButton = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "45px",
  height: "45px",
  backgroundColor: "#00AEBB",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "1.1rem",
  fontWeight: "600",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 12px rgba(0, 174, 187, 0.3)",
  zIndex: 10,
};

export const wishlistButtonNewStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem 1rem',
  backgroundColor: '#fff',
  color: '#666',
  border: 'none',
  borderRadius: '0.5rem',
  fontSize: '0.9rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  width: '160px',
  marginTop: 'auto',
};

export const carouselButtonLeft = {
  left: "10px",
};

export const carouselButtonRight = {
  right: "10px",
};

export const carouselButtonDisabled = {
  backgroundColor: "#ccc",
  cursor: "not-allowed",
  opacity: 0.6,
  boxShadow: "none",
};

export const carouselDots = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  marginTop: "20px",
};

export const carouselDot = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: "#ddd",
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: "none",
};

export const carouselDotActive = {
  backgroundColor: "#00AEBB",
  transform: "scale(1.2)",
};

// Detailed product information section styles
export const productInfoSection = {
  marginTop: "20px",
  backgroundColor: "#fff",
  borderRadius: "20px",
  padding: "40px 36px",
  width: "100%",
  boxSizing: "border-box",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
  border: "1px solid #f0f0f0",
  overflow: "visible",
};

export const productInfoTitle = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "#1E232C",
  marginBottom: "24px",
  textAlign: "left",
  lineHeight: "1.2",
};

export const productInfoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "32px",
  marginBottom: "32px",
};

export const productInfoCard = {
  backgroundColor: "#f8f9fa",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #e9ecef",
  boxSizing: "border-box",
};

export const productInfoCardTitle = {
  fontSize: "1.25rem",
  fontWeight: "600",
  color: "#1E232C",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

export const productInfoList = {
  listStyle: "none",
  padding: "0",
  margin: "0",
};

export const productInfoListItem = {
  padding: "8px 0",
  borderBottom: "1px solid #e9ecef",
  fontSize: "0.95rem",
  color: "#555",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export const productInfoLabel = {
  fontWeight: "600",
  color: "#333",
  minWidth: "120px",
};

export const productInfoValue = {
  color: "#666",
  textAlign: "right",
  flex: "1",
  marginLeft: "16px",
};

export const productDescription = {
  backgroundColor: "#f8f9fa",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #e9ecef",
  marginBottom: "32px",
};

export const productDescriptionTitle = {
  fontSize: "1.25rem",
  fontWeight: "600",
  color: "#1E232C",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

export const productDescriptionText = {
  lineHeight: "1.7",
  color: "#555",
  fontSize: "1rem",
  margin: "0",
};

// Remove the old list-based styles that are no longer needed
export const similarListContainer = {
  display: "none", // Deprecated - using grid now
};

export const similarListItem = {
  display: "none", // Deprecated - using cards now
};

// Media queries for responsive design
export const mediaQueries = `
  @media (max-width: 1024px) {
    .product-card {
      flex-direction: column !important;
      max-width: 100% !important;
    }
    .product-image-section {
      min-width: 100% !important;
      max-width: 100% !important;
      height: 300px !important;
      flex: none !important;
    }
    .product-details {
      min-width: 100% !important;
      padding: 32px !important;
    }
    .similar-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
      gap: 20px !important;
    }
  }
  @media (max-width: 768px) {
    .product-container {
      padding: 20px !important;
    }
    .product-image-section {
      height: 250px !important;
      padding: 20px !important;
    }
    .product-details {
      padding: 24px !important;
    }
    .similar-section {
      padding: 32px 24px !important;
    }
    .similar-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
      gap: 16px !important;
    }
    .quantity-controls {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }
    .button-row {
      flex-direction: column !important;
      gap: 12px !important;
    }
    .main-button, .wishlist-button {
      flex: none !important;
      width: 100% !important;
    }
  }
  @media (max-width: 480px) {
    .product-container {
      padding: 16px !important;
    }
    .back-button {
      padding: 0.5rem 1rem !important;
      font-size: 0.9rem !important;
    }
    .similar-section {
      padding: 24px 16px !important;
    }
    .similar-grid {
      grid-template-columns: 1fr !important;
    }
    .product-details {
      padding: 20px !important;
    }
    .product-title {
      font-size: 1.6rem !important;
    }
    .product-price {
      font-size: 1.8rem !important;
    }
  }
`;