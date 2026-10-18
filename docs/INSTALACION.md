# Instalación y requisitos

[Portada](../README.md) · [Distribución y nombres de archivo](DISTRIBUCION.md)

Descarga los paquetes de la versión **1.3.1** en [Releases](https://github.com/Peskysa/marco-pdf/releases/latest). No se necesita Python, Node.js ni herramientas de desarrollo para utilizarlos. Comprueba el archivo con `Get-FileHash archivo -Algorithm SHA256` en Windows o `sha256sum archivo` en Linux, comparándolo con `SHA256SUMS.txt`.

## Windows

Windows x64. Ejecuta `Marco-PDF-Windows-Instalador.exe` para instalar para tu usuario, o `Marco-PDF-Portable.exe` para abrir sin instalación. `Marco-PDF-Web-Portable.exe` abre la web incluida en tu navegador mediante un servidor solo local en 127.0.0.1; mantén su ventana abierta y ciérrala al terminar. Los EXE no tienen firma comercial. Los portables extraen componentes temporales y siguen sujetos a las políticas del equipo.

## Linux

Ubuntu 22.04 o distribución compatible, amd64 y entorno gráfico. Instala `Marco-PDF-Linux-amd64.deb` con el gestor de paquetes para resolver dependencias. Para usar sin instalar, extrae `Marco-PDF-Linux-Portable.tar.gz` y ejecuta el programa de su carpeta; las bibliotecas del sistema siguen siendo necesarias.

## Web

Abre [la aplicación alojada](https://marco-pdf.peskysa.chatgpt.site) o sirve `Marco-PDF-Web.zip` desde HTTP(S). Usa un navegador moderno. Los recursos se incluyen en el ZIP; no se necesita instalar herramientas de desarrollo. El acceso al sitio alojado es independiente de la visibilidad del repositorio.

## Android

Instala `Marco-PDF-Android.apk` tras autorizar esa fuente en Android. Usa una clave de publicación propia y estable del proyecto. No se publica en Google Play y no se ha probado en teléfono físico. Si usabas el antiguo APK debug de ajedrez, desinstálalo una vez antes de instalar el nuevo; las siguientes actualizaciones conservarán la clave de publicación.

## Requisitos concretos de este programa

Android 7 o posterior (API 24), WebView actualizado. Linux requiere glibc 2.35, X11, Xext, Xrender y Xft. El portable TAR.GZ se extrae y se ejecuta con `./Marco\ PDF`. La web requiere HTTP(S) para los trabajadores OCR; no se recomienda abrir el ZIP mediante file://.

Consulta [Manual](MANUAL.md) para las diferencias funcionales y [Privacidad](PRIVACIDAD.md) para los archivos locales y conexiones.
