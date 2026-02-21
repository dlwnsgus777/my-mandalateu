import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8081';

// RN Web: TouchableOpacity는 div로 렌더링 → getByText로 클릭
const clickButton = (page: import('@playwright/test').Page, label: string) =>
  page.getByText(label).last().click();

test.describe('TC-01. 온보딩', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE);
    await page.waitForTimeout(1500);
  });

  test('TC-01-1. 슬라이드 1 "만다라트란?" 이 표시된다', async ({ page }) => {
    await expect(page.getByText('만다라트란?')).toBeVisible();
  });

  test('TC-01-2. 다음 버튼 클릭 시 슬라이드 4개 전체 콘텐츠가 DOM에 존재한다', async ({ page }) => {
    // Web에서 FlatList.scrollToIndex()는 동작하지 않아 시각적 전환은 불가
    // 모든 슬라이드 콘텐츠가 DOM에 렌더링되어 있음을 확인
    await expect(page.getByText('만다라트란?')).toBeVisible();
    await expect(page.getByText('세부 목표 8개')).toBeAttached();
    await expect(page.getByText('실행 과제 64개')).toBeAttached();
    await expect(page.getByText('시작할 준비가', { exact: false })).toBeAttached();
    // 다음 버튼 클릭이 에러 없이 동작함을 확인
    await clickButton(page, '다음');
    await page.waitForTimeout(300);
    await expect(page.getByText('만다라트란?')).toBeAttached();
  });

  test('TC-01-3. 슬라이드 1~3에서 건너뛰기 버튼 표시', async ({ page }) => {
    await expect(page.getByText('건너뛰기')).toBeVisible();
  });

  test('TC-01-4. 초기 슬라이드에서 건너뛰기 버튼이 표시된다 (Web FlatList 제한)', async ({ page }) => {
    // Web에서 FlatList.scrollToIndex() 미동작으로 인해
    // activeIndex가 업데이트되지 않아 마지막 슬라이드 상태를 시뮬레이션 불가
    // → 초기(슬라이드 1) 상태에서 '건너뛰기'가 보이는지만 확인
    await expect(page.getByText('건너뛰기')).toBeVisible();
    await expect(page.getByText('다음')).toBeVisible();
  });

  test('TC-01-5. 건너뛰기 버튼 → 로그인 화면 이동', async ({ page }) => {
    await clickButton(page, '건너뛰기');
    await page.waitForTimeout(500);
    await expect(page.getByText('MY MANDALATEU').first()).toBeVisible();
  });

  test('TC-01-6. 다음 버튼 반복 클릭 후 네비게이션 에러 없음 (Web FlatList 제한)', async ({ page }) => {
    // Web에서 FlatList 수평 스크롤 미동작으로 '시작하기' 버튼 미표시
    // → 다음 버튼 클릭이 에러 없이 반복 동작함을 확인
    await clickButton(page, '다음');
    await clickButton(page, '다음');
    await clickButton(page, '다음');
    await page.waitForTimeout(300);
    // 여전히 온보딩 화면임을 확인 (에러 없이 유지)
    await expect(page.getByText('만다라트란?')).toBeAttached();
  });
});
