import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useMandalartStore } from '../../store/mandalartStore';
import { MandalartCell } from '../../types/mandalart';
import { ProgressBar } from '../../components/ProgressBar';
import { Colors } from '../../constants/colors';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Shadow,
  Spacing,
} from '../../constants/theme';

type BlockDetailRouteProp = RouteProp<RootStackParamList, 'BlockDetail'>;
type BlockDetailNavigationProp = StackNavigationProp<RootStackParamList, 'BlockDetail'>;

export const BlockDetailScreen = () => {
  const navigation = useNavigation<BlockDetailNavigationProp>();
  const route = useRoute<BlockDetailRouteProp>();
  const { blockId } = route.params;

  const currentProject = useMandalartStore((state) => state.currentProject);
  const toggleCell = useMandalartStore((state) => state.toggleCell);
  const updateCellTitle = useMandalartStore((state) => state.updateCellTitle);

  const [editingCell, setEditingCell] = useState<MandalartCell | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const block = currentProject?.blocks.find((b) => b.id === blockId);

  const nonCenterCells = block?.cells.filter((c) => !c.isCenter) ?? [];
  const completedCount = nonCenterCells.filter((c) => c.completed).length;
  const progress = nonCenterCells.length > 0 ? completedCount / nonCenterCells.length : 0;

  useLayoutEffect(() => {
    if (!block) return;
    navigation.setOptions({
      title: block.goalTitle,
      headerRight: () => (
        <Text style={styles.headerRight}>{completedCount}/8</Text>
      ),
    });
  }, [navigation, block, completedCount]);

  if (!block) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>블록을 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const sortedCells = [...block.cells].sort((a, b) => a.position - b.position);
  const rows = [sortedCells.slice(0, 3), sortedCells.slice(3, 6), sortedCells.slice(6, 9)];

  // 블록 네비게이션 (중앙 블록 제외)
  const allBlocks = [...(currentProject?.blocks ?? [])].sort((a, b) => a.position - b.position);
  const navigableBlocks = allBlocks.filter((b) => b.position !== 4);
  const navIndex = navigableBlocks.findIndex((b) => b.id === blockId);
  const prevBlock = navIndex > 0 ? navigableBlocks[navIndex - 1] : null;
  const nextBlock = navIndex < navigableBlocks.length - 1 ? navigableBlocks[navIndex + 1] : null;

  const handleCellPress = (cell: MandalartCell) => {
    if (cell.isCenter) return;
    setEditingCell(cell);
    setEditTitle(cell.title);
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    const trimmed = editTitle.trim();
    if (trimmed) {
      updateCellTitle(blockId, editingCell.id, trimmed);
    }
    setEditingCell(null);
  };

  const handleNavigate = (targetId: string, targetTitle: string) => {
    navigation.replace('BlockDetail', { blockId: targetId, blockTitle: targetTitle });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 진행률 카드 */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>실행 과제</Text>
            <Text style={styles.progressCount}>{completedCount} / 8 완료</Text>
          </View>
          <ProgressBar progress={progress} />
          <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
        </View>

        {/* 3x3 셀 그리드 */}
        <View style={styles.grid}>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.row}>
              {row.map((cell) =>
                cell.isCenter ? (
                  <View key={cell.id} style={[styles.cell, styles.centerCell]}>
                    <Text style={styles.centerIcon}>🎯</Text>
                    <Text style={styles.centerCellTitle} numberOfLines={4}>
                      {cell.title}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    key={cell.id}
                    style={[styles.cell, cell.completed && styles.completedCell]}
                    onPress={() => handleCellPress(cell)}
                    activeOpacity={0.7}
                  >
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => toggleCell(blockId, cell.id)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text style={styles.checkboxIcon}>
                        {cell.completed ? '✅' : '⬜'}
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={[styles.cellTitle, cell.completed && styles.completedText]}
                      numberOfLines={4}
                    >
                      {cell.title}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          ))}
        </View>

        {/* 힌트 */}
        <Text style={styles.hintText}>셀을 탭하여 제목 수정  ·  체크박스로 완료 처리</Text>

        {/* 블록 간 네비게이션 */}
        <View style={styles.blockNav}>
          <TouchableOpacity
            style={[styles.navButton, !prevBlock && styles.navButtonDisabled]}
            onPress={() => prevBlock && handleNavigate(prevBlock.id, prevBlock.goalTitle)}
            disabled={!prevBlock}
          >
            <Text style={[styles.navButtonText, !prevBlock && styles.navButtonTextDisabled]}>
              ← {prevBlock?.goalTitle ?? '이전'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, !nextBlock && styles.navButtonDisabled]}
            onPress={() => nextBlock && handleNavigate(nextBlock.id, nextBlock.goalTitle)}
            disabled={!nextBlock}
          >
            <Text style={[styles.navButtonText, !nextBlock && styles.navButtonTextDisabled]}>
              {nextBlock?.goalTitle ?? '다음'} →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 셀 편집 모달 */}
      <Modal
        visible={!!editingCell}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingCell(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>실행 과제 수정</Text>
            <TextInput
              style={styles.modalInput}
              value={editTitle}
              onChangeText={setEditTitle}
              autoFocus
              placeholder="실행 과제를 입력하세요"
              maxLength={50}
              returnKeyType="done"
              onSubmitEditing={handleSaveEdit}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingCell(null)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerRight: {
    color: '#fff',
    marginRight: 16,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 80,
    fontSize: FontSize.lg,
    color: Colors.light.textSecondary,
  },

  // 진행률 카드
  progressCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
  },
  progressCount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.light.text,
  },
  progressPercent: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },

  // 3x3 그리드
  grid: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cell: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 90,
    ...Shadow.sm,
  },
  centerCell: {
    backgroundColor: Colors.light.centerBlockBackground,
    borderColor: Colors.light.centerBlockBorder,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCell: {
    backgroundColor: '#E8F5E9',
    borderColor: Colors.light.progressHigh,
  },
  centerIcon: {
    fontSize: FontSize.lg,
    marginBottom: 4,
  },
  centerCellTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.light.primary,
    textAlign: 'center',
  },
  checkbox: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  checkboxIcon: {
    fontSize: 16,
  },
  cellTitle: {
    fontSize: FontSize.xs,
    color: Colors.light.text,
    lineHeight: 16,
  },
  completedText: {
    color: Colors.light.textSecondary,
    textDecorationLine: 'line-through',
  },

  // 힌트
  hintText: {
    fontSize: FontSize.xs,
    color: Colors.light.textDisabled,
    textAlign: 'center',
    marginVertical: Spacing.sm,
  },

  // 블록 네비게이션
  blockNav: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  navButton: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  navButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.light.primary,
  },
  navButtonTextDisabled: {
    color: Colors.light.textDisabled,
  },

  // 편집 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.light.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalBox: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: '100%',
    ...Shadow.lg,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.light.buttonSecondary,
  },
  cancelButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.light.text,
  },
  saveButton: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  saveButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.light.buttonText,
  },
});
