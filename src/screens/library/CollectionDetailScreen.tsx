import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Dimensions, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MoreHorizontal, List, Grid2x2, ArrowUpDown, BookOpen } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem, Collection } from '../../types';
import * as storage from '../../services/storage';
import ReelCard, { platformGradient, timeAgo } from '../../components/cards/ReelCard';
import GradientBox from '../../components/common/GradientBox';
import CreateCollectionSheet from '../../components/common/CreateCollectionSheet';
import CollectionOptionsSheet from '../../components/common/CollectionOptionsSheet';
import { Screen } from '../ui/UIRoot';

type Props = {
  collection: Collection;
  navigate: (screen: Screen) => void;
  onBack: () => void;
  onOpenTag: (tag: string) => void;
};

type ViewMode = 'list' | 'grid';
type SortBy = 'newest' | 'oldest' | 'title';

const SORT_LABELS: Record<SortBy, string> = { newest: 'Newest', oldest: 'Oldest', title: 'A–Z' };
const GRID_GAP = 10;
const CARD_WIDTH = (Dimensions.get('window').width - Spacing.xl * 2 - GRID_GAP) / 2;

function nextSort(sortBy: SortBy): SortBy {
  if (sortBy === 'newest') return 'oldest';
  if (sortBy === 'oldest') return 'title';
  return 'newest';
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function GridCard({ item, onPress }: { item: SavedItem; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.gridCard} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.gridThumb}>
        {item.thumbnailUri ? (
          <Image source={{ uri: item.thumbnailUri }} style={styles.gridThumbImage} />
        ) : (
          <GradientBox colors={platformGradient[item.platform]} width={CARD_WIDTH} height={100} />
        )}
        <View style={styles.gridPlatformBadge}>
          <Text style={styles.gridPlatformText}>{capitalize(item.platform)}</Text>
        </View>
      </View>

      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.gridCreator} numberOfLines={1}>{item.creator}</Text>
        {item.tags[0] ? (
          <View style={styles.gridTagChip}>
            <Text style={styles.gridTagText}>#{item.tags[0]}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function EmptyCollection({ onAdd }: { onAdd: () => void }) {
  return (
    <View style={styles.emptyState}>
      <BookOpen size={36} color={Palette.textDisabled} />
      <Text style={styles.emptyTitle}>Nothing in this collection</Text>
      <Text style={styles.emptyMessage}>Save links and assign them to this collection</Text>
      <TouchableOpacity style={styles.emptyAddBtn} activeOpacity={0.85} onPress={onAdd}>
        <Text style={styles.emptyAddBtnText}>Add first item</Text>
      </TouchableOpacity>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

export default function CollectionDetailScreen({ collection, navigate, onBack, onOpenTag }: Props) {
  const [currentCollection, setCurrentCollection] = useState(collection);
  const [items, setItems] = useState<SavedItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const loadItems = async () => {
    const all = await storage.getAllItems();
    setItems(all.filter((i) => i.collection === currentCollection.name));
    setIsLoading(false);
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCollection.name]);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    });
  }, [items, sortBy]);

  const latestItem = useMemo(
    () => (items.length > 0 ? items.reduce((a, b) => (new Date(a.savedAt) > new Date(b.savedAt) ? a : b)) : null),
    [items],
  );

  const CollectionHeader = (
    <View>
      <View style={styles.backRow}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8} onPress={onBack}>
          <ChevronLeft size={18} color={Palette.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8} onPress={() => setShowOptions(true)}>
          <MoreHorizontal size={18} color={Palette.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <View style={styles.emojiBadge}>
          <Text style={styles.emojiText}>{currentCollection.emoji}</Text>
        </View>
        <Text style={styles.collectionName}>{currentCollection.name}</Text>
        <Text style={styles.collectionMeta}>
          {items.length} items{latestItem ? ` · Updated ${timeAgo(latestItem.savedAt)}` : ''}
        </Text>

        <View style={styles.viewToggle}>
          {(['list', 'grid'] as ViewMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setViewMode(mode)}
              style={[styles.viewToggleBtn, viewMode === mode ? styles.viewToggleBtnActive : null]}
            >
              {mode === 'list' ? (
                <List size={14} color={viewMode === mode ? '#0C0C0C' : Palette.textMuted} />
              ) : (
                <Grid2x2 size={14} color={viewMode === mode ? '#0C0C0C' : Palette.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortCount}>{sorted.length} items</Text>
        <TouchableOpacity style={styles.sortBtn} activeOpacity={0.7} onPress={() => setSortBy(nextSort(sortBy))}>
          <ArrowUpDown size={12} color={Palette.textMuted} />
          <Text style={styles.sortLabel}>{SORT_LABELS[sortBy]}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />

      {viewMode === 'list' ? (
        <FlatList
          data={sorted}
          keyExtractor={(i) => i.id}
          ListHeaderComponent={CollectionHeader}
          renderItem={({ item }) => (
            <ReelCard item={item} onPress={() => {}} onTagPress={onOpenTag} />
          )}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={!isLoading ? <EmptyCollection onAdd={() => navigate('savePreview')} /> : null}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={loadItems}
        />
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(i) => i.id}
          numColumns={2}
          ListHeaderComponent={CollectionHeader}
          renderItem={({ item }) => <GridCard item={item} onPress={() => {}} />}
          columnWrapperStyle={styles.gridRow}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={!isLoading ? <EmptyCollection onAdd={() => navigate('savePreview')} /> : null}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={loadItems}
        />
      )}

      <CollectionOptionsSheet
        visible={showOptions}
        collection={currentCollection}
        onClose={() => setShowOptions(false)}
        onEdit={() => setShowEditSheet(true)}
        onTogglePin={() => setCurrentCollection((c) => ({ ...c, isPinned: !c.isPinned }))}
        onDelete={onBack}
      />

      <CreateCollectionSheet
        visible={showEditSheet}
        editingCollection={currentCollection}
        onClose={() => setShowEditSheet(false)}
        onCreate={() => {}}
        onUpdate={(updated) => setCurrentCollection(updated)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: 60 },
  separator: { height: 10 },
  gridRow: { gap: GRID_GAP },

  backRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingTop: Spacing.sm },
  iconBtn: {
    width: 36,
    height: 36,
    backgroundColor: Palette.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hero: { alignItems: 'center', gap: 10, marginBottom: 24 },
  emojiBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Palette.accentDim,
    borderWidth: 2,
    borderColor: Palette.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 34 },
  collectionName: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 28, color: Palette.textPrimary, textAlign: 'center' },
  collectionMeta: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },
  viewToggle: { flexDirection: 'row', backgroundColor: Palette.card, borderRadius: 10, padding: 3, gap: 2 },
  viewToggleBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 7 },
  viewToggleBtnActive: { backgroundColor: Palette.accent },

  sortRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sortCount: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sortLabel: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },

  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  gridThumb: { height: 100, position: 'relative' },
  gridThumbImage: { width: '100%', height: '100%' },
  gridPlatformBadge: { position: 'absolute', bottom: 6, left: 8, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 5, paddingVertical: 2, paddingHorizontal: 7 },
  gridPlatformText: { fontFamily: 'DMSans-Regular', fontSize: 9, color: Palette.textPrimary },
  gridInfo: { padding: 10 },
  gridTitle: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: Palette.textPrimary, marginBottom: 4 },
  gridCreator: { fontFamily: 'DMSans-Regular', fontSize: 10, color: Palette.textMuted },
  gridTagChip: { backgroundColor: Palette.accentDim, borderRadius: 4, marginTop: 6, paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start' },
  gridTagText: { fontFamily: 'DMSans-Regular', fontSize: 9, color: Palette.accent },

  emptyState: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 32 },
  emptyTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 22, color: Palette.textPrimary, textAlign: 'center', marginTop: 16 },
  emptyMessage: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted, textAlign: 'center', marginTop: 8 },
  emptyAddBtn: { marginTop: 20, backgroundColor: Palette.accent, borderRadius: Radius.lg, paddingVertical: 12, paddingHorizontal: 24 },
  emptyAddBtnText: { fontFamily: 'DMSans-Bold', fontSize: 14, color: '#0C0C0C' },
});
