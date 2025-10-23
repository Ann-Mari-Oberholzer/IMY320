import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCheck, FaShoppingCart, FaCreditCard, FaMapMarkerAlt, FaBox, FaStar, FaHeart, FaGift, FaTrophy, FaGamepad, FaPlus, FaTimes } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import apiService from '../services/api';

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

  @keyframes modalSlideIn {
    0% { 
      transform: translateY(-30px) scale(0.95);
      opacity: 0;
    }
    100% { 
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const CheckoutProcess = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
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
  const [selectedAddressId, setSelectedAddressId] = useState(1);

  // Mock delivery addresses (as requested)
  const [deliveryAddresses] = useState([
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
      type: 'business',
      name: 'The Colosseum',
      address: '12 Adderley Street',
      city: 'Cape Town City Centre, Cape Town, 8000',
      phone: '+27 21 987 6543'
    }
  ]);

  const steps = [
    { id: 1, title: "Review", icon: FaShoppingCart },
    { id: 2, title: "Delivery", icon: FaMapMarkerAlt },
    { id: 3, title: "Payment", icon: FaCreditCard },
    { id: 4, title: "Complete", icon: FaBox }
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

  // Redirect logic
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (cartItems.length === 0 && user && currentStep !== 4) {
      navigate('/cart');
    }
  }, [cartItems, user, navigate, currentStep]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.product || {};
    return sum + (product.price || 0) * item.quantity;
  }, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const finalTotal = subtotal + shipping;

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
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      const orderSubtotal = subtotal;
      const orderShipping = shipping;
      const orderTotal = finalTotal;

      console.log('=== Starting Order Creation ===');
      console.log('User ID:', user.id);
      console.log('Cart Items:', cartItems);
      console.log('Total:', orderTotal);

      // Prepare order data
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        product: item.product,
        price: item.product?.price || 0
      }));

      console.log('Prepared Order Items:', orderItems);

      setOrderData({
        items: [...cartItems],
        subtotal: orderSubtotal,
        shipping: orderShipping,
        total: orderTotal
      });

      // Simulate payment processing
      console.log('Simulating payment...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create the order in the database
      console.log('Sending order to backend...');
      const createdOrder = await apiService.createOrder(user.id, orderItems, orderTotal);
      console.log('Order created successfully:', createdOrder);

      completeStep(3);
      setCurrentStep(4);

      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Clearing cart...');
      await clearCart();

      setIsProcessing(false);
      setShowOrderCompleteModal(true);
    } catch (error) {
      console.error('=== CHECKOUT ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      setIsProcessing(false);
      alert(`There was an error processing your order: ${error.message || 'Please check console for details'}. Please try again.`);
    }
  };

  // Success Modal Component
  const OrderCompleteModal = () => {
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
            Order Complete!
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#666',
            marginBottom: '2rem',
            lineHeight: '1.5',
          }}>
            Your order is confirmed and on its way!
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
                navigate('/orders');
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
              View My Orders
            </button>

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
                border: '2px solid #F7CA66',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#fff',
                color: '#F7CA66',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#F7CA66';
                e.target.style.color = '#fff';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#F7CA66';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaGamepad />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step Indicator Component
  const StepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
      gap: '1rem',
    }}>
      {steps.map((step) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        // Keep step 1 (Review) as completed if we're on step 2 or beyond
        const isReviewCompleted = step.id === 1 && currentStep > 1;
        
        return (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '1.5rem',
              backgroundColor: isCurrent ? '#00AEBB' : (isCompleted || isReviewCompleted) ? '#27ae60' : '#fff',
              border: `2px solid ${isCurrent ? '#00AEBB' : (isCompleted || isReviewCompleted) ? '#27ae60' : '#ddd'}`,
              color: isCurrent || isCompleted || isReviewCompleted ? '#fff' : '#666',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: (isCompleted || isReviewCompleted) ? '#27ae60' : isCurrent ? '#fff' : '#ddd',
              color: (isCompleted || isReviewCompleted) ? '#fff' : isCurrent ? '#00AEBB' : '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {(isCompleted || isReviewCompleted) ? '✓' : step.id}
            </div>
            <span>{step.title}</span>
          </div>
        );
      })}
    </div>
  );

  // Main Layout Component
  const CheckoutLayout = ({ children, showSummary = true }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: showSummary ? '1fr 350px' : '1fr',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        height: 'fit-content',
      }}>
        {children}
      </div>
      
      {showSummary && <OrderSummary />}
    </div>
  );

  // Order Summary Sidebar
  const OrderSummary = () => (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      height: 'fit-content',
      position: 'sticky',
      top: '2rem',
    }}>
      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#1E232C',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaShoppingCart style={{ color: '#00AEBB', fontSize: '1rem' }} />
        Order Summary
      </h3>
      
      <div style={{ marginBottom: '1rem' }}>
        {cartItems.slice(0, 3).map((item) => {
          const product = item.product || {};
          return (
            <div key={item.productId} style={{
              display: 'flex',
              gap: '0.75rem',
              padding: '0.75rem 0',
              borderBottom: '1px solid #f0f0f0',
              alignItems: 'center',
            }}>
              <img 
                src={product.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=60&h=60&fit=crop"} 
                alt={product.name || 'Product'} 
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '0.5rem',
                  objectFit: 'cover',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#1E232C',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {product.name || 'Unknown Product'}
                </h4>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#666',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.25rem'
                }}>
                  <span>Qty: {item.quantity}</span>
                  <span style={{ fontWeight: '600', color: '#00AEBB' }}>
                    ${((product.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {cartItems.length > 3 && (
          <div style={{
            textAlign: 'center',
            padding: '0.5rem 0',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            +{cartItems.length - 3} more items
          </div>
        )}
      </div>
      
      <div style={{
        borderTop: '2px solid #f0f0f0',
        paddingTop: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <span style={{ color: '#666' }}>Subtotal</span>
          <span style={{ color: '#1E232C', fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <span style={{ color: '#666' }}>Shipping</span>
          <span style={{ color: shipping === 0 ? '#27ae60' : '#1E232C', fontWeight: '600' }}>
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid #ddd',
          fontSize: '1.1rem',
          fontWeight: '700'
        }}>
          <span style={{ color: '#1E232C' }}>Total</span>
          <span style={{ color: '#00AEBB' }}>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {subtotal > 0 && subtotal < 50 && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          textAlign: 'center',
          color: '#856404'
        }}>
          Add ${(50 - subtotal).toFixed(2)} more for free shipping!
        </div>
      )}

      {/* Action Buttons - Moved here from individual steps */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #f0f0f0'
      }}>
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('/cart')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#f8f9fa',
                color: '#666',
                border: '2px solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.backgroundColor = '#e9ecef';
                  e.target.style.borderColor = '#adb5bd';
                }
              }}
              onMouseLeave={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#ddd';
                }
              }}
            >
              <FaChevronLeft />
              Back to Cart
            </button>
            
            <button
              onClick={nextStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#F7CA66',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(247, 202, 102, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              Continue to Delivery
              <FaChevronRight />
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={prevStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#f8f9fa',
                color: '#666',
                border: '2px solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.backgroundColor = '#e9ecef';
                  e.target.style.borderColor = '#adb5bd';
                }
              }}
              onMouseLeave={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#ddd';
                }
              }}
            >
              <FaChevronLeft />
              Back
            </button>
            
            <button
              onClick={nextStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#F7CA66',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(247, 202, 102, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              Continue to Payment
              <FaChevronRight />
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={prevStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#f8f9fa',
                color: '#666',
                border: '2px solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.backgroundColor = '#e9ecef';
                  e.target.style.borderColor = '#adb5bd';
                }
              }}
              onMouseLeave={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#ddd';
                }
              }}
            >
              <FaChevronLeft />
              Back
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#F7CA66',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isProcessing ? 0.7 : 1,
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing && e.target && e.target.style) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(247, 202, 102, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.target && e.target.style) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {isProcessing ? (
                <>
                  <LoadingScreen />
                  Processing...
                </>
              ) : (
                <>
                  <FaCheck />
                  Confirm Order
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Step 1: Cart Review
  const CartReviewStep = () => (
    <div>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1E232C',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaShoppingCart style={{ color: '#00AEBB' }} />
        Review Your Order
      </h2>
      
      <div style={{
        display: 'grid',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {cartItems.map((item) => {
          const product = item.product || {};
          const hasDiscount = product.originalPrice && product.originalPrice > product.price;
          
          return (
            <div key={item.productId} style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr auto',
              gap: '1rem',
              padding: '1rem',
              border: '1px solid #f0f0f0',
              borderRadius: '0.75rem',
              alignItems: 'center',
            }}>
              <img 
                src={product.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=80&h=80&fit=crop"} 
                alt={product.name || 'Product'} 
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '0.5rem',
                  objectFit: 'cover',
                }}
              />
              
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1E232C',
                  margin: '0 0 0.5rem 0',
                }}>
                  {product.name || 'Unknown Product'}
                </h4>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FaStar style={{ color: '#F7CA66' }} />
                    <span>{product.rating || '4.0'}</span>
                  </div>
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                {hasDiscount && (
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#999',
                    textDecoration: 'line-through',
                    marginBottom: '0.25rem'
                  }}>
                    ${(product.originalPrice * item.quantity).toFixed(2)}
                  </div>
                )}
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#00AEBB'
                }}>
                  ${((product.price || 0) * item.quantity).toFixed(2)}
                </div>
                {item.quantity > 1 && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    marginTop: '0.25rem'
                  }}>
                    ${(product.price || 0).toFixed(2)} each
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );

  // Step 2: Shipping
  const ShippingStep = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1E232C',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FaMapMarkerAlt style={{ color: '#00AEBB' }} />
          Delivery Address
        </h2>
        
        <button
          onClick={() => navigate('/checkout/add-address')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
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

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
        {deliveryAddresses.map((address) => {
          const isSelected = selectedAddressId === address.id;
          
          return (
            <div 
              key={address.id}
              onClick={() => setSelectedAddressId(address.id)}
              style={{
                padding: '1.5rem',
                border: `2px solid ${isSelected ? '#00AEBB' : '#f0f0f0'}`,
                borderRadius: '0.75rem',
                backgroundColor: isSelected ? '#f0f9ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
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

              <div style={{
                display: 'inline-block',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                textTransform: 'capitalize'
              }}>
                {address.type}
              </div>
              
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#1E232C',
                margin: '0 0 0.5rem 0'
              }}>
                {address.name}
              </h4>
              
              <p style={{
                fontSize: '1rem',
                color: '#666',
                lineHeight: '1.4',
                margin: '0 0 0.25rem 0'
              }}>
                {address.address}
              </p>
              
              <p style={{
                fontSize: '1rem',
                color: '#666',
                margin: '0 0 0.5rem 0'
              }}>
                {address.city}
              </p>
              
              <p style={{
                fontSize: '0.9rem',
                color: '#999',
                margin: 0
              }}>
                {address.phone}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );

  // Step 3: Payment
  const PaymentStep = () => (
    <div>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1E232C',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaCreditCard style={{ color: '#00AEBB' }} />
        Payment Details
      </h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {['card', 'paypal'].map((method) => (
            <label key={method} style={{ cursor: 'pointer' }}>
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
                borderRadius: '0.75rem',
                textAlign: 'center',
                backgroundColor: formData.paymentMethod === method ? '#f0f9ff' : '#fff',
                transition: 'all 0.3s ease',
              }}>
                <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                  {method === 'card' ? 'Credit Card' : 'PayPal'}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      {formData.paymentMethod === 'card' && (
        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#1E232C',
              marginBottom: '0.5rem',
            }}>
              Card Number
            </label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box',
              }}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1E232C',
                marginBottom: '0.5rem',
              }}>
                Expiry Date
              </label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box',
                }}
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1E232C',
                marginBottom: '0.5rem',
              }}>
                CVV
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box',
                }}
                placeholder="123"
                maxLength="3"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="saveInfo"
              checked={formData.saveInfo}
              onChange={(e) => handleInputChange('saveInfo', e.target.checked)}
            />
            <label htmlFor="saveInfo" style={{
              fontSize: '0.9rem',
              color: '#666',
              cursor: 'pointer'
            }}>
              Save information for next time
            </label>
          </div>
        </div>
      )}

    </div>
  );

 // Step 4: Confirmation
 const ConfirmationStep = () => {
  const displayItems = orderData ? orderData.items : cartItems;
  const displaySubtotal = orderData ? orderData.subtotal : subtotal;
  const displayShipping = orderData ? orderData.shipping : shipping;
  const displayTotal = orderData ? orderData.total : finalTotal;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        marginBottom: '2rem',
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '1rem',
        border: '2px solid #27ae60'
      }}>
        <FaBox style={{ fontSize: '3rem', color: '#27ae60', marginBottom: '1rem' }} />
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          color: '#1E232C',
          marginBottom: '0.5rem'
        }}>
          Order Confirmed!
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#666',
          margin: 0
        }}>
          Thank you for your purchase. Your games are on their way!
        </p>
      </div>

      <div style={{
        textAlign: 'left',
        backgroundColor: '#f8f9fa',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#1E232C',
          marginBottom: '1rem'
        }}>
          Order Details
        </h3>
        
        {displayItems.map((item) => {
          const product = item.product || {};
          return (
            <div key={item.productId} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: '1px solid #e9ecef'
            }}>
              <div>
                <span style={{ fontWeight: '600', color: '#1E232C' }}>
                  {product.name || 'Unknown Product'}
                </span>
                <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                  x{item.quantity}
                </span>
              </div>
              <span style={{ fontWeight: '600', color: '#00AEBB' }}>
                ${((product.price || 0) * item.quantity).toFixed(2)}
              </span>
            </div>
          );
        })}
        
        <div style={{
          borderTop: '2px solid #00AEBB',
          paddingTop: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <span style={{ color: '#666' }}>Subtotal</span>
            <span style={{ fontWeight: '600' }}>${displaySubtotal.toFixed(2)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <span style={{ color: '#666' }}>Shipping</span>
            <span style={{ fontWeight: '600', color: displayShipping === 0 ? '#27ae60' : '#1E232C' }}>
              {displayShipping === 0 ? 'FREE' : `$${displayShipping.toFixed(2)}`}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.2rem',
            fontWeight: '700',
            paddingTop: '0.75rem',
            borderTop: '1px solid #ddd'
          }}>
            <span>Total Paid</span>
            <span style={{ color: '#00AEBB' }}>${displayTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#f0f9ff',
        border: '1px solid #00AEBB',
        borderRadius: '0.75rem',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: '#00AEBB', 
          fontWeight: '600', 
          margin: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.5rem' 
        }}>
          <FaHeart style={{ color: '#F7CA66' }} />
          Thank you for choosing our gaming store!
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#F7CA66',
            color: '#fff',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
          onClick={() => navigate('/catalogue')}
          onMouseEnter={(e) => {
            if (e.target && e.target.style) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(247, 202, 102, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (e.target && e.target.style) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          <FaGamepad />
          Browse Games
        </button>
      </div>
    </div>
    
  );
};

  // Main render logic
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CartReviewStep />;
      case 2:
        return <ShippingStep />;
      case 3:
        return <PaymentStep />;
      case 4:
        return <ConfirmationStep />;
      default:
        return <CartReviewStep />;
    }
  };

  const renderNavigation = () => {
    // Navigation is now handled within each step component
    return null;
  };

  // Processing Overlay Component
  const ProcessingOverlay = () => {
    if (!isProcessing) return null;

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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <LoadingScreen />
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1E232C',
              margin: 0,
              background: 'linear-gradient(90deg, #00AEBB, #F7CA66)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Processing Payment...
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#666',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Please wait while we process your order
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '2rem 0'
    }}>
      <style>{globalReset}</style>    
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <StepIndicator />
        
        <CheckoutLayout showSummary={currentStep !== 4}>
          {renderStep()}
          {renderNavigation()}
        </CheckoutLayout>
      </div>
      <ProcessingOverlay />
      <OrderCompleteModal />
    </div>
  );
};

export default CheckoutProcess;