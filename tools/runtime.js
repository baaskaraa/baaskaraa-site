/* baaskaraa.com site runtime · renders the approved prototype inside Squarespace · b with me
   Built by tools/build.js from the prototype (Main.dc.html). Do not edit site/bk-site.js by hand.
   Loader on a Squarespace page (Code block):
     <div id="bk-app" data-page="home"></div><script src="https://cdn.jsdelivr.net/gh/baaskaraa/baaskaraa-site@main/site/bk-site.js"></script>
   data-page: home | now | the-artist | artworks | awaken | archive | engage | live
   data-home: address of the full home page (default "/"); e.g. "/preview" during the private preview */
(function () {
  'use strict';
  if (window.__bkSite) return; window.__bkSite = true;
  var morphdom = __MORPHDOM__;
  var TEMPLATE = __TEMPLATE__;
  var CSS = __CSS__;
  var ASSETS = __ASSETS__;
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbyEQN5bhRxmcPEQ4oCPnczFaZzBJytxSRpDr9AeO9VkT7XWK6szzHL40xdAgETRyyxabQ/exec';
  var FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&family=Noto+Sans+Tamil:wght@300;500&display=swap';
  var PAGES = {
    home: null,
    now: ['journal'], 'the-artist': ['artist'], artworks: ['works'],
    awaken: ['statement', 'agam', 'puram'], archive: ['archive'], engage: ['engage'], live: ['live']
  };
  var SECTION_PAGE = { top: 'home', journal: 'now', artist: 'the-artist', works: 'artworks', statement: 'awaken', agam: 'awaken', puram: 'awaken', archive: 'archive', engage: 'engage', live: 'live' };

  var me = document.currentScript;
  var BASE = (me && me.src ? me.src.replace(/site\/bk-site(\.min)?\.js.*$/, '') : 'https://cdn.jsdelivr.net/gh/baaskaraa/baaskaraa-site@main/') + 'assets/';
  function asset(s) { return String(s).replace(/\/_blob\/([0-9a-f]{32})/g, function (m, id) { return BASE + id + (ASSETS[id] || '.jpg'); }); }

  var host, root, mountEl, page, homeUrl, sub = false;
  var BK = window.BK = {
    $: function (id) { return (root && root.getElementById(id)) || document.getElementById(id); },
    seen: function () {
      if (page !== 'home') return true;
      try { if (sessionStorage.getItem('bk-intro')) return true; sessionStorage.setItem('bk-intro', '1'); } catch (e) {}
      return false;
    },
    visible: function (el) { return !!(el && el.getClientRects().length); },
    join: function (e, done) {
      if (e && e.preventDefault) e.preventDefault();
      var f = e && e.target && e.target.closest ? e.target.closest('form') : null;
      var inp = f ? f.querySelector('input[type=email]') : BK.$('email');
      var em = inp ? String(inp.value || '').trim() : '';
      if (!em || (inp.checkValidity && !inp.checkValidity())) { if (inp && inp.reportValidity) inp.reportValidity(); return; }
      var d = new URLSearchParams();
      d.append('name', em.split('@')[0]); d.append('email', em); d.append('message', 'Studio Circle · website'); d.append('lang', 'en'); d.append('page', location.href);
      fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: d }).then(function () { done(); }, function () { done(); });
    }
  };

  /* ---------- tiny component base (what the prototype's logic expects) ---------- */
  var comp, queued = false;
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (p, cb) {
    if (typeof p === 'function') p = p(this.state, this.props);
    if (p) for (var k in p) this.state[k] = p[k];
    schedule(); if (cb) setTimeout(cb, 0);
  };
  function schedule() { if (queued) return; queued = true; (window.requestAnimationFrame || setTimeout)(function () { queued = false; render(); }); }

  var Component = (function (DCLogic, BK) { __LOGIC__; return Component; })(DCLogic, BK);

  /* ---------- template ---------- */
  var tpl = document.createElement('template');
  var RE = /\{\{\s*([^}]+?)\s*\}\}/g;
  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true; if (path === 'false') return false;
    if (path === 'null') return null; if (/^-?\d+(\.\d+)?$/.test(path)) return +path;
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.'), v = scope[parts[0]];
    for (var i = 1; i < parts.length && v != null; i++) v = v[parts[i]];
    return v;
  }
  function interp(s, scope) { return asset(s.replace(RE, function (m, p) { var v = lookup(p, scope); return v == null ? '' : String(v); })); }
  function single(s) { var m = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/.exec(s); return m ? m[1] : null; }

  var handlers = [];
  function build(node, scope, parent, svg) {
    var kids = node.childNodes;
    for (var i = 0; i < kids.length; i++) {
      var n = kids[i];
      if (n.nodeType === 3) { parent.appendChild(document.createTextNode(n.nodeValue.indexOf('{{') < 0 ? n.nodeValue : interp(n.nodeValue, scope))); continue; }
      if (n.nodeType !== 1) continue;
      var tag = n.localName;
      if (tag === 'sc-for') {
        var list = lookup(single(n.getAttribute('list')) || '', scope) || [], as = n.getAttribute('as') || 'item';
        for (var j = 0; j < list.length; j++) { var s2 = Object.create(scope); s2[as] = list[j]; s2.index = j; build(n, s2, parent, svg); }
        continue;
      }
      if (tag === 'sc-if') { if (lookup(single(n.getAttribute('value')) || 'false', scope)) build(n, scope, parent, svg); continue; }
      var isSvg = svg || tag === 'svg';
      var el = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
      var ev = [];
      for (var a = 0; a < n.attributes.length; a++) {
        var at = n.attributes[a], name = at.name, val = at.value;
        if (name.indexOf('hint-') === 0) continue;
        var one = single(val);
        if (/^on[a-z]+$/.test(name) && one) { var fn = lookup(one, scope); if (typeof fn === 'function') { handlers.push(fn); ev.push(name.slice(2) + ':' + (handlers.length - 1)); } continue; }
        if (one) {
          var v = lookup(one, scope);
          if (!/^(aria-|data-)/.test(name) && (v === false || v == null)) continue;
          val = v === true ? (/^(aria-|data-)/.test(name) ? 'true' : '') : asset(String(v));
        } else if (val.indexOf('{{') >= 0) val = interp(val, scope);
        else if (val.indexOf('/_blob/') >= 0) val = asset(val);
        el.setAttribute(name, val);
      }
      if (ev.length) el.setAttribute('data-bk-ev', ev.join(' '));
      if (tag === 'video' && el.hasAttribute('muted')) el.muted = true;
      build(tag === 'template' ? n.content : n, scope, el, isSvg && tag !== 'foreignObject');
      parent.appendChild(el);
    }
  }

  function render() {
    if (!comp) return;
    var vals = comp.renderVals(), scope = Object.create(comp.state);
    for (var k in vals) scope[k] = vals[k];
    handlers = [];
    var next = document.createElement('div');
    build(tpl.content, scope, next, false);
    morphdom(mountEl, next, {
      childrenOnly: true,
      onBeforeElUpdated: function (from, to) {
        if (from.localName === 'canvas') return false;
        if ((from.localName === 'input' || from.localName === 'textarea' || from.localName === 'select') && !to.hasAttribute('value')) {
          for (var i = 0; i < to.attributes.length; i++) if (from.getAttribute(to.attributes[i].name) !== to.attributes[i].value) from.setAttribute(to.attributes[i].name, to.attributes[i].value);
          return false;
        }
        if (from.localName === 'video' && from.getAttribute('src') === to.getAttribute('src')) {
          for (var j = 0; j < to.attributes.length; j++) if (from.getAttribute(to.attributes[j].name) !== to.attributes[j].value) from.setAttribute(to.attributes[j].name, to.attributes[j].value);
          return false;
        }
        return true;
      }
    });
    var hs = mountEl.querySelectorAll('[data-bk-ev]');
    for (var i = 0; i < hs.length; i++) {
      var spec = hs[i].getAttribute('data-bk-ev').split(' ');
      for (var x = 0; x < spec.length; x++) { var p = spec[x].split(':'); hs[i]['on' + p[0]] = handlers[+p[1]]; }
    }
  }

  /* ---------- links: in-page anchors, home, sub-pages ---------- */
  function pageUrl(p) { return p === 'home' ? homeUrl : '/' + p; }
  function go(id) {
    var el = BK.$(id);
    if (!el) return false;
    if (BK.visible(el)) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); try { history.replaceState(null, '', '#' + id); } catch (e) {} return true; }
    var sec = el.closest('section'), p = SECTION_PAGE[sec ? sec.id : id] || 'home';
    location.href = pageUrl(p) + (sec && sec.id === id && PAGES[p] && PAGES[p][0] === id ? '' : '#' + id);
    return true;
  }
  function onClick(e) {
    var a = e.composedPath ? e.composedPath()[0] : e.target;
    a = a && a.closest ? a.closest('a[href]') : null;
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var h = a.getAttribute('href');
    if (h === '#top' || h === '#') {
      e.preventDefault();
      if (a.hasAttribute('data-bk-home') && page !== 'home') { location.href = homeUrl; return; }
      window.scrollTo({ top: 0, behavior: 'smooth' }); return;
    }
    if (h === '/' || h === homeUrl) { e.preventDefault(); if (page === 'home') window.scrollTo({ top: 0, behavior: 'smooth' }); else location.href = homeUrl; return; }
    if (h.charAt(0) === '#') { if (go(h.slice(1))) e.preventDefault(); }
  }

  /* ---------- Squarespace page: take the whole page (not inside the editor) ---------- */
  var PAGE_CSS = 'html{scroll-behavior:smooth}html,body{background:#1A1A1D!important;margin:0}' +
    'body.bk-site>*:not(#bk-app):not(script):not(style):not(link){display:none!important}' +
    '#bk-app{display:block;position:relative;width:100%;min-height:100vh;background:#1A1A1D;color:#F5F5F0;font-family:Montserrat,system-ui,sans-serif}';

  function mount() {
    host = document.getElementById('bk-app');
    if (!host) return;
    page = host.getAttribute('data-page') || 'home'; if (!(page in PAGES)) page = 'home';
    homeUrl = host.getAttribute('data-home') || '/';
    var inEditor = window.top !== window.self || /\/config(\/|$)/.test(location.pathname) || document.body.classList.contains('sqs-edit-mode');
    if (!document.querySelector('link[data-bk-fonts]')) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONTS; l.setAttribute('data-bk-fonts', ''); document.head.appendChild(l); }
    var st = document.createElement('style'); st.textContent = PAGE_CSS; document.head.appendChild(st);
    if (!inEditor) { document.body.classList.add('bk-site'); if (host.parentNode !== document.body) document.body.appendChild(host); }
    root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    var css = document.createElement('style');
    var hide = PAGES[page] ? 'section[id]:not(' + PAGES[page].map(function (s) { return '#' + s; }).join(',') + '){display:none!important}' : '';
    css.textContent = CSS + '\n' + hide + '\nsection[id],[id]{scroll-margin-top:64px}';
    root.appendChild(css);
    mountEl = document.createElement('div'); mountEl.className = 'bk-root'; root.appendChild(mountEl);
    tpl.innerHTML = TEMPLATE;
    root.addEventListener('click', onClick);
    comp = new Component({});
    render();
    if (comp.componentDidMount) comp.componentDidMount();
    if (location.hash.length > 1) setTimeout(function () { var el = BK.$(location.hash.slice(1)); if (el && BK.visible(el)) el.scrollIntoView({ block: 'start' }); }, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
