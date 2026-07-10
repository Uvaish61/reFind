import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Palette, Typography, Radius } from '../../theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'ghost';
  icon?: React.ReactNode;
  style?: ViewStyle;
};

export default function PrimaryButton({ label, onPress, disabled, loading, variant = 'solid', icon, style }: Props) {
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
      style={[
        styles.button,
        isGhost ? styles.ghost : styles.solid,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? Palette.textPrimary : '#0C0C0C'} size="small" />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={isGhost ? styles.ghostText : styles.solidText}>{label}</Text>
        </View>
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
  content: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  solid: { backgroundColor: Palette.accent },
  ghost: { backgroundColor: Palette.card, borderWidth: 1, borderColor: Palette.border },
  disabled: { opacity: 0.4 },
  solidText: { ...Typography.buttonLG },
  ghostText: { fontFamily: 'DMSans-Medium', fontSize: 14, color: 'rgba(242, 237, 228, 0.7)' },
});
