import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView,
  Platform, Alert, Animated, Easing, ScrollView,
} from 'react-native';
import { Colors } from '../../theme';
import TextField from '../../components/inputs/TextField';
import GradientButton from '../../components/buttons/GradientButton';

type Errors = { email?: string; password?: string };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { email: string; password: string }) {
  const errs: Errors = {};
  if (!values.email.trim()) errs.email = 'Email is required';
  else if (!emailPattern.test(values.email.trim())) errs.email = 'Enter a valid email';
  if (!values.password.trim()) errs.password = 'Password is required';
  else if (values.password.trim().length < 8) errs.password = 'Min 8 characters';
  return errs;
}

function SocialCircle({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.socialCircle} onPress={onPress} activeOpacity={0.75}>
      <Text style={styles.socialCircleText}>{label}</Text>
    </TouchableOpacity>
  );
}

type Props = {
  onSignUpPress?: () => void;
  onBackToRoot?: () => void;
  onContinueAsGuest?: () => void;
};

export default function SignInScreen({ onSignUpPress, onBackToRoot, onContinueAsGuest }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const canSubmit = !!(email.trim() && password.trim() && Object.keys(validate({ email, password })).length === 0);

  const handleSignIn = () => {
    const errs = validate({ email, password });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); Alert.alert('Success', 'UI only for now.'); }, 800);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* White curved header */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={styles.logoMark} />
              <TouchableOpacity onPress={onSignUpPress ?? onBackToRoot} activeOpacity={0.8}>
                <Text style={styles.headerAction}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bigTitle}>Sign In</Text>
          </View>

          {/* Dark form area */}
          <Animated.View style={[styles.form, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextField
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={(t) => { setEmail(t); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }}
              error={errors.email}
            />

            <View style={styles.passHeader}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TouchableOpacity onPress={() => Alert.alert('', 'Forgot password coming soon.')} activeOpacity={0.8}>
                <Text style={styles.forgotText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <TextField
              placeholder="Enter your password"
              secure
              value={password}
              onChangeText={(t) => { setPassword(t); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
              error={errors.password}
            />

            <GradientButton
              title={loading ? 'Signing in...' : 'Sign In'}
              onPress={handleSignIn}
              disabled={!canSubmit || loading}
              loading={loading}
            />

            <View style={styles.divRow}>
              <View style={styles.divLine} />
              <Text style={styles.divText}>or Sign In with</Text>
              <View style={styles.divLine} />
            </View>

            <View style={styles.socialRow}>
              <SocialCircle label="G" onPress={() => Alert.alert('', 'Google coming soon.')} />
              <SocialCircle label="IG" onPress={() => Alert.alert('', 'Instagram coming soon.')} />
              <SocialCircle label="X" onPress={() => Alert.alert('', 'X / Twitter coming soon.')} />
              <SocialCircle label="Tt" onPress={() => Alert.alert('', 'TikTok coming soon.')} />
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={onSignUpPress ?? onBackToRoot} activeOpacity={0.8}>
                <Text style={styles.footerLink}> Sign Up</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onContinueAsGuest ?? onBackToRoot} activeOpacity={0.8} style={styles.guestBtn}>
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },

  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0B0B0F',
  },
  headerAction: {
    color: '#0B0B0F',
    fontWeight: '700',
    fontSize: 15,
  },
  bigTitle: {
    color: '#0B0B0F',
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.5,
  },

  form: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  fieldLabel: {
    color: Colors.muted,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  forgotText: {
    color: Colors.purpleLight,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  divRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  divLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  divText: { color: Colors.muted, fontSize: 12, marginHorizontal: 12 },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 28,
  },
  socialCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialCircleText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  footerText: { color: Colors.muted, fontSize: 14 },
  footerLink: { color: Colors.purpleLight, fontWeight: '700', fontSize: 14 },

  guestBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guestText: { color: Colors.muted, fontSize: 13 },
});
