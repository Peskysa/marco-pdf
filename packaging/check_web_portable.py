"""Comprueba el servidor y los idiomas del EXE portable web compilado."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import urllib.request

exe = Path(sys.argv[1]).resolve()
with tempfile.TemporaryDirectory(prefix='marco-web-check-') as folder:
    report = Path(folder) / 'server.json'
    process = subprocess.Popen([str(exe), '--serve-test', str(report)], cwd=folder,
                               creationflags=subprocess.CREATE_NO_WINDOW)
    try:
        for _ in range(200):
            if report.exists():
                break
            if process.poll() is not None:
                raise RuntimeError('El portable web se cerró antes de arrancar.')
            time.sleep(.1)
        data = json.loads(report.read_text(encoding='utf-8'))
        assert data['url'].startswith('http://127.0.0.1:')
        for resource in ('', 'ocr/spa.traineddata.gz', 'ocr/eng.traineddata.gz', 'ocr/fra.traineddata.gz', 'ocr/worker.min.js'):
            with urllib.request.urlopen(data['url'] + resource) as response:
                assert response.status == 200 and response.read()
        print('EXE Web Portable OK: recursos locales y ES/EN/FR incluidos.')
    finally:
        subprocess.run(['taskkill', '/PID', str(process.pid), '/T', '/F'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        process.wait(timeout=10)
