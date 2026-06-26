import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import UIRoot from './src/screens/ui/UIRoot';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />
      <UIRoot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F' },
});
