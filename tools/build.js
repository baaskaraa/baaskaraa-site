// Builds site/bk-app.js from the approved prototype (Main.dc.html). b with me
// Usage: node tools/build.js path/to/Main.dc.html
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const src = fs.readFileSync(process.argv[2] || path.join(R, 'tools', 'Main.dc.html'), 'utf8');

const helmet = /<helmet>([\s\S]*?)<\/helmet>/.exec(src)[1];
let css = (helmet.match(/<style>([\s\S]*?)<\/style>/g) || []).map(s => s.replace(/<\/?style>/g, '')).join('\n');
css = css.replace(/(^|[}\s])body\s*\{/g, '$1:host{display:block;').replace(/(^|[}\s])html\s*\{[^}]*\}/g, '$1');

let tpl = /<\/helmet>([\s\S]*?)<script type="text\/x-dc"/.exec(src)[1];
tpl = tpl.replace(/<\/x-dc>\s*$/, '');
// header logo = home link on sub-pages; footer "Home" = home
let n = 0;
tpl = tpl.replace(/<a href="#top" onClick="\{\{navDraw\}\}"/, m => { n++; return '<a href="#top" data-bk-home="" onClick="{{navDraw}}"'; });
tpl = tpl.replace('<a href="#top">Home</a>', () => { n++; return '<a href="#top" data-bk-home="">Home</a>'; });
if (n !== 2) throw new Error('home link patch failed: ' + n);

let logic = /<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/.exec(src)[1];
const patches = [
  [/document\.getElementById\(/g, 'BK.$(', 'getElementById'],
  [/if \(el && el\.getBoundingClientRect\(\)\.top <= 140\)/, 'if (el && BK.visible(el) && el.getBoundingClientRect().top <= 140)', 'onScroll visible'],
  [/var self = this, seen = false;/, 'var self = this, seen = BK.seen();', 'intro once per visit'],
  [/join: function \(e\) \{ if \(e && e\.preventDefault\) e\.preventDefault\(\); self\.setState\(\{ joined: true \}\); \}/, 'join: function (e) { BK.join(e, function () { self.setState({ joined: true }); }); }', 'Studio Circle signup'],
];
for (const [re, to, label] of patches) {
  if (!re.test(logic)) throw new Error('patch not applied: ' + label);
  logic = logic.replace(re, to);
}

const assetsDir = path.join(R, 'assets');
const ASSETS = {};
for (const f of fs.readdirSync(assetsDir)) { const m = /^([0-9a-f]{32})(\.\w+)$/.exec(f); if (m) ASSETS[m[1]] = m[2]; }
const used = new Set((src.match(/\/_blob\/[0-9a-f]{32}/g) || []).map(s => s.slice(7)));
const missing = [...used].filter(id => !ASSETS[id]);
if (missing.length) throw new Error('missing assets: ' + missing.join(', '));

const morph = fs.readFileSync(require.resolve('morphdom/dist/morphdom-umd.min.js', { paths: [process.env.BK_NODE_PATH || R] }), 'utf8');
const morphFn = '(function(){var module={exports:{}},exports=module.exports;' + morph.replace(/\/\/# sourceMappingURL=.*$/m, '') + ';return module.exports})()';

let out = fs.readFileSync(path.join(__dirname, 'runtime.js'), 'utf8');
const put = (k, v) => { if (out.indexOf(k) < 0) throw new Error('no slot ' + k); out = out.split(k).join(v); };
put('__MORPHDOM__', morphFn);
put('__TEMPLATE__', JSON.stringify(tpl));
put('__CSS__', JSON.stringify(css));
put('__ASSETS__', JSON.stringify(ASSETS));
put('__LOGIC__', logic.trim());
put('__ARCHIVE__', fs.readFileSync(path.join(__dirname, 'archive-view.js'), 'utf8').trim());
out = '/*! morphdom (MIT) © Patrick Steele-Idem · https://github.com/patrick-steele-idem/morphdom */\n' + out;
fs.mkdirSync(path.join(R, 'site'), { recursive: true });
fs.writeFileSync(path.join(R, 'site', 'bk-app.js'), out);
console.log('site/bk-app.js', (out.length / 1024).toFixed(0) + ' KB,', Object.keys(ASSETS).length, 'assets,', used.size, 'used');
