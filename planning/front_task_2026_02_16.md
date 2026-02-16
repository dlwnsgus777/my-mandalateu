# 프론트엔드 작업 계획 (2026-02-16 기준 남은 작업)

> 작성일: 2026-02-16
> 기준: `front_task_2026_02_15.md` 체크리스트 + 실제 코드 확인
> 완료: Phase 2~7 전체 완료
> 미완성: Phase 8 (온보딩)
> 제외: Phase 1 다크 모드 (작업하지 않기로 결정)

---

## 코드 현황 요약

| Phase | 상태 | 비고 |
|-------|------|------|
| Phase 1 - 다크 모드 | ⛔ 제외 | 작업하지 않기로 결정 |
| Phase 2 - BlockDetailScreen 보완 | ✅ 완료 | |
| Phase 3 - 애니메이션 | ✅ 완료 | |
| Phase 4 - 제스처 | ✅ 완료 | |
| Phase 5 - 블록 색상 지정 | ✅ 완료 | |
| Phase 6 - Dashboard 고도화 | ✅ 완료 | |
| Phase 7 - SettingsScreen | ✅ 완료 | |
| Phase 8 - 온보딩 | ✅ 완료 | |

---

## Phase 7 - SettingsScreen ✅ 완료

### 7-1. 기본 UI 구성
- **파일**: `src/screens/SettingsScreen/index.tsx`
- 섹션 구분 리스트 스타일 (`ScrollView` + 섹션 헤더)

### 7-3. 앱 버전 표시
- **파일**: `src/screens/SettingsScreen/index.tsx`
- "앱 정보" 섹션에 버전 `1.0.0` 표시

### 7-4. 데이터 초기화
- **파일**: `src/screens/SettingsScreen/index.tsx`, `src/store/mandalartStore.ts`
- `resetProject` 액션 추가 (Mock 데이터로 복원)
- "데이터 초기화" 버튼 + `Alert.alert` 확인 다이얼로그

---

## Phase 8 - 온보딩 (우선순위: 낮음)

> **현재 상태**: `OnboardingScreen` 파일 없음, `isFirstLaunch` 플래그 없음, 라우팅 없음.

### 8-1. OnboardingScreen 구현

- **파일**: `src/screens/OnboardingScreen/index.tsx` **신규 생성**
- **작업**:
  - `FlatList` 수평 스크롤 + `pagingEnabled`로 슬라이드 구현
  - 하단 페이지 인디케이터 (동그라미 점)
  - 슬라이드 구성:
    - 슬라이드 1: 만다라트란? — 핵심 목표 1개 설명
    - 슬라이드 2: 세부 목표 8개 — 핵심 목표 주변 8칸 설명
    - 슬라이드 3: 실행 과제 64개 — 각 세부 목표별 8개 실행과제 설명
    - 슬라이드 4: "지금 시작하기!" — CTA 버튼
  - 마지막 슬라이드 "시작하기" 버튼 → `isFirstLaunch` = false 처리 후 Home으로 이동

### 8-2. isFirstLaunch 플래그 추가

- **파일**: `src/store/mandalartStore.ts`
- **작업**:
  - `MandalartState`에 `isFirstLaunch: boolean` 필드 추가 (초기값 `true`)
  - `setFirstLaunchDone()` 액션 추가

### 8-3. App.tsx 라우팅 처리

- **파일**: `src/navigation/RootNavigator.tsx`
- **작업**:
  - `isFirstLaunch` 값에 따라 초기 라우트 분기
    - `true` → `OnboardingScreen`
    - `false` → `HomeScreen`
  - `RootStackParamList`에 `Onboarding` 타입 추가 (`src/types/navigation.ts`)
  - `Stack.Navigator`에 `OnboardingScreen` 등록

---

## 남은 작업 TODO 체크리스트

### Phase 7 - SettingsScreen 구현

- [x] 설정 화면 기본 UI 구성 (섹션 리스트 스타일)
- [x] 앱 버전 정보 표시
- [x] 데이터 초기화 버튼 + 확인 Alert
- [x] `mandalartStore.ts`에 `resetProject` 액션 추가 및 연동

### Phase 8 - 온보딩

- [x] `src/types/navigation.ts`에 `Onboarding` 라우트 타입 추가
- [x] `src/screens/OnboardingScreen/index.tsx` 신규 생성
  - [x] 4페이지 수평 슬라이드 (`FlatList` + `pagingEnabled`)
  - [x] 하단 페이지 인디케이터 (점)
  - [x] 슬라이드 1: 만다라트란? (핵심 목표 설명)
  - [x] 슬라이드 2: 세부 목표 8개 설명
  - [x] 슬라이드 3: 실행 과제 64개 설명
  - [x] 슬라이드 4: "시작하기" CTA 버튼
- [x] `mandalartStore.ts`에 `isFirstLaunch` 필드 + `setFirstLaunchDone` 액션 추가
- [x] `RootNavigator.tsx`에 `OnboardingScreen` 등록
- [x] `RootNavigator.tsx`에서 `isFirstLaunch` 기반 초기 라우트 분기

---

## 신규 생성 파일 목록

```
front/src/
└── screens/
    └── OnboardingScreen/
        └── index.tsx             ← Phase 8
```

**수정 파일**: `mandalartStore.ts`, `RootNavigator.tsx`, `src/types/navigation.ts`
