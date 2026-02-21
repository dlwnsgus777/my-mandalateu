import { test, expect } from '@playwright/test';
import { goToLogin } from './helpers/auth';

// RN Web: TouchableOpacity는 div로 렌더링 → getByText로 클릭
// 스택 네비게이터가 이전 화면을 DOM에 유지하므로 .last() 또는 .first() 사용

test.describe('TC-02. 회원가입', () => {
  test.beforeEach(async ({ page }) => {
    await goToLogin(page);
    // 로그인 화면의 "회원가입" 링크 클릭 (마지막 = 링크 텍스트)
    await page.getByText('회원가입').last().click();
    await page.waitForTimeout(500);
  });

  test('TC-02-1. 회원가입 화면 진입', async ({ page }) => {
    await expect(page.getByText('만다라트를 시작하기 위한 계정을 만들어보세요.')).toBeVisible();
    await expect(page.getByPlaceholder('2자 이상 입력하세요')).toBeVisible();
    // 이메일 필드: 스택에 이전 화면이 남아 중복될 수 있으므로 .last() 사용
    await expect(page.getByPlaceholder('example@email.com').last()).toBeVisible();
    await expect(page.getByPlaceholder('8자 이상 입력하세요')).toBeVisible();
  });

  test('TC-02-2. 빈 폼 제출 시 에러', async ({ page }) => {
    await page.getByText('회원가입').last().click();
    await expect(page.getByText('모든 항목을 입력해주세요.')).toBeVisible();
  });

  test('TC-02-3. 닉네임 1자 입력 시 에러', async ({ page }) => {
    await page.getByPlaceholder('2자 이상 입력하세요').fill('A');
    await page.getByPlaceholder('example@email.com').last().fill('test@test.com');
    await page.getByPlaceholder('8자 이상 입력하세요').fill('password123');
    await page.getByText('회원가입').last().click();
    await expect(page.getByText('닉네임은 2자 이상이어야 합니다.')).toBeVisible();
  });

  test('TC-02-4. 이메일 형식 오류 시 에러', async ({ page }) => {
    await page.getByPlaceholder('2자 이상 입력하세요').fill('테스터');
    await page.getByPlaceholder('example@email.com').last().fill('notanemail');
    await page.getByPlaceholder('8자 이상 입력하세요').fill('password123');
    await page.getByText('회원가입').last().click();
    await expect(page.getByText('올바른 이메일 형식을 입력해주세요.')).toBeVisible();
  });

  test('TC-02-5. 비밀번호 7자 입력 시 에러', async ({ page }) => {
    await page.getByPlaceholder('2자 이상 입력하세요').fill('테스터');
    await page.getByPlaceholder('example@email.com').last().fill('test@test.com');
    await page.getByPlaceholder('8자 이상 입력하세요').fill('1234567');
    await page.getByText('회원가입').last().click();
    await expect(page.getByText('비밀번호는 8자 이상이어야 합니다.')).toBeVisible();
  });

  test('TC-02-8. 로그인 링크 이동', async ({ page }) => {
    await page.getByText('로그인').last().click();
    await page.waitForTimeout(500);
    // 로그인 화면 확인 (스택에 로그인이 2개 쌓일 수 있으므로 .last() = 현재 화면)
    await expect(page.getByText('목표를 향한 나만의 만다라트').last()).toBeVisible();
  });
});

test.describe('TC-03. 로그인', () => {
  test.beforeEach(async ({ page }) => {
    await goToLogin(page);
  });

  test('TC-03-1. 로그인 화면 기본 요소 확인', async ({ page }) => {
    await expect(page.getByText('MY MANDALATEU').first()).toBeVisible();
    await expect(page.getByText('목표를 향한 나만의 만다라트')).toBeVisible();
    await expect(page.getByPlaceholder('example@email.com').first()).toBeVisible();
    await expect(page.getByPlaceholder('비밀번호를 입력하세요')).toBeVisible();
    // RN Web TouchableOpacity → div, getByText로 확인
    await expect(page.getByText('로그인').first()).toBeVisible();
    await expect(page.getByText('회원가입').first()).toBeVisible();
  });

  test('TC-03-2. 빈 폼 제출 시 에러', async ({ page }) => {
    // 로그인 버튼: 화면에서 "로그인" 텍스트를 가진 버튼(div)을 클릭
    // "로그인" 텍스트가 여러 개일 수 있으므로 이메일/비밀번호 라벨 제외한 버튼 클릭
    await page.getByText('로그인').last().click();
    await expect(page.getByText('이메일과 비밀번호를 입력해주세요.')).toBeVisible();
  });

  test('TC-03-5. 회원가입 링크 이동', async ({ page }) => {
    await page.getByText('회원가입').last().click();
    await page.waitForTimeout(500);
    await expect(page.getByText('만다라트를 시작하기 위한 계정을 만들어보세요.')).toBeVisible();
  });
});
