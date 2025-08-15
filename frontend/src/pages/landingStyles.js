export const page = {
  fontFamily: "'Inter', sans-serif",
  color: "#1E232C",
  padding: 0,
  margin: 0,
  minHeight: "100vh",
  overflowX: "hidden",
  width: "100vw",
  maxWidth: "none",
  position: "relative",
  left: "50%",
  transform: "translateX(-50%)"
};

export const navBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.75rem 2rem",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  position: "sticky",
  top: 0,
  zIndex: 100,
  width: "100%"
};

export const logo = {
  height: "50px",
};

export const navRight = {
  display: "flex",
  gap: "5rem",
};

export const navItem = {
  cursor: "pointer",
  fontSize: "1rem",
  color: "#00AEBB",
  fontWeight: "600",
  transition: "all 0.3s ease"
};

export const heroSection = {
  display: "flex",
  justifyContent: "center", // center horizontally
  alignItems: "center",     // center vertically
  gap: "3rem",              // add space between text and image
  padding: "5rem 0",
  paddingBottom: "5rem",
  flexWrap: "wrap",
  background: "linear-gradient(to bottom right, #f8f9fa, #ffffff)",
  height: "70vh",
  width: "100vw",
  position: "relative",
  left: "50%",
  transform: "translateX(-50%)"
};

export const heroLeft = {
  flex: "1",
  minWidth: "280px",
  maxWidth: "500px",  // limit width so text doesn't stretch too much
  padding: "1rem",
  textAlign: "center" // center text horizontally
};

export const heroRight = {
  flex: "1",
  minWidth: "280px",
  maxWidth: "600px",
  textAlign: "center"
};

export const heroMascot = {
  width: "120px",
  marginBottom: "1.5rem"
};

export const gradientHeading = {
  fontSize: "3.5rem",
  fontWeight: "800",
  background: "linear-gradient(90deg, #00AEBB, #F7CA66)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "1.5rem",
  lineHeight: "1.2"
};

export const heroText = {
  fontSize: "1.2rem",
  color: "#393E46",
  marginBottom: "2rem",
  maxWidth: "500px"
};

export const ctaButton = {
  padding: "14px 32px",
  fontSize: "1rem",
  borderRadius: "12px",
  background: "#F7CA66",
  border: "none",
  color: "#fff",
  fontWeight: "700",
  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
  }
};

export const darkSection = {
  textAlign: "center",
  padding: "1rem 0 3rem 0",
  backgroundColor: "#1E232C",
  color: "#ffffff",
  width: "100vw",
  position: "relative",
  left: "50%",
  transform: "translateX(-50%)"
};

export const section = {
  textAlign: "center",
  padding: "1rem 0 3rem 0",
  backgroundColor: "#ffffff",
  width: "100vw",
  position: "relative",
  left: "50%",
  transform: "translateX(-50%)"
};

export const sectionTitle = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  marginBottom: "2rem",
  background: "linear-gradient(90deg, #00AEBB, #F7CA66)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "inline-block"
};

export const productGrid = {
  display: "flex",
  justifyContent: "center",
  gap: "2rem",
  flexWrap: "wrap",
  marginTop: "2rem",
  width: "100%"
};

export const cardBase = {
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: "1.5rem",
  width: "280px",
  transition: "all 0.3s ease",
  cursor: "pointer"
};

export const mainCard = {
  ...cardBase,
  backgroundColor: "#00AEBB",
  color: "#ffffff",
  transform: "translateY(-10px)",
  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
};

export const productImage = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
  borderRadius: "12px",
  marginBottom: "1rem"
};

export const productTitle = {
  fontSize: "1.3rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  color: "#00AEBB"
};

export const productDescription = {
  fontSize: "1rem",
  color: "#666"
};

export const productTitle2 = {
  fontSize: "1.3rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  color: "#ffffff"
};

export const productDescription2 = {
  fontSize: "1rem",
  color: "#ffffff"
};

export const pastelCard = {
  backgroundColor: "#f8f9fa",
  borderRadius: "20px",
  padding: "2rem",
  width: "240px",
  transition: "all 0.3s ease",
  cursor: "pointer",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  ":hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
  }
};

export const pastelIcon = {
  fontSize: "2.5rem",
  color: "#00AEBB",
  marginBottom: "1rem"
};

export const pastelHeading = {
  fontSize: "1.3rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
  color: "#1E232C"
};

export const pastelText = {
  fontSize: "1rem",
  color: "#666"
};

export const joinButton = {
  ...ctaButton,
  marginTop: "1rem"
};