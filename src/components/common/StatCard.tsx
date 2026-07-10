import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette, Radius } from '../../theme';

type Props = {
  value: string;
  label: string;
  valueColor?: string;
};

export default function StatCard({ value, label, valueColor }: Props) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 14,
  },
  value: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 28, lineHeight: 32, color: Palette.textPrimary, marginBottom: 4 },
  label: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textMuted },
});
