import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


// Pages
import IndexPage from './pages/index';
import HomePage from './pages/home';
import LoginPage from './pages/(auth)/login';
import SignupPage from './pages/(auth)/signup';

// Theme & Navigation Wrappers

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Authenticated Routes with Tabs */}
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>);

}