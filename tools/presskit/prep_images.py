#!/usr/bin/env python3
"""Resize/compress source images into tools/presskit/img/ for a lean PDF."""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUTDIR = os.path.join(ROOT, 'tools', 'presskit', 'img')
os.makedirs(OUTDIR, exist_ok=True)

# (source relative to ROOT, output name, target width px)
JOBS = [
    ('assets/fbfa54ec33ddc83e52e6663fdd838f40.jpg', 'portrait.jpg', 500),
    ('assets/archive/c185ed19dcc294b8e087ac415a77b100-l.webp', 'bk-1996-002.jpg', 500),
    ('assets/archive/f802c885f33ac07d01369f217eb7963a-l.webp', 'bk-1996-001.jpg', 500),
    ('assets/archive/456e2b28993df448a66301046d5a7ca2-l.webp', 'bk-1997-045.jpg', 500),
    ('assets/archive/4015ef5f94e4aaf4b6b1042f7af4c69c-l.webp', 'bk-1998-016.jpg', 500),
    ('assets/archive/ce5cba5a6e12ed60572775fed0f0e333-l.webp', 'bk-1998-043.jpg', 500),
    ('assets/archive/af7f2ff754ba9836c0528a19c650e34e-l.webp', 'bk-1998-017.jpg', 500),
    ('assets/archive/afe3e8ee7804d63c03bebbb86f854700-l.webp', 'bk-2014-051.jpg', 500),
    ('assets/archive/033261df2712d7277597977066938f30-l.webp', 'bk-2014-047.jpg', 500),
    ('assets/archive/4d229cf94bfa1167caed71e2081bec8a-l.webp', 'bk-2014-049.jpg', 500),
    ('assets/archive/4eedf73e360aae4b27eea182eea0ad81-l.webp', 'bk-2020-054.jpg', 500),
    ('assets/archive/027f91837ab6757abaefc17f543c5bbe-l.webp', 'bk-2024-061.jpg', 500),
    ('assets/archive/1af088c361052e821a85793831605d62-l.webp', 'bk-2025-064.jpg', 500),
    ('assets/8185b280f940e5f11f1b28cef88d337f.jpg', 'doc-1998-01.jpg', 450),
    ('assets/aa4ccb6edb9097aa2012a1e872d01ccb.jpg', 'doc-1999-01.jpg', 450),
    ('assets/036c7a1032e65d92936861ab67fdf272.jpg', 'doc-2011-01.jpg', 450),
    ('assets/e3d509517cbfbf36e430ecf65ead61ee.jpg', 'doc-2015-01.jpg', 450),
    ('assets/906548d87f4725d0d9ed37ef28eb5be8.jpg', 'doc-2021-01.jpg', 450),
    ('assets/83d9fdd77e04b5acec37090a8bb35685.jpg', 'doc-2013-02.jpg', 450),
]

total_in = 0
total_out = 0
for src, outname, width in JOBS:
    srcpath = os.path.join(ROOT, src)
    im = Image.open(srcpath).convert('RGB')
    w, h = im.size
    if w > width:
        new_h = int(h * (width / w))
        im = im.resize((width, new_h), Image.LANCZOS)
    outpath = os.path.join(OUTDIR, outname)
    im.save(outpath, 'JPEG', quality=78, optimize=True)
    total_in += os.path.getsize(srcpath)
    total_out += os.path.getsize(outpath)
    print(f'{outname}: {im.size} {os.path.getsize(outpath)//1024} KB')

print(f'Total: {total_in//1024} KB -> {total_out//1024} KB')
