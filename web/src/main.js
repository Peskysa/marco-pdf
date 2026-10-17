import './style.css';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Capacitor } from '@capacitor/core';
import { pageRange, splitDocument } from './pdf.js';
import { recognizeDocument } from './ocr.js';
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
const $ = id => document.getElementById(id);
let doc, view, documentLoading, filename, current = 1, zoom = 1, busy = false, rendering, results = [];
const status = (text, error = false) => { $('status').textContent = text; $('status').classList.toggle('error', error); };
function setBusy(value) {
  busy = value;
  for (const element of document.querySelectorAll('button,input,select')) element.disabled = value || (!doc && !['file', 'file-empty', 'range', 'amount', 'mode', 'language'].includes(element.id));
}
async function task(action) {
  if (busy) return;
  setBusy(true);
  try { await action(); } catch (error) { console.error(error); status(error.message || 'No se pudo completar la operación.', true); }
  finally { setBusy(false); }
}
async function open(file) {
  if (!file) return;
  await task(async () => {
    status('Abriendo documento…');
    const bytes = new Uint8Array(await file.arrayBuffer());
    const loading = pdfjs.getDocument({ data: bytes.slice(), isEvalSupported: false });
    let nextView;
    try {
      nextView = await loading.promise;
      const nextDoc = await PDFDocument.load(bytes);
      if (documentLoading) await documentLoading.destroy();
      doc = nextDoc; view = nextView; documentLoading = loading; rendering = undefined;
    } catch (error) {
      await loading.destroy();
      throw new Error(/password|encrypted/i.test(error.message) ? 'Este PDF está protegido. Ábrelo con contraseña en la versión de escritorio.' : 'No se pudo abrir el PDF. Comprueba que es un archivo válido.');
    }
    filename = file.name.replace(/\.pdf$/i, ''); current = 1;
    $('filename').textContent = file.name;
    $('details').textContent = `${doc.getPageCount()} páginas · ${(file.size / 1e6).toFixed(2)} MB`;
    $('total').textContent = `/ ${doc.getPageCount()}`;
    $('page').max = doc.getPageCount(); $('range').value = '';
    $('empty').hidden = true; $('reader').hidden = false; $('results').hidden = true;
    results = [];
    await fit();
    status('Documento abierto · Procesamiento en tu dispositivo');
  });
}
async function render() {
  if (!view) return;
  if (rendering) { rendering.cancel(); try { await rendering.promise; } catch {} }
  const page = await view.getPage(current);
  const viewport = page.getViewport({ scale: zoom });
  const canvas = $('canvas');
  canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
  rendering = page.render({ canvasContext: canvas.getContext('2d'), viewport });
  try { await rendering.promise; } catch (error) { if (error.name === 'RenderingCancelledException') return; throw error; }
  $('page').value = current; $('zoom').textContent = `${Math.round(zoom * 100)}%`;
  const content = await page.getTextContent();
  $('text').textContent = content.items.map(item => item.str + (item.hasEOL ? '\n' : ' ')).join('') || 'Esta página no tiene texto. Utiliza el OCR.';
}
async function fit() {
  const page = await view.getPage(current);
  zoom = Math.max(.2, Math.min(2, ($('page-area').clientWidth - 50) / page.getViewport({ scale: 1 }).width));
  await render();
}
async function save(bytes, name, mime) {
  if (Capacitor.isNativePlatform()) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    const blob = new Blob([bytes], { type: mime });
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob);
    });
    const file = await Filesystem.writeFile({ path: `${Date.now()}-${name}`, data: dataUrl.split(',')[1], directory: Directory.Cache });
    await Share.share({ title: name, files: [file.uri] });
  } else {
    const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
    const link = document.createElement('a'); link.href = url; link.download = name; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
}
function showResults(files) {
  results = files;
  $('files').replaceChildren();
  for (const file of files) {
    const button = document.createElement('button');
    button.textContent = `${file.name} · ${(file.bytes.length / 1e6).toFixed(2)} MB`;
    button.onclick = () => task(() => save(file.bytes, file.name, 'application/pdf'));
    $('files').append(button);
  }
  if (files.length > 1) {
    const button = document.createElement('button'); button.textContent = 'Guardar todo en ZIP';
    button.onclick = () => task(async () => {
      status('Preparando ZIP…');
      const zip = new JSZip(); for (const file of results) zip.file(file.name, file.bytes);
      await save(await zip.generateAsync({ type: 'uint8array' }), `${filename}_partes.zip`, 'application/zip'); status('ZIP preparado');
    });
    $('files').prepend(button);
  }
  $('results').hidden = false;
}
$('file').onchange = event => open(event.target.files[0]);
$('file-empty').onchange = event => open(event.target.files[0]);
$('mode').onchange = () => {
  const size = $('mode').value === 'size'; $('amount').step = size ? '.1' : '1'; $('amount').min = size ? '.001' : '1';
  $('amount').value = size ? '10' : '1'; $('unit').textContent = size ? 'MB como máximo' : 'páginas';
};
$('prev').onclick = () => task(async () => { current = Math.max(1, current - 1); await render(); });
$('next').onclick = () => task(async () => { current = Math.min(doc.getPageCount(), current + 1); await render(); });
$('page').onchange = () => task(async () => { current = Math.max(1, Math.min(doc.getPageCount(), Math.trunc(Number($('page').value)) || 1)); await render(); });
$('plus').onclick = () => task(async () => { zoom = Math.min(3, zoom * 1.2); await render(); });
$('minus').onclick = () => task(async () => { zoom = Math.max(.2, zoom / 1.2); await render(); });
$('fit').onclick = () => task(fit);
$('toggle-text').onclick = () => { $('text').hidden = !$('text').hidden; };
$('split').onclick = () => task(async () => {
  const pages = pageRange($('range').value, doc.getPageCount());
  status('Dividiendo documento…'); $('results').hidden = true;
  const parts = await splitDocument(doc, pages, $('mode').value, Number($('amount').value), n => status(`Dividiendo: ${n}/${pages.length} páginas`));
  showResults(parts.map((bytes, index) => ({ bytes, name: `${filename}_parte_${String(index + 1).padStart(3, '0')}.pdf` })));
  status(`${parts.length} archivos listos para guardar`);
});
$('ocr').onclick = () => task(async () => {
  const pages = pageRange($('range').value, doc.getPageCount()); $('results').hidden = true;
  const bytes = await recognizeDocument(doc, view, pages, $('language').value, text => status(`OCR · ${text}`));
  showResults([{ bytes, name: `${filename}_ocr.pdf` }]); status('PDF con texto listo. Guárdalo y ábrelo para buscar o copiar.');
});
$('find').onclick = () => task(async () => {
  const query = $('query').value.trim().toLocaleLowerCase(); if (!query) return;
  for (let n = 1; n <= view.numPages; n++) {
    const index = (current - 1 + n) % view.numPages + 1;
    const content = await (await view.getPage(index)).getTextContent();
    if (content.items.map(item => item.str).join(' ').toLocaleLowerCase().includes(query)) {
      current = index; await render(); $('text').hidden = false; status(`Texto encontrado en la página ${index}`); return;
    }
  }
  status('Sin coincidencias. Para escaneos, genera primero el PDF con OCR.');
});
$('query').onkeydown = event => { if (event.key === 'Enter') $('find').click(); };
document.addEventListener('dragover', event => { event.preventDefault(); document.body.classList.add('dragging'); });
document.addEventListener('dragleave', event => { if (!event.relatedTarget) document.body.classList.remove('dragging'); });
document.addEventListener('drop', event => { event.preventDefault(); document.body.classList.remove('dragging'); if (!busy) open(event.dataTransfer.files[0]); });
setBusy(false);
