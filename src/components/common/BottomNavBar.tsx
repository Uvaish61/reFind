import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, BookOpen, User, Plus } from 'lucide-react-native';
import { Palette } from '../../theme';

export type Tab = 'home' | 'search' | 'add' | 'library' | 'profile';

type Props = {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
};

type TabDef = {
  key: Exclude<Tab, 'add'>;
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  shape: 'square' | 'circle';
};

const LEFT_TABS: TabDef[] = [
  { key: 'home', label: 'Home', Icon: Home, shape: 'square' },
  { key: 'search', label: 'Search', Icon: Search, shape: 'square' },
];

const RIGHT_TABS: TabDef[] = [
  { key: 'library', label: 'Library', Icon: BookOpen, shape: 'square' },
  { key: 'profile', label: 'Profile', Icon: User, shape: 'circle' },
];

function NavTab({ tab, active, onPress }: { tab: TabDef; active: boolean; onPress: () => void }) {
  const { Icon, label, shape } = tab;
  return (
    <TouchableOpacity style={styles.tab} activeOpacity={0.8} onPress={onPress}>
      <View
        style={[
          styles.iconContainer,
          { borderRadius: shape === 'circle' ? 10 : 5 },
          active ? styles.iconContainerActive : styles.iconContainerInactive,
        ]}
      >
        <Icon size={12} color={active ? '#0C0C0C' : Palette.textMuted} />
      </View>
      <Text style={active ? styles.labelActive : styles.labelInactive}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function BottomNavBar({ activeTab, onTabPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 4 }]}>
      {LEFT_TABS.map((tab) => (
        <NavTab key={tab.key} tab={tab} active={activeTab === tab.key} onPress={() => onTabPress(tab.key)} />
      ))}

      <TouchableOpacity style={styles.addBtn} activeOpacity={0.85} onPress={() => onTabPress('add')}>
        <Plus size={24} color="#0C0C0C" />
      </TouchableOpacity>

      {RIGHT_TABS.map((tab) => (
        <NavTab key={tab.key} tab={tab} active={activeTab === tab.key} onPress={() => onTabPress(tab.key)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Palette.navBar,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingTop: 12,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: { flexDirection: 'column', alignItems: 'center', gap: 4 },
  iconContainer: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  iconContainerActive: { backgroundColor: Palette.accent },
  iconContainerInactive: { borderWidth: 1.5, borderColor: Palette.textMuted },
  labelActive: { fontFamily: 'DMSans-SemiBold', fontSize: 10, color: Palette.accent },
  labelInactive: { fontFamily: 'DMSans-Regular', fontSize: 10, color: Palette.textDisabled },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
});
