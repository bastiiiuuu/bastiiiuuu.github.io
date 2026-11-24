# Portafolio de desarrollo de software

Sitio estático con proyectos, tecnologías aplicadas, formación, enlace a GitHub y currículum imprimible. Estética negra y morada, diseño adaptable y movimiento reducido según la preferencia del dispositivo.

La identidad pública utiliza una presentación sin nombre personal. La formación declarada corresponde a Ingeniería en Ciberseguridad en INACAP, con salida intermedia de Analista Programador en curso. El atlas y las mejoras del portafolio reconocen el apoyo de IA. No hay experiencia laboral, certificaciones o nivel de inglés inventados.

## Ejecutar

```sh
python -m http.server 8080
```

Abre http://127.0.0.1:8080/. No requiere npm ni un proceso de compilación de frontend.

## Verificar y publicar

```sh
python tools/check_site.py
python tools/build_site.py
```

El workflow publica únicamente el contenido empaquetado en _site. GitHub Pages debe usar GitHub Actions como origen. Para Cloudflare Pages puede usarse el comando `python tools/build_site.py` y la carpeta de salida `_site`. El archivo _headers contiene opciones para un alojamiento Cloudflare; GitHub Pages no aplica ese archivo.

La consulta de actividad en GitHub se realiza bajo demanda sobre repositorios públicos, sin tokens. Un límite o fallo de la API no impide abrir los proyectos. El sitio no incluye analítica ni formularios que almacenen datos. Las tipografías se solicitan a Google Fonts y existe una alternativa del sistema si no están disponibles.

El currículum se puede imprimir o guardar en PDF desde la página correspondiente. No se publica un correo ni un LinkedIn sin confirmar esos canales.
