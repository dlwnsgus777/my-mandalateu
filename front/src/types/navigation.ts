/**
 * 네비게이션 타입 정의
 * React Navigation의 타입 안전성을 위한 파라미터 타입
 */

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  BlockDetail: {
    blockId: string;
    blockTitle: string;
  };
  Dashboard: undefined;
  Settings: undefined;
  CreateProject: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
