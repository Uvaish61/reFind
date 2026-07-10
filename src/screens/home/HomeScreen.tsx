import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, BookOpen } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem, Collection } from '../../types';
import * as storage from '../../services/storage';
import SectionHeader from '../../components/common/SectionHeader';
import BottomNavBar, { Tab } from '../../components/common/BottomNavBar';
import ReelCard from '../../components/cards/ReelCard';
import CollectionChip from '../../components/cards/CollectionChip';
import { Screen } from '../ui/UIRoot';

type Props = {
  navigate: (screen: Screen) => void;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View style={[styles.card, styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonThumb} />
      <View style={styles.skeletonInfo}>
        <View style={[styles.skeletonLine, { width: '70%' }]} />
        <View style={[styles.skeletonLine, { width: '45%', height: 8, marginTop: 8 }]} />
      </View>
    </Animated.View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <BookOpen size={40} color={Palette.textDisabled} />
      <Text style={styles.emptyTitle}>Nothing saved yet</Text>
      <Text style={styles.emptyMessage}>Tap + to save your first link</Text>
    </View>
  );
}

export default function HomeScreen({ navigate }: Props) {
  const [recentItems, setRecentItems] = useState<SavedItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName] = useState('Uvaish');

  useEffect(() => {
    const load = async () => {
      const items = await storage.getAllItems();
      const sorted = items.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
      setRecentItems(sorted.slice(0, 10));
      const allCollections = await storage.getAllCollections();
      setCollections(allCollections);
      setIsLoading(false);
    };
    load();
  }, []);

  const pinnedCollections = collections.filter((c) => c.isPinned);

  const handleTabPress = (tab: Tab) => {
    if (tab === 'home') navigate('home');
    else if (tab === 'search') navigate('search');
    else if (tab === 'add') navigate('savePreview');
    else if (tab === 'library') navigate('library');
    else if (tab === 'profile') navigate('profile');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.helloName}>Hello, {userName}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.searchBar} activeOpacity={0.8} onPress={() => navigate('search')}>
            <Search size={16} color={Palette.textDisabled} />
            <Text style={styles.searchPlaceholder}>Search your library...</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentSection}>
          <SectionHeader title="Recent saves" onSeeAll={() => navigate('search')} />
          {isLoading ? (
            <View style={styles.listContent}>
              <SkeletonCard />
              <View style={styles.separator} />
              <SkeletonCard />
              <View style={styles.separator} />
              <SkeletonCard />
            </View>
          ) : (
            <FlatList
              data={recentItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ReelCard item={item} onPress={() => {}} />}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>

        <View style={styles.collectionsSection}>
          <SectionHeader title="Collections" onSeeAll={() => navigate('library')} />
          <FlatList
            data={pinnedCollections}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.collectionsListContent}
            renderItem={({ item }) => <CollectionChip collection={item} onPress={() => {}} />}
          />
        </View>
      </ScrollView>
      <BottomNavBar activeTab="home" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  greeting: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted, marginBottom: 2 },
  helloName: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 36, color: Palette.textPrimary, lineHeight: 42 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: { fontFamily: 'DMSans-Bold', fontSize: 16, color: '#0C0C0C' },

  searchSection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.xxl - 4 },
  searchBar: {
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
  searchPlaceholder: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textDisabled },

  recentSection: {},
  listContent: { paddingHorizontal: Spacing.xl },
  separator: { height: 10 },

  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 14,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  skeletonCard: {},
  skeletonThumb: { width: 62, height: 62, borderRadius: Radius.md, backgroundColor: '#1e1e1e' },
  skeletonInfo: { flex: 1, justifyContent: 'center' },
  skeletonLine: { height: 10, borderRadius: 5, backgroundColor: '#1e1e1e' },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 22, color: Palette.textPrimary, marginTop: 16 },
  emptyMessage: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted, marginTop: 6 },

  collectionsSection: { marginTop: 28 },
  collectionsListContent: { paddingHorizontal: Spacing.xl, gap: 10 },
});
