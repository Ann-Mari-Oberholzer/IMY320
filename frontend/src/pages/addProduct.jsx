import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes, FaUpload } from 'react-icons/fa';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';
import apiServiceInstance from "../services/api";
import {
  globalResetUpdated as globalReset,
  containerStyle,
  contentStyle,
  headerStyle,
  titleStyle,
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
} from './addProduct.js';

const CATEGORIES = [
  { id: 'headphones', name: 'Gaming Headphones' },
  { id: 'consoles', name: 'Gaming Consoles' },
  { id: 'games', name: 'PC & Console Games' }
];

const BRANDS = [
  'SteelSeries', 'Razer', 'HyperX', 'Logitech', 'Corsair',
  'Sony', 'Microsoft', 'Nintendo', 'Valve',
  'CD Projekt Red', 'FromSoftware', 'EA Sports', 'Avalanche Software', 'Insomniac Games'
];

function AddProduct() {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'headphones',
    brand: '',
    description: '',
    features: [],
    platform: '',
    image: '',
    inStock: true,
    rating: 4.0
  });

  // UI state
  const [newFeature, setNewFeature] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Apply global styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalReset;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setFormData(prev => ({ ...prev, image: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add feature tag
  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Remove feature tag
  const removeFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  // Show alert message
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  // Validate current step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          showAlert('error', 'Product name is required');
          return false;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
          showAlert('error', 'Valid price is required');
          return false;
        }
        if (!formData.brand.trim()) {
          showAlert('error', 'Brand is required');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.description.trim()) {
          showAlert('error', 'Product description is required');
          return false;
        }
        if (formData.features.length === 0) {
          showAlert('error', 'At least one feature is required');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.image) {
          showAlert('error', 'Product image is required');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  // Navigate between steps
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate unique ID
      const productId = Date.now();
      
      // Prepare product data
      const productData = {
        id: productId,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand.trim(),
        description: formData.description.trim(),
        features: formData.features,
        image: formData.image,
        inStock: formData.inStock,
        rating: parseFloat(formData.rating),
        // Add platform for games
        ...(formData.category === 'games' && formData.platform ? { platform: formData.platform } : {}),
        // Add creation timestamp
        createdAt: new Date().toISOString()
      };

      // Save product via API
      const result = await apiServiceInstance.saveProduct(productData);
      
      if (result && !result.error) {
        showAlert('success', 'Product added successfully!');
        
        // Reset form after short delay
        setTimeout(() => {
          setFormData({
            name: '',
            price: '',
            category: 'headphones',
            brand: '',
            description: '',
            features: [],
            platform: '',
            image: '',
            inStock: true,
            rating: 4.0
          });
          setImagePreview('');
          setCurrentStep(1);
          
          // Navigate to products or catalogue page
          navigate('/catalogue');
        }, 2000);
        
      } else {
        throw new Error(result?.error || 'Failed to save product');
      }
      
    } catch (error) {
      console.error('Error saving product:', error);
      showAlert('error', error.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <NavBar currentPage="add-product" user={user} />
      
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Add New Product</h1>
          
          {/* Step indicator with dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1rem',
            marginBottom: '2rem'
          }}>
            {[1, 2, 3].map((step) => (
              <div key={step} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: step <= currentStep ? '#00AEBB' : '#ddd',
                  color: step <= currentStep ? 'white' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}>
                  {step}
                </div>
                <span style={{
                  color: step <= currentStep ? '#00AEBB' : '#666',
                  fontWeight: step === currentStep ? 'bold' : 'normal',
                  fontSize: '0.9rem'
                }}>
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Images'}
                </span>
                {step < 3 && (
                  <div style={{
                    width: '3rem',
                    height: '2px',
                    backgroundColor: step < currentStep ? '#00AEBB' : '#ddd',
                    marginLeft: '0.5rem',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {alert.message && (
          <div style={{
            ...alertStyle,
            backgroundColor: alert.type === 'error' ? '#e74c3c' : '#27ae60'
          }}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <>
              <div style={sectionStyle}>
                <label style={labelStyle}>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  style={inputStyle}
                  required
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  style={inputStyle}
                  required
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={selectStyle}
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Select or enter brand"
                  list="brands"
                  style={inputStyle}
                  required
                />
                <datalist id="brands">
                  {BRANDS.map(brand => (
                    <option key={brand} value={brand} />
                  ))}
                </datalist>
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  step="0.1"
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* Step 2: Details & Features */}
          {currentStep === 2 && (
            <>
              <div style={sectionStyle}>
                <label style={labelStyle}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  style={textareaStyle}
                  required
                />
              </div>

              {formData.category === 'games' && (
                <div style={sectionStyle}>
                  <label style={labelStyle}>Platform</label>
                  <input
                    type="text"
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    placeholder="e.g., PC/PS5/Xbox"
                    style={inputStyle}
                  />
                </div>
              )}

              <div style={sectionStyle}>
                <label style={labelStyle}>Features *</label>
                <div style={addTagStyle}>
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    style={inputStyle}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    style={{
                      ...nextButtonStyle,
                      padding: '0.5rem',
                      marginLeft: '0.5rem'
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <div style={tagsContainerStyle}>
                  {formData.features.map((feature, index) => (
                    <span key={index} style={tagStyle}>
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          marginLeft: '0.3rem',
                          cursor: 'pointer'
                        }}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div style={sectionStyle}>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                  />
                  In Stock
                </label>
              </div>
            </>
          )}

          {/* Step 3: Image & Review */}
          {currentStep === 3 && (
            <>
              <div style={sectionStyle}>
                <label style={labelStyle}>Product Image *</label>
                <div
                  style={{
                    ...fileUploadStyle,
                    borderColor: formData.image ? '#00AEBB' : '#ddd'
                  }}
                  onClick={() => document.getElementById('imageInput').click()}
                >
                  <FaUpload style={{ fontSize: '2rem', color: '#666', marginBottom: '0.5rem' }} />
                  <p>{formData.image ? 'Click to change image' : 'Click to upload image'}</p>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
                
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={imagePreviewStyle}
                  />
                )}
              </div>

              {/* Product Summary */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1.5rem', 
                borderRadius: '8px',
                marginTop: '2rem'
              }}>
                <h3 style={{ marginBottom: '1rem', color: '#00AEBB' }}>Product Summary</h3>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Price:</strong> R{formData.price}</p>
                <p><strong>Category:</strong> {CATEGORIES.find(c => c.id === formData.category)?.name}</p>
                <p><strong>Brand:</strong> {formData.brand}</p>
                <p><strong>Rating:</strong> {formData.rating}/5</p>
                <p><strong>Features:</strong> {formData.features.join(', ')}</p>
                <p><strong>In Stock:</strong> {formData.inStock ? 'Yes' : 'No'}</p>
                {formData.platform && <p><strong>Platform:</strong> {formData.platform}</p>}
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div style={buttonRowStyle}>
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} style={backButtonStyle}>
                Back
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button type="button" onClick={nextStep} style={nextButtonStyle}>
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                style={{
                  ...submitButtonStyle,
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </button>
            )}
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default AddProduct;