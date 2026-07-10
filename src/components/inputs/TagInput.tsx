import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { Palette, Radius } from '../../theme';

type Props = {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestedTags?: string[];
};

function TagPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>#{label}</Text>
      <TouchableOpacity onPress={onRemove} activeOpacity={0.7} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
        <X size={11} color={Palette.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

export default function TagInput({ tags, onTagsChange, suggestedTags = [] }: Props) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const tag = inputValue.trim().replace(/^#/, '');
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag));
  };

  const availableSuggestions = suggestedTags.filter((t) => !tags.includes(t));

  return (
    <View>
      <View style={styles.row}>
        {tags.map((tag) => (
          <TagPill key={tag} label={tag} onRemove={() => removeTag(tag)} />
        ))}

        <View style={styles.inputWrap}>
          <Text style={styles.hash}>#</Text>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={addTag}
            onBlur={addTag}
            placeholder="add tag"
            placeholderTextColor={Palette.textDisabled}
            style={styles.input}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
          />
        </View>
      </View>

      {availableSuggestions.length > 0 ? (
        <View style={styles.suggestionsRow}>
          <Text style={styles.suggestionsLabel}>Suggestions:</Text>
          {availableSuggestions.slice(0, 5).map((t) => (
            <TouchableOpacity key={t} onPress={() => onTagsChange([...tags, t])} activeOpacity={0.7}>
              <Text style={styles.suggestionText}>#{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.accentDim,
    borderRadius: Radius.sm - 3,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  pillText: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.accent },
  inputWrap: {
    backgroundColor: Palette.input,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
    minWidth: 100,
  },
  hash: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textDisabled },
  input: { fontFamily: 'DMSans-Regular', fontSize: 11, color: Palette.textPrimary, padding: 0, minWidth: 60 },
  suggestionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' },
  suggestionsLabel: { fontSize: 11, color: Palette.textDisabled, fontFamily: 'DMSans-Regular' },
  suggestionText: { fontSize: 11, color: Palette.textMuted, fontFamily: 'DMSans-Regular' },
});
