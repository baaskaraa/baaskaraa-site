#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds assets/presskit/baaskaraa-press-kit.pdf from tools/presskit/presskit.html
via a headless Chromium (Playwright). Run: python3 tools/presskit/build.py
"""
import os
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, 'tools', 'presskit', 'presskit.html')
OUT = os.path.join(ROOT, 'assets', 'presskit', 'baaskaraa-press-kit.pdf')

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('file://' + SRC)
        page.wait_for_timeout(200)
        page.pdf(
            path=OUT,
            print_background=True,
            width='210mm',
            height='297mm',
            margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'},
        )
        browser.close()
    size_kb = os.path.getsize(OUT) / 1024
    print(f'{OUT} ({size_kb:.0f} KB)')

if __name__ == '__main__':
    main()
