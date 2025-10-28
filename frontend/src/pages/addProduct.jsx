import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes, FaUpload, FaBox, FaTrophy } from 'react-icons/fa';
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
  'CD Projekt Red', 'FromSoftware', 'EA Sports', 'Avalanche Software', 'Insomniac Games',
  'Other'
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
    inStock: true
  });

  // UI state
  const [newFeature, setNewFeature] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showCustomBrand, setShowCustomBrand] = useState(false);
  const alertTimeoutRef = React.useRef(null);
  const isNavigatingRef = React.useRef(false);
  const [showOrderCompleteModal, setShowOrderCompleteModal] = useState(false);

  const ItemAddedModal = () => {
    if (!showOrderCompleteModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '1rem',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          animation: 'modalSlideIn 0.3s ease-out',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <button
            onClick={() => setShowOrderCompleteModal(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#999',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '50%',
            }}
          >
            <FaTimes />
          </button>

          <FaTrophy style={{ fontSize: '3rem', color: '#27ae60', marginBottom: '1rem' }} />
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1E232C',
            marginBottom: '0.5rem',
            background: 'linear-gradient(90deg, #00AEBB, #F7CA66)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Item added successfully!
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#666',
            marginBottom: '2rem',
            lineHeight: '1.5',
          }}>
            Your item is on the catalogue now.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            width: '100%'
          }}>
            <button
              onClick={() => {
                setShowOrderCompleteModal(false);
                navigate('/catalogue');
              }}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#00AEBB',
                color: '#fff',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(0, 174, 187, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FaBox />
              View Catalogue
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Clear alerts whenever step changes
  useEffect(() => {
    // Aggressively clear any alerts when step changes
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = null;
    }
    setAlert({ type: '', message: '' });

    // Force clear any lingering alerts after a small delay
    const clearDelay = setTimeout(() => {
      setAlert({ type: '', message: '' });
    }, 50);

    return () => {
      clearTimeout(clearDelay);
    };
  }, [currentStep]);

  // Apply global styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalReset + `
      @keyframes slideIn {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      /* Hide Grammarly extension */
      grammarly-extension {
        display: none !important;
      }
      
      [data-grammarly-shadow-root] {
        display: none !important;
      }
    `;
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
      // Check file size (limit to 500KB)
      const maxSize = 500 * 1024; // 500KB in bytes
      if (file.size > maxSize) {
        showAlert('error', `Image is too large (${(file.size / 1024).toFixed(0)}KB). Please use an image smaller than 500KB.`);
        e.target.value = ''; // Clear the file input
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showAlert('error', 'Please upload an image file (JPG, PNG, GIF, etc.)');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;

        // Create an image to resize it
        const img = new Image();
        img.onload = () => {
          // Create canvas to resize image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set max dimensions
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);

          setImagePreview(compressedImage);
          setFormData(prev => ({ ...prev, image: compressedImage }));
        };
        img.src = imageUrl;
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

  // Clear any existing alert timeout
  const clearAlertTimeout = () => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = null;
    }
  };

  // Show alert message
  const showAlert = (type, message) => {
    // Don't show alerts if we're currently navigating between steps
    if (isNavigatingRef.current) {
      return;
    }

    // Clear any existing timeout first
    clearAlertTimeout();

    setAlert({ type, message });
    // Scroll to the alert message
    setTimeout(() => {
      const alertElement = document.querySelector('[data-alert]');
      if (alertElement) {
        alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);

    // Store the timeout reference so we can clear it later
    alertTimeoutRef.current = setTimeout(() => {
      setAlert({ type: '', message: '' });
      alertTimeoutRef.current = null;
    }, 5000);
  };

  // Validate current step
  const validateStep = (step) => {
    const errors = {};
    let firstErrorField = null;
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          errors.name = 'Product name is required';
          if (!firstErrorField) firstErrorField = 'name';
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
          errors.price = 'Valid price is required';
          if (!firstErrorField) firstErrorField = 'price';
        }
        if (!formData.brand.trim()) {
          errors.brand = 'Brand is required';
          if (!firstErrorField) firstErrorField = 'brand';
        }
        break;

      case 2:
        if (!formData.description.trim()) {
          errors.description = 'Product description is required';
          if (!firstErrorField) firstErrorField = 'description';
        }
        if (formData.features.length === 0) {
          errors.features = 'At least one feature is required';
          if (!firstErrorField) firstErrorField = 'features';
        }
        break;

      case 3:
        // Don't validate image on step 3 - only validate on final submit
        break;

      default:
        break;
    }
    
    setFieldErrors(errors);
    
    // Scroll to first error field if there are errors
    if (firstErrorField) {
      setTimeout(() => {
        // Try to find by name attribute first
        let errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        
        // If not found, try to find by data-field attribute (for special cases like features)
        if (!errorElement) {
          errorElement = document.querySelector(`[data-field="${firstErrorField}"]`);
        }
        
        if (errorElement) {
          // Scroll to show the error message and field
          const errorContainer = errorElement.closest('[style*="margin"]') || errorElement.parentElement;
          if (errorContainer) {
            errorContainer.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
          
          // Focus the field if it's an input/textarea/select
          if (errorElement.tagName === 'INPUT' || 
              errorElement.tagName === 'TEXTAREA' || 
              errorElement.tagName === 'SELECT') {
            setTimeout(() => errorElement.focus(), 400);
          }
        }
      }, 100);
    }
    
    return Object.keys(errors).length === 0;
  };

  // Navigate between steps
  const nextStep = () => {
    // Set navigation flag to prevent alerts from showing
    isNavigatingRef.current = true;

    // Clear any existing alerts BEFORE validating
    clearAlertTimeout();
    setAlert({ type: '', message: '' });

    if (validateStep(currentStep)) {
      setFieldErrors({}); // Clear errors when moving forward
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));

      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    // Reset navigation flag after a brief delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  };

  const prevStep = () => {
    // Set navigation flag to prevent alerts from showing
    isNavigatingRef.current = true;

    // Clear any existing alerts and errors when going back
    clearAlertTimeout();
    setAlert({ type: '', message: '' });
    setFieldErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Reset navigation flag after a brief delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('handleSubmit called, currentStep:', currentStep);

    // Only allow submission on step 3
    if (currentStep !== 3) {
      console.log('Submit blocked - not on final step');
      return;
    }

    // Validate all steps before submitting (but image check comes after)
    if (!validateStep(1) || !validateStep(2)) {
      console.log('Submit blocked - validation failed for steps 1 or 2');
      return;
    }

    // Validate image on final submit - only when user clicks "Add Product"
    if (!formData.image) {
      console.log('Submit blocked - no image uploaded');
      showAlert('error', 'Product image is required. Please upload an image.');
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
        rating: null, // No rating for new products - customers will leave ratings
        // Add tags property (features as tags)
        tags: formData.features,
        // Add platform for games
        ...(formData.category === 'games' && formData.platform ? { platform: formData.platform } : {}),
        // Add creation timestamp
        createdAt: new Date().toISOString()
      };

      console.log('Submitting product data:', productData);

      // Save product via API
      const result = await apiServiceInstance.saveProduct(productData);

      console.log('Save product result:', result);

      if (result && !result.error) {
        setShowOrderCompleteModal(true);

        // Navigate to the newly created product page after short delay
        setTimeout(() => {
          navigate(`/product/${productId}`);
        }, 3000);

      } else {
        const errorMsg = result?.error || result?.message || 'Failed to save product';
        console.error('Product save failed:', errorMsg);
        throw new Error(errorMsg);
      }

    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.message || error.toString() || 'Failed to add product. Please try again.';
      showAlert('error', `Error: ${errorMessage}`);
      setIsSubmitting(false);
    } finally {
      // Only reset isSubmitting here if not already done in catch
      if (isSubmitting) {
        setIsSubmitting(false);
      }
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
                <div
                  onClick={() => {
                    // Set navigation flag to prevent alerts
                    isNavigatingRef.current = true;

                    clearAlertTimeout(); // Clear any pending timeout
                    setAlert({ type: '', message: '' }); // Clear any alerts
                    setCurrentStep(step);

                    // Scroll to top of page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;

                    // Reset navigation flag after a brief delay
                    setTimeout(() => {
                      isNavigatingRef.current = false;
                    }, 100);
                  }}
                  style={{
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
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 174, 187, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {step}
                </div>
                <span
                  onClick={() => {
                    // Set navigation flag to prevent alerts
                    isNavigatingRef.current = true;

                    clearAlertTimeout(); // Clear any pending timeout
                    setAlert({ type: '', message: '' }); // Clear any alerts
                    setCurrentStep(step);

                    // Scroll to top of page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;

                    // Reset navigation flag after a brief delay
                    setTimeout(() => {
                      isNavigatingRef.current = false;
                    }, 100);
                  }}
                  style={{
                    color: step <= currentStep ? '#00AEBB' : '#666',
                    fontWeight: step === currentStep ? 'bold' : 'normal',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textDecoration = 'none';
                  }}
                >
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
          <div
            data-alert
            style={{
              ...alertStyle,
              backgroundColor: alert.type === 'error' ? '#e74c3c' : '#27ae60',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} onKeyDown={(e) => {
          if (e.key === 'Enter' && currentStep !== 3) {
            e.preventDefault(); // Prevent form submission on Enter unless on final step
          }
        }} style={formStyle}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <>
              <div style={sectionStyle}>
                <label style={labelStyle}>Product Name *</label>
                <div
                  style={{
                    height: '2px',
                    background: 'linear-gradient(to right, transparent, #aaa, transparent)',
                    margin: '1.2rem 0'
                  }}
                ></div>
                {fieldErrors.name && (
                  <div style={{
                    color: '#e74c3c',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#ffebee',
                    borderRadius: '0.25rem',
                    border: '1px solid #e74c3c',
                    animation: 'slideIn 0.3s ease-out'
                  }}>
                    ⚠️ {fieldErrors.name}
                  </div>
                )}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.name ? '#e74c3c' : '#ddd'
                  }}
                  required
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Price (R) * <span style={{fontSize: '0.8rem', color: '#666'}}>(Must be greater than R0)</span></label>
                <div
                  style={{
                    height: '2px',
                    background: 'linear-gradient(to right, transparent, #aaa, transparent)',
                    margin: '1.2rem 0'
                  }}
                ></div>
                {fieldErrors.price && (
                  <div style={{
                    color: '#e74c3c',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#ffebee',
                    borderRadius: '0.25rem',
                    border: '1px solid #e74c3c',
                    animation: 'slideIn 0.3s ease-out'
                  }}>
                    ⚠️ {fieldErrors.price}
                  </div>
                )}
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 299.99"
                  min="0.01"
                  step="0.01"
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.price ? '#e74c3c' : '#ddd'
                  }}
                  required
                />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Category * <span style={{fontSize: '0.8rem', color: '#666'}}>(e.g., Headphones, Consoles, Games)</span></label>
                <div
                  style={{
                    height: '2px',
                    background: 'linear-gradient(to right, transparent, #aaa, transparent)',
                    margin: '1.2rem 0'
                  }}
                ></div>
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
                <div
                  style={{
                    height: '2px',
                    background: 'linear-gradient(to right, transparent, #aaa, transparent)',
                    margin: '1.2rem 0'
                  }}
                ></div>
                {fieldErrors.brand && (
                  <div style={{
                    color: '#e74c3c',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#ffebee',
                    borderRadius: '0.25rem',
                    border: '1px solid #e74c3c',
                    animation: 'slideIn 0.3s ease-out'
                  }}>
                    ⚠️ {fieldErrors.brand}
                  </div>
                )}
                <select
                  name="brand"
                  value={formData.brand === 'Other' || showCustomBrand ? 'Other' : formData.brand}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'Other') {
                      setShowCustomBrand(true);
                      setFormData(prev => ({ ...prev, brand: '' }));
                    } else {
                      setShowCustomBrand(false);
                      setFormData(prev => ({ ...prev, brand: value }));
                    }
                  }}
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.brand ? '#e74c3c' : '#ddd'
                  }}
                  required
                >
                  <option value="">Select a brand</option>
                  {BRANDS.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                {showCustomBrand && (
                  <input
                    type="text"
                    name="customBrand"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Enter custom brand name"
                    style={{
                      ...inputStyle,
                      marginTop: '0.5rem',
                      borderColor: fieldErrors.brand ? '#e74c3c' : '#ddd'
                    }}
                    required
                  />
                )}
              </div>
            </>
          )}

          {/* Step 2: Details & Features */}
          {currentStep === 2 && (
            <>
              <div style={sectionStyle}>
                <label style={labelStyle}>Description *</label>
                <div
                  style={{
                    height: '2px',
                    background: 'linear-gradient(to right, transparent, #aaa, transparent)',
                    margin: '1.2rem 0'
                  }}
                ></div>
                {fieldErrors.description && (
                  <div style={{
                    color: '#e74c3c',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#ffebee',
                    borderRadius: '0.25rem',
                    border: '1px solid #e74c3c',
                    animation: 'slideIn 0.3s ease-out'
                  }}>
                    ⚠️ {fieldErrors.description}
                  </div>
                )}
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  style={{
                    ...textareaStyle,
                    borderColor: fieldErrors.description ? '#e74c3c' : '#ddd'
                  }}
                  required
                />
              </div>

              {formData.category === 'games' && (
                <div style={sectionStyle}>
                  <label style={labelStyle}>Platform</label>
                  <div
                    style={{
                      height: '2px',
                      background: 'linear-gradient(to right, transparent, #aaa, transparent)',
                      margin: '1.2rem 0'
                    }}
                  ></div>
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
                <div
                  style={{
                    height: '2px',
                    background: 'linear-gradient(to right, transparent, #aaa, transparent)',
                    margin: '1.2rem 0'
                  }}
                ></div>

                {fieldErrors.features && (
                  <div style={{
                    color: '#e74c3c',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#ffebee',
                    borderRadius: '0.25rem',
                    border: '1px solid #e74c3c',
                    animation: 'slideIn 0.3s ease-out'
                  }}>
                    ⚠️ {fieldErrors.features}
                  </div>
                )}

                <div style={addTagStyle}>
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    style={inputStyle}
                    data-field="features"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
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

                {/* Added margin to separate the input and the feature list */}
                <div style={{ ...tagsContainerStyle, marginTop: '1rem' }}>
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
                          marginTop: '0.2rem',
                          cursor: 'pointer',
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
                    position: 'relative',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderColor: formData.image ? '#00AEBB' : '#ccc',
                    backgroundColor: '#fafafa',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    transition: 'border-color 0.3s ease, background-color 0.3s ease',
                  }}
                  onClick={() => document.getElementById('imageInput').click()}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '200px',
                          objectFit: 'contain',
                          borderRadius: '0.5rem',
                          marginBottom: '0.5rem',
                        }}
                      />
                      <p style={{ color: '#555', fontSize: '0.9rem' }}>
                        Click to change image
                      </p>
                    </>
                  ) : (
                    <>
                      <FaUpload style={{ fontSize: '2rem', color: '#888', marginBottom: '0.5rem' }} />
                      <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                        Click to upload an image
                      </p>
                      <p style={{ color: '#999', fontSize: '0.8rem' }}>
                        JPG, PNG or GIF (max 5MB)
                      </p>
                    </>
                  )}

                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    style={{ display: 'none' }}
                  />
                </div>
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

      <ItemAddedModal />
      <Footer />
    </div>
  );
}

export default AddProduct;