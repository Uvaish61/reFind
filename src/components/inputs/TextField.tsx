import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Palette, Typography, Radius, Spacing } from '../../theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoFocus?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: 'done' | 'next' | 'go' | 'search';
  onSubmitEditing?: () => void;
};

const TextField = forwardRef<TextInput, Props>(function TextField(
  {
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType = 'default',
    autoFocus,
    autoCapitalize,
    returnKeyType,
    onSubmitEditing,
  },
  ref,
) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
        <TextInput
          ref={ref}
          placeholder={placeholder}
          placeholderTextColor={Palette.textDisabled}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.eyeBtn} activeOpacity={0.7}>
            {hidden ? (
              <Eye size={18} color={Palette.textMuted} />
            ) : (
              <EyeOff size={18} color={Palette.textMuted} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});

export default TextField;

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: { ...Typography.labelSM, color: Palette.textMuted, marginBottom: Spacing.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.input,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  inputRowFocused: { borderColor: Palette.borderAccent },
  input: { flex: 1, ...Typography.bodyMD, padding: 0 },
  eyeBtn: { paddingLeft: Spacing.sm, paddingVertical: Spacing.xs },
});
