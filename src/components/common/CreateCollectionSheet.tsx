import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Switch, StyleSheet } from 'react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { Collection } from '../../types';
import * as storage from '../../services/storage';
import PrimaryButton from '../buttons/PrimaryButton';

const EMOJI_OPTIONS = [
  '⚛️', '🎬', '🍳', '✈️', '💼', '💪', '📚', '💡', '🎨', '🏠',
  '🎵', '🏋️', '💰', '🎮', '📝', '🔬', '🌿', '⭐', '🛒', '❤️',
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (collection: Collection) => void;
  editingCollection?: Collection | null;
  onUpdate?: (collection: Collection) => void;
};

export default function CreateCollectionSheet({ visible, onClose, onCreate, editingCollection, onUpdate }: Props) {
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);
  const [name, setName] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedEmoji(editingCollection?.emoji ?? EMOJI_OPTIONS[0]);
      setName(editingCollection?.name ?? '');
      setIsPinned(editingCollection?.isPinned ?? false);
    }
  }, [visible, editingCollection]);

  const isEditing = !!editingCollection;

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (isEditing && editingCollection) {
      const updated: Collection = { ...editingCollection, name: name.trim(), emoji: selectedEmoji, isPinned };
      await storage.updateCollection(updated);
      (onUpdate ?? onCreate)(updated);
      onClose();
      return;
    }

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: name.trim(),
      emoji: selectedEmoji,
      isPinned,
      itemCount: 0,
      createdAt: new Date().toISOString(),
    };
    await storage.saveCollection(newCollection);
    onCreate(newCollection);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.sheet}>
        <View style={styles.dragHandle} />

        <Text style={styles.title}>{isEditing ? 'Edit Collection' : 'New Collection'}</Text>

        <View>
          <Text style={styles.label}>Pick an emoji</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {EMOJI_OPTIONS.map((e) => (
              <TouchableOpacity
                key={e}
                onPress={() => setSelectedEmoji(e)}
                style={[styles.emojiOption, selectedEmoji === e ? styles.emojiOptionActive : null]}
                activeOpacity={0.8}
              >
                <Text style={styles.emojiText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text style={styles.label}>COLLECTION NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Learn React"
            placeholderTextColor={Palette.textDisabled}
            style={styles.input}
            autoFocus
            maxLength={30}
          />
        </View>

        <View style={styles.pinRow}>
          <Text style={styles.pinLabel}>Pin this collection</Text>
          <Switch
            value={isPinned}
            onValueChange={setIsPinned}
            trackColor={{ false: Palette.border, true: Palette.accent }}
            thumbColor="#0C0C0C"
          />
        </View>

        <PrimaryButton
          label={isEditing ? 'Save Changes' : 'Create Collection'}
          onPress={handleSubmit}
          disabled={name.trim().length === 0}
        />
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
    gap: Spacing.xl,
  },
  dragHandle: { width: 36, height: 4, backgroundColor: Palette.border, borderRadius: 2, alignSelf: 'center' },
  title: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 22, color: Palette.textPrimary },
  label: { fontFamily: 'DMSans-SemiBold', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: Palette.textMuted, marginBottom: 8 },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    marginRight: 8,
    backgroundColor: Palette.input,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiOptionActive: { backgroundColor: Palette.accentDim, borderColor: Palette.borderAccent },
  emojiText: { fontSize: 22 },
  input: {
    backgroundColor: Palette.input,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: Palette.textPrimary,
  },
  pinRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pinLabel: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textPrimary },
});
