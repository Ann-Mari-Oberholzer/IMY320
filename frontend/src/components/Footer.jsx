import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand / Logo */}
        <div className="footer-brand">
          <img src="/GameCraftLight.png" alt="GameCraft Logo" className="footer-logo" onClick={() => handleNavigation('/')}/>
          <p className="brand-tagline">Play. Create. Connect.</p>
        </div>

        {/* Navigation */}
        <div className="footer-nav">
          <a href="/" className="footer-link">Home</a>
          <a href="/about" className="footer-link">About</a>
          <a href="/underConstruction" className="footer-link">Services</a>
          <a href="/underConstruction" className="footer-link">Contact</a>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>KEEP PLAYING UNTIL YOU FIND YOUR STYLE</p>
        <p>© GameCraft {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
