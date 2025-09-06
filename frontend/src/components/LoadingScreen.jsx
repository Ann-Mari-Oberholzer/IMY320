import React from 'react';
import { FaSpinner, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const LoadingScreen = ({ message = "Processing your payment...", showPaymentIcon = true }) => {
  const loadingOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(5px)',
  };

  const loadingContentStyle = {
    backgroundColor: '#fff',
    borderRadius: '1.5rem',
    padding: '3rem 2rem',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    maxWidth: '400px',
    width: '90%',
    animation: 'modalSlideIn 0.3s ease-out',
  };

  const spinnerStyle = {
    fontSize: '3rem',
    color: '#00AEBB',
    marginBottom: '1.5rem',
    animation: 'spin 1s linear infinite',
  };

  const paymentIconStyle = {
    fontSize: '2rem',
    color: '#F7CA66',
    marginBottom: '1rem',
    animation: 'pulse 2s ease-in-out infinite',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1E232C',
    marginBottom: '0.5rem',
    background: 'linear-gradient(90deg, #00AEBB, #F7CA66)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const messageStyle = {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
  };

  const progressBarStyle = {
    width: '100%',
    height: '4px',
    backgroundColor: '#f0f0f0',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '1rem',
  };

  const progressFillStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #00AEBB, #F7CA66)',
    borderRadius: '2px',
    animation: 'progressBar 2s ease-in-out infinite',
  };

  const stepsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
  };

  const stepStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#999',
  };

  const stepActiveStyle = {
    ...stepStyle,
    color: '#00AEBB',
    fontWeight: '600',
  };

  return (
    <div style={loadingOverlayStyle}>
      <div style={loadingContentStyle}>
        {showPaymentIcon && (
          <FaCreditCard style={paymentIconStyle} />
        )}
        
        <div style={spinnerStyle}>
          <FaSpinner />
        </div>
        
        <h2 style={titleStyle}>Processing Payment</h2>
        <p style={messageStyle}>{message}</p>
        
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
        
        <div style={stepsStyle}>
          <div style={stepActiveStyle}>
            <FaCheckCircle style={{ fontSize: '0.8rem' }} />
            Validating
          </div>
          <div style={stepActiveStyle}>
            <FaSpinner style={{ fontSize: '0.8rem', animation: 'spin 1s linear infinite' }} />
            Processing
          </div>
          <div style={stepStyle}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: '#ddd',
              display: 'inline-block'
            }}></div>
            Complete
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes progressBar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
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
      `}</style>
    </div>
  );
};

export default LoadingScreen;
