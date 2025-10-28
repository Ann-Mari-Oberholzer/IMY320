export const globalResetUpdated = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    color: #333;
  }
  button {
    font-family: inherit;
    cursor: pointer;
  }
  input, textarea, select {
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  input:hover, textarea:hover, select:hover {
    border-color: #00AEBB;
    box-shadow: 0 0 4px rgba(0, 174, 187, 0.25);
  }
  input:focus, textarea:focus, select:focus {
    border-color: #00AEBB !important;
    box-shadow: 0 0 4px rgba(0, 174, 187, 0.4);
  }
`;


export const containerStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

export const headerStyle = {
  textAlign: 'center',
  marginTop: '2rem',
};

export const titleStyle = {
  fontSize: "3.5rem",
  fontWeight: "800",
  background: "linear-gradient(90deg, #00AEBB, #F7CA66)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "1.5rem",
  lineHeight: "1.2"
};

export const contentStyle = {
  flex: 1,
  margin: "2rem auto",
  padding: "2rem",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginLeft: "8rem",
  marginRight: "8rem",
};

export const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
};

export const sectionStyle = {
  display: "flex",
  flexDirection: "column",
  // gap: "1rem",
};

export const labelStyle = {
  fontWeight: "bold",
  // marginBottom: "0.5rem",
  fontSize: "18px",
};

export const inputStyle = {
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

export const textareaStyle = {
  ...inputStyle,
  minHeight: "100px",
};

export const selectStyle = {
  ...inputStyle,
  background: "#fff",
};

export const fileUploadStyle = {
  border: "2px dashed #ddd",
  borderRadius: "8px",
  padding: "1rem",
  textAlign: "center",
  cursor: "pointer",
  transition: "0.3s border-color ease",
};

export const imagePreviewStyle = {
  marginTop: "1rem",
  maxWidth: "100%",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
};

export const tagsContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

export const tagStyle = {
  background: "#00AEBB",
  color: "#fff",
  padding: "0.5rem 0.5rem 0.5rem 0.5rem",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  fontSize: "0.9rem",
};

export const addTagStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

export const alertStyle = {
  padding: "1.2rem 1.5rem",
  borderRadius: "8px",
  color: "#fff",
  marginBottom: "1.5rem",
  fontSize: "1.1rem",
  fontWeight: "600",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  position: "relative",
  zIndex: 1000,
};

export const buttonRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "1rem",
  marginTop: "1.5rem",
};

export const backButtonStyle = {
  background: "#ccc",
  color: "#000",
  padding: "1rem 2rem",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "17px",
};

export const nextButtonStyle = {
  background: "#00AEBB",
  color: "#fff",
  padding: "1rem 2rem",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "17px",
};

export const submitButtonStyle = {
  background: "#27ae60",
  color: "#fff",
  padding: "1rem 2rem",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "17px",
};