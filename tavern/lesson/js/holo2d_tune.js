/**
 * 立绘调参面板（临时工具）
 *
 * 只在地址带 ?tune=1 时挂载（见 main.js）。正常访问完全不受影响。
 *
 * 为什么要有它：
 *   立绘在右侧的落点是版面上的事，靠猜数字来回问太慢。
 *   这里给三根滑杆实时改，拖到满意后把右下角那几行发给我，我写死进 CSS。
 *
 * 能调三样：
 *   right    水平位置（vw）
 *   bottom   垂直位置（vh，可为负 —— 负值会把她推出视口下沿）
 *   scaleMul 缩放倍率（叠在 holo2d.js 自动算的比例之上）
 *
 * 风格：全部用 createElement 搭，不用 innerHTML —— 这样它能被
 *      _test_holo2d_tune.mjs 用最小 DOM 垫片真跑一遍，测得出运行时错误。
 *
 * 用完删法：删掉本文件 + main.js 里的 import 与那两处调用即可。
 * 它只通过 h2d.dev 这个调试接口碰立绘，正常代码路径不依赖它。
 */

const CSS = `
.h2dTune {
  position: fixed; left: 8px; bottom: 8px; z-index: 60;
  width: 252px;
  font: 12px/1.55 "Microsoft YaHei", system-ui, sans-serif;
  color: #e8ddc8;
  background: rgba(16, 12, 9, 0.94);
  border: 1px solid rgba(224, 174, 92, 0.34);
  border-radius: 9px;
  padding: 9px 11px 11px;
  box-shadow: 0 10px 34px rgba(0, 0, 0, 0.62);
  user-select: none;
}
.h2dTune__hd {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 7px;
}
.h2dTune__hd b { font-weight: 600; color: #e0ae5c; letter-spacing: 0.06em; }
.h2dTune__hd button {
  cursor: pointer; font: inherit; font-size: 11px;
  color: #c3b08c; background: transparent;
  border: 1px solid rgba(224,174,92,.3); border-radius: 5px;
  padding: 1px 7px;
}
.h2dTune__bd { display: grid; gap: 6px; }
.h2dTune.folded .h2dTune__bd { display: none; }

.h2dTune__row { display: grid; grid-template-columns: 64px 1fr 54px; gap: 6px; align-items: center; }
.h2dTune__row span { color: #c3b08c; }
.h2dTune__row output {
  text-align: right; color: #e0ae5c;
  font-variant-numeric: tabular-nums;
}
.h2dTune input[type=range] {
  width: 100%; accent-color: #e0ae5c; cursor: pointer; margin: 0;
}
.h2dTune__info {
  margin-top: 5px; padding-top: 6px;
  border-top: 1px solid rgba(224,174,92,.14);
  font-size: 11px; color: #8b7d67;
  font-variant-numeric: tabular-nums;
}
.h2dTune__out {
  margin: 6px 0 0; padding: 6px 7px;
  background: rgba(0,0,0,.42); border-radius: 6px;
  font: 11px/1.6 ui-monospace, Consolas, monospace;
  color: #f0dca8; white-space: pre; user-select: text; cursor: text;
}
.h2dTune__row2 { display: flex; gap: 6px; margin-top: 6px; }
.h2dTune__row2 button {
  flex: 1; cursor: pointer; font: inherit; font-size: 11px;
  color: #e8ddc8; background: rgba(224,174,92,.13);
  border: 1px solid rgba(224,174,92,.32); border-radius: 6px;
  padding: 4px 6px;
}
.h2dTune__row2 button:hover { background: rgba(224,174,92,.24); }
`;

/** 造元素小工具 */
function el(tag, cls, style, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (style) Object.assign(n.style, style);
  if (text !== undefined) n.textContent = text;
  return n;
}

export function mountHolo2DTuner(h2d) {
  if (!h2d || !h2d.dev || !h2d.dev.inner) {
    console.warn('[h2dTune] 立绘还没就绪，面板没挂上');
    return null;
  }
  const inner = h2d.dev.inner;

  // 样式只插一次
  if (!document.getElementById('h2dTuneStyle')) {
    const s = el('style');
    s.id = 'h2dTuneStyle';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ---- 从当前真实布局读出初值（computed 给的是 px，换算成 vw/vh）----
  const cs = getComputedStyle(inner);
  const init = {
    right: +((parseFloat(cs.right) || 0) / window.innerWidth * 100).toFixed(1),
    bottom: +((parseFloat(cs.bottom) || 0) / window.innerHeight * 100).toFixed(1),
    scaleMul: 1,
  };

  // ---- 面板骨架 ----
  const box = el('div', 'h2dTune');

  const hd = el('div', 'h2dTune__hd');
  hd.appendChild(el('b', null, null, '立绘调参'));
  const foldBtn = el('button', null, null, '收起');
  foldBtn.type = 'button';
  foldBtn.dataset.act = 'fold';
  hd.appendChild(foldBtn);
  box.appendChild(hd);

  const bd = el('div', 'h2dTune__bd');

  // 三根滑杆
  const SPEC = [
    { k: 'right', label: '水平', min: 0, max: 45, step: 0.5, unit: 'vw' },
    { k: 'bottom', label: '垂直', min: -30, max: 60, step: 0.5, unit: 'vh' },
    { k: 'scaleMul', label: '缩放', min: 0.5, max: 1.8, step: 0.02, unit: '' },
  ];
  const ranges = {};
  const outputs = {};

  for (const sp of SPEC) {
    const row = el('label', 'h2dTune__row');
    row.appendChild(el('span', null, null, sp.label));

    const r = el('input');
    r.type = 'range';
    r.min = String(sp.min);
    r.max = String(sp.max);
    r.step = String(sp.step);
    r.value = String(init[sp.k]);
    r.dataset.k = sp.k;
    row.appendChild(r);
    ranges[sp.k] = r;

    const o = el('output');
    o.dataset.o = sp.k;
    row.appendChild(o);
    outputs[sp.k] = o;

    bd.appendChild(row);
  }

  const info = el('div', 'h2dTune__info');
  info.dataset.info = '';
  bd.appendChild(info);

  const out = el('pre', 'h2dTune__out', { userSelect: 'text', cursor: 'text' });
  out.dataset.out = '';
  bd.appendChild(out);

  const row2 = el('div', 'h2dTune__row2');
  const copyBtn = el('button', null, null, '复制参数');
  copyBtn.type = 'button';
  copyBtn.dataset.act = 'copy';
  const resetBtn = el('button', null, null, '还原');
  resetBtn.type = 'button';
  resetBtn.dataset.act = 'reset';
  row2.appendChild(copyBtn);
  row2.appendChild(resetBtn);
  bd.appendChild(row2);

  box.appendChild(bd);
  document.body.appendChild(box);

  // ---- 应用 ----
  function apply() {
    const right = parseFloat(ranges.right.value);
    const bottom = parseFloat(ranges.bottom.value);
    const scaleMul = parseFloat(ranges.scaleMul.value);

    // 位置落在 inline style 上（fit() 只改 transform，不覆盖 right/bottom）
    inner.style.right = right + 'vw';
    inner.style.bottom = bottom + 'vh';
    // 缩放走调试接口（fit() 内部会乘上它）
    h2d.dev.setScaleMul(scaleMul);

    const scale = h2d.dev.scale;
    // offsetHeight 是不含 transform 的布局高（878）；乘缩放才是屏上高度
    const rendered = (inner.offsetHeight || 0) * scale;
    const vhPct = window.innerHeight > 0 ? rendered / window.innerHeight * 100 : 0;

    outputs.right.textContent = right.toFixed(1) + 'vw';
    outputs.bottom.textContent = bottom.toFixed(1) + 'vh';
    outputs.scaleMul.textContent = '×' + scaleMul.toFixed(2);

    info.textContent =
      `实际缩放 ${scale.toFixed(4)}　渲染高 ${Math.round(rendered)}px（${vhPct.toFixed(1)}vh）　` +
      `1/3 身高 = ${(vhPct / 3).toFixed(1)}vh`;

    out.textContent =
      `right:  ${right.toFixed(1)}vw\n` +
      `bottom: ${bottom.toFixed(1)}vh\n` +
      `scaleMul: ${scaleMul.toFixed(2)}`;
  }

  box.addEventListener('input', (e) => {
    if (e.target && e.target.dataset && e.target.dataset.k) apply();
  });

  box.addEventListener('click', async (e) => {
    const b = e.target && e.target.closest ? e.target.closest('button[data-act]') : null;
    if (!b) return;
    const act = b.dataset.act;

    if (act === 'fold') {
      box.classList.toggle('folded');
      b.textContent = box.classList.contains('folded') ? '展开' : '收起';
    } else if (act === 'reset') {
      ranges.right.value = String(init.right);
      ranges.bottom.value = String(init.bottom);
      ranges.scaleMul.value = '1';
      apply();
    } else if (act === 'copy') {
      const txt = out.textContent;
      try {
        await navigator.clipboard.writeText(txt);
        b.textContent = '已复制 ✓';
      } catch (err) {
        // 剪贴板不可用就选中文本，让人手工复制
        try {
          const rg = document.createRange();
          rg.selectNodeContents(out);
          const sel = getSelection();
          sel.removeAllRanges();
          sel.addRange(rg);
          b.textContent = '已选中，Ctrl+C';
        } catch (err2) {
          b.textContent = '请手抄下方参数';
        }
      }
      setTimeout(() => { b.textContent = '复制参数'; }, 1400);
    }
  });

  // 视口变化时重算信息（fit() 会改缩放）
  window.addEventListener('resize', () => setTimeout(apply, 0));

  apply();
  console.log('[h2dTune] 面板已挂上（?tune=1）', init);
  return box;
}