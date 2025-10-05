import React from 'react';
import { FaTools, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      color: '#1E232C',
    }}>
      <FaTools size={60} color="#F7CA66" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Under Construction</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Sorry! This page is currently being built. Please check back later.
      </p>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#00AEBB',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#028f9a'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00AEBB'}
      >
        <FaArrowLeft />
        Go Back
      </button>
    </div>
  );
};

export default UnderConstruction;
