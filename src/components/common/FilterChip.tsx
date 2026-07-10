import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Palette } from '../../theme';

type Props = {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
};

export default function FilterChip({ label, isActive, onPress, icon }: Props) {
  return (
    <TouchableOpacity
      style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={isActive ? styles.textActive : styles.textInactive}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 100,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chipActive: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  chipInactive: { backgroundColor: Palette.input, borderColor: Palette.border },
  icon: { marginRight: -1 },
  textActive: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: '#0C0C0C' },
  textInactive: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },
});
