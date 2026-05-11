import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import UIRoot from './src/screens/ui/UIRoot';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <UIRoot />
    </SafeAreaView>
  );
}
