import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

type Props = {
  id: string;
  title: string;
  thumbnail?: string;
  platform: 'instagram' | 'youtube' | 'linkedin' | 'twitter' | 'link';
  tags?: string[];
  collectionName?: string;
  onPress?: () => void;
};

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  youtube: '#FF0000',
  linkedin: '#0077B5',
  twitter: '#1DA1F2',
  link: '#7C3AED',
};

export default function ReelCard({ title, thumbnail, platform, tags = [], collectionName, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      {thumbnail ? (
        <Image
          source={{ uri: thumbnail }}
          style={styles.thumbnail}
        />
      ) : (
        <View style={styles.placeholderThumbnail} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.platformBadge, { backgroundColor: platformColors[platform] || Colors.purple }]}>
            <Text style={styles.platformText}>{platform[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>

        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.slice(0, 2).map((tag, idx) => (
              <View key={idx} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {tags.length > 2 && <Text style={styles.moreText}>+{tags.length - 2}</Text>}
          </View>
        )}

        {collectionName && <Text style={styles.collectionName}>{collectionName}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.card, borderRadius: 12, overflow: 'hidden', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  thumbnail: { width: '100%', height: 160, backgroundColor: '#1F2937' },
  placeholderThumbnail: { width: '100%', height: 160, backgroundColor: '#1F2937' },
  content: { padding: 12 },
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  platformBadge: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  platformText: { color: Colors.text, fontWeight: '700', fontSize: 12 },
  title: { flex: 1, color: Colors.text, fontWeight: '600', fontSize: 14 },
  tagsRow: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
  tagChip: { backgroundColor: '#0F1724', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, marginRight: 6 },
  tagText: { color: Colors.muted, fontSize: 11 },
  moreText: { color: Colors.muted, fontSize: 11 },
  collectionName: { marginTop: 8, color: Colors.purple, fontSize: 12, fontWeight: '500' },
});
