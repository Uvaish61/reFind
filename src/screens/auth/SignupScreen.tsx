import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import TextField from '../../components/inputs/TextField';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { Screen } from '../ui/UIRoot';

type Props = {
  navigate: (screen: Screen) => void;
};

export default function SignupScreen({ navigate }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!agreed) {
      setError('Please accept the terms to continue.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    setError(null);
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate('home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} translucent={false} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigate('signin')} activeOpacity={0.8}>
            <ChevronLeft size={20} color={Palette.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.subtitle}>Start for free</Text>
            <Text style={styles.heading}>Create your{'\n'}account</Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="FULL NAME"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            <TextField
              ref={emailRef}
              label="EMAIL"
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <TextField
              ref={passwordRef}
              label="PASSWORD"
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 8 characters"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />

            <View style={styles.termsRow}>
              <TouchableOpacity
                style={[styles.checkbox, agreed && styles.checkboxChecked]}
                onPress={() => setAgreed(!agreed)}
                activeOpacity={0.8}
              >
                {agreed ? <View style={styles.checkmark} /> : null}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.ctaSection}>
            <PrimaryButton label="Create Account" onPress={handleSignUp} loading={isLoading} disabled={!agreed} />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <PrimaryButton
              label="Continue with Google"
              variant="ghost"
              onPress={() => {}}
              icon={<View style={styles.googleDot} />}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigate('signin')} activeOpacity={0.8}>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 28, paddingTop: 32, paddingBottom: 48 },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: { marginTop: Spacing.xxxl },
  subtitle: { fontFamily: 'DMSans-Regular', fontSize: 13, color: Palette.textMuted, marginBottom: 6 },
  heading: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 36, color: Palette.textPrimary, lineHeight: 42 },

  form: { marginTop: Spacing.xxl, gap: Spacing.md },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  checkmark: {
    width: 5,
    height: 9,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#0C0C0C',
    transform: [{ rotate: '45deg' }, { translateX: -1 }, { translateY: -1 }],
  },
  termsText: { flex: 1, fontFamily: 'DMSans-Regular', fontSize: 12, lineHeight: 20, color: Palette.textMuted },
  termsLink: { color: Palette.accent },

  errorText: { fontFamily: 'DMSans-Regular', fontSize: 13, color: Palette.danger, marginTop: 4 },

  ctaSection: { marginTop: Spacing.xxl, gap: Spacing.sm + 2 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Palette.border },
  dividerText: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textDisabled },
  googleDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#4285F4' },

  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingTop: 4 },
  footerText: { fontFamily: 'DMSans-Regular', fontSize: 13, color: Palette.textMuted },
  footerLink: { fontFamily: 'DMSans-SemiBold', fontSize: 13, color: Palette.accent },
});
