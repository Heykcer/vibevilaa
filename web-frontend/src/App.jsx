import { useState } from 'react';
import './App.css'
import LandingPage from './pages/LandingPage';
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
            <LandingPage />
          </div>
        )}
      </ErrorBoundary>
    </div>
  )
}

export default App;
