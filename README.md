# Marco PDF

Lector PDF de escritorio para Windows, en español. Procesa tus documentos localmente.

## Funciones

- Lectura con zoom, ajuste de ancho, navegación y búsqueda de texto.
- Vista de texto seleccionable y copiable de la página actual.
- OCR español e inglés: genera otro PDF con texto buscable a partir de páginas escaneadas.
- Extraer rangos como `1-3,5,8-10` (vacío significa todas las páginas).
- Dividir cada N páginas o por tamaño máximo real en MB decimales.
- Si una página individual supera el límite, muestra un error sin crear resultados parciales.
- Abrir PDF protegidos mediante su contraseña.

## Usar la versión portable

Descarga el ZIP de la publicación de GitHub, descomprímelo completo y abre `Marco PDF.exe`. No requiere Python ni instalar Tesseract: incluye los idiomas español e inglés.

## Ejecutar desde código

Instala Python 3.12 para Windows y ejecuta `preparar.ps1`. Después abre `iniciar.bat`.

```powershell
powershell -ExecutionPolicy Bypass -File .\preparar.ps1
```

## Uso

Abre un PDF. En la barra lateral, selecciona las páginas y el tipo de división. Los resultados se guardan en una nueva subcarpeta de la carpeta elegida, sin reemplazar archivos existentes. Para OCR, selecciona el idioma y pulsa **Crear PDF con texto**; después abre el resultado para buscar o copiar el texto reconocido.

El OCR rasteriza las páginas sin texto a 200 ppp. Las que ya tienen texto se conservan sin OCR adicional. La calidad depende del escaneo; revisa el texto reconocido. El OCR no recupera texto de imágenes dentro de páginas que ya contienen texto. La división conserva páginas completas y no reduce la calidad para forzar un tamaño. Los documentos grandes pueden tardar y requerir memoria; durante una operación espera a que termine. Las firmas digitales y marcadores originales no se conservan en los documentos derivados. Los originales no se modifican.

## Desarrollo y pruebas

```powershell
.\.venv\Scripts\python.exe -m unittest -v
.\.venv\Scripts\python.exe -m pip install pyinstaller==6.22.3
.\.venv\Scripts\python.exe -m PyInstaller --noconfirm --windowed --name "Marco PDF" --add-data "tessdata;tessdata" app.py
```

Motor PDF: [PyMuPDF](https://pymupdf.readthedocs.io/en/latest/). OCR: [Tesseract tessdata_fast](https://github.com/tesseract-ocr/tessdata_fast), datos bajo Apache 2.0. PyMuPDF y este programa se distribuyen bajo AGPL-3.0; consulta `LICENSE`.
