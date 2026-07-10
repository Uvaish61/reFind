import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { UrlMetadata } from '../../services/metadata';
import { platformGradient } from '../cards/ReelCard';
import GradientBox from './GradientBox';

const THUMB_WIDTH = Dimensions.get('window').width - 40;

type Props = {
  metadata: UrlMetadata;
};

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function MetadataPreviewCard({ metadata }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.thumbWrap}>
        {metadata.thumbnailUrl ? (
          <Image source={{ uri: metadata.thumbnailUrl }} style={styles.thumbImage} resizeMode="cover" />
        ) : (
          <GradientBox colors={platformGradient[metadata.platform]} width={THUMB_WIDTH} height={110} />
        )}

        <View style={styles.platformBadge}>
          <Text style={styles.platformBadgeText}>{capitalize(metadata.platform)}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {metadata.title}
        </Text>
        {metadata.creator ? <Text style={styles.creator}>{metadata.creator}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  thumbWrap: { height: 110, position: 'relative' },
  thumbImage: { width: '100%', height: '100%' },
  platformBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(12,12,12,0.75)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  platformBadgeText: { fontFamily: 'DMSans-Medium', fontSize: 10, color: Palette.textPrimary },
  info: { padding: 14 },
  title: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: Palette.textPrimary },
  creator: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textMuted, marginTop: 3 },
});
