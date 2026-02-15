# 프론트엔드 작업 계획 (API 연동 제외)

> 작성일: 2026-02-15
> 기준: `task_check.md` 미완성 항목 중 프론트 UI/UX 작업만 선별
> 제외: 백엔드 작업, API 연동, AsyncStorage 연동

---

## Phase 1 - 다크 모드 (우선순위: 높음)

> `colors.ts`에 light/dark 팔레트가 이미 정의되어 있어 연동만 필요

### 1-1. 테마 Provider 구성
- **파일**: `src/context/ThemeContext.tsx` 신규 생성
- **작업**:
  - `useColorScheme()` 훅으로 시스템 테마 감지
  - `ThemeContext` + `useTheme()` 커스텀 훅 작성
  - `App.tsx`에 `ThemeProvider` 래핑

### 1-2. 전체 화면 다크 모드 스타일 적용
- **파일**: `HomeScreen`, `BlockDetailScreen`, `DashboardScreen`, `SettingsScreen`, `CreateProjectScreen`
- **작업**: 각 `StyleSheet` 내 하드코딩된 색상을 `useTheme()` 기반 동적 색상으로 교체

### 1-3. 컴포넌트 다크 모드 적용
- **파일**: `BlockCard`, `BlockGrid`, `ProgressBar`
- **작업**: props 또는 context로 색상 주입

---

## Phase 2 - BlockDetailScreen 미완성 요소

### 2-1. 이전/다음 블록 네비게이션
- **파일**: `src/screens/BlockDetailScreen/index.tsx`
- **작업**:
  - 하단에 `[← 이전 블록] [다음 블록 →]` 버튼 추가
  - 중앙 블록(index 4) 제외한 8개 블록 간 순환 이동
  - 블록 이름 미리보기 텍스트 표시

### 2-2. 확장 섹션 (Expandable Sections)
- **파일**: `src/components/ExpandableSection/index.tsx` 신규 생성
- **작업**:
  - 토글 가능한 섹션 컴포넌트 (제목 탭 → 펼침/접힘)
  - Animated 높이 변화 (LayoutAnimation 또는 Reanimated)
- **적용 섹션**:
  - 📝 메모 및 세부사항 (멀티라인 TextInput)
  - 🔔 알림 설정 (시간 선택 UI, 토글 스위치)
  - 🔗 관련 링크 & 자료 (URL 입력 + 목록)

### 2-3. FAB (Floating Action Button)
- **파일**: `src/screens/BlockDetailScreen/index.tsx`
- **작업**:
  - 우하단 고정 `+` 버튼
  - 탭 시 빈 셀에 새 할 일 추가 모달 오픈 (이미 있는 edit 모달 재활용)

### 2-4. 컨텍스트 카드
- **파일**: `src/components/ContextCard/index.tsx` 신규 생성
- **작업**:
  - 현재 블록의 전체 구조 내 위치 표시 (예: "블록 2/9 - 좌측 상단")
  - 미니 3x3 썸네일로 현재 위치 하이라이트

---

## Phase 3 - 애니메이션

> 라이브러리: `react-native-reanimated` (이미 설치됨)

### 3-1. 화면 진입 애니메이션
- **파일**: `HomeScreen`, `BlockDetailScreen`, `DashboardScreen`
- **작업**: 화면 마운트 시 Fade In + Scale (0.95 → 1.0, 300ms easeOut)

### 3-2. 블록 탭 전환 효과
- **파일**: `src/components/BlockCard/index.tsx`, `HomeScreen`
- **작업**:
  - 블록 탭 시 해당 카드 Scale Up (1.0 → 1.05) 후 화면 전환
  - `SharedElement` 또는 `Animated.View` 활용

### 3-3. 블록 순차적 Fade In
- **파일**: `src/components/BlockGrid/index.tsx`
- **작업**: 블록 9개가 순서대로 딜레이를 두고 Fade In (delay: index * 50ms)

### 3-4. 체크박스 완료 애니메이션
- **파일**: `src/screens/BlockDetailScreen/index.tsx`
- **작업**:
  - 체크 완료 시 Scale + Bounce (spring 애니메이션)
  - 완료 셀 배경색 전환 애니메이션 (white → #E7F5E7)

### 3-5. 진행률 바 애니메이션
- **파일**: `src/components/ProgressBar/index.tsx`
- **작업**: 값 변경 시 width 부드럽게 전환 (withTiming 300ms)

---

## Phase 4 - 제스처

> 라이브러리: `react-native-gesture-handler` (이미 설치됨)

### 4-1. 블록 롱프레스 메뉴
- **파일**: `src/components/BlockCard/index.tsx`, `HomeScreen`
- **작업**:
  - 롱프레스 시 Bottom Sheet 또는 ActionSheet 표시
  - 메뉴 항목: 색상 변경, 제목 편집, 메모 작성
  - Haptic Feedback 연동

### 4-2. 셀 스와이프 액션
- **파일**: `src/screens/BlockDetailScreen/index.tsx`
- **작업**:
  - `Swipeable` 컴포넌트로 셀 감싸기
  - 좌측 스와이프 → 빨간 삭제 버튼 노출
  - 우측 스와이프 → 초록 완료 토글 버튼 노출

### 4-3. Pull to Refresh
- **파일**: `HomeScreen`, `DashboardScreen`
- **작업**:
  - `ScrollView`에 `RefreshControl` 추가
  - 새로고침 시 진행률 재계산 (mock 데이터 기준)

---

## Phase 5 - 블록 색상 지정

### 5-1. 스토어에 색상 상태 추가
- **파일**: `src/store/mandalartStore.ts`
- **작업**: `MandalartBlock`에 `color?: string` 필드 활용하여 `updateBlockColor` 액션 추가

### 5-2. 색상 선택 UI
- **파일**: `src/components/ColorPicker/index.tsx` 신규 생성
- **작업**:
  - 8색 팔레트 원형 버튼 (빨강/주황/노랑/초록/청록/파랑/보라/분홍)
  - 선택된 색상 테두리 강조
  - 롱프레스 메뉴(4-1)에서 호출

### 5-3. BlockCard에 색상 반영
- **파일**: `src/components/BlockCard/index.tsx`
- **작업**: `block.color`가 있으면 카드 테두리 및 헤더 영역에 액센트 컬러 적용

---

## Phase 6 - DashboardScreen 고도화

### 6-1. 주간 체크 현황 카드
- **파일**: `src/screens/DashboardScreen/index.tsx`
- **작업**:
  - 요일별 (Mo~Su) 완료 여부 시각화 (✅/⬜)
  - 이번 주 완료 TODO 개수, 지난 주 대비 증감률 표시

### 6-2. Streak (연속 달성) 카드
- **파일**: `src/screens/DashboardScreen/index.tsx`
- **작업**:
  - 연속으로 1개 이상 완료한 날짜 수 계산 (mock 기준)
  - 🔥 N일 표시, 최고 기록 별도 표시
  - `completedAt` 데이터 기반 계산 로직 작성

### 6-3. 다가오는 마감일 카드
- **파일**: `src/screens/DashboardScreen/index.tsx`
- **작업**:
  - `deadline`이 있는 셀 중 가까운 순으로 정렬
  - 오늘(🔴) / 내일(🟡) / 3일 이내(🟢) 색상 구분
  - 탭 시 해당 `BlockDetailScreen`으로 이동

### 6-4. 날짜 범위 토글
- **파일**: `src/screens/DashboardScreen/index.tsx`
- **작업**:
  - 상단에 주간/월간/전체 토글 탭 추가
  - 선택 범위에 따라 통계 필터링

---

## Phase 7 - SettingsScreen 구현

### 7-1. 기본 설정 항목 UI
- **파일**: `src/screens/SettingsScreen/index.tsx`
- **작업**:
  - 다크/라이트 모드 토글 스위치
  - 앱 버전 표시
  - 섹션 구분 리스트 스타일

### 7-2. 데이터 초기화
- **파일**: `src/screens/SettingsScreen/index.tsx`
- **작업**:
  - "데이터 초기화" 버튼 + 확인 Alert
  - 스토어 초기화 액션 연동

---

## Phase 8 - 온보딩

### 8-1. 온보딩 화면
- **파일**: `src/screens/OnboardingScreen/index.tsx` 신규 생성
- **작업**:
  - 3~4페이지 슬라이드 (FlatList + 페이지 인디케이터)
  - 만다라트 구조 설명 (핵심목표 → 세부목표 → 실행과제)
  - "시작하기" 버튼으로 메인 화면 진입

### 8-2. 최초 실행 감지
- **파일**: `src/store/mandalartStore.ts`, `App.tsx`
- **작업**:
  - `isFirstLaunch` 플래그로 온보딩 표시 여부 결정 (mock 상태로 관리)

---

## 작업 순서 요약

| 순서 | Phase | 예상 난이도 |
|------|-------|------------|
| 1 | Phase 1 - 다크 모드 | ★★☆ |
| 2 | Phase 2 - BlockDetailScreen 보완 | ★★☆ |
| 3 | Phase 3 - 애니메이션 | ★★★ |
| 4 | Phase 4 - 제스처 | ★★★ |
| 5 | Phase 5 - 블록 색상 지정 | ★★☆ |
| 6 | Phase 6 - Dashboard 고도화 | ★★☆ |
| 7 | Phase 7 - SettingsScreen | ★☆☆ |
| 8 | Phase 8 - 온보딩 | ★★☆ |

---

## 신규 파일 목록

```
src/
├── context/
│   └── ThemeContext.tsx          (Phase 1)
├── components/
│   ├── ExpandableSection/
│   │   └── index.tsx             (Phase 2)
│   ├── ContextCard/
│   │   └── index.tsx             (Phase 2)
│   └── ColorPicker/
│       └── index.tsx             (Phase 5)
└── screens/
    └── OnboardingScreen/
        └── index.tsx             (Phase 8)
```

---

**총 수정 파일**: 약 12개 기존 파일 + 4개 신규 파일

---

## 작업 TODO 체크리스트

### Phase 1 - 다크 모드

- [ ] `src/context/ThemeContext.tsx` 신규 생성
  - [ ] `useColorScheme()`으로 시스템 테마 감지
  - [ ] `ThemeContext` 및 `useTheme()` 커스텀 훅 작성
  - [ ] `App.tsx`에 `ThemeProvider` 래핑
- [ ] `HomeScreen` 색상 동적 적용
- [ ] `BlockDetailScreen` 색상 동적 적용
- [ ] `DashboardScreen` 색상 동적 적용
- [ ] `SettingsScreen` 색상 동적 적용
- [ ] `CreateProjectScreen` 색상 동적 적용
- [ ] `BlockCard` 컴포넌트 색상 동적 적용
- [ ] `BlockGrid` 컴포넌트 색상 동적 적용
- [ ] `ProgressBar` 컴포넌트 색상 동적 적용

### Phase 2 - BlockDetailScreen 보완

- [x] 이전/다음 블록 네비게이션 버튼 추가
  - [x] 하단 `[← 이전 블록] [다음 블록 →]` UI 구현
  - [x] 중앙 블록(index 4) 제외 처리
  - [x] 블록 이름 미리보기 텍스트 표시
- [x] `src/components/ExpandableSection/index.tsx` 신규 생성
  - [x] 탭으로 펼침/접힘 토글 동작
  - [x] LayoutAnimation 높이 전환 구현
- [x] BlockDetailScreen에 확장 섹션 3개 추가
  - [x] 📝 메모 및 세부사항 (멀티라인 TextInput + 저장 버튼)
  - [x] 🔔 알림 설정 (토글 스위치 + 시간 입력 UI)
  - [x] 🔗 관련 링크 & 자료 (URL 입력 + 목록 + 삭제)
- [x] FAB(`+` 버튼) 우하단 고정 추가
  - [x] 탭 시 빈 셀 추가 모달 오픈
- [x] `src/components/ContextCard/index.tsx` 신규 생성
  - [x] 현재 블록 위치 텍스트 표시 (N번째 영역 · 좌상단 등)
  - [x] 미니 3x3 썸네일 현재 위치 하이라이트

### Phase 3 - 애니메이션

- [x] `HomeScreen` 화면 진입 Fade In + Scale 애니메이션
- [x] `BlockDetailScreen` 화면 진입 Fade In + Scale 애니메이션
- [x] `DashboardScreen` 화면 진입 Fade In + Scale 애니메이션
- [x] `BlockCard` 탭 시 Scale Up (1.0 → 1.05) 효과
- [x] `BlockGrid` 블록 순차적 Fade In (delay: index * 50ms)
- [x] `BlockDetailScreen` 체크박스 완료 시 Scale + Bounce 애니메이션
- [x] 완료 셀 배경색 전환 애니메이션 (white → #E7F5E7)
- [x] `ProgressBar` 값 변경 시 width 부드러운 전환 (withTiming 300ms)

### Phase 4 - 제스처

- [x] `BlockCard` 롱프레스 Bottom Sheet / ActionSheet 구현
  - [x] 메뉴 항목: 색상 변경, 제목 편집, 메모 작성
  - [x] Haptic Feedback 연동 (Vibration.vibrate)
- [x] `BlockDetailScreen` 셀 스와이프 액션 구현
  - [x] `Swipeable`로 셀 감싸기
  - [x] 좌측 스와이프 → 빨간 삭제 버튼
  - [x] 우측 스와이프 → 초록 완료 토글 버튼
- [x] `HomeScreen` Pull to Refresh 추가
- [x] `DashboardScreen` Pull to Refresh 추가

### Phase 5 - 블록 색상 지정

- [x] `mandalartStore.ts`에 `updateBlockColor` 액션 추가
- [x] `src/components/ColorPicker/index.tsx` 신규 생성
  - [x] 8색 팔레트 원형 버튼 구현
  - [x] 선택된 색상 테두리 강조
- [x] `BlockCard`에 `block.color` 기반 액센트 컬러 반영
- [x] 롱프레스 메뉴(Phase 4)에 `ColorPicker` 연결

### Phase 6 - DashboardScreen 고도화

- [ ] 주간 체크 현황 카드 구현
  - [ ] 요일별 (Mo~Su) 완료 여부 시각화
  - [ ] 이번 주 완료 TODO 개수 표시
  - [ ] 지난 주 대비 증감률 표시
- [ ] Streak(연속 달성) 카드 구현
  - [ ] `completedAt` 기반 연속 날짜 계산 로직
  - [ ] 🔥 N일 현재 기록 표시
  - [ ] 최고 기록 별도 표시
- [ ] 다가오는 마감일 카드 구현
  - [ ] `deadline` 있는 셀 가까운 순 정렬
  - [ ] 오늘(🔴) / 내일(🟡) / 3일 이내(🟢) 색상 구분
  - [ ] 탭 시 해당 `BlockDetailScreen`으로 이동
- [ ] 날짜 범위 토글 탭 추가 (주간/월간/전체)
  - [ ] 선택 범위에 따라 통계 필터링 로직

### Phase 7 - SettingsScreen 구현

- [ ] 설정 화면 기본 UI 구성 (섹션 리스트 스타일)
- [ ] 다크/라이트 모드 토글 스위치
- [ ] 앱 버전 정보 표시
- [ ] 데이터 초기화 버튼 + 확인 Alert
- [ ] 스토어 초기화 액션 연동

### Phase 8 - 온보딩

- [ ] `src/screens/OnboardingScreen/index.tsx` 신규 생성
  - [ ] 3~4페이지 슬라이드 (FlatList + 페이지 인디케이터)
  - [ ] 슬라이드 1: 만다라트란? (핵심 목표)
  - [ ] 슬라이드 2: 세부 목표 8개 설명
  - [ ] 슬라이드 3: 실행 과제 64개 설명
  - [ ] "시작하기" 버튼으로 메인 화면 진입
- [ ] `isFirstLaunch` 플래그 스토어에 추가
- [ ] `App.tsx`에서 최초 실행 시 온보딩 라우팅 처리