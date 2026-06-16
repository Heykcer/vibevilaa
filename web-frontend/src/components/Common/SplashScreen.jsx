import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo_chat_villa.png';

const SplashScreen = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show splash for 2.5 seconds before starting fade out
    const timer1 = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Completely remove from DOM after 3.2 seconds (allowing 0.7s for smooth fade)
    const timer2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isFadingOut ? 'splash-fade-out' : ''}`}>
      <div className="splash-content">
        <img src={logo} alt="Vibe Villa Logo" className="splash-logo" />
        <h1 className="splash-title">VIBE VILLA</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
