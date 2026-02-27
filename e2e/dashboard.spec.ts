import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8081';

async function goToDashboard(page: import('@playwright/test').Page) {
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
  await page.getByText('통계 보기').click();
  await page.waitForTimeout(800);
  await expect(page.getByRole('heading', { name: '통계' })).toBeVisible();
}

test.describe('TC-09. 대시보드', () => {
  test.beforeEach(async ({ page }) => {
    await goToDashboard(page);
  });

  test('TC-09-1. 대시보드 기본 요소 확인', async ({ page }) => {
    // 날짜 범위 탭 (exact: true - "주간 체크 현황", "전체 진행 현황" 등 다른 텍스트와 구분)
    await expect(page.getByText('주간', { exact: true })).toBeVisible();
    await expect(page.getByText('월간', { exact: true })).toBeVisible();
    await expect(page.getByText('전체', { exact: true })).toBeVisible();

    // 카드 섹션
    await expect(page.getByText('전체 진행 현황')).toBeVisible();
    await expect(page.getByText('주간 체크 현황')).toBeVisible();
    await expect(page.getByText('연속 달성 Streak')).toBeVisible();
    await expect(page.getByText('통계').last()).toBeVisible();
    await expect(page.getByText('세부 목표별 진행률')).toBeVisible();
  });

  test('TC-09-2. 날짜 범위 탭 전환 - 월간', async ({ page }) => {
    await page.getByText('월간', { exact: true }).click();
    await page.waitForTimeout(300);

    // 월간 탭 활성화 확인 (다른 통계가 렌더링됨)
    await expect(page.getByText('월간', { exact: true })).toBeVisible();
    await expect(page.getByText('전체 진행 현황')).toBeVisible();
    // 범위 힌트 텍스트 "(최근 30일)" 확인
    await expect(page.getByText('(최근 30일)')).toBeVisible();
  });

  test('TC-09-3. 날짜 범위 탭 전환 - 전체', async ({ page }) => {
    await page.getByText('전체', { exact: true }).click();
    await page.waitForTimeout(300);

    await expect(page.getByText('전체 진행 현황')).toBeVisible();
    // 전체 탭에서는 범위 힌트 없음
    await expect(page.getByText('(최근 7일)')).not.toBeVisible();
    await expect(page.getByText('(최근 30일)')).not.toBeVisible();
  });

  test('TC-09-4. 주간 탭 다시 선택 - 주간 힌트 표시', async ({ page }) => {
    // 월간 → 주간 순서로 탭 전환
    await page.getByText('월간', { exact: true }).click();
    await page.waitForTimeout(200);
    await page.getByText('주간', { exact: true }).click();
    await page.waitForTimeout(300);

    await expect(page.getByText('(최근 7일)')).toBeVisible();
  });

  test('TC-09-5. Streak 카드 요소 확인', async ({ page }) => {
    await expect(page.getByText('현재 연속')).toBeVisible();
    await expect(page.getByText('최고 기록')).toBeVisible();
    await expect(page.getByText('🔥')).toBeVisible();
    await expect(page.getByText('🏆')).toBeVisible();
  });

  test('TC-09-6. 통계 그리드 4가지 항목 확인', async ({ page }) => {
    await expect(page.getByText('완료된 과제')).toBeVisible();
    await expect(page.getByText('남은 과제')).toBeVisible();
    await expect(page.getByText('완료된 목표')).toBeVisible();
    await expect(page.getByText('진행 중 목표')).toBeVisible();
  });

  test('TC-09-7. 주간 체크 현황에 요일 표시', async ({ page }) => {
    // exact: true - '수'가 '수면 개선' 등 다른 텍스트와 substring 매칭되지 않도록
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    for (const day of days) {
      await expect(page.getByText(day, { exact: true }).first()).toBeVisible();
    }
  });

  test('TC-09-8. 세부 목표별 진행률 목록에 블록 표시', async ({ page }) => {
    // 홈 스크린이 스택 배경에 남아 있어 같은 블록명이 2회 매칭될 수 있으므로 .first() 사용
    await expect(page.getByText('운동 루틴').first()).toBeVisible();
    await expect(page.getByText('식단 관리').first()).toBeVisible();
  });

  test('TC-09-9. 세부 목표 행 탭 → 블록 상세로 이동', async ({ page }) => {
    // 세부 목표별 진행률의 "운동 루틴" 탭
    // 텍스트가 여러 번 나올 수 있으므로 마지막 것 사용 (진행률 리스트)
    await page.getByText('운동 루틴').last().click();
    await page.waitForTimeout(800);

    // 블록 상세 화면으로 이동 (홈 힌트 텍스트 사라짐)
    await expect(page.getByText('블록을 탭하여 상세 보기')).not.toBeVisible();
    await expect(page.getByText('실행 과제')).toBeVisible();
  });

  test('TC-09-10. 뒤로 가기 → 대시보드 복귀', async ({ page }) => {
    await page.getByRole('link', { name: /back/i }).click();
    await page.waitForTimeout(800);

    await expect(page.getByText('블록을 탭하여 상세 보기')).toBeVisible();
  });
});
