import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

type Props = {
  colors: string[];
  width: number;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
};

let gradientCount = 0;

export default function GradientBox({ colors, width, height, borderRadius = 0, style, children }: Props) {
  const id = React.useRef(`gradient-box-${gradientCount++}`).current;

  return (
    <View style={[{ width, height, borderRadius }, styles.center, style]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            {colors.map((c, i) => (
              <Stop key={i} offset={`${(i / Math.max(colors.length - 1, 1)) * 100}%`} stopColor={c} />
            ))}
          </LinearGradient>
        </Defs>
        <Rect width={width} height={height} fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
