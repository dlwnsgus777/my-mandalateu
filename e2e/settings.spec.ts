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

    // 좌표 기반 클릭: "로그아웃" 텍스트 요소의 중심점
    const box = await page.getByText('로그아웃').boundingBox();
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.waitForTimeout(500);

    await expect(page.getByText('정말 로그아웃 하시겠습니까?')).toBeVisible();
    await expect(page.getByText('취소').first()).toBeVisible();
  });

  test('TC-08-4. 로그아웃 취소 시 설정 화면 유지', async ({ page }) => {
    await goToSettings(page);

    await page.getByText('로그아웃').click();
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

    await page.getByText('로그아웃').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('정말 로그아웃 하시겠습니까?')).toBeVisible();

    // 모달 내 "로그아웃" 확인 버튼 (두 번째 로그아웃 텍스트)
    await page.getByText('로그아웃').last().click();
    await page.waitForTimeout(1500);

    await expect(page.getByText('MY MANDALATEU')).toBeVisible();
    await expect(page.getByPlaceholder('example@email.com')).toBeVisible();
  });

  test('TC-08-6. 로그아웃 후 auth-storage 초기화 확인', async ({ page }) => {
    await page.route('**/api/v1/auth/logout', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );

    await goToSettings(page);

    await page.getByText('로그아웃').click();
    await page.waitForTimeout(300);
    await page.getByText('로그아웃').last().click();
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

    await page.getByText('데이터 초기화').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('모든 데이터가 초기 상태로 돌아갑니다.')).toBeVisible();
    await expect(page.getByText('취소').first()).toBeVisible();
    await expect(page.getByText('초기화')).toBeVisible();
  });

  test('TC-08-8. 데이터 초기화 취소 시 설정 화면 유지', async ({ page }) => {
    await goToSettings(page);

    await page.getByText('데이터 초기화').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('모든 데이터가 초기 상태로 돌아갑니다.')).toBeVisible();

    await page.getByText('취소').first().click();
    await page.waitForTimeout(300);

    await expect(page.getByText('모든 데이터가 초기 상태로 돌아갑니다.', { exact: true })).not.toBeVisible();
    await expect(page.getByText('Account')).toBeVisible();
  });
});
