import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaTrash, FaHeart, FaPlus, FaMinus, FaGamepad, FaCheck, FaCreditCard, FaShieldAlt, FaTruck, FaGift, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import favoritesService from '../services/FavouritesService';


// Styles following the design system
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

@keyframes slideIn {
0% { transform: translateX(-20px); opacity: 0; }
100% { transform: translateX(0); opacity: 1; }
}

@keyframes bounce {
0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
40% { transform: translateY(-10px); }
60% { transform: translateY(-5px); }
}

@keyframes pulse {
0% { transform: scale(1); }
50% { transform: scale(1.05); }
100% { transform: scale(1); }
}

.quantity-button:hover {
background-color: #00AEBB !important;
color: #fff !important;
}

.checkout-button:hover:not(:disabled) {
transform: translateY(-2px);
box-shadow: 0 8px 20px rgba(247, 202, 102, 0.4);
animation: pulse 0.3s ease-in-out;
}

.remove-button:hover {
background-color: #fee !important;
color: #c82333 !important;
border-color: #c82333 !important;
}

.wishlist-button:hover {
background-color: #fee !important;
color: #e74c3c !important;
border-color: #e74c3c !important;
}

@media (max-width: 768px) {
.cart-layout {
flex-direction: column !important;
}


.cart-item {
  flex-direction: column !important;
  text-align: center;
}

.item-image {
  width: 100% !important;
  max-width: 200px !important;
  height: 200px !important;
  margin: 0 auto;
}

.item-controls {
  flex-direction: column !important;
  align-items: center !important;
  gap: 1rem !important;
}

.item-actions {
  width: 100% !important;
  justify-content: center !important;
}
}
`;

const containerStyle = {
flex: 1,
backgroundColor: '#f8f9fa',
display: 'flex',
flexDirection: 'column',
marginBottom: '2rem',
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

const cartLayoutStyle = {
display: 'flex',
gap: '2rem',
alignItems: 'flex-start',
};

const cartItemsContainerStyle = {
flex: '3',
backgroundColor: '#fff',
borderRadius: '1rem',
padding: '2rem',
boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const cartItemStyle = {
display: 'flex',
gap: '1.5rem',
padding: '2rem 0',
borderBottom: '1px solid #f0f0f0',
alignItems: 'flex-start',
};

const itemImageStyle = {
width: '120px',
height: '120px',
borderRadius: '0.5rem',
objectFit: 'cover',
backgroundColor: '#f0f0f0',
flexShrink: 0,
};

const itemInfoStyle = {
flex: '1',
display: 'flex',
flexDirection: 'column',
gap: '0.75rem',
minWidth: 0, // Allows text to wrap properly
};

const itemTitleStyle = {
fontSize: '1.3rem',
fontWeight: '700',
color: '#1E232C',
margin: '0',
lineHeight: '1.3',
};

const itemDescriptionStyle = {
fontSize: '0.95rem',
color: '#666',
margin: '0',
lineHeight: '1.5',
};

const itemTagsStyle = {
display: 'flex',
gap: '0.5rem',
flexWrap: 'wrap',
marginBottom: '1rem',
};

const itemTagStyle = {
backgroundColor: '#f0f7ff',
color: '#00AEBB',
padding: '0.25rem 0.75rem',
borderRadius: '1rem',
fontSize: '0.8rem',
fontWeight: '500',
};

// New improved controls layout
const itemControlsStyle = {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
gap: '1rem',
marginTop: 'auto',
paddingBottom: "0.5rem",
};

const itemActionsStyle = {
display: 'flex',
gap: '0.75rem',
alignItems: 'center',
};

const quantityControlsStyle = {
display: 'flex',
alignItems: 'center',
border: '2px solid #e9ecef',
borderRadius: '0.5rem',
overflow: 'hidden',
backgroundColor: '#fff',
};

const quantityButtonStyle = {
padding: '0.4rem 0.6rem',
backgroundColor: '#f8f9fa',
border: 'none',
cursor: 'pointer',
fontSize: '0.9rem',
fontWeight: '600',
color: '#666',
transition: 'all 0.3s ease',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
minWidth: '32px',
};

const quantityInputStyle = {
width: '40px',
padding: '0.4rem 0.2rem',
textAlign: 'center',
border: 'none',
fontSize: '0.9rem',
fontWeight: '600',
outline: 'none',
backgroundColor: '#fff',
};

const wishlistButtonStyle = {
display: 'flex',
alignItems: 'center',
gap: '0.5rem',
padding: '0.5rem 1rem',
backgroundColor: '#fff',
color: '#666',
border: '2px solid #e9ecef',
borderRadius: '0.5rem',
fontSize: '0.9rem',
fontWeight: '500',
cursor: 'pointer',
transition: 'all 0.3s ease',
};

const itemPriceContainerStyle = {
display: 'flex',
flexDirection: 'column',
alignItems: 'flex-end',
gap: '0.25rem',
minWidth: '100px',
flexShrink: 0,
};

const currentPriceStyle = {
fontSize: '1.4rem',
fontWeight: '700',
color: '#1E232C',
};

const originalPriceStyle = {
fontSize: '1rem',
color: '#999',
textDecoration: 'line-through',
};

const unitPriceStyle = {
fontSize: '0.85rem',
color: '#666',
fontStyle: 'italic',
};

const removeButtonStyle = {
display: 'flex',
alignItems: 'center',
gap: '0.5rem',
padding: '0.5rem 1rem',
backgroundColor: '#fff',
color: '#dc3545',
border: '2px solid #dc3545',
borderRadius: '0.5rem',
fontSize: '0.9rem',
fontWeight: '500',
cursor: 'pointer',
transition: 'all 0.3s ease',
};

const cartSummaryStyle = {
flex: '1',
maxWidth: '350px',
backgroundColor: '#fff',
borderRadius: '1rem',
padding: '2rem',
boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
height: 'fit-content',
top: '2rem',
};

const summaryTitleStyle = {
fontSize: '1.5rem',
fontWeight: '700',
color: '#1E232C',
marginBottom: '1.5rem',
textAlign: 'center',
};

const summaryRowStyle = {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
padding: '0.75rem 0',
borderBottom: '1px solid #f0f0f0',
};

const summaryLabelStyle = {
fontSize: '1rem',
color: '#666',
};

const summaryValueStyle = {
fontSize: '1rem',
fontWeight: '600',
color: '#1E232C',
};

const totalRowStyle = {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
padding: '1.5rem 0 1rem 0',
borderTop: '2px solid #00AEBB',
marginTop: '1rem',
};

const totalLabelStyle = {
fontSize: '1.3rem',
fontWeight: '700',
color: '#1E232C',
};

const totalValueStyle = {
fontSize: '1.5rem',
fontWeight: '800',
color: '#00AEBB',
};

const checkoutButtonStyle = {
width: '100%',
padding: '1rem',
backgroundColor: '#F7CA66',
color: '#fff',
border: 'none',
borderRadius: '0.75rem',
fontSize: '1.1rem',
fontWeight: '600',
cursor: 'pointer',
transition: 'all 0.3s ease',
marginTop: '1rem',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: '0.5rem',
};



// Empty cart styles
const emptyCartContainerStyle = {
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
padding: '2.5rem 1.5rem',
textAlign: 'center',
backgroundColor: '#fff',
borderRadius: '1rem',
boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
margin: '0 auto',
maxWidth: '400px',
marginBottom: '2rem',
};

const emptyCartIconStyle = {
fontSize: '3rem',
color: '#ddd',
marginBottom: '1rem',
};
const emptyCartStyle = {
  textAlign: 'center',
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '1rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const emptyCartTitleStyle = {
fontSize: '1.5rem',
fontWeight: '700',
color: '#1E232C',
marginBottom: '0.75rem',
};

const emptyCartMessageStyle = {
fontSize: '1rem',
color: '#666',
marginBottom: '1.5rem',
lineHeight: '1.5',
};

const continueShoppingButtonStyle = {
display: 'flex',
alignItems: 'center',
gap: '0.5rem',
padding: '0.75rem 1.5rem',
backgroundColor: '#00AEBB',
color: '#fff',
border: 'none',
borderRadius: '0.75rem',
fontSize: '1rem',
fontWeight: '600',
cursor: 'pointer',
transition: 'all 0.3s ease',
textDecoration: 'none',
};

const continueShoppingButtonHoverStyle = {
transform: 'translateY(-2px)',
boxShadow: '0 8px 20px rgba(0, 174, 187, 0.4)',
};

function ShoppingCartPage() {
const { user } = useUser();
const { cartItems: contextCartItems, updateCartItem, removeFromCart } = useCart();
const navigate = useNavigate();
const [cartItems, setCartItems] = useState(contextCartItems);
const [removingItems, setRemovingItems] = useState(new Set());
const [checkoutStarted, setCheckoutStarted] = useState(false);

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

// Sync local cartItems with context cartItems
useEffect(() => {
  setCartItems(contextCartItems);
}, [contextCartItems]);

const handleUpdateQuantity = (productId, newQuantity) => {
if (newQuantity < 1) return;
if (updateCartItem) {
updateCartItem(productId, newQuantity);
}
setCartItems(items =>
items.map(item =>
item.productId === productId
? { ...item, quantity: newQuantity }
: item
)
);
};

const handleRemoveItem = (productId) => {
setRemovingItems(prev => new Set([...prev, productId]));
setTimeout(() => {
if (removeFromCart) {
removeFromCart(productId);
}
setCartItems(items => items.filter(item => item.productId !== productId));
setRemovingItems(prev => {
const newSet = new Set(prev);
newSet.delete(productId);
return newSet;
});
}, 300);
};

const moveToWishlist = (productId) => {
  if (!user?.id) {
    alert('Please log in to add items to your wishlist');
    return;
  }

  // Find the product in cart items
  const cartItem = cartItems.find(item => item.productId === productId);
  if (!cartItem || !cartItem.product) {
    console.error('Product not found in cart');
    return;
  }

  const product = cartItem.product;
  const productData = {
    id: product.id,
    name: product.name,
    description: product.description || 'No description available',
    image: product.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
    price: parseFloat(product.price || 0),
    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
    tags: product.tags || [],
    hasDiscount: product.hasDiscount || false
  };

  // Add to favorites
  favoritesService.addToFavorites(user.id, productData);
  
  // Remove from cart
  handleRemoveItem(productId);
  
  console.log(`Moved item ${productId} to wishlist`);
};

const calculateSubtotal = () => {
return cartItems.reduce((sum, item) => {
const product = item.product || {};
return sum + (product.price || 0) * item.quantity;
}, 0);
};

const subtotal = calculateSubtotal();
const shipping = subtotal > 50 ? 0 : 5.99;
const total = subtotal + shipping;

const handleCheckout = () => {
setCheckoutStarted(true);
setTimeout(() => {
navigate('/checkout');
}, 2000);
};

const handleContinueShopping = () => {
navigate('/catalogue');
};

// Show empty cart state if no items
if (cartItems.length === 0) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar currentPage="cart" user={user} />
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Shopping Cart</h1>
          </div>

          <div style={emptyCartContainerStyle}>
            <FaShoppingCart style={emptyCartIconStyle} />
            <h2 style={emptyCartTitleStyle}>Your Cart is Empty</h2>
            
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#00AEBB',
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
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 174, 187, 0.4)';
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
      </div>
      <Footer />
    </div>
  );
}

return (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <NavBar currentPage="cart" user={user} />
    
    {checkoutStarted && (
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
    
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>Shopping Cart</h3>
        </div>

        <div style={cartLayoutStyle} className="cart-layout">
        <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={cartItemsContainerStyle}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#1E232C'
          }}>
            Cart Items ({cartItems.length})
          </h2>

          {cartItems.map((item, index) => {
            const product = item.product || {};
            const hasDiscount = product.originalPrice && product.originalPrice > product.price;

            return (
              <div
                key={item.productId}
                style={{
                  ...cartItemStyle,
                  opacity: removingItems.has(item.productId) ? 0.5 : 1,
                  transform: removingItems.has(item.productId) ? 'translateX(-20px)' : 'translateX(0)',
                  transition: 'all 0.3s ease'
                }}
                className="cart-item"
              >
                <img
                  src={product.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop"}
                  alt={product.name || 'Product'}
                  style={itemImageStyle}
                  className="item-image"
                />

                <div style={itemInfoStyle}>
                  <h3 style={itemTitleStyle}>{product.name || 'Unknown Product'}</h3>
                  <p style={itemDescriptionStyle}>{product.description || 'No description available'}</p>

                  {product.tags && (
                    <div style={itemTagsStyle}>
                      {product.tags.map(tag => (
                        <span key={tag} style={itemTagStyle}>{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Improved controls layout */}
                  <div style={itemControlsStyle} className="item-controls">
                    <div style={itemActionsStyle} className="item-actions">
                      <button
                        style={{
                          ...wishlistButtonStyle,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: 'translateY(0)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                        className="wishlist-button"
                        onClick={() => moveToWishlist(item.productId)}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px) scale(1.02)';
                          e.target.style.boxShadow = '0 8px 20px rgba(231, 76, 60, 0.3)';
                          e.target.style.backgroundColor = '#e74c3c';
                          e.target.style.borderColor = '#e74c3c';
                          e.target.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          e.target.style.backgroundColor = '#fff';
                          e.target.style.borderColor = '#e9ecef';
                          e.target.style.color = '#666';
                        }}
                      >
                        <FaHeart style={{ fontSize: '0.8rem' }} />
                        Wishlist
                      </button>

                      <div style={quantityControlsStyle}>
                        <button
                          style={quantityButtonStyle}
                          className="quantity-button"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            handleUpdateQuantity(item.productId, Math.max(1, Math.min(99, value)));
                          }}
                          style={quantityInputStyle}
                        />
                        <button
                          style={quantityButtonStyle}
                          className="quantity-button"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        style={{
                          ...removeButtonStyle,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: 'translateY(0)',
                          boxShadow: '0 2px 8px rgba(220, 53, 69, 0.1)',
                        }}
                        className="remove-button"
                        onClick={() => handleRemoveItem(item.productId)}
                        title="Remove from cart"
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px) scale(1.02)';
                          e.target.style.boxShadow = '0 8px 20px rgba(220, 53, 69, 0.3)';
                          e.target.style.backgroundColor = '#c82333';
                          e.target.style.borderColor = '#c82333';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.1)';
                          e.target.style.backgroundColor = '#fff';
                          e.target.style.borderColor = '#dc3545';
                        }}
                      >
                        <FaTrash style={{ fontSize: '0.8rem' }} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div style={itemPriceContainerStyle}>
                  {hasDiscount && product.originalPrice && (
                    <span style={originalPriceStyle}>${product.originalPrice.toFixed(2)}</span>
                  )}
                  <span style={currentPriceStyle}>
                    ${((product.price || 0) * item.quantity).toFixed(2)}
                  </span>
                  {item.quantity > 1 && (
                    <span style={unitPriceStyle}>
                      ${(product.price || 0).toFixed(2)} each
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
        </div>

        <div style={cartSummaryStyle}>
          <h2 style={summaryTitleStyle}>Order Summary</h2>

          <div style={summaryRowStyle}>
            <span style={summaryLabelStyle}>Subtotal</span>
            <span style={summaryValueStyle}>${subtotal.toFixed(2)}</span>
          </div>

          <div style={summaryRowStyle}>
            <span style={summaryLabelStyle}>
              Shipping {subtotal > 50 && <span style={{ color: '#27ae60' }}>✓ FREE</span>}
            </span>
            <span style={summaryValueStyle}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          <div style={totalRowStyle}>
            <span style={totalLabelStyle}>Total</span>
            <span style={totalValueStyle}>${total.toFixed(2)}</span>
          </div>

          <button
            style={{
              ...checkoutButtonStyle,
              backgroundColor: checkoutStarted ? '#27ae60' : '#F7CA66',
              cursor: checkoutStarted ? 'default' : 'pointer'
            }}
            className="checkout-button"
            onClick={handleCheckout}
            disabled={checkoutStarted}
          >
            Proceed to Checkout
          </button>

          {subtotal < 50 && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              color: '#856404',
              textAlign: 'center'
            }}>
              💡 Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  <Footer />
</div>



);
}

export default ShoppingCartPage;