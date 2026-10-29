/* baaskaraa.com site loader · b with me
   Every Squarespace page loads this file from jsDelivr. It only forwards to the real site (site/bk-app.js) on GitHub Pages,
   which updates 1-2 minutes after each push, so no CDN purge is needed. If GitHub Pages cannot be reached, it falls back to jsDelivr.
   This file should almost never change. */
(function () {
  if (window.__bkLoader) return; window.__bkLoader = true;
  var me = document.currentScript, v = Math.floor(Date.now() / 600000);
  function add(src, fallback) {
    var s = document.createElement('script'); s.src = src;
    if (fallback) s.onerror = function () { add(fallback); };
    if (me && me.parentNode) me.parentNode.insertBefore(s, me.nextSibling); else document.head.appendChild(s);
  }
  add('https://baaskaraa.github.io/baaskaraa-site/site/bk-app.js?v=' + v, 'https://cdn.jsdelivr.net/gh/baaskaraa/baaskaraa-site@main/site/bk-app.js');
})();
