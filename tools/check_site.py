"""Comprueba que los enlaces internos apunten a archivos incluidos en el sitio."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

root = Path(__file__).resolve().parents[1]
failures = []
class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name not in {'href','src'} or not value:
                continue
            url = urlsplit(value)
            if url.scheme or url.netloc or not url.path:
                continue
            path = (root / unquote(url.path.lstrip('/'))) if url.path.startswith('/') else page.parent / unquote(url.path)
            if not path.exists():
                failures.append(f'{page.relative_to(root)}: {value}')
for page in root.rglob('*.html'):
    if '_site' in page.parts or '.git' in page.parts:
        continue
    Links().feed(page.read_text(encoding='utf-8'))
if failures:
    raise SystemExit('Enlaces internos inexistentes:\n'+'\n'.join(failures))
print('Enlaces internos verificados.')
