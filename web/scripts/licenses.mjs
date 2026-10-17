// Conserva los textos originales instalados de las dependencias de ejecución JS.
import { createRequire } from 'node:module';
import { readFile, readdir, mkdir, copyFile, writeFile, access, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../../licenses/javascript/', import.meta.url));
await mkdir(output, { recursive: true });
const visited = new Set(), inventory = [];
async function collect(name, parent) {
  const require = createRequire(path.join(parent, 'package.json'));
  let file;
  try { file = require.resolve(name + '/package.json'); }
  catch {
    try {
      let dir = path.dirname(require.resolve(name));
      while (dir !== path.dirname(dir)) {
        try { const p = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8')); if (p.name === name) { file = path.join(dir, 'package.json'); break; } } catch {}
        dir = path.dirname(dir);
      }
    } catch {}
  }
  if (!file) return;
  const folder = path.dirname(file), pkg = JSON.parse(await readFile(file, 'utf8'));
  const id = `${pkg.name}@${pkg.version}`;
  if (visited.has(id)) return; visited.add(id);
  const destination = path.join(output, id.replaceAll('/', '--'));
  await mkdir(destination, { recursive: true });
  const copies = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    if (!/^(license|licence|copying|notice|copyright)([._-]|$)/i.test(entry.name)) continue;
    await cp(path.join(folder, entry.name), path.join(destination, entry.name), { recursive: true }); copies.push(entry.name);
  }
  inventory.push({ package: pkg.name, version: pkg.version, license: pkg.license, files: copies });
  for (const dependency of Object.keys(pkg.dependencies || {})) await collect(dependency, folder);
}
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
for (const name of Object.keys(pkg.dependencies)) await collect(name, root);
inventory.sort((a, b) => a.package.localeCompare(b.package));
await writeFile(path.join(output, 'inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
console.log(`${inventory.length} componentes JS documentados con sus textos originales disponibles.`);
