import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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

export const DashboardScreen = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const currentProject = useMandalartStore((state) => state.currentProject);

  if (!currentProject) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>프로젝트가 없습니다.</Text>
      </SafeAreaView>
    );
  }

  // 전체 진행률 (중앙 블록 제외)
  const nonCenterBlocks = currentProject.blocks.filter((b) => b.position !== 4);
  const allTasks = nonCenterBlocks.flatMap((b) => b.cells.filter((c) => !c.isCenter));
  const completedTasks = allTasks.filter((c) => c.completed).length;
  const overallProgress = allTasks.length > 0 ? completedTasks / allTasks.length : 0;

  // 핵심 목표
  const centerBlock = currentProject.blocks.find((b) => b.position === 4);
  const coreGoal = centerBlock?.cells.find((c) => c.isCenter)?.title ?? '';

  // 완료된 세부 목표 블록 수
  const completedGoals = nonCenterBlocks.filter((b) => {
    const tasks = b.cells.filter((c) => !c.isCenter);
    return tasks.length > 0 && tasks.every((c) => c.completed);
  }).length;

  const goalBlocks = [...nonCenterBlocks].sort((a, b) => a.position - b.position);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 전체 요약 카드 */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>전체 진행 현황</Text>
          <Text style={styles.coreGoal}>🎯 {coreGoal}</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {completedTasks} / {allTasks.length} 완료
            </Text>
            <Text style={styles.progressPercent}>
              {Math.round(overallProgress * 100)}%
            </Text>
          </View>
          <ProgressBar progress={overallProgress} />
        </View>

        {/* 통계 요약 그리드 */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>통계</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedTasks}</Text>
              <Text style={styles.statLabel}>완료된 과제</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{allTasks.length - completedTasks}</Text>
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

        {/* 세부 목표별 진행률 */}
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
  progressPercent: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.light.text,
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
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
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
