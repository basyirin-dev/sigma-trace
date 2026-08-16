import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const OUT = 'docs/output/screenshots/victory-all-s.png';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Single page load on /victory with ?dev so window.__GIHA_DEV__ exists.
  // State must be injected on THIS page — a reload wipes the in-memory store.
  console.log('📸 Loading Victory Screen with dev API...');
  await page.goto(BASE + '/victory?dev', { waitUntil: 'domcontentloaded' });
  await page.getByText('MISSION COMPLETE').waitFor({ timeout: 8000 });

  console.log('📸 Injecting all-S game state...');
  await page.evaluate(() => {
    const dev = window.__GIHA_DEV__;
    if (!dev) throw new Error('__GIHA_DEV__ not available');

    dev.completeCase('case-01', 'S');
    dev.completeCase('case-02', 'S');
    dev.completeCase('case-03', 'S');
    dev.setGameState({ sigma: 85, r0: 0.5, budget: 400 });
    dev.setTick(120);
    dev.addIncome(100);
    dev.forceWin();
  });

  // Zustand updates reactively — wait until the grade circle shows S
  // (CSS module classes are hashed, hence the *= match)
  await page.waitForFunction(
    () => document.querySelector('[class*="gradeLetter"]')?.textContent === 'S',
    undefined,
    { timeout: 8000 },
  );
  await page.waitForTimeout(800);

  // Verify grade rendered as S (gold #f39c12) via computed style
  const gradeColor = await page.evaluate(
    () => getComputedStyle(document.querySelector('[class*="gradeLetter"]')).color,
  );
  console.log(`   🎨 grade letter color: ${gradeColor} (expected rgb(243, 156, 18) for S)`);
  if (gradeColor !== 'rgb(243, 156, 18)') {
    throw new Error(`Unexpected grade color ${gradeColor} — composite grade is not S`);
  }

  const { clip, innerHeight } = await page.evaluate(() => {
    const scrollers = [...document.querySelectorAll('div')].filter(
      (e) => e.scrollHeight > e.clientHeight + 2,
    );
    const scroller = scrollers.sort((a, b) => a.scrollHeight - b.scrollHeight).at(-1);
    if (!scroller) return { clip: null, innerHeight: window.innerHeight };
    const r = scroller.getBoundingClientRect();
    return {
      clip: { x: r.left, y: r.top, width: r.width, height: scroller.scrollHeight },
      innerHeight: window.innerHeight,
    };
  });
  console.log(
    `   📐 scroll container: ${clip ? `x=${clip.x} y=${clip.y} ${clip.width}x${clip.height}` : 'none (fits viewport)'}`,
  );

  console.log('📸 Capturing Victory Screen...');
  if (clip && clip.height > innerHeight) {
    // Grow the viewport to the scroll container's content height so the
    // nested scroller has no overflow; then fullPage captures everything.
    await page.setViewportSize({ width: clip.width, height: clip.height });
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: OUT, fullPage: true });
  console.log('   ✅ ' + OUT);

  await browser.close();
  console.log('\n✅ Victory screenshot captured successfully!');
}

capture().catch((err) => {
  console.error('❌ Capture failed:', err.message);
  process.exit(1);
});
