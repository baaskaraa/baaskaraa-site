#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds assets/presskit/baaskaraa-press-kit.pdf from tools/presskit/presskit.html.

  python3 tools/presskit/prep_images.py   # only when images change
  python3 tools/presskit/build.py

The template fills in the mark (mark-path.txt, the exact path from the site's
logo), the running head and the page footers, renders with headless Chromium,
and refuses to write the PDF if any page's text overflows its frame.
"""
import os, re, sys
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SRC = os.path.join(HERE, 'presskit.html')
TMP = os.path.join(HERE, '.render.html')
OUT = os.path.join(ROOT, 'assets', 'presskit', 'baaskaraa-press-kit.pdf')
EDITION = 'PREVIEW EDITION · NOV 2026'

HEAD = ('<div class="head"><div class="hlock"><svg viewBox="0 0 422 600" style="stroke:#B8932A">'
        '<use href="#bmark"/></svg><span>baaskaraa</span></div>'
        f'<div class="ed">{EDITION}</div></div>')

def foot(n):
    return ('<div class="foot"><span>Press kit &nbsp;·&nbsp; studio@baaskaraa.com &nbsp;·&nbsp; baaskaraa.com</span>'
            f'<b>{n:02d}</b></div>')

CHECK = """
() => {
  const out = [];
  document.querySelectorAll('.page').forEach((pg, i) => {
    const pb = pg.getBoundingClientRect();
    const foot = pg.querySelector('.foot');
    const limit = foot ? foot.getBoundingClientRect().top - 2 : pb.bottom;
    pg.querySelectorAll('.body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.height && r.bottom > limit + 0.5) out.push(`page ${i+1}: <${el.tagName.toLowerCase()} class="${el.className}"> ends ${Math.round(r.bottom-limit)}px below frame`);
    });
    pg.querySelectorAll('.cols').forEach(c => {
      if (c.scrollWidth > c.clientWidth + 1) out.push(`page ${i+1}: two-column text overflows into a third column`);
    });
  });
  return out;
}
"""

def main():
    html = open(SRC, encoding='utf-8').read()
    mark = open(os.path.join(HERE, 'mark-path.txt')).read().strip()
    html = html.replace('__MARK_D__', mark).replace('__HEAD__', HEAD)
    html = re.sub(r'__FOOT_(\d+)__', lambda m: foot(int(m.group(1))), html)
    open(TMP, 'w', encoding='utf-8').write(html)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={'width': 794, 'height': 1123})
            page.goto('file://' + TMP)
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(300)
            problems = page.evaluate(CHECK)
            if problems:
                print('OVERFLOW — PDF not written:')
                for x in sorted(set(problems))[:40]:
                    print('  ', x)
                sys.exit(1)
            page.pdf(path=OUT, print_background=True, width='210mm', height='297mm',
                     margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
            browser.close()
    finally:
        if os.path.exists(TMP):
            os.remove(TMP)
    print(f'{OUT} ({os.path.getsize(OUT) / 1024:.0f} KB)')

if __name__ == '__main__':
    main()
