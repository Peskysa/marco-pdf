"""Construye el portable Windows de archivo único con todos los idiomas OCR."""
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parent.parent
if sys.platform != 'win32':
    raise SystemExit('Este paquete EXE se compila en Windows.')
subprocess.run([
    sys.executable, '-m', 'PyInstaller', '--noconfirm', '--clean', '--onefile',
    '--windowed', '--name', 'Marco-PDF-Portable',
    '--add-data', f'{root / "tessdata"};tessdata',
    '--add-data', f'{root / "web" / "src" / "translations.json"};web/src',
    '--add-data', f'{root / "LICENSE"};.',
    '--add-data', f'{root / "NOTICE"};.',
    '--add-data', f'{root / "licenses"};licenses',
    str(root / 'app.py'),
], cwd=root, check=True)
print('Creado dist/Marco-PDF-Portable.exe')
