// Renders public/og.png (1200x630 social preview) with the system Chrome.
// Usage: node scripts/og.mjs
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const portrait = readFileSync(new URL('../public/images/portrait.jpg', import.meta.url)).toString('base64');

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@500&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #fafaf7; font-family: Geist, sans-serif; color: #121317; overflow: hidden; position: relative; }
  .glow { position: absolute; width: 520px; height: 520px; right: 40px; top: 40px; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(35,72,224,.22), transparent); filter: blur(30px); }
  .wrap { position: relative; display: flex; align-items: center; justify-content: space-between; height: 100%; padding: 0 80px; }
  .pill { display: inline-flex; align-items: center; gap: 10px; padding: 9px 18px; border-radius: 999px; background: #121317; color: #fff;
          font: 500 18px 'JetBrains Mono', monospace; letter-spacing: .06em; }
  .dot { width: 9px; height: 9px; border-radius: 50%; background: #22a06b; }
  h1 { font: 700 96px/0.95 'Space Grotesk', sans-serif; letter-spacing: -0.04em; margin: 28px 0 22px; }
  h1 span { color: #2348e0; display: block; }
  .role { display: flex; align-items: center; gap: 16px; font-size: 30px; font-weight: 500; color: #3a3d45; }
  .dash { width: 56px; height: 4px; border-radius: 4px; background: linear-gradient(90deg, #2348e0, rgba(35,72,224,0)); }
  .url { margin-top: 34px; font: 500 22px 'JetBrains Mono', monospace; color: #5b5e66; }
  .photo { position: relative; width: 360px; height: 450px; border-radius: 28px; overflow: hidden;
           box-shadow: 0 40px 80px -40px rgba(18,19,23,.5), 0 0 0 1px rgba(18,19,23,.06); }
  .photo img { width: 100%; height: 100%; object-fit: cover; }
  .frame { position: absolute; right: 58px; top: 72px; width: 170px; height: 170px; border: 2px solid rgba(35,72,224,.45); border-radius: 22px; }
</style></head><body>
  <div class="glow"></div><div class="frame"></div>
  <div class="wrap">
    <div>
      <span class="pill"><span class="dot"></span>AI ENGINEER I @ MOMO</span>
      <h1>Nguyen<span>Quoc Nghia</span></h1>
      <p class="role"><span class="dash"></span>LLM agents · evaluation · infrastructure</p>
      <p class="url">quocnghia32.github.io</p>
    </div>
    <div class="photo"><img src="data:image/jpeg;base64,${portrait}" alt=""></div>
  </div>
</body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: new URL('../public/og.png', import.meta.url).pathname, type: 'png' });
await browser.close();
console.log('wrote public/og.png');
