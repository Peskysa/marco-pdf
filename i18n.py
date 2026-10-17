"""Catálogo compartido de interfaz ES/EN/FR para escritorio y web."""
import json
from pathlib import Path
import sys

_base = Path(getattr(sys, '_MEIPASS', Path(__file__).parent))
_catalog = json.loads((_base / 'web' / 'src' / 'translations.json').read_text(encoding='utf-8'))
_locale = 'es'


def set_locale(locale):
    global _locale
    _locale = locale if locale in ('es', 'en', 'fr') else 'es'


def tr(text, **values):
    translated = _catalog.get(text, [text, text])[{'es': 0, 'en': 0, 'fr': 1}[_locale]] if _locale != 'es' else text
    return translated.format(**values) if values else translated
