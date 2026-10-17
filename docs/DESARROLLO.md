# Desarrollo y compilación

[Índice](README.md) · [Contribuir](../CONTRIBUTING.md)

## Estructura

| Ruta | Contenido |
| --- | --- |
| `app.py` | Ventana de escritorio, lectura, búsqueda y guardado |
| `core.py` | Selección, serialización, división y OCR con PyMuPDF |
| `test_core.py` | Cinco pruebas del motor de escritorio |
| `web/src/` | Aplicación compartida por navegador y Android |
| `web/android/` | Proyecto nativo de Capacitor |
| `web/scripts/` | Recursos de compilación y capturas reproducibles |
| `web/tests/` | Pruebas del motor y recorrido real en navegador |
| `packaging/` | Instalador Windows, paquete Linux y utilidad de firma |
| `.github/workflows/release.yml` | Compilaciones y publicación de paquetes |
| `docs/`, `licenses/` | Manuales, capturas y textos de licencia |

## Escritorio en Windows

Requiere Python 3.12 con Tkinter y acceso a Internet durante la preparación:

```powershell
powershell -ExecutionPolicy Bypass -File .\preparar.ps1
.\.venv\Scripts\python.exe app.py
.\.venv\Scripts\python.exe -m unittest -v
```

El preparador instala `requirements.txt` y descarga español, inglés y francés en `tessdata/`. Los idiomas usados por las compilaciones de GitHub también se conservan comprimidos en `web/public/ocr/`.

```powershell
.\.venv\Scripts\python.exe -m pip install pyinstaller==6.22.3
.\.venv\Scripts\python.exe -m PyInstaller --noconfirm --windowed --name "Marco PDF" --add-data "tessdata;tessdata" --add-data "web/src/translations.json;web/src" app.py
```

Para el instalador utiliza Inno Setup 6 y `packaging/windows.iss` después de generar `dist/Marco PDF`. El flujo de publicación incluye también los documentos y licencias del proyecto.

Para generar el portable como **un único ejecutable**, desde la raíz:

```powershell
.\.venv\Scripts\python.exe packaging/build_portable.py
.\dist\Marco-PDF-Portable.exe --self-test portable-report.json
```

Se crea `dist/Marco-PDF-Portable.exe`, con motor PDF, idiomas OCR y licencias dentro del archivo. La comprobación incorporada abre una ventana oculta, renderiza un PDF, divide por páginas y bytes y realiza OCR real de un escaneo generado en memoria. Escribe un informe JSON y termina con error si falla. Para probar el aislamiento, copia solo el EXE a una carpeta vacía y ejecuta allí esa comprobación.

## Escritorio en Linux

Utiliza Python 3.12, Tkinter y un entorno gráfico. En una distribución compatible:

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt pyinstaller==6.22.3
python -c "import gzip,pathlib; p=pathlib.Path('tessdata'); p.mkdir(exist_ok=True); [(p/f'{l}.traineddata').write_bytes(gzip.decompress(pathlib.Path(f'web/public/ocr/{l}.traineddata.gz').read_bytes())) for l in ('spa','eng','fra')]"
python -m unittest -v
python app.py
python -m PyInstaller --noconfirm --windowed --name "Marco PDF" --add-data "tessdata:tessdata" --add-data "web/src/translations.json:web/src" app.py
bash packaging/linux.sh
```

El DEB se genera en Linux. No se consideran compilaciones cruzadas desde Windows.

## Web

Requiere Node.js 24 y pnpm 11.25.0:

```sh
cd web
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm dev
```

Abre la dirección que muestra Vite. `pnpm build` copia motores OCR, idiomas, decodificadores, mapas de caracteres y fuentes PDF; produce `web/dist` para servir por HTTP/HTTPS. El OCR no depende de un servicio remoto de reconocimiento.

## Pruebas del navegador

Con el servidor activo:

```sh
pnpm exec playwright install chromium
# Linux/macOS:
BROWSER_CHANNEL=chromium pnpm run test:browser
```

En PowerShell utiliza `$env:BROWSER_CHANNEL='chromium'` antes del comando. También admite `msedge` si Microsoft Edge está instalado. `APP_URL` cambia la dirección del servidor; por defecto es `http://127.0.0.1:5173/`.

Las pruebas verifican apertura, cambio de página, búsqueda, división, descarga, rechazo de un máximo imposible, OCR de una imagen y vista móvil sin desbordamiento. [Capturas reproducibles](CAPTURAS.md).

## Android

Instala JDK 21 y Android SDK 36; utiliza el proyecto incluido:

```sh
cd web
pnpm build
pnpm android:sync
cd android
chmod +x gradlew
./gradlew assembleDebug
```

En Windows usa `gradlew.bat assembleDebug`. El APK de pruebas queda en `app/build/outputs/apk/debug/`. Para una publicación, `assembleRelease` utiliza `app/marco-pdf.p12`, alias `marco-pdf`, y la variable `ANDROID_KEY_PASSWORD`.

La clave de publicación y su contraseña están en secretos GitHub (`ANDROID_KEYSTORE`, `ANDROID_KEY_PASSWORD`); no forman parte del repositorio ni de las descargas. La copia local del autor está excluida mediante `.gitignore`. Conserva esa copia privada para poder actualizar la aplicación con su misma identidad. `packaging/create_signing.py` es una utilidad de configuración del entorno del autor; requiere `cryptography`, GitHub CLI autenticado y adaptar la ruta de `gh` si se usa en otro equipo.

## Publicación

El flujo **Compilar Marco PDF** genera portable Windows, portable web Windows, instaladores Windows y Linux, ZIP web y APK firmado. Ejecuta los controles antes de publicar y añade sumas SHA-256. Las descargas actuales están en `v1.2.0`. Para otra versión, actualiza de forma coherente el nombre de versión de los paquetes y la etiqueta de publicación del flujo; no vuelvas a crear una etiqueta existente.

Los cambios solo de documentación se pueden subir y adjuntar a la publicación sin recompilar las aplicaciones. Esto no sustituye los paquetes ejecutables ya publicados.

## Portable web sin Internet

Después de `pnpm build` en `web/`, desde la raíz del proyecto:

```powershell
.\.venv\Scripts\python.exe packaging/build_web_portable.py
.\.venv\Scripts\python.exe packaging/check_web_portable.py dist/Marco-PDF-Web-Portable.exe
```

El EXE incluye servidor local, interfaz y los tres modelos OCR. `web_portable.py` escucha solo en `127.0.0.1` con un puerto libre y sirve recursos de lectura; no acepta subidas de PDF. La ventana permite abrir el navegador y cerrar el servidor. El modo `--serve-test informe.json` se utiliza en pruebas. `web/tests/offline.mjs` bloquea las peticiones fuera de localhost y verifica interfaz ES/EN/FR, OCR con cada idioma y los tres juntos, y pantalla pequeña.
