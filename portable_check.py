"""Comprobación del ejecutable compilado, sin archivos ni programas externos."""
import json
from pathlib import Path
import pymupdf as pdf
from core import split_pages, split_megabytes, ocr_document, tessdata_dir


def run(report, window_class):
    checks = []
    try:
        with pdf.open() as source:
            for number in range(3):
                source.new_page().insert_text((60, 100), f'Marco PDF page {number+1}', fontsize=28)
            parts = split_pages(source, [0, 1, 2], 2)
            assert len(parts) == 2
            checks.append('División por páginas')
            sized = split_megabytes(source, [0, 1, 2], .002)
            assert all(len(part) <= 2000 for part in sized)
            checks.append('Límite real de bytes')
            with pdf.open() as scan:
                page = scan.new_page()
                page.insert_image(page.rect, pixmap=source[0].get_pixmap(dpi=200))
                assert not page.get_text().strip()
                recognized = ocr_document(scan, [0], 'spa+eng')
            with pdf.open('pdf', recognized) as result:
                assert 'Marco' in result[0].get_text()
            checks.append('OCR español e inglés incluidos')
            app = window_class()
            app.withdraw()
            app.doc = pdf.open('pdf', parts[0])
            app.update_idletasks()
            app.render()
            assert app.photo.width() > 0
            app.close()
            checks.append('Ventana y renderizado PDF')
        Path(report).write_text(json.dumps({'ok': True, 'checks': checks, 'bundled_ocr': '_MEI' in tessdata_dir()}, ensure_ascii=False, indent=2), encoding='utf-8')
        return 0
    except Exception as error:
        Path(report).write_text(json.dumps({'ok': False, 'checks': checks, 'error': str(error)}, ensure_ascii=False, indent=2), encoding='utf-8')
        return 1
