# Instalación y requisitos

[Índice](README.md) · [Manual](MANUAL.md)

Descarga los archivos desde [la publicación de GitHub](https://github.com/Peskysa/marco-pdf/releases/latest). El repositorio es privado: entra con una cuenta que tenga acceso. Los paquetes incluyen las dependencias de la aplicación; no necesitas un entorno de desarrollo.

## Windows

Requisitos: Windows 10/11 de 64 bits y entorno de escritorio.

### Instalador

1. Descarga `Marco-PDF-Windows-Instalador.exe`.
2. Ejecútalo y sigue los pasos en español. Se instala para el usuario actual.
3. Abre **Marco PDF** desde Inicio o desde el acceso directo.

Se desinstala desde las aplicaciones instaladas de Windows. El instalador no tiene firma comercial de Windows.

### Portable

La opción de un solo archivo es **`Marco-PDF-Portable.exe`**. Descárgala y ábrela con doble clic. No hay asistente de instalación ni necesitas extraer un ZIP, conservar una carpeta `_internal`, instalar Python o Tesseract, ni descargar idiomas.

Puedes copiar ese EXE a otra carpeta o a un USB. Al abrirse, despliega sus componentes en una carpeta temporal de Windows y los limpia al cerrarse normalmente. Por eso puede tardar unos segundos en arrancar. Necesita permiso para escribir en la carpeta temporal; no instala el programa. Los resultados se guardan donde tú elijas.

También se mantiene la alternativa en carpeta:

1. Descarga `Marco-PDF-Windows-Portable.zip`.
2. Descomprime **toda la carpeta** en una ubicación donde tengas permisos.
3. Abre `Marco PDF.exe` dentro de la carpeta `Marco PDF`.

En la alternativa ZIP, mantén `_internal` junto al ejecutable. Para retirar el portable, elimina el EXE único o la carpeta descomprimida cuando esté cerrado. Los PDF guardados en otras carpetas se conservan.

## Linux

Paquetes para x64/amd64. Se compilan en Ubuntu 22.04: requieren glibc 2.35 o posterior y bibliotecas gráficas. Usa un escritorio X11 o Wayland con XWayland.

### Debian/Ubuntu compatibles

Descarga `Marco-PDF-Linux-amd64.deb` y, desde su carpeta, ejecuta:

```sh
sudo apt install ./Marco-PDF-Linux-amd64.deb
```

Abre **Marco PDF** desde el menú o ejecuta `marco-pdf`. Para desinstalar: `sudo apt remove marco-pdf`.

### Portable

```sh
tar -xzf Marco-PDF-Linux-Portable.tar.gz
./"Marco PDF/Marco PDF"
```

Mantén el directorio completo. Este formato no es un AppImage y conserva los requisitos de bibliotecas gráficas del sistema. No requiere instalar Python.

## Web

Abre [Marco PDF web](https://marco-pdf.peskysa.chatgpt.site) en un navegador actualizado. El alojamiento es privado y solicita acceso con tu cuenta de ChatGPT.

Para alojarlo por tu cuenta, descomprime `Marco-PDF-Web.zip` y sirve su contenido por HTTP/HTTPS. Incluye motores, idiomas OCR y recursos PDF. No funciona abriendo `index.html` directamente con `file://`.

Para probarlo localmente, si tienes Python disponible:

```sh
# Desde la carpeta descomprimida que contiene index.html:
python -m http.server 8080 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8080`. La web no incorpora instalación PWA ni una caché completa para recargar sin conexión.

## Android

1. Descarga `Marco-PDF-Android.apk` en el teléfono.
2. Ábrelo y permite instalar desde esa fuente si Android lo solicita.
3. Abre **Marco PDF** y selecciona un documento mediante **Abrir PDF**.
4. Para guardar resultados, pulsa el botón del archivo generado y elige una aplicación o destino en el menú del sistema.

El proyecto declara Android 7/API 24 como mínimo. El motor web también requiere Android System WebView actualizado y compatible; el mínimo de Android no garantiza que todos los WebView antiguos funcionen. El APK utiliza una clave propia conservada para futuras actualizaciones. No se distribuye en Google Play y aún no se ha probado en un teléfono físico.

## Uso sin conexión

| Versión | Qué necesita conexión |
| --- | --- |
| Windows/Linux | Descargar el paquete; después, el procesamiento es local |
| Android | Descargar el APK; después utiliza los recursos incluidos |
| Web alojada | Cargar la página y sus recursos; no garantiza recarga sin red |
| Web local | Acceder al servidor local mientras se utiliza |

Los PDF no se suben al alojamiento para estas operaciones. [Privacidad](PRIVACIDAD.md).
