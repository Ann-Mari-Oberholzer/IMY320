export const containerStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

export const contentStyle = {
  flex: 1,
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export const productGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  maxWidth: "1000px",
  width: "100%",
  margin: "0 auto",
  marginBottom: "2rem",
};

export const productCardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  textAlign: "center",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
};

export const productImageStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "6px",
};

export const productNameStyle = {
  fontWeight: "bold",
  margin: "0.5rem 0",
};

export const removeButtonStyle = {
  marginTop: "0.5rem",
  padding: "0.3rem 0.6rem",
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export const headerStyle = {
  textAlign: "center",
};

export const titleStyle = {
  fontSize: "3.5rem",
  fontWeight: "800",
  background: "linear-gradient(90deg, #00AEBB, #F7CA66)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "1.5rem",
  lineHeight: "1.2",
};