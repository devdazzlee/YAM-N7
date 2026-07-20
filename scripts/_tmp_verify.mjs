import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(6000);
await page.screenshot({ path: 'scripts/_out_hero_v2.png' });

await page.evaluate(async () => {
  const step = 400;
  for (let y = 0; y < 8600; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
});
await page.waitForTimeout(2000);
await page.screenshot({ path: 'scripts/_out_signature_v2.png' });
await browser.close();
