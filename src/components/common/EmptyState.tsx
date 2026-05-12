import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

type Props = {
  title?: string;
  message?: string;
  icon?: string;
};

export default function EmptyState({ title = 'No items yet', message = 'Looks like you haven\'t saved anything.', icon }: Props) {
  return (
    <View style={styles.container}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : <View style={styles.emptyIcon} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  icon: { fontSize: 48, marginBottom: 12 },
  emptyIcon: { width: 56, height: 56, borderRadius: 12, backgroundColor: Colors.card, marginBottom: 16 },
  title: { color: Colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  message: { color: Colors.muted, fontSize: 14, textAlign: 'center' },
});
