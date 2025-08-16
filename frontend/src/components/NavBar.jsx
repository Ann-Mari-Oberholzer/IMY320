import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../NavBar.css';

const Navbar = ({ currentPage = 'home', user = null, onLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

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

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
          <div className="user-menu">
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