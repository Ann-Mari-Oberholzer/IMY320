import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaMapMarkerAlt, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';

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

const dangerButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#fff',
  color: '#dc3545',
  border: '2px solid #dc3545',
};

const EditAddressPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { addressId } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    type: 'residential'
  });

  // Load address data based on addressId
  useEffect(() => {
    if (addressId === 'default') {
      // Load default address from user data
      setFormData({
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Default Address',
        address: user?.address || '',
        city: user?.city || '',
        province: user?.province || '',
        postalCode: user?.postalCode || '',
        phone: user?.phone || '',
        type: 'residential'
      });
    } else {
      // Load specific address (in a real app, this would come from an API)
      // For now, we'll use sample data
      const sampleAddresses = {
        '1': {
          name: 'Euriditi',
          address: '1054 Prospect Street',
          city: 'Hatfield',
          province: 'Pretoria',
          postalCode: '0028',
          phone: '+27 12 345 6789',
          type: 'residential'
        },
        '2': {
          name: 'The Colosseum',
          address: '12 Adderley Street',
          city: 'Cape Town City Centre',
          province: 'Cape Town',
          postalCode: '8000',
          phone: '+27 21 987 6543',
          type: 'residential'
        }
      };
      
      const addressData = sampleAddresses[addressId] || {};
      setFormData({
        name: addressData.name || '',
        address: addressData.address || '',
        city: addressData.city || '',
        province: addressData.province || '',
        postalCode: addressData.postalCode || '',
        phone: addressData.phone || '',
        type: addressData.type || 'residential'
      });
    }
  }, [addressId, user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update the address in the database
    console.log('Updating address:', formData);
    // Navigate back to checkout at Shipping Info step (step 2)
    navigate('/checkout?step=2');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      // Here you would typically delete the address from the database
      console.log('Deleting address:', addressId);
      navigate('/checkout?step=2');
    }
  };

  const handleCancel = () => {
    navigate('/checkout?step=2');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar currentPage="checkout" user={user} />
      
      <div style={containerStyle}>
        <div style={contentStyle}>
          <form onSubmit={handleSubmit} style={stepContentStyle}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1E232C', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaMapMarkerAlt style={{ color: '#00AEBB' }} />
              Edit Address
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Address Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={inputStyle}
                  placeholder="e.g., Home, Office, etc."
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Address Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  style={inputStyle}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                style={inputStyle}
                placeholder="Enter street address"
                required
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  style={inputStyle}
                  placeholder="City"
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Province/State</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  style={inputStyle}
                  placeholder="Province/State"
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Postal Code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  style={inputStyle}
                  placeholder="Postal Code"
                />
              </div>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={inputStyle}
                placeholder="Phone number for delivery"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {addressId !== 'default' && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    style={dangerButtonStyle}
                  >
                    <FaTrash />
                    Delete Address
                  </button>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={secondaryButtonStyle}
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  type="submit"
                  style={primaryButtonStyle}
                >
                  <FaSave />
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditAddressPage;
