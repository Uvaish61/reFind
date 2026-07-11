import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Tag } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem } from '../../types';
import * as storage from '../../services/storage';
import ReelCard from '../../components/cards/ReelCard';

type Props = {
  tag: string;
  onBack: () => void;
  onOpenTag: (tag: string) => void;
};

function TagHeader({
  tag,
  count,
  collectionCount,
  relatedTags,
  onBack,
  onOpenTag,
}: {
  tag: string;
  count: number;
  collectionCount: number;
  relatedTags: string[];
  onBack: () => void;
  onOpenTag: (tag: string) => void;
}) {
  return (
    <View style={styles.headerWrap}>
      <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onBack}>
        <ChevronLeft size={18} color={Palette.textMuted} />
      </TouchableOpacity>

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Tag</Text>
        <Text style={styles.heroTag}>#{tag}</Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {count} item{count !== 1 ? 's' : ''}
          </Text>
        </View>
        {collectionCount > 0 ? (
          <Text style={styles.collectionsText}>
            Across {collectionCount} collection{collectionCount > 1 ? 's' : ''}
          </Text>
        ) : null}
      </View>

      {relatedTags.length > 0 ? (
        <View style={styles.relatedSection}>
          <Text style={styles.relatedLabel}>Often with</Text>
          <View style={styles.relatedWrap}>
            {relatedTags.map((t) => (
              <TouchableOpacity key={t} style={styles.relatedChip} activeOpacity={0.7} onPress={() => onOpenTag(t)}>
                <Text style={styles.relatedChipText}>#{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}

      <Text style={styles.allItemsLabel}>All items</Text>
    </View>
  );
}

function EmptyTag({ tag }: { tag: string }) {
  return (
    <View style={styles.emptyState}>
      <Tag size={36} color={Palette.textDisabled} />
      <Text style={styles.emptyTitle}>No items tagged #{tag}</Text>
      <Text style={styles.emptyMessage}>Save something and add this tag to it</Text>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

export default function TagDetailScreen({ tag, onBack, onOpenTag }: Props) {
  const [tagItems, setTagItems] = useState<SavedItem[]>([]);
  const [relatedTags, setRelatedTags] = useState<string[]>([]);
  const [collectionCount, setCollectionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const all = await storage.getAllItems();
      const tagged = all.filter((i) => i.tags.includes(tag));
      setTagItems(tagged);

      const coTags: Record<string, number> = {};
      tagged.forEach((i) =>
        i.tags
          .filter((t) => t !== tag)
          .forEach((t) => {
            coTags[t] = (coTags[t] ?? 0) + 1;
          }),
      );
      setRelatedTags(Object.entries(coTags).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([t]) => t));

      const cols = new Set(tagged.map((i) => i.collection).filter(Boolean));
      setCollectionCount(cols.size);

      setIsLoading(false);
    };
    load();
  }, [tag]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <FlatList
        data={tagItems}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={
          <TagHeader
            tag={tag}
            count={tagItems.length}
            collectionCount={collectionCount}
            relatedTags={relatedTags}
            onBack={onBack}
            onOpenTag={onOpenTag}
          />
        }
        renderItem={({ item }) => <ReelCard item={item} onPress={() => {}} onTagPress={onOpenTag} />}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!isLoading ? <EmptyTag tag={tag} /> : null}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: 60 },
  separator: { height: 10 },

  headerWrap: { paddingTop: Spacing.sm, marginBottom: 20 },
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

  hero: { marginTop: 16, marginBottom: 20 },
  heroLabel: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  heroTag: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 36, color: Palette.accent, lineHeight: 40 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  countBadge: { backgroundColor: Palette.accentDim, borderWidth: 1, borderColor: Palette.borderAccent, borderRadius: Radius.sm, paddingVertical: 5, paddingHorizontal: 12 },
  countText: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: Palette.accent },
  collectionsText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },

  relatedSection: { marginBottom: 20 },
  relatedLabel: { fontFamily: 'DMSans-SemiBold', fontSize: 10, color: Palette.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  relatedWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  relatedChip: { backgroundColor: Palette.input, borderWidth: 1, borderColor: Palette.border, borderRadius: 100, paddingVertical: 5, paddingHorizontal: 14 },
  relatedChipText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },

  allItemsLabel: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 20, color: Palette.textPrimary, marginBottom: 14 },

  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 22, color: Palette.textPrimary, textAlign: 'center', marginTop: 16 },
  emptyMessage: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted, textAlign: 'center', marginTop: 8 },
});
