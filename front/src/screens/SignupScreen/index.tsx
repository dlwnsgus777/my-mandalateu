import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/theme';

type SignupNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

// ─── 유효성 검사 ──────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (nickname: string, email: string, password: string): string => {
  if (!nickname.trim() || !email.trim() || !password.trim()) {
    return '모든 항목을 입력해주세요.';
  }
  if (nickname.trim().length < 2) {
    return '닉네임은 2자 이상이어야 합니다.';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return '올바른 이메일 형식을 입력해주세요.';
  }
  if (password.length < 8) {
    return '비밀번호는 8자 이상이어야 합니다.';
  }
  return '';
};

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export const SignupScreen = () => {
  const navigation = useNavigation<SignupNavigationProp>();
  const signup = useAuthStore((state) => state.signup);

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setErrorMessage('');

    const validationError = validate(nickname, email, password);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await signup(email.trim(), password, nickname.trim());
      navigation.navigate('Login');
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 409) {
        setErrorMessage('이미 사용 중인 이메일입니다.');
      } else if (status === 400) {
        setErrorMessage('입력 정보를 다시 확인해주세요.');
      } else {
        setErrorMessage('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 타이틀 */}
          <View style={styles.headerArea}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>만다라트를 시작하기 위한 계정을 만들어보세요.</Text>
          </View>

          {/* 입력 폼 */}
          <View style={styles.formArea}>
            {/* 닉네임 */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>닉네임</Text>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="2자 이상 입력하세요"
                placeholderTextColor={Colors.light.textDisabled}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                maxLength={50}
              />
            </View>

            {/* 이메일 */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>이메일</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                placeholderTextColor={Colors.light.textDisabled}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* 비밀번호 */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>비밀번호</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="8자 이상 입력하세요"
                placeholderTextColor={Colors.light.textDisabled}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSignup}
              />
              <Text style={styles.inputHint}>영문, 숫자 조합 8자 이상</Text>
            </View>

            {/* 에러 메시지 */}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* 회원가입 버튼 */}
            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.light.buttonText} />
              ) : (
                <Text style={styles.signupButtonText}>회원가입</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* 로그인 링크 */}
          <View style={styles.loginLinkArea}>
            <Text style={styles.loginLinkText}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
              <Text style={styles.loginLinkAction}>로그인</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },

  // 타이틀
  headerArea: {
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },

  // 입력 폼
  formArea: {
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  inputHint: {
    fontSize: FontSize.xs,
    color: Colors.light.textDisabled,
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },

  // 에러 메시지
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.light.priorityHigh,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },

  // 회원가입 버튼
  signupButton: {
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
    ...Shadow.sm,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.light.buttonText,
  },

  // 로그인 링크
  loginLinkArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
  },
  loginLinkAction: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.light.primary,
  },
});