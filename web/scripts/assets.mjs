import { mkdir, readdir, copyFile, readFile, writeFile, access, cp } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(import.meta.url);
const pdfjs = path.dirname(require.resolve('pdfjs-dist/package.json'));
for (const folder of ['wasm', 'cmaps', 'standard_fonts']) {
  await cp(path.join(pdfjs, folder), new URL(`../public/pdfjs/${folder}`, import.meta.url), { recursive: true });
}
const dest = new URL('../public/ocr/', import.meta.url);
await mkdir(dest, { recursive: true });
const core = path.dirname(require.resolve('tesseract.js-core/package.json'));
for (const name of await readdir(core)) {
  if (/\.wasm(\.js)?$/.test(name)) await copyFile(path.join(core, name), new URL(name, dest));
}
await copyFile(require.resolve('tesseract.js/dist/worker.min.js'), new URL('worker.min.js', dest));
for (const lang of ['spa', 'eng', 'fra']) {
  const file = new URL(`${lang}.traineddata.gz`, dest);
  try { await access(file); } catch {
    let bytes;
    try { bytes = await readFile(new URL(`../../tessdata/${lang}.traineddata`, import.meta.url)); }
    catch {
      const response = await fetch(`https://github.com/tesseract-ocr/tessdata_fast/raw/main/${lang}.traineddata`);
      if (!response.ok) throw new Error(`No se pudo descargar ${lang}`);
      bytes = Buffer.from(await response.arrayBuffer());
    }
    await writeFile(file, gzipSync(bytes));
  }
}

const { execFileSync } = await import('node:child_process');
const { fileURLToPath } = await import('node:url');
const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
execFileSync('git', ['archive','--format=zip','--prefix=marco-pdf/','--output=web/public/Source.zip','HEAD'], {cwd:projectRoot});
for (const file of ['LICENSE','NOTICE','THIRD_PARTY.md']) await copyFile(new URL('../../'+file,import.meta.url),new URL('../public/'+file,import.meta.url));
await copyFile(new URL('../../docs/MANUAL.md',import.meta.url),new URL('../public/MANUAL.md',import.meta.url));
