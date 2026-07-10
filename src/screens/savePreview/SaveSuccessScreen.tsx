import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { Palette } from '../../theme';
import { SavedItem } from '../../types';
import { Screen } from '../ui/UIRoot';

type Props = {
  navigate: (screen: Screen) => void;
  savedItem: SavedItem | null;
};

export default function SaveSuccessScreen({ navigate, savedItem }: Props) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, tension: 120, friction: 8, useNativeDriver: true }).start();
  }, [scale]);

  useEffect(() => {
    const timer = setTimeout(() => navigate('home'), 1800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <View style={styles.content}>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
          <Check size={36} color={Palette.accent} />
        </Animated.View>

        <Text style={styles.title}>Saved!</Text>
        <Text style={styles.subtitle}>Your content is in Refind.</Text>

        <TouchableOpacity
          onPress={() => {
            if (savedItem) console.log('Open item detail:', savedItem.id);
            navigate('home');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.link}>View saved item →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32 },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.accentDim,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 34, color: Palette.textPrimary },
  subtitle: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted, textAlign: 'center' },
  link: { fontFamily: 'DMSans-SemiBold', fontSize: 14, color: Palette.accent, marginTop: 8 },
});
