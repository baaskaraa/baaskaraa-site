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
