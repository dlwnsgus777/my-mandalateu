import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useMandalartStore } from '../../store/mandalartStore';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/theme';

const APP_VERSION = '1.0.0';

// TODO: 배포 시 실제 URL로 교체
const LEGAL_URLS = {
  termsOfService: 'https://my-mandalateu.com/terms',
  privacyPolicy: 'https://my-mandalateu.com/privacy',
} as const;

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen = ({ navigation }: Props) => {
  const resetProject = useMandalartStore((state) => state.resetProject);
  const logout = useAuthStore((state) => state.logout);
  const updateNickname = useAuthStore((state) => state.updateNickname);
  const user = useAuthStore((state) => state.user);

  const [isNicknameModalVisible, setIsNicknameModalVisible] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const avatarLetter = user?.nickname?.charAt(0).toUpperCase() ?? '?';

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            await logout();
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

  const handleNicknameChange = () => {
    setNicknameInput(user?.nickname ?? '');
    setIsNicknameModalVisible(true);
  };

  const handleNicknameSubmit = async () => {
    const trimmed = nicknameInput.trim();
    if (!trimmed) {
      Alert.alert('오류', '닉네임을 입력해주세요.');
      return;
    }
    if (trimmed.length > 50) {
      Alert.alert('오류', '닉네임은 50자 이하로 입력해주세요.');
      return;
    }
    setIsUpdating(true);
    try {
      await updateNickname(trimmed);
      setIsNicknameModalVisible(false);
    } catch {
      Alert.alert('오류', '닉네임 변경에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('오류', '링크를 열 수 없습니다.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴하기', style: 'destructive', onPress: () => Alert.alert('준비 중', '곧 제공될 예정입니다.') },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 닉네임 변경 모달 */}
      <Modal
        visible={isNicknameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsNicknameModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => !isUpdating && setIsNicknameModalVisible(false)}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>닉네임 변경</Text>
                <TextInput
                  style={styles.modalInput}
                  value={nicknameInput}
                  onChangeText={setNicknameInput}
                  placeholder="닉네임 입력"
                  placeholderTextColor={Colors.light.textDisabled}
                  maxLength={50}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleNicknameSubmit}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setIsNicknameModalVisible(false)}
                    disabled={isUpdating}
                  >
                    <Text style={styles.modalCancelText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalConfirmButton, isUpdating && styles.modalButtonDisabled]}
                    onPress={handleNicknameSubmit}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.modalConfirmText}>변경</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{avatarLetter}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileNickname}>{user?.nickname ?? '-'}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? '-'}</Text>
          </View>
          <View style={styles.googleBadge}>
            <Text style={styles.googleBadgeText}>Google</Text>
          </View>
        </View>

        {/* 섹션: ACCOUNT */}
        <Text style={styles.sectionHeader}>Account</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={handleNicknameChange} activeOpacity={0.7}>
            <Text style={styles.rowLabel}>닉네임 변경</Text>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>연결된 계정</Text>
            <Text style={styles.rowValue}>Google · {user?.email ?? '-'}</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={styles.destructiveText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 섹션: DATA */}
        <Text style={styles.sectionHeader}>Data</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={handleReset} activeOpacity={0.7}>
            <Text style={styles.destructiveText}>데이터 초기화</Text>
          </TouchableOpacity>
          <Text style={styles.descriptionText}>
            모든 진행 상황이 초기 샘플 데이터로 돌아갑니다.
          </Text>
        </View>

        {/* 섹션: INFO */}
        <Text style={styles.sectionHeader}>Info</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => handleOpenURL(LEGAL_URLS.termsOfService)}
            activeOpacity={0.7}
          >
            <Text style={styles.rowLabel}>이용약관</Text>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.row}
            onPress={() => handleOpenURL(LEGAL_URLS.privacyPolicy)}
            activeOpacity={0.7}
          >
            <Text style={styles.rowLabel}>개인정보처리방침</Text>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>버전</Text>
            <Text style={styles.rowValue}>{APP_VERSION}</Text>
          </View>
        </View>

        {/* 회원 탈퇴 */}
        <TouchableOpacity
          style={styles.deleteAccountButton}
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteAccountText}>회원 탈퇴</Text>
        </TouchableOpacity>

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

  // ─── 프로필 카드 ────────────────────────────────────────────────
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
    ...Shadow.sm,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  profileNickname: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.light.text,
  },
  profileEmail: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  googleBadge: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  googleBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    fontWeight: FontWeight.medium,
  },

  // ─── 섹션 헤더 ──────────────────────────────────────────────────
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

  // ─── 섹션 카드 ──────────────────────────────────────────────────
  section: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },

  // ─── 행 ─────────────────────────────────────────────────────────
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
    flex: 1,
  },
  rowValue: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    fontWeight: FontWeight.regular,
    flexShrink: 1,
    marginLeft: Spacing.sm,
    textAlign: 'right',
  },
  rowChevron: {
    fontSize: FontSize.xl,
    color: Colors.light.textDisabled,
    lineHeight: FontSize.xl,
  },

  // ─── 구분선 ─────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginLeft: Spacing.md,
  },

  // ─── 파괴적 액션 ─────────────────────────────────────────────────
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

  // ─── 회원 탈퇴 ──────────────────────────────────────────────────
  deleteAccountButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.xl,
  },
  deleteAccountText: {
    fontSize: FontSize.sm,
    color: Colors.light.textDisabled,
    fontWeight: FontWeight.regular,
  },

  // ─── 푸터 ───────────────────────────────────────────────────────
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.light.textDisabled,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // ─── 닉네임 변경 모달 ────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    ...Shadow.sm,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
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
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modalCancelText: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
    fontWeight: FontWeight.medium,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primary,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalConfirmText: {
    fontSize: FontSize.md,
    color: '#FFFFFF',
    fontWeight: FontWeight.medium,
  },
});
