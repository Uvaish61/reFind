import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet, StatusBar, Platform } from 'react-native';
import { Svg, Rect, Path } from 'react-native-svg';

const ACCENT = '#CFFF47';
const BG = '#0C0C0C';
const TEXT_PRIMARY = '#F2EDE4';
const TEXT_MUTED = 'rgba(242, 237, 228, 0.3)';

interface Props {
  onFinish: () => void;
}

const LogoR = () => (
  <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
    <Rect x="10" y="8" width="7.5" height="40" rx="3.75" fill={BG} />
    <Rect x="10" y="8" width="22" height="7.5" rx="3.75" fill={BG} />
    <Rect x="10" y="29" width="22" height="7.5" rx="3.75" fill={BG} />
    <Rect x="29" y="8" width="7.5" height="29" rx="3.75" fill={BG} />
    <Path
      d="M21.5 36.5 L40 47.5 C41.6 48.4 41 50.5 39.2 50.5 H34.2 C33.4 50.5 32.7 50.1 32.2 49.4 L17.5 36.5 H21.5Z"
      fill={BG}
    />
  </Svg>
);

const StatusIcons = () => (
  <>
    <Svg width={17} height={12} viewBox="0 0 17 12" fill="none">
      <Rect x="0" y="8" width="3" height="4" rx="1" fill="rgba(242,237,228,0.25)" />
      <Rect x="4" y="5" width="3" height="7" rx="1" fill="rgba(242,237,228,0.25)" />
      <Rect x="8" y="2" width="3" height="10" rx="1" fill="rgba(242,237,228,0.25)" />
      <Rect x="12" y="0" width="3" height="12" rx="1" fill="rgba(242,237,228,0.25)" />
    </Svg>

    <Svg width={16} height={12} viewBox="0 0 16 12" fill="none">
      <Path d="M8 9.5 L8.5 10.5 L7.5 10.5 Z" fill="rgba(242,237,228,0.25)" />
      <Path
        d="M5.5 7.5 C6.4 6.6 7.1 6.2 8 6.2 C8.9 6.2 9.6 6.6 10.5 7.5"
        stroke="rgba(242,237,228,0.25)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M3 5 C4.6 3.4 6.2 2.5 8 2.5 C9.8 2.5 11.4 3.4 13 5"
        stroke="rgba(242,237,228,0.2)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Svg>

    <View style={styles.battery}>
      <View style={styles.batteryNotch} />
      <View style={styles.batteryFill} />
    </View>
  </>
);

const LoadingDots = () => {
  const dot1 = useRef(new Animated.Value(0.2)).current;
  const dot2 = useRef(new Animated.Value(0.2)).current;
  const dot3 = useRef(new Animated.Value(0.2)).current;

  const animateDot = (dot: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, { toValue: 1, duration: 560, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0.2, duration: 560, easing: Easing.ease, useNativeDriver: true }),
      ]),
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 180);
    animateDot(dot3, 360);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dotStyle = (anim: Animated.Value) => [
    styles.dot,
    {
      opacity: anim,
      transform: [{ scale: anim.interpolate({ inputRange: [0.2, 1], outputRange: [0.6, 1.2] }) }],
    },
  ];

  return (
    <View style={styles.dotsRow}>
      <Animated.View style={dotStyle(dot1)} />
      <Animated.View style={dotStyle(dot2)} />
      <Animated.View style={dotStyle(dot3)} />
    </View>
  );
};

export default function SplashScreen({ onFinish }: Props) {
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const statusOpacity = useRef(new Animated.Value(0)).current;

  const glowOpacity = useRef(new Animated.Value(0.6)).current;
  const glowScale = useRef(new Animated.Value(1)).current;

  const ring1Scale = useRef(new Animated.Value(0.5)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0.5)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;

  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(-8)).current;

  const shimmerX = useRef(new Animated.Value(-120)).current;

  const dotScale = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;

  const wordY = useRef(new Animated.Value(22)).current;
  const wordScale = useRef(new Animated.Value(0.95)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;

  const tagY = useRef(new Animated.Value(10)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;

  const bottomY = useRef(new Animated.Value(20)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;

  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ease022 = Easing.bezier(0.22, 1, 0.36, 1);

    // ── PHASE 1: Screen flash (t=0) ──
    Animated.timing(screenOpacity, {
      toValue: 1, duration: 80, delay: 0, easing: Easing.linear, useNativeDriver: true,
    }).start();

    // ── Status bar (t=50) ──
    Animated.timing(statusOpacity, {
      toValue: 1, duration: 400, delay: 50, easing: Easing.ease, useNativeDriver: true,
    }).start();

    // ── Logo box entrance (t=120) — 3-keyframe spring-like ──
    Animated.sequence([
      Animated.delay(120),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 200, easing: Easing.ease, useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1.08, duration: 420, easing: Easing.bezier(0.34, 1.4, 0.64, 1), useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 0.96, duration: 140, easing: Easing.ease, useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1, duration: 140, easing: Easing.ease, useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(logoRotate, {
            toValue: 1.5, duration: 420, easing: Easing.bezier(0.34, 1.4, 0.64, 1), useNativeDriver: true,
          }),
          Animated.timing(logoRotate, {
            toValue: -0.5, duration: 140, easing: Easing.ease, useNativeDriver: true,
          }),
          Animated.timing(logoRotate, {
            toValue: 0, duration: 140, easing: Easing.ease, useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    // ── Corner dot pop (t=750) ──
    Animated.sequence([
      Animated.delay(750),
      Animated.parallel([
        Animated.timing(dotOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(dotScale, {
            toValue: 1.3, duration: 280, easing: Easing.bezier(0.34, 1.6, 0.64, 1), useNativeDriver: true,
          }),
          Animated.timing(dotScale, {
            toValue: 1, duration: 120, easing: Easing.ease, useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    // ── Shimmer loop (t=900, every 2400ms) ──
    const runShimmer = () => {
      shimmerX.setValue(-120);
      Animated.timing(shimmerX, {
        toValue: 400, duration: 2400, delay: 900,
        easing: Easing.ease, useNativeDriver: true,
      }).start(({ finished }) => { if (finished) runShimmer(); });
    };
    runShimmer();

    // ── Wordmark (t=650) ──
    Animated.sequence([
      Animated.delay(650),
      Animated.parallel([
        Animated.timing(wordOpacity, { toValue: 1, duration: 550, easing: ease022, useNativeDriver: true }),
        Animated.timing(wordY, { toValue: 0, duration: 550, easing: ease022, useNativeDriver: true }),
        Animated.timing(wordScale, { toValue: 1, duration: 550, easing: ease022, useNativeDriver: true }),
      ]),
    ]).start();

    // ── Tagline (t=850) ──
    Animated.sequence([
      Animated.delay(850),
      Animated.parallel([
        Animated.timing(tagOpacity, { toValue: 1, duration: 600, easing: ease022, useNativeDriver: true }),
        Animated.timing(tagY, { toValue: 0, duration: 600, easing: ease022, useNativeDriver: true }),
      ]),
    ]).start();

    // ── Ring 1 loop (t=900, every 3000ms) ──
    const runRing1 = () => {
      ring1Scale.setValue(0.5);
      ring1Opacity.setValue(0);
      Animated.sequence([
        Animated.delay(900),
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 2.2, duration: 3000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(ring1Opacity, { toValue: 0.5, duration: 600, easing: Easing.ease, useNativeDriver: true }),
            Animated.timing(ring1Opacity, { toValue: 0, duration: 2400, easing: Easing.ease, useNativeDriver: true }),
          ]),
        ]),
      ]).start(({ finished }) => { if (finished) { Animated.delay(0).start(() => runRing1()); } });
    };
    runRing1();

    // ── Ring 2 loop (t=1500, offset 600ms) ──
    const runRing2 = () => {
      ring2Scale.setValue(0.5);
      ring2Opacity.setValue(0);
      Animated.sequence([
        Animated.delay(1500),
        Animated.parallel([
          Animated.timing(ring2Scale, { toValue: 2.2, duration: 3000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(ring2Opacity, { toValue: 0.3, duration: 600, easing: Easing.ease, useNativeDriver: true }),
            Animated.timing(ring2Opacity, { toValue: 0, duration: 2400, easing: Easing.ease, useNativeDriver: true }),
          ]),
        ]),
      ]).start(({ finished }) => { if (finished) { Animated.delay(0).start(() => runRing2()); } });
    };
    runRing2();

    // ── Ambient glow breathe (t=1000, 3s loop) ──
    const runGlow = () => {
      Animated.sequence([
        Animated.delay(1000),
        Animated.parallel([
          Animated.sequence([
            Animated.timing(glowOpacity, { toValue: 1, duration: 1500, easing: Easing.ease, useNativeDriver: true }),
            Animated.timing(glowOpacity, { toValue: 0.6, duration: 1500, easing: Easing.ease, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(glowScale, { toValue: 1.12, duration: 1500, easing: Easing.ease, useNativeDriver: true }),
            Animated.timing(glowScale, { toValue: 1, duration: 1500, easing: Easing.ease, useNativeDriver: true }),
          ]),
        ]),
      ]).start(({ finished }) => { if (finished) runGlow(); });
    };
    runGlow();

    // ── Bottom section (t=1100) ──
    Animated.sequence([
      Animated.delay(1100),
      Animated.parallel([
        Animated.timing(bottomOpacity, { toValue: 1, duration: 500, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(bottomY, { toValue: 0, duration: 500, easing: Easing.ease, useNativeDriver: true }),
      ]),
    ]).start();

    // ── Progress bar (t=1100, 2600ms, non-linear stops) ──
    Animated.sequence([
      Animated.delay(1100),
      Animated.timing(progressWidth, { toValue: 25, duration: 780, easing: Easing.ease, useNativeDriver: false }),
      Animated.timing(progressWidth, { toValue: 60, duration: 780, easing: Easing.ease, useNativeDriver: false }),
      Animated.timing(progressWidth, { toValue: 82, duration: 520, easing: Easing.ease, useNativeDriver: false }),
      Animated.timing(progressWidth, { toValue: 100, duration: 520, easing: Easing.ease, useNativeDriver: false }),
    ]).start();

    // ── Navigate after splash ──
    const timer = setTimeout(() => onFinish(), 3200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoRotateDeg = logoRotate.interpolate({
    inputRange: [-8, -0.5, 0, 1.5],
    outputRange: ['-8deg', '-0.5deg', '0deg', '1.5deg'],
  });

  const shimmerTranslate = shimmerX.interpolate({
    inputRange: [-120, 400],
    outputRange: [-54, 200],
  });

  const progressWidthInterp = progressWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.screen, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Ambient glow ── */}
      <Animated.View style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />

      {/* ── Pulse Ring 1 ── */}
      <Animated.View
        style={[styles.ring, styles.ring1, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]}
      />

      {/* ── Pulse Ring 2 ── */}
      <Animated.View
        style={[styles.ring, styles.ring2, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]}
      />

      {/* ── Status Bar ── */}
      <Animated.View style={[styles.statusBar, { opacity: statusOpacity }]}>
        <Text style={styles.statusTime}>9:41</Text>
        <View style={styles.statusIcons}>
          <StatusIcons />
        </View>
      </Animated.View>

      {/* ── Logo Center ── */}
      <View style={styles.logoCenter}>
        <Animated.View
          style={[
            styles.logoWrapper,
            { opacity: logoOpacity, transform: [{ scale: logoScale }, { rotate: logoRotateDeg }] },
          ]}
        >
          <View style={styles.logoShadow} />

          <View style={styles.logoBox}>
            <View style={styles.logoGloss} />

            <Animated.View style={[styles.shimmer, { transform: [{ translateX: shimmerTranslate }] }]} />

            <LogoR />
          </View>

          <Animated.View style={[styles.cornerDot, { opacity: dotOpacity, transform: [{ scale: dotScale }] }]} />
        </Animated.View>

        <Animated.View style={{ opacity: wordOpacity, transform: [{ translateY: wordY }, { scale: wordScale }] }}>
          <Text style={styles.wordmark}>Refind</Text>
        </Animated.View>

        <Animated.View style={{ opacity: tagOpacity, transform: [{ translateY: tagY }] }}>
          <Text style={styles.tagline}>Save · Organize · Rediscover</Text>
        </Animated.View>
      </View>

      {/* ── Bottom Section ── */}
      <Animated.View style={[styles.bottom, { opacity: bottomOpacity, transform: [{ translateY: bottomY }] }]}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidthInterp }]} />
        </View>

        <LoadingDots />

        <Text style={styles.version}>v1.0.0</Text>
      </Animated.View>

      {/* Home indicator */}
      <View style={styles.homeIndicator} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(207, 255, 71, 0.07)',
    top: '44%',
    left: '50%',
    marginLeft: -200,
    marginTop: -224,
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    top: '42%',
    left: '50%',
    marginLeft: -80,
    marginTop: -80,
  },
  ring1: { borderColor: 'rgba(207,255,71,0.15)', borderWidth: 1.5 },
  ring2: { borderColor: 'rgba(207,255,71,0.08)', borderWidth: 1 },
  statusBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  statusTime: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
    color: TEXT_MUTED,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  battery: {
    width: 22,
    height: 11,
    borderWidth: 1.2,
    borderColor: 'rgba(242,237,228,0.25)',
    borderRadius: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1.5,
    position: 'relative',
  },
  batteryNotch: {
    position: 'absolute',
    right: -4,
    top: '50%',
    marginTop: -2.5,
    width: 2.5,
    height: 5,
    backgroundColor: 'rgba(242,237,228,0.2)',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },
  batteryFill: {
    width: '65%',
    height: '100%',
    backgroundColor: 'rgba(242,237,228,0.25)',
    borderRadius: 1.5,
  },
  logoCenter: {
    alignItems: 'center',
    marginTop: -48,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    marginBottom: 28,
  },
  logoShadow: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(207, 255, 71, 0.25)',
    borderRadius: 22,
    top: 12,
    left: 10,
    opacity: 0.6,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: ACCENT,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '55%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomRightRadius: 40,
  },
  shimmer: {
    position: 'absolute',
    top: -10,
    left: 0,
    width: 45,
    height: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    transform: [{ skewX: '-20deg' }],
  },
  cornerDot: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: BG,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: ACCENT,
  },
  wordmark: {
    fontFamily: 'DMSerifDisplay-Italic',
    fontSize: 44,
    color: TEXT_PRIMARY,
    letterSpacing: -0.8,
    lineHeight: 48,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: 'rgba(242, 237, 228, 0.32)',
    letterSpacing: 4.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 12,
  },
  bottom: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 18,
  },
  progressTrack: {
    width: 100,
    height: 2,
    backgroundColor: 'rgba(242, 237, 228, 0.07)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: 2,
  },
  dotsRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: ACCENT },
  version: {
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    color: 'rgba(242, 237, 228, 0.12)',
    letterSpacing: 1.2,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 130,
    height: 4,
    backgroundColor: 'rgba(242, 237, 228, 0.15)',
    borderRadius: 3,
  },
});
