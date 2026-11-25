"""Empaqueta únicamente archivos públicos del sitio, sin incluir metadatos de Git."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
target = root / '_site'
# Se vacía solo la salida derivada para no servir archivos obsoletos.
if target.resolve().parent != root.resolve() or target.name != "_site":
    raise SystemExit("La salida debe permanecer dentro del proyecto.")
if target.exists():
    shutil.rmtree(target)
target.mkdir()
for source in root.rglob('*'):
    relative = source.relative_to(root)
    if any(part.startswith('.') or part in {'_site', 'tools', '__pycache__'} for part in relative.parts):
        continue
    if source.is_file() and source.suffix in {'.html','.css','.js','.svg','.png','.webp','.pdf','.xml','.txt'}:
        destination = target / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
(target / '.nojekyll').touch()
