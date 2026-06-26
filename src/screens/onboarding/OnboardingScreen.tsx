import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { Bookmark, Tag, Search } from 'lucide-react-native';
import { Colors } from '../../theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    Icon: Bookmark,
    title: 'Save anything,\nnever lose it again.',
    description: 'Save reels, tweets, links, articles, and anything you find online.',
  },
  {
    id: '2',
    Icon: Tag,
    title: 'Organize\nwith tags & notes.',
    description: 'Add tags, notes and collections to keep everything structured.',
  },
  {
    id: '3',
    Icon: Search,
    title: 'Find it instantly,\nwhenever you need.',
    description: 'Powerful search helps you find anything in seconds.',
  },
];

type Props = {
  onFinish: () => void;
};

export default function OnboardingScreen({ onFinish }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goToNext = () => {
    if (activeIndex < slides.length - 1) {
      const next = activeIndex + 1;
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    } else {
      onFinish();
    }
  };

  const isLast = activeIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={onFinish} activeOpacity={0.7}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
            <View style={styles.illustrationBox}>
              <View style={styles.iconCircle}>
                <item.Icon size={64} color={Colors.text} strokeWidth={1.5} />
              </View>
              <View style={styles.orb1} />
              <View style={styles.orb2} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Animated.View>
        )}
      />

      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={goToNext} activeOpacity={0.85}>
        <Text style={styles.nextText}>{isLast ? 'Get Started' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center' },

  skipBtn: { position: 'absolute', top: 16, right: 24, zIndex: 10, paddingVertical: 8, paddingHorizontal: 12 },
  skipText: { color: Colors.muted, fontSize: 14, fontWeight: '600' },

  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },

  illustrationBox: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.purple,
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 12,
  },
  orb1: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A78BFA',
    opacity: 0.5,
  },
  orb2: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6D28D9',
    opacity: 0.6,
  },

  title: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  description: {
    color: Colors.muted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },

  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.purple,
    borderRadius: 4,
  },

  nextBtn: {
    width: width - 48,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: Colors.purple,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: Colors.purple,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  nextText: { color: Colors.text, fontSize: 16, fontWeight: '700' },
});
