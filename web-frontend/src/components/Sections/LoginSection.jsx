import React from 'react';
import './LoginSection.css';
import loginBg from '../../assets/login-bg.png';

const LoginSection = () => {
  return (
    <section className="login-section">
      <div className="login-card">
        <div className="login-visual">
          <div className="login-visual-bg" style={{ backgroundImage: `url(${loginBg})` }}></div>
          <div className="login-visual-overlay"></div>
          <div className="login-visual-content">
            <h2 className="glitch-text" data-text="Vibe Villa">Vibe Villa</h2>
            <p className="typewriter-text">Where Digital Reality Begins</p>
          </div>
        </div>
        <div className="login-form-container">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Enter your credentials to access the villa.</p>
          </div>
          
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group floating-label-group">
              <input type="email" id="email" className="floating-input" placeholder=" " required />
              <label htmlFor="email" className="floating-label">Avatar Email</label>
            </div>
            
            <div className="form-group floating-label-group">
              <input type="password" id="password" className="floating-input" placeholder=" " required />
              <label htmlFor="password" className="floating-label">Secret Key</label>
            </div>
            
            <div className="form-options">
              <label className="custom-checkbox">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <span className="checkbox-text">Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot Key?</a>
            </div>
            
            <button type="submit" className="btn-primary login-submit-btn">
              <span>Initialize Link</span>
            </button>
          </form>
          
          <p className="login-footer">
            Don't have an avatar yet? <a href="#" className="apply-link">Apply Now</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
