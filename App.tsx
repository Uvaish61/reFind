import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import UIRoot from './src/screens/ui/UIRoot';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <UIRoot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
