import React from 'react';

import {
  FaShoppingCart,
  FaUsers,
  FaStar
} from 'react-icons/fa';
import '../AboutUs.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';

const AboutUs = () => {
  const { user, logout } = useUser();



  const features = [
    {
      icon: FaShoppingCart,
      title: 'Massive Game Library',
      description: 'Explore a wide range of video games — from action and RPGs to indies and multiplayer hits.'
    },
    {
      icon: FaUsers,
      title: 'Multiplayer & Community',
      description: 'Join friends, compare achievements, and find new teammates for your favorite games.'
    },
    {
      icon: FaStar,
      title: 'Reviews & Recommendations',
      description: 'Read trusted reviews, ratings, and get personalized suggestions for your next play.'
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
      {/* Replace the existing nav with: */}
      <NavBar 
        currentPage="about" 
        user={user} 
        onLogout={logout}
      />
      
      {/* Our Story Section */}
      <div className="content-section">
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
      </div>

      {/* Why Choose Us Section */}
      <div className="content-section">
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
      </div>

      {/* Meet the Team Section */}
      <div className="content-section">
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
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;