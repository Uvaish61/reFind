import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Keyboard,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search, X, ArrowUpDown, SlidersHorizontal, Clock, ArrowUpLeft, BookOpen } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem, SearchFilters } from '../../types';
import * as storage from '../../services/storage';
import ReelCard from '../../components/cards/ReelCard';
import BottomNavBar, { Tab } from '../../components/common/BottomNavBar';
import FilterChip from '../../components/common/FilterChip';
import FilterBottomSheet from '../../components/common/FilterBottomSheet';
import { Screen } from '../ui/UIRoot';

const RECENT_SEARCHES_KEY = 'recent_searches';

const DEFAULT_FILTERS: SearchFilters = {
  platform: null,
  collection: null,
  tags: [],
  favoritesOnly: false,
  sortBy: 'newest',
};

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const SORT_LABELS: Record<SearchFilters['sortBy'], string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  title: 'A-Z',
};

function nextSort(sortBy: SearchFilters['sortBy']): SearchFilters['sortBy'] {
  if (sortBy === 'newest') return 'oldest';
  if (sortBy === 'oldest') return 'title';
  return 'newest';
}

type Props = {
  navigate: (screen: Screen) => void;
  initialQuery?: string;
};

export default function SearchScreen({ navigate, initialQuery }: Props) {
  const [allItems, setAllItems] = useState<SavedItem[]>([]);
  const [query, setQuery] = useState(initialQuery ?? '');
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    storage.getAllItems().then((items) => {
      setAllItems(items);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(RECENT_SEARCHES_KEY).then((json) => {
      setRecentSearches(json ? JSON.parse(json) : []);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchInputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  const hasActiveFilters =
    filters.platform !== null || filters.collection !== null || filters.tags.length > 0 || filters.favoritesOnly;

  const allTags = useMemo(() => Array.from(new Set(allItems.flatMap((i) => i.tags))), [allItems]);
  const allCollections = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.collection).filter((c): c is string => !!c))),
    [allItems],
  );

  const filteredResults = useMemo(() => {
    let results = [...allItems];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.originalTitle.toLowerCase().includes(q) ||
          item.creator.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.collection?.toLowerCase().includes(q) ||
          item.notes?.toLowerCase().includes(q),
      );
    }

    if (filters.platform) {
      results = results.filter((item) => item.platform === filters.platform);
    }
    if (filters.collection) {
      results = results.filter((item) => item.collection === filters.collection);
    }
    if (filters.tags.length > 0) {
      results = results.filter((item) => filters.tags.every((tag) => item.tags.includes(tag)));
    }
    if (filters.favoritesOnly) {
      results = results.filter((item) => item.isFavorite);
    }

    results.sort((a, b) => {
      if (filters.sortBy === 'oldest') return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
      if (filters.sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    });

    return results;
  }, [allItems, query, filters]);

  const saveRecentSearch = async (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 8);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const cycleSortOrder = () => {
    setFilters((f) => ({ ...f, sortBy: nextSort(f.sortBy) }));
  };

  const handleItemPress = (item: SavedItem) => {
    console.log('Open item detail:', item.id);
  };

  const handleTabPress = (tab: Tab) => {
    if (tab === 'home') navigate('home');
    else if (tab === 'search') navigate('search');
    else if (tab === 'add') navigate('savePreview');
    else if (tab === 'library') navigate('library');
    else if (tab === 'profile') navigate('profile');
  };

  const showRecent = !query.trim() && !hasActiveFilters && recentSearches.length > 0;
  const showResultsCount = query.trim().length > 0 || hasActiveFilters;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />

      <View style={styles.fixedSection}>
        <View style={styles.headerWrap}>
          {!query ? <Text style={styles.pageTitle}>Search</Text> : null}
          <View style={styles.searchRow}>
            <View style={[styles.searchInputContainer, query ? styles.searchInputContainerActive : null]}>
              <Search size={16} color={query ? Palette.accent : Palette.textDisabled} />
              <TextInput
                ref={searchInputRef}
                value={query}
                onChangeText={setQuery}
                placeholder="Search your library..."
                placeholderTextColor={Palette.textDisabled}
                style={styles.searchInput}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={() => saveRecentSearch(query)}
              />
              {query.length > 0 ? (
                <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
                  <X size={16} color={Palette.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>
            {query.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setQuery('');
                  Keyboard.dismiss();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.filterRowWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRowContent}>
            <FilterChip
              label="All"
              isActive={!hasActiveFilters}
              onPress={() => setFilters((f) => ({ ...DEFAULT_FILTERS, sortBy: f.sortBy }))}
            />
            <FilterChip
              label={filters.platform ? capitalize(filters.platform) : 'Platform'}
              isActive={!!filters.platform}
              onPress={() => setShowFilterSheet(true)}
            />
            <FilterChip
              label={filters.collection ?? 'Collection'}
              isActive={!!filters.collection}
              onPress={() => setShowFilterSheet(true)}
            />
            <FilterChip
              label={filters.tags.length > 0 ? `Tags · ${filters.tags.length}` : 'Tags'}
              isActive={filters.tags.length > 0}
              onPress={() => setShowFilterSheet(true)}
            />
            <FilterChip
              label="Favorites"
              isActive={filters.favoritesOnly}
              onPress={() => setFilters((f) => ({ ...f, favoritesOnly: !f.favoritesOnly }))}
            />
            <TouchableOpacity style={styles.sortBtn} onPress={cycleSortOrder} activeOpacity={0.7}>
              <ArrowUpDown size={14} color={Palette.textMuted} />
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity onPress={() => setShowFilterSheet(true)} activeOpacity={0.8} style={styles.filterIconBtn}>
            <SlidersHorizontal size={16} color={hasActiveFilters ? Palette.accent : Palette.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={isLoading ? [] : filteredResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReelCard
            item={item}
            onPress={handleItemPress}
            onArchive={async () => {
              await storage.archiveItem(item.id);
              setAllItems((prev) => prev.filter((i) => i.id !== item.id));
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          showResultsCount ? (
            <View style={styles.resultsCountRow}>
              <Text style={styles.resultsCountText}>
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
              </Text>
              <TouchableOpacity onPress={cycleSortOrder} activeOpacity={0.7}>
                <Text style={styles.resultsCountText}>Sort: {SORT_LABELS[filters.sortBy]} ↕</Text>
              </TouchableOpacity>
            </View>
          ) : showRecent ? (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>Recent</Text>
              {recentSearches.map((s) => (
                <TouchableOpacity key={s} style={styles.recentRow} onPress={() => setQuery(s)} activeOpacity={0.7}>
                  <Clock size={14} color={Palette.textDisabled} />
                  <Text style={styles.recentText}>{s}</Text>
                  <ArrowUpLeft size={14} color={Palette.textDisabled} />
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? null : (
            <View style={styles.emptyState}>
              {query.trim() ? (
                <>
                  <Search size={40} color={Palette.textDisabled} />
                  <Text style={styles.emptyTitle}>No results for</Text>
                  <Text style={[styles.emptyTitle, styles.emptyQuery]}>"{query}"</Text>
                  <Text style={styles.emptyMessage}>Try different keywords or clear your filters</Text>
                </>
              ) : (
                <>
                  <BookOpen size={40} color={Palette.textDisabled} />
                  <Text style={styles.emptyTitle}>Nothing saved yet</Text>
                  <Text style={styles.emptyMessage}>Tap + to save your first link</Text>
                </>
              )}
            </View>
          )
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />

      <BottomNavBar activeTab="search" onTabPress={handleTabPress} />

      <FilterBottomSheet
        visible={showFilterSheet}
        filters={filters}
        allTags={allTags}
        allCollections={allCollections}
        onApply={setFilters}
        onClose={() => setShowFilterSheet(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },

  fixedSection: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, paddingBottom: Spacing.md },

  headerWrap: { marginBottom: 14 },
  pageTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 34, color: Palette.textPrimary, marginBottom: 10 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInputContainer: {
    flex: 1,
    backgroundColor: Palette.input,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInputContainerActive: { borderColor: Palette.borderAccent },
  searchInput: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textPrimary, padding: 0 },
  cancelText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted },

  filterRowWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  filterRowContent: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  sortBtn: {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconBtn: { padding: 4 },

  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  separator: { height: 10 },

  resultsCountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginBottom: 4 },
  resultsCountText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },

  recentSection: { marginBottom: 8 },
  recentTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 20, color: Palette.textPrimary, marginBottom: 14 },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  recentText: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted },

  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 22, color: Palette.textPrimary, marginTop: 16, textAlign: 'center' },
  emptyQuery: { color: Palette.accent, marginTop: 0 },
  emptyMessage: { fontFamily: 'DMSans-Regular', fontSize: 13, color: Palette.textMuted, marginTop: 8, textAlign: 'center' },
});
