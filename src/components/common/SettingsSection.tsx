import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette, Radius, Spacing } from '../../theme';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function SettingsSection({ title, children }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl },
  title: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 10,
    color: Palette.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Palette.border,
  },
});
