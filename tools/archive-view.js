/* ---------- public archive view: catalogue + projects, from data/archive.json (published from the archive app) ---------- */
var ARCHIVE = (function () {
  var DATA_URL = BASE.replace(/assets\/$/, '') + 'data/archive.json';
  var IMG = BASE + 'archive/';
  var CSS_AV = [
    '.av{display:flex;flex-direction:column;gap:28px;border-top:1px solid #3A3A3A;padding-top:56px;margin-top:16px;color:#F5F5F0}',
    '.av-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 32px}',
    '.av-head h3{margin:6px 0 0;font-size:clamp(26px,3vw,36px);font-weight:600;line-height:1.2}',
    '.av-head p{margin:8px 0 0;font-size:15px;line-height:1.7;color:#CFCFC8;max-width:620px}',
    '.av-tabs{display:inline-flex;border:1px solid #3A3A3A}',
    '.av-tabs button{font:inherit;font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:12px 20px;background:transparent;color:#CFCFC8;border:0;cursor:pointer}',
    '.av-tabs button[aria-selected=true]{background:#D4AF37;color:#1A1A1D;font-weight:600}',
    '.av-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
    '.av-bar input{flex:1 1 220px;min-width:0;font:inherit;font-size:15px;padding:12px 14px;background:#141416;border:1px solid #3A3A3A;color:#F5F5F0}',
    '.av-bar input::placeholder{color:#8A8A84}',
    '.av-bar select{font:inherit;font-size:14px;padding:12px 10px;background:#141416;border:1px solid #3A3A3A;color:#F5F5F0;max-width:100%}',
    '.av-count{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#A8A8A0}',
    '.av-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:24px 20px}',
    '@media(max-width:560px){.av-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}}',
    '.av-card{display:flex;flex-direction:column;gap:8px;background:none;border:0;padding:0;text-align:left;color:inherit;font:inherit;cursor:pointer;min-width:0}',
    '.av-card .im{aspect-ratio:1;background:#141416;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:10px}',
    '.av-card img{max-width:100%;max-height:100%;object-fit:contain;display:block;transition:transform .3s}',
    '.av-card:hover img,.av-card:focus-visible img{transform:scale(1.03)}',
    '.av-no{font-size:11px;letter-spacing:1.5px;color:#D4AF37;font-variant-numeric:tabular-nums}',
    '.av-t{font-size:14px;line-height:1.4;font-weight:500;overflow-wrap:anywhere}',
    '.av-y{font-size:12px;color:#A8A8A0}',
    '.av-more{align-self:center}',
    '.av-empty{padding:32px;border:1px dashed #3A3A3A;text-align:center;color:#A8A8A0}',
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
    '.av-v{position:fixed;inset:0;z-index:2000;background:#0B0B0D;color:#F5F5F0;display:flex;flex-direction:column}',
    '.av-v .top{display:flex;align-items:center;gap:12px;padding:12px 16px;font-size:12px;letter-spacing:2px;text-transform:uppercase}',
    '.av-v .top .pos{margin-right:auto;color:#A8A8A0}',
    '.av-v .top button{font:inherit;font-size:12px;letter-spacing:2px;padding:10px 16px;background:transparent;border:1px solid #3A3A3A;color:#F5F5F0;cursor:pointer}',
    '.av-v .main{flex:1;min-height:0;position:relative;display:flex;align-items:center;justify-content:center;padding:0 64px}',
    '.av-v .main img{max-width:100%;max-height:100%;object-fit:contain;display:block}',
    '.av-v .nav{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:72px;border:0;background:rgba(255,255,255,.06);color:#F5F5F0;font-size:28px;cursor:pointer}',
    '.av-v .nav.l{left:8px}.av-v .nav.r{right:8px}',
    '.av-v .cap{padding:14px 16px 6px;max-width:920px;width:100%;margin:0 auto;box-sizing:border-box;display:flex;flex-direction:column;gap:4px}',
    '.av-v .cap .no{font-size:12px;letter-spacing:2px;color:#D4AF37}',
    '.av-v .cap .t{font-size:18px;font-weight:500;line-height:1.35}',
    '.av-v .cap .m{font-size:14px;color:#CFCFC8;line-height:1.6}',
    '.av-v .strip{display:flex;gap:6px;overflow-x:auto;padding:8px 16px 16px;justify-content:center}',
    '.av-v .strip button{flex:none;width:60px;height:46px;padding:0;border:1px solid transparent;background:#222;opacity:.5;cursor:pointer}',
    '.av-v .strip button.on{opacity:1;border-color:#D4AF37}',
    '.av-v .strip img{width:100%;height:100%;object-fit:cover;display:block}',
    '@media(max-width:640px){.av-v .main{padding:0 4px}.av-v .nav{width:36px;height:56px;background:rgba(0,0,0,.4)}}'
  ].join('\n');

  var data = null, el = null, st = { tab: 'works', q: '', cat: '', dec: '', shown: 24, proj: null }, viewer = null;
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function src(id, big) { return IMG + id + (big ? '-l.webp' : '-s.webp'); }
  function img(id, alt, big) { return '<img loading="lazy" decoding="async" alt="' + esc(alt) + '" src="' + src(id, big) + '">'; }
  function ym(s) { if (!s) return ''; var m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(s); if (!m) return s; var M = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; return (m[3] ? +m[3] + ' ' : '') + (m[2] ? M[+m[2]] + ' ' : '') + m[1]; }

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

  function render() {
    if (!el) return;
    if (!data) { el.innerHTML = ''; return; }
    var h = '<div class="av"><div class="av-head"><div><div class="lbl" style="color:#D4AF37">The public record</div>' +
      '<h3>' + (st.tab === 'works' ? 'Catalogue of works' : 'Projects') + '</h3>' +
      '<p>' + (st.tab === 'works' ? 'Every public work, by its catalogue number. The same number appears on its certificate of authenticity.' : 'Commissions and collaborations, from first idea to reception.') + '</p></div>' +
      '<div class="av-tabs" role="tablist"><button type="button" role="tab" data-av="tab:works" aria-selected="' + (st.tab === 'works') + '">Catalogue</button>' +
      '<button type="button" role="tab" data-av="tab:projects" aria-selected="' + (st.tab === 'projects') + '">Projects</button></div></div>';
    if (st.tab === 'works') {
      var cats = [], decs = [];
      data.works.forEach(function (w) { if (w.category && cats.indexOf(w.category) < 0) cats.push(w.category); var d = String(Math.floor((w.year || 0) / 10) * 10); if (w.year && decs.indexOf(d) < 0) decs.push(d); });
      cats.sort(); decs.sort();
      var list = works();
      h += '<div class="av-bar"><input type="search" data-av-q placeholder="Search title, number, medium…" aria-label="Search the catalogue" value="' + esc(st.q) + '">' +
        '<select data-av-f="cat" aria-label="Category">' + options(cats, st.cat, 'All categories') + '</select>' +
        '<select data-av-f="dec" aria-label="Decade">' + options(decs, st.dec, 'All decades', function (d) { return d + 's'; }) + '</select></div>' +
        '<div class="av-count">' + list.length + (list.length === 1 ? ' work' : ' works') + '</div>';
      if (!list.length) h += '<div class="av-empty">No works match.</div>';
      else {
        h += '<div class="av-grid">' + list.slice(0, st.shown).map(function (w) {
          var f = w.images && w.images[0];
          return '<button type="button" class="av-card" data-av="work:' + esc(w.inv) + '" title="' + esc(w.inv + ' · ' + w.title + (w.year ? ', ' + w.year : '')) + '"><span class="im">' + (f ? img(f.id, w.title) : '') + '</span>' +
            '<span class="av-no">' + esc(w.inv) + '</span><span class="av-t">' + esc(w.title) + '</span><span class="av-y">' + esc([w.year, w.medium].filter(Boolean).join(' · ')) + '</span></button>';
        }).join('') + '</div>';
        if (list.length > st.shown) h += '<button type="button" class="btn-line av-more" data-av="more">SHOW MORE</button>';
      }
    } else if (!st.proj) {
      h += '<div class="av-pgrid">' + data.projects.map(function (p) {
        return '<button type="button" class="av-pcard" data-av="proj:' + esc(p.pid) + '"><span class="im">' + (p.cover ? img(p.cover, p.title, true) : '') + '</span><span class="b">' +
          '<span class="av-no">' + esc(p.pid + ' · ' + [ym(p.start).replace(/^\d+ /, ''), ym(p.end).replace(/^\d+ /, '')].filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(' – ')) + '</span>' +
          '<span class="t">' + esc(p.title) + '</span><span class="s">' + esc(p.subtitle || '') + '</span></span></button>';
      }).join('') + '</div>';
    } else {
      var p = data.projects.filter(function (x) { return x.pid === st.proj; })[0];
      if (p) {
        h += '<div class="av-proj"><button type="button" class="btn-line av-back" data-av="proj:">← ALL PROJECTS</button>' +
          '<div class="av-no">' + esc(p.pid) + '</div><h4>' + esc(p.title) + '</h4>' + (p.subtitle ? '<p class="sub">' + esc(p.subtitle) + '</p>' : '') +
          '<dl class="av-facts">' + [['Type', p.type], ['Dates', [ym(p.start), ym(p.end)].filter(function (v, i, a) { return v && a.indexOf(v) === i; }).join(' – ')], ['With', p.partners], ['Role', p.role]].filter(function (r) { return r[1]; }).map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' +
          (p.summary ? '<p class="av-sum">' + esc(p.summary) + '</p>' : '');
        var stages = {};
        (p.items || []).forEach(function (it) { (stages[it.stage] = stages[it.stage] || []).push(it); });
        Object.keys(stages).sort().forEach(function (s) {
          h += '<div class="av-stage"><div class="sh">' + ('0' + s).slice(-2) + ' · ' + esc(data.stages[s - 1] || '') + '</div><div class="av-tiles">' + stages[s].map(function (it) {
            var f = it.images && it.images[0];
            return '<button type="button" class="av-tile' + (it.key ? ' key' : '') + '" data-av="item:' + esc(it.no) + '"><span class="im">' + (f ? img(f.id, it.title) : esc(it.kind || '')) + (it.images && it.images.length > 1 ? '<span class="n">' + it.images.length + '</span>' : '') + '</span>' +
              '<span class="tt">' + esc(it.title) + '</span><span class="d">' + esc([ym(it.date), it.kind].filter(Boolean).join(' · ')) + '</span></button>';
          }).join('') + '</div></div>';
        });
        h += '</div>';
      }
    }
    el.innerHTML = h + '</div>';
  }

  /* ---------- full-screen viewer ---------- */
  function openViewer(seq, i) {
    viewer = { seq: seq, i: i || 0 };
    var v = document.createElement('div'); v.className = 'av-v'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true');
    el.getRootNode().appendChild(v); viewer.el = v; document.documentElement.style.overflow = 'hidden';
    drawViewer();
    v.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]'); if (!b) return;
      var a = b.getAttribute('data-v');
      if (a === 'close') closeViewer(); else if (a === 'prev') step(-1); else if (a === 'next') step(1); else go(+a);
    });
    var x0 = null;
    v.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    v.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); x0 = null; });
  }
  function drawViewer() {
    var s = viewer.seq, c = s[viewer.i];
    viewer.el.innerHTML = '<div class="top"><span class="pos">' + (viewer.i + 1) + ' / ' + s.length + '</span><button type="button" data-v="close">CLOSE</button></div>' +
      '<div class="main">' + (s.length > 1 ? '<button type="button" class="nav l" data-v="prev" aria-label="Previous">‹</button>' : '') +
      '<img alt="' + esc(c.title) + '" src="' + src(c.id, true) + '">' + (s.length > 1 ? '<button type="button" class="nav r" data-v="next" aria-label="Next">›</button>' : '') + '</div>' +
      '<div class="cap"><span class="no">' + esc(c.no) + '</span><span class="t">' + esc(c.title) + '</span>' + (c.meta ? '<span class="m">' + esc(c.meta) + '</span>' : '') + '</div>' +
      (s.length > 1 ? '<div class="strip">' + s.map(function (x, i) { return '<button type="button" data-v="' + i + '" class="' + (i === viewer.i ? 'on' : '') + '" aria-label="Image ' + (i + 1) + '"><img alt="" loading="lazy" src="' + src(x.id) + '"></button>'; }).join('') + '</div>' : '');
    if (c.hash) try { history.replaceState(null, '', '#' + c.hash); } catch (e) {}
  }
  function step(d) { if (!viewer) return; viewer.i = (viewer.i + d + viewer.seq.length) % viewer.seq.length; drawViewer(); }
  function go(i) { viewer.i = i; drawViewer(); }
  function closeViewer() { if (!viewer) return; viewer.el.remove(); viewer = null; document.documentElement.style.overflow = ''; try { if (/^#BK-/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
  document.addEventListener('keydown', function (e) { if (!viewer) return; if (e.key === 'Escape') closeViewer(); else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1); });

  function workSeq(list) {
    var seq = [];
    list.forEach(function (w) { (w.images || []).forEach(function (im, k) { seq.push({ id: im.id, no: w.inv + (w.images.length > 1 ? ' · ' + (k + 1) + '/' + w.images.length : ''), title: w.title + (w.year ? ', ' + w.year : ''), meta: [w.medium, w.size, w.series].filter(Boolean).join(' · '), hash: w.inv, inv: w.inv }); }); });
    return seq;
  }
  function openWork(inv) {
    var seq = workSeq(works().length ? works() : data.works), i = -1;
    for (var k = 0; k < seq.length; k++) if (seq[k].inv === inv) { i = k; break; }
    if (i < 0) { seq = workSeq(data.works); for (k = 0; k < seq.length; k++) if (seq[k].inv === inv) { i = k; break; } }
    if (i >= 0) openViewer(seq, i);
  }
  function openItem(no) {
    var p = data.projects.filter(function (x) { return x.pid === st.proj; })[0]; if (!p) return;
    var seq = [], i = 0;
    (p.items || []).forEach(function (it) { (it.images || []).forEach(function (im) { if (it.no === no && !seq.some(function (s) { return s.itemNo === no; })) i = seq.length; seq.push({ id: im.id, no: it.no, itemNo: it.no, title: it.title, meta: [ym(it.date), it.kind].filter(Boolean).join(' · ') }); }); });
    if (seq.length) openViewer(seq, i);
  }

  function onClick(e) {
    var b = e.target.closest('[data-av]'); if (!b) return;
    var a = b.getAttribute('data-av'), k = a.indexOf(':'), cmd = k < 0 ? a : a.slice(0, k), arg = k < 0 ? '' : a.slice(k + 1);
    if (cmd === 'tab') { st.tab = arg; st.proj = null; render(); }
    else if (cmd === 'more') { st.shown += 24; render(); }
    else if (cmd === 'work') openWork(arg);
    else if (cmd === 'proj') { st.proj = arg || null; render(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else if (cmd === 'item') openItem(arg);
  }
  function onInput(e) {
    var t = e.target;
    if (t.hasAttribute('data-av-q')) { st.q = t.value; st.shown = 24; var pos = t.selectionStart; render(); var n = el.querySelector('[data-av-q]'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) {} } }
  }
  function onChange(e) { var f = e.target.getAttribute && e.target.getAttribute('data-av-f'); if (f) { st[f] = e.target.value; st.shown = 24; render(); } }

  function mount(root) {
    var host = root.getElementById ? root.getElementById('bk-archive-view') : null;
    if (!host || host === el) return;
    el = host;
    if (!root.querySelector('style[data-av]')) { var s = document.createElement('style'); s.setAttribute('data-av', ''); s.textContent = CSS_AV; root.appendChild(s); }
    el.addEventListener('click', onClick); el.addEventListener('input', onInput); el.addEventListener('change', onChange);
    if (data) render();
    else fetch(DATA_URL).then(function (r) { return r.json(); }).then(function (d) {
      data = d; render();
      var m = /^#(BK-\d{4}-\d{3})$/.exec(location.hash);
      if (m && BK.visible(el)) { el.scrollIntoView({ block: 'start' }); openWork(m[1]); }
    }).catch(function () { el.innerHTML = ''; });
  }
  return { mount: mount };
})();
