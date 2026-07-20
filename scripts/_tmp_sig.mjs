import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);
// incremental scroll instead of a big jump
await page.evaluate(async () => {
  const step = 400;
  for (let y = 0; y < 8600; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
});
await page.waitForTimeout(1500);
await page.screenshot({ path: 'scripts/_out_sig_incremental.png' });

const info = await page.evaluate(() => {
  const h2 = document.querySelector('.sig-shimmer');
  if (!h2) return { found: false };
  const spans = Array.from(h2.querySelectorAll('span > span'));
  return {
    found: true,
    h2Text: h2.textContent,
    h2Rect: h2.getBoundingClientRect(),
    wordSpans: spans.map(s => ({
      text: s.textContent,
      style: s.getAttribute('style'),
      rect: s.getBoundingClientRect(),
    })).slice(0, 6),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
