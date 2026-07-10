import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { Collection } from '../../types';

type Props = {
  collection: Collection;
  onPress: () => void;
  onLongPress: () => void;
};

export const CARD_WIDTH = (Dimensions.get('window').width - 40 - 10) / 2;

export default function CollectionCard({ collection, onPress, onLongPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.8}>
      <Text style={styles.emoji}>{collection.emoji}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {collection.name}
      </Text>
      <Text style={styles.count}>{collection.itemCount} items</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Palette.accentDim,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    padding: Spacing.lg,
  },
  emoji: { fontSize: 22, marginBottom: 10 },
  name: { fontFamily: 'DMSans-SemiBold', fontSize: 13, color: Palette.textPrimary, marginBottom: 3 },
  count: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textMuted },
});
