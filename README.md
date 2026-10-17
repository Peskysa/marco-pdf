# Marco PDF

Lector PDF con OCR para **Windows, Linux, web y Android**, en español. Procesa tus documentos en tu dispositivo.

## Descargas y versiones

Las descargas se publican en [GitHub Releases](https://github.com/Peskysa/marco-pdf/releases/latest).

| Plataforma | Formato | Cómo abrirlo |
| --- | --- | --- |
| Windows 10/11 x64 | Instalador `.exe` | Ejecutar el instalador; incluye desinstalación y accesos directos |
| Windows 10/11 x64 | Portable `.zip` | Descomprimir la carpeta completa y abrir `Marco PDF.exe` |
| Linux x64 | `.deb` | `sudo apt install ./Marco-PDF-Linux-amd64.deb` |
| Linux x64 | Portable `.tar.gz` | Extraer y ejecutar el archivo `Marco PDF` dentro de la carpeta |
| Web | Web privada y `.zip` estático | [Abrir Marco PDF](https://marco-pdf.peskysa.chatgpt.site), o servir el ZIP por HTTP/HTTPS |
| Android 7+ | APK firmado | Descargar e instalar permitiendo la instalación desde esa fuente |

Linux requiere Ubuntu 22.04 o posterior, o una distribución compatible con glibc 2.35 y escritorio X11/Wayland con XWayland. Android necesita Android System WebView actualizado. La app Android es de instalación directa y no está publicada en Google Play. Las versiones de escritorio y Android incluyen los idiomas OCR y funcionan sin conexión. La web necesita conexión para cargar la aplicación; los PDF no se envían a servidores. La web alojada es privada, accesible con tu cuenta de ChatGPT.

## Funciones

- Lectura con zoom, ajuste de ancho, navegación y búsqueda de texto.
- Vista de texto seleccionable y copiable de la página actual.
- OCR español e inglés: genera otro PDF con texto buscable a partir de páginas escaneadas.
- Extraer rangos como `1-3,5,8-10` (vacío significa todas las páginas).
- Dividir cada N páginas o por tamaño máximo real en MB decimales.
- Si una página individual supera el límite, muestra un error sin crear resultados parciales.
- Abrir PDF protegidos mediante su contraseña.

Los PDF protegidos con contraseña se abren en las versiones de escritorio. La web y Android muestran una indicación para usar escritorio. En Android, los resultados se guardan o comparten mediante el selector del sistema. Web/Android permiten descargar todos los fragmentos juntos en ZIP. El OCR web crea una capa de texto latino buscable: los caracteres fuera de Windows-1252 se sustituyen por `?`.

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

## Web y Android

Requieren Node.js 24 y pnpm 11.25.0:

```sh
cd web
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm dev
```

La carpeta `web/dist` es la web estática completa con motores OCR e idiomas incluidos. No se abre directamente con doble clic en `index.html`: necesita un servidor HTTP/HTTPS. Para desarrollo Android instala JDK 21 y SDK Android 36, ejecuta `pnpm android:sync` y abre `web/android` en Android Studio. La compilación de publicación utiliza una clave privada guardada en secretos GitHub, nunca en el repositorio; también hay una copia de seguridad local en `.signing/`, que debes custodiar junto a su contraseña. Para compilar localmente usa `ANDROID_KEY_PASSWORD` y coloca la clave en `web/android/app/marco-pdf.p12`, o utiliza `./gradlew assembleDebug` para pruebas.

El flujo **Compilar Marco PDF** en GitHub Actions prueba el motor PDF, ejecuta OCR real en navegador y genera todos los paquetes. La publicación se realiza solo cuando las compilaciones de las tres tareas terminan correctamente. No se ha probado en un teléfono Android físico. Consulta [THIRD_PARTY.md](THIRD_PARTY.md) para los componentes y licencias.
