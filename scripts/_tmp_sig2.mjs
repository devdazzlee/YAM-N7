import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);
await page.evaluate(async () => {
  const step = 400;
  for (let y = 0; y < 8600; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
});
// wait much longer this time
await page.waitForTimeout(4000);

const info = await page.evaluate(() => {
  const spans = Array.from(document.querySelectorAll('.sig-shimmer span > span'));
  return spans.slice(0,3).map(s => ({ text: s.textContent, style: s.getAttribute('style') }));
});
console.log('AFTER LONG WAIT:', JSON.stringify(info, null, 2));

// nudge scroll by 1px to force a fresh intersection recompute
await page.mouse.wheel(0, 5);
await page.waitForTimeout(1500);
const info2 = await page.evaluate(() => {
  const spans = Array.from(document.querySelectorAll('.sig-shimmer span > span'));
  return spans.slice(0,3).map(s => ({ text: s.textContent, style: s.getAttribute('style') }));
});
console.log('AFTER WHEEL NUDGE:', JSON.stringify(info2, null, 2));

await page.screenshot({ path: 'scripts/_out_sig2.png' });
await browser.close();
