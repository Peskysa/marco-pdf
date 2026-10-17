# Las seis versiones de Marco PDF 1.2

[Índice](README.md) · [Manual](MANUAL.md) · [Descargas](https://github.com/Peskysa/marco-pdf/releases/tag/v1.2.0)

Todas incluyen **interfaz y OCR en español, inglés y francés**. La interfaz se elige en el selector superior y el idioma del documento en OCR. Los modelos de idioma van incluidos. No necesitas instalar Python, Node.js ni Tesseract para usar las aplicaciones compiladas.

## 1. Portable de escritorio

Descarga **`Marco-PDF-Portable.exe`** para Windows 10/11 x64 y ábrelo con doble clic. Es un solo archivo, sin instalación ni extracción manual. Incluye lector, herramientas y OCR; funciona sin Internet y sin permisos de administrador.

Puedes llevarlo en un USB. Al arrancar despliega sus componentes en la carpeta temporal de Windows y los limpia al cerrarse normalmente. Necesita que el equipo permita ejecutar el archivo y escribir temporales. El programa no evita las restricciones de ejecución de un ordenador gestionado.

## 2. Portable web sin Internet

Descarga **`Marco-PDF-Web-Portable.exe`** para Windows 10/11 x64 y ábrelo. Aparece una pequeña ventana y se abre tu navegador predeterminado en una dirección como `http://127.0.0.1:12345/`.

1. Mantén abierta la ventana del lanzador.
2. Utiliza el lector, el OCR y la división en el navegador.
3. Guarda los resultados mediante los botones de descarga.
4. Cuando termines, cierra la ventana del lanzador para detener el servidor local.

**No necesita Internet, instalación, Python ni un servidor instalado por separado.** El EXE contiene la web completa, sus fuentes, decodificadores y los tres modelos OCR. Solo escucha en la dirección local del equipo, no en la red ni en Internet. El puerto se elige automáticamente y puede cambiar al abrirlo de nuevo.

Necesita un navegador actualizado compatible, como Edge o Chrome, y permiso para ejecutar el lanzador y utilizar localhost. Los PDF se procesan en el navegador y no se suben al servidor local. Los componentes se extraen temporalmente al arrancar, igual que en el portable de escritorio.

## 3. Web normal

Abre [Marco PDF web](https://marco-pdf.peskysa.chatgpt.site) desde cualquier ordenador con un navegador compatible y conexión. Es privada: utiliza tu cuenta de ChatGPT autorizada.

También se ofrece **`Marco-PDF-Web.zip`** para alojar la aplicación en otro servidor HTTP/HTTPS. No se abre directamente mediante doble clic en `index.html` y no contiene el lanzador portable. Para usar la web en un Windows sin red y sin instalar herramientas, elige la opción 2.

Para desarrollo local con Python disponible, desde la carpeta descomprimida: `python -m http.server 8080 --bind 127.0.0.1`, y abre `http://127.0.0.1:8080`. La web alojada no incorpora PWA ni garantiza recarga sin conexión.

## 4. Instalador para Windows

Descarga **`Marco-PDF-Windows-Instalador.exe`**, ejecútalo y sigue el asistente. Requiere Windows 10/11 x64. Instala para el usuario actual sin pedir permisos de administrador y crea accesos directos.

Se desinstala desde las aplicaciones instaladas de Windows. El instalador no tiene firma comercial de Windows. Tras descargar e instalar el paquete, lectura, división y OCR funcionan sin Internet.

## 5. Instalador para Linux

Descarga **`Marco-PDF-Linux-amd64.deb`**. Requiere Debian/Ubuntu compatibles, arquitectura amd64, glibc 2.35 o posterior y entorno gráfico X11 o Wayland con XWayland. Se compila en Ubuntu 22.04.

```sh
sudo apt install ./Marco-PDF-Linux-amd64.deb
```

Abre **Marco PDF** desde el menú o con `marco-pdf`. Para desinstalar: `sudo apt remove marco-pdf`. La instalación usa los permisos del gestor de paquetes y puede necesitar obtener dependencias gráficas si faltan; el procesamiento posterior de PDF y OCR es local y no requiere Internet.

## 6. Android

Descarga **`Marco-PDF-Android.apk`**, ábrelo y permite la instalación desde esa fuente si Android lo solicita. El OCR y la interfaz incluyen los tres idiomas y los recursos están dentro del APK.

El proyecto declara Android 7/API 24 como mínimo, pero también necesita Android System WebView actualizado y compatible. No se ha probado en un teléfono físico y no se publica en Google Play. El APK utiliza la misma clave propia que la versión anterior, con un número de versión superior para permitir actualizarla.

Al pulsar un resultado se abre el menú del sistema para compartir o guardar. Las copias destinadas a compartir se escriben en la caché de la aplicación. No necesita Internet para leer, dividir o realizar OCR después de instalarlo.

## Licencias, manuales y versiones anteriores

`Marco-PDF-Documentacion.zip` incluye manuales, capturas y licencias. `SHA256SUMS.txt` permite verificar las descargas. El código original usa [AGPL-3.0](../LICENSE); los componentes conservan sus licencias.

La versión 1.2 presenta estos seis formatos. Los ZIP portables de escritorio y TAR.GZ de Linux anteriores permanecen en la publicación histórica 1.1, que solo incluía OCR español e inglés.
