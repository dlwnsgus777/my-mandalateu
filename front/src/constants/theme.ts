/**
 * 테마 시스템
 * 앱 전체에서 사용되는 스타일 상수
 */

import { Colors } from './colors';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const Animation = {
  durationShort: 200,
  durationMedium: 300,
  durationLong: 500,
};

// 테마 타입 정의
export type ThemeMode = 'light' | 'dark';

// 전체 테마 객체
export const Theme = {
  light: {
    colors: Colors.light,
    spacing: Spacing,
    borderRadius: BorderRadius,
    fontSize: FontSize,
    fontWeight: FontWeight,
    shadow: Shadow,
    animation: Animation,
  },
  dark: {
    colors: Colors.dark,
    spacing: Spacing,
    borderRadius: BorderRadius,
    fontSize: FontSize,
    fontWeight: FontWeight,
    shadow: Shadow,
    animation: Animation,
  },
};

// 레이아웃 상수
export const Layout = {
  // 3x3 그리드 관련
  gridGap: Spacing.sm,
  blockPadding: Spacing.md,

  // 최소 터치 영역 (접근성)
  minTouchableSize: 44,

  // 화면 여백
  screenPadding: Spacing.md,

  // 헤더 높이
  headerHeight: 60,

  // 하단 버튼 영역
  bottomButtonHeight: 56,
};

// 타이포그래피 스타일
export const Typography = {
  h1: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    lineHeight: 40,
  },
  h2: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    lineHeight: 32,
  },
  h3: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    lineHeight: 28,
  },
  body1: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.regular,
    lineHeight: 24,
  },
  body2: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
  },
  caption: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: 16,
  },
  button: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: 24,
  },
};
