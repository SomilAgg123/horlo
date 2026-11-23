import { expect, test, type Page } from '@playwright/test';

async function navigate(page: Page, name: RegExp) {
  const menu = page.getByRole('button', { name: 'Open navigation' });
  if (await menu.isVisible()) await menu.click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name })
    .click();
}

test('catalogue filtering, sorting, list view, and empty state', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.watch-card')).toHaveCount(8);
  await page.getByRole('button', { name: 'Dress', exact: true }).click();
  await expect(page.locator('.watch-card')).toHaveCount(2);
  await page.getByRole('searchbox', { name: 'Search watches' }).fill('nothing-matches');
  await expect(page.getByRole('heading', { name: 'No watches found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByLabel('Sort watches').selectOption('brand');
  await expect(page.locator('.watch-card').first()).toContainText('Cartier');
  await page.getByRole('button', { name: 'List view', exact: true }).click();
  await expect(page.locator('.watch-grid')).toHaveClass(/list-view/);
});

test('adding and removing a watch persists across reloads', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Add Cartier Tank Must to collection' }).click();
  await navigate(page, /My collection/);
  await expect(page.locator('.watch-card')).toHaveCount(4);
  await page.reload();
  await expect(page.locator('.watch-card')).toHaveCount(4);
  await page.getByRole('button', { name: 'Remove Cartier Tank Must from collection' }).click();
  await expect(page.locator('.watch-card')).toHaveCount(3);
});

test('deep links, detail zoom, and missing routes work under the Pages base path', async ({
  page,
}) => {
  await page.goto('./#/watch/cartier-tank');
  await expect(page.getByRole('heading', { name: 'Tank Must', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Dial detail', exact: true }).click();
  await expect(page.locator('.detail-image')).toHaveClass(/zoomed/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Tank Must', exact: true })).toBeVisible();
  expect(
    await page
      .locator('.detail-image img')
      .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
  ).toBe(true);
  await page.goto('./#/watch/not-a-watch');
  await expect(page.getByRole('heading', { name: 'Watch not found' })).toBeVisible();
  await page.goto('./#/missing');
  await expect(page.getByRole('heading', { name: 'A moment off track.' })).toBeVisible();
});

test('custom watch and local photo survive reload and remain discoverable', async ({ page }) => {
  await page.goto('./#/add');
  await page.getByLabel('Brand *', { exact: true }).fill('Studio');
  await page.getByLabel('Model *', { exact: true }).fill('Sunday watch');
  await page
    .getByLabel('Watch photo', { exact: true })
    .setInputFiles('tests/fixtures/watch-photo.png');
  await expect(page.getByAltText('Your selected watch')).toBeVisible();
  await page.getByRole('button', { name: 'Add to my collection', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sunday watch', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Sunday watch', exact: true })).toBeVisible();
  await expect(page.locator('.detail-image img')).toHaveAttribute('src', /^data:image\/jpeg/);
  await page.getByRole('button', { name: 'In your collection · Remove' }).click();
  await navigate(page, /^Discover$/);
  await page.getByRole('searchbox', { name: 'Search watches' }).fill('Studio');
  await expect(page.locator('.watch-card')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Add Studio Sunday watch to collection' }),
  ).toBeVisible();
});

test('invalid photo is rejected and required fields prevent empty entries', async ({ page }) => {
  await page.goto('./#/add');
  await page.getByRole('button', { name: 'Add to my collection', exact: true }).click();
  await expect(page).toHaveURL(/#\/add$/);
  await page.getByLabel('Watch photo', { exact: true }).setInputFiles({
    name: 'unsafe.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
  });
  await expect(page.getByRole('alert')).toContainText('JPEG, PNG, or WebP');
});

test('profile edits persist and demo reset leaves unrelated storage alone', async ({ page }) => {
  await page.goto('./#/profile');
  await page.evaluate(() => localStorage.setItem('unrelated-project', 'keep-me'));
  await page.getByLabel('Display name *', { exact: true }).fill('Sam Collector');
  await page.getByLabel('Your story', { exact: false }).fill('Collected for the stories.');
  await page.getByRole('button', { name: 'Save profile', exact: true }).click();
  await page.reload();
  await expect(page.getByLabel('Display name *', { exact: true })).toHaveValue('Sam Collector');
  const menu = page.getByRole('button', { name: 'Open navigation' });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await page.getByRole('button', { name: 'Keep exploring' }).click();
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Discover', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('unrelated-project'))).toBe('keep-me');
  await navigate(page, /^My profile$/);
  await expect(page.getByLabel('Display name *', { exact: true })).toHaveValue('Alex Morgan');
});

test('example public collection is fixed and works without local user data', async ({ page }) => {
  await page.goto('./#/shared/collectors-edit');
  await expect(
    page.getByRole('heading', { name: 'The collector’s edit', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.watch-card')).toHaveCount(4);
  await expect(page.locator('.watch-card .collect-button')).toHaveCount(0);
  await expect(page.getByText('This is a fixed example', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
