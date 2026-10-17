import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { pageRange, serialize, splitDocument } from '../src/pdf.js';
async function sample() {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= 5; i++) doc.addPage().drawText(`Marco PDF page ${i}`);
  return doc;
}
test('ranges reject invalid input and preserve selected order', () => {
  assert.deepEqual(pageRange('3-4,1,3', 5), [2, 3, 0]);
  for (const value of ['0', '6', '2-1', 'x', '1,', '1-2-3']) assert.throws(() => pageRange(value, 5));
});
test('split into page groups with no missing pages', async () => {
  const parts = await splitDocument(await sample(), [0, 1, 2, 3, 4], 'pages', 2);
  assert.equal(parts.length, 3);
  assert.deepEqual(await Promise.all(parts.map(async data => (await PDFDocument.load(data)).getPageCount())), [2, 2, 1]);
});
test('check serialized byte sizes and oversized single pages', async () => {
  const doc = await sample();
  const limit = (await serialize(doc, [0, 1])).length;
  const parts = await splitDocument(doc, [0, 1, 2, 3, 4], 'size', limit / 1e6);
  assert.ok(parts.length > 1);
  assert.ok(parts.every(part => part.length <= limit));
  assert.equal((await Promise.all(parts.map(async p => (await PDFDocument.load(p)).getPageCount()))).reduce((a, b) => a + b), 5);
  await assert.rejects(() => splitDocument(doc, [0], 'size', .00001), /página 1/);
  for (const value of [0, -1, NaN, Infinity, 1.5]) await assert.rejects(() => splitDocument(doc, [0], 'pages', value));
});
