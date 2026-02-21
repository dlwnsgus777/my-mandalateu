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

test.describe('TC-04. 홈 화면', () => {
  test.beforeEach(async ({ page }) => {
    await goToHome(page);
  });

  test('TC-04-1. 홈 화면 기본 요소 확인', async ({ page }) => {
    await expect(page.getByText('전체 진행률', { exact: false })).toBeVisible();
    await expect(page.getByText('통계 보기')).toBeVisible();
    await expect(page.getByText('+ 새 프로젝트')).toBeVisible();
    await expect(page.getByText('블록을 탭하여 상세 보기')).toBeVisible();
  });

  test('TC-04-2. 전체 진행률 표시', async ({ page }) => {
    await expect(page.getByText(/전체 진행률/)).toBeVisible();
    // 퍼센트 텍스트 확인
    await expect(page.getByText(/%/).first()).toBeVisible();
  });

  test('TC-04-3. 프로젝트 제목 편집 모달 열기 및 저장', async ({ page }) => {
    await page.getByText('✏️').click();
    await expect(page.getByText('프로젝트 이름 변경')).toBeVisible();

    const input = page.getByPlaceholder('프로젝트 이름을 입력하세요');
    await input.clear();
    await input.fill('E2E 테스트 프로젝트');
    // 저장 버튼: RN Web에서 div이므로 getByText 사용
    await page.getByText('저장').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('프로젝트 이름 변경')).not.toBeVisible();
    await expect(page.getByText('E2E 테스트 프로젝트')).toBeVisible();
  });

  test('TC-04-4. 프로젝트 제목 편집 취소', async ({ page }) => {
    await page.getByText('✏️').click();
    await expect(page.getByText('프로젝트 이름 변경')).toBeVisible();
    await page.getByText('취소').click();
    await expect(page.getByText('프로젝트 이름 변경')).not.toBeVisible();
  });

  test('TC-04-9. 통계 보기 버튼 → Dashboard 이동', async ({ page }) => {
    await page.getByText('통계 보기').click();
    await page.waitForTimeout(500);
    // 헤더 타이틀 "통계" 확인
    await expect(page.getByRole('heading', { name: '통계' })).toBeVisible();
  });

  test('TC-04-10. 새 프로젝트 버튼 → CreateProject 이동', async ({ page }) => {
    await page.getByText('+ 새 프로젝트').click();
    await page.waitForTimeout(500);
    // 헤더 타이틀 "새 프로젝트" 확인
    await expect(page.getByRole('heading', { name: '새 프로젝트' })).toBeVisible();
  });
});
