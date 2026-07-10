import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../splash/SplashScreen';
import OnboardingScreen from '../onboarding/OnboardingScreen';
import SignInScreen from '../auth/SignInScreen';
import SignupScreen from '../auth/SignupScreen';
import HomeScreen from '../home/HomeScreen';
import SearchScreen from '../search/SearchScreen';
import SavePreviewScreen from '../savePreview/SavePreviewScreen';

export type Screen =
  | 'splash'
  | 'onboarding'
  | 'signin'
  | 'signup'
  | 'home'
  | 'search'
  | 'collections'
  | 'savePreview'
  | 'profile';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export default function UIRoot() {
  const [screen, setScreen] = useState<Screen>('splash');
  const onboardingComplete = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY).then((value) => {
      onboardingComplete.current = value === 'true';
    });
  }, []);

  const finishOnboarding = () => {
    AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    setScreen('signin');
  };

  if (screen === 'splash') {
    return <SplashScreen onFinish={() => setScreen(onboardingComplete.current ? 'signin' : 'onboarding')} />;
  }

  if (screen === 'onboarding') {
    return <OnboardingScreen onGetStarted={finishOnboarding} onSignInPress={finishOnboarding} />;
  }

  if (screen === 'signin') {
    return <SignInScreen navigate={setScreen} />;
  }

  if (screen === 'signup') {
    return <SignupScreen navigate={setScreen} />;
  }

  if (screen === 'search') {
    return <SearchScreen />;
  }

  if (screen === 'savePreview') {
    return <SavePreviewScreen onCancelPress={() => setScreen('home')} onSavePress={() => setScreen('home')} />;
  }

  return <HomeScreen navigate={setScreen} />;
}
