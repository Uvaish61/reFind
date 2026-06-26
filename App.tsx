import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import UIRoot from './src/screens/ui/UIRoot';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#7C3AED',
    background: '#0B0B0F',
    surface: '#0F1724',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0B0F" />
        <UIRoot />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F' },
});
