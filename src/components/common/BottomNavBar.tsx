import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
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
  const press = useRef(new Animated.Value(1)).current;
  const activeAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(activeAnim, { toValue: active ? 1 : 0, tension: 160, friction: 11, useNativeDriver: false }).start();
  }, [active, activeAnim]);

  const onPressIn = () => Animated.spring(press, { toValue: 0.85, useNativeDriver: true, speed: 40, bounciness: 8 }).start();
  const onPressOut = () => Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }).start();

  const backgroundColor = activeAnim.interpolate({ inputRange: [0, 1], outputRange: ['transparent', Palette.accent] });
  const borderWidth = activeAnim.interpolate({ inputRange: [0, 1], outputRange: [1.5, 0] });
  const iconScale = activeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <TouchableOpacity style={styles.tab} activeOpacity={1} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          styles.iconContainer,
          { borderRadius: shape === 'circle' ? 17 : 9, borderColor: Palette.textMuted, backgroundColor, borderWidth },
          { transform: [{ scale: press }] },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          <Icon size={18} color={active ? '#0C0C0C' : Palette.textMuted} />
        </Animated.View>
      </Animated.View>
      <Text style={active ? styles.labelActive : styles.labelInactive}>{label}</Text>
    </TouchableOpacity>
  );
}

function AddButton({ onPress }: { onPress: () => void }) {
  const press = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(press, { toValue: 0.88, useNativeDriver: true, speed: 40, bounciness: 8 }).start();
  const onPressOut = () => Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }).start();

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.addBtn, { transform: [{ scale: press }] }]}>
        <Plus size={26} color="#0C0C0C" />
      </Animated.View>
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

      <AddButton onPress={() => onTabPress('add')} />

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
  tab: { flexDirection: 'column', alignItems: 'center', gap: 6 },
  iconContainer: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  labelActive: { fontFamily: 'DMSans-SemiBold', fontSize: 10, color: Palette.accent },
  labelInactive: { fontFamily: 'DMSans-Regular', fontSize: 10, color: Palette.textDisabled },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: Palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
});
