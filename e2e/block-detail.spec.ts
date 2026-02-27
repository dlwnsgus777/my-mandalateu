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

async function goToBlockDetail(
  page: import('@playwright/test').Page,
  blockName = '운동 루틴',
) {
  await goToHome(page);
  await page.getByText(blockName).first().click();
  await page.waitForTimeout(800);
}

// ─── TC-05. 블록 상세 - 네비게이션 ────────────────────────────────────────────

test.describe('TC-05. 블록 상세', () => {
  test.beforeEach(async ({ page }) => {
    await goToHome(page);
  });

  test('TC-05-1. 블록 탭 → 홈 화면 고유 요소가 사라진다', async ({ page }) => {
    await expect(page.getByText('블록을 탭하여 상세 보기')).toBeVisible();

    await page.getByText('운동 루틴').first().click();
    await page.waitForTimeout(800);

    await expect(page.getByText('블록을 탭하여 상세 보기')).not.toBeVisible();
  });

  test('TC-05-3. 뒤로 가기 → 홈 복귀', async ({ page }) => {
    await page.getByText('운동 루틴').first().click();
    await page.waitForTimeout(800);
    await expect(page.getByText('블록을 탭하여 상세 보기')).not.toBeVisible();

    await page.getByRole('link', { name: /back/i }).click();
    await page.waitForTimeout(800);

    await expect(page.getByText('블록을 탭하여 상세 보기')).toBeVisible();
  });
});

// ─── TC-06. 블록 상세 - 실행 과제 편집 ──────────────────────────────────────

test.describe('TC-06. 블록 상세 - 실행 과제 편집', () => {
  test.beforeEach(async ({ page }) => {
    await goToBlockDetail(page, '운동 루틴');
  });

  test('TC-06-1. 블록 상세 기본 요소 확인', async ({ page }) => {
    await expect(page.getByText('실행 과제')).toBeVisible();
    await expect(page.getByText(/\d+ \/ 8 완료/)).toBeVisible();
    await expect(page.getByText('셀을 탭하여 제목 수정', { exact: false })).toBeVisible();
    // FAB (+) 버튼 확인
    await expect(page.getByText('+')).toBeVisible();
  });

  test('TC-06-2. 빈 셀 탭 → 실행 과제 편집 모달 표시', async ({ page }) => {
    await page.getByText('탭하여 입력').first().click();
    await page.waitForTimeout(300);

    await expect(page.getByText('실행 과제 수정')).toBeVisible();
    await expect(page.getByPlaceholder('실행 과제를 입력하세요')).toBeVisible();
  });

  test('TC-06-3. 셀 편집 후 저장 → 내용 반영', async ({ page }) => {
    await page.getByText('탭하여 입력').first().click();
    await page.waitForTimeout(300);

    const input = page.getByPlaceholder('실행 과제를 입력하세요');
    await input.fill('E2E 테스트 과제');
    await page.getByText('저장').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('실행 과제 수정')).not.toBeVisible();
    await expect(page.getByText('E2E 테스트 과제')).toBeVisible();
  });

  test('TC-06-4. 셀 편집 취소 → 내용 미반영', async ({ page }) => {
    const emptyCount = await page.getByText('탭하여 입력').count();
    await page.getByText('탭하여 입력').first().click();
    await page.waitForTimeout(300);

    await page.getByPlaceholder('실행 과제를 입력하세요').fill('취소할 내용');
    await page.getByText('취소').first().click();
    await page.waitForTimeout(300);

    await expect(page.getByText('실행 과제 수정')).not.toBeVisible();
    // 빈 셀 수가 줄지 않았는지 확인
    await expect(page.getByText('탭하여 입력')).toHaveCount(emptyCount);
  });

  test('TC-06-5. 체크박스 탭 → 완료 상태 토글', async ({ page }) => {
    const beforeChecked = await page.getByText('✅').count();
    // 첫 번째 미완료 체크박스 클릭
    await page.getByText('⬜').first().click();
    await page.waitForTimeout(400);

    const afterChecked = await page.getByText('✅').count();
    expect(afterChecked).toBe(beforeChecked + 1);
  });

  test('TC-06-6. FAB 클릭 → 빈 셀 편집 모달 오픈', async ({ page }) => {
    await page.getByText('+').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('실행 과제 수정')).toBeVisible();
  });

  test('TC-06-7. 다음 블록 네비게이션', async ({ page }) => {
    // 운동 루틴(첫 번째 블록)에서 오른쪽 네비게이션 버튼 클릭
    await page.getByText(/→$/).click();
    await page.waitForTimeout(800);

    // 다음 블록(식단 관리)으로 이동했는지 확인
    await expect(page.getByText('식단 관리')).toBeVisible();
  });

  test('TC-06-8. 메모 섹션 확장 및 내용 저장', async ({ page }) => {
    // 메모 섹션 헤더 클릭으로 확장
    await page.getByText('📝 메모 및 세부사항').click();
    await page.waitForTimeout(300);

    const memoInput = page.getByPlaceholder('이 목표에 대한 메모를 작성하세요...');
    await expect(memoInput).toBeVisible();

    await memoInput.fill('E2E 테스트 메모입니다.');
    await page.getByText('저장').last().click();
    await page.waitForTimeout(300);

    await expect(page.getByText('✓ 저장됨')).toBeVisible();
  });

  test('TC-06-9. 링크 추가 및 삭제', async ({ page }) => {
    await page.getByText('🔗 관련 링크 & 자료').click();
    await page.waitForTimeout(300);

    const linkInput = page.getByPlaceholder('URL을 입력하세요');
    await expect(linkInput).toBeVisible();
    await expect(page.getByText('등록된 링크가 없습니다')).toBeVisible();

    // 링크 추가
    await linkInput.fill('https://example.com');
    await page.getByText('추가').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('https://example.com')).toBeVisible();
    await expect(page.getByText('등록된 링크가 없습니다')).not.toBeVisible();

    // 링크 삭제
    await page.getByText('✕').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('https://example.com')).not.toBeVisible();
    await expect(page.getByText('등록된 링크가 없습니다')).toBeVisible();
  });
});

// ─── TC-06C. 중앙 블록 - 핵심 목표 편집 ──────────────────────────────────────

test.describe('TC-06C. 중앙 블록 편집', () => {
  test.beforeEach(async ({ page }) => {
    await goToBlockDetail(page, '🎯');
  });

  test('TC-06C-1. 중앙 블록 진입 시 핵심 목표 설정 화면 표시', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '핵심 목표 설정' })).toBeVisible();
    await expect(page.getByText('🎯 핵심 목표와 8개의 세부 목표를 입력하세요')).toBeVisible();
    await expect(page.getByText('셀을 탭하여 목표를 입력하세요')).toBeVisible();
  });

  test('TC-06C-2. 세부 목표 셀 탭 → 편집 모달 표시', async ({ page }) => {
    // 세부 목표 셀 클릭 (핵심 목표 아닌 셀)
    await page.getByText('세부 목표 입력').first().click();
    await page.waitForTimeout(300);

    await expect(page.getByText('세부 목표')).toBeVisible();
    await expect(page.getByPlaceholder('세부 목표를 입력하세요')).toBeVisible();
  });
});
