import React from 'react';
import logo from '../../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="nav-brand">
          <img src={logo} alt="Vibe Villa Logo" className="nav-logo" />
          <span>Vibe Villa</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#watch">Watch Live</a>
        </div>
        <div>
          <button className="btn-primary">Join the Villa</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
