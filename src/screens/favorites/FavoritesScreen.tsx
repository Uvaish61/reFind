import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ArrowUpDown, Heart } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem } from '../../types';
import * as storage from '../../services/storage';
import GradientBox from '../../components/common/GradientBox';
import { platformGradient } from '../../components/cards/ReelCard';
import { Screen } from '../ui/UIRoot';

type Props = {
  navigate: (screen: Screen) => void;
  onBack: () => void;
};

type SortBy = 'newest' | 'oldest' | 'title';

const SORT_LABELS: Record<SortBy, string> = { newest: 'Newest first', oldest: 'Oldest first', title: 'A–Z' };

function nextSort(sortBy: SortBy): SortBy {
  if (sortBy === 'newest') return 'oldest';
  if (sortBy === 'oldest') return 'title';
  return 'newest';
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function FavoritesHeader({ count, sortBy, onSortChange }: { count: number; sortBy: SortBy; onSortChange: (s: SortBy) => void }) {
  return (
    <View style={styles.headerWrap}>
      <Text style={styles.headerLabel}>Starred items</Text>
      <Text style={styles.headerTitle}>Favorites</Text>

      <View style={styles.metaRow}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {count} item{count !== 1 ? 's' : ''}
          </Text>
        </View>

        <TouchableOpacity style={styles.sortBtn} activeOpacity={0.7} onPress={() => onSortChange(nextSort(sortBy))}>
          <ArrowUpDown size={12} color={Palette.textMuted} />
          <Text style={styles.sortLabel}>{SORT_LABELS[sortBy]}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FavoriteCard({ item, onPress, onUnfavorite }: { item: SavedItem; onPress: () => void; onUnfavorite: () => void }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.thumbnail}>
        <GradientBox colors={platformGradient[item.platform]} width={62} height={62} borderRadius={Radius.md} />
        <View style={styles.heartBadge}>
          <Heart size={8} color="#0C0C0C" fill="#0C0C0C" />
        </View>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardMeta} numberOfLines={1}>{item.creator} · {capitalize(item.platform)}</Text>
        {item.tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <TouchableOpacity style={styles.unfavoriteBtn} onPress={onUnfavorite}>
        <Heart size={18} color={Palette.accent} fill={Palette.accent} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function EmptyFavorites() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Heart size={28} color={Palette.accent} />
      </View>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptyMessage}>Tap the heart on any item to star it</Text>
    </View>
  );
}

export default function FavoritesScreen({ onBack }: Props) {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('newest');

  const loadFavorites = async () => {
    const all = await storage.getAllItems();
    setItems(all.filter((i) => i.isFavorite));
    setIsLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    });
  }, [items, sortBy]);

  const handleUnfavorite = async (id: string) => {
    const all = await storage.getAllItems();
    const target = all.find((i) => i.id === id);
    if (!target) return;
    await storage.updateItem({ ...target, isFavorite: false });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleItemPress = (item: SavedItem) => {
    console.log('Open item detail:', item.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.backRow}>
              <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onBack}>
                <ChevronLeft size={18} color={Palette.textMuted} />
              </TouchableOpacity>
            </View>
            <FavoritesHeader count={items.length} sortBy={sortBy} onSortChange={setSortBy} />
          </>
        }
        renderItem={({ item }) => (
          <FavoriteCard item={item} onPress={() => handleItemPress(item)} onUnfavorite={() => handleUnfavorite(item.id)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!isLoading ? <EmptyFavorites /> : null}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadFavorites}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: 60 },
  separator: { height: 10 },

  backRow: { paddingTop: Spacing.sm, marginBottom: 12 },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: Palette.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerWrap: { marginBottom: 20 },
  headerLabel: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },
  headerTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 34, color: Palette.textPrimary, marginBottom: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countBadge: {
    backgroundColor: Palette.accentDim,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    borderRadius: Radius.sm,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  countText: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: Palette.accent },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sortLabel: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },

  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 14,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  thumbnail: { width: 62, height: 62, borderRadius: Radius.md, position: 'relative' },
  heartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: Palette.accent,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Palette.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1, minWidth: 0 },
  cardTitle: { fontFamily: 'DMSans-SemiBold', fontSize: 13, color: Palette.textPrimary, marginBottom: 3 },
  cardMeta: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textMuted, marginBottom: 10 },
  tagsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tagChip: { backgroundColor: Palette.accentDim, borderRadius: 5, paddingVertical: 2, paddingHorizontal: 9 },
  tagText: { fontFamily: 'DMSans-Regular', fontSize: 10, color: Palette.accent },
  unfavoriteBtn: { padding: 4, marginTop: -4, marginRight: -4 },

  emptyState: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 32 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.accentDim,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 24, color: Palette.textPrimary, textAlign: 'center', marginBottom: 8 },
  emptyMessage: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted, textAlign: 'center', lineHeight: 20 },
});
