# My Mandalateu - Product Requirements Document (PRD)

## 문서 정보
- **작성일**: 2026-02-12
- **버전**: 1.0
- **디자인 기반**: 디자인 시안 1 (3x3 블록 그리드 메인 화면)
- **상태**: 구현 준비 단계

---

## 📋 목차
1. [제품 개요](#제품-개요)
2. [핵심 기능 명세](#핵심-기능-명세)
3. [데이터 구조](#데이터-구조)
4. [화면 구성](#화면-구성)
5. [기술 스택](#기술-스택)
6. [구현 계획](#구현-계획)
7. [체크리스트](#체크리스트)

---

## 제품 개요

### 프로젝트명
**My Mandalateu** - 만다라트 기반 TODO 관리 애플리케이션

### 목적
만다라트(Mandalart) 기법을 활용하여 사용자가 목표를 체계적으로 설정하고 실행 과제를 관리할 수 있는 모바일 앱

### 핵심 가치
- **구조화된 목표 설정**: 중심 목표 → 8개 세부 목표 → 64개 실행 과제
- **직관적인 시각화**: 3x3 그리드로 한눈에 파악 가능
- **진행 상황 추적**: 실시간 진행률 및 통계 제공
- **동기부여**: 완료 체크, Streak 등 게임화 요소

### 타겟 사용자
- 체계적인 목표 관리를 원하는 직장인
- 자기계발에 관심 있는 학생
- 장기 목표를 단계적으로 달성하고 싶은 모든 사람

---

## 핵심 기능 명세

### 1. 메인 홈 화면 (3x3 블록 그리드)

#### 기능 개요
- 9개의 세부 목표 블록을 3x3 그리드로 표시
- 각 블록의 진행률을 시각적으로 표현
- 중앙 블록은 핵심 목표를 강조

#### 세부 기능
- **프로젝트 카드**
  - 프로젝트 제목 (편집 가능)
  - 전체 진행률 (72개 실행 과제 기준)
  - 생성일 표시

- **블록 카드 (9개)**
  - 세부 목표 제목 (2-3줄, 편집 가능)
  - 진행률 바 (8개 실행 과제 중 완료 개수)
  - 완료 개수 텍스트 (예: 6/8 완료)
  - 미니 인디케이터 (8개 점으로 시각화)
  - 블록별 색상 지정 기능 (선택사항)

- **중앙 블록 (핵심 목표)**
  - 🎯 아이콘 표시
  - 강조 테두리 (2px, 파란색)
  - 다른 배경색 (라이트: #E3F2FD)
  - 탭 시 핵심 목표 설명 모달

- **하단 버튼**
  - 📊 통계 보기: 대시보드로 이동
  - + 새 프로젝트: 프로젝트 생성 플로우

#### 인터랙션
- **블록 탭**: 해당 블록의 3x3 세부 만다라트로 이동 (Zoom In 애니메이션)
- **블록 롱프레스**: 빠른 메뉴 (색상 변경, 제목 편집, 메모)
- **좌우 스와이프**: 다른 프로젝트로 전환
- **Pull to Refresh**: 데이터 새로고침

---

### 2. 블록 상세 화면 (3x3 세부 만다라트)

#### 기능 개요
- 선택한 블록의 8개 실행 과제를 3x3 그리드로 표시
- 중앙은 세부 목표 제목
- 각 실행 과제의 상세 정보 및 완료 관리

#### 세부 기능
- **Navigation Header**
  - 뒤로가기 버튼
  - 세부 목표 제목 (편집 가능)
  - 완료 현황 (8개 중 N개 완료)
  - 메뉴 버튼 (우측)

- **진행률 카드**
  - 시각적 프로그레스 바
  - 퍼센트 표시
  - 애니메이션 효과

- **3x3 TODO 그리드**
  - 중앙 셀: 세부 목표 제목 + 🎯 아이콘
  - 주변 8개 셀: 실행 과제
    - 체크박스 (완료/미완료)
    - 과제 제목 (2-3줄)
    - 마감일 배지 (선택사항)
    - 우선순위 표시 (🔴 높음, 🟡 중간, 🟢 낮음)

- **블록 간 네비게이션**
  - ⬅️ 이전 블록 / 다음 블록 ➡️
  - 좌우 스와이프로 블록 전환

- **확장 섹션**
  - 📝 메모 및 세부사항
  - 🔔 알림 설정
  - 🔗 관련 링크 & 자료

- **플로팅 액션 버튼 (FAB)**
  - + 새 할 일 추가

#### 인터랙션
- **체크박스 탭**: 즉시 완료/미완료 토글 + 애니메이션
- **셀 탭**: TODO 상세 모달 (제목, 설명, 마감일, 우선순위 편집)
- **셀 롱프레스**: 빠른 액션 (삭제, 이동, 복제)
- **셀 좌측 스와이프**: 삭제
- **셀 우측 스와이프**: 완료 토글
- **Pull to Refresh**: 새로고침

---

### 3. 대시보드 / 통계 화면

#### 기능 개요
- 전체 만다라트 프로젝트의 진행 상황 시각화
- 동기부여 및 인사이트 제공

#### 세부 기능
- **주간 요약 카드**
  - 이번 주 완료 TODO 개수
  - 지난 주 대비 증감률
  - 요일별 체크 현황

- **목표별 진행률 차트**
  - 8개 세부 목표의 가로 막대 그래프
  - 진행률 기반 색상 (빨강 → 노랑 → 초록)
  - 탭하여 해당 블록으로 이동

- **연속 달성 기록 (Streak)**
  - 🔥 연속 완료 일수
  - 최고 기록 표시

- **다가오는 마감일**
  - 마감일 임박 TODO 목록
  - 우선순위별 색상
  - 탭하여 해당 TODO로 이동

- **월간 성과**
  - 완료한 TODO 개수
  - 가장 활발한 목표 영역
  - 전체 달성률

---

### 4. 셀 상세 모달

#### 기능 개요
- 개별 실행 과제의 상세 정보 편집

#### 세부 기능
- 제목 입력 (필수)
- 설명 입력 (선택)
- 마감일 설정 (날짜 피커)
- 우선순위 선택 (높음/중간/낮음)
- 태그 추가
- 완료 체크박스
- 저장 / 취소 버튼

---

### 5. 프로젝트 생성 플로우

#### 기능 개요
- 새로운 만다라트 프로젝트 생성 가이드

#### 단계별 흐름
1. **프로젝트 제목 입력**
2. **핵심 목표 입력** (중앙 블록 중앙)
3. **8개 세부 목표 입력** (중앙 블록 주변)
4. **각 세부 목표별 8개 실행 과제 입력** (선택사항)
5. **프로젝트 생성 완료**

#### 부가 기능
- 템플릿 제공 (건강, 커리어, 학업 등)
- 예시 프로젝트 보기
- 단계별 가이드 메시지

---

### 6. 설정 화면

#### 기능 개요
- 앱 설정 및 사용자 환경 설정

#### 세부 기능
- **테마 설정**
  - 라이트 모드 / 다크 모드 / 시스템 설정

- **알림 설정**
  - 푸시 알림 ON/OFF
  - 알림 시간 설정

- **데이터 관리**
  - 백업 / 복원
  - 데이터 초기화

- **앱 정보**
  - 버전 정보
  - 개발자 정보
  - 오픈소스 라이선스

---

## 데이터 구조

### TypeScript 타입 정의

```typescript
// 만다라트 프로젝트
interface MandalartProject {
  id: string;                    // 고유 ID (UUID)
  title: string;                 // 프로젝트 제목
  coreGoal: string;              // 핵심 목표 (중앙 블록 중앙 셀)
  createdAt: Date;               // 생성일
  updatedAt: Date;               // 수정일
  blocks: MandalartBlock[];      // 9개 블록
}

// 블록 (3x3 구조)
interface MandalartBlock {
  id: string;                    // 블록 ID
  position: number;              // 위치 (0-8, 4=중앙)
  goalTitle: string;             // 세부 목표 제목
  color?: string;                // 블록 색상 (선택)
  notes?: string;                // 메모
  cells: MandalartCell[];        // 9개 셀 (중앙 포함)
}

// 셀 (실행 과제)
interface MandalartCell {
  id: string;                    // 셀 ID
  position: number;              // 블록 내 위치 (0-8)
  isCenter: boolean;             // 중앙 셀 여부
  title: string;                 // 과제 제목
  description?: string;          // 설명
  completed: boolean;            // 완료 여부
  deadline?: Date;               // 마감일
  priority?: 'high' | 'medium' | 'low'; // 우선순위
  tags?: string[];               // 태그
  createdAt: Date;
  completedAt?: Date;            // 완료 시간
}

// 통계 데이터
interface Statistics {
  weeklyCompleted: number;       // 주간 완료 개수
  weeklyGrowth: number;          // 지난 주 대비 증감률
  currentStreak: number;         // 현재 연속 기록
  bestStreak: number;            // 최고 연속 기록
  monthlyCompleted: number;      // 월간 완료 개수
  goalProgress: {                // 목표별 진행률
    goalTitle: string;
    completedCount: number;
    totalCount: number;
  }[];
}
```

### 데이터 관계

```
MandalartProject (1)
  └─ MandalartBlock (9)
       └─ MandalartCell (9)
          = 총 81개 셀
          = 유의미한 항목: 73개
            (1 핵심 목표 + 8 세부 목표 + 64 실행 과제)
```

### 로컬 저장소 구조

```
AsyncStorage Keys:
- projects: MandalartProject[]        // 모든 프로젝트 목록
- activeProjectId: string             // 현재 활성 프로젝트 ID
- settings: AppSettings               // 앱 설정
- statistics: Statistics              // 통계 데이터
```

---

## 화면 구성

### 화면 목록

| 화면명 | 라우트명 | 설명 |
|-------|---------|------|
| 메인 홈 | `/home` | 3x3 블록 그리드 메인 화면 |
| 블록 상세 | `/block/:id` | 3x3 세부 만다라트 화면 |
| 대시보드 | `/dashboard` | 통계 및 진행 현황 |
| 프로젝트 생성 | `/create` | 새 프로젝트 생성 플로우 |
| 설정 | `/settings` | 앱 설정 화면 |

### 네비게이션 구조

```
Stack Navigator
├─ Home (메인 홈)
│   ├─ 블록 탭 → Block Detail
│   ├─ 통계 보기 → Dashboard
│   └─ 새 프로젝트 → Create Project
├─ Block Detail (블록 상세)
│   ├─ 셀 탭 → Cell Detail Modal
│   └─ 뒤로가기 → Home
├─ Dashboard (대시보드)
│   └─ 차트 탭 → Block Detail
├─ Create Project (프로젝트 생성)
│   └─ 완료 → Home
└─ Settings (설정)
```

### 모달 목록

- **셀 상세 모달**: 실행 과제 편집
- **핵심 목표 모달**: 핵심 목표 설명 및 편집
- **빠른 메뉴 모달**: 블록/셀 빠른 액션
- **삭제 확인 모달**: 삭제 확인 다이얼로그

---

## 기술 스택

### 프론트엔드
- **React Native**: 0.74.x (최신 안정 버전)
- **Expo**: SDK 51.x
- **TypeScript**: 5.x

### 상태 관리
- **Zustand**: 3.x (가벼운 상태 관리)

### 네비게이션
- **React Navigation**: 6.x
  - Stack Navigator
  - Bottom Tabs (선택사항)

### 데이터 저장
- **AsyncStorage**: @react-native-async-storage/async-storage
- **UUID**: react-native-uuid (ID 생성)

### UI 라이브러리
- **React Native Paper**: 5.x (Material Design)
- 또는 커스텀 컴포넌트

### 애니메이션
- **React Native Reanimated**: 3.x
- **React Native Animatable**: 간단한 애니메이션

### 제스처
- **React Native Gesture Handler**: 2.x

### 차트
- **React Native Chart Kit**: 6.x
- 또는 **Victory Native**

### 기타
- **Date-fns**: 날짜 처리
- **React Native Linear Gradient**: 그라데이션
- **React Native Haptic Feedback**: 진동 피드백
- **React Native Vector Icons**: 아이콘
- **React Native Swipeable**: 스와이프 제스처

---

## 구현 계획

### Phase 1: 프로젝트 설정 및 기본 구조 (1-2일)

#### 작업 내용
1. **Expo 프로젝트 초기화**
   ```bash
   npx create-expo-app my-mandalateu --template
   cd my-mandalateu
   npm install
   ```

2. **TypeScript 설정**
   - tsconfig.json 설정
   - 타입 정의 파일 생성

3. **폴더 구조 생성**
   ```
   src/
   ├── components/
   │   ├── BlockCard/
   │   ├── BlockGrid/
   │   ├── ProgressBar/
   │   └── common/
   ├── screens/
   │   ├── HomeScreen/
   │   ├── BlockDetailScreen/
   │   ├── DashboardScreen/
   │   └── SettingsScreen/
   ├── store/
   │   └── useMandalartStore.ts
   ├── types/
   │   └── mandalart.types.ts
   ├── utils/
   │   ├── storage.ts
   │   └── helpers.ts
   └── constants/
       ├── colors.ts
       └── theme.ts
   ```

4. **패키지 설치**
   ```bash
   # 네비게이션
   npm install @react-navigation/native @react-navigation/stack
   npm install react-native-screens react-native-safe-area-context

   # 상태 관리
   npm install zustand

   # 저장소
   npm install @react-native-async-storage/async-storage
   npm install react-native-uuid

   # UI
   npm install react-native-paper
   npm install react-native-vector-icons

   # 애니메이션 & 제스처
   npm install react-native-reanimated
   npm install react-native-gesture-handler

   # 유틸리티
   npm install date-fns
   ```

5. **테마 및 색상 시스템 설정**
   - constants/colors.ts
   - constants/theme.ts
   - 라이트/다크 모드 기본 설정

---

### Phase 2: 데이터 모델 및 상태 관리 (1-2일)

#### 작업 내용
1. **TypeScript 타입 정의**
   - types/mandalart.types.ts 작성
   - MandalartProject, MandalartBlock, MandalartCell 인터페이스

2. **Zustand Store 설정**
   - store/useMandalartStore.ts
   - 프로젝트 CRUD 액션
   - 블록/셀 CRUD 액션
   - 완료 상태 토글 액션

3. **AsyncStorage 유틸리티**
   - utils/storage.ts
   - 프로젝트 저장/로드
   - 설정 저장/로드

4. **더미 데이터 생성**
   - 개발/테스트용 샘플 프로젝트
   - utils/mockData.ts

---

### Phase 3: 메인 홈 화면 구현 (2-3일)

#### 작업 내용
1. **HomeScreen 컴포넌트**
   - screens/HomeScreen/index.tsx
   - 기본 레이아웃 구성

2. **ProjectCard 컴포넌트**
   - components/ProjectCard/index.tsx
   - 프로젝트 제목, 진행률 표시
   - 제목 편집 기능

3. **BlockGrid 컴포넌트**
   - components/BlockGrid/index.tsx
   - 3x3 그리드 레이아웃
   - Flexbox를 활용한 반응형 그리드

4. **BlockCard 컴포넌트**
   - components/BlockCard/index.tsx
   - 세부 목표 제목
   - 진행률 바
   - 완료 개수 텍스트
   - 미니 인디케이터
   - 중앙 블록 스타일링

5. **ProgressBar 컴포넌트**
   - components/ProgressBar/index.tsx
   - 애니메이션 프로그레스 바
   - 진행률 기반 색상 변경

6. **인터랙션 구현**
   - 블록 탭 → 네비게이션
   - 블록 롱프레스 → 빠른 메뉴
   - 중앙 블록 특수 처리

7. **애니메이션 추가**
   - 화면 진입 Fade In
   - 블록 순차 애니메이션

---

### Phase 4: 블록 상세 화면 구현 (2-3일)

#### 작업 내용
1. **BlockDetailScreen 컴포넌트**
   - screens/BlockDetailScreen/index.tsx
   - Navigation Header
   - 진행률 카드

2. **BlockTodoGrid 컴포넌트**
   - components/BlockTodoGrid/index.tsx
   - 3x3 TODO 그리드
   - 중앙 셀 특수 처리

3. **TodoCell 컴포넌트**
   - components/TodoCell/index.tsx
   - 체크박스
   - 제목, 마감일, 우선순위 표시
   - 완료/미완료 스타일

4. **BlockNavigation 컴포넌트**
   - components/BlockNavigation/index.tsx
   - 이전/다음 블록 버튼
   - 블록 간 스와이프 제스처

5. **셀 상세 모달**
   - components/CellDetailModal/index.tsx
   - 제목, 설명, 마감일, 우선순위 편집
   - 저장/취소 버튼

6. **인터랙션 구현**
   - 체크박스 탭 → 완료 토글
   - 셀 탭 → 상세 모달
   - 셀 스와이프 → 삭제/완료
   - 셀 롱프레스 → 빠른 메뉴

7. **확장 섹션**
   - ExpandableSection 컴포넌트
   - 메모, 알림 설정, 링크

---

### Phase 5: 대시보드 화면 구현 (2일)

#### 작업 내용
1. **DashboardScreen 컴포넌트**
   - screens/DashboardScreen/index.tsx
   - ScrollView 레이아웃

2. **통계 카드 컴포넌트**
   - WeeklySummary
   - ProgressChart
   - StreakCounter
   - UpcomingDeadlines
   - MonthlyAchievement

3. **차트 구현**
   - React Native Chart Kit 또는 Victory Native
   - 가로 막대 그래프
   - 진행률 기반 색상

4. **통계 계산 로직**
   - utils/statistics.ts
   - 주간/월간 완료 개수
   - Streak 계산
   - 목표별 진행률

---

### Phase 6: 프로젝트 생성 플로우 (1-2일)

#### 작업 내용
1. **CreateProjectScreen 컴포넌트**
   - screens/CreateProjectScreen/index.tsx
   - 단계별 플로우 (Wizard)

2. **단계별 입력 화면**
   - Step 1: 프로젝트 제목
   - Step 2: 핵심 목표
   - Step 3: 8개 세부 목표
   - Step 4: 실행 과제 (선택)

3. **템플릿 기능**
   - 미리 정의된 템플릿 제공
   - 건강, 커리어, 학업 등

4. **프로젝트 생성 액션**
   - Store에 프로젝트 추가
   - AsyncStorage 저장
   - 메인 화면으로 이동

---

### Phase 7: 설정 및 부가 기능 (1-2일)

#### 작업 내용
1. **SettingsScreen 컴포넌트**
   - screens/SettingsScreen/index.tsx
   - 테마 설정
   - 알림 설정
   - 데이터 관리

2. **다크 모드 구현**
   - React Native Paper의 Theme Provider
   - 시스템 설정 연동

3. **백업/복원 기능**
   - JSON 파일로 내보내기
   - JSON 파일에서 가져오기

4. **알림 기능 (선택)**
   - expo-notifications
   - 마감일 알림 스케줄링

---

### Phase 8: 최적화 및 테스트 (1-2일)

#### 작업 내용
1. **성능 최적화**
   - React.memo, useMemo, useCallback 적용
   - FlatList 최적화 (필요 시)
   - 불필요한 리렌더링 제거

2. **에러 처리**
   - Try-catch 블록 추가
   - 에러 바운더리 설정
   - 사용자 친화적 에러 메시지

3. **테스트**
   - 주요 플로우 수동 테스트
   - 다양한 화면 크기 테스트
   - 라이트/다크 모드 테스트

4. **코드 정리**
   - 불필요한 주석 제거
   - 코드 포맷팅 (Prettier)
   - Linting (ESLint)

---

### Phase 9: 배포 준비 (1일)

#### 작업 내용
1. **앱 아이콘 및 스플래시 스크린**
   - app.json 설정
   - 아이콘 이미지 생성

2. **앱 메타데이터**
   - 앱 이름, 설명, 버전
   - Privacy Policy, Terms of Service

3. **빌드 및 배포**
   - EAS Build 설정
   - iOS/Android 빌드
   - 테스트 배포 (TestFlight, Google Play Beta)

---

## 체크리스트

### Phase 1: 프로젝트 설정 ✅
- [x] Expo 프로젝트 초기화
- [x] TypeScript 설정 완료
- [x] 폴더 구조 생성
- [x] 필수 패키지 설치
  - [x] React Navigation
  - [x] Zustand
  - [x] AsyncStorage
  - [x] React Native Paper
  - [x] 애니메이션 & 제스처 라이브러리
- [x] 테마 및 색상 시스템 설정
- [x] 기본 네비게이션 구조 설정

### Phase 2: 데이터 모델 ✅
- [ ] TypeScript 타입 정의 작성
  - [ ] MandalartProject
  - [ ] MandalartBlock
  - [ ] MandalartCell
  - [ ] Statistics
- [ ] Zustand Store 구현
  - [ ] 프로젝트 CRUD
  - [ ] 블록 CRUD
  - [ ] 셀 CRUD
  - [ ] 완료 상태 토글
- [ ] AsyncStorage 유틸리티 작성
- [ ] 더미 데이터 생성

### Phase 3: 메인 홈 화면 ✅
- [ ] HomeScreen 컴포넌트 구현
- [ ] ProjectCard 컴포넌트
  - [ ] 제목 표시
  - [ ] 진행률 표시
  - [ ] 제목 편집 기능
- [ ] BlockGrid 컴포넌트
  - [ ] 3x3 그리드 레이아웃
  - [ ] 반응형 크기 조정
- [ ] BlockCard 컴포넌트
  - [ ] 세부 목표 제목
  - [ ] 진행률 바
  - [ ] 완료 개수
  - [ ] 미니 인디케이터
  - [ ] 중앙 블록 스타일링
- [ ] ProgressBar 컴포넌트
  - [ ] 애니메이션 효과
  - [ ] 진행률 기반 색상
- [ ] 인터랙션 구현
  - [ ] 블록 탭 → 상세 화면 이동
  - [ ] 블록 롱프레스 → 빠른 메뉴
  - [ ] 중앙 블록 탭 → 핵심 목표 모달
- [ ] 애니메이션 추가
  - [ ] 화면 진입 Fade In
  - [ ] 블록 순차 애니메이션

### Phase 4: 블록 상세 화면 ✅
- [ ] BlockDetailScreen 컴포넌트
  - [ ] Navigation Header
  - [ ] 진행률 카드
- [ ] BlockTodoGrid 컴포넌트
  - [ ] 3x3 그리드 레이아웃
  - [ ] 중앙 셀 특수 처리
- [ ] TodoCell 컴포넌트
  - [ ] 체크박스
  - [ ] 제목 표시
  - [ ] 마감일 배지
  - [ ] 우선순위 표시
  - [ ] 완료/미완료 스타일
- [ ] BlockNavigation 컴포넌트
  - [ ] 이전/다음 버튼
  - [ ] 스와이프 제스처
- [ ] CellDetailModal 컴포넌트
  - [ ] 제목 편집
  - [ ] 설명 편집
  - [ ] 마감일 설정
  - [ ] 우선순위 선택
  - [ ] 태그 추가
- [ ] 인터랙션 구현
  - [ ] 체크박스 토글
  - [ ] 셀 탭 → 상세 모달
  - [ ] 셀 스와이프 (삭제/완료)
  - [ ] 셀 롱프레스 → 빠른 메뉴
- [ ] 확장 섹션
  - [ ] 메모 섹션
  - [ ] 알림 설정 섹션
  - [ ] 링크 섹션

### Phase 5: 대시보드 화면 ✅
- [ ] DashboardScreen 컴포넌트
- [ ] 통계 카드 구현
  - [ ] WeeklySummary
  - [ ] ProgressChart
  - [ ] StreakCounter
  - [ ] UpcomingDeadlines
  - [ ] MonthlyAchievement
- [ ] 차트 라이브러리 통합
- [ ] 통계 계산 로직
  - [ ] 주간 완료 개수
  - [ ] 월간 완료 개수
  - [ ] Streak 계산
  - [ ] 목표별 진행률
- [ ] 애니메이션
  - [ ] 카드 순차 Fade In
  - [ ] Pull to Refresh

### Phase 6: 프로젝트 생성 플로우 ✅
- [ ] CreateProjectScreen 컴포넌트
- [ ] 단계별 입력 화면
  - [ ] Step 1: 프로젝트 제목
  - [ ] Step 2: 핵심 목표
  - [ ] Step 3: 8개 세부 목표
  - [ ] Step 4: 실행 과제 (선택)
- [ ] 진행 상태 표시 (Step Indicator)
- [ ] 템플릿 기능
  - [ ] 템플릿 목록
  - [ ] 템플릿 적용
- [ ] 프로젝트 생성 액션
  - [ ] Store 업데이트
  - [ ] AsyncStorage 저장
  - [ ] 메인 화면 이동

### Phase 7: 설정 및 부가 기능 ✅
- [ ] SettingsScreen 컴포넌트
- [ ] 테마 설정
  - [ ] 라이트/다크/시스템 모드
  - [ ] Theme Provider 연동
- [ ] 알림 설정
  - [ ] 푸시 알림 ON/OFF
  - [ ] 알림 시간 설정
- [ ] 데이터 관리
  - [ ] 백업 (JSON 내보내기)
  - [ ] 복원 (JSON 가져오기)
  - [ ] 데이터 초기화
- [ ] 앱 정보
  - [ ] 버전 정보
  - [ ] 개발자 정보
  - [ ] 라이선스

### Phase 8: 최적화 및 테스트 ✅
- [ ] 성능 최적화
  - [ ] React.memo 적용
  - [ ] useMemo, useCallback 적용
  - [ ] 불필요한 리렌더링 제거
- [ ] 에러 처리
  - [ ] Try-catch 추가
  - [ ] 에러 바운더리
  - [ ] 사용자 친화적 에러 메시지
- [ ] 테스트
  - [ ] 메인 플로우 테스트
  - [ ] 다양한 화면 크기 테스트
  - [ ] 라이트/다크 모드 테스트
  - [ ] iOS/Android 테스트
- [ ] 코드 정리
  - [ ] 불필요한 주석 제거
  - [ ] Prettier 포맷팅
  - [ ] ESLint 검사

### Phase 9: 배포 준비 ✅
- [ ] 앱 아이콘 생성
- [ ] 스플래시 스크린 설정
- [ ] 앱 메타데이터 작성
  - [ ] 앱 이름
  - [ ] 설명
  - [ ] 버전
- [ ] Privacy Policy 작성
- [ ] Terms of Service 작성
- [ ] EAS Build 설정
- [ ] iOS 빌드
- [ ] Android 빌드
- [ ] TestFlight 배포 (iOS)
- [ ] Google Play Beta 배포 (Android)

---

## 추가 고려사항

### 접근성 (Accessibility)
- [ ] 최소 터치 영역 44x44px
- [ ] 색상 대비 WCAG AA 기준 이상
- [ ] VoiceOver/TalkBack 지원
- [ ] 다이나믹 타입 지원

### 다국어 지원
- [ ] i18n 라이브러리 통합 (선택)
- [ ] 영어, 한국어 지원

### 클라우드 동기화 (향후)
- [ ] Firebase 통합
- [ ] Supabase 통합
- [ ] 사용자 인증

### 위젯 (향후)
- [ ] iOS 위젯
- [ ] Android 위젯

---

## 타임라인

| Phase | 기간 | 누적 기간 |
|-------|------|----------|
| Phase 1: 프로젝트 설정 | 1-2일 | 1-2일 |
| Phase 2: 데이터 모델 | 1-2일 | 2-4일 |
| Phase 3: 메인 홈 화면 | 2-3일 | 4-7일 |
| Phase 4: 블록 상세 화면 | 2-3일 | 6-10일 |
| Phase 5: 대시보드 화면 | 2일 | 8-12일 |
| Phase 6: 프로젝트 생성 | 1-2일 | 9-14일 |
| Phase 7: 설정 & 부가기능 | 1-2일 | 10-16일 |
| Phase 8: 최적화 & 테스트 | 1-2일 | 11-18일 |
| Phase 9: 배포 준비 | 1일 | 12-19일 |

**예상 총 개발 기간**: 약 2-3주 (파트타임 기준 4-6주)

---

## 성공 지표

### 사용자 경험
- [ ] 앱 실행 속도 < 2초
- [ ] 화면 전환 애니메이션 부드러움 (60fps)
- [ ] 데이터 로딩 시간 < 1초
- [ ] 직관적인 UX (최소한의 가이드로 사용 가능)

### 기능 완성도
- [ ] 핵심 플로우 정상 동작 (프로젝트 생성 → 블록 관리 → 완료 체크)
- [ ] 데이터 저장/로드 정상 동작
- [ ] 진행률 계산 정확성
- [ ] 통계 데이터 정확성

### 품질
- [ ] 크래시 없음
- [ ] 주요 버그 없음
- [ ] 라이트/다크 모드 정상 작동
- [ ] iOS/Android 모두 정상 작동

---

## 참고 자료

### 디자인
- planning/design.md - 디자인 시안 1
- planning/mandala.jpg - 오타니 쇼헤이 만다라트 차트

### 기술 문서
- [React Native 공식 문서](https://reactnative.dev/)
- [Expo 공식 문서](https://docs.expo.dev/)
- [React Navigation 문서](https://reactnavigation.org/)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)

---

**작성자**: My Mandalateu 개발팀
**최종 수정**: 2026-02-12
**버전**: 1.0
