import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container-centered">
        <div className="hero-glass-panel">
          <div className="live-badge">
            <span className="live-dot"></span>
            LIVE SEASON 1
          </div>
          <h1 className="hero-title-massive">
            Where <span className="text-gradient">Anime Avatars</span> Clash in Real Time
          </h1>
          <p className="hero-subtitle-centered">
            A mobile-first reality show platform. Hide behind your avatar, communicate only through live chat, and survive the audience vote.
          </p>
          <div className="hero-actions-centered">
            <button className="btn-primary btn-large">Watch Live Now</button>
            <button className="btn-secondary btn-large">Become a Contestant</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


