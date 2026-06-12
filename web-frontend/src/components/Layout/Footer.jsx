import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <p>&copy; {new Date().getFullYear()} Vibe Villa Platform. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem', fontSize: 'var(--text-sm)' }}>
          Where anime avatars clash, alliances form, and only one survives the vote.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
