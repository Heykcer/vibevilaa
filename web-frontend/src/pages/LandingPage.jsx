import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Hero from '../components/Sections/Hero';
import Features from '../components/Sections/Features';
import HowItWorks from '../components/Sections/HowItWorks';
import Footer from '../components/Layout/Footer';
import FloatingElements from '../components/Common/FloatingElements';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <FloatingElements />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;

