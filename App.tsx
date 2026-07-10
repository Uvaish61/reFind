import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UIRoot from './src/screens/ui/UIRoot';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />
      <UIRoot />
    </SafeAreaProvider>
  );
}
