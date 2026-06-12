import React from 'react';
import ScrollReveal from '../Common/ScrollReveal';

const Features = () => {
  return (
    <section id="features" className="container text-center">
      <ScrollReveal animation="fade-up">
        <h2>Why Watch Vibe Villa?</h2>
        <p>The next generation of interactive reality TV is here.</p>
      </ScrollReveal>
      
      <div className="features-grid">
        <ScrollReveal animation="fade-up" delay={0.1}>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Real-Time Chat</h3>
            <p>Contestants communicate instantly via Socket.io. Experience the drama as it unfolds, letter by letter.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={0.2}>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Live Voting</h3>
            <p>Your vote decides who stays and who goes. Live elimination votes update with zero delay.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={0.3}>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Massive Audience</h3>
            <p>Built on a high-performance architecture to support millions of concurrent viewers without lag.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={0.4}>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Moderation</h3>
            <p>A safe environment protected by AI that filters toxic content and ensures a fun experience for everyone.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Features;
