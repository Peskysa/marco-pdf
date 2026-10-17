# Historial de cambios

## 1.2.0 — 17 de octubre de 2026

- Seis variantes: portable, portable web sin conexión, web normal, instalador Windows, instalador Linux y Android.
- OCR francés añadido en todas, además de español e inglés; reconocimiento individual o de los tres idiomas juntos.
- Selector de interfaz español, inglés y francés en escritorio, web y Android.
- Portable web de un solo EXE con servidor de lectura en localhost, sin instalación ni Internet.
- Verificación del EXE web desde una carpeta aislada con las peticiones externas bloqueadas, cuatro modos OCR y pantalla pequeña.
- Versiones anteriores conservadas como historial; la publicación actual incluye seis formatos principales y documentación.

## EXE portable único — 17 de octubre de 2026

- Nuevo `Marco-PDF-Portable.exe` para Windows x64: un solo archivo con lector, OCR español/inglés y licencias integrados, sin instalación ni extracción manual.
- Comprobación del ejecutable compilado con renderizado, división y OCR real desde una carpeta que solo contiene el EXE.
- Se mantiene el ZIP portable anterior como alternativa.

## Documentación ampliada — 17 de octubre de 2026

- Portada visual con banner, enlaces de descarga y cinco capturas reproducibles de la aplicación real.
- Guías de instalación, uso, privacidad, preguntas frecuentes, desarrollo y licencia.
- Aviso de autoría, textos de terceros y plantillas de ayuda.
- Documentación descargable adjunta a la versión 1.1.0. Esta actualización no cambia el comportamiento de las aplicaciones publicadas.

## 1.1.0 — 17 de octubre de 2026

- Instalador y portable Windows x64; DEB y portable Linux x64.
- Aplicación web y APK Android firmado para instalación directa.
- OCR local en español e inglés; capas de texto para páginas escaneadas.
- División por número de páginas o tamaño máximo de archivo comprobado en bytes.
- Rangos de páginas, zoom, búsqueda y vista de texto.
- Recursos locales de OCR y decodificadores/fuentes PDF en web/Android.
- Compilaciones y pruebas automatizadas en GitHub; publicación de sumas SHA-256.

## Primera implementación de escritorio — 17 de octubre de 2026

- Lector Windows con OCR y herramientas de división, base de la versión multiplataforma.
