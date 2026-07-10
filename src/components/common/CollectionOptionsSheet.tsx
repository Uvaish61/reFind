import React from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Pencil, Pin, PinOff, Trash2 } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { Collection } from '../../types';
import * as storage from '../../services/storage';

type Props = {
  visible: boolean;
  collection: Collection | null;
  onClose: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
};

export default function CollectionOptionsSheet({ visible, collection, onClose, onEdit, onTogglePin, onDelete }: Props) {
  if (!collection) return null;

  const handleEdit = () => {
    onClose();
    onEdit();
  };

  const handleTogglePin = async () => {
    await storage.updateCollection({ ...collection, isPinned: !collection.isPinned });
    onTogglePin();
    onClose();
  };

  const handleDelete = () => {
    Alert.alert('Delete Collection', `Delete "${collection.name}"? Items inside will NOT be deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await storage.deleteCollection(collection.id);
          onDelete();
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.sheet}>
        <View style={styles.dragHandle} />

        <View style={styles.header}>
          <Text style={styles.headerEmoji}>{collection.emoji}</Text>
          <Text style={styles.headerName}>{collection.name}</Text>
        </View>

        <TouchableOpacity style={styles.row} onPress={handleEdit} activeOpacity={0.8}>
          <Pencil size={18} color={Palette.textPrimary} />
          <Text style={styles.rowText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleTogglePin} activeOpacity={0.8}>
          {collection.isPinned ? (
            <PinOff size={18} color={Palette.textPrimary} />
          ) : (
            <Pin size={18} color={Palette.textPrimary} />
          )}
          <Text style={styles.rowText}>{collection.isPinned ? 'Unpin' : 'Pin'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.row, styles.rowLast]} onPress={handleDelete} activeOpacity={0.8}>
          <Trash2 size={18} color={Palette.danger} />
          <Text style={[styles.rowText, styles.dangerText]}>Delete</Text>
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
    paddingTop: Spacing.xl,
    paddingBottom: 40,
  },
  dragHandle: { width: 36, height: 4, backgroundColor: Palette.border, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.xl, marginBottom: Spacing.md },
  headerEmoji: { fontSize: 22 },
  headerName: { fontFamily: 'DMSans-SemiBold', fontSize: 15, color: Palette.textPrimary },
  row: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowText: { fontFamily: 'DMSans-Regular', fontSize: 15, color: Palette.textPrimary },
  dangerText: { color: Palette.danger },
});
