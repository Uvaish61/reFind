import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { X, Check, Plus } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { Collection } from '../../types';

type Props = {
  visible: boolean;
  collections: Collection[];
  selectedCollection: string | null;
  onSelect: (name: string | null) => void;
  onClose: () => void;
  onCreateNew: () => void;
};

export default function CollectionPickerSheet({
  visible,
  collections,
  selectedCollection,
  onSelect,
  onClose,
  onCreateNew,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.sheet}>
        <View style={styles.dragHandle} />
        <Text style={styles.title}>Choose Collection</Text>

        <ScrollView>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              onSelect(null);
              onClose();
            }}
            activeOpacity={0.8}
          >
            <X size={16} color={Palette.textMuted} />
            <Text style={styles.rowLabel}>No Collection</Text>
            {selectedCollection === null ? <Check size={16} color={Palette.accent} /> : null}
          </TouchableOpacity>

          {collections.map((col) => (
            <TouchableOpacity
              key={col.id}
              style={styles.collectionRow}
              onPress={() => {
                onSelect(col.name);
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{col.emoji}</Text>
              <View style={styles.collectionInfo}>
                <Text style={styles.collectionName}>{col.name}</Text>
                <Text style={styles.collectionCount}>{col.itemCount} items</Text>
              </View>
              {selectedCollection === col.name ? <Check size={16} color={Palette.accent} /> : null}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.createRow} onPress={onCreateNew} activeOpacity={0.8}>
          <Plus size={16} color={Palette.accent} />
          <Text style={styles.createText}>Create new collection</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xl,
    paddingBottom: 40,
    maxHeight: '75%',
  },
  dragHandle: { width: 36, height: 4, backgroundColor: Palette.border, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  title: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 22, color: Palette.textPrimary, marginBottom: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  rowLabel: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textPrimary },
  collectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  emoji: { fontSize: 20 },
  collectionInfo: { flex: 1 },
  collectionName: { fontFamily: 'DMSans-SemiBold', fontSize: 14, color: Palette.textPrimary },
  collectionCount: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textMuted },
  createRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16 },
  createText: { fontFamily: 'DMSans-Medium', fontSize: 14, color: Palette.accent },
});
