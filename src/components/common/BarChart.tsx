import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette } from '../../theme';

type Props = {
  data: { label: string; count: number }[];
  height: number;
  accentColor: string;
};

export default function BarChart({ data, height, accentColor }: Props) {
  const maxVal = Math.max(...data.map((d) => d.count), 1);

  return (
    <View style={[styles.row, { height }]}>
      {data.map((d, i) => {
        const isLast = i === data.length - 1;
        const barHeight = Math.max((d.count / maxVal) * height, 4);
        return (
          <View key={i} style={styles.bar}>
            <View
              style={[
                styles.fill,
                {
                  height: barHeight,
                  backgroundColor: isLast
                    ? accentColor
                    : d.count > 0
                    ? `${accentColor}44`
                    : 'rgba(242,237,228,0.06)',
                },
              ]}
            />
            <Text style={styles.label}>{d.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 5 },
  bar: { alignItems: 'center', gap: 4 },
  fill: { width: 8, borderRadius: 3 },
  label: { fontFamily: 'DMSans-Regular', fontSize: 8, color: Palette.textDisabled },
});
