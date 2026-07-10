import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Youtube, Instagram, Linkedin, Facebook, Twitter } from 'lucide-react-native';
import { Palette, Radius } from '../../theme';

type Props = {
  platform: string;
  pct: number;
  animVal: Animated.Value;
};

const PLATFORM_COLORS: Record<string, string> = {
  youtube: '#ff0000',
  instagram: '#c13584',
  linkedin: '#0077b5',
  facebook: '#1877f2',
  x: '#aaaaaa',
};

const PLATFORM_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  x: Twitter,
};

export default function PlatformBar({ platform, pct, animVal }: Props) {
  const Icon = PLATFORM_ICONS[platform];
  const color = PLATFORM_COLORS[platform] ?? Palette.textMuted;
  const width = animVal.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${pct}%`] });

  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: color }]}>
        {Icon ? <Icon size={14} color="#fff" /> : null}
      </View>

      <View style={styles.flex}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
          <Text style={styles.pct}>{pct}%</Text>
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  badge: { width: 28, height: 28, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textPrimary },
  pct: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },
  track: { height: 5, backgroundColor: Palette.input, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Palette.accent, borderRadius: 3 },
});
