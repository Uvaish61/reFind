import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../../theme';

interface Props {
  onFinish: () => void;
}

const DOT_COUNT = 3;
const DOT_DELAY = 200;

export default function SplashScreen({ onFinish }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;
  const dotAnims = useRef(Array.from({ length: DOT_COUNT }, () => new Animated.Value(0.3))).current;
  const dotLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(taglineFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      dotLoop.current = startDotLoop();

      setTimeout(() => {
        dotLoop.current?.stop();
        Animated.timing(screenFade, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => onFinish());
      }, 2000);
    });
  }, []);

  function startDotLoop() {
    const pulse = dotAnims.map((anim, i) =>
      Animated.sequence([
        Animated.delay(i * DOT_DELAY),
        Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
      ])
    );
    const loop = Animated.loop(Animated.parallel(pulse));
    loop.start();
    return loop;
  }

  return (
    <Animated.View style={[styles.container, { opacity: screenFade }]}>
      <Animated.View style={[styles.logoBox, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
        <View style={styles.logoSquare} />
      </Animated.View>

      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>reFind</Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: taglineFade }]}>
        Save it. Find it. Keep it.
      </Animated.Text>

      <Animated.View style={[styles.dotsRow, { opacity: taglineFade }]}>
        {dotAnims.map((anim, i) => (
          <Animated.View key={i} style={[styles.dot, { opacity: anim }]} />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    marginBottom: 16,
  },
  logoSquare: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.purple,
  },
  title: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
  tagline: {
    color: Colors.muted,
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.purple,
  },
});
