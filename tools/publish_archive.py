# Publishes the PUBLIC side of the baaskaraa archive to the website.  b with me
#
# Input : an export of the claude.ai archive (the master), one JSON file per record:
#         <src>/works/*.json, <src>/projects/*.json, <src>/pitems/*.json, and the images <src>/img/<id>.<ext>
# Output: data/archive.json  (public fields only)
#         assets/archive/<id>-s.webp (phone, 800 px) and <id>-l.webp (desktop, 1600 px)
#
# Usage : python3 tools/publish_archive.py /path/to/export
#
# What goes out (decided 24 Oct 2026, catalogue-guide.md):
#   works   : only those ticked "Show on baaskaraa.com"; inv, title, year, category, series, medium, size; front/detail/in situ images
#   projects: Completed projects ticked "Show on baaskaraa.com"; title, subtitle, type, dates, partners, role, summary
#   items   : only items marked "public"; number, stage, title, date, kind, images
# Never: prices, owners, locations, provenance, notes, certificates, Drive links, item summaries (they hold archive notes), curator or private items.
import json, glob, os, sys, re
from PIL import Image, ImageOps

SRC = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/arch'
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_IMG = os.path.join(R, 'assets', 'archive')
os.makedirs(OUT_IMG, exist_ok=True)
os.makedirs(os.path.join(R, 'data'), exist_ok=True)

def load(kind):
    return [json.load(open(f)) for f in sorted(glob.glob(os.path.join(SRC, kind, '*.json')))]

def find_img(i):
    m = glob.glob(os.path.join(SRC, 'img', i + '.*'))
    return m[0] if m else None

made = {}
def web_img(i):
    """Make the two web sizes once; return [w, h] of the large one, or None."""
    if i in made: return made[i]
    src = find_img(i)
    if not src:
        done = os.path.join(OUT_IMG, i + '-l.webp')
        if os.path.exists(done):  # already published: reuse it
            im = Image.open(done); made[i] = [im.width, im.height]; return made[i]
        print('  missing image', i); made[i] = None; return None
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    for suffix, edge in (('s', 800), ('l', 1600)):
        c = im.copy(); c.thumbnail((edge, edge), Image.LANCZOS)
        c.save(os.path.join(OUT_IMG, '%s-%s.webp' % (i, suffix)), 'WEBP', quality=82, method=6)
    c = im.copy(); c.thumbnail((1600, 1600)); made[i] = [c.width, c.height]
    return made[i]

def size_str(w):
    dims = [w.get('h_cm'), w.get('w_cm'), w.get('d_cm')]
    dims = [d for d in dims if d]
    if len(dims) < 2: return ''
    fmt = lambda x: ('%g' % x)
    return ' × '.join(fmt(d) for d in dims) + ' cm (' + ' × '.join('%.1f' % (d / 2.54) for d in dims) + ' in)'

PUBLIC_KINDS = {'front', 'detail', 'in situ'}
works = []
for w in load('works'):
    if not w.get('web'): continue
    imgs = []
    for im in w.get('images', []):
        if im.get('kind') not in PUBLIC_KINDS: continue
        wh = web_img(im['id'])
        if wh: imgs.append({'id': im['id'], 'kind': im['kind'], 'w': wh[0], 'h': wh[1]})
    imgs.sort(key=lambda x: 0 if x['kind'] == 'front' else 1)
    works.append({k: v for k, v in {
        'inv': w['inv'], 'title': w.get('title', ''), 'year': w.get('year'),
        'category': w.get('category', ''), 'series': w.get('series', ''),
        'medium': w.get('medium', ''), 'size': size_str(w), 'images': imgs}.items() if v not in ('', None)})

STAGES = ['Idea', 'Proposal', 'Approval', 'Making', 'Presentation', 'Reception', 'After']
items = load('pitems')
projects = []
for p in load('projects'):
    if p.get('status') != 'Completed' or not p.get('web'): continue
    its = []
    for i in sorted((x for x in items if x.get('pid') == p['pid'] and x.get('access') == 'public'), key=lambda x: (x.get('stage') or 9, x['no'])):
        imgs = []
        for iid in i.get('images', []):
            wh = web_img(iid)
            if wh: imgs.append({'id': iid, 'w': wh[0], 'h': wh[1]})
        its.append({k: v for k, v in {
            'no': i['no'], 'stage': i.get('stage'), 'title': i.get('title', ''), 'date': i.get('date', ''),
            'kind': i.get('kind', ''), 'key': bool(i.get('key')), 'images': imgs}.items() if v not in ('', None)})
    projects.append({k: v for k, v in {
        'pid': p['pid'], 'title': p.get('title', ''), 'subtitle': p.get('subtitle', ''), 'type': p.get('type', ''),
        'start': p.get('start', ''), 'end': p.get('end', ''), 'partners': p.get('partners', ''),
        'role': p.get('role', ''), 'summary': p.get('summary', ''),
        'cover': next((im['id'] for it in its for im in it.get('images', []) if it.get('key')), next((im['id'] for it in its for im in it.get('images', [])), None)),
        'items': its}.items() if v not in ('', None)})

out = {'published': __import__('datetime').datetime.now(__import__('datetime').timezone.utc).strftime('%Y-%m-%dT%H:%MZ'), 'stages': STAGES, 'works': works, 'projects': projects}
txt = json.dumps(out, ensure_ascii=False, separators=(',', ':'))

# guard: nothing private may leave the archive
ALLOWED = {'published', 'stages', 'works', 'projects', 'inv', 'title', 'year', 'category', 'series', 'medium', 'size', 'images',
           'id', 'kind', 'w', 'h', 'pid', 'subtitle', 'type', 'start', 'end', 'partners', 'role', 'summary', 'cover', 'items',
           'no', 'stage', 'date', 'key'}
def check(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k not in ALLOWED: raise SystemExit('PRIVATE FIELD WOULD BE PUBLISHED: ' + k)
            check(v)
    elif isinstance(o, list):
        for v in o: check(v)
check(out)
for bad in ('drive.google', 'Serangoon', '@gmail', '@icloud'):
    if bad in txt: raise SystemExit('PRIVATE TEXT WOULD BE PUBLISHED: ' + bad)
open(os.path.join(R, 'data', 'archive.json'), 'w').write(txt)
print('data/archive.json: %d works, %d projects, %d items, %d images (%d KB)' % (
    len(works), len(projects), sum(len(p['items']) for p in projects), len([m for m in made.values() if m]), len(txt) // 1024))
