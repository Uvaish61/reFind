import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Palette, Radius } from '../../theme';

type Props = {
  label: string;
  icon: LucideIcon;
  value: boolean;
  onToggle: (val: boolean) => void;
  isLast?: boolean;
};

export default function ToggleRow({ label, icon: Icon, value, onToggle, isLast }: Props) {
  const animVal = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animVal, { toValue: value ? 1 : 0, tension: 180, friction: 12, useNativeDriver: true }).start();
  }, [value, animVal]);

  const translateX = animVal.interpolate({ inputRange: [0, 1], outputRange: [0, 18] });

  return (
    <View style={[styles.row, isLast ? styles.rowLast : null]}>
      <View style={styles.iconBox}>
        <Icon size={16} color={Palette.textPrimary} />
      </View>

      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.track, { backgroundColor: value ? Palette.accent : Palette.input, borderColor: value ? Palette.accent : Palette.border }]}
        activeOpacity={0.8}
        onPress={() => onToggle(!value)}
      >
        <Animated.View style={[styles.thumb, { backgroundColor: value ? '#0C0C0C' : 'rgba(242,237,228,0.4)', transform: [{ translateX }] }]} />
      </TouchableOpacity>
    </View>
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
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  thumb: { width: 20, height: 20, borderRadius: 10 },
});
