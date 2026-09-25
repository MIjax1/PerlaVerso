# PERLAVERSO ⚡

Página especial de Jimy para Perla, diseñada como una experiencia interactiva basada en coincidencias, viajes, proyectos, llamadas, bromas internas y recuerdos compartidos.

## Archivos

- `index.html` — estructura completa de la página.
- `styles.css` — diseño, animaciones, responsive y efectos visuales.
- `script.js` — música, estrellas, timeline, llamadas, easter eggs y efectos.
- `assets/favicon.svg` — ícono del sitio.
- `assets/audio/` — carpeta para la canción.
- `assets/photos/` — carpeta opcional para fotos futuras.

## Música

La web ya está configurada para reproducir:

**Caminando por la vida — Melendi**

Por derechos de autor, el archivo de audio comercial no está incluido. Usa una copia que tengas derecho a utilizar y colócala con este nombre exacto:

`assets/audio/caminando-por-la-vida.mp3`

La música comienza al pulsar **COMENZAR EL RECORRIDO**, lo cual evita gran parte de los bloqueos de autoplay de los navegadores.

## Abrir en tu PC

Puedes abrir `index.html` directamente en Chrome/Edge. Para probarlo de forma más parecida a GitHub Pages, también puedes levantar un servidor local desde esta carpeta:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Subir a GitHub Pages

1. Crea un repositorio nuevo.
2. Sube **el contenido de esta carpeta** al nivel principal del repositorio.
3. Verifica que `index.html` quede en la raíz.
4. En GitHub abre **Settings → Pages**.
5. En *Build and deployment*, selecciona **Deploy from a branch**.
6. Selecciona `main` y `/ (root)`.
7. Guarda.

## Fotos opcionales

La versión entregada funciona sin fotos y mantiene el concepto visual del recorrido. Si luego deseas integrar fotografías reales de Jimy y Perla, guárdalas en `assets/photos/` y se pueden añadir como galería, recuerdos de fechas o tarjetas de ruta sin alterar el diseño principal.

## Privacidad

La página evita incluir coordenadas exactas, documentos privados, enlaces personales y otros datos delicados presentes en la exportación del chat.
