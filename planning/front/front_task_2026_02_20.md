# 프론트엔드 작업 계획 (2026-02-20 기준)

> 작성일: 2026-02-20
> 목표: 회원가입 / 로그인 화면 생성 및 백엔드 API 연동 (2026-02-18 계획 이어서)
> 현재 상태: Step 1~4 완료, Step 5~8 진행 중

---

## 진행 현황 요약

| Step | 내용 | 상태 |
|------|------|------|
| Step 1 | axios 설치 | ✅ 완료 |
| Step 2 | API 클라이언트 구성 | ✅ 완료 |
| Step 3 | Auth API 함수 | ✅ 완료 |
| Step 4 | Auth Store | ✅ 완료 |
| Step 5 | 네비게이션 구조 변경 | ✅ 완료 |
| Step 6 | LoginScreen | ✅ 완료 |
| Step 7 | SignupScreen | ✅ 완료 |
| Step 8 | OnboardingScreen 수정 | ✅ 완료 |

---

## 완료된 작업 상세 (2026-02-20)

### Step 1 — axios 설치
- `axios@^1.13.5` 설치 완료

---

### Step 2 — API 클라이언트 (`src/api/client.ts`)

**환경변수 관리**
- `front/.env` 생성 — `EXPO_PUBLIC_API_BASE_URL=http://localhost:8080`
- `front/.env.example` 생성 — 팀 공유용 템플릿
- `front/.gitignore` — `.env` 추가

**구현 내용**
- Expo SDK 54 기본 지원 방식 사용 (`EXPO_PUBLIC_` 접두사, 추가 패키지 불필요)
- `registerAuthHandlers()` 함수 노출 → authStore가 초기화 후 등록
- 요청 인터셉터: `_getAccessToken()` 참조로 `Authorization: Bearer` 헤더 자동 주입
- 응답 인터셉터: 401 시 raw axios로 refresh 호출 (인터셉터 루프 방지), 동시 요청 큐잉 처리

**순환 참조 방지 설계**
```
authStore → authApi → apiClient  (단방향)
apiClient는 authStore를 직접 import하지 않음
핸들러 참조(ref) 패턴으로 연결
```

---

### Step 3 — Auth API 함수 (`src/api/auth.ts`)

백엔드 DTO와 1:1 매핑

| 함수 | 메서드 | 엔드포인트 | 요청 | 응답 |
|------|--------|-----------|------|------|
| `authApi.signup()` | POST | `/api/v1/auth/signup` | `{ email, password, nickname }` | `{ id, email, nickname }` |
| `authApi.login()` | POST | `/api/v1/auth/login` | `{ email, password }` | `{ accessToken, refreshToken, tokenType }` |
| `authApi.refresh()` | POST | `/api/v1/auth/refresh` | `{ refreshToken }` | `{ accessToken, refreshToken, tokenType }` |

백엔드 검증 규칙 (서버 `@Valid` 기준)
- `password`: 8자 이상
- `nickname`: 2자 이상
- `email`: 이메일 형식

---

### Step 4 — Auth Store (`src/store/authStore.ts`)

**상태**
| 필드 | 타입 | 설명 |
|------|------|------|
| `accessToken` | `string \| null` | JWT 액세스 토큰 |
| `refreshToken` | `string \| null` | JWT 리프레시 토큰 |
| `user` | `{ id, email, nickname } \| null` | 로그인 유저 정보 |
| `isAuthenticated` | `boolean` | 인증 여부 |

**액션**
| 액션 | 설명 |
|------|------|
| `login(email, password)` | authApi.login() 호출 → 토큰 저장 |
| `signup(email, password, nickname)` | authApi.signup() 호출 |
| `logout()` | 토큰 전체 초기화 |
| `setTokens(accessToken, refreshToken)` | 인터셉터 갱신 시 호출 |

**persist 설정**
- `name`: `auth-storage`
- `storage`: `AsyncStorage` (앱 재시작 후 토큰 유지)
- 파일 import 시 자동으로 `registerAuthHandlers` 호출

---

## 남은 작업

### Step 5 — 네비게이션 구조 변경

#### `src/types/navigation.ts` 수정
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

#### `src/navigation/RootNavigator.tsx` 수정
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

### Step 6 — LoginScreen (`src/screens/LoginScreen/index.tsx`)

#### UI 구성
- 앱 로고 / 타이틀 영역
- 이메일 입력 필드 (`TextInput`, keyboardType: email-address)
- 비밀번호 입력 필드 (`TextInput`, secureTextEntry)
- 로그인 버튼 (로딩 중 비활성화 + ActivityIndicator)
- 에러 메시지 표시 (이메일/비밀번호 불일치 등)
- '계정이 없으신가요? **회원가입**' 링크 → SignupScreen 이동

#### 동작
1. 로그인 버튼 탭
2. `authStore.login()` 호출
3. 성공 → `navigation.reset` → Home
4. 실패 → 에러 메시지 표시 (인라인)

---

### Step 7 — SignupScreen (`src/screens/SignupScreen/index.tsx`)

#### UI 구성
- 닉네임 입력 필드
- 이메일 입력 필드
- 비밀번호 입력 필드 (8자 이상 안내)
- 회원가입 버튼 (로딩 중 비활성화 + ActivityIndicator)
- 에러 메시지 표시 (중복 이메일, 유효성 오류 등)
- '이미 계정이 있으신가요? **로그인**' 링크 → LoginScreen 이동

#### 클라이언트 유효성 검사 (API 호출 전)
| 필드 | 규칙 |
|------|------|
| 이메일 | 이메일 형식 |
| 비밀번호 | 8자 이상 |
| 닉네임 | 2자 이상 |

#### 동작
1. 회원가입 버튼 탭
2. 클라이언트 유효성 검사 통과 시 `authStore.signup()` 호출
3. 성공 → LoginScreen으로 이동 (성공 메시지 표시)
4. 실패 → 에러 메시지 표시

---

### Step 8 — OnboardingScreen 수정

- 마지막 슬라이드 '시작하기' 버튼 동작 변경
  - 기존: `navigation.reset → Home`
  - 변경: `navigation.reset → Login`
- '건너뛰기' 버튼도 동일하게 변경
- `setFirstLaunchDone()` 호출은 유지 (재실행 시 Login으로 바로 가도록)

---

## 생성/수정 파일 목록

```
front/
├── .env                               신규 (EXPO_PUBLIC_API_BASE_URL)
├── .env.example                       신규 (팀 공유용 템플릿)
├── .gitignore                         수정 (.env 추가)
└── src/
    ├── api/
    │   ├── client.ts                  신규 (axios 인스턴스 + 인터셉터)
    │   └── auth.ts                    신규 (signup / login / refresh)
    ├── store/
    │   └── authStore.ts               신규 (Zustand + AsyncStorage persist)
    ├── types/
    │   └── navigation.ts              수정 (Login, Signup 라우트 추가)   ← 예정
    ├── navigation/
    │   └── RootNavigator.tsx          수정 (인증 분기 + 새 화면 등록)    ← 예정
    └── screens/
        ├── LoginScreen/
        │   └── index.tsx              신규                               ← 예정
        ├── SignupScreen/
        │   └── index.tsx              신규                               ← 예정
        └── OnboardingScreen/
            └── index.tsx              수정 (마지막 버튼 이동 경로)        ← 예정
```