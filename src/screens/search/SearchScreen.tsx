import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '../../theme';
import ReelCard from '../../components/cards/ReelCard';
import EmptyState from '../../components/common/EmptyState';

type Reel = {
  id: string;
  title: string;
  thumbnail?: string;
  platform: 'instagram' | 'youtube' | 'linkedin' | 'twitter' | 'link';
  tags: string[];
  collectionName?: string;
  notes?: string;
};

const mockReels: Reel[] = [
  {
    id: '1',
    title: 'How to master React hooks in 2024',
    platform: 'youtube',
    tags: ['React', 'JavaScript'],
    collectionName: 'Development',
    notes: 'Great video on advanced hooks patterns',
  },
  {
    id: '2',
    title: 'AI trends everyone should know about',
    platform: 'linkedin',
    tags: ['AI', 'Tech'],
    collectionName: 'AI',
    notes: 'Latest AI innovations in 2024',
  },
  {
    id: '3',
    title: 'Fitness routine for busy professionals',
    platform: 'instagram',
    tags: ['Fitness', 'Health'],
    notes: '30-minute home workout',
  },
  {
    id: '4',
    title: 'Job interview tips that actually work',
    platform: 'twitter',
    tags: ['Jobs', 'Career'],
    notes: 'FAANG interview preparation guide',
  },
  {
    id: '5',
    title: 'TypeScript best practices',
    platform: 'youtube',
    tags: ['TypeScript', 'JavaScript'],
    collectionName: 'Development',
    notes: 'Type safety and advanced types',
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
      const collectionMatch = reel.collectionName?.toLowerCase().includes(query);

      return titleMatch || tagsMatch || notesMatch || collectionMatch;
    });
  }, [searchQuery]);

  const handleReelPress = (reel: Reel) => {
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
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.resultInfo}>
          <Text style={styles.resultText}>{filteredReels.length} result(s) found</Text>
        </View>
      )}

      {filteredReels.length === 0 && searchQuery.length > 0 ? (
        <EmptyState title="No results" message={`No content found matching "${searchQuery}".`} icon="🔍" />
      ) : filteredReels.length === 0 ? (
        <View style={styles.emptySearchContainer}>
          <Text style={styles.emptySearchIcon}>🔍</Text>
          <Text style={styles.emptySearchTitle}>Start searching</Text>
          <Text style={styles.emptySearchMessage}>Search by title, tags, or notes to find your saved content.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredReels}
          renderItem={({ item }) => <ReelCard {...item} onPress={() => handleReelPress(item)} />}
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
  clearBtn: { position: 'absolute', right: 12, top: '50%', marginTop: -10 },
  clearText: { color: Colors.muted, fontSize: 18, fontWeight: '300' },
  resultInfo: { paddingHorizontal: 20, marginBottom: 12 },
  resultText: { color: Colors.muted, fontSize: 13 },
  emptySearchContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  emptySearchIcon: { fontSize: 48, marginBottom: 12 },
  emptySearchTitle: { color: Colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  emptySearchMessage: { color: Colors.muted, fontSize: 14, textAlign: 'center' },
  listContent: { paddingHorizontal: 20, paddingVertical: 12 },
});
