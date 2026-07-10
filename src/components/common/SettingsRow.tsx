import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { Palette, Radius } from '../../theme';

type Props = {
  label: string;
  icon: LucideIcon;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
};

export default function SettingsRow({ label, icon: Icon, value, onPress, showChevron, isLast }: Props) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.row, isLast ? styles.rowLast : null]}
      activeOpacity={onPress ? 0.7 : undefined}
      onPress={onPress}
    >
      <View style={styles.iconBox}>
        <Icon size={16} color={Palette.textPrimary} />
      </View>

      <Text style={styles.label}>{label}</Text>

      {value ? <Text style={styles.value}>{value}</Text> : null}
      {showChevron ? <ChevronRight size={16} color={Palette.textDisabled} /> : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  rowLast: { borderBottomWidth: 0 },
  iconBox: {
    width: 32,
    height: 32,
    backgroundColor: Palette.bg,
    borderRadius: Radius.sm + 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textPrimary },
  value: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },
});
