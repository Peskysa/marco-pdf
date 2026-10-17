<p align="center"><img src="assets/banner.svg" alt="Marco PDF. Lee. Reconoce. Divide. Windows, Linux, web y Android." width="100%"></p>

<p align="center">
<a href="LICENSE"><img alt="Licencia AGPL-3.0" src="https://img.shields.io/badge/licencia-AGPL--3.0-173e40?style=flat-square"></a>
<a href="https://github.com/Peskysa/marco-pdf/actions/workflows/release.yml"><img alt="Compilación y pruebas" src="https://github.com/Peskysa/marco-pdf/actions/workflows/release.yml/badge.svg"></a>
<a href="https://github.com/Peskysa/marco-pdf/releases/latest"><img alt="Última versión" src="https://img.shields.io/github/v/release/Peskysa/marco-pdf?color=173e40&style=flat-square"></a>
</p>

<p align="center"><strong>Tus documentos, en orden.</strong><br>Lee PDF, convierte escaneos en texto buscable y divide archivos por páginas o megas.<br>En español, con procesamiento en tu dispositivo.</p>

<p align="center"><a href="https://marco-pdf.peskysa.chatgpt.site"><strong>ABRIR MARCO PDF WEB</strong></a> · <a href="https://github.com/Peskysa/marco-pdf/releases/latest">Descargas</a> · <a href="docs/README.md">Documentación</a> · <a href="https://github.com/Peskysa/marco-pdf/issues/new/choose">Ayuda y sugerencias</a></p>

---

## Un espacio para tus PDF

Abre un documento, recorre sus páginas, ajusta el zoom y busca texto. Utiliza los rangos de la barra lateral para elegir qué páginas quieres procesar. El archivo original se conserva.

![Lector de Marco PDF con un documento ficticio abierto](docs/images/lector.png)

## Elige dónde usarlo

| Plataforma | Formatos | Para empezar |
| --- | --- | --- |
| **Windows 10/11, x64** | Instalador EXE y ZIP portable | [Descargar para Windows](https://github.com/Peskysa/marco-pdf/releases/latest) |
| **Linux, x64** | Paquete DEB y TAR.GZ portable | [Descargar para Linux](https://github.com/Peskysa/marco-pdf/releases/latest) |
| **Web** | Navegador y ZIP para alojar | [Abrir la web privada](https://marco-pdf.peskysa.chatgpt.site) |
| **Android** | APK firmado para instalación directa | [Descargar APK](https://github.com/Peskysa/marco-pdf/releases/latest) |

**No necesitas Python ni Node.js para usar los paquetes compilados.** Windows, Linux y Android incluyen el motor OCR y los idiomas español e inglés. La web necesita conexión para cargar sus recursos; después procesa los PDF en el navegador. El ZIP web se sirve por HTTP/HTTPS, no se abre directamente con doble clic.

Linux requiere Ubuntu 22.04 o una distribución compatible con glibc 2.35 y entorno gráfico. El proyecto Android tiene mínimo Android 7, pero necesita un WebView actualizado compatible con las bibliotecas web. El APK está compilado y firmado; no se ha probado en un teléfono físico ni está publicado en Google Play. La web y el repositorio mantienen acceso privado. [Requisitos completos](docs/INSTALACION.md).

## Lo que puedes hacer

| Leer y encontrar | Preparar y compartir |
| --- | --- |
| Navegar por páginas y ajustar el zoom | Extraer rangos como `1-3,5,8-10` |
| Buscar texto y ver una versión copiable | Crear un archivo cada N páginas |
| Abrir PDF con contraseña en escritorio | Dividir por tamaño máximo real en MB |
| OCR en español, inglés o ambos | Descargar las partes en ZIP en web/Android |

### Divide sin perder páginas

Selecciona un número de páginas o un límite de megas. Marco PDF comprueba el tamaño del PDF resultante antes de aceptarlo. Si una página individual supera el límite, muestra un aviso para aumentarlo; no corta una página por la mitad ni reduce su calidad para forzar el tamaño.

![División real de un documento de cuatro páginas en dos archivos](docs/images/division.png)

### Haz que tus escaneos tengan texto

Selecciona el idioma y crea otro PDF con una capa de texto buscable. Abre el resultado para buscar y copiar su contenido. El OCR trabaja sobre las páginas que no tienen texto; las que ya lo tienen se conservan.

<table><tr><td width="74%"><img src="docs/images/ocr.png" alt="Escaneo procesado con OCR y texto reconocido visible"></td><td width="26%"><img src="docs/images/movil.png" alt="Aplicación web en una pantalla móvil simulada de 390 píxeles"></td></tr><tr><td align="center">De imagen a texto buscable.</td><td align="center">También en pequeño.</td></tr></table>

Capturas de la aplicación web real con contenido ficticio sin datos personales. La vista móvil simula un ancho de 390 píxeles; no es una captura de un teléfono Android físico. [Cómo reproducir las capturas](docs/CAPTURAS.md).

## Empieza en tres pasos

1. Pulsa **Abrir PDF** o arrastra un documento a la web.
2. Deja el campo de páginas vacío para usar todas, o escribe un rango como `2-5,8`.
3. Elige **Dividir PDF** o **Crear PDF con OCR** y guarda el resultado.

En escritorio se elige una carpeta para las partes y un nombre para el resultado OCR. En web aparecen botones de descarga; en Android se abre el menú del sistema para guardar o compartir. [Manual con ejemplos](docs/MANUAL.md).

## Documentación

- [Instalación y requisitos](docs/INSTALACION.md): Windows, Linux, portable, web y Android.
- [Manual](docs/MANUAL.md): lectura, OCR, rangos y división por páginas o megas.
- [Preguntas frecuentes](docs/PREGUNTAS.md): tamaño, PDF protegidos y problemas habituales.
- [Privacidad](docs/PRIVACIDAD.md): procesamiento y archivos guardados.
- [Desarrollo y compilación](docs/DESARROLLO.md): arquitectura, pruebas y paquetes.
- [Galería y capturas](docs/CAPTURAS.md), [historial](CHANGELOG.md) y [versión 1.1](docs/releases/v1.1.0.md).
- [Contribuir](CONTRIBUTING.md), [seguridad](SECURITY.md) y [terceros](THIRD_PARTY.md).
- [Licencia explicada](docs/LICENCIA.md) y [texto íntegro de AGPL-3.0](LICENSE).

## Alcance y limitaciones

El OCR no es perfecto: depende de la resolución, la orientación y la calidad del escaneo. Revisa el texto antes de utilizarlo. Las páginas mixtas que ya contienen texto no reciben OCR adicional en sus imágenes. La versión web usa una capa de texto latino; sustituye por `?` los caracteres que su fuente no puede representar.

Los documentos derivados no conservan las firmas digitales ni los marcadores originales. No es un editor de contenido, un compresor ni una herramienta de firma. Los archivos grandes pueden consumir bastante memoria. Los PDF con contraseña se abren únicamente en escritorio. [Diferencias entre plataformas](docs/MANUAL.md).

## Para desarrollar

Escritorio usa Python 3.12, PyMuPDF, Pillow y Tkinter. Web y Android comparten PDF.js, pdf-lib y Tesseract.js; Android utiliza Capacitor.

```sh
cd web
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm dev
```

Se necesitan Node.js 24 y pnpm 11.25.0. Las compilaciones de GitHub ejecutan pruebas de división por páginas y bytes, OCR real y un recorrido del navegador. [Instrucciones completas](docs/DESARROLLO.md).

## Licencia y autoría

Creado por **Marco Pescador**. Código e identidad visual originales bajo [GNU AGPL versión 3](LICENSE). Puedes usar, estudiar, modificar y redistribuir el programa cumpliendo esa licencia. Los componentes de terceros conservan sus licencias.

Se mantiene AGPL-3.0 porque el motor de escritorio PyMuPDF se utiliza bajo su opción AGPL. [Licencia y fuentes oficiales](docs/LICENCIA.md).
