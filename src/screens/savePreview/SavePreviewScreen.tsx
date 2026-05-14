import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, FlatList, Alert } from 'react-native';
import { Colors } from '../../theme';
import GradientButton from '../../components/buttons/GradientButton';

type SavePreviewScreenProps = {
  onSavePress?: (data: { title: string; url: string; notes: string; tags: string[]; collection: string }) => void;
  onCancelPress?: () => void;
};

const mockCollections = ['Development', 'AI', 'Fitness', 'Jobs', 'Inbox'];

const mockPreview = {
  url: 'https://youtube.com/watch?v=abc123',
  title: 'How to master React hooks in 2024',
  thumbnail: undefined,
  platform: 'youtube' as const,
};

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  youtube: '#FF0000',
  linkedin: '#0077B5',
  twitter: '#1DA1F2',
  link: '#7C3AED',
};

export default function SavePreviewScreen({ onSavePress, onCancelPress }: SavePreviewScreenProps) {
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState(mockCollections[0]);
  const [loading, setLoading] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const saveData = {
        title: mockPreview.title,
        url: mockPreview.url,
        notes,
        tags,
        collection: selectedCollection,
      };
      if (onSavePress) onSavePress(saveData);
      else Alert.alert('Saved!', 'This is a UI-only preview for now.');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Save to reFind</Text>
        <TouchableOpacity onPress={onCancelPress} activeOpacity={0.8} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Preview Thumbnail */}
        {mockPreview.thumbnail ? (
          <Image source={{ uri: mockPreview.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderThumbnail} />
        )}

        {/* URL and Platform Badge */}
        <View style={styles.urlWrapper}>
          <View style={[styles.platformBadge, { backgroundColor: platformColors[mockPreview.platform] || Colors.purple }]}>
            <Text style={styles.platformText}>{mockPreview.platform[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.url} numberOfLines={1}>
            {mockPreview.url}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.previewTitle}>{mockPreview.title}</Text>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add personal notes..."
            placeholderTextColor={Colors.muted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagInputRow}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag..."
              placeholderTextColor={Colors.muted}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={handleAddTag} style={styles.addTagBtn} activeOpacity={0.8}>
              <Text style={styles.addTagText}>+</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={tags}
            renderItem={({ item }) => (
              <View style={styles.tagChip}>
                <Text style={styles.tagChipText}>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(item)} activeOpacity={0.8}>
                  <Text style={styles.tagRemoveText}> ✕</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item}
            horizontal
            scrollEnabled={false}
            contentContainerStyle={styles.tagsContainer}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Collection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Collection</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.collectionsScroll}>
            {mockCollections.map((collection) => (
              <TouchableOpacity
                key={collection}
                onPress={() => setSelectedCollection(collection)}
                style={[styles.collectionChip, selectedCollection === collection && styles.collectionChipActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.collectionChipText, selectedCollection === collection && styles.collectionChipTextActive]}>
                  {collection}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <GradientButton title={loading ? 'Saving...' : 'Save Reel'} onPress={handleSave} disabled={loading} loading={loading} />
          <TouchableOpacity onPress={onCancelPress} activeOpacity={0.8} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#162033' },
  title: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  closeBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  closeText: { color: Colors.muted, fontSize: 20, fontWeight: '300' },
  content: { paddingHorizontal: 20, paddingVertical: 16 },
  thumbnail: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16, backgroundColor: '#1F2937' },
  placeholderThumbnail: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16, backgroundColor: Colors.card },
  urlWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  platformBadge: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  platformText: { color: Colors.text, fontWeight: '700', fontSize: 12 },
  url: { flex: 1, color: Colors.muted, fontSize: 12 },
  previewTitle: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 16, lineHeight: 22 },
  section: { marginBottom: 16 },
  sectionLabel: { color: Colors.text, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  notesInput: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#162033',
    textAlignVertical: 'top',
  },
  tagInputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tagInput: { flex: 1, backgroundColor: Colors.card, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: Colors.text, fontSize: 13, borderWidth: 1, borderColor: '#162033' },
  addTagBtn: { width: 40, height: 40, backgroundColor: Colors.purple, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  addTagText: { color: Colors.text, fontSize: 18, fontWeight: '300' },
  tagsContainer: { gap: 8, paddingBottom: 8, flexWrap: 'wrap' },
  tagChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F1724', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#1F2937' },
  tagChipText: { color: Colors.text, fontSize: 12, fontWeight: '500' },
  tagRemoveText: { color: Colors.muted, fontSize: 12 },
  collectionsScroll: { marginBottom: 4 },
  collectionChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Colors.card, marginRight: 8, borderWidth: 1, borderColor: 'transparent' },
  collectionChipActive: { backgroundColor: Colors.purple, borderColor: Colors.purple },
  collectionChipText: { color: Colors.muted, fontWeight: '600', fontSize: 13 },
  collectionChipTextActive: { color: Colors.text },
  actions: { marginTop: 8 },
  cancelBtn: { marginTop: 10, alignItems: 'center', paddingVertical: 12 },
  cancelText: { color: Colors.muted, fontWeight: '600', fontSize: 14 },
});
