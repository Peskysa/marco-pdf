// Capturas de la aplicación real con documentos ficticios, sin datos personales.
import { chromium } from 'playwright';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const output = new URL('../../docs/images/', import.meta.url);
const temporary = new URL('../../test-output/screenshots/', import.meta.url);
await mkdir(output, { recursive: true }); await mkdir(temporary, { recursive: true });
const doc = await PDFDocument.create();
const regular = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);
const green = rgb(.09, .24, .25), muted = rgb(.42, .50, .45), paper = rgb(.98, .97, .94);
for (let i = 0; i < 4; i++) {
  const p = doc.addPage([720, 600]);
  p.drawRectangle({ x: 0, y: 0, width: 720, height: 600, color: paper });
  p.drawRectangle({ x: 45, y: 532, width: 40, height: 30, color: green });
  p.drawText('M', { x: 55, y: 539, size: 19, font: bold, color: paper });
  p.drawText('ARCHIVO DE EJEMPLO', { x: 100, y: 541, size: 10, font: bold, color: muted });
  p.drawText(String(i + 1).padStart(2, '0') + ' / 04', { x: 613, y: 541, size: 10, font: regular, color: muted });
  p.drawText(['Tu archivo,', 'Un documento,', 'Todo el texto,', 'Listo para'][i], { x: 46, y: 438, size: 46, font: bold, color: green });
  p.drawText(['bien organizado.', 'muchas posibilidades.', 'a tu alcance.', 'compartir.'][i], { x: 46, y: 383, size: 40, font: regular, color: green });
  p.drawText('Marco PDF · Documento de demostración', { x: 48, y: 340, size: 14, font: regular, color: muted });
  p.drawLine({ start: { x: 48, y: 308 }, end: { x: 672, y: 308 }, thickness: 1, color: rgb(.81, .84, .77) });
  for (const [j, label] of ['Lee y busca en tus documentos.', 'Extrae páginas y divide por tamaño.', 'Convierte escaneos en texto buscable.'].entries()) {
    p.drawText('0' + (j + 1), { x: 48, y: 264 - j * 47, size: 12, font: bold, color: muted });
    p.drawText(label, { x: 92, y: 264 - j * 47, size: 16, font: regular, color: green });
  }
  p.drawText('Contenido ficticio. Esta muestra no contiene datos personales.', { x: 48, y: 58, size: 10, font: regular, color: muted });
}
const sample = new URL('Ejemplo-Marco-PDF.pdf', temporary);
await writeFile(sample, await doc.save());
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1040 }, deviceScaleFactor: 1 });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.APP_URL || 'http://127.0.0.1:5173/');
  await page.screenshot({ path: fileURLToPath(new URL('inicio.png', output)), fullPage: true });
  await page.setInputFiles('#file', fileURLToPath(sample));
  await page.waitForFunction(() => document.getElementById('status').textContent.includes('Documento abierto'));
  await page.screenshot({ path: fileURLToPath(new URL('lector.png', output)), fullPage: true });
  await page.fill('#range', '1-4'); await page.fill('#amount', '2'); await page.click('#split');
  await page.waitForFunction(() => document.getElementById('status').textContent.includes('2 archivos'));
  await page.screenshot({ path: fileURLToPath(new URL('division.png', output)), fullPage: true });
  const image = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1600; canvas.height = 1000;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 1600, 1000);
    ctx.fillStyle = '#173e40'; ctx.font = 'bold 70px Arial'; ctx.fillText('MARCO PDF', 100, 180);
    ctx.fillStyle = '#303d36'; ctx.font = '44px Arial';
    ctx.fillText('Este documento era una imagen.', 100, 310);
    ctx.fillText('Ahora puedes buscar y copiar su texto.', 100, 400);
    ctx.font = '32px Arial'; ctx.fillText('OCR en español e inglés. Todo en tu dispositivo.', 100, 540);
    ctx.fillStyle = '#758078'; ctx.fillText('Muestra ficticia sin datos personales.', 100, 820);
    return canvas.toDataURL('image/png');
  });
  const scan = await PDFDocument.create(); const png = await scan.embedPng(image);
  scan.addPage([800, 500]).drawImage(png, { x: 0, y: 0, width: 800, height: 500 });
  const scanFile = new URL('Escaneo-de-ejemplo.pdf', temporary); await writeFile(scanFile, await scan.save());
  await page.setInputFiles('#file', fileURLToPath(scanFile));
  await page.waitForFunction(() => document.getElementById('status').textContent.includes('Documento abierto'));
  await page.click('#ocr');
  await page.waitForFunction(() => document.getElementById('status').textContent.includes('PDF con texto listo'), { timeout: 120000 });
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#files button').click()]);
  const ocrFile = new URL('Escaneo-con-texto.pdf', temporary); await download.saveAs(fileURLToPath(ocrFile));
  await page.setInputFiles('#file', fileURLToPath(ocrFile));
  await page.waitForFunction(() => document.getElementById('status').textContent.includes('Documento abierto'));
  await page.click('#toggle-text');
  if (!(await page.textContent('#text')).includes('buscar y copiar')) throw new Error('El OCR no produjo el texto esperado.');
  await page.screenshot({ path: fileURLToPath(new URL('ocr.png', output)), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 }); await page.click('#fit');
  await page.screenshot({ path: fileURLToPath(new URL('movil.png', output)), fullPage: true });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Desbordamiento móvil.');
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Cinco capturas reales generadas; lectura, división y OCR comprobados.');
} finally { await browser.close(); }
