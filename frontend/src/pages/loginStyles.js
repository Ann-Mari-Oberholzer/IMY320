export const globalReset = `
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  
  #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
`;

export const containerStyle = { 
  position: "relative", // Changed from fixed
  minHeight: "100vh",
  width: "100vw",
  backgroundImage: "url('/Field.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  boxSizing: "border-box",
  overflow: "auto", // Allow scrolling if needed
};

export const contentWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 100px)", // Account for navbar height
  padding: "2rem 0",
};

export const backgroundImageStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundImage: "url('/Field.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  zIndex: 0,
  overflow: "hidden",
};

export const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(4px)",
  zIndex: 0,
};

export const logo = {
  height: "50px",
};

export const navBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1.5rem 2rem",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  position: "sticky",
  top: 0,
  zIndex: 100
};

export const navItem = {
  cursor: "pointer",
  fontSize: "1rem",
  color: "#00AEBB",
  fontWeight: "600",
  transition: "all 0.3s ease",
  ":hover": {
    color: "#F7CA66",
    transform: "translateY(-2px)"
  }
};

export const navRight = {
  display: "flex",
  gap: "2rem",
};

export const cardStyle = {
  backgroundColor: "#FFFFFF",
  color: "#1f3c44ff",
  padding: "2.5rem",
  borderRadius: "1rem",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 0 30px rgba(28, 118, 148, 0.2)",
  fontFamily: "'Inter', sans-serif",
  textAlign: "center",
  height: "85vh", // unify height
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

export const logoStyle = {
  width: "170px",
  height: "170px",
  objectFit: "contain",
  margin: "0 auto 1rem auto", // unify spacing
};

export const inputStyle = {
  backgroundColor: "#f8f8f8ff",
  border: "1px solid #CCC",
  borderRadius: "0.75rem",
  padding: "0.75rem 1.25rem",
  width: "85%",
  color: "#1E232C",
  fontSize: "1rem",
  outline: "none",
};

export const inputWithIcon = {
  paddingLeft: "2.5rem",
};

export const iconContainer = {
  position: "relative",
  marginBottom: "0.75rem", // unify spacing
};

export const inputIcon = {
  position: "absolute",
  left: "0.9rem",
  top: "45%",
  transform: "translateY(-50%)",
  color: "#00AEBB",
  fontSize: "1.2rem",
};

export const passwordToggle = {
  position: "absolute",
  right: "0.9rem",
  top: "55%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "#00AEBB",
  fontSize: "1.1rem",
  cursor: "pointer",
};

export const buttonStyle = {
  backgroundColor: "#F7CA66",
  color: "#ffffffff",
  border: "none",
  borderRadius: "0.75rem",
  padding: "0.75rem",
  fontWeight: "600",
  fontSize: "1rem",
  cursor: "pointer",
  width: "100%",
  marginBottom: "1.2rem",
};

export const dividerStyle = {
  display: "flex",
  alignItems: "center",
  margin: "1.2rem 0",
};

export const lineStyle = {
  flex: 1,
  height: "1px",
  backgroundColor: "#CCC",
};

export const dividerTextStyle = {
  margin: "0 1rem",
  color: "#888",
  fontSize: "0.9rem",
};

export const thirdPartyContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  marginBottom: "1.5rem",
};

export const thirdPartyButton = {
  backgroundColor: "#F5F5F5",
  color: "#1E232C",
  borderRadius: "0.75rem",
  padding: "0.65rem 1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  fontWeight: "500",
  fontSize: "0.9rem",
  cursor: "pointer",
  border: "1px solid #DDD",
  transition: "transform 0.2s, box-shadow 0.2s",
  width: "100%",
};

export const iconStyle = {
  fontSize: "1.25rem",
  display: "inline-block",
};

export const hoverable = {
  transition: "all 0.2s ease-in-out",
  ":hover": {
    transform: "scale(1.03)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
};

export const headingStyle = {
  fontSize: "1.6rem",
  fontWeight: "700",
  marginBottom: "1rem",
  color: "#1E232C",
};

export const toggleStyle = {
  textAlign: "center",
  fontSize: "0.85rem",
  color: "#1E232C",
  cursor: "pointer",
};

export const roundedIconRow = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginTop: "1rem",
};

export const roundedIconButton = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: "#fff",
  border: "1px solid #DDD",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.2s ease",
};

export const roundedIcon = {
  fontSize: "1.2rem",
};

export const passwordMeterStyle = {
  height: "4px",
  backgroundColor: "#eee",
  borderRadius: "2px",
  marginBottom: "0.5rem",
};

export const passwordStrengthStyle = (strength) => ({
  width: `${strength * 25}%`,
  height: "100%",
  backgroundColor:
    strength < 2 ? "red" : strength < 4 ? "orange" : "green",
  borderRadius: "2px",
  transition: "width 0.3s ease",
});