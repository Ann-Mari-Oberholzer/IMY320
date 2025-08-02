import React, { useState } from 'react';
import {
  FaShoppingCart,
  FaUsers,
  FaTruck
} from 'react-icons/fa';
import '../AboutUs.css';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('story');

  const features = [
    {
      icon: FaShoppingCart,
      title: 'Curated Gaming Collection',
      description: 'Handpicked board games, card games, miniatures, and accessories from top publishers worldwide'
    },
    {
      icon: FaTruck,
      title: 'Fast & Secure Shipping',
      description: 'Quick delivery with tracking, secure packaging, and insurance on all valuable items'
    },
    {
      icon: FaUsers,
      title: 'Gaming Community Hub',
      description: 'Connect with fellow gamers, share reviews, and discover your next favorite game'
    }
  ];

  const teamMembers = [
    {
      name: 'Ann-Mari Oberholzer',
      role: 'Frontend Engineer',
      specialty: 'u23537729',
      avatar: '🎲'
    },
    {
      name: 'Lineo Khabane',
      role: 'Frontend Engineer',
      specialty: 'u23604043',
      avatar: '🎮'
    },
    {
      name: 'Moyahabo Hamese',
      role: 'Frontend Engineer',
      specialty: '21532941',
      avatar: '🏆'
    },
    {
      name: 'Mpho Martha Siminya',
      role: 'Frontend Engineer',
      specialty: 'u21824241',
      avatar: '🃏'
    }
  ];

  return (
    <div className="about-us-container">
      {/* Navigation Tabs */}
      <div className="tabs-section">
        <div className="tabs-container">
          {[
            { id: 'story', label: 'Our Story' },
            { id: 'features', label: 'Why Choose Us' },
            { id: 'team', label: 'Meet the Team' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="content-section">
        {activeTab === 'story' && (
          <div className="story-content">
            <div className="story-intro">
              <h2 className="section-title">About Game Craft</h2>
              <p className="story-description">
                Founded in 2025 by IMY 320 students, Game Craft began as a class project with a simple mission:
                to make high-quality hobby games accessible to everyone. What started as an academic endeavor has grown into a
                thriving e-commerce platform serving gaming enthusiasts worldwide.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="features-content">
            <div className="features-intro">
              <h2 className="section-title">Why Gamers Choose Game Craft</h2>
              <p className="features-description">
                We've built our store around what gamers actually want: great products, fast service, and a community that gets it.
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="feature-card">
                    <div className="feature-content">
                      <div className="feature-icon-container">
                        <IconComponent className="feature-icon" />
                      </div>
                      <div>
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-description">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="team-content">
            <div className="team-intro">
              <h2 className="section-title">Meet the Game Craft Team</h2>
              <p className="team-description">
                Our team of student developers and gaming enthusiasts work together to bring you the best shopping experience possible.
              </p>
            </div>

            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-avatar">{member.avatar}</div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-specialty">{member.specialty}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;