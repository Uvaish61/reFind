import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Logo from '../../components/common/Logo';
import AuthCard from '../../components/common/AuthCard';
import { Colors } from '../../theme';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Logo />
        <Text style={styles.tagline}>Save now. Find later.</Text>

        <AuthCard>
          <View style={styles.modeRow}>
            <TouchableOpacity onPress={() => setIsLogin(true)} style={[styles.modeButton, isLogin && styles.modeActive]}>
              <Text style={[styles.modeText, isLogin && styles.modeTextActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsLogin(false)} style={[styles.modeButton, !isLogin && styles.modeActive]}>
              <Text style={[styles.modeText, !isLogin && styles.modeTextActive]}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 18 }}>
            <Text style={styles.placeholderText}>This is a placeholder for the {isLogin ? 'Login' : 'Sign up'} form.</Text>
          </View>

          <View style={{ marginTop: 18 }}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{isLogin ? 'Log in' : 'Create account'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ghostButton}>
              <Text style={styles.ghostText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </AuthCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12 },
  tagline: { color: Colors.muted, marginTop: 8, marginBottom: 18 },
  modeRow: { flexDirection: 'row', backgroundColor: 'transparent', borderRadius: 8, overflow: 'hidden' },
  modeButton: { paddingVertical: 10, paddingHorizontal: 22, backgroundColor: 'transparent' },
  modeActive: { backgroundColor: 'rgba(124,58,237,0.12)', borderRadius: 8 },
  modeText: { color: Colors.muted, fontWeight: '600' },
  modeTextActive: { color: Colors.purple },
  placeholderText: { color: Colors.text },
  primaryButton: { marginTop: 6, backgroundColor: Colors.purple, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  primaryButtonText: { color: Colors.text, fontWeight: '700' },
  ghostButton: { marginTop: 10, alignItems: 'center' },
  ghostText: { color: Colors.muted },
});
