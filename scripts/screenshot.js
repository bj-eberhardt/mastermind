import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
})();
