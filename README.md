# baaskaraa-site

Code for baaskaraa.com (Squarespace hybrid build): shared core CSS and script, one snippet per page, works.json and web-size images.

Public by design. Nothing private goes here: no prices, owners, locations, notes or certificate details.

Loaded on the site through jsDelivr. Every change is a version, so any update can be rolled back.

— baaskaraa · b with me

## holding/ — the coming-soon page (live since 27 Oct 2026)

- `holding.js` builds the whole page (b mark, EN | தமிழ், guest book, studio email) inside `<div id="bk-holding"></div>`. `holding.css` and `holding.html` are the readable sources of what it contains.
- Squarespace Home has one Code block with only:
  `<div id="bk-holding"></div><script src="https://cdn.jsdelivr.net/gh/baaskaraa/baaskaraa-site@main/holding/holding.js"></script>`
- Guest book signatures go to a Google Sheet on baaskaraa's own Google account through `guestbook.gs` (Apps Script web app). Its `/exec` URL is set as `ENDPOINT` in `holding.js`. Each signature is a row in the sheet and an email to studio@baaskaraa.com.

## site/ — the full website (private preview from 28 Oct 2026)

- `site/bk-site.js` renders the approved prototype (all sections, slideshows, viewer, drawing canvas, forms) inside a Squarespace page. It is **built**, not hand-edited: `node tools/build.js tools/Main.dc.html` (needs `npm i morphdom`).
- `tools/Main.dc.html` is the prototype it was built from (Design artifact "baaskaraa.com Home Preview"). `tools/runtime.js` is the small engine; `tools/build.js` applies the site patches (studio@ links are already in the prototype; Studio Circle email → Google Sheet; intro once per visit; home links).
- `assets/` holds the web-size images and video, named by their prototype asset id.
- Isolation: the page lives in a shadow root, so Squarespace styles cannot change it; on the live page it takes over the whole page (Squarespace header/footer hidden), and inside the Squarespace editor it stays in place so the block can still be edited.
- Squarespace page, one Code block:
  `<div id="bk-app" data-page="home" data-home="/preview"></div><script src="https://cdn.jsdelivr.net/gh/baaskaraa/baaskaraa-site@main/site/bk-site.js"></script>`
  `data-page`: home · now · the-artist · artworks · awaken · archive · engage · live (each shows only its sections). `data-home`: the address of the full home page.
- Studio Circle signups use the same Apps Script as the guest book (message column: "Studio Circle · website").
- `test/sqs.html` is a Squarespace-like test page (`python3 -m http.server`, then open /test/sqs.html?page=awaken).
