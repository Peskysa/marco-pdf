# Preguntas frecuentes

[Índice](README.md) · [Manual](MANUAL.md)

## ¿Sube mis documentos a un servidor?

No. El lector, la división y el OCR se ejecutan en el dispositivo. La web descarga sus propios recursos. Si compartes un resultado con otra aplicación, esa aplicación aplica sus reglas. [Privacidad](PRIVACIDAD.md).

## ¿Por qué una página no cabe en el máximo de MB?

Puede contener imágenes que, por sí solas, superen ese tamaño. Marco PDF mantiene páginas completas. Aumenta el máximo: esta función no comprime imágenes para hacerlas caber.

## ¿Por qué la suma de las partes pesa más?

Cada PDF necesita su estructura y puede duplicar fuentes o imágenes que antes compartían varias páginas. El límite se comprueba por archivo, no por la suma.

## ¿Cómo extraigo páginas?

Escribe, por ejemplo, `3-6`, elige división por páginas y utiliza 4 páginas por archivo. Para una página por archivo, utiliza 1.

## ¿Por qué no puedo buscar en un escaneo?

La imagen no contiene texto digital. Crea un PDF con OCR, guárdalo y vuelve a abrir ese resultado.

## ¿Por qué no reconoce una imagen dentro de una página?

La versión actual conserva las páginas que ya tienen texto. No realiza OCR adicional de imágenes en páginas mixtas.

## ¿Se mantienen firmas, marcadores y formularios?

Los derivados no conservan firmas digitales ni marcadores. No se garantiza la conservación del comportamiento de formularios y funciones interactivas. Conserva el original y revisa los derivados.

## ¿Puedo abrir PDF con contraseña?

Sí, en Windows/Linux introduciendo la contraseña. En web/Android utiliza escritorio. Los derivados se generan sin protección de contraseña; el original sigue protegido.

## ¿Hay límite de páginas?

No hay un máximo general fijado. La memoria, las imágenes y el dispositivo limitan el trabajo. En web, una página que supera 30 millones de píxeles al renderizarse para OCR se rechaza y se indica usar escritorio.

## ¿Android está en Google Play?

No. Se ofrece un APK firmado para instalación directa. No se ha validado en un teléfono físico. Usa WebView actualizado y consulta los [requisitos](INSTALACION.md).

## ¿La web se instala como PWA?

La versión actual no incorpora PWA ni almacenamiento completo para recargar sin conexión. Usa escritorio o Android para trabajar sin conexión.

## ¿Por qué no abre el ZIP web con doble clic?

Los módulos y trabajadores PDF/OCR requieren HTTP/HTTPS. Sigue la [guía de instalación](INSTALACION.md).

## ¿Cómo informo de un fallo?

Abre una [incidencia](https://github.com/Peskysa/marco-pdf/issues/new/choose) con plataforma, versión, pasos y mensaje de error. Usa un ejemplo ficticio, sin documentos personales.
