import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem, Platform } from '../../types';
import GradientBox from '../common/GradientBox';

type Props = {
  item: SavedItem;
  onPress: (item: SavedItem) => void;
};

export const platformGradient: Record<Platform, string[]> = {
  instagram: ['#833ab4', '#fd1d1d'],
  youtube: ['#1a1a00', '#8aaa00'],
  linkedin: ['#001a28', '#0077b5'],
  x: ['#0f0f0f', '#555555'],
  facebook: ['#001a28', '#1877f2'],
};

const videoPlatforms: Platform[] = ['instagram', 'youtube'];

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days`;
}

export default function ReelCard({ item, onPress }: Props) {
  const tags = item.tags.slice(0, 2);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() => onPress(item)}>
      <View style={styles.thumbnail}>
        {item.thumbnailUri ? (
          <Image source={{ uri: item.thumbnailUri }} style={styles.thumbnailImage} />
        ) : (
          <GradientBox colors={platformGradient[item.platform]} width={62} height={62} borderRadius={Radius.md}>
            {videoPlatforms.includes(item.platform) ? (
              <Play size={14} color="rgba(255,255,255,0.8)" fill="rgba(255,255,255,0.8)" />
            ) : null}
          </GradientBox>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.creator} · {capitalize(item.platform)}
        </Text>
        {tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.meta2}>
        {item.isFavorite ? <View style={styles.favoriteDot} /> : <View style={styles.favoriteDotEmpty} />}
        <Text style={styles.timeText}>{timeAgo(item.savedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 14,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  thumbnail: { width: 62, height: 62, borderRadius: Radius.md, overflow: 'hidden' },
  thumbnailImage: { width: '100%', height: '100%' },
  info: { flex: 1, minWidth: 0 },
  title: { fontFamily: 'DMSans-SemiBold', fontSize: 13, color: Palette.textPrimary, marginBottom: 3 },
  meta: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textMuted, marginBottom: 10 },
  tagsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tagChip: { backgroundColor: Palette.accentDim, borderRadius: 5, paddingVertical: 2, paddingHorizontal: 9 },
  tagText: { fontFamily: 'DMSans-Regular', fontSize: 10, color: Palette.accent },
  meta2: { flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' },
  favoriteDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Palette.accent },
  favoriteDotEmpty: { width: 6, height: 6, borderRadius: 3 },
  timeText: { fontFamily: 'DMSans-Regular', fontSize: 10, color: Palette.textDisabled },
});
