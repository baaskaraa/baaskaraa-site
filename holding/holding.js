/* baaskaraa.com holding page loader · b with me
   Squarespace Code block: <div id="bk-holding"></div><script src="https://cdn.jsdelivr.net/gh/baaskaraa/baaskaraa-site@main/holding/holding.js"></script>
   This file only forwards to holding/holding-app.js on GitHub Pages (live minutes after a push, no CDN purge), falling back to jsDelivr. */
(function () {
  if (window.__bkHoldLoader) return; window.__bkHoldLoader = true;
  var me = document.currentScript, v = Math.floor(Date.now() / 600000);
  function add(src, fallback) {
    var s = document.createElement('script'); s.src = src;
    if (fallback) s.onerror = function () { add(fallback); };
    if (me && me.parentNode) me.parentNode.insertBefore(s, me.nextSibling); else document.head.appendChild(s);
  }
  add('https://baaskaraa.github.io/baaskaraa-site/holding/holding-app.js?v=' + v, 'https://cdn.jsdelivr.net/gh/baaskaraa/baaskaraa-site@main/holding/holding-app.js');
})();
