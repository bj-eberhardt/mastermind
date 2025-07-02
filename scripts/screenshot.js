import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  const mainScreen = await page.$('[data-element-id="main-screen"]');
  if (!mainScreen) {
    throw new Error('Element mit data-element-id="main-screen" wurde nicht gefunden');
  }

  await mainScreen.screenshot({ path: 'img/screenshot-main-screen.png' });
  await browser.close();
})();
