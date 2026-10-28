/* ---------- the public archive: Chronology · Catalogue · Projects · Documents & Media ----------
   Data: data/archive.json (works + projects, published from the archive app) and data/record.json (chronology + documents).
   Every record has an address: #BK-YYYY-NNN (work) · #PR-YYYY-NN (project) · #PR-YYYY-NN-NNN (project item) · #DOC-YYYY-NN (document)
   · #chronology · #chronology-YYYY · #catalogue · #projects · #documents. Any link to one of these, anywhere on the site, opens the record:
   works and documents open in the viewer on the page you are on; the rest go to the Archive. */
var ARCHIVE = (function () {
  var ROOT_URL = BASE.replace(/assets\/$/, '');
  var IMG = BASE + 'archive/';
  var CSS_AV = [
    '.av{display:flex;flex-direction:column;gap:28px;border-top:1px solid #3A3A3A;padding-top:56px;margin-top:16px;color:#F5F5F0}',
    '.av-head{display:flex;flex-direction:column;gap:20px}',
    '.av-head h3{margin:6px 0 0;font-size:clamp(26px,3vw,36px);font-weight:600;line-height:1.2}',
    '.av-head p{margin:8px 0 0;font-size:15px;line-height:1.7;color:#CFCFC8;max-width:680px}',
    '.av-tabs{display:flex;flex-wrap:wrap;border-bottom:1px solid #3A3A3A;gap:0 4px}',
    '.av-tabs button{font:inherit;font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:14px 18px 12px;background:transparent;color:#CFCFC8;border:0;border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;min-height:44px}',
    '.av-tabs button[aria-selected=true]{color:#D4AF37;border-bottom-color:#D4AF37}',
    '.av-tabs button:hover{color:#F5F5F0}',
    '@media(max-width:560px){.av-tabs{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.av-tabs::-webkit-scrollbar{display:none}.av-tabs button{flex:none;padding:12px 12px 10px;letter-spacing:2px}}',
    '.av-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
    '.av-bar input{flex:1 1 220px;min-width:0;font:inherit;font-size:15px;padding:12px 14px;background:#141416;border:1px solid #3A3A3A;color:#F5F5F0}',
    '.av-bar input::placeholder{color:#8A8A84}',
    '.av-bar select{font:inherit;font-size:14px;padding:12px 10px;background:#141416;border:1px solid #3A3A3A;color:#F5F5F0;max-width:100%}',
    '.av-chips{display:flex;flex-wrap:wrap;gap:8px}',
    '.av-chips button{font:inherit;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:9px 12px;background:transparent;border:1px solid #3A3A3A;color:#CFCFC8;cursor:pointer}',
    '.av-chips button[aria-pressed=true]{background:#D4AF37;border-color:#D4AF37;color:#1A1A1D;font-weight:600}',
    '.av-count{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#A8A8A0}',
    '.av-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:24px 20px}',
    '@media(max-width:560px){.av-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}}',
    '.av-card{display:flex;flex-direction:column;gap:8px;background:none;border:0;padding:0;text-align:left;color:inherit;font:inherit;cursor:pointer;min-width:0}',
    '.av-card .im{aspect-ratio:1;background:#141416;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:10px}',
    '.av-card img{max-width:100%;max-height:100%;object-fit:contain;display:block;transition:transform .3s}',
    '.av-card:hover img,.av-card:focus-visible img{transform:scale(1.03)}',
    '.av-card.flash .im{outline:2px solid #D4AF37}',
    '.av-no{font-size:11px;letter-spacing:1.5px;color:#D4AF37;font-variant-numeric:tabular-nums}',
    '.av-t{font-size:14px;line-height:1.4;font-weight:500;overflow-wrap:anywhere}',
    '.av-y{font-size:12px;color:#A8A8A0;line-height:1.5}',
    '.av-more{align-self:center}',
    '.av-empty{padding:32px;border:1px dashed #3A3A3A;text-align:center;color:#A8A8A0}',
    /* documents */
    '.av-doc .im{aspect-ratio:4/3}',
    '.av-paper{width:100%;height:100%;box-sizing:border-box;background:#F5F1E8;color:#1A1A1D;display:flex;flex-direction:column;justify-content:space-between;padding:14px;text-align:left}',
    '.av-paper .k{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#8A6D12}',
    '.av-paper .tt{font-size:13px;line-height:1.35;font-weight:500;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}',
    '.av-paper .r{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#6B6B6B}',
    /* chronology */
    '.av-dec{display:flex;flex-wrap:wrap;gap:4px 18px;font-size:13px;letter-spacing:2px}',
    '.av-dec a{color:#A8A8A0;text-decoration:none;padding:6px 0;border-bottom:1px solid transparent}',
    '.av-dec a:hover{color:#D4AF37;border-bottom-color:#D4AF37}',
    '.av-chron{display:flex;flex-direction:column}',
    '.av-yr{display:grid;grid-template-columns:120px minmax(0,1fr) 220px;gap:8px 32px;padding:28px 0;border-top:1px solid #2D2D2D;scroll-margin-top:130px}',
    '.av-yr .yy{font-size:34px;font-weight:200;color:#D4AF37;line-height:1;font-variant-numeric:tabular-nums}',
    '.av-yr .ev{display:flex;flex-direction:column;gap:14px}',
    '.av-e{display:flex;flex-direction:column;gap:6px;padding-left:16px;border-left:2px solid #3A3530}',
    '.av-e.k-award{border-left-color:#D4AF37}',
    '.av-e .m{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A8A84}',
    '.av-e .x{font-size:16px;line-height:1.6;color:#E8E6DF}',
    '.av-ln{display:flex;flex-wrap:wrap;gap:6px}',
    '.av-ln a{font-size:11px;letter-spacing:1px;color:#D4AF37;text-decoration:none;border:1px solid #4A4232;padding:5px 9px;line-height:1.3;max-width:100%;overflow-wrap:anywhere}',
    '.av-ln a:hover,.av-ln a:focus-visible{background:#D4AF37;color:#1A1A1D;border-color:#D4AF37}',
    '.av-yr .th{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;align-content:start}',
    '.av-yr .th a{display:block;aspect-ratio:1;background:#141416;overflow:hidden}',
    '.av-yr .th img{width:100%;height:100%;object-fit:cover;display:block;opacity:.9;transition:opacity .2s}',
    '.av-yr .th a:hover img{opacity:1}',
    '@media(max-width:900px){.av-yr{grid-template-columns:84px minmax(0,1fr)}.av-yr .th{grid-column:2;grid-template-columns:repeat(4,1fr)}}',
    '@media(max-width:560px){.av-yr{grid-template-columns:1fr;gap:14px;padding:22px 0}.av-yr .yy{font-size:28px}.av-yr .th{grid-column:1;grid-template-columns:repeat(4,1fr)}.av-e .x{font-size:15px}}',
    /* projects */
    '.av-pgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}',
    '.av-pcard{display:flex;flex-direction:column;background:#141416;border:1px solid #3A3A3A;border-top:3px solid #D4AF37;text-align:left;padding:0;color:inherit;font:inherit;cursor:pointer}',
    '.av-pcard .im{aspect-ratio:16/10;overflow:hidden;background:#0E0E10}',
    '.av-pcard .im img{width:100%;height:100%;object-fit:cover;display:block}',
    '.av-pcard .b{padding:20px 22px 24px;display:flex;flex-direction:column;gap:8px}',
    '.av-pcard .t{font-size:20px;font-weight:600;line-height:1.3}',
    '.av-pcard .s{font-size:14px;line-height:1.6;color:#CFCFC8}',
    '.av-proj{display:flex;flex-direction:column;gap:24px}',
    '.av-back{align-self:flex-start}',
    '.av-proj h4{margin:0;font-size:clamp(24px,3vw,32px);font-weight:600;line-height:1.25}',
    '.av-proj .sub{margin:0;font-size:17px;line-height:1.6;color:#CFCFC8;max-width:760px}',
    '.av-facts{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:8px 20px;font-size:14px;line-height:1.6;max-width:820px}',
    '.av-facts dt{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#D4AF37;padding-top:3px}',
    '.av-facts dd{margin:0;color:#E8E6DF}',
    '@media(max-width:560px){.av-facts{grid-template-columns:1fr;gap:2px}.av-facts dd{margin-bottom:10px}}',
    '.av-sum{margin:0;font-size:16px;line-height:1.8;color:#E8E6DF;max-width:760px}',
    '.av-stage{display:flex;flex-direction:column;gap:12px}',
    '.av-stage .sh{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#D4AF37;border-bottom:1px solid #3A3A3A;padding-bottom:8px}',
    '.av-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:16px}',
    '@media(max-width:560px){.av-tiles{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}',
    '.av-tile{display:flex;flex-direction:column;gap:6px;background:none;border:0;padding:0;text-align:left;color:inherit;font:inherit;cursor:pointer;min-width:0}',
    '.av-tile .im{position:relative;aspect-ratio:4/3;background:#141416;border:1px solid #2A2A2E;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#8A8A84;font-size:11px;letter-spacing:2px;text-transform:uppercase}',
    '.av-tile.key .im{border-color:#D4AF37}',
    '.av-tile .im img{width:100%;height:100%;object-fit:cover;display:block}',
    '.av-tile .n{position:absolute;right:6px;bottom:6px;background:rgba(0,0,0,.65);color:#fff;font-size:10px;padding:2px 6px}',
    '.av-tile .tt{font-size:13px;line-height:1.4;overflow-wrap:anywhere}',
    '.av-tile .d{font-size:11px;color:#A8A8A0}',
    '.av-also{display:flex;flex-direction:column;gap:10px;border-top:1px solid #2D2D2D;padding-top:20px}',
    '.av-also .sh{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#D4AF37}',
    /* viewer */
    '.av-v{position:fixed;inset:0;z-index:2000;background:#0B0B0D;color:#F5F5F0;display:flex;flex-direction:column;font-family:Montserrat,system-ui,sans-serif}',
    '.av-v .top{display:flex;align-items:center;gap:12px;padding:12px 16px;font-size:12px;letter-spacing:2px;text-transform:uppercase}',
    '.av-v .top .pos{margin-right:auto;color:#A8A8A0}',
    '.av-v .top button,.av-v .top a{font:inherit;font-size:12px;letter-spacing:2px;padding:10px 16px;background:transparent;border:1px solid #3A3A3A;color:#F5F5F0;cursor:pointer;text-decoration:none}',
    '.av-v .top a{color:#D4AF37;border-color:#4A4232}',
    '.av-v .main{flex:1;min-height:0;position:relative;display:flex;align-items:center;justify-content:center;padding:0 64px}',
    '.av-v .main img{max-width:100%;max-height:100%;object-fit:contain;display:block}',
    '.av-v .main .av-paper{width:min(520px,100%);height:auto;aspect-ratio:auto;min-height:280px;padding:36px;gap:24px}',
    '.av-v .main .av-paper .tt{font-size:22px;-webkit-line-clamp:unset;display:block}',
    '.av-v .main .av-paper .nt{font-size:15px;line-height:1.7;color:#3A3A3A}',
    '.av-v .main .av-paper a{align-self:flex-start;font-size:12px;letter-spacing:2px;color:#1A1A1D;border:1px solid #1A1A1D;padding:12px 18px;text-decoration:none}',
    '.av-v .nav{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:72px;border:0;background:rgba(255,255,255,.06);color:#F5F5F0;font-size:28px;cursor:pointer}',
    '.av-v .nav.l{left:8px}.av-v .nav.r{right:8px}',
    '.av-v .cap{padding:14px 16px 6px;max-width:920px;width:100%;margin:0 auto;box-sizing:border-box;display:flex;flex-direction:column;gap:6px}',
    '.av-v .cap .no{font-size:12px;letter-spacing:2px;color:#D4AF37}',
    '.av-v .cap .t{font-size:18px;font-weight:500;line-height:1.35}',
    '.av-v .cap .m{font-size:14px;color:#CFCFC8;line-height:1.6}',
    '.av-v .cap .av-ln{margin-top:4px}',
    '.av-v .strip{display:flex;gap:6px;overflow-x:auto;padding:8px 16px 16px;justify-content:center}',
    '.av-v .strip button{flex:none;width:60px;height:46px;padding:0;border:1px solid transparent;background:#222;opacity:.5;cursor:pointer}',
    '.av-v .strip button.on{opacity:1;border-color:#D4AF37}',
    '.av-v .strip img{width:100%;height:100%;object-fit:cover;display:block}',
    '@media(max-width:640px){.av-v .main{padding:0 4px}.av-v .nav{width:36px;height:56px;background:rgba(0,0,0,.4)}.av-v .top a{display:none}}'
  ].join('\n');

  var TABS = [['chronology', 'Chronology'], ['catalogue', 'Catalogue'], ['projects', 'Projects'], ['documents', 'Documents & Media']];
  var HEAD = {
    chronology: ['The life, year by year', 'Schooling, training, exhibitions, prizes, projects and works, in order. Every entry links to its record.'],
    catalogue: ['Catalogue of works', 'Every public work, by its catalogue number. The same number appears on its certificate of authenticity.'],
    projects: ['Projects', 'Commissions and collaborations, from first idea to reception.'],
    documents: ['Documents & Media', 'Photographs, press, certificates, programmes, video and poems. Originals not shown here are held in the archive and open to curators on request.']
  };
  var ITEM_KIND = { document: 'Programme', press: 'Press', video: 'Video', batch: 'Photographs', note: 'Note', prototype: 'Prototype' };

  var data = null, rec = null, idx = {}, back = {}, loading = null, R = null, el = null, waiting = [];
  var st = { tab: 'chronology', q: '', cat: '', dec: '', shown: 24, proj: null, kind: '', dkind: '', flash: '' }, viewer = null;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* an image is {id} (archive web copies -s/-l) or {a} (site asset, one size) */
  function src(im, big) { if (!im) return ''; if (im.a) return asset('/_blob/' + im.a); return IMG + im.id + (big ? '-l.webp' : '-s.webp'); }
  function img(im, alt, big) { return '<img loading="lazy" decoding="async" alt="' + esc(alt) + '" src="' + src(im, big) + '">'; }
  var MON = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function ym(s) { if (!s) return ''; var m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(s); if (!m) return s; return (m[3] ? +m[3] + ' ' : '') + (m[2] ? MON[+m[2]] + ' ' : '') + m[1]; }
  function visible() { return !!(el && el.getClientRects().length); }

  /* ---------- data ---------- */
  function load(cb) {
    if (data && rec) { if (cb) cb(); return; }
    if (cb) waiting.push(cb);
    if (loading) return;
    var j = function (u) { return fetch(ROOT_URL + u).then(function (r) { if (!r.ok) throw new Error(u); return r.json(); }); };
    loading = Promise.all([j('data/archive.json'), j('data/record.json').catch(function () { return { chronology: [], documents: [], kinds: {} }; })]).then(function (r) {
      data = r[0]; rec = r[1]; index();
      var w = waiting; waiting = []; w.forEach(function (f) { try { f(); } catch (e) {} });
      draw(); if (BK.rerender) BK.rerender();
    }).catch(function () { loading = null; if (el) el.innerHTML = ''; });
  }
  function index() {
    idx = {}; back = {};
    data.works.forEach(function (w) { idx[w.inv] = { type: 'work', rec: w, label: w.title, img: w.images && w.images[0] }; });
    data.projects.forEach(function (p) {
      idx[p.pid] = { type: 'project', rec: p, label: p.title, img: p.cover ? { id: p.cover } : null };
      (p.items || []).forEach(function (it) { idx[it.no] = { type: 'item', rec: it, proj: p, label: it.title, img: it.images && it.images[0] }; });
    });
    rec.documents.forEach(function (d) { idx[d.id] = { type: 'doc', rec: d, label: d.title, img: d.img ? { a: d.img } : null }; });
    rec.chronology.forEach(function (e) { (e.l || []).forEach(function (l) { if (typeof l === 'string') (back[l] = back[l] || []).push(e); }); });
  }
  function find(id) { return idx[id] || null; }
  /* title → catalogue number, for the curated Artworks section */
  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9஀-௿]+/g, ' ').trim(); }
  function invFor(title, year) {
    if (!data) return '';
    var t = norm(title), hit = '';
    data.works.forEach(function (w) { if (!hit && norm(w.title) === t && (!year || String(w.year) === String(year))) hit = w.inv; });
    if (!hit) data.works.forEach(function (w) { if (!hit && norm(w.title) === t) hit = w.inv; });
    /* a view of a work ("Bird Sanctum, the nest") → the work itself, same year */
    if (!hit && title.indexOf(',') > 0) { var base = norm(title.split(',')[0]); data.works.forEach(function (w) { if (!hit && norm(w.title) === base && (!year || String(w.year) === String(year))) hit = w.inv; }); }
    return hit;
  }

  /* ---------- links ---------- */
  function linkLabel(l) {
    if (typeof l !== 'string') return esc(l.t) + ' →';
    var r = find(l); if (!r) return esc(l);
    var lab = r.type === 'doc' ? r.rec.kind + ' · ' + r.rec.title : r.label;
    return '<span style="opacity:.75">' + esc(l) + '</span> · ' + esc(lab.length > 52 ? lab.slice(0, 50) + '…' : lab);
  }
  function links(list) {
    list = (list || []).filter(function (l) { return typeof l !== 'string' || find(l); });
    if (!list.length) return '';
    return '<div class="av-ln">' + list.map(function (l) { return '<a href="#' + esc(typeof l === 'string' ? l : l.h.replace(/^#/, '')) + '">' + linkLabel(l) + '</a>'; }).join('') + '</div>';
  }
  function backLinks(id) {
    var ev = back[id] || [];
    if (!ev.length) return [];
    var yrs = []; ev.forEach(function (e) { if (yrs.indexOf(e.y) < 0) yrs.push(e.y); });
    return yrs.map(function (y) { return { h: '#chronology-' + y, t: 'Chronology · ' + y }; });
  }

  /* ---------- views ---------- */
  function draw() {
    if (!el) return;
    if (!data) { el.innerHTML = ''; return; }
    var hd = HEAD[st.tab];
    var h = '<div class="av"><div class="av-head"><div><div class="lbl" style="color:#D4AF37">The public record</div>' +
      '<h3>' + hd[0] + '</h3><p>' + hd[1] + '</p></div>' +
      '<div class="av-tabs" role="tablist">' + TABS.map(function (t) { return '<button type="button" role="tab" data-av="tab:' + t[0] + '" aria-selected="' + (st.tab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div></div>';
    if (st.tab === 'chronology') h += chronology();
    else if (st.tab === 'catalogue') h += catalogue();
    else if (st.tab === 'documents') h += documents();
    else h += st.proj ? project() : projects();
    el.innerHTML = h + '</div>';
  }

  function chronology() {
    var kinds = rec.kinds || {}, q = st.q.trim().toLowerCase();
    var used = []; rec.chronology.forEach(function (e) { if (used.indexOf(e.k) < 0) used.push(e.k); });
    var list = rec.chronology.filter(function (e) {
      if (st.kind && e.k !== st.kind) return false;
      if (q && [e.y, e.span, e.d, e.t, (e.l || []).map(function (l) { var r = typeof l === 'string' && find(l); return (typeof l === 'string' ? l : l.t) + ' ' + (r ? r.label : ''); }).join(' ')].join(' ').toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var years = [], by = {};
    list.forEach(function (e) { if (!by[e.y]) { by[e.y] = []; years.push(e.y); } by[e.y].push(e); });
    years.sort(function (a, b) { return a - b; });
    var decs = []; years.forEach(function (y) { var d = Math.floor(y / 10) * 10; if (decs.indexOf(d) < 0) decs.push(d); });
    var h = '<div class="av-bar"><input type="search" data-av-q placeholder="Search the chronology…" aria-label="Search the chronology" value="' + esc(st.q) + '"></div>' +
      '<div class="av-chips" role="group" aria-label="Show">' + ['', ].concat(Object.keys(kinds).filter(function (k) { return used.indexOf(k) >= 0; })).map(function (k) {
        return '<button type="button" data-av="kind:' + k + '" aria-pressed="' + (st.kind === k) + '">' + esc(k ? kinds[k] : 'All') + '</button>';
      }).join('') + '</div>' +
      '<nav class="av-dec" aria-label="Decades">' + decs.map(function (d) { var y = years.filter(function (x) { return Math.floor(x / 10) * 10 === d; })[0]; return '<a href="#chronology-' + y + '">' + d + 's</a>'; }).join('') + '</nav>';
    if (!years.length) return h + '<div class="av-empty">Nothing matches.</div>';
    h += '<div class="av-chron">';
    years.forEach(function (y) {
      var ev = by[y], thumbs = [], seen = {};
      ev.forEach(function (e) { (e.l || []).forEach(function (l) { var r = typeof l === 'string' && find(l); if (r && r.img && !seen[l] && thumbs.length < 4) { seen[l] = 1; thumbs.push([l, r]); } }); });
      h += '<div class="av-yr" data-y="' + y + '" id="chronology-' + y + '"><div class="yy">' + y + '</div><div class="ev">' + ev.map(function (e) {
        var m = [e.span, e.d].filter(Boolean).join(' · ');
        return '<div class="av-e k-' + esc(e.k) + '"><div class="m">' + esc((m ? m + ' · ' : '') + (kinds[e.k] || e.k)) + '</div><div class="x">' + esc(e.t) + '</div>' + links(e.l) + '</div>';
      }).join('') + '</div><div class="th">' + thumbs.map(function (t) { return '<a href="#' + esc(t[0]) + '" title="' + esc(t[0] + ' · ' + t[1].label) + '">' + img(t[1].img, t[1].label) + '</a>'; }).join('') + '</div></div>';
    });
    return h + '</div>';
  }

  function works() {
    var q = st.q.trim().toLowerCase();
    return data.works.filter(function (w) {
      if (st.cat && w.category !== st.cat) return false;
      if (st.dec && String(Math.floor((w.year || 0) / 10) * 10) !== st.dec) return false;
      if (q && [w.inv, w.title, w.year, w.medium, w.category, w.series].join(' ').toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
  }
  function options(list, cur, label, fmt) { return '<option value="">' + label + '</option>' + list.map(function (v) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(fmt ? fmt(v) : v) + '</option>'; }).join(''); }
  function catalogue() {
    var cats = [], decs = [];
    data.works.forEach(function (w) { if (w.category && cats.indexOf(w.category) < 0) cats.push(w.category); var d = String(Math.floor((w.year || 0) / 10) * 10); if (w.year && decs.indexOf(d) < 0) decs.push(d); });
    cats.sort(); decs.sort();
    var list = works();
    var h = '<div class="av-bar"><input type="search" data-av-q placeholder="Search title, number, medium…" aria-label="Search the catalogue" value="' + esc(st.q) + '">' +
      '<select data-av-f="cat" aria-label="Category">' + options(cats, st.cat, 'All categories') + '</select>' +
      '<select data-av-f="dec" aria-label="Decade">' + options(decs, st.dec, 'All decades', function (d) { return d + 's'; }) + '</select></div>' +
      '<div class="av-count">' + list.length + (list.length === 1 ? ' work' : ' works') + '</div>';
    if (!list.length) return h + '<div class="av-empty">No works match.</div>';
    h += '<div class="av-grid">' + list.slice(0, st.shown).map(function (w) {
      var f = w.images && w.images[0];
      return '<button type="button" class="av-card' + (st.flash === w.inv ? ' flash' : '') + '" data-av="work:' + esc(w.inv) + '" title="' + esc(w.inv + ' · ' + w.title + (w.year ? ', ' + w.year : '')) + '"><span class="im">' + (f ? img(f, w.title) : '') + '</span>' +
        '<span class="av-no">' + esc(w.inv) + '</span><span class="av-t">' + esc(w.title) + '</span><span class="av-y">' + esc([w.year, w.medium].filter(Boolean).join(' · ')) + '</span></button>';
    }).join('') + '</div>';
    if (list.length > st.shown) h += '<button type="button" class="btn-line av-more" data-av="more">SHOW MORE</button>';
    return h;
  }

  /* documents = record documents + public project items (programmes, press, video, photographs) */
  function docs() {
    var out = rec.documents.map(function (d) { return { id: d.id, date: d.date, kind: d.kind, title: d.title, by: d.by, note: d.note, img: d.img ? { a: d.img } : null, n: d.img ? 1 : 0, l: d.l || [] }; });
    data.projects.forEach(function (p) {
      (p.items || []).forEach(function (it) {
        var k = ITEM_KIND[it.kind]; if (!k || k === 'Note' || k === 'Prototype') return;
        out.push({ id: it.no, date: it.date, kind: k, title: it.title, note: p.title, img: it.images && it.images[0], n: (it.images || []).length, l: [p.pid] });
      });
    });
    out.sort(function (a, b) { return String(a.date).localeCompare(String(b.date)) || a.id.localeCompare(b.id); });
    return out;
  }
  function documents() {
    var all = docs(), kinds = [], q = st.q.trim().toLowerCase();
    all.forEach(function (d) { if (kinds.indexOf(d.kind) < 0) kinds.push(d.kind); }); kinds.sort();
    var list = all.filter(function (d) {
      if (st.dkind && d.kind !== st.dkind) return false;
      if (q && [d.id, d.date, d.kind, d.title, d.by, d.note].join(' ').toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var h = '<div class="av-bar"><input type="search" data-av-q placeholder="Search documents, press, photographs…" aria-label="Search documents and media" value="' + esc(st.q) + '"></div>' +
      '<div class="av-chips" role="group" aria-label="Kind">' + [''].concat(kinds).map(function (k) { return '<button type="button" data-av="dkind:' + esc(k) + '" aria-pressed="' + (st.dkind === k) + '">' + esc(k || 'All') + '</button>'; }).join('') + '</div>' +
      '<div class="av-count">' + list.length + (list.length === 1 ? ' record' : ' records') + '</div>';
    if (!list.length) return h + '<div class="av-empty">Nothing matches.</div>';
    return h + '<div class="av-grid">' + list.map(function (d) {
      return '<button type="button" class="av-card av-doc' + (st.flash === d.id ? ' flash' : '') + '" id="rec-' + esc(d.id) + '" data-av="doc:' + esc(d.id) + '" title="' + esc(d.id + ' · ' + d.title) + '"><span class="im"' + (d.img ? '' : ' style="padding:0"') + '>' +
        (d.img ? img(d.img, d.title) : '<span class="av-paper"><span class="k">' + esc(d.kind) + '</span><span class="tt">' + esc(d.title) + '</span><span class="r">In the archive · on request</span></span>') + '</span>' +
        '<span class="av-no">' + esc(d.id) + '</span><span class="av-t">' + esc(d.title) + '</span><span class="av-y">' + esc([ym(d.date), d.kind, d.n > 1 ? d.n + ' images' : ''].filter(Boolean).join(' · ')) + '</span></button>';
    }).join('') + '</div>';
  }

  function projects() {
    return '<div class="av-pgrid">' + data.projects.map(function (p) {
      return '<button type="button" class="av-pcard" data-av="proj:' + esc(p.pid) + '"><span class="im">' + (p.cover ? img({ id: p.cover }, p.title, true) : '') + '</span><span class="b">' +
        '<span class="av-no">' + esc(p.pid + ' · ' + [ym(p.start).replace(/^\d+ /, ''), ym(p.end).replace(/^\d+ /, '')].filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(' – ')) + '</span>' +
        '<span class="t">' + esc(p.title) + '</span><span class="s">' + esc(p.subtitle || '') + '</span></span></button>';
    }).join('') + '</div>';
  }
  function project() {
    var p = data.projects.filter(function (x) { return x.pid === st.proj; })[0];
    if (!p) return projects();
    var h = '<div class="av-proj"><button type="button" class="btn-line av-back" data-av="proj:">← ALL PROJECTS</button>' +
      '<div class="av-no">' + esc(p.pid) + '</div><h4>' + esc(p.title) + '</h4>' + (p.subtitle ? '<p class="sub">' + esc(p.subtitle) + '</p>' : '') +
      '<dl class="av-facts">' + [['Type', p.type], ['Dates', [ym(p.start), ym(p.end)].filter(function (v, i, a) { return v && a.indexOf(v) === i; }).join(' – ')], ['With', p.partners], ['Role', p.role]].filter(function (r) { return r[1]; }).map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' +
      (p.summary ? '<p class="av-sum">' + esc(p.summary) + '</p>' : '');
    var stages = {};
    (p.items || []).forEach(function (it) { (stages[it.stage] = stages[it.stage] || []).push(it); });
    Object.keys(stages).sort().forEach(function (s) {
      h += '<div class="av-stage"><div class="sh">' + ('0' + s).slice(-2) + ' · ' + esc(data.stages[s - 1] || '') + '</div><div class="av-tiles">' + stages[s].map(function (it) {
        var f = it.images && it.images[0];
        return '<button type="button" class="av-tile' + (it.key ? ' key' : '') + '" data-av="item:' + esc(it.no) + '"><span class="im">' + (f ? img(f, it.title) : esc(it.kind || '')) + (it.images && it.images.length > 1 ? '<span class="n">' + it.images.length + '</span>' : '') + '</span>' +
          '<span class="tt">' + esc(it.title) + '</span><span class="d">' + esc([ym(it.date), it.kind].filter(Boolean).join(' · ')) + '</span></button>';
      }).join('') + '</div></div>';
    });
    var rel = backLinks(p.pid);
    rec.documents.forEach(function (d) { if ((d.l || []).indexOf(p.pid) >= 0) rel.push(d.id); });
    rec.chronology.forEach(function (e) { if ((e.l || []).indexOf(p.pid) >= 0) (e.l || []).forEach(function (l) { if (typeof l === 'string' && /^BK-/.test(l) && rel.indexOf(l) < 0) rel.push(l); }); });
    if (rel.length) h += '<div class="av-also"><div class="sh">In the record</div>' + links(rel) + '</div>';
    return h + '</div>';
  }

  /* ---------- full-screen viewer (works on every page) ---------- */
  function openViewer(seq, i) {
    if (viewer) closeViewer(true);
    viewer = { seq: seq, i: i || 0 };
    var v = document.createElement('div'); v.className = 'av-v'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true');
    R.appendChild(v); viewer.el = v; document.documentElement.style.overflow = 'hidden';
    drawViewer();
    v.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (a) { closeViewer(true); return; }   /* the site's link router takes it from here */
      var b = e.target.closest('[data-v]'); if (!b) return;
      var k = b.getAttribute('data-v');
      if (k === 'close') closeViewer(); else if (k === 'prev') step(-1); else if (k === 'next') step(1); else goTo(+k);
    });
    var x0 = null;
    v.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    v.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); x0 = null; });
    var f = v.querySelector('[data-v=close]'); if (f) try { f.focus({ preventScroll: true }); } catch (e) {}
  }
  function drawViewer() {
    var s = viewer.seq, c = s[viewer.i], multi = s.length > 1;
    var inArchive = visible() && c.hash && !/^PR-/.test(c.hash);
    var main = c.im ? '<img alt="' + esc(c.title) + '" src="' + src(c.im, true) + '">' :
      '<div class="av-paper"><span class="k">' + esc(c.kind || 'Record') + ' · ' + esc(c.no) + '</span><span class="tt">' + esc(c.title) + '</span>' + (c.meta ? '<span class="nt">' + esc(c.meta) + '</span>' : '') +
      '<span class="nt">The original is held in the archive and is open to curators, writers and press on request.</span><a href="mailto:studio@baaskaraa.com?subject=' + encodeURIComponent('Archive request · ' + c.no) + '">REQUEST ACCESS</a></div>';
    viewer.el.innerHTML = '<div class="top"><span class="pos">' + (multi ? (viewer.i + 1) + ' / ' + s.length : esc(c.no)) + '</span>' +
      (c.hash && !inArchive ? '<a href="#' + esc(c.home || c.hash) + '" data-open>' + (c.home && /^PR-/.test(c.home) ? 'SEE THE PROJECT' : 'OPEN IN THE ARCHIVE') + '</a>' : '') +
      '<button type="button" data-v="close">CLOSE</button></div>' +
      '<div class="main">' + (multi ? '<button type="button" class="nav l" data-v="prev" aria-label="Previous">‹</button>' : '') + main + (multi ? '<button type="button" class="nav r" data-v="next" aria-label="Next">›</button>' : '') + '</div>' +
      '<div class="cap"><span class="no">' + esc(c.no) + '</span><span class="t">' + esc(c.title) + '</span>' + (c.meta && c.im ? '<span class="m">' + esc(c.meta) + '</span>' : '') + links(c.links) + '</div>' +
      (multi ? '<div class="strip">' + s.map(function (x, i) { return '<button type="button" data-v="' + i + '" class="' + (i === viewer.i ? 'on' : '') + '" aria-label="Image ' + (i + 1) + '">' + (x.im ? '<img alt="" loading="lazy" src="' + src(x.im) + '">' : '') + '</button>'; }).join('') + '</div>' : '');
    if (c.hash) try { history.replaceState(null, '', location.pathname + location.search + '#' + c.hash); } catch (e) {}
  }
  function step(d) { if (!viewer) return; viewer.i = (viewer.i + d + viewer.seq.length) % viewer.seq.length; drawViewer(); }
  function goTo(i) { viewer.i = i; drawViewer(); }
  function closeViewer(keepHash) {
    if (!viewer) return; viewer.el.remove(); viewer = null; document.documentElement.style.overflow = '';
    if (!keepHash) try { if (/^#(BK|PR|DOC)-/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  document.addEventListener('keydown', function (e) { if (!viewer) return; if (e.key === 'Escape') closeViewer(); else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1); });

  function workSeq(list) {
    var seq = [];
    list.forEach(function (w) { (w.images || []).forEach(function (im, k) { seq.push({ im: im, no: w.inv + (w.images.length > 1 ? ' · ' + (k + 1) + '/' + w.images.length : ''), title: w.title + (w.year ? ', ' + w.year : ''), meta: [w.medium, w.size, w.series].filter(Boolean).join(' · '), hash: w.inv, inv: w.inv, links: backLinks(w.inv) }); }); });
    return seq;
  }
  function openWork(inv) {
    var inView = visible() && st.tab === 'catalogue';
    var seq = workSeq(inView && works().length ? works() : data.works), i = -1;
    for (var k = 0; k < seq.length; k++) if (seq[k].inv === inv) { i = k; break; }
    if (i < 0) { seq = workSeq(data.works); for (k = 0; k < seq.length; k++) if (seq[k].inv === inv) { i = k; break; } }
    if (i >= 0) { openViewer(seq, i); return true; }
    return false;
  }
  function docEntry(d) {
    var rel = (d.l || []).slice().concat(backLinks(d.id));
    return { im: d.img, no: d.id, kind: d.kind, title: d.title, meta: [ym(d.date), d.kind, d.by, d.note].filter(Boolean).join(' · '), hash: d.id, links: rel };
  }
  function openDoc(id) {
    var list = docs(), seq = [], i = 0;
    list.forEach(function (d) {
      if (/^PR-/.test(d.id)) {
        var r = find(d.id); var ims = (r && r.rec.images) || [];
        if (!ims.length) { if (d.id === id) i = seq.length; seq.push({ no: d.id, kind: d.kind, title: d.title, meta: d.note, hash: d.id, home: r.proj.pid, links: [r.proj.pid] }); return; }
        ims.forEach(function (im, k) { if (d.id === id && k === 0) i = seq.length; seq.push({ im: im, no: d.id + (ims.length > 1 ? ' · ' + (k + 1) + '/' + ims.length : ''), kind: d.kind, title: d.title, meta: [ym(d.date), d.kind, d.note].filter(Boolean).join(' · '), hash: d.id, home: r.proj.pid, links: [r.proj.pid] }); });
      } else { if (d.id === id) i = seq.length; seq.push(docEntry(find(d.id).rec)); }
    });
    if (!seq.length) return false;
    openViewer(seq, i); return true;
  }
  function openItem(no) {
    var r = find(no); if (!r) return false;
    var p = r.proj, seq = [], i = 0;
    (p.items || []).forEach(function (it) { (it.images || []).forEach(function (im, k) { if (it.no === no && k === 0) i = seq.length; seq.push({ im: im, no: it.no, title: it.title, meta: [ym(it.date), it.kind].filter(Boolean).join(' · '), hash: it.no, home: p.pid, links: [p.pid] }); }); });
    if (!seq.length) return false;
    openViewer(seq, i); return true;
  }

  /* ---------- routing ---------- */
  var RE_ID = /^(BK-\d{4}-\d{3}|PR-\d{4}-\d{2}(-\d{3})?|DOC-\d{4}-\d{2}|chronology(-\d{4})?|catalogue|projects|documents)$/;
  function handles(id) { return RE_ID.test(id); }
  function setTab(t) { if (st.tab !== t) { st.tab = t; st.q = ''; st.shown = 24; } if (t !== 'projects') st.proj = null; if (BK.onArchive) BK.onArchive(t); }
  function scrollTo(node) { if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  /* returns true when handled on this page; false = go to the Archive page with this address */
  function route(id) {
    if (!handles(id)) return false;
    if (!data) { if (!visible() && /^(chronology|catalogue|projects|documents|PR-\d{4}-\d{2}$)/.test(id)) return false; load(function () { route(id); }); return true; }
    var r = find(id), v = visible();
    if (/^BK-/.test(id)) { if (!r) return false; if (v) { setTab('catalogue'); st.flash = id; draw(); } return openWork(id); }
    if (/^DOC-/.test(id)) { if (!r) return false; if (v) { setTab('documents'); st.flash = id; draw(); } return openDoc(id); }
    if (/^PR-\d{4}-\d{2}-\d{3}$/.test(id)) {
      if (!r) return false;
      if (!v) return openItem(id);
      setTab('projects'); st.proj = r.proj.pid; draw(); scrollTo(el); return openItem(id);
    }
    if (!v) return false;
    if (/^PR-/.test(id)) { setTab('projects'); st.proj = r ? id : null; draw(); scrollTo(el); return true; }
    var m = /^chronology(?:-(\d{4}))?$/.exec(id);
    if (m) {
      setTab('chronology');
      if (m[1] && st.kind) st.kind = '';
      if (m[1]) st.q = '';
      draw();
      var y = m[1] ? +m[1] : 0, node = null;
      if (y) { var rows = el.querySelectorAll('.av-yr'); for (var i = 0; i < rows.length; i++) { if (+rows[i].getAttribute('data-y') <= y) node = rows[i]; } }
      scrollTo(node || el);
      try { history.replaceState(null, '', location.pathname + location.search + '#' + id); } catch (e) {}
      return true;
    }
    setTab(id); draw(); scrollTo(el);
    try { history.replaceState(null, '', location.pathname + location.search + '#' + id); } catch (e) {}
    return true;
  }

  /* ---------- events ---------- */
  function onClick(e) {
    var b = e.target.closest('[data-av]'); if (!b) return;
    var a = b.getAttribute('data-av'), k = a.indexOf(':'), cmd = k < 0 ? a : a.slice(0, k), arg = k < 0 ? '' : a.slice(k + 1);
    st.flash = '';
    if (cmd === 'tab') { setTab(arg); draw(); try { history.replaceState(null, '', location.pathname + location.search + '#' + arg); } catch (x) {} }
    else if (cmd === 'more') { st.shown += 24; draw(); }
    else if (cmd === 'work') openWork(arg);
    else if (cmd === 'doc') openDoc(arg);
    else if (cmd === 'kind') { st.kind = arg; draw(); }
    else if (cmd === 'dkind') { st.dkind = arg; draw(); }
    else if (cmd === 'proj') { st.proj = arg || null; draw(); scrollTo(el); try { history.replaceState(null, '', location.pathname + location.search + '#' + (arg || 'projects')); } catch (x) {} }
    else if (cmd === 'item') openItem(arg);
  }
  function onInput(e) {
    var t = e.target;
    if (t.hasAttribute('data-av-q')) { st.q = t.value; st.shown = 24; var pos = t.selectionStart; draw(); var n = el.querySelector('[data-av-q]'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) {} } }
  }
  function onChange(e) { var f = e.target.getAttribute && e.target.getAttribute('data-av-f'); if (f) { st[f] = e.target.value; st.shown = 24; draw(); } }

  function mount(root) {
    R = root;
    if (!root.querySelector('style[data-av]')) { var s = document.createElement('style'); s.setAttribute('data-av', ''); s.textContent = CSS_AV; root.appendChild(s); }
    var host = root.getElementById ? root.getElementById('bk-archive-view') : null;
    if (!host || host === el) { if (!data) load(); return; }
    el = host;
    el.addEventListener('click', onClick); el.addEventListener('input', onInput); el.addEventListener('change', onChange);
    if (data) draw(); else load();
  }
  return { mount: mount, load: load, route: route, handles: handles, invFor: invFor, tab: function () { return st.tab; }, visible: visible };
})();
