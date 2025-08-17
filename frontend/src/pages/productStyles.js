export const big = {
  minHeight: "100vh",
  fontFamily: "'Inter', sans-serif",
  backgroundColor: "#f8f9fa",
  width: "100%",
  overflowX: "hidden",
};

export const container = {
  display: "flex",
  marginTop: "2rem",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  minHeight: "auto",
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  boxSizing: "border-box",
};

export const card = {
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  maxWidth: "1000px",
  width: "100%",
  overflow: "visible",
  position: "relative",
  margin: "0 auto",
  minHeight: "400px",
  boxSizing: "border-box",
};

export const imageSection = {
  flex: "1",
  minWidth: "300px",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f1f3f5",
  padding: "20px",
  position: "relative",
  boxSizing: "border-box",
};

export const bigImage = {
  width: "100%",
  maxWidth: "350px",
  height: "70%",
  borderRadius: "12px",
  marginBottom: "12px",
  objectFit: "cover",
};

export const thumbnailRow = {
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  width: "100%",
};

export const thumbnail = {
  flex: 1,
  height: "100px",
  borderRadius: "8px",
  cursor: "pointer",
  objectFit: "cover",
  transition: "transform 0.2s ease",
};

export const details = {
  flex: "2",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  minWidth: "300px",
  position: "relative",
  boxSizing: "border-box",
};

export const title = {
  fontSize: '1.6rem',
  fontWeight: '600',
  color: '#1E232C',
  margin: '0 0 0.5rem 0',
};

export const price = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#00AEBB",
  margin: "1rem 0rem",
};

export const description = {
  lineHeight: "1.5",
  color: '#666',
  fontSize: '0.9rem',
  margin: '0 0 1rem 0',
  overflow: 'hidden',
};

export const specs = {
  backgroundColor: "#f8f9fa",
  padding: "16px",
  borderRadius: "12px",
  fontSize: "15px",
  color: "#444",
  boxSizing: "border-box",
};

export const ratingContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1rem',
};

export const starStyle = {
  color: '#F7CA66',
  fontSize: '1rem',
};

export const ratingStyle = {
  fontWeight: '600',
  color: '#1E232C',
};

export const categories = {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '1rem',
  flexWrap: 'wrap',
};

export const category = {
  backgroundColor: '#f8f9fa',
  color: '#666',
  padding: '0.25rem 0.5rem',
  borderRadius: '0.25rem',
  fontSize: '0.8rem',
};

export const button = {
  marginTop: "20px",
  padding: "12px 20px",
  backgroundColor: "#F7CA66",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background 0.3s ease",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: "border-box",
  minWidth: 0, // Allow flex shrinking
};

export const wishlistButton = {
  marginTop: "20px",
  padding: "12px 0",
  backgroundColor: "#fff",
  color: "rgba(0, 0, 0, 0.5)",
  fontSize: "18px",
  border: "2px solid rgba(0, 0, 0, 0.3)",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
  minWidth: 0, // Allow flex shrinking
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

// Media queries for responsive design
export const mediaQueries = `
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
    .product-details {
      padding: 12px !important;
    }
    .button-row {
      flex-direction: column !important;
      gap: 0.5rem !important;
    }
    .main-button {
      flex: none !important;
      width: 100% !important;
    }
    .wishlist-button {
      flex: none !important;
      width: 100% !important;
    }
  }
`;