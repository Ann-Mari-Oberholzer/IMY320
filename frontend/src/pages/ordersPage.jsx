import React, { useState, useEffect } from 'react';
import { FaBox, FaTruck, FaCheck, FaClock, FaGamepad, FaChevronLeft, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';

// Import styles from catalogue to maintain consistency
import {
  globalReset,
  containerStyle,
  contentStyle,
  headerStyle,
  titleStyle,
  subtitleStyle
} from './catalogue.js';

const backButtonStyle = {
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
  transition: 'all 0.3s ease',
  marginBottom: '2rem',
  width: 'fit-content'
};

const ordersContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  marginBottom: '3rem',
};

const orderCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid #f0f0f0',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
};

const orderHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1rem',
  flexWrap: 'wrap',
  gap: '1rem'
};

const orderInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const orderNumberStyle = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: '#1E232C',
  margin: 0
};

const orderDateStyle = {
  fontSize: '0.9rem',
  color: '#666',
  margin: 0
};

const statusStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '1rem',
  fontSize: '0.8rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const statusCompletedStyle = {
  ...statusStyle,
  backgroundColor: '#d4edda',
  color: '#155724',
  border: '1px solid #c3e6cb'
};

const statusShippedStyle = {
  ...statusStyle,
  backgroundColor: '#cce5ff',
  color: '#004085',
  border: '1px solid #b3d7ff'
};

const statusProcessingStyle = {
  ...statusStyle,
  backgroundColor: '#fff3cd',
  color: '#856404',
  border: '1px solid #ffeaa7'
};

const orderItemsStyle = {
  marginBottom: '1rem'
};

const orderItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.75rem 0',
  borderBottom: '1px solid #f0f0f0'
};

const itemImageStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '0.5rem',
  objectFit: 'cover',
  backgroundColor: '#f0f0f0'
};

const itemInfoStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const itemNameStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1E232C',
  margin: 0
};

const itemQuantityStyle = {
  fontSize: '0.9rem',
  color: '#666',
  margin: 0
};

const itemPriceStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  color: '#00AEBB',
  margin: 0
};

const orderSummaryStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '1rem',
  borderTop: '2px solid #f0f0f0',
  marginTop: '1rem'
};

const totalStyle = {
  fontSize: '1.2rem',
  fontWeight: '700',
  color: '#1E232C'
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap'
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const primaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#00AEBB',
  color: '#fff',
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#fff',
  color: '#00AEBB',
  border: '2px solid #00AEBB',
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  backgroundColor: '#fff',
  borderRadius: '1rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const emptyIconStyle = {
  fontSize: '4rem',
  color: '#ddd',
  marginBottom: '1rem'
};

const emptyTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#1E232C',
  marginBottom: '0.5rem'
};

const emptySubtitleStyle = {
  fontSize: '1rem',
  color: '#666',
  marginBottom: '2rem'
};

const OrdersPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample orders data - in a real app, this would come from an API
  const sampleOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'completed',
      total: 89.99,
      items: [
        {
          id: 1,
          name: 'PlayStation 5 Console',
          image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&h=300&fit=crop',
          quantity: 1,
          price: 89.99
        }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 45.50,
      items: [
        {
          id: 2,
          name: 'Xbox Wireless Controller',
          image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=300&h=300&fit=crop',
          quantity: 2,
          price: 22.75
        }
      ]
    },
    {
      id: 'ORD-003',
      date: '2024-01-08',
      status: 'processing',
      total: 129.99,
      items: [
        {
          id: 3,
          name: 'Nintendo Switch OLED',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
          quantity: 1,
          price: 129.99
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadOrders = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(sampleOrders);
      setLoading(false);
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalReset + `
      /* Order card hover effects */
      .order-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return statusCompletedStyle;
      case 'shipped':
        return statusShippedStyle;
      case 'processing':
        return statusProcessingStyle;
      default:
        return statusStyle;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheck />;
      case 'shipped':
        return <FaTruck />;
      case 'processing':
        return <FaClock />;
      default:
        return <FaBox />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <NavBar currentPage="orders" user={user} />
        
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(248, 249, 250, 0.95)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <FaGamepad style={{ fontSize: '3rem', color: '#00AEBB', animation: 'bounce 1s infinite' }} />
              <FaGamepad style={{ fontSize: '3rem', color: '#F7CA66', animation: 'bounce 1s infinite 0.2s' }} />
              <FaGamepad style={{ fontSize: '3rem', color: '#00AEBB', animation: 'bounce 1s infinite 0.4s' }} />
            </div>
          </div>
        )}
        
        <div style={contentStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Your Orders</h1>
            <p style={subtitleStyle}>Track and manage your gaming purchases</p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <NavBar currentPage="orders" user={user} />
      
      <div style={contentStyle}>
        <button
          onClick={() => navigate('/')}
          style={backButtonStyle}
        >
          <FaChevronLeft />
          Back to Home
        </button>
        
        <div style={headerStyle}>
          <h1 style={titleStyle}>Your Orders</h1>
          <p style={subtitleStyle}>Track and manage your gaming purchases</p>
        </div>
          
          {orders.length === 0 ? (
            <div style={emptyStateStyle}>
              <FaBox style={emptyIconStyle} />
              <h2 style={emptyTitleStyle}>No Orders Yet</h2>
              <p style={emptySubtitleStyle}>
                Start building your gaming collection by browsing our store!
              </p>
              <button
                onClick={() => navigate('/catalogue')}
                style={primaryButtonStyle}
              >
                <FaGamepad />
                Browse Games
              </button>
            </div>
          ) : (
            <div style={ordersContainerStyle}>
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  style={orderCardStyle}
                  className="order-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={orderHeaderStyle}>
                    <div style={orderInfoStyle}>
                      <h3 style={orderNumberStyle}>Order #{order.id}</h3>
                      <p style={orderDateStyle}>
                        Placed on {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div style={getStatusStyle(order.status)}>
                      {getStatusIcon(order.status)} {getStatusText(order.status)}
                    </div>
                  </div>
                  
                  <div style={orderItemsStyle}>
                    {order.items.map((item, index) => (
                      <div key={index} style={orderItemStyle}>
                        <img 
                          src={item.image} 
                          alt={item.name}
                          style={itemImageStyle}
                        />
                        <div style={itemInfoStyle}>
                          <h4 style={itemNameStyle}>{item.name}</h4>
                          <p style={itemQuantityStyle}>Quantity: {item.quantity}</p>
                        </div>
                        <p style={itemPriceStyle}>${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div style={orderSummaryStyle}>
                    <div>
                      <span style={totalStyle}>Total: ${order.total.toFixed(2)}</span>
                    </div>
                    <div style={actionButtonsStyle}>
                      <button
                        onClick={() => {
                          // Navigate to the first product in the order
                          if (order.items && order.items.length > 0) {
                            navigate(`/product/${order.items[0].id}`);
                          }
                        }}
                        style={secondaryButtonStyle}
                      >
                        <FaEye />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      
      <Footer />
    </div>
  );
};

export default OrdersPage;
