import React, { useState } from 'react';
import SplashScreen from '../splash/SplashScreen';
import OnboardingScreen from '../onboarding/OnboardingScreen';
import SignInScreen from '../auth/SignInScreen';
import SignupScreen from '../auth/SignupScreen';
import HomeScreen from '../home/HomeScreen';

type Screen = 'splash' | 'onboarding' | 'signin' | 'signup' | 'home';

export default function UIRoot() {
  const [screen, setScreen] = useState<Screen>('splash');

  if (screen === 'splash') {
    return <SplashScreen onFinish={() => setScreen('onboarding')} />;
  }

  if (screen === 'onboarding') {
    return <OnboardingScreen onFinish={() => setScreen('signin')} />;
  }

  if (screen === 'signin') {
    return (
      <SignInScreen
        onSignUpPress={() => setScreen('signup')}
        onContinueAsGuest={() => setScreen('home')}
        onBackToRoot={() => setScreen('signin')}
      />
    );
  }

  if (screen === 'signup') {
    return (
      <SignupScreen
        onSignInPress={() => setScreen('signin')}
        onContinueAsGuest={() => setScreen('home')}
        onBackToRoot={() => setScreen('signin')}
      />
    );
  }

  return <HomeScreen />;
}
