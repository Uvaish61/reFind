import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Colors } from '../../theme';
import HomeScreen from '../home/HomeScreen';
import SignInScreen from '../auth/SignInScreen';
import SearchScreen from '../search/SearchScreen';
import SavePreviewScreen from '../savePreview/SavePreviewScreen';
import SplashScreen from '../splash/SplashScreen';

type Screen = 'splash' | 'menu' | 'home' | 'signin' | 'search' | 'savePreview' | 'collections' | 'dashboard';

export default function UIRoot() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={() => setCurrentScreen('menu')} />;
  }

  if (currentScreen === 'home') {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <HomeScreen />
        <TouchableOpacity
          onPress={() => setCurrentScreen('menu')}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>← Back to menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'signin') {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <SignInScreen onBackToRoot={() => setCurrentScreen('menu')} />
        <TouchableOpacity
          onPress={() => setCurrentScreen('menu')}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>← Back to menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'search') {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <SearchScreen />
        <TouchableOpacity
          onPress={() => setCurrentScreen('menu')}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>← Back to menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'savePreview') {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <SavePreviewScreen onCancelPress={() => setCurrentScreen('menu')} />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>reFind — UI Playground</Text>
      <Text style={styles.subtitle}>UI-first: browse and open screen placeholders.</Text>

      <View style={styles.list}>
        <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('home')} activeOpacity={0.8}>
          <Text style={styles.cardTitle}>Home</Text>
          <Text style={styles.cardMeta}>Main feed with Reel cards</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('signin')} activeOpacity={0.8}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardMeta}>Login with email/password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('search')} activeOpacity={0.8}>
          <Text style={styles.cardTitle}>Search</Text>
          <Text style={styles.cardMeta}>Search UI and filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('savePreview')} activeOpacity={0.8}>
          <Text style={styles.cardTitle}>Save Preview</Text>
          <Text style={styles.cardMeta}>Save link with notes & tags</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('collections')} activeOpacity={0.8}>
          <Text style={styles.cardTitle}>Collections</Text>
          <Text style={styles.cardMeta}>Collections grid/list</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('dashboard')} activeOpacity={0.8}>
          <Text style={styles.cardTitle}>Dashboard</Text>
          <Text style={styles.cardMeta}>Analytics & stats</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: 24, backgroundColor: Colors.background },
  title: { color: Colors.text, fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: Colors.muted, marginBottom: 18 },
  list: { marginTop: 8 },
  card: { backgroundColor: Colors.card, padding: 16, borderRadius: 12, marginBottom: 12 },
  cardTitle: { color: Colors.text, fontWeight: '700', fontSize: 16 },
  cardMeta: { color: Colors.muted, marginTop: 6 },
  backButton: { position: 'absolute', bottom: 20, left: 20, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: Colors.card, borderRadius: 10, borderWidth: 1, borderColor: '#1F2937' },
  backText: { color: Colors.purple, fontWeight: '600', fontSize: 14 },
});
