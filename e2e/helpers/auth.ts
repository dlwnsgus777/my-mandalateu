import { Page } from '@playwright/test';

export const TEST_EMAIL = `e2e_${Date.now()}@test.com`;
export const TEST_PASSWORD = 'password1234';
export const TEST_NICKNAME = 'E2E테스터';

/** 로그인 화면으로 이동 (LocalStorage 초기화 후) */
export async function goToLogin(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
  await page.waitForTimeout(1500);
  // 온보딩이 뜨면 건너뛰기
  const skip = page.getByText('건너뛰기');
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
    await page.waitForTimeout(500);
  }
}

/** 로그인 수행 */
export async function login(page: Page, email: string, password: string) {
  await page.getByPlaceholder('example@email.com').fill(email);
  await page.getByPlaceholder('비밀번호를 입력하세요').fill(password);
  await page.getByRole('button', { name: '로그인' }).click();
}
