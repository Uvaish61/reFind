import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme';

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'url';
  error?: string;
};

export default function TextField({ label, placeholder, value, onChangeText, secure, keyboardType = 'default', error }: Props) {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.muted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          style={styles.input}
          autoCapitalize="none"
        />
        {secure ? (
          <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.eyeBtn}>
            <Text style={styles.eyeText}>{hidden ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { color: Colors.muted, fontSize: 13, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B1117', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: 'transparent' },
  inputRowError: { borderColor: '#F87171' },
  input: { flex: 1, color: Colors.text, paddingVertical: 12 },
  eyeBtn: { paddingHorizontal: 8, paddingVertical: 8 },
  eyeText: { color: Colors.muted, fontSize: 13 },
  errorText: { color: '#F87171', marginTop: 6, fontSize: 12 },
});
