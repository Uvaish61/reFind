import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Animated, Easing } from 'react-native';
import { Colors } from '../../theme';
import TextField from '../../components/inputs/TextField';
import GradientButton from '../../components/buttons/GradientButton';

type Errors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { firstName: string; lastName: string; email: string; password: string }) {
  const nextErrors: Errors = {};

  if (!values.firstName.trim()) nextErrors.firstName = 'First name is required';
  if (!values.lastName.trim()) nextErrors.lastName = 'Last name is required';
  if (!values.email.trim()) nextErrors.email = 'Email is required';
  else if (!emailPattern.test(values.email.trim())) nextErrors.email = 'Enter a valid email';

  if (!values.password.trim()) nextErrors.password = 'Password is required';
  else if (values.password.trim().length < 8) nextErrors.password = 'Use at least 8 characters';

  return nextErrors;
}

type SignupScreenProps = {
  onSignInPress?: () => void;
  onBackToRoot?: () => void;
  onContinueAsGuest?: () => void;
};

export default function SignupScreen({ onSignInPress, onBackToRoot, onContinueAsGuest }: SignupScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

  const canSubmit = firstName.trim() && lastName.trim() && email.trim() && password.trim() && Object.keys(validate({ firstName, lastName, email, password })).length === 0;

  const handleContinue = () => {
    const nextErrors = validate({ firstName, lastName, email, password });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Saved', 'This is a UI-only screen for now.');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Animated.View style={[styles.logoBox, { transform: [{ scale: logoScale }] }]} />
          <Text style={styles.heading}>Create your reFind account</Text>
          <Text style={styles.sub}>Save now. Find later.</Text>
        </View>

        <Animated.View style={[styles.formWrap, { opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] }]}>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <TextField label="First name" placeholder="First name" value={firstName} onChangeText={(text) => { setFirstName(text); if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined })); }} error={errors.firstName} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <TextField label="Last name" placeholder="Last name" value={lastName} onChangeText={(text) => { setLastName(text); if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined })); }} error={errors.lastName} />
            </View>
          </View>

          <TextField label="Email" placeholder="Enter your email" keyboardType="email-address" value={email} onChangeText={(text) => { setEmail(text); if (errors.email) setErrors((prev) => ({ ...prev, email: undefined })); }} error={errors.email} />

          <TextField label="Password" placeholder="Create a password" secure value={password} onChangeText={(text) => { setPassword(text); if (errors.password) setErrors((prev) => ({ ...prev, password: undefined })); }} error={errors.password} />

          <GradientButton
            title={loading ? 'Creating account...' : 'Continue'}
            onPress={handleContinue}
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
              <View style={styles.socialIcon}><Text style={styles.socialIconText}></Text></View>
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
              <View style={[styles.socialIcon, styles.googleIcon]}><Text style={styles.socialIconText}>G</Text></View>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={onSignInPress ?? onBackToRoot}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go to sign in"
              accessibilityHint="Returns to the sign in screen or the screen list"
            >
              <Text style={styles.footerLink}> Sign in</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onBackToRoot}
            activeOpacity={0.8}
            style={styles.rootLink}
            accessibilityRole="button"
            accessibilityLabel="Back to screens"
            accessibilityHint="Returns to the placeholder screen list"
          >
            <Text style={styles.rootLinkText}>Back to screens</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onContinueAsGuest ?? onBackToRoot}
            activeOpacity={0.8}
            style={styles.guestButton}
            accessibilityRole="button"
            accessibilityLabel="Continue as guest"
            accessibilityHint="Skips sign up and continues into the app as a guest"
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, alignItems: 'center' },
  logoBox: { width: 96, height: 96, borderRadius: 22, backgroundColor: Colors.purple, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 18, elevation: 8 },
  heading: { color: Colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  sub: { color: Colors.muted, marginTop: 6 },
  formWrap: { paddingHorizontal: 20, marginTop: 8 },
  row: { flexDirection: 'row' },
  dividerWrap: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#1E293B' },
  dividerText: { color: Colors.muted, fontSize: 12, marginHorizontal: 12 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  socialBtn: { flex: 1, backgroundColor: '#0C1318', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 6, flexDirection: 'row', justifyContent: 'center' },
  socialIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  googleIcon: { backgroundColor: '#1F2937' },
  socialIconText: { color: Colors.text, fontSize: 12, fontWeight: '700' },
  socialText: { color: Colors.text, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: Colors.muted },
  footerLink: { color: Colors.purple, fontWeight: '700' },
  rootLink: { alignSelf: 'center', marginTop: 10, paddingVertical: 8, paddingHorizontal: 12 },
  rootLinkText: { color: Colors.muted, fontSize: 12 },
  guestButton: { alignSelf: 'center', marginTop: 8, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, backgroundColor: '#0C1318', borderWidth: 1, borderColor: '#1F2937' },
  guestButtonText: { color: Colors.text, fontWeight: '600', fontSize: 13 },
});
