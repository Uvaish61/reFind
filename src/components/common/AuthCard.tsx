import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../../theme';

export default function AuthCard({ children, ...rest }: ViewProps & { children: React.ReactNode }) {
  return (
    <View style={styles.card} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    padding: 20,
    marginHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
});
