/**
 * 木偶戏舞台 v2 —— 点击驱动
 *
 * ═══ 与 v1 的根本区别 ═══
 *
 * v1 是「自主播放 68 秒」：台词按自己的节奏走，舞台按自己的节奏演，
 * 两者对不上，观众看到画面和话不匹配。
 *
 * v2 改成 **点击驱动**：每一句台词对应一个「镜头」，用户点一下推进一句，
 * 舞台同步切到那个镜头。画面跟着话走，而不是各演各的。
 *
 * 唯一例外是**月亮**：它一直在缓慢横移（表示时间流逝），不随点击跳变。
 *
 * ═══ 视觉规则（用户指定）═══
 *   · 绳子不要圈，直接吊着物体
 *   · 入场时月亮已经在画面里
 *   · 绳子拉着马车从右侧进场，带轻微上下摆动
 *   · 马车到位后，绳子渐隐
 *   · 特写时绳子消失
 *   · 结尾绳子回来，拉着马车离开
 */

const ASSET_DIR = './assets/stage/';

/**
 * 素材版本号 —— 必须带上，否则浏览器会继续用缓存里的旧图。
 *
 * 为什么需要它：本次绳素材「同名但内容变了」（去掉了底部的绳圈），
 * 浏览器按 URL 缓存，URL 不变就一直拿旧图 —— 表现是「改了却没生效」，
 * 我在这上面栽过一次。
 * 以后只要换素材内容，就把这个数字加一。
 */
const ASSET_VER = 3;

/** 给素材 URL 拼上版本号 */
const assetUrl = (file) => ASSET_DIR + file + '?v=' + ASSET_VER;

const ART = {
  bg: { file: 'bg.webp', w: 1920, h: 1080 },
  moon: { file: 'moon.webp', w: 512, h: 512 },
  glow: { file: 'moon_glow.webp', w: 512, h: 512 },
  cart: { file: 'cart.webp', w: 900, h: 1350 },
  face: { file: 'holo_face.webp', w: 640, h: 640 },
  ropeThick: { file: 'rope_thick.webp', w: 200, h: 800 },
  ropeThin: { file: 'rope_thin.webp', w: 200, h: 1008 },
};

/** 马车进/出场时长（秒）。正常 2 秒；玩家点击催一下 → 1 秒走完 */
const CART_MOVE_SEC = 2;
const CART_RUSH_SEC = 1;

/** 舞台坐标一律用「舞台宽/高的百分比」 */
const POSE = {
  moonX: 26,          // 月亮中心 x
  moonY: 24,          // 月亮中心 y
  moonW: 13,          // 月亮直径（占舞台宽）

  cartX: 52,          // 马车中心 x
  cartBottomY: 84,    // 马车底边 y

  faceX: 56,          // 特写中心 x
  faceH: 74,          // 特写高度（占舞台高）

  // 月亮横移：从左缓慢飘到右，表示时间流逝
  moonDriftFrom: 22,
  moonDriftTo: 38,
  moonDriftSec: 150,  // 150 秒走完，够慢
};

const ROPE_W = 9;     // 绳宽（占舞台宽 %）

/* ─────────────────────────────────────────────
   工具
   ───────────────────────────────────────────── */

const easeOut = (p) => 1 - Math.pow(1 - p, 3);
const easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export function createStage(rootEl, opts = {}) {
  if (!rootEl) throw new TypeError('[stage] 需要容器元素');
  const { onReady, onError } = opts;

  const state = {
    dead: false,
    ready: false,
    raf: 0,
    last: 0,
    t0: 0,
    visible: false,
    moonDrift: 0,      // 月亮横移的额外偏移（秒）
    cartSwayPhase: 0,

    /* 马车入场进度：0 = 完全在场外（右侧），1 = 停在舞台上。
       初始必须为 0 —— 否则开场马车会「停在画面中央」再滑出去。 */
    cartProg: 0,
    cartProgTarget: 0,
    cartRush: false,   // 本次移动是否被点击催快
    clickRush: false,  // 标记「这次切镜是玩家点出来的」

    ropesVisible: { thick: false, thin: false },
    cartVisible: false,
    faceVisible: false,
    dim: 0,
  };

  const dom = {};
  const img = {};

  const el = (tag, style) => {
    const n = document.createElement(tag);
    if (style) Object.assign(n.style, style);
    return n;
  };

  /* ─────────────────────────────────────────────
     建立 DOM
     ───────────────────────────────────────────── */

  function build() {
    // 容器本身要 relative，绝对定位的子元素才有参照
    const prevPos = rootEl.style.position;
    if (!prevPos || prevPos === 'static') rootEl.style.position = 'relative';
    rootEl.style.overflow = 'hidden';

    const host = el('div', {
      position: 'absolute', inset: '0',
      opacity: '0', transition: 'opacity 500ms ease',
      pointerEvents: 'none',
    });
    dom.host = host;

    /* 背景 */
    const bg = el('img', {
      position: 'absolute', left: '0', top: '0',
      width: '100%', height: '100%', objectFit: 'cover',
    });
    bg.src = assetUrl(ART.bg.file);
    bg.alt = '';
    img.bg = bg;
    host.appendChild(bg);

    /* 两根绳 —— 注意层序：绳子在月亮与马车**之前** append，
       所以 z-index 更低，会被物体挡住。
       这正是要的效果：绳子像从物体背后吊下来，连接处藏在物体后面，
       比「绳子压在物体上面」自然得多。 */
    for (const which of ['thick', 'thin']) {
      const box = el('div', {
        position: 'absolute', left: '0', top: '0',
        width: '1%', height: '1%',
        transformOrigin: '50% 100%',
        willChange: 'transform',
        opacity: '0', transition: 'opacity 500ms ease',
      });
      const r = el('img', {
        position: 'absolute', left: '0', top: '0',
        width: '100%', height: '100%',
      });
      r.src = assetUrl(which === 'thick' ? ART.ropeThick.file : ART.ropeThin.file);
      r.alt = '';
      box.appendChild(r);
      host.appendChild(box);          // ← 在月亮/马车之前，所以在下层
      dom['rope_' + which] = box;
      img['rope_' + which] = r;
    }

    /* 月亮（含光晕）—— 在绳子之上 */
    const moonBox = el('div', {
      position: 'absolute', left: '0', top: '0',
      width: '1%', height: '1%',
      transformOrigin: '50% 50%',
      willChange: 'transform',
    });
    dom.moonBox = moonBox;

    const glow = el('img', {
      position: 'absolute', left: '-45%', top: '-45%',
      width: '190%', height: '190%',
      opacity: '0.55', pointerEvents: 'none',
    });
    glow.src = assetUrl(ART.glow.file);
    glow.alt = '';
    img.glow = glow;
    moonBox.appendChild(glow);

    const moon = el('img', {
      position: 'absolute', left: '0', top: '0',
      width: '100%', height: '100%',
    });
    moon.src = assetUrl(ART.moon.file);
    moon.alt = '';
    img.moon = moon;
    moonBox.appendChild(moon);

    host.appendChild(moonBox);

    /* 马车 —— 在绳子之上 */
    const cartBox = el('div', {
      position: 'absolute', left: '0', top: '0',
      width: '1%', height: '1%',
      transformOrigin: '50% 100%',
      willChange: 'transform',
      opacity: '0', transition: 'opacity 600ms ease',
    });
    dom.cartBox = cartBox;

    const cart = el('img', {
      position: 'absolute', left: '0', top: '0',
      width: '100%', height: '100%',
    });
    cart.src = assetUrl(ART.cart.file);
    cart.alt = '';
    img.cart = cart;
    cartBox.appendChild(cart);
    host.appendChild(cartBox);

    /* 压暗层（特写时压住背景） */
    const dim = el('div', {
      position: 'absolute', inset: '0',
      background: '#050403', opacity: '0',
      transition: 'opacity 700ms ease',
      pointerEvents: 'none',
    });
    dom.dim = dim;
    host.appendChild(dim);

    /* 特写 */
    const faceBox = el('div', {
      position: 'absolute', left: '0', top: '0',
      width: '1%', height: '1%',
      transformOrigin: '50% 50%',
      opacity: '0', transition: 'opacity 600ms ease',
      pointerEvents: 'none',
    });
    const face = el('img', {
      position: 'absolute', left: '0', top: '0',
      width: '100%', height: '100%',
    });
    face.src = assetUrl(ART.face.file);
    face.alt = '';
    faceBox.appendChild(face);
    dom.faceBox = faceBox;
    img.face = face;
    host.appendChild(faceBox);

    /* 标题 */
    const title = el('div', {
      position: 'absolute', left: '4%', top: '6%',
      font: '600 15px/1.5 "Microsoft YaHei", system-ui, sans-serif',
      letterSpacing: '0.22em',
      color: '#e8d4a8',
      textShadow: '0 2px 12px rgba(0,0,0,.85)',
      opacity: '0', transition: 'opacity 900ms ease',
      pointerEvents: 'none',
    });
    title.textContent = '第一章 · 初次相遇';
    dom.title = title;
    host.appendChild(title);

    rootEl.appendChild(host);

    layout();
  }

  /** 按舞台尺寸算一次所有静态位置 */
  function layout() {
    const rect = rootEl.getBoundingClientRect();
    const W = rect.width || 960;
    const H = rect.height || 540;
    state.W = W;
    state.H = H;
    // 宽百分比 → 像素；高百分比 → 像素
    state.px = (pctW) => W * pctW / 100;
    state.py = (pctH) => H * pctH / 100;

    // 月亮盒子：宽 = moonW% 舞台宽，高按图比例（1:1）
    const mw = W * POSE.moonW / 100;
    dom.moonBox.style.width = mw + 'px';
    dom.moonBox.style.height = mw + 'px';

    // 马车：宽 22% 舞台宽
    const cw = W * 22 / 100;
    const ch = cw * (ART.cart.h / ART.cart.w);
    dom.cartBox.style.width = cw + 'px';
    dom.cartBox.style.height = ch + 'px';
    state.cartW = cw;
    state.cartH = ch;

    // 绳：宽固定
    const rw = W * ROPE_W / 100;
    for (const which of ['thick', 'thin']) {
      const art = which === 'thick' ? ART.ropeThick : ART.ropeThin;
      const rh = rw * (art.h / art.w);
      dom['rope_' + which].style.width = rw + 'px';
      dom['rope_' + which].style.height = rh + 'px';
      state['ropeH_' + which] = rh;
      state['ropeW_' + which] = rw;
    }

    // 特写：高 = faceH% 舞台高，宽按比例
    const fh = H * POSE.faceH / 100;
    const fw = fh * (ART.face.w / ART.face.h);
    dom.faceBox.style.width = fw + 'px';
    dom.faceBox.style.height = fh + 'px';

    // 应用当前镜头（尺寸变了要重算位置）
    if (state.shot !== undefined) applyShot(state.shot, true);
  }

  /* ─────────────────────────────────────────────
     镜头：每个镜头 = 一组「目标状态」
     点击推进 = 切到下一个镜头的目标状态
     ───────────────────────────────────────────── */

  /**
   * 镜头表。每一镜描述「舞台应该是什么样」，
   * 不是「播放什么动画」—— 这样点击推进才能瞬间到位。
   *
   * ★ 马车不挂绳子（用户明确要求）：
   *   马车自己从右侧驶入、停留、再驶出，不用绳子吊。
   *   所以 thickRope 全部为 0；粗绳素材留着不用，将来要加别的吊挂物再说。
   *
   * ★ 月亮挂细绳（用户要求「月亮后面也要有绳子拉住」）：
   *   moonRope 在镜头 0~7、11 为 1，特写（8~10）时消失。
   *
   * ★ 大部分叙事发生在马车停留期（镜头 6~7）。
   */
  const SHOTS = [
    // 0 · 开场：月亮已在 + 细绳吊着它
    { moon: 1, moonDrift: 0, moonRope: 1, thickRope: 0, cart: 0, face: 0, dim: 0, title: 1 },

    // 1 · 村子与麦田
    { moon: 1, moonDrift: 14, moonRope: 1, thickRope: 0, cart: 0, face: 0, dim: 0, title: 1 },

    // 2 · 祭典 / 神
    { moon: 1, moonDrift: 30, moonRope: 1, thickRope: 0, cart: 0, face: 0, dim: 0, title: 0 },

    // 3 · 时代变了
    { moon: 1, moonDrift: 46, moonRope: 1, thickRope: 0, cart: 0, face: 0, dim: 0, title: 0 },

    // 4 · 最后一束麦 —— 马车还没出现，台上只有月亮
    { moon: 1, moonDrift: 60, moonRope: 1, thickRope: 0, cart: 0, face: 0, dim: 0, title: 0 },

    // 5 · 马车自己从右侧驶入（无绳）
    { moon: 1, moonDrift: 74, moonRope: 1, thickRope: 0, cart: 1, cartFromRight: true, face: 0, dim: 0, title: 0 },

    // 6 · 马车停留（叙事主战场）
    { moon: 1, moonDrift: 88, moonRope: 1, thickRope: 0, cart: 1, face: 0, dim: 0, title: 0 },

    // 7 · 马车停留 + 车身下沉一点
    { moon: 1, moonDrift: 102, moonRope: 1, thickRope: 0, cart: 1, cartSink: true, face: 0, dim: 0.10, title: 0 },

    // 8 · 特写：绳子全消失
    { moon: 1, moonDrift: 116, moonRope: 0, thickRope: 0, cart: 0.35, face: 1, dim: 0.45, title: 0 },

    // 9 · 掀开（月亮爆亮，特写）
    { moon: 1.15, moonDrift: 130, moonRope: 0, thickRope: 0, cart: 0.35, face: 1, dim: 0.3, title: 0 },

    // 10 · 报名字（特写）
    { moon: 1, moonDrift: 144, moonRope: 0, thickRope: 0, cart: 0.35, face: 1, dim: 0.45, title: 0 },

    // 11 · 收尾：特写退去，马车自己驶出舞台（无绳）
    { moon: 1, moonDrift: 158, moonRope: 1, thickRope: 0, cart: 1, cartExit: true, face: 0, dim: 0, title: 0 },
  ];

  /**
   * 把某一镜的目标状态应用到 DOM。
   * @param {number} i 镜头序号
   * @param {boolean} instant 是否跳过过渡（尺寸变化时用）
   */
  function applyShot(i, instant = false) {
    if (!state.ready) { state.shot = i; return; }
    const s = SHOTS[Math.max(0, Math.min(SHOTS.length - 1, i))];
    state.shot = i;
    const W = state.W, H = state.H;
    const tr = instant ? 'none' : '';

    // ── 月亮：位置由「固定位置 + 缓慢横移」共同决定 ──
    // 横移本身在主循环里做，这里只设「基准 + 目标偏移」
    state.moonDriftTarget = s.moonDrift || 0;
    state.moonScale = s.moon || 1;

    // ── 绳子 ──
    // thickRope = 吊马车的粗绳；moonRope = 吊月亮的细绳（用户要求月亮也要有绳子拉住）
    const thickOn = (s.thickRope || 0) > 0;
    const thinOn = (s.moonRope || 0) > 0;
    if (dom.rope_thick) {
      dom.rope_thick.style.transition = instant ? 'none' : 'opacity 600ms ease';
      dom.rope_thick.style.opacity = thickOn ? '1' : '0';
    }
    if (dom.rope_thin) {
      dom.rope_thin.style.transition = instant ? 'none' : 'opacity 600ms ease';
      dom.rope_thin.style.opacity = thinOn ? '1' : '0';
    }

    // ── 马车 ──
    // 骑马车的出场：不在画面里时把透明度压掉，但**位置一律在场外**（见 tick）
    if (dom.cartBox) {
      dom.cartBox.style.transition = instant ? 'none' : 'opacity 600ms ease';
      dom.cartBox.style.opacity = (s.cart > 0) ? String(s.cart) : '0';
    }

    /* 马车入/出场的**进度目标**（0=场外，1=到位）
     *
     * 关键：不在场的镜（cart=0）一律把目标设成 0 ——
     * 这样马车从一开始就待在场外，不会出现「停在中央再滑出去」。
     */
    {
      const wantIn = (s.cart > 0) && !s.cartExit;   // 该在画面里
      const wantProg = wantIn ? 1 : 0;

      // 原来就在同一目标 → 不动，也不用加速
      if (wantProg !== state.cartProgTarget) {
        // 玩家在这次「新指令」前如果有一次点击推进，就算加速
        state.cartProgTarget = wantProg;
        state.cartRush = !!state.clickRush;
      } else if (instant) {
        // 尺寸变化等需要瞬间对齐的情况，直接到位
        state.cartProg = wantProg;
      }
    }
    state.cartSink = !!s.cartSink;

    // ── 特写 ──
    if (dom.faceBox) {
      dom.faceBox.style.transition = instant ? 'none' : 'opacity 700ms ease';
      dom.faceBox.style.opacity = s.face ? '1' : '0';
    }

    // ── 压暗 ──
    if (dom.dim) {
      dom.dim.style.transition = instant ? 'none' : 'opacity 800ms ease';
      dom.dim.style.opacity = String(s.dim || 0);
    }

    // ── 标题 ──
    if (dom.title) {
      dom.title.style.transition = instant ? 'none' : 'opacity 900ms ease';
      dom.title.style.opacity = s.title ? '1' : '0';
    }

    // 绳子的位置随物体走：每帧在 tick 里算
  }

  /* ─────────────────────────────────────────────
     主循环
     ───────────────────────────────────────────── */

  function tick(now) {
    if (state.dead) return;
    state.raf = requestAnimationFrame(tick);
    if (!state.ready) return;

    const dt = Math.min((now - state.last) / 1000 || 0, 0.1);
    state.last = now;
    state.t += dt;

    if (!state.visible) return;

    const W = state.W, H = state.H;

    /* ── 月亮：缓慢横移（时间流逝）── */
    // 漂移是连续的，不随镜头跳变；镜头只决定「起始偏移」
    if (state.moonDriftTarget !== undefined) {
      // 平滑逼近目标偏移，避免点快了月亮瞬移
      state.moonDrift += (state.moonDriftTarget - state.moonDrift) * Math.min(1, dt * 2.2);
    }
    // 在漂移基础上再叠一个极慢的连续位移（真正的「时间流逝」感）
    const slow = (state.t / POSE.moonDriftSec) * (POSE.moonDriftTo - POSE.moonDriftFrom);
    const moonPctX = POSE.moonX + state.moonDrift * 0.16 + slow;

    const mw = W * POSE.moonW / 100 * (state.moonScale || 1);
    // 月亮盒子尺寸要随 moonScale 变（掀开时放大）
    if (dom.moonBox) {
      dom.moonBox.style.width = mw + 'px';
      dom.moonBox.style.height = mw + 'px';
      const mx = W * moonPctX / 100 - mw / 2;
      const my = H * POSE.moonY / 100 - mw / 2;
      dom.moonBox.style.transform = `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0)`;
    }

    /* ── 马车：入场 / 出场 + 上下摆动 ──
     *
     * ★ 用车入场进度 `cartProg` 而不是「偏移量」：
     *   偏移量那种写法有个坑 —— 初始值是 0，而 0 代表画面正中，
     *   于是开场时马车虽然透明但已经「停在中央」，
     *   下一镜让它滑出去时，观众就会看到马车从中间往外跑。
     *
     *   改成 0 = 完全在场外（右侧），1 = 到位。
     *   开场就明确置 0，所以马车从一开始就在场外待机。
     *
     * ★ 时长：整段进出 2 秒；玩家点击可以催快，1 秒走完。
     */
    if (dom.cartBox && state.cartW) {
      const target = (state.cartProgTarget === undefined) ? 0 : state.cartProgTarget;

      // 基础速度：2 秒走完全程
      let speed = 1 / CART_MOVE_SEC;
      // 用户要求「点击一下加快到 1s」——如果在移动中又有新指令，
      // 就按加速时长走，让玩家感觉「点一下把它催进场」
      if (state.cartRush) speed = 1 / CART_RUSH_SEC;

      const step = speed * dt;
      const d = target - state.cartProg;
      if (Math.abs(d) <= step) state.cartProg = target;
      else state.cartProg += Math.sign(d) * step;

      // 到位/离场后清掉加速标记
      if (state.cartProg === target) state.cartRush = false;

      // 入场进度 → 水平位移：0 时整台车在右边界外，1 时到 POSE.cartX
      const offscreen = 100 - POSE.cartX + (state.cartW / W) * 100 * 0.6;
      const pctX = POSE.cartX + (1 - state.cartProg) * offscreen;

      // 上下摆动：吊着的东西会轻轻晃（无绳也一样，像车轮碾过地面）
      state.cartSwayPhase += dt;
      const sway = Math.sin(state.cartSwayPhase * (Math.PI * 2 / 3.2)) * 2.4;
      const sink = state.cartSink ? 10 : 0;

      const cx = W * pctX / 100 - state.cartW / 2;
      const cy = H * POSE.cartBottomY / 100 - state.cartH + sway + sink;
      dom.cartBox.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
    }

    /* ── 细绳吊月亮 ──
     *
     * 用户要求「月亮后面也要有绳子拉住」，所以月亮挂细绳。
     * 层序：绳子在月亮**之下**，所以绳底要往月亮内部多伸一点（overlap），
     * 让接缝藏在月亮后面，而不是露出断口。
     *
     * 马车不挂绳（用户明确要求），所以这里只有月亮这一根。
     */
    if (dom.rope_thin) {
      const rw = state.ropeW_thin, rh = state.ropeH_thin;
      const mw = W * POSE.moonW / 100 * (state.moonScale || 1);
      const slow = (state.t / POSE.moonDriftSec) * (POSE.moonDriftTo - POSE.moonDriftFrom);
      const moonPctX = POSE.moonX + state.moonDrift * 0.16 + slow;
      const moonTopPx = H * POSE.moonY / 100 - mw / 2;
      const moonCxPx = W * moonPctX / 100;
      // 往月亮内部伸 8%，接缝藏到月亮后面
      const overlap = mw * 0.08;
      const rx = moonCxPx - rw / 2;
      const ry = moonTopPx - rh + overlap;
      dom.rope_thin.style.transform =
        `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
    }

    /* ── 特写：居中偏右 ── */
    if (dom.faceBox) {
      const fw = parseFloat(dom.faceBox.style.width) || 0;
      const fh = parseFloat(dom.faceBox.style.height) || 0;
      const fx = W * POSE.faceX / 100 - fw / 2;
      const fy = H * 0.5 - fh / 2;
      dom.faceBox.style.transform = `translate3d(${fx.toFixed(2)}px, ${fy.toFixed(2)}px, 0)`;
    }
  }

  /* ─────────────────────────────────────────────
     加载
     ───────────────────────────────────────────── */

  function loadAll() {
    const list = [
      img.bg, img.moon, img.glow, img.cart, img.face,
      img.rope_thick, img.rope_thin,
    ].filter(Boolean);
    return Promise.all(list.map((n) => new Promise((res) => {
      if (n.complete && n.naturalWidth > 0) return res(true);
      n.onload = () => res(true);
      n.onerror = () => { console.warn('[stage] 图加载失败:', n.src); res(false); };
    })));
  }

  const api = {
    ready: null,

    /** 显示 / 隐藏 */
    show(on = true) {
      state.visible = !!on;
      if (dom.host) dom.host.style.opacity = on ? '1' : '0';
      return api;
    },
    hide() { return api.show(false); },

    /** 跳到某一镜（点击推进用） */
    /**
     * 跳到某一镜。
     * @param {number} i 镜头号
     * @param {boolean} byClick 是否是玩家点击推进的 ——
     *        是的话，正在进行的马车进/出场会改成 1 秒走完（催快）
     */
    gotoShot(i, byClick = false) {
      state.clickRush = !!byClick;
      applyShot(i);
      state.clickRush = false;      // 用完即清，避免影响下一次
      return api;
    },

    /** 当前镜头号 */
    get shot() { return state.shot; },

    /** 镜头总数 */
    get shotCount() { return SHOTS.length; },

    dispose() {
      state.dead = true;
      if (state.raf) cancelAnimationFrame(state.raf);
      if (dom.host && dom.host.parentNode) dom.host.parentNode.removeChild(dom.host);
      if (state.restorePos !== null) rootEl.style.position = state.restorePos;
    },

    dev: { get state() { return state; }, get dom() { return dom; }, POSE, SHOTS },
  };

  api.ready = (async () => {
    try {
      build();
      await loadAll();
      state.ready = true;
      state.last = performance.now();
      state.t = 0;
      state.raf = requestAnimationFrame(tick);
      if (onReady) onReady();
    } catch (e) {
      console.warn('[stage] 初始化失败:', e);
      if (onError) onError(e);
    }
  })();

  // 窗口尺寸变化要重算
  window.addEventListener('resize', () => {
    if (state.ready) layout();
  });

  return api;
}