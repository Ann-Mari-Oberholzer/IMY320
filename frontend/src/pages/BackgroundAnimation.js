import React, { useEffect, useRef } from 'react';

const BackgroundAnimation = ({ darkMode }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Bubble class
    class Bubble {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 30 + 10;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.2 + 0.1;
        this.color = darkMode 
          ? `rgba(100, 149, 237, ${this.opacity})` // Cornflower blue for dark mode
          : `rgba(70, 130, 180, ${this.opacity})`; // Steel blue for light mode
        this.wobble = Math.random() * 5;
        this.wobbleSpeed = Math.random() * 0.02;
        this.wobbleOffset = Math.random() * Math.PI * 2;
      }
      
      update() {
        this.y -= this.speed;
        if (this.y < -this.size) {
          this.y = canvas.height + this.size;
          this.x = Math.random() * canvas.width;
        }
        
        // Wobble effect
        this.x += Math.sin(Date.now() * this.wobbleSpeed + this.wobbleOffset) * 0.5;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add subtle highlight
        ctx.beginPath();
        ctx.arc(
          this.x - this.size * 0.3,
          this.y - this.size * 0.3,
          this.size * 0.1,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
        ctx.fill();
      }
    }
    
    // Create bubbles
    const bubbles = Array(15).fill().map(() => new Bubble());
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = darkMode ? '#121212' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      bubbles.forEach(bubble => {
        bubble.update();
        bubble.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [darkMode]);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        transition: 'background-color 0.1s ease'
      }}
    />
  );
};

export default BackgroundAnimation;