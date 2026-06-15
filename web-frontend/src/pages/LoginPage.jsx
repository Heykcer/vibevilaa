import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import FloatingElements from '../components/Common/FloatingElements';
import LoginSection from '../components/Sections/LoginSection';

const LoginPage = () => {
  return (
    <>
      <Navbar />
      <FloatingElements />
      <main className="landing-fade-in">
        <LoginSection />
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;
