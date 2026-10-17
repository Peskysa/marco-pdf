"""Empaqueta manuales, capturas y licencias sin incluir código privado de firma."""
import hashlib
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
target = root / 'dist' / 'Marco-PDF-Documentacion.zip'
target.parent.mkdir(exist_ok=True)
files = [root / name for name in ['README.md', 'LICENSE', 'NOTICE', 'THIRD_PARTY.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'SECURITY.md']]
for folder in ['docs', 'assets', 'licenses']:
    files.extend(p for p in (root / folder).rglob('*') if p.is_file())
with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(files):
        archive.write(path, path.relative_to(root))
digest = hashlib.sha256(target.read_bytes()).hexdigest()
target.with_suffix('.zip.sha256').write_text(f'{digest}  {target.name}\n', encoding='utf-8')
print(f'{len(files)} archivos de documentación, capturas y licencias empaquetados en {target.name}.')
