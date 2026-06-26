import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Animated, Easing, ScrollView } from 'react-native';
import { Smartphone, Globe } from 'lucide-react-native';
import { Colors } from '../../theme';
import TextField from '../../components/inputs/TextField';
import GradientButton from '../../components/buttons/GradientButton';

type Errors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { email: string; password: string }) {
  const nextErrors: Errors = {};

  if (!values.email.trim()) nextErrors.email = 'Email is required';
  else if (!emailPattern.test(values.email.trim())) nextErrors.email = 'Enter a valid email';

  if (!values.password.trim()) nextErrors.password = 'Password is required';
  else if (values.password.trim().length < 8) nextErrors.password = 'Use at least 8 characters';

  return nextErrors;
}

type SignInScreenProps = {
  onSignUpPress?: () => void;
  onBackToRoot?: () => void;
  onContinueAsGuest?: () => void;
};

export default function SignInScreen({ onSignUpPress, onBackToRoot, onContinueAsGuest }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(18)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardOpacity, cardTranslateY, logoScale]);

  const canSubmit = email.trim() && password.trim() && Object.keys(validate({ email, password })).length === 0;

  const handleSignIn = () => {
    const nextErrors = validate({ email, password });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'This is a UI-only screen for now.');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Animated.View style={[styles.logoBox, { transform: [{ scale: logoScale }] }]} />
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.sub}>Sign in to continue.</Text>
          </View>

          <Animated.View style={[styles.formWrap, { opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] }]}>
            <TextField
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
            />

            <View style={styles.passwordRow}>
              <TextField
                label="Password"
                placeholder="Enter your password"
                secure
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Alert.alert('Placeholder', 'Forgot password flow coming soon.')}
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
              >
                <Text style={styles.forgotLink}>Forgot?</Text>
              </TouchableOpacity>
            </View>

            <GradientButton
              title={loading ? 'Signing in...' : 'Sign in'}
              onPress={handleSignIn}
              disabled={!canSubmit || loading}
              loading={loading}
            />

            <View style={styles.dividerWrap}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.85}
                onPress={() => Alert.alert('Placeholder', 'Apple sign-in will be added later.')}
                accessibilityRole="button"
                accessibilityLabel="Continue with Apple"
                accessibilityHint="Shows a placeholder message for Apple sign in"
              >
                <Smartphone size={18} color={Colors.text} style={styles.socialIconSpacing} />
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.85}
                onPress={() => Alert.alert('Placeholder', 'Google sign-in will be added later.')}
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
                accessibilityHint="Shows a placeholder message for Google sign in"
              >
                <Globe size={18} color={Colors.text} style={styles.socialIconSpacing} />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity
                onPress={onSignUpPress ?? onBackToRoot}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Go to sign up"
                accessibilityHint="Returns to the sign up screen"
              >
                <Text style={styles.footerLink}> Sign up</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={onContinueAsGuest ?? onBackToRoot}
              activeOpacity={0.8}
              style={styles.guestButton}
              accessibilityRole="button"
              accessibilityLabel="Continue as guest"
              accessibilityHint="Skips sign in and continues into the app as a guest"
            >
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 },
  header: { paddingTop: 8, paddingBottom: 16, alignItems: 'center', width: '100%', maxWidth: 440, alignSelf: 'center' },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: Colors.purple,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  heading: { color: Colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  sub: { color: Colors.muted, marginTop: 6 },
  formWrap: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    marginTop: 8,
    padding: 18,
    backgroundColor: '#0F1724',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#162033',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  passwordRow: { position: 'relative' },
  forgotLink: { position: 'absolute', top: 8, right: 0, color: Colors.purple, fontWeight: '600', fontSize: 12 },
  dividerWrap: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#1E293B' },
  dividerText: { color: Colors.muted, fontSize: 12, marginHorizontal: 12 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  socialBtn: {
    flex: 1,
    backgroundColor: '#0C1318',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIconSpacing: { marginRight: 8 },
  socialText: { color: Colors.text, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: Colors.muted },
  footerLink: { color: Colors.purple, fontWeight: '700' },
  rootLink: { alignSelf: 'center', marginTop: 10, paddingVertical: 8, paddingHorizontal: 12 },
  rootLinkText: { color: Colors.muted, fontSize: 12 },
  guestButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#0C1318',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  guestButtonText: { color: Colors.text, fontWeight: '600', fontSize: 13 },
});
