import React from 'react';

const FloatingElements = () => {
  return (
    <div className="floating-elements-container" aria-hidden="true">
      {/* Glowing abstract Orbs */}
      <div className="float-orb orb-1"></div>
      <div className="float-orb orb-2"></div>
      <div className="float-orb orb-3"></div>
      
      {/* Floating interactive-looking shapes/emojis relevant to a chat reality show */}
      <div className="float-bubble bubble-1">💬</div>
      <div className="float-bubble bubble-2">⭐</div>
      <div className="float-bubble bubble-3">🔥</div>
      <div className="float-bubble bubble-4">🎭</div>
    </div>
  );
};

export default FloatingElements;
