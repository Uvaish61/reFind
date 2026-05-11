import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../theme';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function GradientButton({ title, onPress, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.button, style]}>
      <View style={styles.gradientFake} />
      <Text style={styles.title}>{title}</Text>
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
  gradientFake: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'linear-gradient(90deg, #7C3AED 0%, #F59E0B 100%)',
    opacity: 0.95,
  } as ViewStyle,
  title: { color: Colors.text, fontWeight: '700', zIndex: 2 },
});
