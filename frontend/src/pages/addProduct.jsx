import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaCircle } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useUser } from "../contexts/UserContext";
import {
  globalResetUpdated,
  containerStyle,
  contentStyle,
  formStyle,
  sectionStyle,
  labelStyle,
  inputStyle,
  textareaStyle,
  selectStyle,
  fileUploadStyle,
  imagePreviewStyle,
  tagsContainerStyle,
  tagStyle,
  addTagStyle,
  alertStyle,
  buttonRowStyle,
  backButtonStyle,
  nextButtonStyle,
  submitButtonStyle,
  titleStyle,
  headerStyle,
} from "./addProduct.js";

function AddProducts() {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Action",
    platform: "PC",
    image: null,
    imagePreview: null,
    developer: "",
    publisher: "",
    releaseDate: "",
    rating: "E",
    tags: [],
  });

  const [newTag, setNewTag] = useState("");
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hover states
  const [hoveredInput, setHoveredInput] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredFileUpload, setHoveredFileUpload] = useState(false);
  const [hoveredAddTagButton, setHoveredAddTagButton] = useState(false);
  const [hoveredTrash, setHoveredTrash] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const dynamicInputStyle = (name) => ({
    ...inputStyle,
    borderColor: hoveredInput === name ? "#00AEBB" : "#ccc",
    boxShadow: hoveredInput === name ? "0 0 6px rgba(0, 174, 187, 0.3)" : "none",
    cursor: "text",
  });

  const dynamicTextareaStyle = (name) => ({
    ...textareaStyle,
    borderColor: hoveredInput === name ? "#00AEBB" : "#ccc",
    boxShadow: hoveredInput === name ? "0 0 6px rgba(0, 174, 187, 0.3)" : "none",
    cursor: "text",
  });

  const dynamicSelectStyle = (name) => ({
    ...selectStyle,
    borderColor: hoveredInput === name ? "#00AEBB" : "#ccc",
    boxShadow: hoveredInput === name ? "0 0 6px rgba(0, 174, 187, 0.3)" : "none",
    cursor: "pointer",
  });

  const dynamicButtonStyle = (name, baseStyle) => ({
    ...baseStyle,
    backgroundColor: hoveredButton === name ? "rgba(0,174,187,0.1)" : baseStyle.backgroundColor,
    borderColor: hoveredButton === name ? "#00AEBB" : baseStyle.borderColor,
    boxShadow: hoveredButton === name ? "0 0 6px rgba(0,174,187,0.3)" : "none",
    cursor: "pointer",
  });

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "Action",
      platform: "PC",
      image: null,
      imagePreview: null,
      developer: "",
      publisher: "",
      releaseDate: "",
      rating: "E",
      tags: [],
    });
    setNewTag("");
    setAlert(null);
  };

  const validateStep = () => {
    if (currentStep === 0 && !formData.name.trim()) return "Name is required";
    if (currentStep === 1 && !formData.price.trim()) return "Price is required";
    if (currentStep === 2 && !formData.developer.trim()) return "Developer is required";
    return null;
  };

  const handleNext = () => {
    const error = validateStep();
    if (error) {
      setAlert({ type: "error", message: error });
      return;
    }
    setAlert(null);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateStep();
    if (error) {
      setAlert({ type: "error", message: error });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting product:", formData);
      setAlert({ type: "success", message: "Product submitted successfully!" });
      clearForm();
      setCurrentStep(0);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to submit product. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [0, 1, 2, 3];

  const ProgressTracker = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "2rem 0", width: "100%" }}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div style={{ textAlign: "center", color: index <= currentStep ? "#00AEBB" : "#666" }}>
            <FaCircle style={{ fontSize: "20px", color: index <= currentStep ? "#00AEBB" : "#ccc", transition: "color 0.3s ease" }} />
          </div>
          {index < steps.length - 1 && (
            <div style={{ flex: 1, display: "flex", justifyContent: "space-evenly", alignItems: "center", padding: "0 6px" }}>
              {Array.from({ length: 6 }).map((_, dotIndex) => (
                <span key={dotIndex} style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: index < currentStep ? "#00AEBB" : "#ccc", transition: "background-color 0.3s ease" }} />
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalResetUpdated;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  return (
    <div style={containerStyle}>
      <NavBar currentPage="addProduct" user={user} />
      <div style={headerStyle}>
        <h1 style={titleStyle}>Add Product</h1>
      </div>
      <div style={contentStyle}>
        <ProgressTracker />

        {alert && (
          <div style={{ ...alertStyle, backgroundColor: alert.type === "error" ? "#e74c3c" : "#27ae60" }}>
            {alert.message}
          </div>
        )}

        <form style={formStyle} onSubmit={handleSubmit}>
          {/* STEP 0 */}
          {currentStep === 0 && (
            <div style={sectionStyle}>
              <label style={labelStyle}>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onMouseEnter={() => setHoveredInput("name")}
                onMouseLeave={() => setHoveredInput(null)}
                style={dynamicInputStyle("name")}
              />

              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onMouseEnter={() => setHoveredInput("description")}
                onMouseLeave={() => setHoveredInput(null)}
                style={dynamicTextareaStyle("description")}
              />

              <label style={labelStyle}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                onMouseEnter={() => setHoveredInput("category")}
                onMouseLeave={() => setHoveredInput(null)}
                style={dynamicSelectStyle("category")}
              >
                <option>Action</option>
                <option>Adventure</option>
                <option>RPG</option>
                <option>Racing</option>
                <option>Puzzle</option>
                <option>Strategy</option>
                <option>Sports</option>
                <option>Simulation</option>
              </select>

              <label style={labelStyle}>Platform</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                onMouseEnter={() => setHoveredInput("platform")}
                onMouseLeave={() => setHoveredInput(null)}
                style={dynamicSelectStyle("platform")}
              >
                <option>PC</option>
                <option>PlayStation</option>
                <option>Xbox</option>
                <option>Nintendo</option>
              </select>

              <label style={labelStyle}>Image</label>
              <div
                style={{
                  ...fileUploadStyle,
                  borderColor: hoveredFileUpload ? "#00AEBB" : "#ddd",
                  boxShadow: hoveredFileUpload ? "0 0 6px rgba(0,174,187,0.3)" : "none",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredFileUpload(true)}
                onMouseLeave={() => setHoveredFileUpload(false)}
              >
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" style={imagePreviewStyle} />}
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div style={sectionStyle}>
              <label style={labelStyle}>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                onMouseEnter={() => setHoveredInput("price")}
                onMouseLeave={() => setHoveredInput(null)}
                style={dynamicInputStyle("price")}
              />

              <label style={labelStyle}>Original Price</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                onMouseEnter={() => setHoveredInput("originalPrice")}
                onMouseLeave={() => setHoveredInput(null)}
                style={dynamicInputStyle("originalPrice")}
              />
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div style={sectionStyle}>
              <label style={labelStyle}>Developer</label>
              <input
                type="text"
                name="developer"
                value={formData.developer}
                onChange={handleInputChange}
                onMouseEnter={() => setHoveredInput("developer")}
                onMouseLeave={() => setHoveredInput(null)}
                style={dynamicInputStyle("developer")}
              />

              <label style={labelStyle}>Publisher</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                onMouseEnter={() => setHoveredInput("publisher")}
                onMouseLeave={() => setHoveredInput(null)}
                style={dynamicInputStyle("publisher")}
              />

              <label style={labelStyle}>Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                onMouseEnter={() => setHoveredInput("releaseDate")}
                onMouseLeave={() => setHoveredInput(null)}
                style={dynamicInputStyle("releaseDate")}
              />

              <label style={labelStyle}>Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                onMouseEnter={() => setHoveredInput("rating")}
                onMouseLeave={() => setHoveredInput(null)}
                style={dynamicSelectStyle("rating")}
              >
                <option value="E">E</option>
                <option value="T">T</option>
                <option value="M">M</option>
              </select>

              <label style={labelStyle}>Tags</label>
              <div style={tagsContainerStyle}>
                {formData.tags.map((tag) => (
                  <span key={tag} style={tagStyle}>
                    {tag}{" "}
                    <FaTrash
                      style={{
                        cursor: "pointer",
                        color: hoveredTrash === tag ? "#e74c3c" : "#333",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={() => setHoveredTrash(tag)}
                      onMouseLeave={() => setHoveredTrash(null)}
                      onClick={() => removeTag(tag)}
                    />
                  </span>
                ))}
                <div style={addTagStyle}>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="New tag"
                    onMouseEnter={() => setHoveredInput("newTag")}
                    onMouseLeave={() => setHoveredInput(null)}
                    style={dynamicInputStyle("newTag")}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    onMouseEnter={() => setHoveredButton("addTag")}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={dynamicButtonStyle("addTag", { ...addTagStyle, padding: "0.5rem", marginLeft: "0.5rem" })}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {currentStep === 3 && (
            <div style={sectionStyle}>
              <h3>Review Your Product</h3>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          )}

            {/* Buttons */}
            <div style={buttonRowStyle}>
            {currentStep > 0 && (
                <button
                type="button"
                onClick={handleBack}
                onMouseEnter={() => setHoveredButton("back")}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                    ...backButtonStyle,
                    boxShadow: hoveredButton === "back" ? "0 0 6px rgba(0,174,187,0.3)" : "none",
                    cursor: "pointer",
                }}
                >
                Back
                </button>
            )}
            {currentStep < steps.length - 1 && (
                <button
                type="button"
                onClick={handleNext}
                onMouseEnter={() => setHoveredButton("next")}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                    ...nextButtonStyle,
                    boxShadow: hoveredButton === "next" ? "0 0 6px rgba(0,174,187,0.3)" : "none",
                    cursor: "pointer",
                }}
                >
                Next
                </button>
            )}
            {currentStep === steps.length - 1 && (
                <button
                type="submit"
                disabled={isSubmitting}
                onMouseEnter={() => setHoveredButton("submit")}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                    ...submitButtonStyle,
                    boxShadow: hoveredButton === "submit" ? "0 0 6px rgba(0,174,187,0.3)" : "none",
                    cursor: "pointer",
                }}
                >
                {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            )}
            </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default AddProducts;