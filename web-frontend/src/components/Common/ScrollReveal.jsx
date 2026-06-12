import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ children, animation = 'fade-up', delay = 0, duration = 0.8 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Unobserve to trigger animation only once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-up': return 'reveal-fade-up';
      case 'fade-left': return 'reveal-fade-left';
      case 'fade-right': return 'reveal-fade-right';
      case 'zoom-in': return 'reveal-zoom-in';
      case 'flip-up': return 'reveal-flip-up';
      default: return 'reveal-fade-up';
    }
  };

  return (
    <div
      ref={domRef}
      className={`reveal-wrapper ${getAnimationClass()} ${isVisible ? 'is-visible' : ''}`}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
