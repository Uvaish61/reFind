import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, Archive as ArchiveIcon, RotateCcw, Trash2 } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { ArchivedItem } from '../../types';
import * as storage from '../../services/storage';
import GradientBox from '../../components/common/GradientBox';
import { platformGradient } from '../../components/cards/ReelCard';
import { Screen } from '../ui/UIRoot';

type Props = {
  navigate: (screen: Screen) => void;
  onBack: () => void;
};

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

function ArchiveHeader({ count, onClearAll }: { count: number; onClearAll: () => void }) {
  return (
    <View style={styles.headerWrap}>
      <Text style={styles.headerLabel}>Soft deleted items</Text>
      <Text style={styles.headerTitle}>Archive</Text>

      <View style={styles.infoBanner}>
        <Info size={14} color={Palette.accent} style={styles.infoIcon} />
        <Text style={styles.infoText}>Items are permanently deleted after 30 days. Restore anytime before that.</Text>
      </View>

      {count > 0 ? (
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {count} item{count !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={onClearAll} activeOpacity={0.7}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

function ArchiveCard({ item, onRestore, onDelete }: { item: ArchivedItem; onRestore: () => void; onDelete: () => void }) {
  const daysLeft = Math.ceil((new Date(item.autoDeleteAt).getTime() - Date.now()) / 86400000);
  const isUrgent = daysLeft <= 7;

  return (
    <View style={[styles.card, isUrgent ? styles.cardUrgent : null]}>
      <View style={styles.topRow}>
        <GradientBox colors={platformGradient[item.platform]} width={52} height={52} borderRadius={Radius.md} />
        <View style={styles.topInfo}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.itemMeta}>{item.creator} · {capitalize(item.platform)}</Text>
        </View>
      </View>

      <View style={styles.expiryRow}>
        <ArchiveIcon size={12} color={isUrgent ? Palette.danger : Palette.textDisabled} />
        <Text style={[styles.expiryText, { color: isUrgent ? Palette.danger : Palette.textDisabled }]}>
          Archived {formatRelative(item.archivedAt)} · {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.restoreBtn} activeOpacity={0.8} onPress={onRestore}>
          <RotateCcw size={13} color={Palette.accent} />
          <Text style={styles.restoreText}>Restore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.8} onPress={onDelete}>
          <Trash2 size={13} color={Palette.danger} />
          <Text style={styles.deleteText}>Delete now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyArchive() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <ArchiveIcon size={28} color={Palette.textDisabled} />
      </View>
      <Text style={styles.emptyTitle}>Archive is empty</Text>
      <Text style={styles.emptyMessage}>Items you archive appear here.{'\n'}They're auto-deleted after 30 days.</Text>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

export default function ArchiveScreen({ onBack }: Props) {
  const [items, setItems] = useState<ArchivedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadArchive = async () => {
    await storage.purgeExpiredArchive();
    const archived = await storage.getAllArchived();
    setItems(archived.sort((a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()));
    setIsLoading(false);
  };

  useEffect(() => {
    loadArchive();
  }, []);

  const handleRestore = async (id: string) => {
    await storage.restoreItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Permanently', 'This item will be gone forever. Cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await storage.deleteArchived(id);
          setItems((prev) => prev.filter((i) => i.id !== id));
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('Clear Archive', `Permanently delete all ${items.length} archived items?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await storage.clearArchive();
          setItems([]);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.backRow}>
              <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onBack}>
                <ChevronLeft size={18} color={Palette.textMuted} />
              </TouchableOpacity>
            </View>
            <ArchiveHeader count={items.length} onClearAll={handleClearAll} />
          </>
        }
        renderItem={({ item }) => (
          <ArchiveCard item={item} onRestore={() => handleRestore(item.id)} onDelete={() => handleDelete(item.id)} />
        )}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!isLoading ? <EmptyArchive /> : null}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadArchive}
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
  headerTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 34, color: Palette.textPrimary, marginBottom: 4 },
  infoBanner: {
    backgroundColor: 'rgba(207,255,71,0.06)',
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    borderRadius: Radius.lg,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  infoIcon: { marginTop: 1 },
  infoText: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(242,237,228,0.55)', lineHeight: 18 },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  countText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },
  clearAllText: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: Palette.danger },

  card: { backgroundColor: Palette.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: Palette.border, padding: 14 },
  cardUrgent: { borderColor: 'rgba(220,80,80,0.2)' },
  topRow: { flexDirection: 'row', gap: Spacing.md, opacity: 0.55, marginBottom: 12 },
  topInfo: { flex: 1, minWidth: 0, justifyContent: 'center' },
  itemTitle: { fontFamily: 'DMSans-SemiBold', fontSize: 13, color: Palette.textPrimary, textDecorationLine: 'line-through' },
  itemMeta: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textMuted, marginTop: 3 },

  expiryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  expiryText: { fontFamily: 'DMSans-Regular', fontSize: 11 },

  actionsRow: { flexDirection: 'row', gap: 8 },
  restoreBtn: {
    flex: 1,
    height: 38,
    backgroundColor: Palette.accentDim,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  restoreText: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: Palette.accent },
  deleteBtn: {
    flex: 1,
    height: 38,
    backgroundColor: Palette.dangerDim,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(220,80,80,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  deleteText: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: Palette.danger },

  emptyState: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 32 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 24, color: Palette.textPrimary, textAlign: 'center', marginBottom: 8 },
  emptyMessage: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted, textAlign: 'center', lineHeight: 20 },
});
