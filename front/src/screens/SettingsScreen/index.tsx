import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useMandalartStore } from '../../store/mandalartStore';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/theme';

const APP_VERSION = '1.0.0';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen = ({ navigation }: Props) => {
  const resetProject = useMandalartStore((state) => state.resetProject);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ],
    );
  };

  const handleReset = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 데이터가 초기 상태로 돌아갑니다. 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '초기화',
          style: 'destructive',
          onPress: () => resetProject(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 섹션: 앱 정보 */}
        <Text style={styles.sectionHeader}>앱 정보</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>버전</Text>
            <Text style={styles.rowValue}>{APP_VERSION}</Text>
          </View>
        </View>

        {/* 섹션: 계정 */}
        <Text style={styles.sectionHeader}>계정</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.destructiveRow}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.destructiveText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 섹션: 데이터 관리 */}
        <Text style={styles.sectionHeader}>데이터 관리</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.destructiveRow}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.destructiveText}>데이터 초기화</Text>
          </TouchableOpacity>
          <Text style={styles.descriptionText}>
            모든 진행 상황이 초기 샘플 데이터로 돌아갑니다.
          </Text>
        </View>

        <Text style={styles.footerText}>MY MANDALATEU · v{APP_VERSION}</Text>
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
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  // 섹션 헤더
  sectionHeader: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },

  // 섹션 카드
  section: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },

  // 일반 행 (라벨 + 값)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  rowLabel: {
    fontSize: FontSize.md,
    color: Colors.light.text,
    fontWeight: FontWeight.regular,
  },
  rowValue: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
    fontWeight: FontWeight.regular,
  },

  // 파괴적 액션 행
  destructiveRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  destructiveText: {
    fontSize: FontSize.md,
    color: Colors.light.priorityHigh,
    fontWeight: FontWeight.medium,
  },
  descriptionText: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    lineHeight: 18,
  },

  // 하단 푸터
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.light.textDisabled,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
