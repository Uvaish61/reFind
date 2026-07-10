import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Instagram, Youtube, Linkedin, Facebook, Search, ChevronDown } from 'lucide-react-native';
import { Palette, Typography, Radius, Spacing } from '../../theme';
import Logo from '../../components/common/Logo';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import OnboardingDots from '../../components/common/OnboardingDots';
import GradientBox from '../../components/common/GradientBox';

const TOTAL_SLIDES = 3;

type Props = {
  onGetStarted: () => void;
  onSignInPress: () => void;
};

export default function OnboardingScreen({ onGetStarted, onSignInPress }: Props) {
  const [slide, setSlide] = useState(0);
  const goNext = () => setSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {slide === 0 && <WelcomeSlide onGetStarted={goNext} onSignInPress={onSignInPress} />}
      {slide === 1 && <SaveSlide onNext={goNext} />}
      {slide === 2 && <FindSlide onGetStarted={onGetStarted} />}
    </SafeAreaView>
  );
}

function WelcomeSlide({ onGetStarted, onSignInPress }: { onGetStarted: () => void; onSignInPress: () => void }) {
  return (
    <View style={styles.welcomeSlide}>
      <View style={styles.topSection}>
        <Logo />
        <Text style={styles.tagline}>Save. Organize. Rediscover.</Text>
      </View>

      <View style={styles.illustrationCard}>
        <PreviewRow colors={['#1a1a00', '#8aaa00']} />
        <PreviewRow colors={['#001a28', '#0077b6']} accentBorder />
        <PreviewRow colors={['#1a0028', '#6b21a8']} />
      </View>

      <View style={styles.bottomSection}>
        <PrimaryButton label="Get Started" onPress={onGetStarted} />
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onSignInPress} activeOpacity={0.8}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function SaveSlide({ onNext }: { onNext: () => void }) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.standardSlide}>
      <View style={styles.illustrationCardFlex}>
        <View style={styles.shareBadge}>
          <Text style={styles.shareBadgeText}>SHARE INTENT</Text>
        </View>

        <View style={styles.platformRow}>
          <GradientBox colors={['#833ab4', '#fd1d1d', '#fcb045']} width={44} height={44} borderRadius={12}>
            <Instagram size={20} color="#fff" />
          </GradientBox>
          <View style={[styles.platformIcon, { backgroundColor: '#ff0000' }]}>
            <Youtube size={20} color="#fff" />
          </View>
          <View style={[styles.platformIcon, { backgroundColor: '#0077b5' }]}>
            <Linkedin size={20} color="#fff" />
          </View>
          <View style={[styles.platformIcon, { backgroundColor: '#1877f2' }]}>
            <Facebook size={20} color="#fff" />
          </View>
        </View>

        <Animated.View style={[styles.arrowWrap, { opacity: pulse }]}>
          <View style={styles.arrowLine} />
          <ChevronDown size={18} color={Palette.accentDim} />
        </Animated.View>

        <View style={styles.logoIconSmall}>
          <Text style={styles.logoIconSmallText}>R</Text>
        </View>

        <View style={styles.savedBadge}>
          <Text style={styles.savedBadgeText}>Saved to Refind ✓</Text>
        </View>
      </View>

      <View style={styles.textSection}>
        <Text style={styles.heading}>Save from anywhere.</Text>
        <Text style={styles.body}>
          Share any Reel, Short, post or article directly to Refind — no more copy-pasting links.
        </Text>

        <View style={styles.progressRow}>
          <OnboardingDots total={TOTAL_SLIDES} current={1} />
          <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function FindSlide({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <View style={styles.standardSlide}>
      <View style={styles.illustrationCardFlex}>
        <View style={styles.searchBarMock}>
          <Search size={14} color={Palette.accent} />
          <Text style={styles.searchBarText}>react hooks</Text>
          <View style={styles.blinkCursor} />
        </View>

        <ResultRow colors={['#1a1a00', '#8aaa00']} accentBorder />
        <ResultRow colors={['#001a28', '#0077b6']} />
        <ResultRow colors={['#1a0028', '#6b21a8']} />

        <View style={styles.tagRow}>
          <View style={[styles.tagChip, styles.tagChipActive]}>
            <Text style={styles.tagChipActiveText}>#React</Text>
          </View>
          <View style={styles.tagChip}>
            <Text style={styles.tagChipText}>YouTube</Text>
          </View>
          <View style={styles.tagChip}>
            <Text style={styles.tagChipText}>Learn React</Text>
          </View>
        </View>
      </View>

      <View style={styles.textSection}>
        <Text style={styles.heading}>Find it instantly.</Text>
        <Text style={styles.body}>
          Search across titles, tags, notes, collections and creators — all in one place.
        </Text>

        <View style={styles.progressRow}>
          <OnboardingDots total={TOTAL_SLIDES} current={2} />
          <TouchableOpacity style={styles.nextBtn} onPress={onGetStarted} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function PreviewRow({ colors, accentBorder }: { colors: string[]; accentBorder?: boolean }) {
  return (
    <View style={styles.previewRow}>
      <GradientBox colors={colors} width={32} height={32} borderRadius={8} style={accentBorder ? styles.thumbAccentBorder : undefined} />
      <View style={styles.previewLines}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
      </View>
    </View>
  );
}

function ResultRow({ colors, accentBorder }: { colors: string[]; accentBorder?: boolean }) {
  return (
    <View style={styles.previewRow}>
      <GradientBox colors={colors} width={36} height={36} borderRadius={8} style={accentBorder ? styles.thumbAccentBorder : undefined} />
      <View style={styles.previewLines}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },

  // Slide 0 — Welcome
  welcomeSlide: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 48,
  },
  topSection: { alignItems: 'center' },
  tagline: { ...Typography.bodySM, marginTop: Spacing.sm },

  illustrationCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Palette.border,
    height: 240,
    padding: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  thumbAccentBorder: { borderWidth: 1, borderColor: Palette.borderAccent },
  previewLines: { flex: 1, gap: 6 },
  skeletonLine: { height: 8, borderRadius: 4, backgroundColor: Palette.border, width: '100%' },
  skeletonLineShort: { width: '60%' },

  bottomSection: { gap: Spacing.md },
  footerRow: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { ...Typography.bodySM },
  footerLink: { ...Typography.bodySM, color: Palette.accent, fontFamily: 'DMSans-SemiBold' },

  // Slides 1 & 2 — shared layout
  standardSlide: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 48,
    gap: Spacing.xxxl,
  },
  illustrationCardFlex: {
    flex: 1,
    backgroundColor: Palette.card,
    borderRadius: Radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    position: 'relative',
  },

  // Slide 1 — Save from anywhere
  shareBadge: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Palette.accentDim,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    borderRadius: Radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  shareBadgeText: { ...Typography.labelSM, color: Palette.accent, letterSpacing: 0.5 },
  platformRow: { flexDirection: 'row', gap: Spacing.md },
  platformIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowWrap: { alignItems: 'center' },
  arrowLine: { width: 1, height: 32, backgroundColor: Palette.accentDim },
  logoIconSmall: {
    width: 52,
    height: 52,
    borderRadius: Radius.xl,
    backgroundColor: Palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconSmallText: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 24, color: '#0C0C0C' },
  savedBadge: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  savedBadgeText: { ...Typography.labelSM, color: Palette.accent, textTransform: 'none' },

  // Slide 2 — Find instantly
  searchBarMock: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.bg,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
  },
  searchBarText: { ...Typography.bodyMD, flex: 1 },
  blinkCursor: { width: 2, height: 14, backgroundColor: Palette.accent },
  tagRow: { flexDirection: 'row', gap: Spacing.sm, position: 'absolute', bottom: Spacing.lg, left: Spacing.lg, right: Spacing.lg },
  tagChip: { backgroundColor: Palette.card, borderRadius: Radius.xxl, paddingVertical: 6, paddingHorizontal: 12 },
  tagChipActive: { backgroundColor: Palette.accentDim },
  tagChipText: { ...Typography.caption },
  tagChipActiveText: { ...Typography.caption, color: Palette.accent },

  // Slide 1 & 2 shared bottom text/progress
  textSection: { gap: Spacing.md },
  heading: { ...Typography.displayLG },
  body: { ...Typography.bodyMD, color: Palette.textMuted },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
  nextBtn: {
    marginLeft: 'auto',
    backgroundColor: Palette.accent,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
  },
  nextBtnText: { ...Typography.buttonMD },
});
