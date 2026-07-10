import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme';

let LinearGradient: React.ComponentType<any> | null = null;

try {
  // Optional native dependency for RN CLI projects.
  // The app still renders without it while the dependency is being set up.
  LinearGradient = require('react-native-linear-gradient').default;
} catch {
  LinearGradient = null;
}

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
};

export default function GradientButton({ title, onPress, style, disabled, loading }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
      style={[styles.button, disabled || loading ? styles.disabled : null, style]}
    >
      {LinearGradient ? (
        <LinearGradient
          colors={['#7C3AED', '#F97316', '#FBBF24']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientFill}
        />
      ) : (
        <View style={styles.gradientFallback} />
      )}
      {loading ? <ActivityIndicator color={Colors.text} /> : <Text style={styles.title}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 6,
  },
  gradientFill: {
    ...StyleSheet.absoluteFill,
  },
  gradientFallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#7C3AED',
    opacity: 0.95,
  } as ViewStyle,
  title: { color: Colors.text, fontWeight: '700', zIndex: 2 },
  disabled: { opacity: 0.6 },
});
