import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { Platform, SearchFilters } from '../../types';
import FilterChip from './FilterChip';
import PrimaryButton from '../buttons/PrimaryButton';

type Props = {
  visible: boolean;
  filters: SearchFilters;
  allTags: string[];
  allCollections: string[];
  onApply: (filters: SearchFilters) => void;
  onClose: () => void;
};

const PLATFORMS: { label: string; value: Platform | null }[] = [
  { label: 'All', value: null },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'X', value: 'x' },
];

const SORT_OPTIONS: { label: string; value: SearchFilters['sortBy'] }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'A–Z', value: 'title' },
];

const DEFAULT_FILTERS: SearchFilters = {
  platform: null,
  collection: null,
  tags: [],
  favoritesOnly: false,
  sortBy: 'newest',
};

export default function FilterBottomSheet({ visible, filters, onApply, onClose }: Props) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    if (visible) setLocalFilters(filters);
  }, [visible, filters]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.sheet}>
        <View style={styles.dragHandle} />

        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={() => setLocalFilters(DEFAULT_FILTERS)} activeOpacity={0.8}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PLATFORM</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {PLATFORMS.map((p) => (
              <FilterChip
                key={p.label}
                label={p.label}
                isActive={localFilters.platform === p.value}
                onPress={() => setLocalFilters((f) => ({ ...f, platform: p.value }))}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SORT BY</Text>
          <View style={styles.chipRow}>
            {SORT_OPTIONS.map((s) => (
              <FilterChip
                key={s.value}
                label={s.label}
                isActive={localFilters.sortBy === s.value}
                onPress={() => setLocalFilters((f) => ({ ...f, sortBy: s.value }))}
              />
            ))}
          </View>
        </View>

        <View style={styles.favoritesRow}>
          <Text style={styles.favoritesLabel}>Favorites only</Text>
          <Switch
            trackColor={{ false: Palette.border, true: Palette.accent }}
            thumbColor="#0C0C0C"
            value={localFilters.favoritesOnly}
            onValueChange={(v) => setLocalFilters((f) => ({ ...f, favoritesOnly: v }))}
          />
        </View>

        <PrimaryButton
          label="Apply Filters"
          onPress={() => {
            onApply(localFilters);
            onClose();
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xl,
    paddingBottom: 40,
    gap: Spacing.xl,
  },
  dragHandle: { width: 36, height: 4, backgroundColor: Palette.border, borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 22, color: Palette.textPrimary },
  resetText: { fontFamily: 'DMSans-Medium', fontSize: 13, color: Palette.accent },
  section: {},
  sectionLabel: { fontFamily: 'DMSans-SemiBold', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: Palette.textMuted, marginBottom: 10 },
  chipRow: { flexDirection: 'row', gap: 8 },
  favoritesRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favoritesLabel: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textPrimary },
});
