import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import VillaRoomsPage from './pages/VillaRoomsPage';
import ChatRoomPage from './pages/ChatRoomPage';
import ErrorBoundary from './components/Common/ErrorBoundary';
import SplashScreen from './components/Common/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="app-wrapper">
      <ErrorBoundary>
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <div className="landing-fade-in">
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/villa/rooms" element={<VillaRoomsPage />} />
                <Route path="/villa/rooms/:roomId" element={<ChatRoomPage />} />
              </Routes>
            </Router>
          </div>
        )}
      </ErrorBoundary>
    </div>
  )
}

export default App;
