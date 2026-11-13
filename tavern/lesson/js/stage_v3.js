/* ==========================================================================
 * stage_v3.js — 羊毛毡舞台剧引擎 v3
 * --------------------------------------------------------------------------
 * 设计前提（全部来自 2026-11-07 已定规范）：
 *   · 盒式舞台，16:9，内部坐标系固定 1632×928，按容器等比缩放
 *   · 图层式布景：背景板 / 活动层 / 道具 / 光斑 / 台框 各自独立
 *   · 转场用「推拉板四拍」，不做淡入淡出
 *   · 表演语言：说话上下镚（快·1~3px）、待机左右镚（慢·0.5~1.5px），
 *     一律用 steps() 缓动，让它像被操纵的偶
 *   · 圆形光斑跟着角色脚下走，随说话亮暗
 *
 * 两套驱动：
 *   · manual — 点击/空格推进下一拍（鼠标手动触发）
 *   · auto   — 按时间轴自动跑，方便录屏
 *
 * 不依赖任何外部库。挂到 window.Stage。
 * ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------ 常量 ---------------------------------- */

  const W = 1632;
  const H = 928;

  /* 字幕羊皮纸板（2026-11-09 完整移植 _promo/scenes.js 的 parchmentPlate）
     奶白纸面 + 圆角 + 撕边线 + 左右麦穗，配色取宣传片 PAL */
  const SUB_FONT = '"Noto Serif SC","Source Han Serif SC","Songti SC","SimSun",serif';

  /* 图层层级：数字越大越靠前 */
  const Z = {
    bgBack: 10,   // 推板时露出的下一块背景
    bg: 20,       // 当前背景板
    mid: 30,      // 麦捆等中景
    props: 40,    // 月亮等道具
    spirit: 45,   // 守麦之灵（在马车之后 —— 2026-11-09 用户定：灵要在车后面）
    cart: 50,     // 马车
    actor: 60,    // 人物
    light: 70,    // 光斑
    fx: 80,       // 冷光、遮罩
    frame: 90,    // 台框
    title: 100,   // 题字
    sub: 110,     // 字幕
    veil: 120,    // 全黑幕
  };

  /* 缓动：僵硬、机械，像被硬拽的道具 */
  const EASE = {
    push: 'cubic-bezier(.55,.06,.68,.19)',   // 推板：起步重、收尾硬
    shift: 'cubic-bezier(.4,.0,.6,1)',
    linear: 'linear',
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ------------------------------ 引擎 ---------------------------------- */

  class StageEngine {
    constructor() {
      this.wrap = null;
      this.root = null;
      this.layers = new Map();
      this.boards = new Map();
      this.scale = 1;
      this.gen = 0;              // 每次跳拍 +1，旧动画据此自杀
      this.clips = new Map();    // 已预加载的音频
      this.nowAudio = null;
      this.bgAudio = null;
      this.onBeat = null;        // 外部回调：进入新拍
      this.currentBeat = '';         // 当前拍 id（SFXTRACK 用来校验触发时机）
      this.onDone = null;        // 外部回调：播放结束
      this.muted = false;
      this.fast = false;         // 快速重建模式：所有时长归零、音频不播
    }

    /* ---------- 挂载 ---------- */

    mount(wrapEl) {
      this.wrap = wrapEl;
      wrapEl.innerHTML = '';
      wrapEl.style.position = wrapEl.style.position || 'relative';
      wrapEl.style.overflow = 'hidden';

      const root = document.createElement('div');
      root.className = 'stage-root';
      root.style.cssText =
        'position:absolute;left:0;top:0;' +
        'width:' + W + 'px;height:' + H + 'px;' +
        'transform-origin:0 0;overflow:hidden;background:#000;';
      wrapEl.appendChild(root);
      this.root = root;

      /* 台口 + 幕布：**常驻装饰**，单独挂在 root 之下，不进 this.layers。
         理由：clearAll() 会遍历 this.layers 全清，而台口/幕布必须一直在。
         结构（自下而上）：
           stage-root
             └ .ly 各戏层（bg 20 … fx 80 / 特写 85~89）
             └ .stage-curtain (z 90)  ← 幕布，必须高于所有戏层，否则闭幕盖不住
             └ .stage-frame   (z 91)  ← A 木质画框，永远在最前（剧院台口）
             └ 题字 100 / 字幕 110   ← 引擎自建层，浮在最上 */
      this._buildProscenium(root);

      // 立刻试一次；布局尚未完成时（flex 容器尺寸为 0）靠 rAF 重试补上
      this._fit();

      // 1) rAF 重试：最多 120 帧（约 2 秒），拿到非 0 尺寸就停
      const retry = (n) => {
        if (this._fitted || n <= 0) return;
        this._fit();
        if (!this._fitted) requestAnimationFrame(() => retry(n - 1));
      };
      requestAnimationFrame(() => retry(120));

      // 2) 尺寸变化：ResizeObserver + window resize 双保险
      if (typeof ResizeObserver !== 'undefined') {
        this._ro = new ResizeObserver(() => this._fit());
        this._ro.observe(wrapEl);
      }
      this._onWinResize = () => this._fit();
      window.addEventListener('resize', this._onWinResize);
      window.addEventListener('orientationchange', this._onWinResize);

      return this;
    }

    /* ==================================================================
       台口 + 幕布（2026-11-11 用户定：台口 A 木质画框 + SVG 丝绒幕布）
       幕布来源：Tempest / Mariner's Repertory（SVG path 褶子 + feTurbulence 绒面）
       台口：A 木质画框（圆柱渐变柱 + 单条金内线，无重复条纹）
       ⚠ 不用 this._layer()：那套会进 this.layers，被 clearAll() 清掉。
         这里直接 appendChild 到 root，常驻。
       ================================================================== */
    _buildProscenium(root) {
      /* ---------- 幕布 ---------- */
      const cw = document.createElement('div');
      cw.className = 'stage-curtain';
      cw.style.cssText =
        'position:absolute;inset:0;z-index:90;overflow:hidden;' +
        'background:#070405;pointer-events:none;' +
        'transition:transform 1700ms cubic-bezier(.76,0,.18,1),' +
        'opacity 500ms ease 1400ms;will-change:transform,opacity;';
      cw.innerHTML =
        '<svg viewBox="0 0 1440 980" preserveAspectRatio="none" ' +
        'style="position:absolute;inset:0;width:100%;height:100%;' +
        'transform-origin:50% 0;animation:curtainSway 1700ms ease-in-out infinite alternate">' +
        '<defs>' +
        '<linearGradient id="svVelvet" x1="0" x2="1">' +
        '<stop offset="0" stop-color="#3d0710"/><stop offset="0.18" stop-color="#7a1522"/>' +
        '<stop offset="0.34" stop-color="#440812"/><stop offset="0.52" stop-color="#8b1d2a"/>' +
        '<stop offset="0.7" stop-color="#3b050d"/><stop offset="1" stop-color="#64101c"/>' +
        '</linearGradient>' +
        '<linearGradient id="svFold" x1="0" x2="1">' +
        '<stop offset="0" stop-color="#190206"/><stop offset="0.45" stop-color="#9f2534"/>' +
        '<stop offset="1" stop-color="#2d050b"/></linearGradient>' +
        '<linearGradient id="svEdge" x1="0" x2="1">' +
        '<stop offset="0" stop-color="#1a0308" stop-opacity=".85"/>' +
        '<stop offset="0.06" stop-color="#1a0308" stop-opacity="0"/>' +
        '<stop offset="0.94" stop-color="#1a0308" stop-opacity="0"/>' +
        '<stop offset="1" stop-color="#1a0308" stop-opacity=".85"/></linearGradient>' +
        '<filter id="svVelvetGrain" x="-2%" y="-2%" width="104%" height="104%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.09 0.16" numOctaves="3" ' +
        'seed="29" result="n"/>' +
        '<feColorMatrix in="n" type="saturate" values="0.06" result="g"/>' +
        '<feComponentTransfer in="g" result="gr">' +
        '<feFuncA type="linear" slope="0.35" intercept="0.32"/></feComponentTransfer>' +
        '<feBlend in="SourceGraphic" in2="gr" mode="multiply"/></filter>' +
        '</defs>' +
        '<g filter="url(#svVelvetGrain)">' +
        '<rect width="1440" height="980" fill="url(#svVelvet)"/>' +
        '<rect width="1440" height="980" fill="url(#svEdge)"/>' +
        '<g opacity=".58" fill="none" stroke="url(#svFold)">' +
        '<path d="M62 0c62 183 64 779 4 980" stroke-width="70"/>' +
        '<path d="M198 0c-52 206 -40 742 9 980" stroke-width="84"/>' +
        '<path d="M352 0c50 213 37 720 -5 980" stroke-width="74"/>' +
        '<path d="M508 0c-41 217 -33 718 11 980" stroke-width="82"/>' +
        '<path d="M660 0c30 210 20 720 -6 980" stroke-width="64"/>' +
        '<path d="M780 0c-30 210 -20 720 6 980" stroke-width="64"/>' +
        '<path d="M932 0c41 217 33 718 -11 980" stroke-width="82"/>' +
        '<path d="M1088 0c-50 213 -37 720 5 980" stroke-width="74"/>' +
        '<path d="M1242 0c52 206 40 742 -9 980" stroke-width="84"/>' +
        '<path d="M1378 0c-62 183 -64 779 -4 980" stroke-width="70"/>' +
        '</g></g>' +
        '<path d="M0 827c181-42 306 43 474 12 169-31 286-92 455-38 193 61 307-25 511 33v146H0z" fill="#1b0307"/>' +
        '<path d="M0 842c198-41 310 51 491 15 186-37 299-83 463-31 181 58 301-22 486 29" ' +
        'stroke="#caa45b" stroke-width="9" fill="none" opacity=".92"/>' +
        '</svg>';
      root.appendChild(cw);
      this.curtainEl = cw;

      /* ---------- 台口 A 木质画框 ---------- */
      const fr = document.createElement('div');
      fr.className = 'stage-frame';
      fr.style.cssText =
        'position:absolute;inset:0;z-index:' + (Z.frame + 1) + ';pointer-events:none;';
      /* 柱 1.5% / 上檐 3.6% / 台板 2.6%，全部按舞台比例 */
      fr.innerHTML =
        '<div style="position:absolute;top:0;left:0;right:0;height:3.6%;' +
        'background:linear-gradient(180deg,#0b0605 0%,#1f1008 48%,#0a0403 100%);' +
        'box-shadow:inset 0 -1px 0 rgba(202,164,91,.55),0 3px 9px rgba(0,0,0,.8)"></div>' +
        '<div style="position:absolute;bottom:0;left:0;right:0;height:2.6%;' +
        'background:linear-gradient(180deg,#0a0403 0%,#1f1008 52%,#0b0605 100%);' +
        'box-shadow:inset 0 1px 0 rgba(202,164,91,.5)"></div>' +
        '<div style="position:absolute;top:0;bottom:0;left:0;width:1.5%;' +
        'background:linear-gradient(90deg,#070302 0%,#3d2216 26%,#6b3d26 50%,#3d2216 74%,#070302 100%);' +
        'box-shadow:inset 1px 0 0 rgba(202,164,91,.4),2px 0 7px rgba(0,0,0,.75)"></div>' +
        '<div style="position:absolute;top:0;bottom:0;right:0;width:1.5%;transform:scaleX(-1);' +
        'background:linear-gradient(90deg,#070302 0%,#3d2216 26%,#6b3d26 50%,#3d2216 74%,#070302 100%);' +
        'box-shadow:inset 1px 0 0 rgba(202,164,91,.4),2px 0 7px rgba(0,0,0,.75)"></div>';
      root.appendChild(fr);
      this.frameEl = fr;
    }

    /** 开幕：幕布整块升起（1700ms，与 CSS transition 一致）
        ⚠ fast 模式（seek 重建）必须**瞬时**到位：
           seek() 会快速重放 0..i-1 拍，如果 transition 还在跑，
           跳到 S10 时幕布会停在中途，把整场戏遮住（2026-11-11 踩过）。 */
    openCurtain() {
      if (!this.curtainEl) return Promise.resolve();
      const el = this.curtainEl;
      if (this.fast) {
        el.style.transition = 'none';
        el.style.transform = 'translateY(-112%)';
        el.style.opacity = '0';
        void el.offsetWidth;                  // 强制回流，让 none 生效
        return Promise.resolve();
      }
      el.style.transition =
        'transform 1700ms cubic-bezier(.76,0,.18,1), opacity 500ms ease 1400ms';
      el.style.transform = 'translateY(-112%)';
      el.style.opacity = '0';
      return sleep(1700);
    }

    /** 闭幕：幕布落下 */
    closeCurtain() {
      if (!this.curtainEl) return Promise.resolve();
      const el = this.curtainEl;
      if (this.fast) {
        el.style.transition = 'none';
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
        void el.offsetWidth;
        return Promise.resolve();
      }
      el.style.transition =
        'transform 1700ms cubic-bezier(.76,0,.18,1), opacity 500ms ease 1400ms';
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
      return sleep(1700);
    }

    /** 幕布复位（S.clearAll 用不到，但重置/回开头时要有） */
    resetCurtain() {
      if (!this.curtainEl) return;
      const el = this.curtainEl;
      el.style.transition = 'none';
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
      void el.offsetWidth;
    }

    /** 读容器尺寸并应用缩放；返回是否成功。
     *  容器尺寸为 0 时（flex 布局尚未稳定、或挂在不撑高的中间层）向上找有尺寸的祖先。 */
    _fit() {
      if (!this.wrap || !this.root) return false;

      let host = this.wrap;
      let cw = 0, ch = 0, left = 0, top = 0;
      for (let i = 0; host && i < 6; i++) {
        const r = host.getBoundingClientRect();
        cw = r.width || host.clientWidth || 0;
        ch = r.height || host.clientHeight || 0;
        if (cw && ch) { left = r.left; top = r.top; break; }
        host = host.parentElement;
      }
      if (!cw || !ch) return false;

      const s = Math.min(cw / W, ch / H);
      this.scale = s;

      // 若真实容器比 wrap 大，就把 root 钉在祖先坐标上，避免错位
      const wr = this.wrap.getBoundingClientRect();
      const offX = host !== this.wrap ? (wr.left - left) : 0;
      const offY = host !== this.wrap ? (wr.top - top) : 0;

      this.root.style.width = W + 'px';
      this.root.style.height = H + 'px';
      this.root.style.transform = 'scale(' + s + ')';
      this.root.style.left = ((cw - W * s) / 2 - offX) + 'px';
      this.root.style.top = ((ch - H * s) / 2 - offY) + 'px';
      this._fitted = true;
      return true;
    }

    /* 兼容旧名 */
    _resize() { return this._fit(); }

    /* ---------- 图层基元 ---------- */

    _layer(name, z, cls) {
      let L = this.layers.get(name);
      if (L) {
        if (z !== undefined) L.el.style.zIndex = z;
        return L;
      }
      const el = document.createElement('div');
      el.className = 'ly ' + (cls || '');
      el.dataset.ly = name;
      el.style.cssText =
        'position:absolute;left:0;top:0;width:100%;height:100%;' +
        'pointer-events:none;opacity:0;will-change:opacity,transform;';
      if (z !== undefined) el.style.zIndex = z;
      this.root.appendChild(el);
      L = { el, img: null, z };
      this.layers.set(name, L);
      return L;
    }

    _anchorPos(x, y, w, h, anchor) {
      const a = anchor || 'tl';
      const vert = a[0];   // t / m / b
      const horz = a[1] || 'l'; // l / c / r
      let left = x, top = y;
      if (horz === 'c') left = x - w / 2;
      else if (horz === 'r') left = x - w;
      if (vert === 'm') top = y - h / 2;
      else if (vert === 'b') top = y - h;
      return { left, top };
    }

    /**
     * 在图层里放一张图。
     * opt: { src, w, h, x, y, anchor, opacity, natural, filter, blend }
     *   w/h 只给一个时按图片原始比例算另一个
     *   natural: true 表示用原始像素尺寸
     *
     * 注意：图片是异步加载的。若尺寸 w/h 都能立刻算出来，就**同步**设置
     * width/height，left/top 也同步按给定位放好；onload 只补尺寸，不再
     * 覆盖位置 —— 否则紧随其后的 moveTo 会被 onload 冲掉。
     */
    setImage(name, opt) {
      const L = this._layer(name, opt.z);
      const img = L.img || document.createElement('img');
      if (!L.img) {
        img.className = 'ly-img';
        img.style.cssText =
          'position:absolute;display:block;user-select:none;-webkit-user-drag:none;';
        img.draggable = false;
        L.el.appendChild(img);
        L.img = img;
      }
      img.src = opt.src;

      const natW = img.naturalWidth || 0;
      const natH = img.naturalHeight || 0;
      // 宽/高比：优先用调用方给的 ratio（图片未加载时 naturalWidth 为 0，算不出来）
      const R = opt.ratio || (natW && natH ? natW / natH : 0);

      const apply = (allowPos) => {
        let w = opt.w, h = opt.h;
        if (opt.natural) { w = natW; h = natH; }
        if (h && !w) w = R ? h * R : (natH ? h * natW / natH : 0);
        if (w && !h) h = R ? w / R : (natW ? w * natH / natW : 0);
        if (!w && natW) { w = natW; h = natH; }
        if (w) img.style.width = w + 'px';
        if (h) img.style.height = h + 'px';
        L.w = w; L.h = h;
        if (allowPos && w && h) {
          const p = this._anchorPos(opt.x || 0, opt.y || 0, w, h, opt.anchor);
          img.style.left = p.left + 'px';
          img.style.top = p.top + 'px';
          L.x = p.left; L.y = p.top;
        }
      };

      // 首次就把位置定下来（避免后续 onload 覆盖 moveTo）
      apply(true);
      L.manualPos = false;

      if (!(img.complete && img.naturalWidth)) {
        img.onload = () => {
          // 只补尺寸；如果调用方已经手动挪过，就不碰位置
          apply(!L.manualPos);
        };
      }

      if (opt.opacity !== undefined) L.el.style.opacity = opt.opacity;
      if (opt.filter !== undefined) img.style.filter = opt.filter;
      if (opt.blend !== undefined) img.style.mixBlendMode = opt.blend;
      return L;
    }

    /** 背景板：铺满整个舞台，1632×928 */
    setBg(name, src, z) {
      return this.setImage(name, { src, w: W, h: H, x: 0, y: 0, anchor: 'tl', z: z || Z.bg });
    }

    /* ---------- 透明度 ---------- */

    fade(name, to, ms, ease) {
      const L = this.layers.get(name);
      if (!L) return Promise.resolve();
      const g = this.gen;
      const dur = this.fast ? 0 : (ms || 0);
      L.el.style.transition = 'opacity ' + dur + 'ms ' + (ease || EASE.linear);
      // 强制回流，保证 transition 生效
      void L.el.offsetWidth;
      L.el.style.opacity = String(to);
      if (!dur) return Promise.resolve();
      return sleep(dur).then(() => { if (g !== this.gen) throw new Error('stale'); });
    }

    show(name, ms) { return this.fade(name, 1, ms || 0); }
    hide(name, ms) { return this.fade(name, 0, ms || 0); }

    /* ---------- 位移 / 缩放 ---------- */

    /**
     * 把图层整体移动/缩放到新状态（作用于图层容器，不是图片）。
     * to: { x, y, scale, rotate, opacity, origin }
     *   origin 传 CSS transform-origin，例如 '600px 886px'（按舞台像素定位）。
     *   不传则用 '0 0'（纯平移时安全）。
     */
    transform(name, to, ms, ease) {
      const L = this.layers.get(name);
      if (!L) return Promise.resolve();
      const g = this.gen;
      const el = L.el;
      const st = L.tf || { x: 0, y: 0, s: 1, r: 0 };
      const nx = to.x !== undefined ? to.x : st.x;
      const ny = to.y !== undefined ? to.y : st.y;
      const ns = to.scale !== undefined ? to.scale : st.s;
      const nr = to.rotate !== undefined ? to.rotate : st.r;
      L.tf = { x: nx, y: ny, s: ns, r: nr };

      const dur = this.fast ? 0 : (ms || 0);
      const org = to.origin || L.origin || '0 0';
      L.origin = org;
      el.style.transition =
        'transform ' + dur + 'ms ' + (ease || EASE.shift) +
        ', opacity ' + dur + 'ms ' + (ease || EASE.linear);
      void el.offsetWidth;
      el.style.transformOrigin = org;
      el.style.transform =
        'translate3d(' + nx + 'px,' + ny + 'px,0) ' +
        'scale(' + ns + ') rotate(' + nr + 'deg)';
      if (to.opacity !== undefined) el.style.opacity = String(to.opacity);
      if (!dur) return Promise.resolve();
      return sleep(dur).then(() => { if (g !== this.gen) throw new Error('stale'); });
    }

    /** 直接改图层里那张图的绝对坐标（给 left/top 原值）。
     *  比整层 transform 更可控 —— 用于「在舞台内潜行移动」。 */
    moveTo(name, left, top, ms, ease) {
      const L = this.layers.get(name);
      if (!L || !L.img) return Promise.resolve();
      const g = this.gen;
      const img = L.img;
      const dur = this.fast ? 0 : (ms || 0);
      img.style.transition = dur
        ? 'left ' + dur + 'ms ' + (ease || EASE.linear) +
          ', top ' + dur + 'ms ' + (ease || EASE.linear)
        : 'none';
      void img.offsetWidth;
      img.style.left = left + 'px';
      if (top !== undefined && top !== null) img.style.top = top + 'px';
      L.x = left;
      if (top !== undefined && top !== null) L.y = top;
      L.manualPos = true;          // 标记：位置由调用方接管，onload 别再动
      if (!dur) return Promise.resolve();
      return sleep(dur).then(() => { if (g !== this.gen) throw new Error('stale'); });
    }

    /** 让图层的「图片中心」落到舞台坐标 (cx, cy) */
    moveCenter(name, cx, cy, ms, ease) {
      const L = this.layers.get(name);
      if (!L || !L.img) return Promise.resolve();
      const w = L.w || L.img.naturalWidth;
      const h = L.h || L.img.naturalHeight;
      return this.moveTo(name, cx - w / 2, cy - h / 2, ms, ease);
    }

    /** 单独缩放图片本体（不动图层） */
    scaleImg(name, s, ms, ease) {
      const L = this.layers.get(name);
      if (!L || !L.img) return Promise.resolve();
      const g = this.gen;
      const img = L.img;
      const dur = this.fast ? 0 : (ms || 0);
      img.style.transition = dur
        ? 'transform ' + dur + 'ms ' + (ease || EASE.linear) : 'none';
      img.style.transformOrigin = '50% 100%';
      void img.offsetWidth;
      img.style.transform = 'scale(' + s + ')';
      if (!dur) return Promise.resolve();
      return sleep(dur).then(() => { if (g !== this.gen) throw new Error('stale'); });
    }

    clear(name) {
      const L = this.layers.get(name);
      if (!L) return;
      L.el.style.opacity = '0';
      L.el.style.transform = 'none';
      L.tf = { x: 0, y: 0, s: 1, r: 0 };
      if (L.img) { L.img.src = ''; L.img.style.width = '0px'; }
    }

    clearAll() {
      /* 2026-11-09：清场时必须一并掐掉字幕延迟定时器，
         否则 seek()/跳拍后旧定时器还会把字幕提出来。 */
      if (this._subTimer) {
        clearTimeout(this._subTimer);
        this._subTimer = null;
      }
      if (this._subLayer) {
        this._subLayer.el.innerHTML = '';
        this._subLayer.el.style.opacity = '0';
      }
      this.layers.forEach((L, k) => this.clear(k));
    }

    /* ---------- 推拉板（四拍转场的核心） ---------- */

    /**
     * 装两块背景板并排：索引 0 在舞台原位，索引 1 在右侧（W 处）。
     * 推板 = 整体左移一个舞台宽。
     */
    board(name, srcs, opt) {
      const z = (opt && opt.z) || Z.bg;
      let bd = this.boards.get(name);
      if (!bd) {
        const el = document.createElement('div');
        el.className = 'ly board';
        el.dataset.ly = 'board:' + name;
        el.style.cssText =
          'position:absolute;left:0;top:0;height:' + H + 'px;' +
          'display:flex;flex-direction:row;opacity:0;' +
          'will-change:transform;z-index:' + z + ';pointer-events:none;';
        this.root.appendChild(el);
        bd = { el, n: 0, idx: 0 };
        this.boards.set(name, bd);
      }
      if (srcs) {
        bd.el.innerHTML = '';
        srcs.forEach((s) => {
          const img = document.createElement('img');
          img.src = s;
          img.draggable = false;
          img.style.cssText =
            'display:block;width:' + W + 'px;height:' + H + 'px;flex:0 0 auto;' +
            'object-fit:cover;user-select:none;';
          bd.el.appendChild(img);
        });
        bd.n = srcs.length;
      }
      bd.el.style.width = (W * Math.max(1, bd.n)) + 'px';
      return bd;
    }

    /** 把板推到第 idx 块（0 起）。ms=0 表示瞬移。 */
    pushBoard(name, idx, ms, ease) {
      const bd = this.boards.get(name);
      if (!bd) return Promise.resolve();
      const g = this.gen;
      bd.idx = idx;
      const tx = -W * idx;
      bd.el.style.transition = ms
        ? 'transform ' + ms + 'ms ' + (ease || EASE.push)
        : 'none';
      void bd.el.offsetWidth;
      bd.el.style.transform = 'translate3d(' + tx + 'px,0,0)';
      if (!ms) return Promise.resolve();
      const p = sleep(ms).then(() => { if (g !== this.gen) throw new Error('stale'); });
      return p;
    }

    showBoard(name, ms) {
      const bd = this.boards.get(name);
      if (!bd) return Promise.resolve();
      const g = this.gen;
      bd.el.style.transition = 'opacity ' + (ms || 0) + 'ms linear';
      void bd.el.offsetWidth;
      bd.el.style.opacity = '1';
      if (!ms) return Promise.resolve();
      return sleep(ms).then(() => { if (g !== this.gen) throw new Error('stale'); });
    }

    hideBoard(name, ms) {
      const bd = this.boards.get(name);
      if (!bd) return Promise.resolve();
      const g = this.gen;
      bd.el.style.transition = 'opacity ' + (ms || 0) + 'ms linear';
      void bd.el.offsetWidth;
      bd.el.style.opacity = '0';
      if (!ms) return Promise.resolve();
      return sleep(ms).then(() => { if (g !== this.gen) throw new Error('stale'); });
    }

    /* ---------- 表演：镚定 ---------- */

    /**
     * 设角色的表演状态。
     *   'speaking' — 上下镚 + 轻微左右抖，快，证明「是谁在说话」
     *   'idle'     — 左右极慢镚，几乎不动
     *   'none'     — 站定
     * amp: 说话时的幅度 px（默认 3）；idle 时是横向幅度（默认 1）
     */
    act(name, state, amp) {
      const L = this.layers.get(name);
      if (!L) return;
      const el = L.img ? L.img : L.el;
      el.style.animation = 'none';
      void el.offsetWidth;
      if (state === 'speaking') {
        el.style.setProperty('--amp', (amp || 3) + 'px');
        el.style.animation = 'jy 0.40s steps(3, end) infinite';
      } else if (state === 'idle') {
        el.style.setProperty('--amp', (amp || 1) + 'px');
        el.style.animation = 'jx 2.4s steps(4, end) infinite';
      }
      L.act = state;
    }

    /** 说话时的「抖」：短促高频，叠在镚动之上（用于强调说话者） */
    talk(name, amp) {
      const L = this.layers.get(name);
      if (!L) return;
      const el = L.img ? L.img : L.el;
      el.style.setProperty('--amp', (amp || 3) + 'px');
      el.style.animation = 'shake .26s steps(2, end) infinite';
      L.act = 'talking';
    }

    /** 大幅度动作：整层弹一下 */
    hop(name, px, ms) {
      const L = this.layers.get(name);
      if (!L) return Promise.resolve();
      const el = L.img ? L.img : L.el;
      const g = this.gen;
      el.style.transition = 'transform ' + ((ms || 180) / 2) + 'ms ' + EASE.push;
      el.style.transform = 'translateY(-' + (px || 18) + 'px)';
      return sleep((ms || 180) / 2).then(() => {
        if (g !== this.gen) throw new Error('stale');
        el.style.transition = 'transform ' + ((ms || 180) / 2) + 'ms ' + EASE.push;
        el.style.transform = 'translateY(0)';
        return sleep((ms || 180) / 2);
      });
    }

    /* ---------- 舞台光斑 ---------- */

    /**
     * 在 (x,y) 处放一个圆形光斑（径向渐变），半径 r。
     * 光斑是独立图层，跟随角色脚下。
     */
    spot(name, opt) {
      const L = this._layer(name, opt.z || Z.light);
      if (!L.el.querySelector('.spot')) {
        const d = document.createElement('div');
        d.className = 'spot';
        d.style.cssText =
          'position:absolute;border-radius:50%;' +
          'background:radial-gradient(ellipse at center,' +
          'rgba(255,240,200,.42) 0%,' +
          'rgba(255,232,180,.24) 34%,' +
          'rgba(255,226,160,.08) 58%,' +
          'rgba(255,220,150,0) 74%);' +
          'filter:blur(6px);mix-blend-mode:screen;';
        L.el.appendChild(d);
        L.spot = d;
      }
      const r = opt.r || 150;
      const d = L.spot;
      d.style.width = (r * 2) + 'px';
      d.style.height = (r * 1.05) + 'px';
      d.style.left = (opt.x - r) + 'px';
      d.style.top = (opt.y - r * 0.525) + 'px';
      L.el.style.opacity = opt.opacity === undefined ? '1' : String(opt.opacity);
      return L;
    }

    /** 光斑随说话亮暗 */
    spotLevel(name, level, ms) {
      const L = this.layers.get(name);
      if (!L) return;
      L.el.style.transition = 'opacity ' + (ms || 220) + 'ms ease-out';
      L.el.style.opacity = String(level);
    }

    /* ---------- 题字 / 字幕 ---------- */

    /**
     * 标题（2026-11-09：加羊皮纸底，与字幕同一套视觉）
     * opt: { top, size, ls, inMs, holdMs, outMs }
     *   不传 holdMs 就一直停着，由调用方自己 fade('title', 0)
     *   传了 holdMs 则到时自动渐隐退出
     */
    title(text, opt) {
      const o = opt || {};
      const L = this._layer('title', Z.title);
      L.el.style.opacity = '0';
      L.el.innerHTML = '';
      if (!text) return Promise.resolve();

      const size = o.size || 54;
      const ls = o.ls === undefined ? 0.18 : o.ls;

      /* 和字幕同一套羊皮纸板，但纸色更实、边线更深 ——
         标题压在明亮麦田上，淡奶白会糊成一片。 */
      const meas = this._measureWrap(text, size, Math.round(W * 0.78));
      const padX = Math.round(size * 0.95);
      const padY = Math.round(size * 0.52);
      const plateW = meas.width + padX * 2;
      const plateH = Math.round(size * 1.35) + padY * 2;

      const wrap = document.createElement('div');
      wrap.style.cssText =
        'position:absolute;left:0;right:0;top:' + (o.top || 120) + 'px;' +
        'display:flex;justify-content:center;';

      const plate = document.createElement('div');
      // 标题版：纸几乎不透明白（.99），边线加深，明亮麦田上才立得住
      const bg = this._parchment(plateW, plateH,
        'rgba(254,251,246,.99)', '#A8875A');
      plate.style.cssText =
        'width:' + plateW + 'px;' +
        'height:' + plateH + 'px;' +
        'box-sizing:border-box;' +
        'padding:' + padY + 'px ' + padX + 'px;' +
        'background-image:url("' + bg + '");' +
        'background-size:' + (plateW + 128) + 'px ' + (plateH + 128) + 'px;' +
        'background-position:center;' +
        'background-repeat:no-repeat;' +
        'display:flex;align-items:center;justify-content:center;';

      const inner = document.createElement('div');
      inner.textContent = text;
      inner.style.cssText =
        'font-family:' + SUB_FONT + ';' +
        'font-size:' + size + 'px;' +
        'letter-spacing:' + ls + 'em;' +
        'line-height:' + Math.round(size * 1.35) + 'px;' +
        'color:#6E5D46;' +
        'white-space:nowrap;';

      plate.appendChild(inner);
      wrap.appendChild(plate);
      L.el.appendChild(wrap);

      const p = this.fade('title', 1, o.inMs || 1200);

      // 传了 holdMs 就自动渐隐退出
      if (o.holdMs) {
        const g = this.gen;
        p.then(() => new Promise((r) => setTimeout(r, this.fast ? 0 : o.holdMs)))
          .then(() => {
            if (g !== this.gen) return;
            return this.fade('title', 0, o.outMs || 900);
          })
          .catch(() => {});
      }
      return p;
    }

    /**
     * 字幕。
     * 2026-11-09：加羊毛毡背景板 —— 底色取赫萝发色 #CCB399，
     * 叠一层毡纹 tile，两端柔边淡出，做成「贴在画面上的一块毡片」。
     * 文字改成深棕，压在毡片上，对比度够且不刺眼。
     */
    /**
     * 字幕（2026-11-09 完整移植宣传片 _promo/scenes.js 的 parchmentPlate）
     *
     * 视觉：奶白羊皮纸底 + 圆角 + 撕边线 + 左右各一枝麦穗 + 柔和投影。
     * 文字：深棕 #6E5D46。
     *
     * 三条行为规则（用户定）：
     *   ① 外框比字幕大一圈 —— 用 padding 保证，板永远包住字
     *   ② 字幕消失时外框同时消失 —— 板与字在同一个层，一起淡出
     *   ③ 字幕延迟 0.5s 消失；若 0.5s 内来了新字幕，直接接上不淡出
     */
    sub(text, opt) {
      const o = opt || {};
      if (!this._subLayer) {
        this._subLayer = this._layer('sub', Z.sub);
      }
      const L = this._subLayer;

      // ③ 延迟消失：先清掉待执行的淡出
      if (this._subTimer) {
        clearTimeout(this._subTimer);
        this._subTimer = null;
      }

      /* 空文本 = 请求收起，但不是立刻 —— 排 0.5s 后淡出。
         2026-11-09 修：定时器必须带 gen 守卫。
         否则 seek() 的 fast 重建会瞬间跑过十几拍、排下十几个定时器，
         它们在真实时间里陆续触发，把已经过去的字幕又提出来，
         表现为「S01 前几拍莫名多出字幕」。 */
      if (!text) {
        const holdMs = this.fast ? 0 : (o.holdMs === undefined ? 500 : o.holdMs);
        const g = this.gen;
        this._subTimer = setTimeout(() => {
          this._subTimer = null;
          if (g !== this.gen) return;          // 已经跳拍了，放弃
          this.fade('sub', 0, 320);
          const g2 = this.gen;
          setTimeout(() => {
            if (g2 !== this.gen) return;
            if (!this._subTimer) L.el.innerHTML = '';
          }, 360);
        }, holdMs);
        return Promise.resolve();
      }

      const bottom = o.bottom || 56;
      const size = o.size || 30;
      const ink = o.color || '#6E5D46';

      /* fast 模式（seek 重建）下不画字幕：
         反正看不见（0ms 就跳走），画了反而堆 DOM、排定时器。 */
      if (this.fast) {
        L.el.innerHTML = '';
        L.el.style.opacity = '0';
        return Promise.resolve();
      }

      /* 板尺寸：先按字号量出文字真实宽度（用离屏 canvas 精确测） */
      const meas = this._measureWrap(text, size, Math.round(W * 0.52));
      const padX = Math.round(size * 1.15);   // ① 左右各留一个字宽
      const padY = Math.round(size * 0.62);   // ① 上下留白
      const lineH = Math.round(size * 1.42);
      const plateW = meas.width + padX * 2;
      const plateH = meas.lines.length * lineH + padY * 2;

      L.el.innerHTML = '';
      L.el.style.opacity = L.el.style.opacity || '0';

      /* 板：用缓存的羊皮纸 PNG 作背景（撕边 + 麦穗已烘焙在里面） */
      const plate = document.createElement('div');
      const bg = this._parchment(plateW, plateH);
      plate.style.cssText =
        'position:absolute;left:50%;bottom:' + bottom + 'px;' +
        'transform:translateX(-50%);' +
        'width:' + plateW + 'px;' +
        'height:' + plateH + 'px;' +
        'box-sizing:border-box;' +
        'padding:' + padY + 'px ' + padX + 'px;' +
        'background-image:url("' + bg + '");' +
        'background-size:' + (plateW + 128) + 'px ' + (plateH + 128) + 'px;' +
        'background-position:center;' +
        'background-repeat:no-repeat;' +
        'display:flex;align-items:center;justify-content:center;';

      /* 字 */
      const box = document.createElement('div');
      box.textContent = text;
      box.style.cssText =
        'margin:0;text-align:center;' +
        'font-family:' + SUB_FONT + ';' +
        'font-size:' + size + 'px;' +
        'line-height:' + lineH + 'px;' +
        'color:' + ink + ';' +
        'letter-spacing:.04em;' +
        'white-space:' + (meas.lines.length > 1 ? 'normal' : 'nowrap') + ';' +
        /* 2026-11-12：多行时平衡行宽，避免「末行只剩两三个字」
           （如 S00-02「…掌管过麦｜子的丰收。」） */
        (meas.lines.length > 1 ? 'text-wrap:balance;' : '') +
        'word-break:break-all;';

      plate.appendChild(box);
      L.el.appendChild(plate);

      // ② 板与字同层，一起淡入；消失时也一起
      return this.fade('sub', 1, o.inMs || 260);
    }

    /** 用离屏 canvas 精确量出折行结果（返回行数组与最大行宽） */
    _measureWrap(text, size, maxW) {
      if (!this._mctx) {
        const c = document.createElement('canvas');
        c.width = 8; c.height = 8;
        this._mctx = c.getContext('2d');
      }
      const ctx = this._mctx;
      ctx.font = '500 ' + size + 'px ' + SUB_FONT;
      const maxLines = 3;
      const out = [];
      let cur = '';
      for (const ch of text) {
        const test = cur + ch;
        if (ctx.measureText(test).width > maxW && cur !== '') {
          out.push(cur);
          cur = ch;
          if (out.length === maxLines) break;
        } else {
          cur = test;
        }
      }
      if (out.length < maxLines && cur !== '') out.push(cur);
      let width = 0;
      for (const r of out) width = Math.max(width, ctx.measureText(r).width);
      return { lines: out, width: Math.ceil(width) };
    }

    /**
     * 生成羊皮纸板，带缓存。
     *
     * 2026-11-09 用户要求两处调整：
     *   ① 圆角过渡 —— 角不再是硬 6px，改成大圆角（按板高比例），
     *      并在圆角外再做一圈柔和过渡，像一块软毡片而不是切边纸。
     *   ② 外框渐变不透明感 —— 纸面中心最实，向四边逐渐变淡，
     *      边缘柔和融进画面，不再是「一块硬贴上去的板」。
     *
     * paper / ink 仍可覆盖，供标题版用更厚的一档。
     */
    _parchment(w, h, paper, ink) {
      const P = paper || 'rgba(251,247,239,.96)';
      const I = ink || '#DCC9A8';
      const key = w + 'x' + h + '|' + P + '|' + I;
      if (!this._parchCache) this._parchCache = new Map();
      if (this._parchCache.has(key)) return this._parchCache.get(key);

      const SS = 2;                       // 2 倍超采样
      const M = 64;                       // 画布四周留白（放投影与渐变）
      const cw = Math.ceil(w + M * 2);
      const ch = Math.ceil(h + M * 2);
      const cv = document.createElement('canvas');
      cv.width = cw * SS;
      cv.height = ch * SS;
      const ctx = cv.getContext('2d');
      ctx.scale(SS, SS);

      const x = M, y = M;

      // ① 圆角：按短边的 22% 取，最大 26px —— 小板上也要看得出是圆的
      const radius = Math.min(26, Math.round(Math.min(w, h) * 0.22));

      /* ② 渐变不透明：
         先画一块「中心实、边缘淡」的径向渐变作为填充。
         用椭圆渐变，让横向长板的两端也自然变淡。 */
      ctx.save();
      // 投影（用同一路径，保证形状一致）
      ctx.shadowColor = 'rgba(30,22,12,.5)';
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 6;
      this._roundRect(ctx, x, y, w, h, radius);
      ctx.fillStyle = P;
      ctx.fill();
      ctx.restore();

      // 主体：椭圆径向渐变（中心最实 → 边缘明显透）
      ctx.save();
      this._roundRect(ctx, x, y, w, h, radius);
      ctx.clip();
      // 用椭圆渐变：横向长板的两端也能跟着变淡，而不是只有四角
      ctx.translate(x + w / 2, y + h / 2);
      ctx.scale(w / 2, h / 2);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      const rgb = this._parseRGB(P);
      const a0 = this._parseAlpha(P);
      // 中心保持，40% 之后开始明显衰减，边缘只剩 38%
      g.addColorStop(0.00, 'rgba(' + rgb + ',' + a0 + ')');
      g.addColorStop(0.40, 'rgba(' + rgb + ',' + (a0 * 0.97).toFixed(3) + ')');
      g.addColorStop(0.68, 'rgba(' + rgb + ',' + (a0 * 0.86).toFixed(3) + ')');
      g.addColorStop(0.86, 'rgba(' + rgb + ',' + (a0 * 0.66).toFixed(3) + ')');
      g.addColorStop(1.00, 'rgba(' + rgb + ',' + (a0 * 0.38).toFixed(3) + ')');
      ctx.fillStyle = g;
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();

      // ③ 外缘羽化：把板边往外削薄 4px，形成柔和的过渡带
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,.72)';
      ctx.lineWidth = 4;
      ctx.filter = 'blur(2.4px)';
      this._roundRect(ctx, x + 1, y + 1, w - 2, h - 2, radius);
      ctx.stroke();
      ctx.filter = 'none';
      ctx.restore();

      // 撕边线：去掉（用户要求「外框渐变不透明感」，硬线与之冲突）

      // ③ 纸纹 + 褶皱（照抄 _promo/scenes.js 的 buildGrain，2026-11-09 用户定）
      ctx.save();
      this._roundRect(ctx, x, y, w, h, radius);
      ctx.clip();

      // 3a 确定性纸纹（256×256 平铺，一次构建复用）
      if (!this._grain) this._grain = this._buildGrain(20261027);
      const pat = ctx.createPattern(this._grain, 'repeat');
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = pat;
      ctx.fillRect(x, y, w, h);

      // 3b 皱巴巴的褶皱：明暗交替的斜向带，方向随机、带弯曲
      //    每条褶皱 = 一条暗线 + 紧邻一条亮线，模拟纸被折过的凸起
      ctx.globalAlpha = 1;
      const creases = Math.max(2, Math.round(w / 300));
      let sd = 7777;
      const rnd = () => { sd = (sd * 1103515245 + 12345) & 0x7fffffff; return sd / 0x7fffffff; };
      for (let i = 0; i < creases; i++) {
        const u = (i + 0.5) / creases;
        const cx0 = x + w * u + (rnd() - 0.5) * 60;
        // 倾斜方向随机，幅度更大，避免看起来像竖条码
        const lean = (rnd() < 0.5 ? -1 : 1) * (18 + rnd() * 34);
        const half = h * (0.55 + rnd() * 0.35);
        const bend = (rnd() - 0.5) * 30;

        // 暗线（很淡）
        ctx.strokeStyle = 'rgba(150,122,90,' + (0.028 + rnd() * 0.028).toFixed(3) + ')';
        ctx.lineWidth = 5 + rnd() * 7;
        ctx.beginPath();
        ctx.moveTo(cx0, y + h / 2 - half / 2);
        ctx.bezierCurveTo(
          cx0 + lean * 0.3 + bend, y + h / 2 - half * 0.2,
          cx0 + lean * 0.7 + bend, y + h / 2 + half * 0.2,
          cx0 + lean, y + h / 2 + half / 2
        );
        ctx.stroke();

        // 亮线（贴着暗线偏移 4px，形成「凸起」）
        ctx.strokeStyle = 'rgba(255,254,250,' + (0.16 + rnd() * 0.12).toFixed(3) + ')';
        ctx.lineWidth = 4 + rnd() * 6;
        ctx.beginPath();
        ctx.moveTo(cx0 + 4, y + h / 2 - half / 2);
        ctx.bezierCurveTo(
          cx0 + 4 + lean * 0.3 + bend, y + h / 2 - half * 0.2,
          cx0 + 4 + lean * 0.7 + bend, y + h / 2 + half * 0.2,
          cx0 + 4 + lean, y + h / 2 + half / 2
        );
        ctx.stroke();
      }

      // 3c 上下边缘加一点暗，像纸沿被压过
      const eg = ctx.createLinearGradient(0, y, 0, y + h);
      eg.addColorStop(0, 'rgba(160,132,96,.10)');
      eg.addColorStop(0.10, 'rgba(160,132,96,0)');
      eg.addColorStop(0.90, 'rgba(160,132,96,0)');
      eg.addColorStop(1, 'rgba(160,132,96,.10)');
      ctx.fillStyle = eg;
      ctx.fillRect(x, y, w, h);
      ctx.restore();

      const url = cv.toDataURL('image/png');
      this._parchCache.set(key, url);
      // 缓存别无限涨
      if (this._parchCache.size > 40) {
        const first = this._parchCache.keys().next().value;
        this._parchCache.delete(first);
      }
      return url;
    }

    /**
     * 确定性纸纹（照抄 _promo/scenes.js 的 buildGrain）
     * 256×256，暖白底 + 双线性伪随机噪点 + 26 条长纤维曲线。
     * 用固定种子，保证每次生成一模一样，可安全缓存。
     */
    _buildGrain(seed) {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const g = c.getContext('2d');
      const img = g.createImageData(256, 256);
      let s = seed;
      const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 232 + Math.floor(rnd() * 23);
        img.data[i] = v;
        img.data[i + 1] = v - 3;
        img.data[i + 2] = v - 12;
        img.data[i + 3] = Math.floor(rnd() * 20);
      }
      g.putImageData(img, 0, 0);

      // 长纤维：真羊皮纸的辨识特征
      g.strokeStyle = 'rgba(150,120,80,.10)';
      for (let i = 0; i < 26; i++) {
        g.lineWidth = rnd() < 0.7 ? 0.6 : 1.3;
        g.beginPath();
        const y0 = rnd() * 256;
        g.moveTo(rnd() * 60, y0);
        g.bezierCurveTo(
          90 + rnd() * 40, y0 + rnd() * 30 - 15,
          170 + rnd() * 40, y0 + rnd() * 30 - 15,
          256, y0 + rnd() * 20 - 10
        );
        g.stroke();
      }
      return c;
    }

    /** 从 'rgba(r,g,b,a)' / '#RRGGBB' 里取出 "r,g,b" */
    _parseRGB(c) {
      const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(c);
      if (m) return m[1] + ',' + m[2] + ',' + m[3];
      const h = /^#([0-9a-f]{6})$/i.exec(c);
      if (h) {
        const v = h[1];
        return parseInt(v.slice(0, 2), 16) + ',' +
               parseInt(v.slice(2, 4), 16) + ',' +
               parseInt(v.slice(4, 6), 16);
      }
      return '251,247,239';
    }

    /** 从 'rgba(...)' 里取 alpha，没有则视作 1 */
    _parseAlpha(c) {
      const m = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/.exec(c);
      return m ? parseFloat(m[1]) : 1;
    }

    /** 圆角矩形路径（移植自 scenes.js roundRect） */
    _roundRect(ctx, x, y, w, h, r) {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    }

    /* ---------- 音频 ---------- */

    preload(map) {
      Object.keys(map).forEach((k) => {
        if (this.clips.has(k)) return;
        const a = new Audio();
        a.src = map[k];
        a.preload = 'auto';
        a.volume = 1;
        this.clips.set(k, a);
      });
    }

    /** 播一条配音。返回 Promise（播完 resolve），可用 stopAudio 打断。 */
    play(id, opt) {
      const o = opt || {};
      if (this.muted || this.fast) return Promise.resolve();
      const base = this.clips.get(id);
      const el = base ? base.cloneNode() : new Audio(o.src);
      if (!base && o.src) el.src = o.src;
      el.volume = o.volume === undefined ? 1 : o.volume;
      this.nowAudio = el;
      const done = new Promise((res) => {
        el.addEventListener('ended', res, { once: true });
        el.addEventListener('error', res, { once: true });
        setTimeout(res, ((o.maxMs || 30000)));
      });
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
      return done;
    }

    /** 播一条**背景音**（环境音 / 音效），走独立轨道，**不碰 nowAudio**。
        对白仍走 play()，两者可同时响 —— 之前只有一个 nowAudio，
        环境音一播就把正在说的台词顶掉，所以必须拆轨。
        opt.volume 目标音量（默认 0.2）；opt.fadeMs 淡入（默认 600，0=不淡）；
        opt.maxMs 到时自动淡出（防止跨拍残留）。 */
    bg(id, opt) {
      const o = opt || {};
      if (this.muted || this.fast) return;
      this.bgStop(0);                       // 立即掐掉上一条，避免两条环境音叠
      const base = this.clips.get(id);
      const el = base ? base.cloneNode() : new Audio();
      if (!base) {
        /* 音效不预加载（13 个素材共 15.6MB，全量 preload 会让页面挂不起来），
           这里按需取 src：优先 opt.src，否则回查 STAGE_PATHS.AUDIO。 */
        const src = o.src ||
          (typeof window !== 'undefined' && window.STAGE_PATHS &&
           window.STAGE_PATHS.AUDIO && window.STAGE_PATHS.AUDIO[id]);
        if (src) { el.src = src; el.preload = 'auto'; }
      }
      if (o.loop) el.loop = true;
      const target = o.volume === undefined ? 0.2 : o.volume;
      const fade = o.fadeMs === undefined ? 600 : o.fadeMs;
      el.volume = fade > 0 ? 0 : target;
      this.bgAudio = el;
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
      if (fade > 0) {
        const t0 = Date.now();
        const step = () => {
          if (this.bgAudio !== el) return;
          const k = Math.min(1, (Date.now() - t0) / fade);
          try { el.volume = target * k; } catch (e) { return; }
          if (k < 1) requestAnimationFrame(step);
        };
        step();
      }
      if (o.maxMs) {
        /* outMs：渐出时长（默认 400）。拉长渐出时要注意别超出本拍 ——
           超出的话会被下一拍的 bg() 或 bump() 直接掐掉，渐出等于没生效。 */
        const outMs = o.outMs === undefined ? 400 : o.outMs;
        setTimeout(() => { if (this.bgAudio === el) this.bgStop(outMs); }, o.maxMs);
      }
    }

    /** 停背景音；ms>0 淡出（默认 500ms），0 立即停 */
    bgStop(ms) {
      const el = this.bgAudio;
      if (!el) return;
      this.bgAudio = null;
      const fade = ms === undefined ? 500 : ms;
      if (fade <= 0) { try { el.pause(); } catch (e) { /* ignore */ } return; }
      const v0 = el.volume, t0 = Date.now();
      const step = () => {
        const k = Math.min(1, (Date.now() - t0) / fade);
        try { el.volume = v0 * (1 - k); } catch (e) { return; }
        if (k < 1) requestAnimationFrame(step);
        else { try { el.pause(); } catch (e) { /* ignore */ } }
      };
      step();
    }

    stopAudio() {
      if (this.nowAudio) {
        try { this.nowAudio.pause(); } catch (e) { /* ignore */ }
        this.nowAudio = null;
      }
      /* ⚠ 背景音轨 bgAudio **不在这里清** —— stopAudio() 被 bump() 每拍调用，
         清掉引用会让 bgStop/淡出定时器全部失效（元素还在响，却再也管不到它）。
         背景音的生命周期只由 S.bg()/S.bgStop() 和 seek()/finish() 管。 */
    }

    /* ---------- 跳拍守卫 ---------- */

    bump() {
      this.gen++;
      this.stopAudio();
      /* ⚠ 这里**不能** bgStop —— playBeat() 每换一拍都会调 bump()，
         停了它，跨拍的背景音（S01 黄昏播满整幕）一进下一拍就没声了。
         跳拍清场由 seek() / finish() 自己调 S.bgStop(0)。 */
      return this.gen;
    }

    get token() { return this.gen; }

    /** 可中断的等待。fast 模式下立即返回（用于快速重建历史状态）。 */
    wait(ms, tok) {
      if (this.fast) {
        return tok === this.gen ? Promise.resolve() : Promise.reject(new Error('stale'));
      }
      return sleep(ms).then(() => {
        if (tok !== this.gen) throw new Error('stale');
      });
    }

    /* ---------- 全屏 ---------- */

    fullscreen(on) {
      const el = this.wrap;
      if (on) {
        if (el.requestFullscreen) el.requestFullscreen();
      } else if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }

  /* ------------------------------ 样式注入 -------------------------------- */

  const CSS = `
@keyframes jy {
  0%   { transform: translateY(0); }
  33%  { transform: translateY(calc(var(--amp) * -1)); }
  66%  { transform: translateY(calc(var(--amp) * .35)); }
  100% { transform: translateY(0); }
}
@keyframes jx {
  0%   { transform: translateX(0); }
  25%  { transform: translateX(var(--amp)); }
  50%  { transform: translateX(0); }
  75%  { transform: translateX(calc(var(--amp) * -1)); }
  100% { transform: translateX(0); }
}
/* 说话抖动：上下 + 左右混合，频率高、幅度小，肉眼一眼看出「他在讲话」 */
@keyframes shake {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(calc(var(--amp) * .35), calc(var(--amp) * -1)); }
  50%  { transform: translate(calc(var(--amp) * -.3), calc(var(--amp) * .4)); }
  75%  { transform: translate(calc(var(--amp) * .2), calc(var(--amp) * -.6)); }
  100% { transform: translate(0, 0); }
}
.stage-root img { image-rendering: auto; }
/* 幕布呼吸：极小的斜切 + 横向拉伸，让褥面不是死图
   （来源 Tempest 的 curtainSway 关键帧） */
@keyframes curtainSway {
  0%   { transform: skewX(-0.5deg)  scaleX(1.010); }
  100% { transform: skewX( 0.55deg) scaleX(1.015); }
}
`;

  function injectCSS() {
    if (document.getElementById('stage-v3-css')) return;
    const s = document.createElement('style');
    s.id = 'stage-v3-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ------------------------------ 导出 ---------------------------------- */

  const Stage = new StageEngine();
  Stage.W = W;
  Stage.H = H;
  Stage.Z = Z;
  Stage.EASE = EASE;
  Stage.injectCSS = injectCSS;

  global.Stage = Stage;

  if (typeof module !== 'undefined' && module.exports) module.exports = Stage;
})(typeof window !== 'undefined' ? window : globalThis);
