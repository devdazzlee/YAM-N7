import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
// wait generously for HMR/compile to fully settle and hero animations to finish
await page.waitForTimeout(6000);
await page.screenshot({ path: 'scripts/_out_hero_fresh.png' });

await page.evaluate(() => window.scrollTo(0, 8300));
await page.waitForTimeout(2500);
await page.screenshot({ path: 'scripts/_out_signature_fresh.png' });

console.log('CONSOLE_ERRORS:', JSON.stringify(errors));
await browser.close();
