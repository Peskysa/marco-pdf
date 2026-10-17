"""Empaqueta servidor local y web completa en un EXE sin instalación."""
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parent.parent
if sys.platform != 'win32':
    raise SystemExit('El lanzador EXE se compila en Windows.')
subprocess.run([
    sys.executable, '-m', 'PyInstaller', '--noconfirm', '--clean', '--onefile',
    '--windowed', '--name', 'Marco-PDF-Web-Portable',
    '--add-data', f'{root / "web" / "dist"};web/dist',
    '--add-data', f'{root / "LICENSE"};.',
    '--add-data', f'{root / "NOTICE"};.',
    '--add-data', f'{root / "licenses"};licenses',
    str(root / 'web_portable.py'),
], cwd=root, check=True)
