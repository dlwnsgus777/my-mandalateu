/**
 * 색상 시스템
 * 라이트/다크 모드를 지원하는 색상 팔레트
 */

export const Colors = {
  // 라이트 모드
  light: {
    // 기본 색상
    primary: '#2196F3',        // 파란색 (중앙 블록 강조)
    secondary: '#4CAF50',      // 초록색
    accent: '#FF9800',         // 오렌지색

    // 배경 색상
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    cardBackground: '#FFFFFF',

    // 중앙 블록 색상
    centerBlockBackground: '#E3F2FD',
    centerBlockBorder: '#2196F3',

    // 텍스트 색상
    text: '#212121',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',

    // 진행률 색상 (빨강 → 노랑 → 초록)
    progressLow: '#F44336',    // 0-33%
    progressMid: '#FFC107',    // 34-66%
    progressHigh: '#4CAF50',   // 67-100%

    // 우선순위 색상
    priorityHigh: '#F44336',
    priorityMedium: '#FFC107',
    priorityLow: '#4CAF50',

    // 상태 색상
    completed: '#4CAF50',
    pending: '#FFC107',
    overdue: '#F44336',

    // UI 요소
    border: '#E0E0E0',
    divider: '#EEEEEE',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // 버튼 색상
    buttonPrimary: '#2196F3',
    buttonSecondary: '#E0E0E0',
    buttonText: '#FFFFFF',
    buttonTextSecondary: '#212121',
  },

  // 다크 모드
  dark: {
    // 기본 색상
    primary: '#64B5F6',
    secondary: '#81C784',
    accent: '#FFB74D',

    // 배경 색상
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    cardBackground: '#2C2C2C',

    // 중앙 블록 색상
    centerBlockBackground: '#1A237E',
    centerBlockBorder: '#64B5F6',

    // 텍스트 색상
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textDisabled: '#666666',

    // 진행률 색상
    progressLow: '#EF5350',
    progressMid: '#FFD54F',
    progressHigh: '#66BB6A',

    // 우선순위 색상
    priorityHigh: '#EF5350',
    priorityMedium: '#FFD54F',
    priorityLow: '#66BB6A',

    // 상태 색상
    completed: '#66BB6A',
    pending: '#FFD54F',
    overdue: '#EF5350',

    // UI 요소
    border: '#3C3C3C',
    divider: '#2C2C2C',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',

    // 버튼 색상
    buttonPrimary: '#64B5F6',
    buttonSecondary: '#3C3C3C',
    buttonText: '#000000',
    buttonTextSecondary: '#FFFFFF',
  },
};

// 블록 색상 옵션 (사용자 지정 가능)
export const BlockColors = [
  '#2196F3', // 파란색
  '#4CAF50', // 초록색
  '#FF9800', // 오렌지색
  '#9C27B0', // 보라색
  '#F44336', // 빨간색
  '#00BCD4', // 청록색
  '#FFEB3B', // 노란색
  '#795548', // 갈색
];

// 그라데이션 색상
export const Gradients = {
  primary: ['#2196F3', '#1976D2'],
  success: ['#4CAF50', '#388E3C'],
  warning: ['#FF9800', '#F57C00'],
  danger: ['#F44336', '#D32F2F'],
};
