"""Operaciones locales de Marco PDF."""
import math
import os
import sys
from pathlib import Path
import pymupdf as pdf
from i18n import tr


def pages_from_spec(spec, count):
    if not spec.strip():
        return list(range(count))
    result = []
    for part in spec.split(','):
        values = part.strip().split('-')
        if len(values) not in (1, 2) or not all(v.isdigit() for v in values):
            raise ValueError(tr('Usa páginas como 1-3,5,8-10.'))
        start, end = int(values[0]), int(values[-1])
        if not 1 <= start <= end <= count:
            raise ValueError(tr('Las páginas deben estar entre 1 y {count}.', count=count))
        result.extend(range(start - 1, end))
    return list(dict.fromkeys(result))


def serialize(doc, pages):
    with pdf.open() as out:
        for p in pages:
            out.insert_pdf(doc, from_page=p, to_page=p)
        return out.tobytes(garbage=4, deflate=True)


def split_pages(doc, pages, size):
    if size < 1:
        raise ValueError(tr('El número de páginas debe ser mayor que cero.'))
    return [serialize(doc, pages[i:i+size]) for i in range(0, len(pages), size)]


def split_megabytes(doc, pages, mb):
    if not math.isfinite(mb) or mb <= 0:
        raise ValueError(tr('Introduce un tamaño válido mayor que cero.'))
    limit = int(mb * 1_000_000)
    parts, pending, data = [], [], None
    for page in pages:
        candidate = serialize(doc, pending + [page])
        if len(candidate) <= limit:
            pending, data = pending + [page], candidate
            continue
        single = serialize(doc, [page])
        if len(single) > limit:
            raise ValueError(tr('La página {page} ocupa {size} MB y supera el límite. Aumenta el tamaño máximo.', page=page+1, size=f'{len(single)/1_000_000:.2f}'))
        if pending:
            parts.append(data)
        pending, data = [page], single
    if pending:
        parts.append(data)
    return parts


def tessdata_dir():
    base = Path(getattr(sys, '_MEIPASS', Path(__file__).parent))
    candidates = [base / 'tessdata', Path(os.environ.get('TESSDATA_PREFIX', 'tessdata')),
                  Path('C:/Program Files/Tesseract-OCR/tessdata')]
    for path in candidates:
        if all((path / f'{lang}.traineddata').exists() for lang in ('spa', 'eng', 'fra')):
            return str(path)
    raise ValueError(tr('Faltan los idiomas OCR. Ejecuta preparar.ps1 para incluir español, inglés y francés.'))


def ocr_document(doc, pages, language, progress=lambda x: None):
    out = pdf.open()
    try:
        folder = tessdata_dir()
        for n, index in enumerate(pages):
            page = doc[index]
            if page.get_text().strip():
                out.insert_pdf(doc, from_page=index, to_page=index)
            else:
                pix = page.get_pixmap(dpi=200, colorspace=pdf.csRGB, alpha=False)
                with pdf.open('pdf', pix.pdfocr_tobytes(language=language, tessdata=folder)) as recognized:
                    out.insert_pdf(recognized)
            progress(n + 1)
        return out.tobytes(garbage=4, deflate=True)
    finally:
        out.close()
