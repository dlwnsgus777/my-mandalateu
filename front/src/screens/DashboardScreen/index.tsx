import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useMandalartStore } from '../../store/mandalartStore';
import { ProgressBar } from '../../components/ProgressBar';
import { Colors } from '../../constants/colors';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Shadow,
  Spacing,
} from '../../constants/theme';

type DashboardNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
type DateRange = 'week' | 'month' | 'all';

// ── 날짜 유틸 ─────────────────────────────────────────────────────────────────

const toDateStr = (d: Date): string => d.toISOString().split('T')[0];

/** 이번 주 월요일부터 일요일까지 7개 Date 반환 */
const getMonWeek = (): Date[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay(); // 0=Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

/** 연속 달성 streak 계산 */
const calcStreak = (dates: string[]): { current: number; best: number } => {
  if (dates.length === 0) return { current: 0, best: 0 };

  const unique = [...new Set(dates)].sort().reverse(); // 최신순
  const todayStr = toDateStr(new Date());
  const yesterdayStr = toDateStr(new Date(Date.now() - 86400000));

  // 현재 streak
  let current = 0;
  if (unique[0] === todayStr || unique[0] === yesterdayStr) {
    const cursor = new Date(unique[0]);
    for (const d of unique) {
      if (d === toDateStr(cursor)) {
        current++;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }
  }

  // 최고 streak (오름차순 탐색)
  const asc = [...new Set(dates)].sort();
  let best = asc.length > 0 ? 1 : 0;
  let temp = 1;
  for (let i = 1; i < asc.length; i++) {
    const diff = Math.round(
      (new Date(asc[i]).getTime() - new Date(asc[i - 1]).getTime()) / 86400000
    );
    if (diff === 1) {
      temp++;
      best = Math.max(best, temp);
    } else {
      temp = 1;
    }
  }
  return { current, best };
};

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

export const DashboardScreen = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const currentProject = useMandalartStore((state) => state.currentProject);

  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('week');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
  }, []);

  const entranceStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!currentProject) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>프로젝트가 없습니다.</Text>
      </SafeAreaView>
    );
  }

  // ── 기본 데이터 ─────────────────────────────────────────────────────────────
  const nonCenterBlocks = currentProject.blocks.filter((b) => b.position !== 4);
  const centerBlock = currentProject.blocks.find((b) => b.position === 4);
  const coreGoal = centerBlock?.cells.find((c) => c.isCenter)?.title ?? '';

  // blockId·blockTitle을 포함한 셀 평탄화
  const allTasksWithBlock = nonCenterBlocks.flatMap((b) =>
    b.cells.filter((c) => !c.isCenter).map((c) => ({
      ...c,
      blockId: b.id,
      blockTitle: b.goalTitle,
    }))
  );

  // ── 날짜 범위 필터 ──────────────────────────────────────────────────────────
  const getCutoff = (): Date | null => {
    if (dateRange === 'all') return null;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (dateRange === 'week' ? 7 : 30));
    cutoff.setHours(0, 0, 0, 0);
    return cutoff;
  };

  const filteredCompleted = allTasksWithBlock.filter((c) => {
    if (!c.completed) return false;
    if (dateRange === 'all') return true;
    if (!c.completedAt) return false;
    const cutoff = getCutoff();
    return cutoff ? new Date(c.completedAt) >= cutoff : true;
  });

  const overallProgress =
    allTasksWithBlock.length > 0 ? filteredCompleted.length / allTasksWithBlock.length : 0;

  const completedGoals = nonCenterBlocks.filter((b) => {
    const tasks = b.cells.filter((c) => !c.isCenter);
    return tasks.length > 0 && tasks.every((c) => c.completed);
  }).length;

  // ── 주간 체크 현황 ──────────────────────────────────────────────────────────
  const weekDays = getMonWeek();
  const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];
  const todayStr = toDateStr(new Date());

  const weekDayCompletions = weekDays.map((day) => {
    const dayStr = toDateStr(day);
    return allTasksWithBlock.filter(
      (c) => c.completedAt && c.completedAt.startsWith(dayStr)
    ).length;
  });

  const thisWeekTotal = weekDayCompletions.reduce((s, n) => s + n, 0);

  const lastWeekEnd = new Date(weekDays[0]);
  lastWeekEnd.setDate(weekDays[0].getDate() - 1);
  lastWeekEnd.setHours(23, 59, 59, 999);
  const lastWeekStart = new Date(weekDays[0]);
  lastWeekStart.setDate(weekDays[0].getDate() - 7);

  const lastWeekTotal = allTasksWithBlock.filter((c) => {
    if (!c.completedAt) return false;
    const d = new Date(c.completedAt);
    return d >= lastWeekStart && d <= lastWeekEnd;
  }).length;

  const weeklyChange =
    lastWeekTotal === 0
      ? thisWeekTotal > 0
        ? 100
        : 0
      : Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);

  // ── Streak ──────────────────────────────────────────────────────────────────
  const completionDates = allTasksWithBlock
    .filter((c) => c.completedAt)
    .map((c) => new Date(c.completedAt!).toISOString().split('T')[0]);

  const streak = calcStreak(completionDates);

  // ── 다가오는 마감일 ──────────────────────────────────────────────────────────
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const upcomingDeadlines = allTasksWithBlock
    .filter((c) => c.deadline && !c.completed)
    .map((c) => {
      const dl = new Date(c.deadline!);
      dl.setHours(0, 0, 0, 0);
      const daysUntil = Math.round(
        (dl.getTime() - todayMidnight.getTime()) / 86400000
      );
      return { ...c, daysUntil };
    })
    .filter((c) => c.daysUntil >= 0 && c.daysUntil <= 3)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const deadlineColor = (days: number) => {
    if (days === 0) return '#F44336';
    if (days === 1) return '#FFC107';
    return '#4CAF50';
  };
  const deadlineLabel = (days: number) => {
    if (days === 0) return '오늘';
    if (days === 1) return '내일';
    return `${days}일 후`;
  };

  const goalBlocks = [...nonCenterBlocks].sort((a, b) => a.position - b.position);

  // ── 렌더 ────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[{ flex: 1 }, entranceStyle]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* ── 날짜 범위 탭 ── */}
          <View style={styles.rangeTabRow}>
            {(['week', 'month', 'all'] as DateRange[]).map((range) => {
              const label = range === 'week' ? '주간' : range === 'month' ? '월간' : '전체';
              const active = dateRange === range;
              return (
                <TouchableOpacity
                  key={range}
                  style={[styles.rangeTab, active && styles.rangeTabActive]}
                  onPress={() => setDateRange(range)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.rangeTabText, active && styles.rangeTabTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── 전체 요약 카드 ── */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>전체 진행 현황</Text>
            <Text style={styles.coreGoal}>🎯 {coreGoal}</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>
                {filteredCompleted.length} / {allTasksWithBlock.length} 완료
                {dateRange !== 'all' && (
                  <Text style={styles.rangeHint}>
                    {dateRange === 'week' ? '  (최근 7일)' : '  (최근 30일)'}
                  </Text>
                )}
              </Text>
              <Text style={styles.progressPercent}>
                {Math.round(overallProgress * 100)}%
              </Text>
            </View>
            <ProgressBar progress={overallProgress} />
          </View>

          {/* ── 주간 체크 현황 카드 ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>주간 체크 현황</Text>
            <View style={styles.weekRow}>
              {weekDays.map((day, i) => {
                const isToday = toDateStr(day) === todayStr;
                const count = weekDayCompletions[i];
                return (
                  <View key={i} style={styles.weekDayCol}>
                    <Text style={[styles.weekDayLabel, isToday && styles.weekDayLabelToday]}>
                      {DAY_LABELS[i]}
                    </Text>
                    <View
                      style={[
                        styles.weekDayDot,
                        count > 0 ? styles.weekDayDotDone : styles.weekDayDotEmpty,
                        isToday && styles.weekDayDotToday,
                      ]}
                    >
                      {count > 0 && (
                        <Text style={styles.weekDayCount}>{count}</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.weekSummaryRow}>
              <Text style={styles.weekSummaryText}>
                이번 주 {thisWeekTotal}개 완료
              </Text>
              {(lastWeekTotal > 0 || thisWeekTotal > 0) && (
                <Text
                  style={[
                    styles.weekChangeText,
                    { color: weeklyChange >= 0 ? '#4CAF50' : '#F44336' },
                  ]}
                >
                  {weeklyChange >= 0 ? '▲' : '▼'} {Math.abs(weeklyChange)}%
                </Text>
              )}
            </View>
            {lastWeekTotal > 0 && (
              <Text style={styles.lastWeekHint}>지난 주 {lastWeekTotal}개 대비</Text>
            )}
          </View>

          {/* ── Streak 카드 ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>연속 달성 Streak</Text>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={styles.streakValue}>{streak.current}</Text>
                <Text style={styles.streakLabel}>현재 연속</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakEmoji}>🏆</Text>
                <Text style={styles.streakValue}>{streak.best}</Text>
                <Text style={styles.streakLabel}>최고 기록</Text>
              </View>
            </View>
            {streak.current === 0 && (
              <Text style={styles.streakHint}>
                오늘 할 일을 완료하여 streak을 시작하세요!
              </Text>
            )}
          </View>

          {/* ── 다가오는 마감일 카드 ── */}
          {upcomingDeadlines.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>다가오는 마감일</Text>
              {upcomingDeadlines.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.deadlineItem,
                    idx === upcomingDeadlines.length - 1 && { borderBottomWidth: 0 },
                  ]}
                  onPress={() =>
                    navigation.navigate('BlockDetail', {
                      blockId: item.blockId,
                      blockTitle: item.blockTitle,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.deadlineBadge,
                      { backgroundColor: deadlineColor(item.daysUntil) },
                    ]}
                  >
                    <Text style={styles.deadlineBadgeText}>
                      {deadlineLabel(item.daysUntil)}
                    </Text>
                  </View>
                  <View style={styles.deadlineInfo}>
                    <Text style={styles.deadlineTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.deadlineBlock} numberOfLines={1}>
                      {item.blockTitle}
                    </Text>
                  </View>
                  <Text style={styles.deadlineArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── 통계 요약 그리드 ── */}
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>통계</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{filteredCompleted.length}</Text>
                <Text style={styles.statLabel}>완료된 과제</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {allTasksWithBlock.length - filteredCompleted.length}
                </Text>
                <Text style={styles.statLabel}>남은 과제</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedGoals}</Text>
                <Text style={styles.statLabel}>완료된 목표</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{8 - completedGoals}</Text>
                <Text style={styles.statLabel}>진행 중 목표</Text>
              </View>
            </View>
          </View>

          {/* ── 세부 목표별 진행률 ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>세부 목표별 진행률</Text>
            {goalBlocks.map((block) => {
              const tasks = block.cells.filter((c) => !c.isCenter);
              const done = tasks.filter((c) => c.completed).length;
              const prog = tasks.length > 0 ? done / tasks.length : 0;
              const isComplete = done === tasks.length;

              return (
                <TouchableOpacity
                  key={block.id}
                  style={styles.goalRow}
                  onPress={() =>
                    navigation.navigate('BlockDetail', {
                      blockId: block.id,
                      blockTitle: block.goalTitle,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleRow}>
                      {isComplete && <Text style={styles.completeIcon}>✅ </Text>}
                      <Text style={styles.goalTitle} numberOfLines={1}>
                        {block.goalTitle}
                      </Text>
                    </View>
                    <Text style={styles.goalCount}>{done}/8</Text>
                  </View>
                  <ProgressBar progress={prog} />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 80,
    fontSize: FontSize.lg,
    color: Colors.light.textSecondary,
  },

  // 날짜 범위 탭
  rangeTabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  rangeTab: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  rangeTabActive: {
    backgroundColor: Colors.light.primary,
  },
  rangeTabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.light.textSecondary,
  },
  rangeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: FontWeight.semibold,
  },

  // 요약 카드
  summaryCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  coreGoal: {
    fontSize: FontSize.md,
    color: Colors.light.primary,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
  },
  rangeHint: {
    fontSize: FontSize.xs,
    color: Colors.light.textDisabled,
  },
  progressPercent: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.light.text,
  },

  // 공통 카드
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },

  // 주간 체크 현황
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  weekDayCol: {
    alignItems: 'center',
    flex: 1,
  },
  weekDayLabel: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  weekDayLabelToday: {
    color: Colors.light.primary,
    fontWeight: FontWeight.bold,
  },
  weekDayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDayDotDone: {
    backgroundColor: Colors.light.progressHigh,
  },
  weekDayDotEmpty: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  weekDayDotToday: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  weekDayCount: {
    fontSize: FontSize.xs,
    color: '#FFFFFF',
    fontWeight: FontWeight.bold,
  },
  weekSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  weekSummaryText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.light.text,
  },
  weekChangeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  lastWeekHint: {
    fontSize: FontSize.xs,
    color: Colors.light.textDisabled,
    marginTop: 2,
  },

  // Streak
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  streakValue: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.light.text,
  },
  streakLabel: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  streakDivider: {
    width: 1,
    height: 60,
    backgroundColor: Colors.light.divider,
  },
  streakHint: {
    fontSize: FontSize.xs,
    color: Colors.light.textDisabled,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // 다가오는 마감일
  deadlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  deadlineBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    minWidth: 44,
    alignItems: 'center',
  },
  deadlineBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },
  deadlineInfo: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.light.text,
  },
  deadlineBlock: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  deadlineArrow: {
    fontSize: FontSize.xl,
    color: Colors.light.textDisabled,
    marginLeft: Spacing.xs,
  },

  // 통계 그리드
  statsCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },

  // 세부 목표 리스트
  goalRow: {
    marginBottom: Spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  completeIcon: {
    fontSize: FontSize.sm,
  },
  goalTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.light.text,
    flex: 1,
  },
  goalCount: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    fontWeight: FontWeight.medium,
  },
});
