import React, { useState } from 'react';
import SplashScreen from '../pages/SplashScreen';
import HomeScreen from '../pages/HomeScreen';

export default function IndexRoute() {
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  if (!isSplashFinished) {
    return <SplashScreen onFinish={() => setIsSplashFinished(true)} />;
  }

  return <HomeScreen />;
}
