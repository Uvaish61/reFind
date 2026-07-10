import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Palette, Typography, Radius } from '../../theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
};

export default function PrimaryButton({ label, onPress, disabled, loading, variant = 'solid', style }: Props) {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
      style={[
        styles.button,
        isOutline ? styles.outline : styles.solid,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? Palette.textPrimary : '#0C0C0C'} />
      ) : (
        <Text style={isOutline ? styles.outlineText : styles.solidText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  solid: { backgroundColor: Palette.accent },
  outline: { backgroundColor: Palette.card, borderWidth: 1, borderColor: Palette.border },
  disabled: { opacity: 0.4 },
  solidText: { ...Typography.buttonLG },
  outlineText: { ...Typography.buttonLG, color: Palette.textPrimary },
});
