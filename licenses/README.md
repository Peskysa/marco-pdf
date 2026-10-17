# Textos de licencia de terceros

Estas copias conservan los textos de licencia distribuidos con las dependencias instaladas para Marco PDF 1.2.0. No sustituyen sus avisos originales ni cambian sus licencias.

- `PyMuPDF-COPYING.txt`: texto incluido en PyMuPDF 1.28.2.
- `Pillow-LICENSE.txt`: licencia y avisos de Pillow 13.0.0 y componentes de su distribución.
- `tessdata_fast-LICENSE.txt`: licencia de los datos de idioma español e inglés.
- `javascript/`: textos instalados de las dependencias JavaScript de ejecución y sus dependencias transitivas resolubles.
- `javascript/inventory.json`: nombre, versión, declaración de licencia y archivos copiados.

El código original de Marco PDF se rige por [LICENSE](../LICENSE) y [NOTICE](../NOTICE). [Resumen de componentes](../THIRD_PARTY.md).

El inventario JS se puede regenerar, con las dependencias instaladas, ejecutando `node scripts/licenses.mjs` desde `web/`. Las herramientas de desarrollo y compilación mantienen sus propias licencias y no quedan incluidas en este inventario de ejecución.
