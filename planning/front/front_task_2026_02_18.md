# 프론트엔드 작업 계획 (2026-02-18 기준)

> 작성일: 2026-02-18
> 목표: 회원가입 / 로그인 화면 생성 및 백엔드 API 연동
> 현재 상태: 전체 로컬 Mock 기반, 인증 없음

---

## 진행 현황 요약

| Step | 내용 | 상태 |
|------|------|------|
| Step 1 | axios 설치 | ⬜ 미착수 |
| Step 2 | API 클라이언트 구성 | ⬜ 미착수 |
| Step 3 | Auth API 함수 | ⬜ 미착수 |
| Step 4 | Auth Store | ⬜ 미착수 |
| Step 5 | 네비게이션 구조 변경 | ⬜ 미착수 |
| Step 6 | LoginScreen | ⬜ 미착수 |
| Step 7 | SignupScreen | ⬜ 미착수 |
| Step 8 | OnboardingScreen 수정 | ⬜ 미착수 |

---

## 현재 상태 파악

### 기존 네비게이션 플로우
```
앱 시작
  └─ isFirstLaunch = true  → Onboarding → Home
  └─ isFirstLaunch = false → Home
```

### 변경 후 네비게이션 플로우
```
앱 시작
  └─ 토큰 있음              → Home
  └─ 토큰 없음 + 첫 실행    → Onboarding → Login
  └─ 토큰 없음 + 재실행     → Login

Login → Home       (로그인 성공)
Login → Signup
Signup → Login     (가입 성공)
```

### 이미 설치된 의존성
- `@react-native-async-storage/async-storage` — 토큰 퍼시스턴스용
- `zustand` — 상태 관리

### 새로 설치할 의존성
- `axios` — HTTP 클라이언트 (인터셉터 처리)

---

## Step 1 — axios 설치

```bash
npm install axios
```

---

## Step 2 — API 클라이언트 (`src/api/client.ts`)

- axios 인스턴스 생성 (`baseURL` 설정)
- **요청 인터셉터**: `authStore`에서 `accessToken` 읽어 `Authorization: Bearer {token}` 헤더 자동 주입
- **응답 인터셉터**: 401 응답 시 `refreshToken`으로 토큰 갱신 → 원래 요청 재시도. 갱신 실패 시 로그아웃 처리

```
src/api/
└── client.ts
```

---

## Step 3 — Auth API 함수 (`src/api/auth.ts`)

백엔드 인증 엔드포인트 연동

| 함수 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| `signup(email, password, nickname)` | POST | `/api/v1/auth/signup` |
| `login(email, password)` | POST | `/api/v1/auth/login` |
| `refresh(refreshToken)` | POST | `/api/v1/auth/refresh` |

```
src/api/
├── client.ts
└── auth.ts
```

---

## Step 4 — Auth Store (`src/store/authStore.ts`)

Zustand + AsyncStorage `persist` 미들웨어로 앱 재시작 후에도 토큰 유지

### 상태
| 필드 | 타입 | 설명 |
|------|------|------|
| `accessToken` | `string \| null` | JWT 액세스 토큰 |
| `refreshToken` | `string \| null` | JWT 리프레시 토큰 |
| `user` | `{ id, email, nickname } \| null` | 로그인 유저 정보 |
| `isAuthenticated` | `boolean` | 인증 여부 (파생 값) |

### 액션
| 액션 | 설명 |
|------|------|
| `login(email, password)` | API 호출 → 토큰 저장 |
| `signup(email, password, nickname)` | API 호출 → 가입 완료 |
| `logout()` | 토큰 초기화 |
| `setTokens(accessToken, refreshToken)` | 인터셉터에서 토큰 갱신 시 사용 |

```
src/store/
├── mandalartStore.ts  (기존)
└── authStore.ts       (신규)
```

---

## Step 5 — 네비게이션 구조 변경

### `src/types/navigation.ts` 수정
`Login`, `Signup` 라우트 추가

```typescript
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  BlockDetail: { blockId: string; blockTitle: string };
  Dashboard: undefined;
  Settings: undefined;
  CreateProject: undefined;
};
```

### `src/navigation/RootNavigator.tsx` 수정
초기 화면 결정 로직 변경

```
isAuthenticated = true            → initialRoute: 'Home'
isAuthenticated = false
  + isFirstLaunch = true          → initialRoute: 'Onboarding'
  + isFirstLaunch = false         → initialRoute: 'Login'
```

- `LoginScreen`, `SignupScreen` Stack에 추가
- `Login`, `Signup` 화면은 `headerShown: false`

---

## Step 6 — LoginScreen (`src/screens/LoginScreen/index.tsx`)

### UI 구성
- 앱 로고 / 타이틀 영역
- 이메일 입력 필드 (`TextInput`, keyboardType: email-address)
- 비밀번호 입력 필드 (`TextInput`, secureTextEntry)
- 로그인 버튼 (로딩 중 비활성화 + ActivityIndicator)
- 에러 메시지 표시 (이메일/비밀번호 불일치 등)
- '계정이 없으신가요? **회원가입**' 링크 → SignupScreen 이동

### 동작
1. 로그인 버튼 탭
2. `authStore.login()` 호출
3. 성공 → `navigation.reset` → Home
4. 실패 → 에러 메시지 표시 (Alert 또는 인라인)

```
src/screens/
└── LoginScreen/
    └── index.tsx
```

---

## Step 7 — SignupScreen (`src/screens/SignupScreen/index.tsx`)

### UI 구성
- 닉네임 입력 필드
- 이메일 입력 필드
- 비밀번호 입력 필드 (8자 이상 안내)
- 회원가입 버튼 (로딩 중 비활성화 + ActivityIndicator)
- 에러 메시지 표시 (중복 이메일, 유효성 오류 등)
- '이미 계정이 있으신가요? **로그인**' 링크 → LoginScreen 이동

### 클라이언트 유효성 검사 (API 호출 전)
| 필드 | 규칙 |
|------|------|
| 이메일 | 이메일 형식 |
| 비밀번호 | 8자 이상 |
| 닉네임 | 2자 이상 |

### 동작
1. 회원가입 버튼 탭
2. 클라이언트 유효성 검사 통과 시 `authStore.signup()` 호출
3. 성공 → LoginScreen으로 이동 (성공 메시지 표시)
4. 실패 → 에러 메시지 표시

```
src/screens/
└── SignupScreen/
    └── index.tsx
```

---

## Step 8 — OnboardingScreen 수정

- 마지막 슬라이드 '시작하기' 버튼 동작 변경
  - 기존: `navigation.reset → Home`
  - 변경: `navigation.reset → Login`
- `setFirstLaunchDone()` 호출은 유지 (재실행 시 Login으로 바로 가도록)

---

## 생성/수정 파일 목록

```
src/
├── api/
│   ├── client.ts          신규
│   └── auth.ts            신규
├── store/
│   └── authStore.ts       신규
├── types/
│   └── navigation.ts      수정 (Login, Signup 추가)
├── navigation/
│   └── RootNavigator.tsx  수정 (인증 분기 + 새 화면 등록)
└── screens/
    ├── LoginScreen/
    │   └── index.tsx      신규
    ├── SignupScreen/
    │   └── index.tsx      신규
    └── OnboardingScreen/
        └── index.tsx      수정 (마지막 버튼 이동 경로)
```

---

## 작업 우선순위

1. **Step 1~4** (axios, API, Store) — UI보다 먼저. 화면은 Store에 의존
2. **Step 5** (네비게이션) — Store 완성 후 라우팅 구조 확정
3. **Step 6~7** (화면) — Login → Signup 순서로
4. **Step 8** (Onboarding 수정) — 마지막, 단순 수정
