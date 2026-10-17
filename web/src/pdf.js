import { PDFDocument } from 'pdf-lib';
import { t } from './i18n.js';

export function pageRange(spec, count) {
  if (!spec.trim()) return Array.from({ length: count }, (_, i) => i);
  const result = new Set();
  for (const part of spec.split(',')) {
    const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part.trim());
    if (!match) throw new Error(t('Usa páginas como 1-3,5,8-10.'));
    const start = Number(match[1]), end = Number(match[2] || match[1]);
    if (start < 1 || start > end || end > count) throw new Error(t('Elige páginas entre 1 y {count}.', { count }));
    for (let i = start; i <= end; i++) result.add(i - 1);
  }
  return [...result];
}

export async function serialize(doc, pages) {
  const out = await PDFDocument.create();
  for (const page of await out.copyPages(doc, pages)) out.addPage(page);
  return out.save();
}

export async function splitDocument(doc, pages, mode, amount, progress = () => {}) {
  if (!Number.isFinite(amount) || amount <= 0 || (mode === 'pages' && !Number.isInteger(amount))) {
    throw new Error(t('Introduce una cantidad válida mayor que cero. Las páginas deben ser un número entero.'));
  }
  const parts = [];
  if (mode === 'pages') {
    for (let i = 0; i < pages.length; i += amount) {
      parts.push(await serialize(doc, pages.slice(i, i + amount)));
      progress(Math.min(i + amount, pages.length));
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  } else {
    const limit = Math.floor(amount * 1_000_000);
    let pending = [], data;
    for (const [index, page] of pages.entries()) {
      const candidate = await serialize(doc, [...pending, page]);
      if (candidate.length <= limit) { pending.push(page); data = candidate; }
      else {
        const single = await serialize(doc, [page]);
        if (single.length > limit) throw new Error(t('La página {page} ocupa {size} MB y supera el límite. Aumenta el tamaño máximo.', { page: page + 1, size: (single.length / 1e6).toFixed(2) }));
        if (pending.length) parts.push(data);
        pending = [page]; data = single;
      }
      progress(index + 1);
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    if (pending.length) parts.push(data);
  }
  return parts;
}
