const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const filePath = path.resolve(__dirname, 'index.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

  // Set wide viewport first so layout renders fully
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });

  // Wait for fonts/images to settle
  await new Promise(r => setTimeout(r, 2000));

  // Measure full document height
  const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const fullWidth = 1200;

  // Resize viewport to full document dimensions
  await page.setViewport({ width: fullWidth, height: fullHeight, deviceScaleFactor: 1 });
  await new Promise(r => setTimeout(r, 500));

  // Generate single continuous PDF (no page breaks)
  await page.pdf({
    path: 'Tipy_Prva_Pomoc_v_Prirode.pdf',
    width: `${fullWidth}px`,
    height: `${fullHeight}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log(`PDF generated: ${fullWidth}x${fullHeight}px`);
  await browser.close();
})();
