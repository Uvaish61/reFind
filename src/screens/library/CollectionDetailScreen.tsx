import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Pencil, BookOpen } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem, Collection } from '../../types';
import * as storage from '../../services/storage';
import ReelCard from '../../components/cards/ReelCard';
import CreateCollectionSheet from '../../components/common/CreateCollectionSheet';
import { Screen } from '../ui/UIRoot';

type Props = {
  collection: Collection;
  navigate: (screen: Screen) => void;
};

export default function CollectionDetailScreen({ collection, navigate }: Props) {
  const [currentCollection, setCurrentCollection] = useState(collection);
  const [allItems, setAllItems] = useState<SavedItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const loadItems = async () => {
    const items = await storage.getAllItems();
    setAllItems(items);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const items = allItems.filter((i) => i.collection === currentCollection.name);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigate('library')} activeOpacity={0.8}>
          <ChevronLeft size={20} color={Palette.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {currentCollection.emoji} {currentCollection.name}
        </Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowEditSheet(true)} activeOpacity={0.8}>
          <Pencil size={18} color={Palette.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReelCard item={item} onPress={() => {}} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Palette.accent} colors={[Palette.accent]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <BookOpen size={40} color={Palette.textDisabled} />
            <Text style={styles.emptyText}>No saves in this collection yet</Text>
          </View>
        }
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, textAlign: 'center', fontFamily: 'DMSerifDisplay-Italic', fontSize: 20, color: Palette.textPrimary, marginHorizontal: Spacing.sm },

  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  separator: { height: 10 },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted, marginTop: 16, textAlign: 'center' },
});
