import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8081';

async function goToSettings(page: import('@playwright/test').Page) {
  await page.goto(BASE);
  await page.evaluate(() => {
    localStorage.setItem(
      'auth-storage',
      JSON.stringify({
        state: {
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh',
          user: { id: 1, email: 'test@test.com', nickname: '테스터' },
          isAuthenticated: true,
        },
        version: 0,
      }),
    );
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // 헤더 설정 아이콘: tabindex=0 중 첫 번째 (top≈19, right)
  await page.locator('div[tabindex="0"]').nth(0).click();
  await page.waitForTimeout(800);
  await expect(page).toHaveTitle('설정');
}

test.describe('TC-08. 설정 화면', () => {
  test('TC-08-1. 설정 화면 기본 요소 확인', async ({ page }) => {
    await goToSettings(page);

    await expect(page.getByText('Account')).toBeVisible();
    await expect(page.getByText('닉네임 변경')).toBeVisible();
    await expect(page.getByText('로그아웃')).toBeVisible();
    await expect(page.getByText('Data')).toBeVisible();
    await expect(page.getByText('데이터 초기화')).toBeVisible();
    await expect(page.getByText('Info')).toBeVisible();
    await expect(page.getByText('이용약관')).toBeVisible();
    await expect(page.getByText('개인정보처리방침')).toBeVisible();
  });

  test('TC-08-2. 프로필 카드에 유저 정보 표시', async ({ page }) => {
    await goToSettings(page);

    await expect(page.getByText('테스터')).toBeVisible();
    await expect(page.getByText('test@test.com').first()).toBeVisible();
    await expect(page.getByText('Google').first()).toBeVisible();
  });

  test('TC-08-3. 로그아웃 버튼 클릭 시 확인 모달 표시', async ({ page }) => {
    await goToSettings(page);

    await page.getByTestId('logout-btn').click();
    await page.waitForTimeout(500);

    await expect(page.getByText('정말 로그아웃 하시겠습니까?')).toBeVisible();
    await expect(page.getByText('취소').first()).toBeVisible();
  });

  test('TC-08-4. 로그아웃 취소 시 설정 화면 유지', async ({ page }) => {
    await goToSettings(page);

    await page.getByTestId('logout-btn').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('정말 로그아웃 하시겠습니까?')).toBeVisible();

    await page.getByText('취소').first().click();
    await page.waitForTimeout(300);

    await expect(page.getByText('정말 로그아웃 하시겠습니까?')).not.toBeVisible();
    await expect(page.getByText('Account')).toBeVisible();
  });

  test('TC-08-5. 로그아웃 확인 시 로그인 화면으로 이동', async ({ page }) => {
    await page.route('**/api/v1/auth/logout', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );

    await goToSettings(page);

    await page.getByTestId('logout-btn').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('정말 로그아웃 하시겠습니까?')).toBeVisible();

    await page.getByTestId('logout-confirm-btn').click();
    await page.waitForTimeout(1500);

    await expect(page.getByText('MY MANDALATEU')).toBeVisible();
    await expect(page.getByPlaceholder('example@email.com')).toBeVisible();
  });

  test('TC-08-6. 로그아웃 후 auth-storage 초기화 확인', async ({ page }) => {
    await page.route('**/api/v1/auth/logout', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );

    await goToSettings(page);

    await page.getByTestId('logout-btn').click();
    await page.waitForTimeout(300);
    await page.getByTestId('logout-confirm-btn').click();
    await page.waitForTimeout(1500);

    const authStorage = await page.evaluate(() => {
      const raw = localStorage.getItem('auth-storage');
      if (!raw) return null;
      return JSON.parse(raw);
    });

    expect(authStorage?.state?.isAuthenticated).toBeFalsy();
    expect(authStorage?.state?.accessToken).toBeNull();
  });

  test('TC-08-7. 데이터 초기화 버튼 클릭 시 확인 모달 표시', async ({ page }) => {
    await goToSettings(page);

    await page.getByTestId('reset-btn').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('모든 데이터가 초기 상태로 돌아갑니다.')).toBeVisible();
    await expect(page.getByText('취소').first()).toBeVisible();
    await expect(page.getByTestId('reset-confirm-btn')).toBeVisible();
  });

  test('TC-08-8. 데이터 초기화 취소 시 설정 화면 유지', async ({ page }) => {
    await goToSettings(page);

    await page.getByTestId('reset-btn').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('모든 데이터가 초기 상태로 돌아갑니다.')).toBeVisible();

    await page.getByText('취소').first().click();
    await page.waitForTimeout(300);

    await expect(page.getByText('모든 데이터가 초기 상태로 돌아갑니다.')).not.toBeVisible();
    await expect(page.getByText('Account')).toBeVisible();
  });

  // ─── 닉네임 변경 ──────────────────────────────────────────────────────────

  test('TC-08-9. 닉네임 변경 버튼 클릭 시 모달 표시', async ({ page }) => {
    await goToSettings(page);

    await page.getByText('닉네임 변경').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('닉네임 변경', { exact: true }).nth(1)).toBeVisible();
    await expect(page.getByPlaceholder('닉네임 입력')).toBeVisible();
    await expect(page.getByText('변경')).toBeVisible();
  });

  test('TC-08-10. 닉네임 모달 - 현재 닉네임이 입력창에 채워짐', async ({ page }) => {
    await goToSettings(page);

    await page.getByText('닉네임 변경').click();
    await page.waitForTimeout(300);

    const input = page.getByPlaceholder('닉네임 입력');
    await expect(input).toHaveValue('테스터');
  });

  test('TC-08-11. 닉네임 비운 채 변경 시 인라인 에러 표시', async ({ page }) => {
    await goToSettings(page);

    await page.getByText('닉네임 변경').click();
    await page.waitForTimeout(300);

    await page.getByPlaceholder('닉네임 입력').clear();
    // exact: true - "닉네임 변경" 행/모달 제목이 아닌 "변경" 버튼만 클릭
    await page.getByText('변경', { exact: true }).click();
    await page.waitForTimeout(300);

    await expect(page.getByText('닉네임을 입력해주세요.')).toBeVisible();
    // 모달은 닫히지 않음
    await expect(page.getByPlaceholder('닉네임 입력')).toBeVisible();
  });

  test('TC-08-12. 닉네임 변경 성공 후 모달 닫힘', async ({ page }) => {
    await page.route('**/api/v1/users/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, email: 'test@test.com', nickname: '새닉네임' }),
      }),
    );

    await goToSettings(page);

    await page.getByText('닉네임 변경').click();
    await page.waitForTimeout(300);

    await page.getByPlaceholder('닉네임 입력').clear();
    await page.getByPlaceholder('닉네임 입력').fill('새닉네임');
    await page.getByText('변경', { exact: true }).click();
    await page.waitForTimeout(500);

    await expect(page.getByPlaceholder('닉네임 입력')).not.toBeVisible();
    await expect(page.getByText('새닉네임')).toBeVisible();
  });

  test('TC-08-13. 닉네임 변경 취소 → 모달 닫힘, 기존 닉네임 유지', async ({ page }) => {
    await goToSettings(page);

    await page.getByText('닉네임 변경').click();
    await page.waitForTimeout(300);

    await page.getByPlaceholder('닉네임 입력').clear();
    await page.getByPlaceholder('닉네임 입력').fill('변경시도');
    await page.getByText('취소').first().click();
    await page.waitForTimeout(300);

    await expect(page.getByPlaceholder('닉네임 입력')).not.toBeVisible();
    // 원래 닉네임 유지
    await expect(page.getByText('테스터')).toBeVisible();
  });

  // ─── 회원 탈퇴 모달 ───────────────────────────────────────────────────────

  test('TC-08-14. 회원 탈퇴 클릭 시 모달 표시', async ({ page }) => {
    await goToSettings(page);

    await page.getByText('회원 탈퇴').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.')).toBeVisible();
    await expect(page.getByText('탈퇴하기')).toBeVisible();
  });

  test('TC-08-15. 회원 탈퇴 모달 취소 → 설정 화면 유지', async ({ page }) => {
    await goToSettings(page);

    await page.getByText('회원 탈퇴').click();
    await page.waitForTimeout(300);
    await page.getByText('취소').first().click();
    await page.waitForTimeout(300);

    await expect(page.getByText('탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.')).not.toBeVisible();
    await expect(page.getByText('Account')).toBeVisible();
  });
});
