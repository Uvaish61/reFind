import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../theme';

export default function UIRoot() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>reFind — UI Playground</Text>
      <Text style={styles.subtitle}>UI-first: browse and open screen placeholders.</Text>

      <View style={styles.list}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Home (placeholder)</Text>
          <Text style={styles.cardMeta}>Main feed with Reel cards</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Save Preview</Text>
          <Text style={styles.cardMeta}>Preview shared link before saving</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Search</Text>
          <Text style={styles.cardMeta}>Search UI and filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Collections</Text>
          <Text style={styles.cardMeta}>Collections grid/list</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Dashboard</Text>
          <Text style={styles.cardMeta}>Analytics & stats</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: Colors.background },
  title: { color: Colors.text, fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: Colors.muted, marginBottom: 18 },
  list: { marginTop: 8 },
  card: { backgroundColor: Colors.card, padding: 16, borderRadius: 12, marginBottom: 12 },
  cardTitle: { color: Colors.text, fontWeight: '700', fontSize: 16 },
  cardMeta: { color: Colors.muted, marginTop: 6 },
});
