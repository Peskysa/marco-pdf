import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const target = new URL('../../test-output/offline/', import.meta.url);
await mkdir(target, { recursive: true });
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1365, height: 1000 }, acceptDownloads: true });
  const external = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') return route.continue();
    external.push(url.href); return route.abort();
  });
  await page.goto(process.env.APP_URL || 'http://127.0.0.1:5173/');
  for (const [locale, label] of [['en', 'Open PDF'], ['fr', 'Ouvrir un PDF'], ['es', 'Abrir PDF']]) {
    await page.selectOption('#ui-language', locale);
    await page.waitForFunction(locale => document.documentElement.lang === locale && !document.getElementById('ui-language').disabled, locale);
    assert.ok((await page.locator('header .open').textContent()).includes(label));
  }
  const raster = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = 1800; c.height = 1200;
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#000'; ctx.font = '56px Arial';
    ctx.fillText('Bonjour, voici un document pour Marco PDF.', 90, 180);
    ctx.fillText('Le texte est disponible sans connexion Internet.', 90, 300);
    ctx.fillText('Español, English et Français.', 90, 420);
    return c.toDataURL('image/png');
  });
  const scan = await PDFDocument.create(), image = await scan.embedPng(raster);
  scan.addPage([900, 600]).drawImage(image, { x: 0, y: 0, width: 900, height: 600 });
  const input = new URL('scan.pdf', target); await writeFile(input, await scan.save());
  await page.setInputFiles('#file', fileURLToPath(input));
  await page.waitForFunction(() => document.getElementById('status').textContent.includes('Documento abierto'));
  for (const language of ['spa', 'eng', 'fra', 'spa+eng+fra']) {
    await page.selectOption('#language', language);
    await page.click('#ocr');
    await page.waitForFunction(() => document.getElementById('status').textContent.includes('PDF con texto listo'), { timeout: 120000 });
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#files button').click()]);
    const path = new URL(`${language}.pdf`, target); await download.saveAs(fileURLToPath(path));
    // Keep the scan as input for each real OCR job. Check the French output by reopening it afterwards.
  }
  await page.setInputFiles('#file', fileURLToPath(new URL('fra.pdf', target)));
  await page.waitForFunction(() => document.getElementById('status').textContent.includes('Documento abierto'));
  await page.click('#toggle-text');
  assert.ok((await page.textContent('#text')).includes('Bonjour'));
  await page.selectOption('#ui-language', 'fr');
  await page.waitForFunction(() => document.getElementById('status').textContent.includes('Document ouvert'));
  await page.screenshot({ path: fileURLToPath(new URL('../../docs/images/frances.png', import.meta.url)), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 }); await page.click('#fit');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(external, []); assert.deepEqual(errors, []);
  console.log('Offline OK: ES/EN/FR interface, 4 OCR language modes, zero external requests, mobile.');
} finally { await browser.close(); }
