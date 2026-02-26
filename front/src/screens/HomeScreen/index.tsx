import React, { useState, useEffect } from 'react';
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
  Vibration,
  RefreshControl,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ColorPicker } from '../../components/ColorPicker';
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
  const updateProjectTitle = useMandalartStore((state) => state.updateProjectTitle);
  const updateSubGoal = useMandalartStore((state) => state.updateSubGoal);
  const updateCoreGoal = useMandalartStore((state) => state.updateCoreGoal);
  const updateBlockColor = useMandalartStore((state) => state.updateBlockColor);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  // Pull to Refresh
  const [refreshing, setRefreshing] = useState(false);

  // 롱프레스 메뉴
  const [longPressBlockId, setLongPressBlockId] = useState<string | null>(null);
  const [longPressMenuVisible, setLongPressMenuVisible] = useState(false);
  const [longPressTitleEditing, setLongPressTitleEditing] = useState(false);
  const [longPressTitleInput, setLongPressTitleInput] = useState('');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={{ marginRight: 12 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="settings" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const entranceStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!currentProject) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>프로젝트가 없습니다.</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateProject')}
          >
            <Text style={styles.createButtonText}>+ 새 프로젝트 만들기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const nonCenterBlocks = currentProject.blocks.filter((b) => b.position !== 4);
  const allTasks = nonCenterBlocks.flatMap((b) => b.cells.filter((c) => !c.isCenter));
  const completedTasks = allTasks.filter((c) => c.completed).length;
  const overallProgress = allTasks.length > 0 ? completedTasks / allTasks.length : 0;

  const longPressBlock = currentProject?.blocks.find((b) => b.id === longPressBlockId) ?? null;

  const handleBlockPress = (blockId: string, blockTitle: string) => {
    navigation.navigate('BlockDetail', { blockId, blockTitle });
  };

  const handleBlockLongPress = (blockId: string) => {
    Vibration.vibrate(50);
    setLongPressBlockId(blockId);
    setLongPressMenuVisible(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const openLongPressTitleEdit = () => {
    setLongPressMenuVisible(false);
    setLongPressTitleInput(longPressBlock?.goalTitle ?? '');
    setLongPressTitleEditing(true);
  };

  const saveLongPressTitle = () => {
    const trimmed = longPressTitleInput.trim();
    if (trimmed && longPressBlock) {
      if (longPressBlock.position === 4) {
        updateCoreGoal(trimmed);
      } else {
        updateSubGoal(longPressBlock.position, trimmed);
      }
    }
    setLongPressTitleEditing(false);
    setLongPressBlockId(null);
  };

  const openTitleEdit = () => {
    setTitleInput(currentProject.title);
    setEditingTitle(true);
  };

  const saveTitleEdit = () => {
    const trimmed = titleInput.trim();
    if (trimmed) updateProjectTitle(trimmed);
    setEditingTitle(false);
  };

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
        {/* 프로젝트 카드 */}
        <TouchableOpacity
          style={styles.projectCard}
          onPress={openTitleEdit}
          activeOpacity={0.8}
        >
          <View style={styles.projectTitleRow}>
            <Text style={styles.projectTitle} numberOfLines={1}>
              {currentProject.title}
            </Text>
            <Text style={styles.editHint}>✏️</Text>
          </View>
          <Text style={styles.progressLabel}>
            전체 진행률 · {completedTasks}/{allTasks.length}
          </Text>
          <ProgressBar progress={overallProgress} />
          <Text style={styles.progressPercent}>
            {Math.round(overallProgress * 100)}%
          </Text>
        </TouchableOpacity>

        {/* 3×3 블록 그리드 */}
        <View style={styles.gridContainer}>
          <BlockGrid
            blocks={currentProject.blocks}
            onBlockPress={handleBlockPress}
            onBlockLongPress={handleBlockLongPress}
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
            onPress={() => navigation.navigate('CreateProject')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonSecondaryText}>+ 새 프로젝트</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </Animated.View>

      {/* 롱프레스 ActionSheet */}
      <Modal
        visible={longPressMenuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLongPressMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setLongPressMenuVisible(false)}
        >
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle} numberOfLines={1}>
              {longPressBlock?.goalTitle || '블록 옵션'}
            </Text>

            <TouchableOpacity style={styles.sheetItem} onPress={openLongPressTitleEdit}>
              <Text style={styles.sheetItemText}>✏️  제목 편집</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                setLongPressMenuVisible(false);
                if (longPressBlock) {
                  navigation.navigate('BlockDetail', {
                    blockId: longPressBlock.id,
                    blockTitle: longPressBlock.goalTitle,
                  });
                }
              }}
            >
              <Text style={styles.sheetItemText}>📝  메모 작성</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => {
                setLongPressMenuVisible(false);
                setColorPickerVisible(true);
              }}
            >
              <Text style={styles.sheetItemText}>🎨  색상 변경</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sheetItem, styles.sheetCancelItem]}
              onPress={() => setLongPressMenuVisible(false)}
            >
              <Text style={styles.sheetCancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 색상 선택 모달 */}
      <Modal
        visible={colorPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setColorPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setColorPickerVisible(false)}
        >
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>🎨 색상 선택</Text>
            <ColorPicker
              selectedColor={longPressBlock?.color}
              onSelectColor={(color) => {
                if (longPressBlockId) {
                  updateBlockColor(longPressBlockId, color);
                }
                setColorPickerVisible(false);
                setLongPressBlockId(null);
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 롱프레스 제목 편집 모달 */}
      <Modal
        visible={longPressTitleEditing}
        transparent
        animationType="fade"
        onRequestClose={() => setLongPressTitleEditing(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>블록 제목 편집</Text>
            <TextInput
              style={styles.modalInput}
              value={longPressTitleInput}
              onChangeText={setLongPressTitleInput}
              autoFocus
              placeholder="제목을 입력하세요"
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={saveLongPressTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLongPressTitleEditing(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveLongPressTitle}
              >
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 프로젝트 제목 편집 모달 */}
      <Modal
        visible={editingTitle}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingTitle(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>프로젝트 이름 변경</Text>
            <TextInput
              style={styles.modalInput}
              value={titleInput}
              onChangeText={setTitleInput}
              autoFocus
              placeholder="프로젝트 이름을 입력하세요"
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={saveTitleEdit}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingTitle(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveTitleEdit}
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
    padding: Layout.screenPadding,
    paddingBottom: Spacing.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.light.textSecondary,
  },
  createButton: {
    backgroundColor: Colors.light.buttonPrimary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  createButtonText: {
    color: Colors.light.buttonText,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },

  // 프로젝트 카드
  projectCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  projectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  projectTitle: {
    flex: 1,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.light.text,
  },
  editHint: {
    fontSize: FontSize.sm,
    marginLeft: Spacing.xs,
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

  // 모달
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

  // 롱프레스 바텀시트
  sheetOverlay: {
    flex: 1,
    backgroundColor: Colors.light.overlay,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    ...Shadow.lg,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  sheetItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  sheetItemText: {
    fontSize: FontSize.md,
    color: Colors.light.text,
  },
  sheetCancelItem: {
    borderBottomWidth: 0,
    marginTop: Spacing.xs,
  },
  sheetCancelText: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
