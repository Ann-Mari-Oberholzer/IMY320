import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCheck, FaShoppingCart, FaCreditCard, FaMapMarkerAlt, FaBox, FaStar, FaHeart, FaGift, FaTrophy, FaGamepad, FaPlus } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';

// Consistent styling with other pages
const globalReset = `
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    font-family: 'Inter', sans-serif;
    background-color: #f8f9fa;
  }
  
  #root {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes modalSlideIn {
    0% { 
      transform: translateY(-50px) scale(0.9);
      opacity: 0;
    }
    100% { 
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const containerStyle = {
  flex: 1,
  backgroundColor: '#f8f9fa',
  padding: '2rem 0',
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '3rem',
};

const titleStyle = {
  fontSize: "3rem",
  fontWeight: "800",
  background: "linear-gradient(90deg, #00AEBB, #F7CA66)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "1rem",
  lineHeight: "1.2"
};

const subtitleStyle = {
  fontSize: '1.1rem',
  color: '#666',
  margin: '0',
};

const stepIndicatorStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '3rem',
  flexWrap: 'wrap',
  gap: '1rem',
};

const stepStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem',
  borderRadius: '2rem',
  backgroundColor: '#fff',
  border: '2px solid #ddd',
  color: '#666',
  fontSize: '0.9rem',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  minWidth: '150px',
  justifyContent: 'center',
};

const activeStepStyle = {
  ...stepStyle,
  backgroundColor: '#00AEBB',
  borderColor: '#00AEBB',
  color: '#fff',
  transform: 'translateY(-2px)',
  boxShadow: '0 6px 12px rgba(0, 174, 187, 0.3)',
};

const completedStepStyle = {
  ...stepStyle,
  backgroundColor: '#27ae60',
  borderColor: '#27ae60',
  color: '#fff',
};

const stepContentStyle = {
  backgroundColor: '#fff',
  borderRadius: '1rem',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  marginBottom: '2rem',
};

const formGroupStyle = {
  marginBottom: '1.5rem',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#1E232C',
  marginBottom: '0.5rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: '2px solid #ddd',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.3s ease',
  boxSizing: 'border-box',
};

const inputFocusStyle = {
  ...inputStyle,
  borderColor: '#00AEBB',
  boxShadow: '0 0 0 3px rgba(0, 174, 187, 0.2)',
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const primaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#F7CA66',
  color: '#fff',
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#fff',
  color: '#00AEBB',
  border: '2px solid #00AEBB',
};

const cartItemStyle = {
  display: 'flex',
  gap: '1rem',
  padding: '1rem 0',
  borderBottom: '1px solid #f0f0f0',
  alignItems: 'center',
};

const itemImageStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '0.5rem',
  objectFit: 'cover',
  backgroundColor: '#f0f0f0',
};

const itemInfoStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const itemTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1E232C',
  margin: 0,
};

const itemPriceStyle = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: '#00AEBB',
};

const summaryStyle = {
  backgroundColor: '#f8f9fa',
  borderRadius: '0.5rem',
  padding: '1.5rem',
  marginTop: '1rem',
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 0',
  borderBottom: '1px solid #e9ecef',
  fontSize: '0.95rem'
};

const totalRowStyle = {
  ...summaryRowStyle,
  borderTop: '2px solid #00AEBB',
  borderBottom: 'none',
  marginTop: '1rem',
  paddingTop: '1rem',
  fontSize: '1.1rem',
  fontWeight: '700'
};

const confirmationStyle = {
  textAlign: 'center',
  padding: '3rem 2rem',
  backgroundColor: '#fff',
  borderRadius: '1rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const successIconStyle = {
  fontSize: '4rem',
  color: '#27ae60',
  marginBottom: '1rem',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
};

const modalContentStyle = {
  backgroundColor: '#fff',
  borderRadius: '1rem',
  padding: '2rem',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  animation: 'modalSlideIn 0.3s ease-out',
  position: 'relative',
};

const modalTitleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#1E232C',
  marginBottom: '1rem',
  background: 'linear-gradient(90deg, #00AEBB, #F7CA66)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const modalMessageStyle = {
  fontSize: '1.1rem',
  color: '#666',
  marginBottom: '2rem',
  lineHeight: '1.5',
};

const modalButtonStyle = {
  ...primaryButtonStyle,
  margin: '0 auto',
  padding: '0.75rem 2rem',
  fontSize: '1rem',
};

const CheckoutProcess = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Form fields
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'South Africa',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveInfo: false
  });
  
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOrderCompleteModal, setShowOrderCompleteModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const steps = [
    { id: 1, title: "Cart Review", icon: FaShoppingCart },
    { id: 2, title: "Shipping Info", icon: FaMapMarkerAlt },
    { id: 3, title: "Payment", icon: FaCreditCard },
    { id: 4, title: "Confirmation", icon: FaBox }
  ];

  // Handle step parameter from URL
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10);
      if (stepNumber >= 1 && stepNumber <= 4) {
        setCurrentStep(stepNumber);
      }
    }
  }, [searchParams]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Redirect to cart if empty (but not on confirmation step)
  useEffect(() => {
    if (cartItems.length === 0 && user && currentStep !== 4) {
      navigate('/cart');
    }
  }, [cartItems, user, navigate, currentStep]);

  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.product || {};
    return sum + (product.price || 0) * item.quantity;
  }, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;
  const savings = cartItems.reduce((sum, item) => {
    const product = item.product || {};
    return sum + (product.originalPrice ? (product.originalPrice - product.price) * item.quantity : 0);
  }, 0);

  // Step completion logic
  const completeStep = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      completeStep(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    try {
      // Store order data before clearing cart
      const orderSubtotal = cartItems.reduce((sum, item) => {
        const product = item.product || {};
        return sum + (product.price || 0) * item.quantity;
      }, 0);
      const orderShipping = orderSubtotal > 50 ? 0 : 5.99;
      const orderTax = orderSubtotal * 0.08;
      const orderTotal = orderSubtotal + orderShipping + orderTax;
      
      setOrderData({
        items: [...cartItems],
        subtotal: orderSubtotal,
        shipping: orderShipping,
        tax: orderTax,
        total: orderTotal
      });
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete step 3 and move to step 4 first
      completeStep(3);
      setCurrentStep(4);
      
      // Small delay to ensure step transition completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Clear the cart after successful checkout
      await clearCart();
      
      setIsProcessing(false);
      setShowOrderCompleteModal(true);
    } catch (error) {
      console.error('Checkout failed:', error);
      setIsProcessing(false);
    }
  };

  const OrderCompleteModal = () => {
    if (!showOrderCompleteModal) return null;

    return (
      <div style={modalOverlayStyle} onClick={() => setShowOrderCompleteModal(false)}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
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
              padding: '0.5rem',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
              e.target.style.color = '#666';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#999';
            }}
          >
            ×
          </button>

          <div style={{ marginBottom: '1.5rem' }}>
            <FaTrophy style={{ fontSize: '3rem', color: '#27ae60', marginBottom: '0.75rem' }} />
            <h2 style={{...modalTitleStyle, fontSize: '1.5rem', marginBottom: '0.5rem'}}>Order Complete! 🎉</h2>
            <p style={{...modalMessageStyle, fontSize: '1rem', marginBottom: '1rem'}}>
              Your order is confirmed and on its way!
            </p>
          </div>
          
          <button
            onClick={() => {
              setShowOrderCompleteModal(false);
              navigate('/catalogue');
            }}
            style={modalButtonStyle}
          >
            <FaGamepad />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  };

  const StepIndicator = () => (
    <div style={stepIndicatorStyle}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        
        return (
          <div
            key={step.id}
            style={isCurrent ? activeStepStyle : isCompleted ? completedStepStyle : stepStyle}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: isCompleted ? '#27ae60' : isCurrent ? '#fff' : '#ddd',
              color: isCompleted ? '#fff' : isCurrent ? '#00AEBB' : '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: '700'
            }}>
              {isCompleted ? '✓' : step.id}
            </div>
            <span>{step.title}</span>
          </div>
        );
      })}
    </div>
  );

  const CartReviewStep = () => (
    <div style={stepContentStyle}>
      <h3 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        color: '#1E232C', 
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaShoppingCart style={{ color: '#00AEBB' }} />
        Your Gaming Collection ({cartItems.length} items)
      </h3>
      
      {cartItems.map((item, index) => {
        const product = item.product || {};
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        
        return (
          <div key={item.productId} style={cartItemStyle}>
            <img 
              src={product.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop"} 
              alt={product.name || 'Product'} 
              style={itemImageStyle}
            />
            <div style={itemInfoStyle}>
              <h4 style={itemTitleStyle}>{product.name || 'Unknown Product'}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FaStar style={{ color: '#F7CA66', fontSize: '0.9rem' }} />
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>{product.rating || '4.0'}</span>
                </div>
                <span style={{ color: '#ccc' }}>•</span>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>Qty: {item.quantity}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {hasDiscount && (
                <p style={{ fontSize: '0.9rem', color: '#999', textDecoration: 'line-through', margin: '0 0 0.25rem 0' }}>
                  ${(product.originalPrice * item.quantity).toFixed(2)}
                </p>
              )}
              <p style={itemPriceStyle}>${((product.price || 0) * item.quantity).toFixed(2)}</p>
              {item.quantity > 1 && (
                <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0 0' }}>
                  ${(product.price || 0).toFixed(2)} each
                </p>
              )}
            </div>
          </div>
        );
      })}
      
      
      <div style={summaryStyle}>
        <div style={summaryRowStyle}>
          <span style={{ color: '#666' }}>Subtotal</span>
          <span style={{ fontWeight: '600', color: '#1E232C' }}>${subtotal.toFixed(2)}</span>
        </div>
        <div style={summaryRowStyle}>
          <span style={{ color: '#666' }}>
            Shipping {subtotal > 50 && <span style={{ color: '#27ae60', fontWeight: '600' }}>✓ FREE</span>}
          </span>
          <span style={{ fontWeight: '600', color: subtotal > 50 ? '#27ae60' : '#1E232C' }}>
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div style={summaryRowStyle}>
          <span style={{ color: '#666' }}>Tax</span>
          <span style={{ fontWeight: '600', color: '#1E232C' }}>${tax.toFixed(2)}</span>
        </div>
        <div style={totalRowStyle}>
          <span style={{ color: '#1E232C' }}>Total</span>
          <span style={{ color: '#00AEBB', fontWeight: '700' }}>${finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  const ShippingStep = () => {
    // State for selected address
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [deliveryAddresses, setDeliveryAddresses] = useState([
      {
        id: 1,
        type: 'residential',
        name: 'Euriditi',
        address: '1054 Prospect Street',
        city: 'Hatfield, Pretoria, 0028',
        phone: '+27 12 345 6789'
      },
      {
        id: 2,
        type: 'residential',
        name: 'The Colosseum',
        address: '12 Adderley Street',
        city: 'Cape Town City Centre, Cape Town, 8000',
        phone: '+27 21 987 6543'
      }
    ]);

    // Handle address selection
    const handleAddressSelect = (addressId) => {
      setSelectedAddressId(addressId);
    };

    // Handle address deletion
    const handleAddressDelete = (addressId) => {
      setDeliveryAddresses(prev => prev.filter(addr => addr.id !== addressId));
      // If the deleted address was selected, clear selection
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }
    };

    const addressCardStyle = {
      backgroundColor: '#fff',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '2px solid #f0f0f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      marginBottom: '1rem',
      position: 'relative'
    };

    const addressCardHoverStyle = {
      ...addressCardStyle,
      borderColor: '#00AEBB',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(0, 174, 187, 0.15)'
    };

    const addressTypeStyle = {
      display: 'inline-block',
      backgroundColor: '#f0f7ff',
      color: '#00AEBB',
      padding: '0.25rem 0.75rem',
      borderRadius: '1rem',
      fontSize: '0.8rem',
      fontWeight: '600',
      marginBottom: '1rem',
      textTransform: 'capitalize'
    };

    const addressNameStyle = {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#1E232C',
      marginBottom: '0.5rem'
    };

    const addressDetailsStyle = {
      fontSize: '1rem',
      color: '#666',
      lineHeight: '1.5',
      marginBottom: '0.5rem'
    };

    const addressPhoneStyle = {
      fontSize: '0.9rem',
      color: '#999',
      marginBottom: '1rem'
    };

    const addressActionsStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #f0f0f0'
    };

    const actionButtonStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#fff',
      border: '2px solid #e9ecef',
      borderRadius: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: '#666'
    };

    const deleteButtonStyle = {
      ...actionButtonStyle,
      color: '#dc3545',
      borderColor: '#dc3545'
    };

    const editButtonStyle = {
      ...actionButtonStyle,
      color: '#00AEBB',
      borderColor: '#00AEBB'
    };

    return (
      <div style={stepContentStyle}>
        {/* Header with Delivery title and Back to Cart button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#1E232C',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaMapMarkerAlt style={{ color: '#00AEBB' }} />
            Delivery
          </h3>
          
          <button
            onClick={() => navigate('/cart')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#fff',
              color: '#00AEBB',
              border: '2px solid #00AEBB',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <FaChevronLeft />
            Back to Cart
          </button>
        </div>

        {/* Delivery Addresses Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h4 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600', 
              color: '#1E232C',
              margin: 0
            }}>
              Delivery Addresses
            </h4>
            
            <button
              onClick={() => navigate('/checkout/add-address')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#00AEBB',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <FaPlus />
              Add Address
            </button>
          </div>

          {/* Address Cards */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {deliveryAddresses.map((address, index) => {
              const isSelected = selectedAddressId === address.id;
              const cardStyle = isSelected ? {
                ...addressCardStyle,
                borderColor: '#00AEBB',
                backgroundColor: '#f0f9ff',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(0, 174, 187, 0.15)'
              } : addressCardStyle;

              return (
                <div 
                  key={address.id}
                  style={cardStyle}
                  onClick={() => handleAddressSelect(address.id)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      Object.assign(e.currentTarget.style, addressCardHoverStyle);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      Object.assign(e.currentTarget.style, addressCardStyle);
                    }
                  }}
                >
                  {/* Selection tick indicator */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: '#00AEBB',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={addressTypeStyle}>{address.type}</div>
                  </div>
                  <div style={addressNameStyle}>{address.name}</div>
                  <div style={addressDetailsStyle}>{address.address}</div>
                  <div style={addressDetailsStyle}>{address.city}</div>
                  <div style={addressPhoneStyle}>{address.phone}</div>
                  
                  <div style={addressActionsStyle}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/checkout/edit-address/${address.id}`);
                        }}
                        style={editButtonStyle}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f0f9ff';
                          e.target.style.borderColor = '#00AEBB';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#fff';
                          e.target.style.borderColor = '#00AEBB';
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddressDelete(address.id);
                        }}
                        style={deleteButtonStyle}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#fee';
                          e.target.style.borderColor = '#dc3545';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#fff';
                          e.target.style.borderColor = '#dc3545';
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const PaymentStep = () => (
    <div style={stepContentStyle}>
      <h3 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        color: '#1E232C', 
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaCreditCard style={{ color: '#00AEBB' }} />
        Secure Payment
      </h3>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {['card', 'paypal'].map((method) => (
            <label key={method} style={{ flex: 1, cursor: 'pointer' }}>
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={formData.paymentMethod === method}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                style={{ display: 'none' }}
              />
              <div style={{
                padding: '1rem',
                border: `2px solid ${formData.paymentMethod === method ? '#00AEBB' : '#ddd'}`,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                backgroundColor: formData.paymentMethod === method ? '#f0f9ff' : '#fff',
              }}>
                <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                  {method === 'card' ? '💳 Credit Card' : '🅿️ PayPal'}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      {formData.paymentMethod === 'card' && (
        <div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Card Number</label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              style={inputStyle}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Expiry Date</label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                style={inputStyle}
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>CVV</label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                style={inputStyle}
                placeholder="123"
                maxLength="3"
              />
            </div>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          id="saveInfo"
          checked={formData.saveInfo}
          onChange={(e) => handleInputChange('saveInfo', e.target.checked)}
          style={{ marginRight: '0.5rem' }}
        />
        <label htmlFor="saveInfo" style={{ fontSize: '0.9rem', color: '#666', cursor: 'pointer' }}>
          Save my information for faster checkout next time
        </label>
      </div>
    </div>
  );

  const ConfirmationStep = () => {
    // Use orderData if available, otherwise fall back to current cart data
    const displayItems = orderData ? orderData.items : cartItems;
    const displaySubtotal = orderData ? orderData.subtotal : subtotal;
    const displayShipping = orderData ? orderData.shipping : shipping;
    const displayTax = orderData ? orderData.tax : tax;
    const displayTotal = orderData ? orderData.total : finalTotal;

    return (
      <div style={confirmationStyle}>
      <div style={stepContentStyle}>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          color: '#1E232C', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <FaBox style={{ color: '#00AEBB' }} />
          Order Summary
        </h3>
        
        <div>
          {displayItems.map((item) => {
            const product = item.product || {};
            const hasDiscount = product.originalPrice && product.originalPrice > product.price;
            
            return (
              <div key={item.productId} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ color: '#1E232C', fontWeight: '500' }}>{product.name || 'Unknown Product'}</span>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Quantity: {item.quantity}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {hasDiscount && (
                    <div style={{ fontSize: '0.9rem', color: '#999', textDecoration: 'line-through', marginBottom: '0.25rem' }}>
                      ${(product.originalPrice * item.quantity).toFixed(2)}
                    </div>
                  )}
                  <span style={{ fontWeight: '600', color: '#00AEBB', fontSize: '1.1rem' }}>${((product.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            );
          })}
          
          <div style={{ paddingTop: '1rem', borderTop: '2px solid #00AEBB', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#666' }}>Subtotal</span>
              <span style={{ color: '#1E232C', fontWeight: '600' }}>${displaySubtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#666' }}>
                Shipping {displaySubtotal > 50 && <span style={{ color: '#27ae60', fontWeight: '600' }}>✓ FREE</span>}
              </span>
              <span style={{ color: displaySubtotal > 50 ? '#27ae60' : '#1E232C', fontWeight: '600' }}>
                {displayShipping === 0 ? 'FREE' : `$${displayShipping.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', marginBottom: '1rem' }}>
              <span style={{ color: '#666' }}>Tax</span>
              <span style={{ color: '#1E232C', fontWeight: '600' }}>${displayTax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: '700', paddingTop: '0.5rem', borderTop: '1px solid #ddd' }}>
              <span style={{ color: '#1E232C' }}>Total Paid</span>
              <span style={{ color: '#00AEBB' }}>${displayTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          border: '1px solid #00AEBB',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#00AEBB', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <FaHeart style={{ color: '#F7CA66' }} />
            Thank you for choosing our gaming store!
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => navigate('/catalogue')}
          style={primaryButtonStyle}
        >
          <FaGamepad />
          Continue Gaming
        </button>
      </div>
    </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <CartReviewStep />;
      case 2: return <ShippingStep />;
      case 3: return <PaymentStep />;
      case 4: return <ConfirmationStep />;
      default: return <CartReviewStep />;
    }
  };

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalReset;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Show loading if no user or empty cart (but not on confirmation step)
  if ((!user || cartItems.length === 0) && currentStep !== 4) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar currentPage="checkout" user={user} />
        <div style={containerStyle}>
          <div style={contentStyle}>
            <div style={headerStyle}>
              <h1 style={titleStyle}>Secure Checkout</h1>
              <p style={subtitleStyle}>Loading checkout...</p>
            </div>
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', color: '#00AEBB' }}>⏳</div>
              <p style={{ color: '#666', marginTop: '1rem' }}>Loading your checkout...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Special case: if we're on step 4 but cart is empty (order completed), show confirmation
  if (currentStep === 4 && cartItems.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar currentPage="checkout" user={user} />
        
        <div style={containerStyle}>
          <div style={contentStyle}>
            <div style={headerStyle}>
              <h1 style={titleStyle}>Order Complete!</h1>
              <p style={subtitleStyle}>Thank you for your purchase</p>
            </div>
            
            <StepIndicator />
            
            <div>
              <ConfirmationStep />
            </div>
          </div>
        </div>
        
        <Footer />
        
        {/* Order Complete Modal */}
        <OrderCompleteModal />
        
        {/* Loading Screen */}
        {isProcessing && (
          <LoadingScreen 
            showPaymentIcon={true}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar currentPage="checkout" user={user} />
      
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Secure Checkout</h1>
            <p style={subtitleStyle}>Complete your epic gaming collection</p>
          </div>
          
          <StepIndicator />
          
          <div>
            {renderCurrentStep()}
          </div>
          
          {currentStep < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {currentStep === 1 ? (
                  <button
                    onClick={() => navigate('/cart')}
                    style={secondaryButtonStyle}
                  >
                    <FaChevronLeft />
                    Back to Cart
                  </button>
                ) : (
                  <button
                    onClick={prevStep}
                    style={secondaryButtonStyle}
                  >
                    <FaChevronLeft />
                    Previous
                  </button>
                )}
              </div>
              
              <button
                onClick={currentStep === 3 ? handleSubmit : nextStep}
                disabled={isProcessing}
                style={{
                  ...primaryButtonStyle,
                  opacity: isProcessing ? 0.6 : 1,
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                {currentStep === 3 ? (
                  'Complete Order'
                ) : (
                  <>
                    Continue
                    <FaChevronRight />
                  </>
                )}
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/catalogue')}
                style={primaryButtonStyle}
              >
                <FaGamepad />
                Continue Shopping
              </button>
              
              <button
                onClick={() => navigate('/')}
                style={secondaryButtonStyle}
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      
      {/* Order Complete Modal */}
      <OrderCompleteModal />
      
      {/* Loading Screen */}
      {isProcessing && (
        <LoadingScreen 
          message="Processing your payment securely..." 
          showPaymentIcon={true}
        />
      )}
    </div>
  );
};

export default CheckoutProcess;