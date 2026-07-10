import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Colors } from '../../theme';
import ReelCard from '../../components/cards/ReelCard';
import EmptyState from '../../components/common/EmptyState';
import { SavedItem } from '../../types';

const mockReels: SavedItem[] = [
  {
    id: '1',
    url: 'https://youtube.com/watch?v=1',
    title: 'How to master React hooks in 2024',
    originalTitle: 'How to master React hooks in 2024',
    platform: 'youtube',
    creator: 'CodeWithJS',
    tags: ['React', 'JavaScript'],
    collection: 'Development',
    notes: 'Great video on advanced hooks patterns',
    isFavorite: true,
    savedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '2',
    url: 'https://linkedin.com/posts/2',
    title: 'AI trends everyone should know about',
    originalTitle: 'AI trends everyone should know about',
    platform: 'linkedin',
    creator: 'TechInsights',
    tags: ['AI', 'Tech'],
    collection: 'AI',
    notes: 'Latest AI innovations in 2024',
    isFavorite: false,
    savedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    url: 'https://instagram.com/reel/3',
    title: 'Fitness routine for busy professionals',
    originalTitle: 'Fitness routine for busy professionals',
    platform: 'instagram',
    creator: 'FitLife',
    tags: ['Fitness', 'Health'],
    notes: '30-minute home workout',
    isFavorite: false,
    savedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: '4',
    url: 'https://x.com/careercoach/status/4',
    title: 'Job interview tips that actually work',
    originalTitle: 'Job interview tips that actually work',
    platform: 'x',
    creator: 'CareerCoach',
    tags: ['Jobs', 'Career'],
    notes: 'FAANG interview preparation guide',
    isFavorite: false,
    savedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: '5',
    url: 'https://youtube.com/watch?v=5',
    title: 'TypeScript best practices',
    originalTitle: 'TypeScript best practices',
    platform: 'youtube',
    creator: 'DevTips',
    tags: ['TypeScript', 'JavaScript'],
    collection: 'Development',
    notes: 'Type safety and advanced types',
    isFavorite: true,
    savedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReels = useMemo(() => {
    if (!searchQuery.trim()) return mockReels;

    const query = searchQuery.toLowerCase();
    return mockReels.filter((reel) => {
      const titleMatch = reel.title.toLowerCase().includes(query);
      const tagsMatch = reel.tags.some((tag) => tag.toLowerCase().includes(query));
      const notesMatch = reel.notes?.toLowerCase().includes(query);
      const collectionMatch = reel.collection?.toLowerCase().includes(query);

      return titleMatch || tagsMatch || notesMatch || collectionMatch;
    });
  }, [searchQuery]);

  const handleReelPress = (reel: SavedItem) => {
    console.log('Open reel detail:', reel.id);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find your saved content</Text>
      </View>

      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title, tags, notes..."
          placeholderTextColor={Colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearBtn} activeOpacity={0.8}>
            <X size={16} color={Colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.resultInfo}>
          <Text style={styles.resultText}>{filteredReels.length} result(s) found</Text>
        </View>
      )}

      {filteredReels.length === 0 && searchQuery.length > 0 ? (
        <EmptyState title="No results" message={`No content found matching "${searchQuery}".`} icon={<Search size={40} color={Colors.purple} />} />
      ) : filteredReels.length === 0 ? (
        <View style={styles.emptySearchContainer}>
          <Search size={48} color={Colors.purple} style={styles.emptySearchIcon} />
          <Text style={styles.emptySearchTitle}>Start searching</Text>
          <Text style={styles.emptySearchMessage}>Search by title, tags, or notes to find your saved content.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredReels}
          renderItem={({ item }) => <ReelCard item={item} onPress={() => handleReelPress(item)} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingVertical: 14 },
  title: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: Colors.muted, fontSize: 12, marginTop: 2 },
  searchWrapper: { position: 'relative', marginHorizontal: 20, marginBottom: 12 },
  searchInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#162033',
  },
  clearBtn: { position: 'absolute', right: 12, top: '50%', marginTop: -8 },
  resultInfo: { paddingHorizontal: 20, marginBottom: 12 },
  resultText: { color: Colors.muted, fontSize: 13 },
  emptySearchContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  emptySearchIcon: { marginBottom: 12 },
  emptySearchTitle: { color: Colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  emptySearchMessage: { color: Colors.muted, fontSize: 14, textAlign: 'center' },
  listContent: { paddingHorizontal: 20, paddingVertical: 12 },
});
