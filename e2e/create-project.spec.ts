import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8081';

async function goToCreateProject(page: import('@playwright/test').Page) {
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
  await page.getByText('+ 새 프로젝트').click();
  await page.waitForTimeout(500);
  await expect(page.getByRole('heading', { name: '새 프로젝트' })).toBeVisible();
}

test.describe('TC-07. 새 프로젝트 만들기', () => {
  test.beforeEach(async ({ page }) => {
    await goToCreateProject(page);
  });

  test('TC-07-1. 새 프로젝트 화면 기본 요소 확인', async ({ page }) => {
    await expect(page.getByText('만다라트란?')).toBeVisible();
    await expect(page.getByText('프로젝트 이름')).toBeVisible();
    await expect(page.getByPlaceholder('예) 2026년 목표')).toBeVisible();
    await expect(page.getByText('핵심 목표').first()).toBeVisible();
    await expect(page.getByPlaceholder('예) 드래프트 1순위, 연봉 1억, 건강한 몸 만들기')).toBeVisible();
    await expect(page.getByText('만들기')).toBeVisible();
    await expect(page.getByText('취소')).toBeVisible();
  });

  test('TC-07-2. 프로젝트 이름 없을 때 만들기 버튼 클릭 → 화면 유지', async ({ page }) => {
    await page.getByText('만들기').click();
    await page.waitForTimeout(300);
    // 여전히 새 프로젝트 화면
    await expect(page.getByRole('heading', { name: '새 프로젝트' })).toBeVisible();
  });

  test('TC-07-3. 프로젝트 이름만 입력하고 생성 → 홈으로 이동', async ({ page }) => {
    await page.getByPlaceholder('예) 2026년 목표').fill('E2E 테스트 프로젝트');
    await page.getByText('만들기').click();
    await page.waitForTimeout(1000);

    await expect(page.getByText('E2E 테스트 프로젝트')).toBeVisible();
    await expect(page.getByText('블록을 탭하여 상세 보기')).toBeVisible();
  });

  test('TC-07-4. 이름과 핵심 목표 모두 입력 후 생성 → 홈으로 이동', async ({ page }) => {
    await page.getByPlaceholder('예) 2026년 목표').fill('2026 건강 목표');
    await page.getByPlaceholder('예) 드래프트 1순위, 연봉 1억, 건강한 몸 만들기').fill('건강한 몸 만들기');
    await page.getByText('만들기').click();
    await page.waitForTimeout(1000);

    await expect(page.getByText('2026 건강 목표')).toBeVisible();
    await expect(page.getByText('블록을 탭하여 상세 보기')).toBeVisible();
  });

  test('TC-07-5. 취소 버튼 → 홈으로 복귀', async ({ page }) => {
    await page.getByText('취소').click();
    await page.waitForTimeout(500);

    await expect(page.getByText('블록을 탭하여 상세 보기')).toBeVisible();
  });
});
