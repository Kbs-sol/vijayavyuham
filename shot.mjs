import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
// scroll a bit so header gets .scrolled (this triggered the backdrop-filter bug)
await page.evaluate(() => window.scrollTo(0, 120));
await page.waitForTimeout(500);
await page.click('#mobileToggle');
await page.waitForTimeout(600);
const state = await page.evaluate(() => {
  const nl = document.getElementById('navLinks');
  const bd = document.getElementById('navBackdrop');
  const cs = getComputedStyle(nl);
  return {
    navParent: nl.parentElement.tagName,
    bdParent: bd.parentElement.tagName,
    open: nl.classList.contains('open'),
    bg: cs.backgroundColor,
    visibility: cs.visibility,
    z: cs.zIndex,
    transform: cs.transform,
  };
});
console.log('STATE', JSON.stringify(state));
// try clicking a nav link to confirm clickability
await page.screenshot({ path: '/tmp/menu-open.png' });
await browser.close();
