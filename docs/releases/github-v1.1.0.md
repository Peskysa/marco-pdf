# Marco PDF 1.1 · Windows, Linux, web y Android

Lector PDF en español, con **OCR local** y división por páginas o tamaño máximo en megas. Creado por **Marco Pescador**.

**[Abrir aplicación web](https://marco-pdf.peskysa.chatgpt.site)** · [Ver capturas reales](https://github.com/Peskysa/marco-pdf/blob/main/docs/CAPTURAS.md) · [Manual](https://github.com/Peskysa/marco-pdf/blob/main/docs/MANUAL.md)

## Qué archivo descargar

| Uso | Archivo |
| --- | --- |
| Instalar en Windows 10/11 x64 | `Marco-PDF-Windows-Instalador.exe` |
| Windows sin instalación | `Marco-PDF-Windows-Portable.zip` |
| **Windows portable de un único EXE, sin descomprimir** | **`Marco-PDF-Portable.exe`** |
| Instalar en Debian/Ubuntu compatibles, x64 | `Marco-PDF-Linux-amd64.deb` |
| Linux portable, x64 | `Marco-PDF-Linux-Portable.tar.gz` |
| Alojar la aplicación web por HTTP/HTTPS | `Marco-PDF-Web.zip` |
| Instalar directamente en Android | `Marco-PDF-Android.apk` |
| Manuales, licencia y capturas para descargar | `Marco-PDF-Documentacion.zip` |

Los paquetes Windows, Linux y Android incluyen los idiomas OCR español e inglés. No requieren instalar Python o Node.js. **Para abrirlo directamente en Windows, descarga `Marco-PDF-Portable.exe` y haz doble clic**: incluye lector y OCR en un archivo y extrae sus componentes temporales automáticamente. Su suma está en `Marco-PDF-Portable.exe.sha256`. El ZIP web necesita un servidor HTTP/HTTPS. La web alojada y el repositorio son privados.

## Funciones

- Lectura, zoom, navegación, búsqueda y texto copiable.
- OCR de páginas escaneadas sin texto previo, en español e inglés.
- Selección de rangos como `1-3,5,8-10`.
- División por número de páginas o tamaño real máximo por archivo.
- Comprobación del límite: si una página individual lo supera, se solicita aumentarlo.
- Descarga de todas las partes en ZIP en web/Android.

## Guías y licencia

- [Instalación por plataforma](https://github.com/Peskysa/marco-pdf/blob/main/docs/INSTALACION.md).
- [Manual con ejemplos](https://github.com/Peskysa/marco-pdf/blob/main/docs/MANUAL.md), [preguntas frecuentes](https://github.com/Peskysa/marco-pdf/blob/main/docs/PREGUNTAS.md) y [privacidad](https://github.com/Peskysa/marco-pdf/blob/main/docs/PRIVACIDAD.md).
- [Licencia GNU AGPL-3.0](https://github.com/Peskysa/marco-pdf/blob/main/LICENSE), [explicación](https://github.com/Peskysa/marco-pdf/blob/main/docs/LICENCIA.md) y [terceros](https://github.com/Peskysa/marco-pdf/blob/main/THIRD_PARTY.md).
- [Capturas del lector, división, OCR y pantalla pequeña](https://github.com/Peskysa/marco-pdf/blob/main/docs/CAPTURAS.md).

El ZIP de documentación reúne los manuales, capturas, licencia y avisos de terceros. Su suma está en `Marco-PDF-Documentacion.zip.sha256`; las sumas de los paquetes originales permanecen en `SHA256SUMS.txt`. El EXE portable único es una descarga adicional y los paquetes originales conservan sus bytes.

## Verificación y límites

Compilaciones correctas de Windows, Linux y Android; pruebas de motor y recorrido real del navegador con OCR de un escaneo. El APK está firmado con clave propia, pero aún no se ha probado en un móvil físico y no está en Google Play. La vista móvil de la galería es una simulación de navegador.

Linux requiere un entorno compatible con Ubuntu 22.04/glibc 2.35 y escritorio gráfico. Android necesita WebView actualizado compatible. El OCR puede cometer errores y no se aplica a imágenes dentro de páginas que ya tienen texto. Los derivados no conservan firmas digitales ni marcadores. Los PDF protegidos con contraseña se abren en escritorio. Consulta el manual antes de procesar documentos interactivos.
