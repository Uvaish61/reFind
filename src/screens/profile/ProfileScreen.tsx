import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Share, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Moon, Bell, Folder, ChartColumn, Heart, Archive, Upload, Search, Info, Lock, FileText } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import * as storage from '../../services/storage';
import SettingsSection from '../../components/common/SettingsSection';
import SettingsRow from '../../components/common/SettingsRow';
import ToggleRow from '../../components/common/ToggleRow';
import BottomNavBar, { Tab } from '../../components/common/BottomNavBar';
import { Screen } from '../ui/UIRoot';

type Props = {
  navigate: (screen: Screen) => void;
};

const PREFS_KEY = '@refind_prefs';

export default function ProfileScreen({ navigate }: Props) {
  const [userName] = useState('Uvaish');
  const [userEmail] = useState('uvaish@gmail.com');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [defaultCollection] = useState<string | null>(null);
  const [archiveCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const prefs = await AsyncStorage.getItem(PREFS_KEY);
      if (prefs) {
        const p = JSON.parse(prefs);
        setIsDarkMode(p.isDarkMode ?? true);
        setNotifEnabled(p.notifications ?? false);
      }
    };
    load();
  }, []);

  const savePref = async (key: string, value: boolean) => {
    const existing = await AsyncStorage.getItem(PREFS_KEY);
    const prefs = existing ? JSON.parse(existing) : {};
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify({ ...prefs, [key]: value }));
  };

  const handleTabPress = (tab: Tab) => {
    if (tab === 'home') navigate('home');
    else if (tab === 'search') navigate('search');
    else if (tab === 'add') navigate('savePreview');
    else if (tab === 'library') navigate('library');
    else if (tab === 'profile') navigate('profile');
  };

  const handleExport = async () => {
    const items = await storage.getAllItems();
    await Share.share({ message: JSON.stringify(items, null, 2), title: 'Refind — Exported Data' });
  };

  const handleClearSearch = () => {
    Alert.alert('Clear Search History', 'Remove all recent searches?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => AsyncStorage.removeItem('recent_searches') },
    ]);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeMany(['@refind_user', PREFS_KEY]);
          navigate('signin');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8} onPress={() => {}}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <SettingsSection title="Preferences">
          <ToggleRow label="Dark Mode" icon={Moon} value={isDarkMode} onToggle={(v) => { setIsDarkMode(v); savePref('isDarkMode', v); }} />
          <ToggleRow label="Notifications" icon={Bell} value={notifEnabled} onToggle={(v) => { setNotifEnabled(v); savePref('notifications', v); }} />
          <SettingsRow label="Default Collection" icon={Folder} value={defaultCollection ?? 'None'} onPress={() => {}} isLast />
        </SettingsSection>

        <SettingsSection title="Activity">
          <SettingsRow label="Statistics" icon={ChartColumn} onPress={() => navigate('statistics')} showChevron />
          <SettingsRow label="Favorites" icon={Heart} onPress={() => {}} showChevron />
          <SettingsRow label="Archive" icon={Archive} value={`${archiveCount} items`} onPress={() => {}} showChevron isLast />
        </SettingsSection>

        <SettingsSection title="Data">
          <SettingsRow label="Export Data" icon={Upload} onPress={handleExport} showChevron />
          <SettingsRow label="Clear Search History" icon={Search} onPress={handleClearSearch} isLast />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow label="Version" icon={Info} value="1.0.0" />
          <SettingsRow label="Privacy Policy" icon={Lock} onPress={() => {}} showChevron />
          <SettingsRow label="Terms of Service" icon={FileText} onPress={() => {}} showChevron isLast />
        </SettingsSection>

        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar activeTab="profile" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  scrollContent: { paddingBottom: 100 },

  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, marginBottom: 4 },
  headerTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 34, color: Palette.textPrimary },

  avatarBlock: { paddingHorizontal: Spacing.xl, alignItems: 'center', paddingVertical: Spacing.xxl, gap: 10 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.accent,
    borderWidth: 3,
    borderColor: Palette.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 36, color: '#0C0C0C' },
  userName: { fontFamily: 'DMSans-Bold', fontSize: 18, color: Palette.textPrimary },
  userEmail: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },
  editBtn: {
    backgroundColor: Palette.accentDim,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    borderRadius: Radius.sm,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  editBtnText: { fontFamily: 'DMSans-SemiBold', fontSize: 12, color: Palette.accent },

  signOutSection: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xs },
  signOutBtn: {
    backgroundColor: 'rgba(220,80,80,0.08)',
    borderRadius: Radius.xl,
    padding: Spacing.md + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220,80,80,0.15)',
  },
  signOutText: { fontFamily: 'DMSans-SemiBold', fontSize: 14, color: Palette.danger },
});
