import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../splash/SplashScreen';
import OnboardingScreen from '../onboarding/OnboardingScreen';
import SignInScreen from '../auth/SignInScreen';
import SignupScreen from '../auth/SignupScreen';
import HomeScreen from '../home/HomeScreen';
import SearchScreen from '../search/SearchScreen';
import SavePreviewScreen from '../savePreview/SavePreviewScreen';
import SaveSuccessScreen from '../savePreview/SaveSuccessScreen';
import LibraryScreen from '../library/LibraryScreen';
import CollectionDetailScreen from '../library/CollectionDetailScreen';
import ProfileScreen from '../profile/ProfileScreen';
import StatisticsScreen from '../statistics/StatisticsScreen';
import { Collection, SavedItem } from '../../types';

export type Screen =
  | 'splash'
  | 'onboarding'
  | 'signin'
  | 'signup'
  | 'home'
  | 'search'
  | 'library'
  | 'collectionDetail'
  | 'savePreview'
  | 'saveSuccess'
  | 'profile'
  | 'statistics';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export default function UIRoot() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [lastSavedItem, setLastSavedItem] = useState<SavedItem | null>(null);
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
    return <SearchScreen navigate={setScreen} />;
  }

  if (screen === 'savePreview') {
    return (
      <SavePreviewScreen
        onBack={() => setScreen('home')}
        onSaved={(item) => {
          setLastSavedItem(item);
          setScreen('saveSuccess');
        }}
      />
    );
  }

  if (screen === 'saveSuccess') {
    return <SaveSuccessScreen navigate={setScreen} savedItem={lastSavedItem} />;
  }

  if (screen === 'library') {
    return (
      <LibraryScreen
        navigate={setScreen}
        onOpenCollection={(collection) => {
          setSelectedCollection(collection);
          setScreen('collectionDetail');
        }}
      />
    );
  }

  if (screen === 'collectionDetail' && selectedCollection) {
    return <CollectionDetailScreen collection={selectedCollection} navigate={setScreen} />;
  }

  if (screen === 'profile') {
    return <ProfileScreen navigate={setScreen} />;
  }

  if (screen === 'statistics') {
    return <StatisticsScreen navigate={setScreen} onBack={() => setScreen('profile')} />;
  }

  return <HomeScreen navigate={setScreen} />;
}
