# Portafolio de desarrollo de software

Sitio estático publicado en GitHub Pages. Identidad editorial carbón, grafito, blanco cálido y azul acero. Portada, perfil, tecnologías, trayectoria, metodología y ocho casos de estudio. Web de Deskisiao y servidor FiveM son proyectos separados.

## Ejecutar y comprobar

```sh
python tools/build_pages.py
python tools/check_site.py
python tools/build_site.py
python -m http.server 8087
```

No requiere Node, paquetes de frontend ni fuentes externas. `content/projects.json` es la fuente editorial; `tools/build_pages.py` genera portada, casos, sitemap y robots. `content/images.json` conserva dimensiones intrínsecas. Los archivos HTML generados se versionan para que la entrega pueda recorrerse sin compilación. La hoja `styles.css` y `app.js` comparten componentes entre páginas.

## Publicación

GitHub Actions valida y empaqueta el contenido público en `_site`. El origen de Pages debe ser GitHub Actions. En Cloudflare Pages, ejecutar `python tools/build_site.py` con salida `_site`. `_headers` solo se aplica en Cloudflare; GitHub Pages administra sus propias cabeceras.

## Interacciones

El menú informa su estado mediante `aria-expanded`. La navegación activa no modifica el historial. Las galerías utilizan un diálogo nativo: teclado, Escape y retorno de foco; sin JavaScript, el enlace abre la imagen original. Se respetan las preferencias de movimiento reducido. La consulta opcional a GitHub lee repositorios públicos sin tokens. Los errores de red no bloquean la navegación.

## Contenido y privacidad

No se publica nombre personal, correo ni LinkedIn sin confirmación. La formación corresponde a Ingeniería en Ciberseguridad en INACAP y a la salida intermedia de Analista Programador en curso. Los proyectos distinguen prototipos, demos y planes; no se inventan experiencia laboral, estadísticas o certificaciones. Los casos identifican el apoyo de IA y los recursos de terceros.

Las capturas de Mis Reinas y SEFEL utilizan bases aisladas con datos ficticios. Las de Deskisiao proceden de la web pública. Las imágenes se presentan en escala de grises mediante CSS para mantener la identidad; el proyecto original conserva sus colores. Los esquemas de arquitectura se identifican como diagramas, no como capturas. No se incluyen bases, credenciales, configuraciones privadas ni paquetes comerciales.

## Verificación

El comprobador revisa enlaces internos y fragmentos, títulos, idioma, metadatos, dimensiones de imágenes y ausencia de tonalidades moradas en la identidad. La revisión visual se realiza con navegador a distintos anchos. Lighthouse es una medición de laboratorio: sus puntuaciones no sustituyen datos reales de usuarios ni acreditan por sí solas conformidad WCAG completa.
