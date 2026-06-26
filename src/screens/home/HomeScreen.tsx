import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Search, Plus, Video } from 'lucide-react-native';
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
};

const mockReels: Reel[] = [
  {
    id: '1',
    title: 'How to master React hooks in 2024',
    platform: 'youtube',
    tags: ['React', 'JavaScript'],
    collectionName: 'Development',
  },
  {
    id: '2',
    title: 'AI trends everyone should know about',
    platform: 'linkedin',
    tags: ['AI', 'Tech'],
    collectionName: 'AI',
  },
  {
    id: '3',
    title: 'Fitness routine for busy professionals',
    platform: 'instagram',
    tags: ['Fitness', 'Health'],
  },
  {
    id: '4',
    title: 'Job interview tips that actually work',
    platform: 'twitter',
    tags: ['Jobs', 'Career'],
  },
];

const filters = ['All', 'AI', 'Tech', 'Jobs', 'Fitness'];

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [reels] = useState<Reel[]>(mockReels);

  const handleReelPress = (reel: Reel) => {
    console.log('Open reel detail:', reel.id);
  };

  const handleAddManually = () => {
    console.log('Open add link manually screen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>reFind</Text>
          <Text style={styles.subtitle}>Your saved content library</Text>
        </View>
        <TouchableOpacity style={styles.searchBtn} activeOpacity={0.8}>
          <Search size={18} color={Colors.muted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
        style={styles.filtersScroll}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {reels.length === 0 ? (
        <EmptyState
          title="No saved reels yet"
          message="Share your first reel to get started. Tap the + button below."
          icon={<Video size={40} color={Colors.purple} />}
        />
      ) : (
        <FlatList
          data={reels}
          renderItem={({ item }) => <ReelCard {...item} onPress={() => handleReelPress(item)} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={handleAddManually}>
        <Plus size={28} color={Colors.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: Colors.muted, fontSize: 12, marginTop: 2 },
  searchBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center' },
  filtersScroll: { paddingHorizontal: 20, marginVertical: 12 },
  filtersContent: { gap: 10, paddingEnd: 20 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 1, borderColor: 'transparent' },
  filterChipActive: { backgroundColor: Colors.purple, borderColor: Colors.purple },
  filterText: { color: Colors.muted, fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: Colors.text },
  listContent: { paddingHorizontal: 20, paddingVertical: 12 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.purple, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
});
