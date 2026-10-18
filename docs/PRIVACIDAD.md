# Privacidad

[Índice](README.md)

## Procesamiento

La lectura, la división y el OCR se realizan en el dispositivo. La aplicación no implementa subidas de documentos a un servidor, cuentas propias, anuncios ni analítica.

La web alojada, el repositorio y las descargas son públicos. ChatGPT Sites gestiona el alojamiento web y GitHub gestiona el código y las descargas. Esos servicios gestionan sus registros y los accesos que correspondan según su configuración y sus políticas.

## Conexiones

- La web descarga JavaScript, motores PDF/OCR, fuentes e idiomas desde su alojamiento. Los PDF no se envían a un servicio OCR remoto.
- Escritorio y Android incluyen los recursos de procesamiento.
- El portable web también incluye todos los recursos. Su servidor de solo lectura escucha únicamente en `127.0.0.1` y no acepta subidas de PDF. El navegador hace el procesamiento, sin peticiones a Internet. El EXE deja recursos en una carpeta temporal mientras está abierto; el navegador puede conservar los modelos en su caché local. Cierra la ventana del lanzador para detener el servidor.
- Instalar dependencias y compilar desde código requiere descargar herramientas de sus proveedores; es independiente del procesamiento de documentos.

## Almacenamiento

- **Escritorio:** los resultados se guardan donde elijas. El procesamiento utiliza memoria; el guardado OCR escribe un temporal junto al destino antes de reemplazarlo.
- **Web:** el navegador puede conservar recursos y modelos OCR en caché/IndexedDB. La aplicación no guarda automáticamente los PDF en un historial propio. Los resultados permanecen en memoria hasta cerrar o recargar; las descargas quedan en la ubicación del navegador.
- **Android:** al compartir se escribe una copia en la caché privada de la aplicación y se comparte su URI. Esa copia puede permanecer hasta que Android o el usuario limpie la caché. El destino elegido puede conservar otra copia.

## Compartir y pedir ayuda

El tratamiento posterior de un PDF enviado a otra aplicación depende de ese destino. Para soporte usa documentos ficticios o anonimizados. Las capturas del repositorio contienen ejemplos preparados para la documentación, sin documentos personales del autor.
