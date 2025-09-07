import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../NavBar.css';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ currentPage = 'home', user = null, onLogout }) => {
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Only get cart count when user is logged in
  const cartItemCount = user ? getCartItemCount() : 0;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowDropdown(false);
    navigate('/');
  };

  const handleViewOrders = () => {
    setShowDropdown(false);
    navigate('/orders');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="navbar">
      <img 
        src="/GameCraft4-1.png" 
        alt="Game Craft Logo" 
        className="navbar-logo"
        onClick={() => handleNavigation('/')}
      />
      
      <div className="navbar-right">
        <span 
          className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => handleNavigation('/')}
        >
          Home
        </span>
        
        <span 
          className={`nav-item ${currentPage === 'catalogue' ? 'active' : ''}`}
          onClick={() => handleNavigation('/catalogue')}
        >
          Store
        </span>
        
        <span 
          className={`nav-item ${currentPage === 'about' ? 'active' : ''}`}
          onClick={() => handleNavigation('/about')}
        >
          About
        </span>

        <span 
          className={`nav-item ${currentPage === 'addProduct' ? 'active' : ''}`}
          onClick={() => handleNavigation('/addProduct')}
        >
          Add Product
        </span>

        {user && (
          
          <div 
            className={`nav-item ${currentPage === 'cart' ? 'active' : ''}`}
            onClick={() => handleNavigation('/cart')}
          > Cart
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </div>
        )}
        <span 
          className={`nav-item ${currentPage === 'favourites' ? 'active' : ''}`}
          onClick={() => handleNavigation('/favourites')}
        >
          <FaHeart />
        </span>

        

        {!user ? (
          <>
            <span 
              className={`nav-item ${currentPage === 'login' ? 'active' : ''}`}
              onClick={() => handleNavigation('/login')}
            >
              Login
            </span>
            <button 
              className="cta-button"
              onClick={() => handleNavigation('/register')}
            >
              Sign Up
            </button>
          </>
        ) : (
          <div className="user-menu" ref={dropdownRef}>
            <div 
              className="user-avatar"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {getInitials(user.name || user.email)}
            </div>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <span className="user-name">{user.name || user.email}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item"
                  onClick={handleViewOrders}
                >
                  View Orders
                </button>
                <button 
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;