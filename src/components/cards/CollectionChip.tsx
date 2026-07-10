import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Palette, Radius } from '../../theme';
import { Collection } from '../../types';

type Props = {
  collection: Collection;
  onPress: (collection: Collection) => void;
};

export default function CollectionChip({ collection, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, collection.isPinned && styles.containerPinned]}
      activeOpacity={0.8}
      onPress={() => onPress(collection)}
    >
      <Text style={styles.emoji}>{collection.emoji}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {collection.name}
      </Text>
      <Text style={styles.count}>{collection.itemCount} items</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 14,
  },
  containerPinned: { borderColor: Palette.borderAccent, backgroundColor: Palette.accentDim },
  emoji: { fontSize: 22, marginBottom: 10 },
  name: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: Palette.textPrimary, marginBottom: 2 },
  count: { fontFamily: 'DMSans-Regular', fontSize: 10, color: Palette.textMuted },
});
