import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
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

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

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
          <View style={styles.logoBox} />
          <Text style={styles.heading}>Create your reFind account</Text>
          <Text style={styles.sub}>Save now. Find later.</Text>
        </View>

        <View style={styles.formWrap}>
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

          <GradientButton title={loading ? 'Creating account...' : 'Continue'} onPress={handleContinue} disabled={!canSubmit || loading} loading={loading} />

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}> Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  socialBtn: { flex: 1, backgroundColor: '#0C1318', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 6 },
  socialText: { color: Colors.text, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: Colors.muted },
  footerLink: { color: Colors.purple, fontWeight: '700' },
});
