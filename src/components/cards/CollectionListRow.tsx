import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { Collection } from '../../types';

type Props = {
  collection: Collection;
  onPress: () => void;
  onLongPress: () => void;
};

export default function CollectionListRow({ collection, onPress, onLongPress }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.8}>
      <View style={styles.iconBox}>
        <Text style={styles.emoji}>{collection.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {collection.name}
        </Text>
        <Text style={styles.count}>{collection.itemCount} items</Text>
      </View>
      <ChevronRight size={16} color={Palette.textDisabled} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: Spacing.sm,
  },
  iconBox: { width: 40, height: 40, backgroundColor: Palette.bg, borderRadius: Radius.sm + 2, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  info: { flex: 1 },
  name: { fontFamily: 'DMSans-SemiBold', fontSize: 13, color: Palette.textPrimary, marginBottom: 2 },
  count: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textMuted },
});
