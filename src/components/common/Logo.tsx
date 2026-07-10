import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette } from '../../theme';

export default function Logo() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.mark}>R</Text>
      </View>
      <Text style={styles.title}>Refind</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mark: {
    fontFamily: 'DMSerifDisplay-Italic',
    fontSize: 36,
    color: '#0C0C0C',
  },
  title: {
    fontFamily: 'DMSerifDisplay-Italic',
    fontSize: 34,
    color: Palette.textPrimary,
  },
});
