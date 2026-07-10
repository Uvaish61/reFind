import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StatusBar, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, BookMarked } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem, Collection } from '../../types';
import * as storage from '../../services/storage';
import SectionHeader from '../../components/common/SectionHeader';
import BottomNavBar, { Tab } from '../../components/common/BottomNavBar';
import StatCard from '../../components/common/StatCard';
import CollectionCard, { CARD_WIDTH } from '../../components/cards/CollectionCard';
import CollectionListRow from '../../components/cards/CollectionListRow';
import CreateCollectionSheet from '../../components/common/CreateCollectionSheet';
import CollectionOptionsSheet from '../../components/common/CollectionOptionsSheet';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { Screen } from '../ui/UIRoot';

type Props = {
  navigate: (screen: Screen) => void;
  onOpenCollection: (collection: Collection) => void;
};

function EmptyLibrary({ onCreatePress }: { onCreatePress: () => void }) {
  return (
    <View style={styles.emptyLibrary}>
      <BookMarked size={40} color={Palette.textDisabled} />
      <Text style={styles.emptyTitle}>No collections yet</Text>
      <Text style={styles.emptyMessage}>Organise your saves into collections</Text>
      <PrimaryButton label="Create first collection" onPress={onCreatePress} style={styles.emptyButton} />
    </View>
  );
}

export default function LibraryScreen({ navigate, onOpenCollection }: Props) {
  const [allItems, setAllItems] = useState<SavedItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [optionsCollection, setOptionsCollection] = useState<Collection | null>(null);

  const loadData = useCallback(async () => {
    const [items, cols] = await Promise.all([storage.getAllItems(), storage.getAllCollections()]);
    const withCounts = cols.map((c) => ({
      ...c,
      itemCount: items.filter((i) => i.collection === c.name).length,
    }));
    setAllItems(items);
    setCollections(withCounts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const pinnedCollections = collections.filter((c) => c.isPinned);
  const regularCollections = collections.filter((c) => !c.isPinned).sort((a, b) => a.name.localeCompare(b.name));

  const uniqueTagsCount = useMemo(() => {
    const tags = new Set(allItems.flatMap((i) => i.tags));
    return tags.size;
  }, [allItems]);

  const handleTabPress = (tab: Tab) => {
    if (tab === 'home') navigate('home');
    else if (tab === 'search') navigate('search');
    else if (tab === 'add') navigate('savePreview');
    else if (tab === 'library') navigate('library');
    else if (tab === 'profile') navigate('profile');
  };

  const showOptions = (collection: Collection) => setOptionsCollection(collection);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Palette.accent} colors={[Palette.accent]} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Library</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => { setEditingCollection(null); setShowCreateSheet(true); }} activeOpacity={0.8}>
            <Plus size={18} color={Palette.accent} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.loadingIndicator} color={Palette.accent} />
        ) : (
          <>
        <View style={styles.statsRow}>
          <StatCard value={allItems.length.toString()} label="Total saved" valueColor={Palette.accent} />
          <StatCard value={collections.length.toString()} label="Collections" />
          <StatCard value={uniqueTagsCount.toString()} label="Tags used" />
        </View>

        {pinnedCollections.length > 0 ? (
          <View style={styles.pinnedSection}>
            <SectionHeader title="Pinned" />
            <View style={styles.grid}>
              {pinnedCollections.map((col) => (
                <CollectionCard
                  key={col.id}
                  collection={col}
                  onPress={() => onOpenCollection(col)}
                  onLongPress={() => showOptions(col)}
                />
              ))}
              <TouchableOpacity
                onPress={() => { setEditingCollection(null); setShowCreateSheet(true); }}
                style={styles.newCollectionTile}
                activeOpacity={0.8}
              >
                <Plus size={20} color={Palette.textDisabled} />
                <Text style={styles.newCollectionText}>New collection</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={styles.allSection}>
          <SectionHeader title="All collections" />
          {regularCollections.length === 0 && pinnedCollections.length === 0 ? (
            <EmptyLibrary onCreatePress={() => { setEditingCollection(null); setShowCreateSheet(true); }} />
          ) : (
            regularCollections.map((col) => (
              <CollectionListRow
                key={col.id}
                collection={col}
                onPress={() => onOpenCollection(col)}
                onLongPress={() => showOptions(col)}
              />
            ))
          )}
        </View>
          </>
        )}
      </ScrollView>

      <BottomNavBar activeTab="library" onTabPress={handleTabPress} />

      <CreateCollectionSheet
        visible={showCreateSheet}
        editingCollection={editingCollection}
        onClose={() => setShowCreateSheet(false)}
        onCreate={() => loadData()}
        onUpdate={() => loadData()}
      />

      <CollectionOptionsSheet
        visible={optionsCollection !== null}
        collection={optionsCollection}
        onClose={() => setOptionsCollection(null)}
        onEdit={() => {
          setEditingCollection(optionsCollection);
          setShowCreateSheet(true);
        }}
        onTogglePin={() => loadData()}
        onDelete={() => loadData()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  scrollContent: { paddingBottom: 100 },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  headerTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 34, color: Palette.textPrimary },
  loadingIndicator: { marginTop: 60 },
  createBtn: {
    width: 38,
    height: 38,
    backgroundColor: Palette.input,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: { flexDirection: 'row', gap: Spacing.sm + 2, paddingHorizontal: Spacing.xl, marginBottom: Spacing.xxl },

  pinnedSection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.xxl - 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm + 2 },
  newCollectionTile: {
    width: CARD_WIDTH,
    backgroundColor: 'transparent',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.border,
    borderStyle: 'dashed',
    padding: Spacing.lg,
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  newCollectionText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textDisabled },

  allSection: { paddingHorizontal: Spacing.xl },

  emptyLibrary: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 22, color: Palette.textPrimary, marginTop: 16 },
  emptyMessage: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted, marginTop: 6, textAlign: 'center' },
  emptyButton: { marginTop: 24 },
});
