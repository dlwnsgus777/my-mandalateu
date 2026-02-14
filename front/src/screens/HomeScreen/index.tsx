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
import { BlockGrid } from '../../components/BlockGrid';
import { ProgressBar } from '../../components/ProgressBar';
import { Colors } from '../../constants/colors';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Layout,
  Shadow,
  Spacing,
} from '../../constants/theme';

type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const currentProject = useMandalartStore((state) => state.currentProject);

  if (!currentProject) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>프로젝트가 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 전체 진행률 계산 (중앙 블록 제외, 비중심 셀 기준)
  const nonCenterBlocks = currentProject.blocks.filter((b) => b.position !== 4);
  const allTasks = nonCenterBlocks.flatMap((b) => b.cells.filter((c) => !c.isCenter));
  const completedTasks = allTasks.filter((c) => c.completed).length;
  const overallProgress = allTasks.length > 0 ? completedTasks / allTasks.length : 0;

  const handleBlockPress = (blockId: string, blockTitle: string) => {
    navigation.navigate('BlockDetail', { blockId, blockTitle });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로젝트 카드 */}
        <View style={styles.projectCard}>
          <Text style={styles.projectTitle}>{currentProject.title}</Text>
          <Text style={styles.progressLabel}>
            전체 진행률 · {completedTasks}/{allTasks.length}
          </Text>
          <ProgressBar progress={overallProgress} />
          <Text style={styles.progressPercent}>
            {Math.round(overallProgress * 100)}%
          </Text>
        </View>

        {/* 3×3 블록 그리드 */}
        <View style={styles.gridContainer}>
          <BlockGrid
            blocks={currentProject.blocks}
            onBlockPress={handleBlockPress}
          />
        </View>

        {/* 힌트 텍스트 */}
        <Text style={styles.hintText}>블록을 탭하여 상세 보기</Text>

        {/* 액션 버튼 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => navigation.navigate('Dashboard')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>통계 보기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => {/* TODO: 새 프로젝트 생성 */}}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonSecondaryText}>새 프로젝트</Text>
          </TouchableOpacity>
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
    padding: Layout.screenPadding,
    paddingBottom: Spacing.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.light.textSecondary,
  },

  // 프로젝트 카드
  projectCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  projectTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  progressPercent: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.light.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },

  // 그리드
  gridContainer: {
    marginBottom: Spacing.md,
  },

  // 힌트
  hintText: {
    fontSize: FontSize.sm,
    color: Colors.light.textDisabled,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // 버튼
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    height: Layout.bottomButtonHeight,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.light.buttonPrimary,
    ...Shadow.sm,
  },
  buttonSecondary: {
    backgroundColor: Colors.light.buttonSecondary,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.light.buttonText,
  },
  buttonSecondaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.light.buttonTextSecondary,
  },
});
