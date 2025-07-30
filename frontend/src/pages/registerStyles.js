export const containerStyle = {
  fontFamily: "'Helvetica Neue', sans-serif",
  backgroundColor: "#f0f2f5",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem"
};

export const cardStyle = {
  background: "#fff",
  padding: "2.5rem",
  borderRadius: "16px",
  boxShadow: "0 12px 32px rgba(0,0,0,0.05)",
  width: "100%",
  maxWidth: "400px",
};

export const logoStyle = {
  display: "block",
  width: "70px",
  height: "70px",
  margin: "0 auto 1.25rem",
  borderRadius: "50%",
  backgroundColor: "#e0e0e0",
};

export const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "1.25rem",
  border: "1px solid #ccc",
  borderRadius: "12px",
  fontSize: "1rem",
  boxSizing: "border-box",
};

export const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#000",
  color: "#fff",
  fontSize: "1rem",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  marginTop: "0.5rem",
};

export const dividerStyle = {
  display: "flex",
  alignItems: "center",
  margin: "1.5rem 0",
  color: "#999",
};

export const lineStyle = {
  flex: 1,
  height: "1px",
  backgroundColor: "#ddd",
};

export const dividerTextStyle = {
  padding: "0 1rem",
  fontSize: "0.85rem",
};

export const toggleStyle = {
  textAlign: "center",
  marginTop: "1.2rem",
  color: "#777",
  fontSize: "0.9rem",
  cursor: "pointer",
};

export const iconStyle = {
  width: "20px",
  height: "20px",
};

export const iconContainer = {
  position: "relative",
  width: "100%",
  marginBottom: "1.25rem",
};

// email and password icons plaacement 
export const inputIcon = {
  position: "absolute",
  left: "12px",
  top: "35%",
  transform: "translateY(-50%)",
  color: "#777",
  fontSize: "1.2rem",
};

// password eye icon
export const passwordToggle = {
  position: "absolute",
  right: "12px",
  top: "38%",
  transform: "translateY(-50%)",
  color: "#777",
  fontSize: "1.2rem",
  cursor: "pointer",
  backgroundColor: "transparent",
  border: "none",
};

export const inputWithIcon = {
  paddingLeft: "40px",
};

export const thirdPartyContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "10px",
};

export const thirdPartyButton = {
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  color: "#333",
  fontSize: "0.8rem",
  border: "1px solid #ddd",
  borderRadius: "10px",
  cursor: "pointer",
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

export const socialButtonStyle = {
  ...thirdPartyButton,
  flexDirection: "row",
  gap: "8px",
};

export const termsStyle = {
  display: "flex",
  alignItems: "center",
  margin: "1rem 0",
  fontSize: "0.85rem",
  color: "#555",
};

export const termsLinkStyle = {
  color: "#0066cc",
  textDecoration: "none",
};
