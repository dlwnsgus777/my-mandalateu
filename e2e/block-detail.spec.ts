import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8081';

async function goToHome(page: import('@playwright/test').Page) {
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
  await page.reload();
  await page.waitForTimeout(1500);
}

test.describe('TC-05. 블록 상세', () => {
  test.beforeEach(async ({ page }) => {
    await goToHome(page);
  });

  test('TC-05-1. 블록 탭 → 홈 화면 고유 요소가 사라진다', async ({ page }) => {
    // 홈 화면에만 있는 힌트 텍스트가 보이는지 먼저 확인
    await expect(page.getByText('블록을 탭하여 상세 보기')).toBeVisible();

    // 운동 루틴 블록 클릭
    await page.getByText('운동 루틴').first().click();
    await page.waitForTimeout(800);

    // 홈 화면 고유 요소가 사라지면 블록 상세로 이동한 것
    await expect(page.getByText('블록을 탭하여 상세 보기')).not.toBeVisible();
  });

  test('TC-05-3. 뒤로 가기 → 홈 복귀', async ({ page }) => {
    await page.getByText('운동 루틴').first().click();
    await page.waitForTimeout(800);
    await expect(page.getByText('블록을 탭하여 상세 보기')).not.toBeVisible();

    // React Navigation 헤더 뒤로가기: "My Mandalateu, back" 링크로 렌더링됨
    await page.getByRole('link', { name: /back/i }).click();
    await page.waitForTimeout(800);
    // 홈 화면 복귀 확인
    await expect(page.getByText('블록을 탭하여 상세 보기')).toBeVisible();
  });
});
