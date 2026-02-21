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

type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setErrorMessage('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
          {/* 로고 / 타이틀 */}
          <View style={styles.headerArea}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>🎯</Text>
            </View>
            <Text style={styles.appName}>MY MANDALATEU</Text>
            <Text style={styles.appSubtitle}>목표를 향한 나만의 만다라트</Text>
          </View>

          {/* 입력 폼 */}
          <View style={styles.formArea}>
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
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={Colors.light.textDisabled}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            {/* 에러 메시지 */}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* 로그인 버튼 */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.light.buttonText} />
              ) : (
                <Text style={styles.loginButtonText}>로그인</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* 회원가입 링크 */}
          <View style={styles.signupLinkArea}>
            <Text style={styles.signupLinkText}>계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
              <Text style={styles.signupLinkAction}>회원가입</Text>
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

  // 로고 / 타이틀
  headerArea: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.light.centerBlockBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.light.primary,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  appSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
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

  // 에러 메시지
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.light.priorityHigh,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },

  // 로그인 버튼
  loginButton: {
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
    ...Shadow.sm,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.light.buttonText,
  },

  // 회원가입 링크
  signupLinkArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupLinkText: {
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
  },
  signupLinkAction: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.light.primary,
  },
});