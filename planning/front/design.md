# My Mandalateu - 디자인 시안

## 디자인 컨셉

**테마**: 미니멀하고 직관적인 모바일 퍼스트 디자인
**목표**: 복잡한 만다라트 구조를 간단하고 아름답게 표현
**플랫폼**: React Native (iOS/Android)

---

## 디자인 시안 1: 메인 홈 화면 (만다라트 블록 개요)

### 개요
사용자가 처음 앱을 열었을 때 보는 메인 화면. **3x3 블록 그리드**로 9개의 세부 목표 영역을 표시. 각 블록을 탭하면 해당 블록의 세부 만다라트(3x3)로 이동하는 직관적인 네비게이션 구조.

### 만다라트 구조 설명
- **전체**: 9개의 블록 (3x3 배치)
- **각 블록**: 9개의 셀 (3x3 배치)
- **총 81개 셀** (9 x 9)
- **중앙 블록의 중앙 셀**: 핵심 목표
- **중앙 블록의 주변 8개 셀**: 8개 세부 목표
- **나머지 8개 블록**: 각 세부 목표의 구체적 실행 과제 (블록의 중앙 = 세부 목표 제목)

### 레이아웃 구조

```
┌─────────────────────────────────┐
│  [≡]  My Mandalateu      [👤]  │  ← Header (60px)
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐ │
│  │ "2026년 목표"             │ │  ← 프로젝트 제목
│  │ 진행률: ████░░░░░░ 42%    │ │  ← 전체 진행률 (72개 중)
│  │ 📅 2026.01.01 시작        │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌─ 세부 목표 (3x3 블록) ────┐│
│  │                             ││
│  │ ┌─────────┬─────────┬─────┐││
│  │ │  건강   │  학습   │ 취미│││  ← 블록 1, 2, 3
│  │ │ 관리    │         │     │││
│  │ │ ████░ 75%│███░░ 60%│██░ │││  ← 각 블록 진행률
│  │ │ 6/8 완료 │ 5/8 완료│ 3/8│││
│  │ ├─────────┼─────────┼─────┤││
│  │ │  경력   │🎯 핵심  │재정 │││  ← 블록 4, 5(중앙), 6
│  │ │ 개발    │  목표   │관리 │││
│  │ │█████ 95%│         │███░ │││
│  │ │ 7/8 완료 │         │4/8  │││
│  │ ├─────────┼─────────┼─────┤││
│  │ │ 인간    │자기계발 │여행 │││  ← 블록 7, 8, 9
│  │ │ 관계    │         │     │││
│  │ │██░░ 45% │████░ 70%│█░░ │││
│  │ │ 4/8 완료 │ 6/8 완료│ 2/8│││
│  │ └─────────┴─────────┴─────┘││
│  │                             ││
│  │ 💡 블록을 탭하여 상세 보기   ││  ← 안내 메시지
│  └─────────────────────────────┘│
│                                 │
│  [📊 통계보기]  [+ 새 프로젝트]  │  ← 하단 버튼
│                                 │
└─────────────────────────────────┘
```

### 화면 구성 특징

메인 화면은 **3x3 블록 그리드**를 기본으로 표시:

#### **블록 개요 화면** - 기본 메인 화면
- 9개 블록을 3x3 그리드로 표시
- 각 블록 표시 항목:
  - 세부 목표 제목 (블록 중앙 셀 제목)
  - 진행률 바 (8개 실행 과제 중 완료 개수)
  - 완료 개수 (예: 6/8 완료)
- 중앙 블록 (핵심 목표)은 특별한 스타일로 강조
- 간결하고 직관적인 개요 제공

#### **블록 상세 화면** - 블록 탭 시 이동
- 선택한 블록의 3x3 세부 만다라트 표시
- 중앙: 세부 목표 제목
- 주변 8개 셀: 구체적인 실행 과제
- 각 셀의 완료 상태, 마감일, 우선순위 표시
- 뒤로가기로 메인 화면으로 복귀

### UI 요소

#### Header
- 좌측: 햄버거 메뉴 (프로젝트 목록, 설정)
- 중앙: 앱 타이틀
- 우측: 프로필/알림

#### 프로젝트 카드
- 제목 편집 가능 (탭하여 수정)
- 전체 진행률 (72개 실행 과제 기준, 8 × 9 블록)
- 생성일/수정일 표시

#### 블록 그리드 (3x3)

**각 블록 카드:**
- 크기: 110x110px (중간 크기)
- 세부 목표 제목 (2-3줄, 14px 폰트)
- 진행률 바 (8개 실행 과제 중 완료 개수)
- 완료 개수 표시 (예: 6/8 완료)
- 미니 진행 인디케이터 (●●●●●●○○)
- 블록별 색상 지정 가능 (선택사항)

#### 중앙 블록 (핵심 목표)
- 굵은 테두리로 강조 (2px)
- 다른 배경색 (라이트: `#E3F2FD`, 다크: `#1E3A5F`)
- 아이콘 🎯 표시
- 제목 대신 핵심 목표 텍스트 표시
- 탭 시 핵심 목표 설명 모달 열기

#### 인터랙션
- **셀 탭**: 해당 셀의 TODO 상세 모달
- **블록 탭**: 해당 블록의 3x3 상세 화면
- **줌 제스처**: 핀치하여 확대/축소
- **롱프레스**: 빠른 편집 메뉴
- **좌우 스와이프**: 다른 프로젝트로 전환

### 색상 테마

**라이트 모드**
- 배경: `#FFFFFF`, `#F8F9FA`
- 블록 배경: `#FFFFFF`
- 블록 테두리: `#E9ECEF`
- 중앙 블록 배경: `#E3F2FD` (연한 파랑)
- 중앙 블록 테두리: `#4A90E2` (강조 파란색, 2px)
- 셀 배경: `#FAFAFA`
- 셀 테두리: `#E0E0E0` (얇게, 0.5px)
- 중앙 셀 (세부 목표): `#4A90E2` (강조 파란색)
- 텍스트: `#212529` (메인), `#6C757D` (서브)
- 완료 셀: `#E7F5E7` (연한 초록 배경)
- 체크 아이콘: `#28A745` (초록)
- 미완료 체크: `#DEE2E6` (회색)

**다크 모드**
- 배경: `#1A1A1A`, `#2D2D2D`
- 블록 배경: `#2D2D2D`
- 블록 테두리: `#404040`
- 중앙 블록 배경: `#1E3A5F` (어두운 파랑)
- 중앙 블록 테두리: `#5CA3F5` (밝은 파란색, 2px)
- 셀 배경: `#252525`
- 셀 테두리: `#353535` (얇게, 0.5px)
- 중앙 셀 (세부 목표): `#5CA3F5` (밝은 파란색)
- 텍스트: `#E8E8E8` (메인), `#A0A0A0` (서브)
- 완료 셀: `#1A3A1A` (어두운 초록 배경)
- 체크 아이콘: `#34C759` (밝은 초록)
- 미완료 체크: `#404040` (어두운 회색)

**블록별 색상 구분 (선택사항)**
- 사용자가 각 8개 세부 목표 블록에 색상 지정 가능
- 기본 팔레트: 빨강, 주황, 노랑, 초록, 청록, 파랑, 보라, 분홍
- 블록 테두리 또는 헤더에 액센트 컬러 적용

### 인터랙션

#### 홈 화면 (3x3 블록 그리드)

1. **블록 탭 (Tap)**
   - 일반 블록: 해당 블록의 상세 화면(3x3 세부 만다라트)으로 이동
   - 중앙 블록: 핵심 목표 설명 모달 열기
   - Zoom In 애니메이션 효과 (블록이 확대되며 전환)
   - 부드러운 전환 애니메이션 (300ms)

2. **블록 롱프레스 (Long Press)**
   - 블록 색상 변경
   - 세부 목표 제목 편집
   - 블록 메모 작성
   - 진동 피드백 (Haptic Feedback)

3. **스와이프**
   - 좌우 스와이프: 다른 만다라트 프로젝트로 전환
   - 세로 스크롤: 화면 상하 이동 (필요 시)

4. **Pull to Refresh**
   - 아래로 당겨서 데이터 새로고침
   - 진행률 재계산

5. **애니메이션**
   - 화면 진입: Fade In + Scale (0.95 → 1.0)
   - 블록 탭: Zoom In (해당 블록이 화면 전체로 확대)
   - 진행률 업데이트: 부드러운 프로그레스 바 애니메이션
   - 블록 순차적 Fade In (화면 로드 시)

6. **하단 버튼**
   - 📊 통계보기: 대시보드 화면으로 이동
   - + 새 프로젝트: 프로젝트 생성 플로우 시작

### React Native 컴포넌트

```typescript
// 주요 컴포넌트 구조 - 메인 홈 화면
<SafeAreaView>
  <Header />

  <ScrollView>
    {/* 프로젝트 요약 카드 */}
    <ProjectCard
      title="2026년 목표"
      progress={42}
      totalCells={72} // 8개 × 9블록 = 72개 실행 과제
      completedCells={30}
      onTitleEdit={handleTitleEdit}
    />

    {/* 3x3 블록 그리드 */}
    <BlockGrid
      blocks={mandalartBlocks} // 9개 블록
      onBlockPress={navigateToBlockDetail}
      onBlockLongPress={showBlockMenu}
      centerBlockId={4} // 중앙 블록 인덱스
    />

    {/* 안내 메시지 */}
    <HintText>💡 블록을 탭하여 상세 보기</HintText>

    {/* 하단 액션 버튼 */}
    <ActionButtons>
      <Button icon="chart-bar" onPress={showStatistics}>
        📊 통계 보기
      </Button>
      <Button icon="plus" onPress={createNewProject}>
        + 새 프로젝트
      </Button>
    </ActionButtons>
  </ScrollView>
</SafeAreaView>

// BlockGrid 컴포넌트 구조 (3x3 블록 그리드)
<View style={styles.gridContainer}>
  {blocks.map((block, blockIndex) => (
    <TouchableOpacity
      key={block.id}
      onPress={() => onBlockPress(block)}
      onLongPress={() => onBlockLongPress(block)}
      style={[
        styles.blockCard,
        blockIndex === centerBlockId && styles.centerBlock
      ]}
    >
      {/* 블록 아이콘 (중앙 블록인 경우) */}
      {blockIndex === centerBlockId && (
        <Icon name="target" size={24} color="#4A90E2" />
      )}

      {/* 세부 목표 제목 */}
      <Text
        style={styles.blockTitle}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {block.goalTitle}
      </Text>

      {/* 진행률 바 */}
      <ProgressBar
        progress={block.completedCount / 8}
        color={getProgressColor(block.completedCount / 8)}
        style={styles.progressBar}
      />

      {/* 완료 개수 */}
      <Text style={styles.completionText}>
        {block.completedCount}/8 완료
      </Text>

      {/* 미니 인디케이터 (선택사항) */}
      <View style={styles.miniIndicator}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < block.completedCount && styles.dotCompleted
            ]}
          />
        ))}
      </View>
    </TouchableOpacity>
  ))}
</View>

// 스타일 예시
const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  blockCard: {
    width: (SCREEN_WIDTH - 56) / 3, // 3열 그리드
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  centerBlock: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    backgroundColor: '#E3F2FD',
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  completionText: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
  },
  miniIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DEE2E6',
  },
  dotCompleted: {
    backgroundColor: '#28A745',
  },
});
```

---

## 디자인 시안 2: 블록 상세 화면 (세부 목표의 실행 과제 그리드)

### 개요
메인 화면에서 특정 **블록을 탭**했을 때 보이는 화면. 해당 세부 목표를 달성하기 위한 **8개 실행 과제를 3x3 그리드**로 표시. 중앙에는 세부 목표 제목이 위치.

**구조**: 9x9 전체 구조 중 하나의 블록 (3x3)을 확대하여 상세하게 보는 화면.

### 레이아웃 구조

```
┌─────────────────────────────────┐
│  [←]  건강 관리          [⋮]   │  ← Navigation Header
│       9개 중 5개 완료            │  ← 진행 상태
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐ │
│  │ 전체 만다라트에서 위치:    │ │  ← 컨텍스트 표시
│  │ [블록 1/9] - 좌측 상단     │ │
│  │ 📊 진행률 ████████░ 56%   │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────┬───────┬───────┐    │
│  │   1   │   2   │   3   │    │
│  │ ✅    │ ✅    │ ⬜    │    │  ← TODO 체크박스
│  │ 매일  │ 수분  │ 스트  │    │
│  │ 운동  │ 섭취  │ 레칭  │    │
│  │ 30분  │ 2L   │       │    │
│  ├───────┼───────┼───────┤    │
│  │   4   │건강 관리 5   │    │  ← 중앙: 세부 목표
│  │ ✅    │ 🎯   │ ⬜    │    │    (편집 가능)
│  │ 식단  │      │ 금연  │    │
│  │ 조절  │      │ 완료  │    │
│  ├───────┼───────┼───────┤    │
│  │   6   │   7   │   8   │    │
│  │ ✅    │ ✅    │ ⬜    │    │
│  │ 정기  │ 충분한│ 명상  │    │
│  │ 검진  │ 수면  │ 습관  │    │
│  └───────┴───────┴───────┘    │
│                                 │
│  ⬅️ [이전 블록]  [다음 블록] ➡️│  ← 블록 간 네비게이션
│                                 │
│  📝 메모 및 세부사항            │  ← 확장 가능한 섹션
│  ─────────────────────────────  │
│                                 │
│  🔔 알림 설정                   │
│  매일 오전 7시 리마인더          │
│                                 │
└─────────────────────────────────┘
```

### UI 요소

#### Navigation Header
- 좌측: 뒤로가기 버튼
- 중앙: 세부 목표 제목 (편집 가능)
- 우측: 전체 완료 체크 버튼
- 서브타이틀: 완료 현황 (8개 중 5개 완료)

#### 진행률 카드
- 시각적 프로그레스 바
- 퍼센트 표시
- 애니메이션 효과

#### TODO 그리드 셀
각 셀 구성:
- 체크박스 (✅ 완료 / ⬜ 미완료)
- 번호
- TODO 제목 (2-3줄)
- 마감일 배지 (선택사항)
- 우선순위 표시 (🔴 높음, 🟡 중간, 🟢 낮음)

중앙 셀:
- 세부 목표 아이콘 및 제목
- 탭하여 설명 편집

#### 확장 섹션
- 메모 및 세부사항
- 알림 설정
- 관련 태그/카테고리

### 색상 테마

**셀 상태별 색상**
- 완료: 연한 초록 배경 `#E7F5E7`, 진한 초록 체크 `#28A745`
- 진행중: 흰색/기본 배경
- 기한 임박: 연한 노란 배경 `#FFF9E6`
- 기한 초과: 연한 빨강 배경 `#FDE8E8`

**우선순위 색상**
- 높음: `#DC3545` (빨강)
- 중간: `#FFC107` (노랑)
- 낮음: `#28A745` (초록)

### 인터랙션

1. **체크박스 탭**
   - 즉시 완료/미완료 토글
   - 체크 애니메이션 (스케일 + 바운스)
   - 완료 시 축하 피드백 (선택적)
   - 진행률 실시간 업데이트

2. **셀 탭**
   - TODO 상세 모달 열기
   - 제목, 설명, 마감일, 우선순위 편집

3. **셀 롱프레스**
   - 빠른 액션 메뉴
   - 삭제, 이동, 복제 옵션

4. **스와이프 제스처**
   - 좌측 스와이프: 삭제
   - 우측 스와이프: 완료 토글

5. **Pull to Refresh**
   - 아래로 당겨서 새로고침

### React Native 컴포넌트

```typescript
// 블록 상세 화면 (Block Detail Screen)
<SafeAreaView>
  <NavigationHeader
    title={blockGoalTitle} // "건강 관리"
    subtitle={`9개 중 ${completedCount}개 완료`}
    onBack={goBackToMain}
    rightIcon="dots-vertical"
    onRightPress={showBlockMenu}
  />

  <ScrollView>
    {/* 컨텍스트 카드 - 전체 구조에서 현재 위치 */}
    <ContextCard
      blockPosition={blockIndex} // 0-8
      totalBlocks={9}
      progress={blockProgress}
    />

    {/* 3x3 TODO 그리드 (현재 블록의 9개 셀) */}
    <BlockTodoGrid
      cells={blockCells} // 9개 셀
      centerCell={blockGoalTitle} // 중앙: 세부 목표 제목
      onCellCheck={handleCellToggle}
      onCellPress={openCellDetailModal}
      onCellLongPress={showCellQuickActions}
      onCenterPress={editBlockGoal}
    />

    {/* 블록 간 네비게이션 */}
    <BlockNavigation
      currentBlock={blockIndex}
      totalBlocks={9}
      onPrevious={() => navigateToBlock(blockIndex - 1)}
      onNext={() => navigateToBlock(blockIndex + 1)}
      blocks={allBlocks}
    />

    {/* 확장 섹션들 */}
    <ExpandableSection title="📝 메모 및 세부사항">
      <TextInput
        multiline
        placeholder="이 목표에 대한 메모를 작성하세요..."
        value={blockNotes}
        onChangeText={updateBlockNotes}
      />
    </ExpandableSection>

    <ExpandableSection title="🔔 알림 설정">
      <NotificationSettings
        blockId={blockIndex}
        onSave={saveNotificationSettings}
      />
    </ExpandableSection>

    <ExpandableSection title="🔗 관련 링크 & 자료">
      <LinkList links={blockLinks} onAddLink={addLink} />
    </ExpandableSection>
  </ScrollView>

  {/* 플로팅 액션 버튼 */}
  <FAB
    icon="plus"
    label="새 할 일 추가"
    onPress={addNewCell}
  />
</SafeAreaView>

// BlockTodoGrid 컴포넌트 내부 구조
<View style={styles.gridContainer}>
  {cells.map((cell, index) => {
    // 중앙 셀 (인덱스 4)인 경우
    if (index === 4) {
      return (
        <TouchableOpacity
          key="center"
          onPress={onCenterPress}
          style={styles.centerCell}
        >
          <Text style={styles.centerTitle}>{centerCell}</Text>
          <Icon name="target" size={32} />
        </TouchableOpacity>
      );
    }

    // 일반 셀 (실행 과제)
    return (
      <Swipeable
        key={cell.id}
        renderLeftActions={renderDeleteAction}
        renderRightActions={renderCompleteAction}
      >
        <TouchableOpacity
          onPress={() => onCellPress(cell)}
          onLongPress={() => onCellLongPress(cell)}
          style={[
            styles.cell,
            cell.completed && styles.completedCell
          ]}
        >
          <Checkbox
            value={cell.completed}
            onValueChange={() => onCellCheck(cell)}
          />
          <View style={styles.cellContent}>
            <Text style={styles.cellNumber}>{cell.number}</Text>
            <Text style={styles.cellTitle} numberOfLines={2}>
              {cell.title}
            </Text>
            {cell.deadline && (
              <DeadlineBadge deadline={cell.deadline} />
            )}
            {cell.priority && (
              <PriorityIndicator priority={cell.priority} />
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  })}
</View>
```

---

## 만다라트 데이터 구조 및 네비게이션

### 데이터 모델

```typescript
// 만다라트 프로젝트 전체 구조
interface MandalartProject {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  blocks: MandalartBlock[]; // 9개 블록
}

// 각 블록 (3x3 구조)
interface MandalartBlock {
  id: string;
  position: number; // 0-8 (0=좌상, 4=중앙, 8=우하)
  goalTitle: string; // 블록 중앙의 세부 목표 제목
  cells: MandalartCell[]; // 9개 셀 (중앙 포함)
  notes: string;
  color?: string; // 블록별 색상 (선택)
}

// 각 셀 (실행 과제 또는 목표)
interface MandalartCell {
  id: string;
  position: number; // 0-8 (블록 내 위치)
  isCenter: boolean; // 중앙 셀 여부
  title: string;
  description?: string;
  completed: boolean;
  deadline?: Date;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  createdAt: Date;
  completedAt?: Date;
}

// 중앙 블록의 중앙 셀 = 핵심 목표
// 중앙 블록의 주변 8개 셀 = 8개 세부 목표
// 각 세부 목표가 나머지 8개 블록의 중앙이 됨
```

### 네비게이션 플로우

```
[홈 화면: 9x9 전체 구조]
          │
          ├─ 탭 블록 → [블록 상세: 3x3 그리드]
          │              │
          │              ├─ 탭 셀 → [셀 상세 모달]
          │              │             └─ 편집/삭제/완료
          │              │
          │              ├─ 좌우 스와이프 → [다른 블록]
          │              │
          │              └─ 뒤로가기 → [홈 화면]
          │
          ├─ 탭 셀 → [셀 상세 모달]
          │             └─ 소속 블록으로 이동 옵션
          │
          ├─ 통계 버튼 → [대시보드 화면]
          │                └─ 차트 탭 → [해당 블록/셀]
          │
          └─ 새 프로젝트 → [프로젝트 생성 플로우]
```

### 화면 간 전환 애니메이션

- **홈 → 블록 상세**: 해당 블록이 확대되는 Zoom In 효과
- **블록 간 이동**: 좌우 슬라이드 애니메이션
- **모달 열기**: Bottom Sheet 또는 Fade + Scale
- **뒤로가기**: Zoom Out 또는 Slide Right

---

## 디자인 시안 3: 대시보드 / 통계 화면

### 개요
전체 만다라트 프로젝트의 진행 상황을 시각화하고 통계를 제공하는 화면. 동기부여와 인사이트를 제공.

### 레이아웃 구조

```
┌─────────────────────────────────┐
│  [←]  통계 & 대시보드           │  ← Header
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐ │
│  │ 📅 이번 주 진행 현황       │ │  ← 주간 요약 카드
│  │                           │ │
│  │ 완료한 TODO: 23개         │ │
│  │ 달성률: 76% ⬆️ (+12%)     │ │
│  │                           │ │
│  │ Mo Tu We Th Fr Sa Su      │ │
│  │ ✅ ✅ ✅ ✅ ⬜ ⬜ ⬜      │ │  ← 주간 체크
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 📊 목표별 진행률          │ │  ← 차트 카드
│  │                           │ │
│  │   건강 관리    ████░ 75% │ │
│  │   공부         ███░░ 60% │ │
│  │   취미         ██░░░ 40% │ │
│  │   경력         █████ 95% │ │
│  │   재정         ███░░ 55% │ │
│  │   인간관계     ██░░░ 45% │ │
│  │   자기계발     ████░ 70% │ │
│  │   여행         █░░░░ 20% │ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 🔥 연속 달성 기록          │ │  ← Streak 카드
│  │                           │ │
│  │     🔥 12일                │ │
│  │   현재 연속 기록           │ │
│  │                           │ │
│  │   최고 기록: 28일 🏆      │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ ⏰ 다가오는 마감일         │ │  ← 마감일 목록
│  │                           │ │
│  │ 🔴 오늘: 명상 습관 (건강)  │ │
│  │ 🟡 내일: 영어 공부 (학습)  │ │
│  │ 🟢 3일 후: 블로그 작성     │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 🏅 이번 달 성과            │ │  ← 월간 성과
│  │                           │ │
│  │ • 완료한 TODO: 89개       │ │
│  │ • 가장 많이 한 목표: 경력  │ │
│  │ • 달성률: 68%             │ │
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### UI 요소

#### 주간 요약 카드
- 이번 주 완료 TODO 개수
- 지난 주 대비 증감률
- 요일별 체크 현황 (시각적 표시)

#### 목표별 진행률 차트
- 8개 세부 목표의 진행률을 가로 막대 그래프로 표시
- 색상 그라데이션 (낮음: 빨강 → 중간: 노랑 → 높음: 초록)
- 탭하여 해당 목표 상세로 이동

#### 연속 달성 기록 (Streak)
- 연속으로 TODO를 완료한 날짜 수
- 불 이모지 애니메이션
- 최고 기록 표시로 동기부여

#### 다가오는 마감일
- 마감일이 임박한 TODO 목록
- 우선순위별 색상 표시
- 탭하여 해당 TODO로 이동

#### 월간 성과
- 이번 달 통계 요약
- 가장 활발한 목표 영역
- 전체 달성률

### 색상 테마

**차트 색상 (진행률 기반)**
- 0-30%: `#DC3545` (빨강)
- 31-60%: `#FFC107` (노랑)
- 61-80%: `#17A2B8` (청록)
- 81-100%: `#28A745` (초록)

**카드 강조색**
- 주간 요약: `#4A90E2` (파란)
- 차트: `#6C757D` (회색)
- Streak: `#FF6B6B` (빨강-주황)
- 마감일: `#FFC107` (노랑)
- 월간 성과: `#9B59B6` (보라)

### 인터랙션

1. **카드 탭**
   - 각 카드를 탭하여 상세 정보 보기
   - 차트 카드: 해당 목표로 이동
   - 마감일 카드: TODO 상세로 이동

2. **스크롤 애니메이션**
   - 스크롤하면서 카드가 순차적으로 Fade In
   - Parallax 효과 (선택적)

3. **Pull to Refresh**
   - 통계 데이터 새로고침

4. **날짜 범위 선택**
   - 주간/월간/연간 토글
   - 날짜 범위 커스텀 선택

### React Native 컴포넌트

```typescript
<SafeAreaView>
  <Header title="통계 & 대시보드" />

  <ScrollView
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    <AnimatedCard delay={0}>
      <WeeklySummary
        completedTodos={23}
        achievementRate={76}
        weeklyChecks={weekData}
      />
    </AnimatedCard>

    <AnimatedCard delay={100}>
      <ProgressChart
        goals={goalProgress}
        onGoalPress={navigateToGoal}
      />
    </AnimatedCard>

    <AnimatedCard delay={200}>
      <StreakCounter
        currentStreak={12}
        bestStreak={28}
      />
    </AnimatedCard>

    <AnimatedCard delay={300}>
      <UpcomingDeadlines
        todos={upcomingTodos}
        onTodoPress={navigateToTodo}
      />
    </AnimatedCard>

    <AnimatedCard delay={400}>
      <MonthlyAchievement
        completedCount={89}
        topGoal="경력"
        achievementRate={68}
      />
    </AnimatedCard>
  </ScrollView>
</SafeAreaView>
```

---

## 공통 디자인 요소

### 타이포그래피

**폰트 패밀리**
- iOS: San Francisco (시스템 기본)
- Android: Roboto (시스템 기본)
- 커스텀: Pretendard, Noto Sans KR (한글 지원)

**폰트 크기**
- H1 (화면 제목): 28px, Bold
- H2 (카드 제목): 20px, Semi-Bold
- H3 (섹션 제목): 16px, Semi-Bold
- Body (본문): 14px, Regular
- Caption (보조): 12px, Regular

### 간격 (Spacing)

- XS: 4px
- S: 8px
- M: 16px
- L: 24px
- XL: 32px

### 그림자 (Shadow)

**라이트 모드**
```javascript
{
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3, // Android
}
```

**다크 모드**
```javascript
{
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 3,
}
```

### 모서리 둥글기 (Border Radius)

- 버튼: 8px
- 카드: 12px
- 그리드 셀: 8px
- 모달: 16px (상단만)

### 애니메이션

**기본 타이밍**
- Fast: 200ms (버튼 탭, 체크박스)
- Normal: 300ms (화면 전환, 모달)
- Slow: 500ms (복잡한 애니메이션)

**Easing**
- `easeInOut`: 기본
- `easeOut`: 진입 애니메이션
- `spring`: 탄성 애니메이션 (체크, 완료)

### 접근성 (Accessibility)

- 최소 터치 영역: 44x44px (iOS 가이드라인)
- 색상 대비: WCAG AA 기준 이상
- VoiceOver/TalkBack 지원
- 다이나믹 타입 지원
- 키보드 네비게이션 (필요시)

---

## 반응형 고려사항

### 화면 크기별 대응

**Small (320-375px)**
- 그리드 셀: 95x95px
- 폰트 크기 축소 (Body: 13px)
- 간격 축소 (M: 12px)

**Medium (376-428px)**
- 그리드 셀: 110x110px
- 기본 폰트 크기
- 기본 간격

**Large (429px+, Tablet)**
- 그리드 셀: 130x130px
- 2단 레이아웃 (대시보드)
- 간격 확대 (M: 20px)

### 가로 모드 (Landscape)

- 사이드바 레이아웃 검토
- 그리드 크기 조정
- 모달 너비 제한

---

## React Native 라이브러리 활용

### UI 컴포넌트
- **React Native Paper**: 머티리얼 디자인 컴포넌트
- **React Native Elements**: 다양한 기본 컴포넌트

### 애니메이션
- **React Native Reanimated**: 고성능 애니메이션
- **React Native Animatable**: 간단한 애니메이션

### 제스처
- **React Native Gesture Handler**: 터치 제스처 처리

### 차트/그래프
- **React Native Chart Kit**: 간단한 차트
- **Victory Native**: 고급 차트

### 기타
- **React Native Linear Gradient**: 그라데이션
- **React Native Haptic Feedback**: 진동 피드백
- **React Native Vector Icons**: 아이콘

---

## 다음 단계

### 디자인 작업
1. [ ] Figma/Sketch로 상세 목업 제작
2. [ ] 컬러 팔레트 확정
3. [ ] 아이콘 세트 선정/제작
4. [ ] 프로토타입 제작 및 사용자 테스트

### 개발 준비
1. [ ] 디자인 시스템 컴포넌트 라이브러리 구축
2. [ ] 테마 Provider 설정
3. [ ] 공통 스타일 파일 작성
4. [ ] 반응형 유틸리티 함수 작성

### 검토 사항
- [ ] iOS/Android 각 플랫폼 디자인 가이드라인 준수 확인
- [ ] 접근성 테스트
- [ ] 성능 최적화 (이미지, 애니메이션)
- [ ] 다국어 지원 고려

---

## 만다라트 구조 핵심 원칙

### 계층 구조 (3단계)
1. **핵심 목표** (1개): 중앙 블록의 중앙 셀
2. **세부 목표** (8개): 중앙 블록의 주변 8개 셀
3. **실행 과제** (64개): 각 세부 목표당 8개씩 (8 × 8 = 64개)
4. **총합**: 1 + 8 + 64 = **73개의 유의미한 항목** (중앙 블록 중앙 제외 시 72개)

### 중앙 블록의 특수성
- **위치**: 9개 블록 중 정중앙 (인덱스 4)
- **역할**: 전체 만다라트의 핵심 구조를 정의
- **중앙 셀**: 핵심 목표 (예: "8구단 드래프트 1순위")
- **주변 8개 셀**: 핵심을 달성하기 위한 8가지 세부 목표
- **연결성**: 이 8개 세부 목표가 각각 나머지 8개 블록의 제목이 됨

### 대칭성과 균형
- 8개 세부 목표는 삶의 다양한 영역을 균형있게 다룸
- 예시: 건강, 학습, 경력, 재정, 관계, 취미, 자기계발, 기타
- 각 영역에 동일하게 8개씩 실행 과제 할당
- 시각적으로 대칭적인 구조로 균형감 표현

### 실제 작성 플로우
1. **1단계**: 핵심 목표 작성 (중앙 블록 중앙)
2. **2단계**: 8개 세부 목표 작성 (중앙 블록 주변)
3. **3단계**: 각 세부 목표마다 8개 실행 과제 작성 (나머지 블록들)
4. **4단계**: 실행 과제 체크하며 진행률 관리

---

## 구현 시 주의사항

### 데이터 무결성
- 중앙 블록의 주변 8개 셀 제목이 나머지 8개 블록의 중앙 셀 제목과 동기화되어야 함
- 한 곳을 수정하면 자동으로 연결된 곳도 업데이트
- 데이터베이스 스키마 설계 시 이 관계를 명확히 반영

### 성능 최적화
- 81개 셀을 한 번에 렌더링하는 것은 무거울 수 있음
- Virtual List 또는 Lazy Loading 고려
- 완료 상태만 필요한 경우 간소화된 데이터만 로드

### 사용자 경험
- 처음 사용자에게는 복잡해 보일 수 있음
- 온보딩 튜토리얼 필수 (만다라트 구조 설명)
- 예시 템플릿 제공 (건강, 커리어, 학업 등)
- 단계별 작성 가이드

### 반응형 대응
- 작은 화면에서 9x9 구조는 가독성 문제
- 뷰 모드 전환 기능 필수
- 텍스트 크기에 따른 셀 크기 동적 조정
- 태블릿에서는 더 큰 그리드 표시 가능

---

## 참고 자료

### 만다라트 기법 출처
- **오타니 쇼헤이 (大谷翔平)**: 메이저리그 스타 선수가 고등학교 시절 사용한 목표 설정 기법으로 유명
- **만다라 (Mandala)**: 불교 미술의 만다라에서 영감을 받은 이름
- **9x9 구조**: 중심에서 외곽으로 확장되는 형태가 만다라와 유사

### 디자인 영감
- planning/mandala.jpg: 오타니 선수의 실제 만다라트 차트
- 한글 + 숫자 조합으로 간결하게 표현
- 블록 간 시각적 구분을 위한 테두리 사용
- 완료 상태를 색상으로 직관적으로 표현

---

**작성일**: 2026-02-09
**최종 수정**: 2026-02-09
**상태**: 디자인 기획 단계 (실제 만다라트 구조 반영 완료)
**기반**: React Native + Expo
**참고 이미지**: planning/mandala.jpg