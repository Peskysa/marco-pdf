import { createWorker } from 'tesseract.js';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function recognizeDocument(source, view, pages, language, progress) {
  const out = await PDFDocument.create();
  const font = await out.embedFont(StandardFonts.Helvetica);
  const base = new URL(import.meta.env.BASE_URL + 'ocr/', location.href).href;
  let worker;
  try {
    for (const [index, number] of pages.entries()) {
      progress(`Página ${index + 1} de ${pages.length}`);
      const page = await view.getPage(number + 1);
      const text = await page.getTextContent();
      if (text.items.some(item => item.str?.trim())) {
        const [copy] = await out.copyPages(source, [number]);
        out.addPage(copy);
        continue;
      }
      worker ||= await createWorker(language, 1, {
        workerPath: base + 'worker.min.js', corePath: base, langPath: base.replace(/\/$/, ''),
        logger: event => {
          if (event.status === 'recognizing text') progress(`Página ${index + 1}/${pages.length} · ${Math.round(event.progress * 100)}%`);
        }
      });
      const viewport = page.getViewport({ scale: 200 / 72 });
      if (viewport.width * viewport.height > 30_000_000) throw new Error('La página es demasiado grande para OCR en este dispositivo. Usa la versión de escritorio.');
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      const { data } = await worker.recognize(canvas, {}, { blocks: true, text: true });
      const width = viewport.width * 72 / 200, height = viewport.height * 72 / 200;
      const result = out.addPage([width, height]);
      const image = await out.embedPng(canvas.toDataURL('image/png'));
      result.drawImage(image, { x: 0, y: 0, width, height });
      const scale = width / canvas.width;
      for (const block of data.blocks || []) for (const paragraph of block.paragraphs || []) for (const line of paragraph.lines || []) {
        // The invisible layer uses the same coordinates as the displayed raster.
        const content = [...line.text.trim()].map(char => {
          try { font.encodeText(char); return char; } catch { return '?'; }
        }).join('');
        if (!content) continue;
        const size = Math.max(1, (line.bbox.y1 - line.bbox.y0) * scale * .85);
        result.drawText(content, { x: line.bbox.x0 * scale, y: height - line.bbox.y1 * scale, size, font, opacity: 0 });
      }
      canvas.width = canvas.height = 0;
    }
    return out.save();
  } finally { if (worker) await worker.terminate(); }
}
