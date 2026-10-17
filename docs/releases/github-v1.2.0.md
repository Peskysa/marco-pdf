# Marco PDF 1.2 · Seis versiones · Español / English / Français

**Todas las variantes incluyen interfaz y OCR en español, inglés y francés**, con idiomas individuales o los tres juntos. Se incorpora un portable web completo para trabajar sin Internet ni instalación.

| Versión | Archivo / acceso | Internet para usarla |
| --- | --- | --- |
| Portable de escritorio Windows x64 | `Marco-PDF-Portable.exe` | No |
| Portable web Windows x64 | `Marco-PDF-Web-Portable.exe` | No: abre tu navegador en localhost |
| Web normal | [Abrir web privada](https://marco-pdf.peskysa.chatgpt.site) · `Marco-PDF-Web.zip` para alojar | Sí para la alojada |
| Instalador Windows x64 | `Marco-PDF-Windows-Instalador.exe` | No tras descargar e instalar |
| Instalador Linux amd64 | `Marco-PDF-Linux-amd64.deb` | No para el procesamiento |
| Android | `Marco-PDF-Android.apk` | No tras descargar e instalar |

**Para el ordenador sin Internet:** lleva `Marco-PDF-Web-Portable.exe` en un USB, ábrelo y conserva su ventana abierta. Tu navegador mostrará la aplicación en una dirección `127.0.0.1` de tu equipo. Los PDF no se suben y el OCR utiliza los modelos incluidos. No necesitas instalar Python, Node.js ni Tesseract. El equipo debe permitir ejecutar el EXE y utilizar localhost.

El portable de escritorio es también un único EXE. El instalador Windows funciona para el usuario actual sin permisos de administrador. Linux requiere un entorno compatible con Ubuntu 22.04/glibc 2.35 y permisos del gestor de paquetes para instalar el DEB. Android utiliza la misma clave de firma y aumenta el número de versión; aún no se ha probado en un teléfono físico y necesita WebView actualizado compatible.

## Documentación y capturas

- [Instalación de las seis versiones](https://github.com/Peskysa/marco-pdf/blob/main/docs/INSTALACION.md).
- [Manual](https://github.com/Peskysa/marco-pdf/blob/main/docs/MANUAL.md), [privacidad](https://github.com/Peskysa/marco-pdf/blob/main/docs/PRIVACIDAD.md) y [preguntas frecuentes](https://github.com/Peskysa/marco-pdf/blob/main/docs/PREGUNTAS.md).
- [Capturas reales, incluida interfaz francesa](https://github.com/Peskysa/marco-pdf/blob/main/docs/CAPTURAS.md).
- `Marco-PDF-Documentacion.zip`: guías, imágenes y licencias. `SHA256SUMS.txt`: comprobación de todas las descargas.

## Pruebas y licencia

Pruebas del motor de escritorio y web, OCR real de los tres idiomas, cuatro modos de reconocimiento y cambio de interfaz. El portable web se ha probado desde su EXE aislado, bloqueando las peticiones fuera de localhost. Los paquetes se publican cuando todas las compilaciones terminan correctamente.

Código original de Marco Pescador bajo [AGPL-3.0](https://github.com/Peskysa/marco-pdf/blob/main/LICENSE); [licencias de terceros](https://github.com/Peskysa/marco-pdf/blob/main/THIRD_PARTY.md). El OCR puede cometer errores. Los derivados no conservan firmas ni marcadores y los PDF con contraseña se abren en escritorio. Las publicaciones 1.1 permanecen como versiones históricas sin francés.
