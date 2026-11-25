"""Valida enlaces, fragmentos, estructura semántica y metadatos del sitio público."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote,urlsplit
import json,re,colorsys
root=Path(__file__).resolve().parents[1]
errors=[];pages={}
class Document(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=set();self.links=[];self.h1=0;self.title=False;self.description=False;self.canonical=False;self.og=False;self.lang=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids:errors.append(f'{page}: id duplicado {a["id"]}')
            self.ids.add(a['id'])
        if tag=='html':self.lang=bool(a.get('lang'))
        if tag=='h1':self.h1+=1
        if tag=='title':self.title=True
        if tag=='meta' and a.get('name')=='description':self.description=bool(a.get('content'))
        if tag=='meta' and a.get('property')=='og:image':self.og=True
        if tag=='link' and a.get('rel')=='canonical':self.canonical=True
        if tag=='img' and a.get('src') and (not a.get('alt') and a.get('alt')!='' or not a.get('width') or not a.get('height')):errors.append(f'{page}: imagen sin alt o dimensiones')
        for name in ('href','src'):
            if a.get(name):self.links.append(a[name])
for page in root.rglob('*.html'):
    if any(p in {'_site','.git'} for p in page.parts):continue
    d=Document();d.feed(page.read_text(encoding='utf-8'));pages[page.resolve()]=d
    if d.h1!=1:errors.append(f'{page}: se requiere exactamente un h1')
    if not d.title or not d.lang:errors.append(f'{page}: falta título o idioma')
    if page.name!='404.html' and not all((d.description,d.canonical,d.og)):errors.append(f'{page}: faltan metadatos SEO')
for page,d in pages.items():
    for value in d.links:
        url=urlsplit(value)
        if url.scheme or url.netloc:continue
        target=page if not url.path else ((root/unquote(url.path.lstrip('/'))) if url.path.startswith('/') else page.parent/unquote(url.path))
        target=target.resolve()
        if target.is_dir():target=target/'index.html'
        if not target.exists():errors.append(f'{page.name}: enlace inexistente {value}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:errors.append(f'{page.name}: fragmento inexistente {value}')
for path in [root/'styles.css',root/'curriculum.html',*list((root/'assets').glob('*.svg'))]:
    for color in re.findall(r'#[0-9a-fA-F]{6}\b',path.read_text(encoding='utf-8')):
        r,g,b=[int(color[i:i+2],16)/255 for i in (1,3,5)];h,l,s=colorsys.rgb_to_hls(r,g,b)
        if 250<h*360<335 and s>.12:errors.append(f'{path.name}: tonalidad morada {color}')
if errors:raise SystemExit('\n'.join(errors))
print(f'{len(pages)} páginas: enlaces, fragmentos, metadatos, imágenes y paleta verificados.')
