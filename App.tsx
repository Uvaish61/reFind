import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AuthScreen from './src/screens/auth/AuthScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <AuthScreen />
    </SafeAreaView>
  );
}
