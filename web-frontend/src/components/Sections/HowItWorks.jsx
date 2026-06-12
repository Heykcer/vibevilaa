import React from 'react';
import ScrollReveal from '../Common/ScrollReveal';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-it-works text-center">
      <div className="container">
        <ScrollReveal animation="zoom-in">
          <h2>How Vibe Villa Works</h2>
          <p>Your journey into the ultimate chat reality show.</p>
        </ScrollReveal>
        
        <div className="steps-container">
          <ScrollReveal animation="fade-left" delay={0.1}>
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Create Your Anime Avatar</h3>
                <p>Leave your real identity behind. Choose a unique anime avatar and craft your persona before entering the Villa.</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-right" delay={0.2}>
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Join the Live Chat</h3>
                <p>Enter the locked room with other contestants. Build alliances, stir up drama, and communicate only via text.</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" delay={0.3}>
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Survive the Vote</h3>
                <p>The live audience watches every message. Secure their favor, because when the voting round begins, the lowest rated avatars are eliminated.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
