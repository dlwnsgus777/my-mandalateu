import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/theme';

interface ContextCardProps {
  blockPosition: number; // 0-8 (전체 그리드 내 위치, 4=중앙)
  blockTitle: string;
  progress: number; // 0-1
  completedCount: number;
}

const POSITION_LABEL: Record<number, string> = {
  0: '좌상단',
  1: '중상단',
  2: '우상단',
  3: '좌중단',
  5: '우중단',
  6: '좌하단',
  7: '중하단',
  8: '우하단',
};

// position 4를 제외한 navigable 블록 순서 (1~8번째)
const NAVIGABLE_ORDER: Record<number, number> = {
  0: 1, 1: 2, 2: 3,
  3: 4,       5: 5,
  6: 6, 7: 7, 8: 8,
};

export const ContextCard = ({
  blockPosition,
  blockTitle,
  progress,
  completedCount,
}: ContextCardProps) => {
  const positionLabel = POSITION_LABEL[blockPosition] ?? '';
  const orderNum = NAVIGABLE_ORDER[blockPosition] ?? 0;
  const progressPercent = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      {/* 텍스트 정보 */}
      <View style={styles.info}>
        <Text style={styles.orderText}>{orderNum}번째 영역 · {positionLabel}</Text>
        <Text style={styles.titleText} numberOfLines={1}>{blockTitle || '제목 없음'}</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` as any }]} />
          </View>
          <Text style={styles.progressText}>{completedCount}/8 · {progressPercent}%</Text>
        </View>
      </View>

      {/* 미니 3x3 썸네일 */}
      <View style={styles.miniGrid}>
        {Array.from({ length: 9 }).map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.miniCell,
              idx === 4 && styles.miniCellCenter,
              idx === blockPosition && styles.miniCellActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  info: {
    flex: 1,
    marginRight: Spacing.md,
  },
  orderText: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  titleText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    minWidth: 56,
    textAlign: 'right',
  },

  // 미니 3x3 썸네일
  miniGrid: {
    width: 54,
    height: 54,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  miniCell: {
    width: 16,
    height: 16,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
  },
  miniCellCenter: {
    backgroundColor: Colors.light.centerBlockBackground,
    borderWidth: 1,
    borderColor: Colors.light.centerBlockBorder,
  },
  miniCellActive: {
    backgroundColor: Colors.light.primary,
  },
});
