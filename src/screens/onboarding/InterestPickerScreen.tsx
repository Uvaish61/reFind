import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, StatusBar, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Palette, Radius } from '../../theme';
import { Collection } from '../../types';
import * as storage from '../../services/storage';
import { Screen } from '../ui/UIRoot';

type Props = {
  navigate: (screen: Screen) => void;
};

type Interest = { id: string; emoji: string; label: string; collection: string };

const INTERESTS: Interest[] = [
  { id: 'dev', emoji: '⚛️', label: 'Development', collection: 'Development' },
  { id: 'movies', emoji: '🎬', label: 'Movies', collection: 'Movies' },
  { id: 'fitness', emoji: '💪', label: 'Fitness', collection: 'Fitness' },
  { id: 'recipes', emoji: '🍳', label: 'Recipes', collection: 'Recipes' },
  { id: 'career', emoji: '💼', label: 'Career', collection: 'Career' },
  { id: 'travel', emoji: '✈️', label: 'Travel', collection: 'Travel' },
  { id: 'music', emoji: '🎵', label: 'Music', collection: 'Music' },
  { id: 'science', emoji: '🔬', label: 'Science', collection: 'Science' },
  { id: 'design', emoji: '🎨', label: 'Design', collection: 'Design' },
  { id: 'finance', emoji: '💰', label: 'Finance', collection: 'Finance' },
  { id: 'reading', emoji: '📚', label: 'Reading', collection: 'Reading' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming', collection: 'Gaming' },
];

const GRID_GAP = 10;
const CELL_WIDTH = (Dimensions.get('window').width - 48 - GRID_GAP * 2) / 3;

function InterestCell({ item, isActive, onPress }: { item: Interest; isActive: boolean; onPress: () => void }) {
  const checkAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkAnim, { toValue: isActive ? 1 : 0, tension: 200, friction: 12, useNativeDriver: true }).start();
  }, [isActive, checkAnim]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.cell, isActive ? styles.cellActive : styles.cellInactive]}
    >
      <Text style={styles.cellEmoji}>{item.emoji}</Text>
      <Text style={[styles.cellLabel, isActive ? styles.cellLabelActive : styles.cellLabelInactive]}>
        {item.label}
      </Text>
      <View style={[styles.checkCircle, isActive ? styles.checkCircleActive : styles.checkCircleInactive]}>
        <Animated.Text style={[styles.checkMark, { transform: [{ scale: checkAnim }], opacity: checkAnim }]}>✓</Animated.Text>
      </View>
    </TouchableOpacity>
  );
}

export default function InterestPickerScreen({ navigate }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const selectedCount = selected.length;

  const handleCreate = async () => {
    if (selectedCount === 0) return;
    setIsCreating(true);

    const toCreate = INTERESTS.filter((i) => selected.includes(i.id));
    const collections: Collection[] = toCreate.map((item, idx) => ({
      id: `${Date.now()}_${idx}`,
      name: item.collection,
      emoji: item.emoji,
      isPinned: idx < 2,
      itemCount: 0,
      createdAt: new Date().toISOString(),
    }));

    for (const col of collections) {
      await storage.saveCollection(col);
    }

    await AsyncStorage.setItem('interests_picked', 'true');

    setIsCreating(false);
    navigate('signin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Last step</Text>
          <Text style={styles.heading}>What do you save most?</Text>
          <Text style={styles.subheading}>We'll create starter collections for you. Pick as many as you like.</Text>
        </View>

        <View style={styles.grid}>
          {INTERESTS.map((item) => (
            <InterestCell key={item.id} item={item} isActive={selected.includes(item.id)} onPress={() => toggle(item.id)} />
          ))}
        </View>

        <View style={styles.cta}>
          <TouchableOpacity
            onPress={handleCreate}
            disabled={selectedCount === 0 || isCreating}
            activeOpacity={0.85}
            style={[styles.primaryBtn, selectedCount > 0 ? styles.primaryBtnActive : styles.primaryBtnInactive]}
          >
            {isCreating ? (
              <ActivityIndicator color="#0C0C0C" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {selectedCount > 0 ? `Create ${selectedCount} Collection${selectedCount > 1 ? 's' : ''} →` : 'Select at least one'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipBtn} activeOpacity={0.8} onPress={() => navigate('signin')}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  scrollContent: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 48 },

  header: { marginBottom: 28 },
  eyebrow: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted, letterSpacing: 0.4, marginBottom: 6 },
  heading: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 32, color: Palette.textPrimary, lineHeight: 38, marginBottom: 8 },
  subheading: { fontFamily: 'DMSans-Regular', fontSize: 13, color: Palette.textMuted, lineHeight: 20 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP, marginBottom: 28 },
  cell: { width: CELL_WIDTH, borderRadius: Radius.xl, padding: 14, alignItems: 'center', gap: 8 },
  cellActive: { backgroundColor: Palette.accentDim, borderWidth: 1.5, borderColor: Palette.accent },
  cellInactive: { backgroundColor: Palette.card, borderWidth: 1, borderColor: Palette.border },
  cellEmoji: { fontSize: 26 },
  cellLabel: { fontSize: 12, textAlign: 'center' },
  cellLabelActive: { fontFamily: 'DMSans-SemiBold', color: Palette.accent },
  cellLabelInactive: { fontFamily: 'DMSans-Regular', color: Palette.textMuted },
  checkCircle: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  checkCircleActive: { backgroundColor: Palette.accent, borderWidth: 0 },
  checkCircleInactive: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Palette.border },
  checkMark: { fontSize: 10, color: '#0C0C0C', fontWeight: '800' },

  cta: { gap: 10 },
  primaryBtn: { height: 54, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center' },
  primaryBtnActive: { backgroundColor: Palette.accent, opacity: 1 },
  primaryBtnInactive: { backgroundColor: Palette.input, opacity: 0.5 },
  primaryBtnText: { fontFamily: 'DMSans-Bold', fontSize: 15, color: '#0C0C0C' },
  skipBtn: { alignItems: 'center', paddingTop: 4 },
  skipText: { fontFamily: 'DMSans-Regular', fontSize: 13, color: Palette.textMuted },
});
