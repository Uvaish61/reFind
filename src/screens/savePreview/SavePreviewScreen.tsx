import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform as RNPlatform,
  Clipboard,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, X, ChevronDown, BookmarkPlus } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem, Collection } from '../../types';
import * as storage from '../../services/storage';
import { fetchUrlMetadata, detectPlatform, UrlMetadata } from '../../services/metadata';
import MetadataPreviewCard from '../../components/common/MetadataPreviewCard';
import CollectionPickerSheet from '../../components/common/CollectionPickerSheet';
import CreateCollectionSheet from '../../components/common/CreateCollectionSheet';
import DuplicateAlertSheet from '../../components/common/DuplicateAlertSheet';
import TagInput from '../../components/inputs/TagInput';

type Props = {
  onBack: () => void;
  onSaved: (item: SavedItem) => void;
  initialUrl?: string;
};

export default function SavePreviewScreen({ onBack, onSaved, initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl ?? '');
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [duplicate, setDuplicate] = useState<SavedItem | null>(null);

  const loadCollections = () => {
    storage.getAllCollections().then(setCollections);
  };

  useEffect(() => {
    loadCollections();
    storage.getAllItems().then((items) => {
      const allTags = items.flatMap((i) => i.tags);
      const freq = allTags.reduce<Record<string, number>>((acc, t) => {
        acc[t] = (acc[t] ?? 0) + 1;
        return acc;
      }, {});
      const sorted = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .map(([t]) => t);
      setSuggestedTags(sorted.slice(0, 10));
    });
  }, []);

  useEffect(() => {
    // Mount-only: fires just for the initial share-intent URL, not on every keystroke.
    if (initialUrl) handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMetadataFor = async (trimmed: string) => {
    setIsFetching(true);
    try {
      const data = await fetchUrlMetadata(trimmed);
      setMetadata(data);
      setCustomTitle(data.title);
    } catch {
      setFetchError('Could not fetch metadata. You can still save manually.');
      setMetadata({ title: trimmed, platform: detectPlatform(trimmed), originalUrl: trimmed });
      setCustomTitle('');
    }
    setIsFetching(false);
  };

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setFetchError('Please enter a valid URL starting with https://');
      return;
    }

    setIsFetching(true);
    setFetchError(null);

    const existing = await storage.findItemByUrl(trimmed);
    if (existing) {
      setDuplicate(existing);
      setIsFetching(false);
      return;
    }

    await fetchMetadataFor(trimmed);
  };

  const handlePasteFromClipboard = async () => {
    const text = await Clipboard.getString();
    if (text) {
      setUrl(text);
      setMetadata(null);
    }
  };

  const handleSave = async () => {
    if (!metadata || !customTitle.trim()) return;

    setIsSaving(true);

    const newItem: SavedItem = {
      id: Date.now().toString(),
      url: metadata.originalUrl,
      title: customTitle.trim(),
      originalTitle: metadata.title,
      platform: metadata.platform,
      creator: metadata.creator ?? '',
      thumbnailUri: metadata.thumbnailUrl,
      collection: selectedCollection ?? undefined,
      tags,
      notes: notes.trim() || undefined,
      isFavorite: false,
      savedAt: new Date().toISOString(),
    };

    await storage.saveItem(newItem);

    setIsSaving(false);
    onSaved(newItem);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <KeyboardAvoidingView behavior={RNPlatform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add New</Text>
            <TouchableOpacity onPress={onBack} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.urlSection}>
            <Text style={styles.label}>PASTE LINK</Text>
            <View style={[styles.urlInputRow, url ? styles.urlInputRowActive : null]}>
              <Link size={16} color={url ? Palette.accent : Palette.textDisabled} />
              <TextInput
                value={url}
                onChangeText={(text) => {
                  setUrl(text);
                  setMetadata(null);
                  setFetchError(null);
                }}
                placeholder="https://..."
                placeholderTextColor={Palette.textDisabled}
                style={styles.urlInput}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="go"
                onSubmitEditing={handleFetch}
              />
              {url.length > 0 && !isFetching ? (
                <TouchableOpacity
                  onPress={() => {
                    setUrl('');
                    setMetadata(null);
                  }}
                  style={styles.clearBtn}
                >
                  <X size={14} color={Palette.textMuted} />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={handleFetch}
                disabled={!url.trim() || isFetching}
                style={[styles.fetchBtn, url.trim() ? styles.fetchBtnActive : styles.fetchBtnInactive, isFetching ? styles.fetchBtnFetching : null]}
              >
                {isFetching ? (
                  <ActivityIndicator size="small" color="#0C0C0C" />
                ) : (
                  <Text style={[styles.fetchBtnText, url.trim() ? styles.fetchBtnTextActive : styles.fetchBtnTextInactive]}>Fetch</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handlePasteFromClipboard} style={styles.pasteBtn} activeOpacity={0.8}>
              <Text style={styles.pasteText}>Paste from clipboard</Text>
            </TouchableOpacity>

            {fetchError ? <Text style={styles.errorText}>{fetchError}</Text> : null}
          </View>

          {metadata ? <MetadataPreviewCard metadata={metadata} /> : null}

          {metadata ? (
            <View style={styles.form}>
              <View>
                <Text style={styles.label}>CUSTOM TITLE</Text>
                <TextInput
                  value={customTitle}
                  onChangeText={setCustomTitle}
                  style={[styles.textInput, { borderColor: customTitle ? Palette.borderAccent : Palette.border }]}
                  placeholderTextColor={Palette.textDisabled}
                  placeholder="Give it a memorable name..."
                />
              </View>

              <View>
                <Text style={styles.label}>COLLECTION</Text>
                <TouchableOpacity
                  onPress={() => setShowCollectionPicker(true)}
                  style={[styles.collectionBtn, { borderColor: selectedCollection ? Palette.borderAccent : Palette.border }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.collectionBtnText, { color: selectedCollection ? Palette.accent : Palette.textDisabled }]}>
                    {selectedCollection ? `📁 ${selectedCollection}` : 'Choose a collection...'}
                  </Text>
                  <ChevronDown size={16} color={Palette.textMuted} />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={styles.label}>TAGS</Text>
                <TagInput tags={tags} onTagsChange={setTags} suggestedTags={suggestedTags} />
              </View>

              <View>
                <Text style={styles.label}>NOTES</Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add a personal note..."
                  placeholderTextColor={Palette.textDisabled}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={styles.notesInput}
                />
              </View>

              <TouchableOpacity
                onPress={handleSave}
                disabled={!metadata || isSaving || !customTitle.trim()}
                style={[styles.saveBtn, !metadata || !customTitle.trim() ? styles.saveBtnDisabled : null]}
                activeOpacity={0.85}
              >
                {isSaving ? (
                  <ActivityIndicator color="#0C0C0C" />
                ) : (
                  <>
                    <BookmarkPlus size={18} color="#0C0C0C" />
                    <Text style={styles.saveBtnText}>Save to Refind</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <CollectionPickerSheet
        visible={showCollectionPicker}
        collections={collections}
        selectedCollection={selectedCollection}
        onSelect={setSelectedCollection}
        onClose={() => setShowCollectionPicker(false)}
        onCreateNew={() => {
          setShowCollectionPicker(false);
          setShowCreateCollection(true);
        }}
      />

      <CreateCollectionSheet
        visible={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
        onCreate={(collection) => {
          loadCollections();
          setSelectedCollection(collection.name);
        }}
      />

      {duplicate ? (
        <DuplicateAlertSheet
          visible={!!duplicate}
          existingItem={duplicate}
          onOpenExisting={() => {
            console.log('Open item detail:', duplicate.id);
            setDuplicate(null);
          }}
          onSaveAnyway={() => {
            const trimmed = url.trim();
            setDuplicate(null);
            fetchMetadataFor(trimmed);
          }}
          onClose={() => setDuplicate(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, paddingBottom: 48 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl - 4,
    paddingTop: Spacing.sm,
  },
  headerTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 30, color: Palette.textPrimary },
  cancelText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: Palette.textMuted },

  label: { fontFamily: 'DMSans-SemiBold', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: Palette.textMuted, marginBottom: 8 },

  urlSection: { marginBottom: Spacing.xl },
  urlInputRow: {
    backgroundColor: Palette.input,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: Spacing.lg,
    paddingRight: 6,
  },
  urlInputRowActive: { borderColor: Palette.borderAccent },
  urlInput: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 13, color: Palette.textPrimary, padding: 12 },
  clearBtn: { padding: 8 },
  fetchBtn: { borderRadius: Radius.sm + 2, paddingVertical: 8, paddingHorizontal: 14 },
  fetchBtnActive: { backgroundColor: Palette.accent },
  fetchBtnInactive: { backgroundColor: Palette.input },
  fetchBtnFetching: { opacity: 0.6 },
  fetchBtnText: { fontFamily: 'DMSans-Bold', fontSize: 12 },
  fetchBtnTextActive: { color: '#0C0C0C' },
  fetchBtnTextInactive: { color: Palette.textDisabled },
  pasteBtn: { marginTop: 8, alignSelf: 'flex-start' },
  pasteText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.accent },
  errorText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.danger, marginTop: 8 },

  form: { gap: Spacing.lg },
  textInput: {
    backgroundColor: Palette.input,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: Palette.textPrimary,
  },
  collectionBtn: {
    backgroundColor: Palette.input,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collectionBtnText: { fontFamily: 'DMSans-Regular', fontSize: 14 },
  notesInput: {
    backgroundColor: Palette.input,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 14,
    minHeight: 90,
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: Palette.textPrimary,
    lineHeight: 20,
  },

  saveBtn: {
    marginTop: 8,
    backgroundColor: Palette.accent,
    borderRadius: Radius.xl,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontFamily: 'DMSans-Bold', fontSize: 16, color: '#0C0C0C' },
});
