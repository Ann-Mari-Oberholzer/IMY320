import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children, user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const cart = await apiService.getCart(user.id);
      const products = cart.products || [];
      console.log('Loaded cart products:', products);
      
      // If products already have product data, use it directly
      // Otherwise, fetch product details
      const cartItemsWithProducts = await Promise.all(
        products.map(async (item) => {
          if (item.product) {
            // Product data is already stored in cart
            return item;
          } else {
            // Fallback: fetch product details
            try {
              const product = await apiService.getProduct(item.productId);
              return {
                ...item,
                product: product || {
                  id: item.productId,
                  name: 'Unknown Product',
                  description: 'Product not found',
                  price: 0,
                  image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop'
                }
              };
            } catch (error) {
              console.error(`Failed to load product ${item.productId}:`, error);
              return {
                ...item,
                product: {
                  id: item.productId,
                  name: 'Unknown Product',
                  description: 'Product not found',
                  price: 0,
                  image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop'
                }
              };
            }
          }
        })
      );
      
      console.log('Cart items with products:', cartItemsWithProducts);
      setCartItems(cartItemsWithProducts);
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return false;
    }

    console.log('Adding to cart - User:', user.id, 'Product:', product.id, 'Quantity:', quantity);

    try {
      // First, save the product to the products table if it doesn't exist
      console.log('Saving product...');
      const savedProduct = await apiService.saveProduct(product);
      console.log('Product saved successfully:', savedProduct);
      
      // Add the complete product data to cart instead of just ID
      console.log('Adding to cart with complete product data...');
      const cartResult = await apiService.addToCartWithProduct(user.id, product, quantity);
      console.log('Add to cart result:', cartResult);
      
      await loadCart(); // Reload cart to get updated data
      console.log('Cart reloaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return false;
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user) return false;

    if (newQuantity < 1) {
      return removeFromCart(productId);
    }

    try {
      await apiService.updateCartItem(user.id, productId, newQuantity);
      await loadCart();
      return true;
    } catch (error) {
      console.error('Failed to update quantity:', error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return false;

    try {
      await apiService.removeFromCart(user.id, productId);
      await loadCart();
      return true;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    try {
      await apiService.clearCart(user.id);
      setCartItems([]);
      return true;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return false;
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = item.product || {};
      return total + (product.price || 0) * item.quantity;
    }, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId || item.product?.id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.productId === productId);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    updateCartItem: updateQuantity, // Alias for backward compatibility
    removeFromCart,
    clearCart,
    loadCart,
    getCartItemCount,
    getCartTotal,
    isInCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
