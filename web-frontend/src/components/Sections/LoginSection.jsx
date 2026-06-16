import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginSection.css';
import loginBg from '../../assets/login-bg.png';

const LoginSection = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google sign in failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
          
          {error && <div className="auth-error" style={{ color: '#ff4d4f', marginBottom: '1rem', background: 'rgba(255, 77, 79, 0.1)', padding: '10px', borderRadius: '4px', border: '1px solid #ff4d4f' }}>{error}</div>}
          
          <form className="login-form" onSubmit={handleEmailLogin}>
            <div className="form-group floating-label-group">
              <input 
                type="email" 
                id="email" 
                className="floating-input" 
                placeholder=" " 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <label htmlFor="email" className="floating-label">Avatar Email</label>
            </div>
            
            <div className="form-group floating-label-group">
              <input 
                type="password" 
                id="password" 
                className="floating-input" 
                placeholder=" " 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
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
            
            <button type="submit" disabled={loading} className="btn-primary login-submit-btn">
              <span>{loading ? 'Initializing...' : 'Initialize Link'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <span style={{ margin: '0 10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleLogin} 
              disabled={loading}
              className="btn-secondary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
            >
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Sign in with Google
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
