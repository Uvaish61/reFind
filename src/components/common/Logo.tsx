import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

export default function Logo() {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle} />
      <Text style={styles.title}>reFind</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.purple,
    marginBottom: 12,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
});
