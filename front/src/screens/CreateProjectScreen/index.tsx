import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useMandalartStore } from '../../store/mandalartStore';
import { Colors } from '../../constants/colors';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Shadow,
  Spacing,
} from '../../constants/theme';

type CreateProjectNavigationProp = StackNavigationProp<RootStackParamList, 'CreateProject'>;

export const CreateProjectScreen = () => {
  const navigation = useNavigation<CreateProjectNavigationProp>();
  const createProject = useMandalartStore((state) => state.createProject);

  const [title, setTitle] = useState('');
  const [coreGoal, setCoreGoal] = useState('');

  const canCreate = title.trim().length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    createProject(title.trim(), coreGoal.trim());
    // Home으로 돌아가기 (스택 초기화)
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 설명 */}
          <View style={styles.descCard}>
            <Text style={styles.descTitle}>만다라트란?</Text>
            <Text style={styles.descText}>
              하나의 핵심 목표를 중심으로 8개의 세부 목표를 세우고, 각 세부 목표마다 8개의 실행 과제를 만드는 목표 관리 기법입니다.
            </Text>
          </View>

          {/* 프로젝트 이름 */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              프로젝트 이름 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="예) 2026년 목표"
              maxLength={40}
              returnKeyType="next"
            />
          </View>

          {/* 핵심 목표 */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              핵심 목표{' '}
              <Text style={styles.optional}>(선택 · 나중에 입력 가능)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={coreGoal}
              onChangeText={setCoreGoal}
              placeholder="예) 드래프트 1순위, 연봉 1억, 건강한 몸 만들기"
              maxLength={50}
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
            <Text style={styles.fieldHint}>
              핵심 목표는 만다라트 중앙에 배치되며 나중에 수정할 수 있습니다.
            </Text>
          </View>

          {/* 만들기 버튼 */}
          <TouchableOpacity
            style={[styles.createButton, !canCreate && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={!canCreate}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>만들기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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

  // 설명 카드
  descCard: {
    backgroundColor: Colors.light.centerBlockBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  descTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },
  descText: {
    fontSize: FontSize.sm,
    color: Colors.light.text,
    lineHeight: 20,
  },

  // 필드
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.light.priorityHigh,
  },
  optional: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.light.textSecondary,
  },
  input: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.light.text,
    ...Shadow.sm,
  },
  fieldHint: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },

  // 버튼
  createButton: {
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  createButtonDisabled: {
    opacity: 0.4,
  },
  createButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.light.buttonText,
  },
  cancelButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
  },
});
