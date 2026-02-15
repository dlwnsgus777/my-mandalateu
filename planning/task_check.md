# My Mandalateu - 남은 작업 체크리스트

> 기준: `planning/design.md` 대비 현재 구현 현황 분석
> 작성일: 2026-02-15

---

## 구현 완료

- [x] 프로젝트 기본 구조 및 TypeScript 설정
- [x] 색상/테마 상수 (`colors.ts`, `theme.ts`)
- [x] 타입 시스템 (`mandalart.ts`, `navigation.ts`)
- [x] Zustand 상태관리 (`mandalartStore.ts`)
- [x] 네비게이션 구조 (`RootNavigator.tsx`)
- [x] `HomeScreen` - 3x3 블록 그리드
- [x] `BlockDetailScreen` - 셀 체크, 제목 편집
- [x] `DashboardScreen` - 기본 통계
- [x] `CreateProjectScreen` - 프로젝트 생성
- [x] `BlockCard`, `BlockGrid`, `ProgressBar` 컴포넌트

---

## 미완성 작업

### 1. 인터랙션 & 애니메이션

- [ ] 화면 진입 Fade In + Scale (0.95 → 1.0)
- [ ] 블록 탭 Zoom In 전환 효과
- [ ] 체크박스 완료 시 Scale + Bounce 애니메이션
- [ ] 진행률 바 실시간 업데이트 애니메이션
- [ ] 블록 순차적 Fade In (화면 로드 시)

### 2. 제스처

- [ ] 핀치 줌 (확대/축소)
- [ ] 블록 롱프레스 → 빠른 편집 메뉴 (색상 변경, 제목 편집, 메모)
- [ ] 셀 좌측 스와이프 → 삭제
- [ ] 셀 우측 스와이프 → 완료 토글
- [ ] 좌우 스와이프로 다른 프로젝트 전환
- [ ] Pull to Refresh

### 3. BlockDetailScreen 미완성 요소

- [ ] 이전/다음 블록 네비게이션 UI
- [ ] 확장 섹션 - 📝 메모 및 세부사항
- [ ] 확장 섹션 - 🔔 알림 설정
- [ ] 확장 섹션 - 🔗 관련 링크 & 자료
- [ ] FAB (새 할 일 추가 버튼)
- [ ] 컨텍스트 카드 (전체 구조에서 현재 블록 위치 표시)

### 4. DashboardScreen 고도화

- [ ] 주간 체크 현황 (요일별 시각화 Mo/Tu/We...)
- [ ] 연속 달성 Streak 기능 (🔥 N일)
- [ ] 다가오는 마감일 목록 (우선순위 색상)
- [ ] 월간 성과 카드
- [ ] 날짜 범위 선택 토글 (주간/월간/연간)

### 5. 블록 색상 지정

- [ ] 8개 세부 목표 블록에 개별 색상 지정 기능
- [ ] 색상 팔레트 UI (롱프레스 메뉴에서 접근)
- [ ] 블록 테두리/헤더에 액센트 컬러 적용

### 6. 다크 모드

- [ ] `useColorScheme()` 연동 및 테마 Provider 구성
- [ ] 다크 모드 스타일 전체 적용 (`colors.ts`에 정의 완료, 연동 필요)

### 7. 데이터 영속성

- [ ] AsyncStorage 연동 (현재 mock 데이터만 사용)
- [ ] 앱 재시작 시 데이터 복원

### 8. SettingsScreen 구현

- [ ] 알림 설정
- [ ] 다크/라이트 모드 토글
- [ ] 데이터 내보내기
- [ ] 데이터 초기화

### 9. 온보딩 / UX

- [ ] 처음 사용자 대상 온보딩 튜토리얼 (만다라트 구조 설명)
- [ ] 예시 템플릿 제공 (건강, 커리어, 학업 등)

### 10. 반응형 처리

- [ ] Small (320~375px): 그리드 셀 95x95px, 폰트 13px
- [ ] Medium (376~428px): 기본 110x110px (현재 구현)
- [ ] Large (429px+, 태블릿): 그리드 셀 130x130px, 2단 레이아웃

---

## 디자인 작업

- [ ] Figma/Sketch 상세 목업 제작
- [ ] 아이콘 세트 선정/제작
- [ ] 접근성 테스트 (터치 영역 44x44px, WCAG AA 대비)
- [ ] iOS/Android 플랫폼 가이드라인 준수 확인
- [ ] 성능 최적화 검토 (Virtual List, Lazy Loading)

---

## 우선순위 추천

| 순서 | 작업 | 이유 |
|------|------|------|
| 1 | AsyncStorage 영속성 | 데이터 유실 방지, 기본 기능 |
| 2 | 다크 모드 | 이미 색상 정의 완료, 연동만 필요 |
| 3 | BlockDetailScreen 확장 섹션 | 핵심 UX 완성 |
| 4 | 애니메이션 & 제스처 | 사용성 향상 |
| 5 | DashboardScreen 고도화 | 동기부여 기능 |
| 6 | SettingsScreen | 부가 기능 |
| 7 | 온보딩 튜토리얼 | 출시 전 필수 |
| 8 | 반응형 처리 | 다양한 기기 대응 |