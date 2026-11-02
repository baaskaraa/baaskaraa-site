/* ---------- the public archive: Chronology · Catalogue · Projects · Documents & Media ----------
   Data: data/archive.json (works + projects, published from the archive app) and data/record.json (chronology + documents).
   Every record has an address: #BK-YYYY-NNN (work) · #PR-YYYY-NN (project) · #PR-YYYY-NN-NNN (project item) · #DOC-YYYY-NN (document)
   · #chronology · #chronology-YYYY · #catalogue · #projects · #documents. Any link to one of these, anywhere on the site, opens the record:
   works and documents open in the viewer on the page you are on; the rest go to the Archive. */
var ARCHIVE = (function () {
  var ROOT_URL = BASE.replace(/assets\/$/, '');
  var IMG = BASE + 'archive/';
  var CSS_AV = [
    '.av{display:flex;flex-direction:column;gap:28px;background:#F5F1E8;color:#1F1D1A;padding:clamp(28px,5vw,56px) clamp(16px,4vw,48px);margin-top:40px}',
    '.av-head{display:flex;flex-direction:column;gap:20px}',
    '.av .btn-line{color:#8A6D12;border-color:#8A6D12}.av .btn-line:hover{background:#8A6D12;color:#FFFDF8}',
    '.av-head h3{margin:6px 0 0;font-size:clamp(26px,3vw,36px);font-weight:600;line-height:1.2}',
    '.av-head p{margin:8px 0 0;font-size:15px;line-height:1.7;color:#4A463E;max-width:680px}',
    '.av-tabs{display:flex;flex-wrap:wrap;border-bottom:1px solid #D8CDB2;gap:0 4px}',
    '.av-tabs button{font:inherit;font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:14px 18px 12px;background:transparent;color:#4A463E;border:0;border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;min-height:44px}',
    '.av-tabs button[aria-selected=true]{color:#8A6D12;border-bottom-color:#8A6D12}',
    '.av-tabs button:hover{color:#1F1D1A}',
    '@media(max-width:560px){.av-tabs{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.av-tabs::-webkit-scrollbar{display:none}.av-tabs button{flex:none;padding:12px 12px 10px;letter-spacing:2px}}',
    '.av-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
    '.av-bar input{flex:1 1 220px;min-width:0;font:inherit;font-size:15px;padding:12px 14px;background:#FFFDF8;border:1px solid #D8CDB2;color:#1F1D1A}',
    '.av-bar input::placeholder{color:#857C69}',
    '.av-bar select{font:inherit;font-size:14px;padding:12px 10px;background:#FFFDF8;border:1px solid #D8CDB2;color:#1F1D1A;max-width:100%}',
    '.av-chips{display:flex;flex-wrap:wrap;gap:8px}',
    '.av-chips button{font:inherit;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:9px 12px;background:transparent;border:1px solid #D8CDB2;color:#4A463E;cursor:pointer}',
    '.av-chips button[aria-pressed=true]{background:#1F1D1A;border-color:#1F1D1A;color:#F5F1E8;font-weight:600}',
    '.av-count{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6E675A}',
    '.av-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:24px 20px}',
    '@media(max-width:560px){.av-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}}',
    '.av-card{display:flex;flex-direction:column;gap:8px;background:none;border:0;padding:0;text-align:left;color:inherit;font:inherit;cursor:pointer;min-width:0}',
    '.av-card .im{aspect-ratio:1;background:#ECE5D4;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:10px}',
    '.av-card img{max-width:100%;max-height:100%;object-fit:contain;display:block;transition:transform .3s}',
    '.av-card:hover img,.av-card:focus-visible img{transform:scale(1.03)}',
    '.av-card.flash .im{outline:2px solid #8A6D12}',
    '.av-no{font-size:11px;letter-spacing:1.5px;color:#8A6D12;font-variant-numeric:tabular-nums}',
    '.av-t{font-size:14px;line-height:1.4;font-weight:500;overflow-wrap:anywhere}',
    '.av-y{font-size:12px;color:#6E675A;line-height:1.5}',
    '.av-more{align-self:center}',
    '.av-empty{padding:32px;border:1px dashed #D8CDB2;text-align:center;color:#6E675A}',
    /* documents */
    '.av-doc .im{aspect-ratio:4/3}',
    '.av-paper{width:100%;height:100%;box-sizing:border-box;background:#F5F1E8;color:#1A1A1D;display:flex;flex-direction:column;justify-content:space-between;padding:14px;text-align:left}',
    '.av-paper .k{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#8A6D12}',
    '.av-paper .tt{font-size:13px;line-height:1.35;font-weight:500;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}',
    '.av-paper .r{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#6B6B6B}',
    /* chronology */
    '.av-dec{display:flex;flex-wrap:wrap;gap:4px 18px;font-size:13px;letter-spacing:2px}',
    '.av-dec a{color:#6E675A;text-decoration:none;padding:6px 0;border-bottom:1px solid transparent}',
    '.av-dec a:hover{color:#8A6D12;border-bottom-color:#8A6D12}',
    '.av-chron{display:flex;flex-direction:column}',
    '.av-yr{display:grid;grid-template-columns:120px minmax(0,1fr) 220px;gap:8px 32px;padding:28px 0;border-top:1px solid #E2D9C3;scroll-margin-top:130px}',
    '.av-yr .yy{font-size:34px;font-weight:300;color:#8A6D12;line-height:1;font-variant-numeric:tabular-nums}',
    '.av-yr .ev{display:flex;flex-direction:column;gap:14px}',
    '.av-e{display:flex;flex-direction:column;gap:6px;padding-left:16px;border-left:2px solid #D8CDB2}',
    '.av-e.k-award{border-left-color:#8A6D12}',
    '.av-e .m{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#857C69}',
    '.av-e .x{font-size:16px;line-height:1.6;color:#2E2B26}',
    '.av-ln{display:flex;flex-wrap:wrap;gap:6px}',
    '.av-ln a{font-size:11px;letter-spacing:1px;color:#8A6D12;text-decoration:none;border:1px solid #C9B98A;padding:5px 9px;line-height:1.3;max-width:100%;overflow-wrap:anywhere}',
    '.av-ln a:hover,.av-ln a:focus-visible{background:#8A6D12;color:#FFFDF8;border-color:#8A6D12}',
    '.av-yr .th{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;align-content:start}',
    '.av-yr .th a{display:block;aspect-ratio:1;background:#ECE5D4;overflow:hidden}',
    '.av-yr .th img{width:100%;height:100%;object-fit:cover;display:block;opacity:.9;transition:opacity .2s}',
    '.av-yr .th a:hover img{opacity:1}',
    '@media(max-width:900px){.av-yr{grid-template-columns:84px minmax(0,1fr)}.av-yr .th{grid-column:2;grid-template-columns:repeat(4,1fr)}}',
    '@media(max-width:560px){.av-yr{grid-template-columns:1fr;gap:14px;padding:22px 0}.av-yr .yy{font-size:28px}.av-yr .th{grid-column:1;grid-template-columns:repeat(4,1fr)}.av-e .x{font-size:15px}}',
    /* projects */
    '.av-pgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}',
    '.av-pcard{display:flex;flex-direction:column;background:#FFFDF8;border:1px solid #D8CDB2;border-top:3px solid #8A6D12;text-align:left;padding:0;color:inherit;font:inherit;cursor:pointer}',
    '.av-pcard .im{aspect-ratio:16/10;overflow:hidden;background:#ECE5D4}',
    '.av-pcard .im img{width:100%;height:100%;object-fit:cover;display:block}',
    '.av-pcard .b{padding:20px 22px 24px;display:flex;flex-direction:column;gap:8px}',
    '.av-pcard .t{font-size:20px;font-weight:600;line-height:1.3}',
    '.av-pcard .s{font-size:14px;line-height:1.6;color:#4A463E}',
    '.av-proj{display:flex;flex-direction:column;gap:24px}',
    '.av-back{align-self:flex-start}',
    '.av-proj h4{margin:0;font-size:clamp(24px,3vw,32px);font-weight:600;line-height:1.25}',
    '.av-proj .sub{margin:0;font-size:17px;line-height:1.6;color:#4A463E;max-width:760px}',
    '.av-facts{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:8px 20px;font-size:14px;line-height:1.6;max-width:820px}',
    '.av-facts dt{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A6D12;padding-top:3px}',
    '.av-facts dd{margin:0;color:#2E2B26}',
    '@media(max-width:560px){.av-facts{grid-template-columns:1fr;gap:2px}.av-facts dd{margin-bottom:10px}}',
    '.av-sum{margin:0;font-size:16px;line-height:1.8;color:#2E2B26;max-width:760px}',
    '.av-stage{display:flex;flex-direction:column;gap:12px}',
    '.av-stage .sh{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#8A6D12;border-bottom:1px solid #D8CDB2;padding-bottom:8px}',
    '.av-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:16px}',
    '@media(max-width:560px){.av-tiles{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}',
    '.av-tile{display:flex;flex-direction:column;gap:6px;background:none;border:0;padding:0;text-align:left;color:inherit;font:inherit;cursor:pointer;min-width:0}',
    '.av-tile .im{position:relative;aspect-ratio:4/3;background:#ECE5D4;border:1px solid #E2D9C3;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#857C69;font-size:11px;letter-spacing:2px;text-transform:uppercase}',
    '.av-tile.key .im{border-color:#8A6D12}',
    '.av-tile .im img{width:100%;height:100%;object-fit:cover;display:block}',
    '.av-tile .n{position:absolute;right:6px;bottom:6px;background:rgba(0,0,0,.65);color:#fff;font-size:10px;padding:2px 6px}',
    '.av-tile .tt{font-size:13px;line-height:1.4;overflow-wrap:anywhere}',
    '.av-tile .d{font-size:11px;color:#6E675A}',
    '.av-also{display:flex;flex-direction:column;gap:10px;border-top:1px solid #E2D9C3;padding-top:20px}',
    '.av-also .sh{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#8A6D12}',
    /* viewer: the same viewer as the archive app. Framed · Detail · Certificate · Info, public fields only */
    '.av-v{position:fixed;inset:0;z-index:2000;background:#E8E4DC;color:#1A1510;display:flex;flex-direction:column;font-family:Montserrat,system-ui,sans-serif;--f-ui:Montserrat,Helvetica,Arial,sans-serif;--f-mono:Montserrat,Helvetica,Arial,sans-serif}',
    '.av-v .vin{display:flex;flex-direction:column;width:100%;max-width:1100px;margin:0 auto;padding:16px;gap:12px;box-sizing:border-box;flex:1;min-height:0}',
    '.av-v .vtop{display:flex;align-items:center;gap:8px;flex:none}',
    '.av-v .pos{font-size:12px;letter-spacing:.08em;color:#7A6A50;margin-right:auto;font-variant-numeric:tabular-nums}',
    '.av-v .vtabs{display:flex;border:1px solid #B8B0A0;border-radius:2px;overflow:hidden}',
    '.av-v .vtabs button{font:inherit;min-height:34px;padding:0 12px;border:0;background:transparent;color:#8A7F6E;font-size:11px;letter-spacing:.12em;font-weight:500;text-transform:uppercase;cursor:pointer}',
    '.av-v .vtabs button[aria-selected=true]{background:rgba(0,0,0,.1);color:#1A1510}',
    '.av-v .vbtn{font:inherit;min-height:34px;padding:0 12px;border-radius:2px;font-size:11px;letter-spacing:.12em;font-weight:500;text-transform:uppercase;cursor:pointer;border:1px solid #B8B0A0;background:rgba(255,255,255,.6);color:#2A2520;text-decoration:none;display:inline-flex;align-items:center}',
    '.av-v .vbtn:hover{border-color:#2A2520}',
    '.av-v .vbtn.gold{border-color:#A6812A;color:#8A6D12}',
    '.av-v .vmain{flex:1 1 0;min-height:0;position:relative;display:flex;align-items:center;justify-content:center;padding:40px 60px}',
    '.av-v .vmain>img{max-width:100%;max-height:calc(100% - 32px);object-fit:contain;display:block;user-select:none;cursor:zoom-in;background:#fff;box-shadow:0 0 0 10px #F5F2EC,0 0 0 11px #C8BFA8,0 0 0 28px #F5F2EC,0 0 0 29px #C8BFA8,0 6px 48px rgba(0,0,0,.28)}',
    '.av-v .vmain>img.plain{background:none;box-shadow:0 6px 30px rgba(0,0,0,.2)}',
    '.av-v .vmain .av-paper{background:#FFFDF8;border:1px solid #D8CDB2;width:min(520px,100%);height:auto;min-height:280px;padding:36px;gap:24px;box-sizing:border-box}',
    '.av-v .vmain .av-paper .tt{font-size:22px;-webkit-line-clamp:unset;display:block}',
    '.av-v .vmain .av-paper .nt{font-size:15px;line-height:1.7;color:#4A463E}',
    '.av-v .varr{position:fixed;top:50%;transform:translateY(-50%);width:40px;height:56px;border-radius:2px;font-size:20px;cursor:pointer;background:rgba(180,170,155,.5);border:1px solid #B8B0A0;color:#2A2520;z-index:2}',
    '.av-v .varr:hover{background:rgba(180,170,155,.85)}',
    '.av-v .varr.l{left:20px}.av-v .varr.r{right:20px}',
    '.av-v .vstrip{flex:none;display:flex;gap:8px;overflow-x:auto;padding:2px 0 4px;justify-content:center}',
    '.av-v .vstrip button{width:72px;height:54px;flex:none;border:2px solid transparent;border-radius:2px;overflow:hidden;cursor:pointer;background:rgba(0,0,0,.08);padding:0}',
    '.av-v .vstrip button.on{border-color:#A6812A}',
    '.av-v .vstrip img{width:100%;height:100%;object-fit:cover;display:block}',
    '.av-v .vcap{flex:none;padding-top:10px;border-top:1px solid #C8BFA8;display:flex;gap:6px 16px;flex-wrap:wrap;align-items:baseline}',
    '.av-v .vcap .t{font-size:17px;font-weight:500;margin-right:auto;line-height:1.35}',
    '.av-v .vcap .m{font-size:13px;color:#7A6A50;line-height:1.6}',
    '.av-v .vcap .av-ln{flex-basis:100%}',
    '.av-v.cert .varr,.av-v.cert .vstrip,.av-v.info .varr,.av-v.info .vstrip{display:none}',
    '.av-v .vcert{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}',
    '.av-v .vcert-box{flex:none;line-height:0;box-shadow:0 0 0 10px #F5F2EC,0 0 0 11px #C8BFA8,0 0 0 28px #F5F2EC,0 0 0 29px #C8BFA8,0 6px 48px rgba(0,0,0,.28)}',
    '.av-v .vcert-box .coa{line-height:normal}',
    '.av-v .vinfo{position:absolute;inset:0;overflow-y:auto;display:flex;justify-content:center;padding:8px 0 24px}',
    '.av-v .ip{width:100%;max-width:620px;background:#FBF9F4;box-shadow:0 6px 40px rgba(0,0,0,.14);padding:44px 48px 40px;align-self:flex-start;color:#1F1D1A;box-sizing:border-box}',
    '.av-v .ip-inv{font-size:11px;letter-spacing:.14em;color:#9A7B2E}',
    '.av-v .ip-t{font-size:24px;font-weight:300;line-height:1.25;margin-top:10px}',
    '.av-v .ip-t span{color:#7A6A50}',
    '.av-v .ip-m{font-size:13px;color:#5C5346;margin-top:8px;line-height:1.6}',
    '.av-v .ip-rule{width:36px;height:1px;background:#B8963A;margin:24px 0}',
    '.av-v .ip-story{font-size:16px;line-height:1.75;font-weight:300;white-space:pre-line}',
    '.av-v .ip-none{font-size:14px;color:#8A7F6E;font-style:italic}',
    '.av-v .ip dl{margin:26px 0 0;display:grid;grid-template-columns:150px 1fr;column-gap:20px}',
    '.av-v .ip dt{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#9A7B2E;padding:11px 0;border-top:1px solid #E4DCC8}',
    '.av-v .ip dd{margin:0;font-size:14px;line-height:1.6;padding:9px 0;border-top:1px solid #E4DCC8;white-space:pre-line}',
    '@media(max-width:640px){.av-v .vtop{flex-wrap:wrap;row-gap:10px}.av-v .vtabs{order:3;width:100%}.av-v .vtabs button{flex:1;padding:0 4px}.av-v .vmain{padding:30px 34px}.av-v .varr.l{left:6px}.av-v .varr.r{right:6px}.av-v .ip{padding:28px 22px}.av-v .ip dl{grid-template-columns:1fr}.av-v .ip dt{padding-bottom:0}.av-v .ip dd{border-top:0;padding-top:4px}}',
    /* detail: full screen, drag to move, scroll / pinch / buttons to zoom */
    '.av-d{position:fixed;inset:0;z-index:2100;background:#1A1816;overflow:hidden;touch-action:none;font-family:Montserrat,system-ui,sans-serif}',
    '.av-d .stg{position:absolute;inset:0;cursor:grab}',
    '.av-d .stg.drag{cursor:grabbing}',
    '.av-d .stg img{position:absolute;left:0;top:0;transform-origin:0 0;max-width:none;user-select:none;-webkit-user-drag:none;pointer-events:none}',
    '.av-d .bar{position:absolute;right:16px;top:calc(16px + env(safe-area-inset-top,0px));display:flex;gap:6px;align-items:center;background:rgba(20,18,16,.78);border:1px solid rgba(255,255,255,.14);padding:6px;border-radius:2px;color:#fff;font-size:12px;z-index:2;white-space:nowrap}',
    '.av-d .bar button{font:inherit;min-width:34px;min-height:32px;background:transparent;border:1px solid rgba(255,255,255,.25);color:#fff;cursor:pointer;border-radius:2px;font-size:12px;letter-spacing:.06em;padding:0 10px}',
    '.av-d .bar button:hover{border-color:#fff}',
    '.av-d .z{min-width:44px;text-align:center}',
    '.av-d .n{color:rgba(255,255,255,.55);padding:0 4px}',
    '.av-d .arr{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:56px;border-radius:2px;font-size:20px;cursor:pointer;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.2);color:#fff;z-index:2}',
    '.av-d .arr.l{left:20px}.av-d .arr.r{right:20px}',
    '.av-d .hint{position:absolute;bottom:calc(20px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);color:rgba(255,255,255,.6);font-size:11px;letter-spacing:.12em;text-transform:uppercase;pointer-events:none;transition:opacity .8s;z-index:2;white-space:nowrap}',
    '@media(max-width:640px){.av-d .bar{right:8px;gap:4px}.av-d .bar button{padding:0 8px}.av-d .arr.l{left:6px}.av-d .arr.r{right:6px}.av-d .hint{font-size:10px;letter-spacing:.06em;white-space:normal;width:calc(100% - 32px);text-align:center;line-height:1.6}}',
    '.coa{position:relative;width:210mm;height:296mm;box-sizing:border-box;background:#F7F2E7;color:#1F1D1A;font-family:var(--f-ui);overflow:hidden;flex:none;text-align:center}',
    '.coa .bg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}',
    '.coa .in{position:absolute;inset:0;padding:18mm 26mm 14mm;display:flex;flex-direction:column;align-items:center}',
    '.coa .in>*{flex:none}',
    '.coa.blank{background:#fff}',
    '.coa.blank .bg,.coa.blank .mk,.coa.blank .wm,.coa.blank .ttl,.coa.blank .rule{opacity:.22}',
    '.coa .mk{height:19mm;width:auto;display:block}',
    '.coa .wm{margin-top:3.2mm;font-size:13pt;font-weight:300;letter-spacing:.2em;padding-left:.2em;color:#A8862A;line-height:1}',
    '.coa .ttl{margin-top:5.5mm;font-size:7.5pt;font-weight:400;letter-spacing:.42em;padding-left:.42em;text-transform:uppercase;color:#1F1D1A}',
    '.coa .rule{width:14mm;height:0;border-top:.25mm solid #B8963A;margin:3.4mm auto 0}',
    '.coa .no{margin-top:3mm;font-size:7pt;letter-spacing:.24em;padding-left:.24em;color:#8A7238}',
    '.coa .rep{margin-top:1.4mm;font-size:6.5pt;letter-spacing:.06em;color:#B3261E}',
    '.coa .pic{margin-top:5.5mm;flex:none;display:block;background:#FFFDF8;border:.25mm solid #D8CDB2;outline:.25mm solid #D8CDB2;outline-offset:1.3mm;box-sizing:border-box;padding:3mm}',
    '.coa .pic img{display:block;width:auto;height:auto;max-width:106mm;max-height:56mm}',
    '.coa .pic.pages{display:flex;gap:2.5mm;align-items:flex-start}',
    '.coa .pic.pages img{border:.2mm solid #E4DCC8}',
    '.coa .pic span{display:flex;align-items:center;justify-content:center;width:90mm;height:60mm;color:#9A9180;font-size:8pt;letter-spacing:.1em}',
    '.coa .wt{margin-top:5.5mm;font-size:19pt;font-weight:300;letter-spacing:.02em;line-height:1.2;max-width:150mm}',
    '.coa .wy{font-weight:200}',
    '.coa .by{margin-top:1.8mm;font-size:8.5pt;font-weight:300;letter-spacing:.06em;color:#5C564B}',
    '.coa .facts{margin-top:4.5mm;width:132mm;display:grid;grid-template-columns:44mm minmax(0,1fr);text-align:left;font-size:8.5pt;line-height:1.35}',
    '.coa .facts div{padding:1.55mm 0;border-top:.15mm solid #DDD3BC}',
    '.coa .facts div:nth-last-child(-n+2){border-bottom:.15mm solid #DDD3BC}',
    '.coa .facts .k{font-size:6.3pt;letter-spacing:.2em;text-transform:uppercase;color:#8A7238;padding-right:4mm;padding-top:1.9mm}',
    '.coa .facts .v{overflow-wrap:anywhere;font-weight:400}',
    '.coa .st{margin-top:4.5mm;max-width:138mm;font-size:8.5pt;line-height:1.75;font-weight:300;color:#2E2B26}',
    '.coa .sign{margin-top:auto;display:flex;flex-direction:column;align-items:center}',
    '.coa .sign .seal{margin:3.5mm auto 0}',
    '.coa .sg{width:72mm}',
    '.coa .line{height:11mm;border-bottom:.25mm solid #1F1D1A}',
    '.coa .cap{margin-top:1.8mm;font-size:6.3pt;letter-spacing:.2em;padding-left:.2em;text-transform:uppercase;color:#6E675A;line-height:1.7}',
    '.coa .cap b{display:block;font-weight:400;letter-spacing:.04em;padding-left:0;text-transform:none;font-size:8.5pt;color:#1F1D1A}',
    '.coa .seal{width:22mm;height:22mm;margin:0 auto 1mm;display:block}',
    '.coa .seal svg{width:100%;height:100%;display:block}',
    '.coa .seal .proto{display:block;margin-top:.8mm;font-size:4.5pt;letter-spacing:.2em;text-transform:uppercase;color:#B3261E;opacity:.7}',
    '.coa .fine{margin-top:4mm;max-width:150mm;font-size:5.8pt;line-height:1.6;letter-spacing:.03em;color:#7A7262}'
  ].join('\n');

  var TABS = [['chronology', 'Chronology'], ['catalogue', 'Catalogue'], ['projects', 'Projects'], ['documents', 'Documents & Media']];
  var HEAD = {
    chronology: ['The life, year by year', 'Schooling, training, exhibitions, prizes, projects and works, in order. Every entry links to its record.'],
    catalogue: ['Catalogue of works', 'Every public work, by its catalogue number. The same number appears on its certificate of authenticity.'],
    projects: ['Projects', 'Commissions and collaborations, from first idea to reception.'],
    documents: ['Documents & Media', 'Photographs, press, certificates, programmes and video, open to all. Scans of the remaining originals are coming soon.']
  };
  var ITEM_KIND = { document: 'Programme', press: 'Press', video: 'Video', batch: 'Photographs', note: 'Note', prototype: 'Prototype' };

  var data = null, rec = null, idx = {}, back = {}, loading = null, R = null, el = null, waiting = [];
  var st = { tab: 'chronology', q: '', cat: '', dec: '', shown: 24, proj: null, kind: '', dkind: '', flash: '' }, viewer = null;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* an image is {id} (archive web copies -s/-l) or {a} (site asset, one size) */
  function src(im, big) { if (!im) return ''; if (im.u) return im.u; if (im.a) return asset('/_blob/' + im.a); return IMG + im.id + (big ? '-l.webp' : '-s.webp'); }
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
    var h = '<div class="av"><div class="av-head"><div><div class="lbl" style="color:#8A6D12">The public record</div>' +
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
        (d.img ? img(d.img, d.title) : '<span class="av-paper"><span class="k">' + esc(d.kind) + '</span><span class="tt">' + esc(d.title) + '</span><span class="r">Scan coming soon</span></span>') + '</span>' +
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

  /* ---------- full-screen viewer (works on every page) ----------
     The same viewer as the archive app: Framed · Detail · Certificate · Info.
     Works show all four; Artworks cards without a public record show Framed and Detail; documents show as before.
     Only public fields reach this page (tools/publish_archive.py): never notes, owners, locations or prices. */
  var MODES = [['framed', 'Framed'], ['detail', 'Detail'], ['cert', 'Certificate'], ['info', 'Info']];
  var PLAIN = { 'in situ': 1, back: 1, signature: 1, document: 1 };
  function openViewer(seq, i) {
    if (viewer) closeViewer(true);
    viewer = { seq: seq, i: i || 0, mode: 'framed' };
    var v = document.createElement('div'); v.className = 'av-v'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true');
    R.appendChild(v); viewer.el = v; document.documentElement.style.overflow = 'hidden';
    drawViewer();
    v.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (a) { closeViewer(true); return; }   /* the site's link router takes it from here */
      var b = e.target.closest('[data-v]'); if (!b) return;
      var k = b.getAttribute('data-v');
      if (k === 'close') closeViewer(); else if (k === 'prev') step(-1); else if (k === 'next') step(1);
      else if (k === 'detail') openDetail();
      else if (/^m:/.test(k)) setMode(k.slice(2));
      else goTo(+k);
    });
    var x0 = null;
    v.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    v.addEventListener('touchend', function (e) { if (x0 == null || viewer.mode !== 'framed') return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); x0 = null; });
    var f = v.querySelector('[data-v=close]'); if (f) try { f.focus({ preventScroll: true }); } catch (e) {}
  }
  function modesFor(c) { return c.work ? MODES : c.im ? MODES.slice(0, 2) : []; }
  function setMode(m) { if (m === 'detail') { openDetail(); return; } viewer.mode = m; drawViewer(); }
  function pubWork(w) {   /* the public record, shaped for the certificate */
    var c = String(w.coa || '').split('|');
    return { inv: w.inv, title: w.title, year: w.year, medium: w.medium, size: w.size, edition: w.edition, place: w.place, signature: w.signature, coa: { no: c[0] || 'COA-' + w.inv + '-1', date: c[1] || '' } };
  }
  function drawViewer() {
    var s = viewer.seq, c = s[viewer.i], ms = modesFor(c);
    if (ms.map(function (m) { return m[0]; }).indexOf(viewer.mode) < 0) viewer.mode = 'framed';
    var mode = viewer.mode, w = c.work, inArchive = visible() && c.hash && !/^PR-/.test(c.hash);
    var same = w ? s.map(function (x, j) { return x.work === w ? j : -1; }).filter(function (j) { return j >= 0; }) : [];
    var multi = s.length > 1;
    viewer.el.className = 'av-v' + (mode === 'cert' ? ' cert' : mode === 'info' ? ' info' : '');
    var main;
    if (mode === 'cert') main = '<div class="vcert"><div class="vcert-box"></div></div>';
    else if (mode === 'info') main = '<div class="vinfo">' + infoHtml(w) + '</div>';
    else if (c.im) main = '<img alt="' + esc(c.title) + '" src="' + src(c.im, true) + '" data-v="detail"' + (c.im.kind && PLAIN[c.im.kind] ? ' class="plain"' : '') + '>';
    else main = '<div class="av-paper"><span class="k">' + esc(c.kind || 'Record') + ' · ' + esc(c.no) + '</span><span class="tt">' + esc(c.title) + '</span>' + (c.meta ? '<span class="nt">' + esc(c.meta) + '</span>' : '') +
      '<span class="nt">A scan of the original is coming soon.</span></div>';
    var meta = mode === 'cert' ? (function () { var p = pubWork(w); return ['Certificate · preview', 'Nº ' + p.coa.no, p.coa.date ? 'issued ' + fmtIssue(p.coa.date) : '', w.medium, w.size].filter(Boolean).join(' · '); })() : c.meta;
    viewer.el.innerHTML = '<div class="vin"><div class="vtop"><span class="pos">' + [esc(c.no || ''), multi && mode === 'framed' ? (viewer.i + 1) + ' / ' + s.length : ''].filter(Boolean).join(' &nbsp;·&nbsp; ') + '</span>' +
      (ms.length ? '<div class="vtabs" role="tablist">' + ms.map(function (m) { return '<button type="button" role="tab" data-v="m:' + m[0] + '" aria-selected="' + (m[0] === mode) + '">' + m[1] + '</button>'; }).join('') + '</div>' : '') +
      (c.enquire ? '<a class="vbtn gold" href="#engage">Enquire</a>' : '') +
      (c.hash && !inArchive && !w ? '<a class="vbtn" href="#' + esc(c.home || c.hash) + '">' + (c.home && /^PR-/.test(c.home) ? 'See the project' : 'Open in the archive') + '</a>' : '') +
      '<button type="button" class="vbtn" data-v="close">✕ Close</button></div>' +
      '<div class="vmain">' + main + '</div>' +
      (same.length > 1 && mode === 'framed' ? '<div class="vstrip">' + same.map(function (j) { return '<button type="button" data-v="' + j + '" class="' + (j === viewer.i ? 'on' : '') + '" aria-label="Image ' + (same.indexOf(j) + 1) + '"><img alt="" loading="lazy" src="' + src(s[j].im) + '"></button>'; }).join('') + '</div>' : '') +
      '<div class="vcap"><span class="t">' + esc(c.title) + '</span>' + (meta ? '<span class="m">' + esc(meta) + '</span>' : '') + (mode === 'framed' && c.links && c.links.length ? links(c.links) : '') + '</div></div>' +
      (multi ? '<button type="button" class="varr l" data-v="prev" aria-label="Previous">‹</button><button type="button" class="varr r" data-v="next" aria-label="Next">›</button>' : '');
    if (mode === 'cert') drawCert(w);
    if (c.hash) try { history.replaceState(null, '', location.pathname + location.search + '#' + c.hash); } catch (e) {}
  }
  function infoHtml(w) {
    var rows = [['Series', w.series], ['Place of creation', w.place], ['Signature and inscriptions', w.signature], ['Collection', w.status], ['Provenance', w.provenance],
      ['Awards', w.awards], ['Exhibitions', w.exhibitions], ['Literature', w.literature], ['Catalogue number', w.inv]].filter(function (r) { return r[1]; });
    return '<div class="ip"><div class="ip-inv">' + esc(w.inv) + '</div><div class="ip-t">' + esc(w.title || 'Untitled') + (w.year ? '<span>, ' + esc(w.year) + '</span>' : '') + '</div>' +
      '<div class="ip-m">' + esc([w.medium, w.size, w.edition].filter(Boolean).join(' · ')) + '</div><div class="ip-rule"></div>' +
      (w.story ? '<div class="ip-story">' + esc(w.story) + '</div>' : '<div class="ip-none">The story of this work is still being written.</div>') +
      '<dl>' + rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl></div>';
  }
  function drawCert(w) {
    var box = viewer.el.querySelector('.vcert-box'); if (!box) return;
    var ims = w.images || [], f = ims.filter(function (x) { return x.kind === 'front'; })[0] || ims[0], pg = ims.filter(function (x) { return x.kind === 'page'; });
    var srcs = pg.length ? (f ? [f] : []).concat(pg).map(function (x) { return src(x, true); }) : (f ? src(f, true) : '');
    box.innerHTML = coaHtml(pubWork(w), srcs);
    fitCert();
    Array.prototype.forEach.call(box.querySelectorAll('.pic img'), function (im) { if (!im.complete) im.addEventListener('load', fitCert); });
  }
  function fitCert() {
    if (!viewer || viewer.mode !== 'cert') return;
    var c = viewer.el.querySelector('.vcert-box .coa'), m = viewer.el.querySelector('.vmain'); if (!c || !m) return;
    coaShrink(c);
    var cs = getComputedStyle(m), px = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight), py = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    c.style.zoom = Math.max(.2, Math.min((m.clientWidth - px - 62) / 794, (m.clientHeight - py - 62) / 1119, 1.2)).toFixed(3);
  }
  function step(d) { if (!viewer) return; viewer.i = (viewer.i + d + viewer.seq.length) % viewer.seq.length; drawViewer(); }
  function goTo(i) { viewer.i = i; drawViewer(); }
  function closeViewer(keepHash) {
    if (!viewer) return; closeDetail(); viewer.el.remove(); viewer = null; document.documentElement.style.overflow = '';
    if (!keepHash) try { if (/^#(BK|PR|DOC)-/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  window.addEventListener('resize', function () { if (viewer && viewer.mode === 'cert') fitCert(); if (dz.el) dzFit(); });
  document.addEventListener('keydown', function (e) {
    if (dz.el) { if (e.key === 'Escape') closeDetail(); else if (e.key === 'ArrowLeft') dzGo(-1); else if (e.key === 'ArrowRight') dzGo(1); else if (e.key === '+' || e.key === '=') dzZoom(1.5, innerWidth / 2, innerHeight / 2); else if (e.key === '-') dzZoom(1 / 1.5, innerWidth / 2, innerHeight / 2); return; }
    if (!viewer) return; if (e.key === 'Escape') closeViewer(); else if (viewer.mode === 'framed' && e.key === 'ArrowLeft') step(-1); else if (viewer.mode === 'framed' && e.key === 'ArrowRight') step(1);
  });

  /* detail: full screen, drag to move, scroll / pinch / buttons to zoom */
  var dz = { el: null, s: 1, x: 0, y: 0, fit: 1, max: 2, nw: 0, nh: 0, list: [], at: 0, ptrs: {}, n: 0, pinch: null };
  function openDetail() {
    if (!viewer) return;
    var s = viewer.seq, c = s[viewer.i];
    dz.list = c.work ? s.filter(function (x) { return x.work === c.work && x.im; }) : (c.im ? [c] : []);
    if (!dz.list.length) return;
    var firstDetail = -1; dz.list.forEach(function (x, k) { if (firstDetail < 0 && x.im.kind === 'detail') firstDetail = k; });
    var cur = dz.list.indexOf(c); dz.at = viewer.mode === 'framed' && cur >= 0 ? cur : (firstDetail >= 0 ? firstDetail : 0);
    var d = document.createElement('div'); d.className = 'av-d'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Detail');
    d.innerHTML = '<div class="stg"><img alt="" draggable="false"></div><div class="hint">Drag to move · scroll or pinch to zoom · double-click to look closer</div>' +
      '<button type="button" class="arr l" aria-label="Previous">‹</button><button type="button" class="arr r" aria-label="Next">›</button>' +
      '<div class="bar"><span class="n"></span><button type="button" data-z="out" aria-label="Zoom out">−</button><span class="z">1×</span><button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="fit">Whole</button><button type="button" data-z="close">✕ Close</button></div>';
    R.appendChild(d); dz.el = d; dz.ptrs = {}; dz.n = 0;
    var stg = d.querySelector('.stg'), hint = d.querySelector('.hint');
    setTimeout(function () { hint.style.opacity = 0; }, 3200);
    stg.addEventListener('wheel', function (e) { e.preventDefault(); dzZoom(Math.exp(-e.deltaY * .0018), e.clientX, e.clientY); }, { passive: false });
    stg.addEventListener('pointerdown', function (e) { stg.setPointerCapture(e.pointerId); if (!dz.ptrs[e.pointerId]) dz.n++; dz.ptrs[e.pointerId] = { x: e.clientX, y: e.clientY }; stg.classList.add('drag'); dz.pinch = null; });
    stg.addEventListener('pointermove', function (e) {
      var p = dz.ptrs[e.pointerId]; if (!p) return;
      if (dz.n === 1) { dz.x += e.clientX - p.x; dz.y += e.clientY - p.y; dzApply(); }
      dz.ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (dz.n === 2) {
        var v = Object.keys(dz.ptrs).map(function (k) { return dz.ptrs[k]; }), a = v[0], b = v[1];
        var dd = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        if (dz.pinch) { dzZoom(dd / dz.pinch.d, mx, my); dz.x += mx - dz.pinch.mx; dz.y += my - dz.pinch.my; dzApply(); }
        dz.pinch = { d: dd, mx: mx, my: my };
      }
    });
    function up(e) { if (dz.ptrs[e.pointerId]) { delete dz.ptrs[e.pointerId]; dz.n--; } dz.pinch = null; if (!dz.n) stg.classList.remove('drag'); }
    stg.addEventListener('pointerup', up); stg.addEventListener('pointercancel', up);
    stg.addEventListener('dblclick', function (e) { if (dz.s > dz.fit * 1.05) dzFit(); else dzZoom(Math.min(dz.max, dz.fit * 3) / dz.s, e.clientX, e.clientY); });
    d.querySelector('.arr.l').addEventListener('click', function () { dzGo(-1); });
    d.querySelector('.arr.r').addEventListener('click', function () { dzGo(1); });
    d.querySelector('.bar').addEventListener('click', function (e) {
      var b = e.target.closest('[data-z]'); if (!b) return; var z = b.getAttribute('data-z');
      if (z === 'in') dzZoom(1.5, innerWidth / 2, innerHeight / 2); else if (z === 'out') dzZoom(1 / 1.5, innerWidth / 2, innerHeight / 2); else if (z === 'fit') dzFit(); else closeDetail();
    });
    dzLoad();
  }
  function closeDetail() { if (dz.el) { dz.el.remove(); dz.el = null; } }
  function dzLoad() {
    var c = dz.list[dz.at], img = dz.el.querySelector('.stg img');
    dz.el.querySelector('.n').textContent = dz.list.length > 1 ? (dz.at + 1) + ' / ' + dz.list.length : '';
    dz.el.querySelector('.arr.l').hidden = dz.el.querySelector('.arr.r').hidden = dz.list.length < 2;
    img.style.visibility = 'hidden';
    img.onload = function () { dz.nw = img.naturalWidth; dz.nh = img.naturalHeight; img.style.width = dz.nw + 'px'; img.style.height = dz.nh + 'px'; dzFit(); img.style.visibility = ''; };
    img.src = src(c.im, true);
  }
  function dzFit() {
    if (!dz.el || !dz.nw) return; var W = innerWidth, H = innerHeight;
    dz.fit = Math.min(W / dz.nw, H / dz.nh); dz.max = Math.max(dz.fit * 1.5, 2);
    dz.s = dz.fit; dz.x = (W - dz.nw * dz.s) / 2; dz.y = (H - dz.nh * dz.s) / 2; dzApply();
  }
  function dzApply() {
    if (!dz.el) return; var W = innerWidth, H = innerHeight, w = dz.nw * dz.s, h = dz.nh * dz.s;
    dz.x = w <= W ? (W - w) / 2 : Math.min(0, Math.max(W - w, dz.x));
    dz.y = h <= H ? (H - h) / 2 : Math.min(0, Math.max(H - h, dz.y));
    dz.el.querySelector('.stg img').style.transform = 'translate(' + dz.x + 'px,' + dz.y + 'px) scale(' + dz.s + ')';
    var r = dz.s / dz.fit; dz.el.querySelector('.z').textContent = (r < 9.95 ? r.toFixed(1).replace(/\.0$/, '') : Math.round(r)) + '×';
  }
  function dzZoom(f, cx, cy) {
    var ns = Math.min(dz.max, Math.max(dz.fit, dz.s * f)); if (ns === dz.s) return;
    dz.x = cx - (cx - dz.x) * (ns / dz.s); dz.y = cy - (cy - dz.y) * (ns / dz.s); dz.s = ns; dzApply();
  }
  function dzGo(d) { var n = dz.list.length; if (n < 2) return; dz.at = (dz.at + d + n) % n; dzLoad(); }

  /* the certificate: the archive app's own code, unchanged (tools/archive app, 2 Nov 2026) */
  function sizeStr(w) { return w.size || ''; }
var MARK = "M42,41 L42.0,389.0 L42.6,396.3 L43.5,403.5 L44.7,410.7 L46.1,417.8 L47.8,424.8 L49.8,431.7 L52.1,438.6 L54.6,445.3 L57.3,451.9 L60.3,458.3 L63.6,464.7 L67.1,470.9 L70.8,476.9 L74.7,482.8 L78.9,488.4 L83.3,494.0 L87.8,499.3 L92.6,504.4 L97.5,509.3 L102.6,514.0 L107.9,518.5 L113.4,522.8 L118.9,526.9 L124.7,530.7 L130.5,534.3 L136.5,537.6 L142.6,540.7 L148.8,543.5 L155.1,546.1 L161.4,548.5 L167.9,550.6 L174.3,552.4 L180.9,554.0 L187.4,555.3 L194.1,556.3 L200.7,557.1 L207.3,557.6 L213.9,557.9 L220.5,557.9 L227.1,557.6 L233.7,557.1 L240.2,556.4 L246.7,555.3 L253.1,554.1 L259.4,552.6 L265.6,550.8 L271.8,548.8 L277.8,546.6 L283.8,544.2 L289.6,541.5 L295.3,538.6 L300.9,535.5 L306.3,532.2 L311.6,528.7 L316.7,525.0 L321.7,521.1 L326.5,517.0 L331.1,512.8 L335.5,508.3 L339.8,503.8 L343.8,499.1 L347.7,494.2 L351.3,489.2 L354.8,484.1 L358.0,478.9 L361.0,473.6 L363.8,468.1 L366.4,462.6 L368.7,457.0 L370.8,451.3 L372.7,445.6 L374.4,439.8 L375.8,434.0 L377.0,428.1 L378.0,422.2 L378.7,416.3 L379.2,410.4 L379.4,404.5 L379.5,398.6 L379.3,392.8 L378.8,386.9 L378.2,381.1 L377.3,375.4 L376.2,369.7 L374.9,364.1 L373.3,358.5 L371.6,353.0 L369.6,347.6 L367.5,342.4 L365.1,337.2 L362.6,332.1 L359.8,327.2 L356.9,322.3 L353.8,317.6 L350.5,313.1 L347.1,308.7 L343.5,304.4 L339.8,300.3 L335.9,296.4 L331.9,292.6 L327.7,289.1 L323.4,285.6 L319.0,282.4 L314.5,279.4 L309.9,276.5 L305.2,273.8 L300.4,271.4 L295.6,269.1 L290.6,267.0 L285.6,265.1 L280.6,263.5 L275.5,262.0 L270.4,260.7 L265.2,259.7 L260.1,258.8 L254.9,258.2 L249.7,257.7 L244.5,257.5 L239.4,257.5 L234.2,257.6 L229.1,258.0 L224.0,258.6 L219.0,259.4 L214.0,260.3 L209.1,261.5 L204.2,262.8 L199.4,264.3 L194.7,266.0 L190.1,267.9 L185.5,270.0 L181.1,272.2 L176.8,274.6 L172.6,277.1 L168.5,279.8 L164.5,282.7 L160.7,285.7 L157.0,288.8 L153.4,292.0 L150.0,295.4 L146.8,298.9 L143.6,302.5 L140.7,306.2 L137.9,310.1 L135.2,314.0 L132.8,318.0 L130.4,322.0 L128.3,326.2 L126.3,330.4 L124.5,334.7 L122.9,339.0 L121.5,343.3 L120.2,347.7 L119.1,352.2 L118.2,356.6 L117.5,361.1 L117.0,365.5 L116.6,370.0 L116.4,374.5 L116.4,378.9 L116.5,383.3 L116.9,387.7 L117.4,392.1 L118.0,396.4 L118.9,400.7 L119.9,404.9 L121.0,409.1 L122.4,413.2 L123.8,417.2 L125.4,421.1 L127.2,425.0 L129.1,428.8 L131.2,432.5 L133.4,436.0 L135.7,439.5 L138.1,442.9 L140.7,446.2 L143.4,449.3 L146.1,452.3 L149.0,455.2 L152.0,458.0 L155.1,460.6 L158.3,463.1 L161.5,465.5 L164.8,467.7 L168.2,469.8 L171.7,471.7 L175.2,473.5 L178.8,475.1 L182.4,476.6 L186.0,478.0 L189.7,479.1 L193.4,480.2 L197.1,481.1 L200.9,481.8 L204.6,482.4 L208.4,482.8 L212.2,483.1 L215.9,483.2 L219.6,483.2 L223.3,483.1 L227.0,482.8 L230.7,482.3 L234.3,481.7 L237.8,481.0 L241.3,480.1 L244.8,479.1 L248.2,478.0 L251.5,476.7 L254.8,475.4 L258.0,473.9 L261.1,472.2 L264.2,470.5 L267.1,468.7 L270.0,466.7 L272.7,464.7 L275.4,462.5 L278.0,460.3 L280.4,458.0 L282.8,455.6 L285.0,453.1 L287.2,450.5 L289.2,447.9 L291.1,445.2 L292.9,442.4 L294.5,439.6 L296.1,436.8 L297.5,433.9 L298.8,431.0 L300.0,428.0 L301.0,425.0 L301.9,422.0 L302.7,419.0 L303.4,415.9 L304.0,412.9 L304.4,409.8 L304.7,406.8 L304.9,403.7 L304.9,400.7 L304.9,397.7 L304.7,394.7 L304.4,391.7 L304.0,388.8 L303.4,385.9 L302.8,383.1 L302.1,380.3 L301.2,377.5 L300.2,374.8 L299.2,372.2 L298.0,369.6 L296.8,367.1 L295.4,364.6 L294.0,362.2 L292.5,359.9 L290.9,357.7 L289.2,355.5 L287.5,353.5 L285.7,351.5 L283.8,349.6 L281.8,347.8 L279.8,346.1 L277.8,344.4 L275.7,342.9 L273.5,341.5 L271.3,340.1 L269.1,338.9 L266.9,337.8 L264.6,336.7 L262.3,335.8 L259.9,334.9 L257.6,334.2 L255.3,333.6 L252.9,333.0 L250.5,332.6 L248.2,332.2 L245.8,332.0 L243.5,331.8 L241.1,331.8 L238.8,331.8 L236.5,331.9 L234.3,332.2 L232.0,332.5 L229.8,332.9 L227.6,333.4 L225.5,333.9 L223.4,334.6 L221.4,335.3 L219.4,336.1 L217.4,337.0 L215.5,337.9 L213.7,339.0 L211.9,340.0 L210.2,341.2 L208.5,342.4 L206.9,343.7 L205.4,345.0 L203.9,346.3 L202.6,347.7 L201.2,349.2 L200.0,350.7 L198.8,352.2 L197.7,353.8 L196.7,355.4 L195.7,357.0 L194.9,358.6 L194.1,360.3 L193.3,361.9 L192.7,363.6 L192.1,365.3 L191.6,367.0 L191.2,368.7 L190.9,370.4 L190.6,372.1 L190.4,373.8 L190.3,375.5 L190.2,377.1 L190.3,378.8 L190.3,380.4 L190.5,382.0 L190.7,383.6 L191.0,385.1 L191.3,386.7 L191.7,388.2 L192.2,389.6 L192.7,391.0 L193.3,392.4 L193.9,393.7 L194.6,395.0 L195.3,396.3 L196.1,397.5 L196.9,398.6 L197.7,399.7 L198.6,400.8 L199.5,401.8 L200.4,402.7 L201.4,403.6 L202.4,404.5 L203.4,405.3 L204.4,406.0 L205.5,406.7 L206.6,407.3 L207.6,407.9 L208.7,408.4 L209.8,408.8 L210.9,409.2 L212.0,409.6 L213.1,409.8 L214.2,410.1 L215.3,410.3 L216.4,410.4 L217.4,410.5 L218.5,410.5 L219.5,410.5 L220.6,410.4 L221.6,410.3 L222.5,410.1 L223.5,409.9 L224.4,409.7 L225.3,409.4 L226.2,409.1 L227.0,408.7 L227.8,408.3 L228.6,407.9 L229.3,407.5 L230.0,407.0 L230.7,406.5 L231.3,405.9 L231.9,405.4 L232.4,404.8 L232.9,404.2 L233.4,403.6 L233.8,403.0 L234.2,402.4 L234.5,401.8 L234.8,401.1 L235.1,400.5 L235.3,399.8 L235.5,399.2 L235.6,398.6 L235.7,397.9 L235.8,397.3 L235.8,396.7 L235.8,396.1 L235.7,395.5 L235.6,394.9 L235.5,394.4 L235.3,393.8 L235.1,393.3 L234.9,392.8 L234.7,392.3 L234.4,391.9 L234.1,391.5 L233.8,391.1 L233.4,390.7 L233.0,390.4 L232.6,390.1 L232.2,389.9 L231.8,389.6 L231.4,389.4 L230.9,389.3 L230.5,389.2";
var SEAL_SVG='<svg viewBox="0 0 600 600" aria-label="baaskaraa seal"><defs><filter id="coaInk" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4" result="w"/><feDisplacementMap in="SourceGraphic" in2="w" scale="9"/></filter></defs><g filter="url(#coaInk)"><circle cx="300" cy="300" r="290" fill="#B3261E"/><g transform="translate(131,60) scale(0.8)"><path d="M42,41 L42.0,389.0 L42.6,396.3 L43.5,403.5 L44.7,410.7 L46.1,417.8 L47.8,424.8 L49.8,431.7 L52.1,438.6 L54.6,445.3 L57.3,451.9 L60.3,458.3 L63.6,464.7 L67.1,470.9 L70.8,476.9 L74.7,482.8 L78.9,488.4 L83.3,494.0 L87.8,499.3 L92.6,504.4 L97.5,509.3 L102.6,514.0 L107.9,518.5 L113.4,522.8 L118.9,526.9 L124.7,530.7 L130.5,534.3 L136.5,537.6 L142.6,540.7 L148.8,543.5 L155.1,546.1 L161.4,548.5 L167.9,550.6 L174.3,552.4 L180.9,554.0 L187.4,555.3 L194.1,556.3 L200.7,557.1 L207.3,557.6 L213.9,557.9 L220.5,557.9 L227.1,557.6 L233.7,557.1 L240.2,556.4 L246.7,555.3 L253.1,554.1 L259.4,552.6 L265.6,550.8 L271.8,548.8 L277.8,546.6 L283.8,544.2 L289.6,541.5 L295.3,538.6 L300.9,535.5 L306.3,532.2 L311.6,528.7 L316.7,525.0 L321.7,521.1 L326.5,517.0 L331.1,512.8 L335.5,508.3 L339.8,503.8 L343.8,499.1 L347.7,494.2 L351.3,489.2 L354.8,484.1 L358.0,478.9 L361.0,473.6 L363.8,468.1 L366.4,462.6 L368.7,457.0 L370.8,451.3 L372.7,445.6 L374.4,439.8 L375.8,434.0 L377.0,428.1 L378.0,422.2 L378.7,416.3 L379.2,410.4 L379.4,404.5 L379.5,398.6 L379.3,392.8 L378.8,386.9 L378.2,381.1 L377.3,375.4 L376.2,369.7 L374.9,364.1 L373.3,358.5 L371.6,353.0 L369.6,347.6 L367.5,342.4 L365.1,337.2 L362.6,332.1 L359.8,327.2 L356.9,322.3 L353.8,317.6 L350.5,313.1 L347.1,308.7 L343.5,304.4 L339.8,300.3 L335.9,296.4 L331.9,292.6 L327.7,289.1 L323.4,285.6 L319.0,282.4 L314.5,279.4 L309.9,276.5 L305.2,273.8 L300.4,271.4 L295.6,269.1 L290.6,267.0 L285.6,265.1 L280.6,263.5 L275.5,262.0 L270.4,260.7 L265.2,259.7 L260.1,258.8 L254.9,258.2 L249.7,257.7 L244.5,257.5 L239.4,257.5 L234.2,257.6 L229.1,258.0 L224.0,258.6 L219.0,259.4 L214.0,260.3 L209.1,261.5 L204.2,262.8 L199.4,264.3 L194.7,266.0 L190.1,267.9 L185.5,270.0 L181.1,272.2 L176.8,274.6 L172.6,277.1 L168.5,279.8 L164.5,282.7 L160.7,285.7 L157.0,288.8 L153.4,292.0 L150.0,295.4 L146.8,298.9 L143.6,302.5 L140.7,306.2 L137.9,310.1 L135.2,314.0 L132.8,318.0 L130.4,322.0 L128.3,326.2 L126.3,330.4 L124.5,334.7 L122.9,339.0 L121.5,343.3 L120.2,347.7 L119.1,352.2 L118.2,356.6 L117.5,361.1 L117.0,365.5 L116.6,370.0 L116.4,374.5 L116.4,378.9 L116.5,383.3 L116.9,387.7 L117.4,392.1 L118.0,396.4 L118.9,400.7 L119.9,404.9 L121.0,409.1 L122.4,413.2 L123.8,417.2 L125.4,421.1 L127.2,425.0 L129.1,428.8 L131.2,432.5 L133.4,436.0 L135.7,439.5 L138.1,442.9 L140.7,446.2 L143.4,449.3 L146.1,452.3 L149.0,455.2 L152.0,458.0 L155.1,460.6 L158.3,463.1 L161.5,465.5 L164.8,467.7 L168.2,469.8 L171.7,471.7 L175.2,473.5 L178.8,475.1 L182.4,476.6 L186.0,478.0 L189.7,479.1 L193.4,480.2 L197.1,481.1 L200.9,481.8 L204.6,482.4 L208.4,482.8 L212.2,483.1 L215.9,483.2 L219.6,483.2 L223.3,483.1 L227.0,482.8 L230.7,482.3 L234.3,481.7 L237.8,481.0 L241.3,480.1 L244.8,479.1 L248.2,478.0 L251.5,476.7 L254.8,475.4 L258.0,473.9 L261.1,472.2 L264.2,470.5 L267.1,468.7 L270.0,466.7 L272.7,464.7 L275.4,462.5 L278.0,460.3 L280.4,458.0 L282.8,455.6 L285.0,453.1 L287.2,450.5 L289.2,447.9 L291.1,445.2 L292.9,442.4 L294.5,439.6 L296.1,436.8 L297.5,433.9 L298.8,431.0 L300.0,428.0 L301.0,425.0 L301.9,422.0 L302.7,419.0 L303.4,415.9 L304.0,412.9 L304.4,409.8 L304.7,406.8 L304.9,403.7 L304.9,400.7 L304.9,397.7 L304.7,394.7 L304.4,391.7 L304.0,388.8 L303.4,385.9 L302.8,383.1 L302.1,380.3 L301.2,377.5 L300.2,374.8 L299.2,372.2 L298.0,369.6 L296.8,367.1 L295.4,364.6 L294.0,362.2 L292.5,359.9 L290.9,357.7 L289.2,355.5 L287.5,353.5 L285.7,351.5 L283.8,349.6 L281.8,347.8 L279.8,346.1 L277.8,344.4 L275.7,342.9 L273.5,341.5 L271.3,340.1 L269.1,338.9 L266.9,337.8 L264.6,336.7 L262.3,335.8 L259.9,334.9 L257.6,334.2 L255.3,333.6 L252.9,333.0 L250.5,332.6 L248.2,332.2 L245.8,332.0 L243.5,331.8 L241.1,331.8 L238.8,331.8 L236.5,331.9 L234.3,332.2 L232.0,332.5 L229.8,332.9 L227.6,333.4 L225.5,333.9 L223.4,334.6 L221.4,335.3 L219.4,336.1 L217.4,337.0 L215.5,337.9 L213.7,339.0 L211.9,340.0 L210.2,341.2 L208.5,342.4 L206.9,343.7 L205.4,345.0 L203.9,346.3 L202.6,347.7 L201.2,349.2 L200.0,350.7 L198.8,352.2 L197.7,353.8 L196.7,355.4 L195.7,357.0 L194.9,358.6 L194.1,360.3 L193.3,361.9 L192.7,363.6 L192.1,365.3 L191.6,367.0 L191.2,368.7 L190.9,370.4 L190.6,372.1 L190.4,373.8 L190.3,375.5 L190.2,377.1 L190.3,378.8 L190.3,380.4 L190.5,382.0 L190.7,383.6 L191.0,385.1 L191.3,386.7 L191.7,388.2 L192.2,389.6 L192.7,391.0 L193.3,392.4 L193.9,393.7 L194.6,395.0 L195.3,396.3 L196.1,397.5 L196.9,398.6 L197.7,399.7 L198.6,400.8 L199.5,401.8 L200.4,402.7 L201.4,403.6 L202.4,404.5 L203.4,405.3 L204.4,406.0 L205.5,406.7 L206.6,407.3 L207.6,407.9 L208.7,408.4 L209.8,408.8 L210.9,409.2 L212.0,409.6 L213.1,409.8 L214.2,410.1 L215.3,410.3 L216.4,410.4 L217.4,410.5 L218.5,410.5 L219.5,410.5 L220.6,410.4 L221.6,410.3 L222.5,410.1 L223.5,409.9 L224.4,409.7 L225.3,409.4 L226.2,409.1 L227.0,408.7 L227.8,408.3 L228.6,407.9 L229.3,407.5 L230.0,407.0 L230.7,406.5 L231.3,405.9 L231.9,405.4 L232.4,404.8 L232.9,404.2 L233.4,403.6 L233.8,403.0 L234.2,402.4 L234.5,401.8 L234.8,401.1 L235.1,400.5 L235.3,399.8 L235.5,399.2 L235.6,398.6 L235.7,397.9 L235.8,397.3 L235.8,396.7 L235.8,396.1 L235.7,395.5 L235.6,394.9 L235.5,394.4 L235.3,393.8 L235.1,393.3 L234.9,392.8 L234.7,392.3 L234.4,391.9 L234.1,391.5 L233.8,391.1 L233.4,390.7 L233.0,390.4 L232.6,390.1 L232.2,389.9 L231.8,389.6 L231.4,389.4 L230.9,389.3 L230.5,389.2" fill="none" stroke="#F6EFE4" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/></g></g></svg>';
var GUILL='';
function guilloche(){
  if(GUILL)return GUILL;var cx=105,cy=148,out=[];
  [[64,9,22,.16],[58,11,19,.12],[50,7,15,.10]].forEach(([R,r,d,op])=>{
    let pts=[];var n=1400,T=2*Math.PI*r;
    for(let i=0;i<=n;i++){var t=T*i/n;var k=(R-r)/r;pts.push((cx+(R-r)*Math.cos(t)+d*Math.cos(k*t)).toFixed(2)+','+(cy+(R-r)*Math.sin(t)-d*Math.sin(k*t)).toFixed(2));}
    out.push('<path d="M'+pts.join('L')+'" fill="none" stroke="#B8963A" stroke-width=".12" opacity="'+op+'"/>');});
  return GUILL=out.join('');
}
function coaBg(){
  var micro=Array(60).fill('baaskaraa · certificate of authenticity · ').join('');
  return '<svg class="bg" viewBox="0 0 210 296" aria-hidden="true"><defs><path id="coaMicro" d="M12.2,12.2 H197.8 V283.8 H12.2 Z"/></defs>'
   +guilloche()
   +'<rect x="8" y="8" width="194" height="280" fill="none" stroke="#B8963A" stroke-width=".45"/>'
   +'<rect x="10.4" y="10.4" width="189.2" height="275.2" fill="none" stroke="#B8963A" stroke-width=".15"/>'
   +'<text font-size="1.05" letter-spacing=".12" fill="#B8963A" opacity=".85" font-family="Montserrat,Helvetica,sans-serif"><textPath href="#coaMicro">'+micro+'</textPath></text></svg>';
}
var COA_CONTACT='info@baaskaraa.com';
function coaNo(w){return (w.coa&&w.coa.no)||('COA-'+w.inv+'-1');}
function fmtIssue(d){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(d||'');if(!m)return d||'';return (+m[3])+' '+['January','February','March','April','May','June','July','August','September','October','November','December'][+m[2]-1]+' '+m[1];}
function coaHtml(w,imgSrc,blank){
  var no=coaNo(w);var date=(w.coa&&w.coa.date)||new Date().toISOString().slice(0,10);
  var m=/^(.*)-(\d+)$/.exec(no);var issue=m?+m[2]:1;
  var rows=[['Medium',w.medium],['Dimensions',sizeStr(w)||'—'],['Edition',w.edition||'Unique work']]
    .concat(w.place?[['Place of creation',w.place]]:[]).concat([['Signature and inscriptions',w.signature||'—'],['Archive number',w.inv]])
    .concat(w.coa&&w.coa.holder?[['Issued to',w.coa.holder]]:[]);
  return '<div class="coa'+(blank?' blank':'')+'">'+coaBg()+'<div class="in">'
   +'<svg class="mk" viewBox="0 0 422 600" aria-hidden="true"><defs><linearGradient id="coaGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9C96A"/><stop offset=".55" stop-color="#C9A335"/><stop offset="1" stop-color="#9C7B25"/></linearGradient></defs><path d="'+MARK+'" fill="none" stroke="url(#coaGold)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/></svg>'
   +'<div class="wm">baaskaraa</div>'
   +'<div class="ttl">Certificate of authenticity</div><div class="rule"></div>'
   +'<div class="no">Nº '+esc(no)+'</div>'+(issue>1?'<div class="rep">Replacement certificate · cancels '+esc(m[1]+'-'+(issue-1))+' and any earlier issue</div>':'')
   +(Array.isArray(imgSrc)&&imgSrc.length>1
     ?'<div class="pic pages">'+imgSrc.map((s,k)=>'<img alt="Page '+(k+1)+'" src="'+s+'" style="max-width:'+((146-(imgSrc.length-1)*2.5)/imgSrc.length).toFixed(1)+'mm">').join('')+'</div>'
     :'<div class="pic">'+((Array.isArray(imgSrc)?imgSrc[0]:imgSrc)?'<img alt="" src="'+(Array.isArray(imgSrc)?imgSrc[0]:imgSrc)+'">':'<span>IMAGE OF THE WORK</span>')+'</div>')
   +'<div class="wt">'+esc(w.title||'Untitled')+(w.year?'<span class="wy">, '+esc(w.year)+'</span>':'')+'</div>'
   +'<div class="by">baaskaraa (Kasinathan Baskar, b. 1974)</div>'
   +'<div class="facts">'+rows.map(r=>'<div class="k">'+esc(r[0])+'</div><div class="v">'+esc(r[1])+'</div>').join('')+'</div>'
   +'<div class="st">I, Kasinathan Baskar, working as baaskaraa, certify that the work described above is an original work created by my own hand, and that the information given here is true to the best of my knowledge.</div>'
   +'<div class="sign"><div class="sg"><div class="line"></div><div class="cap"><b>Kasinathan Baskar (baaskaraa)</b>Artist · Singapore · '+esc(fmtIssue(date))+'</div></div><div class="seal" title="Seal preview, until the carved seal is ready">'+SEAL_SVG+'</div></div>'
   +'<div class="fine">The artist retains copyright and all reproduction rights in the work. This certificate is recorded in the baaskaraa archive under '+esc(w.inv)+' and is valid only with the artist\'s original signature and seal. Verification: '+COA_CONTACT+'</div>'
   +'</div></div>';
}
function coaShrink(c){if(!c)return;var z=c.style.zoom;c.style.zoom=1;var i=c.querySelector('.in'),ims=[...c.querySelectorAll('.pic img')];var over=()=>{var r=i.getBoundingClientRect(),pb=parseFloat(getComputedStyle(i).paddingBottom)||0;return i.lastElementChild.getBoundingClientRect().bottom>r.bottom-pb+0.5;};if(i&&ims.length){let h=56;var set=()=>ims.forEach(im=>im.style.maxHeight=h+'mm');set();while(over()&&h>30){h-=2;set();}}c.style.zoom=z;}

  function workSeq(list, enquire) {
    var seq = [];
    list.forEach(function (w) { (w.images || []).forEach(function (im, k) { seq.push({ work: w, im: im, no: w.inv + (w.images.length > 1 ? ' · ' + (k + 1) + '/' + w.images.length : ''), title: w.title + (w.year ? ', ' + w.year : ''), meta: [w.medium, w.size, w.series].filter(Boolean).join(' · '), hash: w.inv, inv: w.inv, links: backLinks(w.inv), enquire: enquire && enquire[w.inv] }); }); });
    return seq;
  }
  /* Artworks cards: open in the same viewer. A card with a public record opens the full record; a card without one shows its own image. */
  function openCards(cards, i) {
    if (!data) { load(function () { openCards(cards, i); }); return; }
    var seq = [], start = 0;
    cards.forEach(function (c, k) {
      var w = c.inv ? data.works.filter(function (x) { return x.inv === c.inv; })[0] : null;
      var enq = /^(Enquire|Available)$/i.test(c.status || '');
      if (k === i) start = seq.length;
      if (w && (w.images || []).length) { var e = {}; e[w.inv] = enq; seq = seq.concat(workSeq([w], e)); }
      else if (c.src) seq.push({ im: { u: asset(c.src) }, no: c.inv || '', title: c.title + (c.year ? ', ' + c.year : ''), meta: [c.medium, c.status && !enq ? c.status : ''].filter(Boolean).join(' · '), enquire: enq });
    });
    if (seq.length) openViewer(seq, start);
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
    return { im: d.img ? (typeof d.img === 'string' ? { a: d.img } : d.img) : null, no: d.id, kind: d.kind, title: d.title, meta: [ym(d.date), d.kind, d.by, d.note].filter(Boolean).join(' · '), hash: d.id, links: rel };
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
  return { mount: mount, load: load, route: route, handles: handles, invFor: invFor, openCards: openCards, tab: function () { return st.tab; }, visible: visible };
})();
