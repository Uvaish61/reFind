import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Palette, Radius, Spacing } from '../../theme';
import { SavedItem } from '../../types';
import * as storage from '../../services/storage';
import BarChart from '../../components/common/BarChart';
import PlatformBar from '../../components/common/PlatformBar';
import StatCard from '../../components/common/StatCard';
import { Screen } from '../ui/UIRoot';

type Props = {
  navigate: (screen: Screen) => void;
  onBack: () => void;
};

type Period = 'week' | 'month' | 'alltime';

const PERIODS: Period[] = ['week', 'month', 'alltime'];
const DAY_MS = 24 * 60 * 60 * 1000;

export default function StatisticsScreen({ onBack }: Props) {
  const [period, setPeriod] = useState<Period>('week');
  const [allItems, setAllItems] = useState<SavedItem[]>([]);
  const [collectionsCount, setCollectionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [items, collections] = await Promise.all([storage.getAllItems(), storage.getAllCollections()]);
      setAllItems(items);
      setCollectionsCount(collections.length);
      setIsLoading(false);
    };
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const now = Date.now();
    const cutoff: Record<Period, number> = { week: 7 * DAY_MS, month: 30 * DAY_MS, alltime: Infinity };
    return allItems.filter((i) => now - new Date(i.savedAt).getTime() <= cutoff[period]);
  }, [allItems, period]);

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredItems.forEach((i) => {
      counts[i.platform] = (counts[i.platform] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([platform, count]) => ({ platform, count, pct: Math.round((count / filteredItems.length) * 100) }));
  }, [filteredItems]);

  const topTags = useMemo(() => {
    const freq: Record<string, number> = {};
    filteredItems.forEach((i) => i.tags.forEach((t) => { freq[t] = (freq[t] ?? 0) + 1; }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [filteredItems]);

  const uniqueTagsCount = useMemo(() => new Set(filteredItems.flatMap((i) => i.tags)).size, [filteredItems]);

  const dailySaves = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toDateString();
    });
    return days.map((day) => ({
      label: new Date(day).toLocaleDateString('en', { weekday: 'short' }).slice(0, 2),
      count: allItems.filter((i) => new Date(i.savedAt).toDateString() === day).length,
    }));
  }, [allItems]);

  const previousCount = useMemo(() => {
    const now = Date.now();
    const cutoffs: Record<Period, [number, number]> = {
      week: [14 * DAY_MS, 7 * DAY_MS],
      month: [60 * DAY_MS, 30 * DAY_MS],
      alltime: [Infinity, 0],
    };
    const [start, end] = cutoffs[period];
    return allItems.filter((i) => {
      const age = now - new Date(i.savedAt).getTime();
      return age <= start && age > end;
    }).length;
  }, [allItems, period]);

  const delta = filteredItems.length - previousCount;
  const deltaLabel = delta > 0 ? `↑ ${delta} more than last ${period}` : delta < 0 ? `↓ ${Math.abs(delta)} fewer` : 'Same as last period';

  const barAnimations = useRef(platformCounts.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      80,
      platformCounts.map((_, i) => Animated.spring(barAnimations[i], { toValue: 1, tension: 120, friction: 10, useNativeDriver: false })),
    ).start();
  }, [platformCounts, barAnimations]);

  if (isLoading) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bg} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onBack}>
            <ChevronLeft size={18} color={Palette.textMuted} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statistics</Text>
        </View>

        <View style={styles.periodToggle}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.periodBtn, period === p ? styles.periodBtnActive : null]}
            >
              <Text style={period === p ? styles.periodLabelActive : styles.periodLabel}>
                {p === 'alltime' ? 'All time' : p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <View>
              <Text style={styles.heroLabel}>Saved this {period}</Text>
              <Text style={styles.heroValue}>{filteredItems.length}</Text>
              <Text style={[styles.heroDelta, { color: delta >= 0 ? 'rgba(207,255,71,0.6)' : Palette.textMuted }]}>{deltaLabel}</Text>
            </View>
            <BarChart data={dailySaves} height={64} accentColor={Palette.accent} />
          </View>
        </View>

        <View style={styles.weeklyChartSection}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily saves — last 7 days</Text>
            <View style={styles.weeklyChartRow}>
              {dailySaves.map((d, i) => {
                const maxVal = Math.max(...dailySaves.map((x) => x.count), 1);
                const isToday = i === dailySaves.length - 1;
                const barHeight = Math.max((d.count / maxVal) * 80, 4);
                return (
                  <View key={i} style={styles.weeklyBarCol}>
                    <View
                      style={[
                        styles.weeklyBarFill,
                        { height: barHeight, backgroundColor: isToday ? Palette.accent : d.count > 0 ? 'rgba(207,255,71,0.25)' : Palette.input },
                      ]}
                    />
                    <Text style={styles.weeklyBarLabel}>{d.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.statCardsSection}>
          <StatCard value={filteredItems.length.toString()} label="Items saved" />
          <StatCard value={collectionsCount.toString()} label="Collections" />
          <StatCard value={uniqueTagsCount.toString()} label="Tags used" />
        </View>

        <View style={styles.sectionWrap}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>By platform</Text>
            {platformCounts.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No saves yet</Text>
              </View>
            ) : (
              platformCounts.map((p, i) => (
                <PlatformBar key={p.platform} platform={p.platform} pct={p.pct} animVal={barAnimations[i]} />
              ))
            )}
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Top tags</Text>
            {topTags.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No tags yet</Text>
              </View>
            ) : (
              <View style={styles.tagsWrap}>
                {topTags.map(([tag, count], i) => {
                  const isBig = i === 0;
                  const opacity = 1 - (i / topTags.length) * 0.6;
                  return (
                    <View
                      key={tag}
                      style={[
                        styles.tagChip,
                        { backgroundColor: isBig ? Palette.accent : Palette.accentDim, paddingVertical: isBig ? 6 : 4, paddingHorizontal: isBig ? 14 : 10, opacity },
                      ]}
                    >
                      <Text style={{ fontFamily: isBig ? 'DMSans-Bold' : 'DMSans-Regular', fontSize: isBig ? 13 : 11, color: isBig ? '#0C0C0C' : Palette.accent }}>
                        #{tag} · {count}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Activity — last 4 weeks</Text>
            <View style={styles.heatmapGrid}>
              {Array.from({ length: 4 }, (_w, week) => (
                <View key={week} style={styles.heatmapRow}>
                  {Array.from({ length: 7 }, (_d, day) => {
                    const daysAgo = (3 - week) * 7 + (6 - day);
                    const date = new Date();
                    date.setDate(date.getDate() - daysAgo);
                    const dayStr = date.toDateString();
                    const count = allItems.filter((i) => new Date(i.savedAt).toDateString() === dayStr).length;
                    const bg = count === 0 ? Palette.input : count <= 2 ? Palette.accentDim : count <= 4 ? 'rgba(207,255,71,0.45)' : Palette.accent;
                    return <View key={day} style={[styles.heatmapCell, { backgroundColor: bg }]} />;
                  })}
                </View>
              ))}
            </View>
            <View style={styles.heatmapLabels}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <View key={i} style={styles.heatmapLabelCol}>
                  <Text style={styles.heatmapLabelText}>{d}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bg },
  scrollContent: { paddingBottom: 60 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, marginBottom: Spacing.xl },
  backBtn: { width: 36, height: 36, backgroundColor: Palette.card, borderRadius: Radius.md, borderWidth: 1, borderColor: Palette.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 34, color: Palette.textPrimary },

  periodToggle: { flexDirection: 'row', gap: 4, backgroundColor: Palette.card, borderRadius: Radius.md, padding: 4, marginHorizontal: Spacing.xl, marginBottom: Spacing.xl },
  periodBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 9 },
  periodBtnActive: { backgroundColor: Palette.accent },
  periodLabel: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted },
  periodLabelActive: { fontFamily: 'DMSans-Bold', fontSize: 12, color: '#0C0C0C' },

  heroSection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  heroCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLabel: { fontFamily: 'DMSans-Regular', fontSize: 12, color: Palette.textMuted, marginBottom: 6 },
  heroValue: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 56, color: Palette.accent, lineHeight: 60 },
  heroDelta: { fontFamily: 'DMSans-Regular', fontSize: 11, marginTop: 4 },

  weeklyChartSection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  card: { backgroundColor: Palette.card, borderRadius: Radius.xl, padding: Spacing.xl, borderWidth: 1, borderColor: Palette.border },
  cardTitle: { fontFamily: 'DMSerifDisplay-Italic', fontSize: 20, color: Palette.textPrimary, marginBottom: Spacing.lg },
  weeklyChartRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, height: 80 },
  weeklyBarCol: { flex: 1, alignItems: 'center', gap: 6 },
  weeklyBarFill: { width: '100%', borderRadius: 4 },
  weeklyBarLabel: { fontFamily: 'DMSans-Regular', fontSize: 9, color: Palette.textDisabled },

  statCardsSection: { flexDirection: 'row', gap: 10, paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },

  sectionWrap: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  emptyRow: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontFamily: 'DMSans-Regular', fontSize: 13, color: Palette.textMuted },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { borderRadius: Radius.sm },

  heatmapGrid: { gap: 4 },
  heatmapRow: { flexDirection: 'row', gap: 4 },
  heatmapCell: { flex: 1, aspectRatio: 1, borderRadius: 3 },
  heatmapLabels: { flexDirection: 'row', gap: 4, marginTop: 6 },
  heatmapLabelCol: { flex: 1, alignItems: 'center' },
  heatmapLabelText: { fontFamily: 'DMSans-Regular', fontSize: 8, color: Palette.textDisabled },
});
