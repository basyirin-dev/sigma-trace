import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 1. Title screen
  console.log('📸 Title screen...');
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'docs/output/screenshots/title-screen.png' });
  console.log('   ✅ title-screen.png');

  // 2. Strategy Mode
  console.log('📸 Strategy Mode...');
  await page.goto(BASE + '/strategy', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'docs/output/screenshots/strategy-mode.png' });
  console.log('   ✅ strategy-mode.png');

  // 3. Detective Mode (Case 1)
  console.log('📸 Detective Mode...');
  await page.goto(BASE + '/detective/case-01', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'docs/output/screenshots/detective-board.png' });
  console.log('   ✅ detective-board.png');

  await browser.close();
  console.log('\n✅ All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('❌ Capture failed:', err.message);
  process.exit(1);
});
