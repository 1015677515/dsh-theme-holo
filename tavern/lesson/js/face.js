/**
 * 程序化脸部叠加层。
 *
 * 这套模型没有 blendShape，脸和眼睛都是贴图上画死的，所以嘴型/腮红只能
 * 用一层贴在脸前的半透明面片覆盖绘制。眉毛有独立骨骼（Face_Brow_*），
 * 用位移 + 倾斜来驱动，是真正的几何变化。
 *
 * 画布坐标以 (0,0) 为中心，绘制前统一放大 SCALE 倍。
 * 画布 256x192 对应叠加面片 0.072x0.054（等比），1 画布单位 ≈ 0.549mm。
 */

/* 嘴的配色，跟着原画的暖粉色走，不要画成鲜红 */
const LIP = '#b8665f';
const LIP_DEEP = '#a85450';
const LIP_IN = '#a03a3a';
const TONGUE = '#cf7a72';
const TOOTH = '#efe4d4';
const TOOTH_SHADE = 'rgba(150,110,90,.32)';

const SCALE = 1.95;

/**
 * 线宽系数。
 * 叠加层是按 3D 脸的比例缩放的，原来的 2.6~3.0 落到屏幕上就成了一根马克笔，
 * 和原画那种细细的唇线不搭，统一收细。
 */
const LW = 0.68;

/**
 * 横向拉宽、纵向压扁。
 * 模型自带的唇线是一条又宽又浅的弧，叠加层按原始比例画出来会窄一圈，
 * 上下并排看就像嘴里还有第二条线。拉宽到能盖住它、压扁到和它的弧度一致。
 */
const KX = 1.60;
const KY = 0.86;

function ctx2d(w, h) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const g = cv.getContext('2d');
  g.translate(w / 2, h / 2);
  g.scale(SCALE * KX, SCALE * KY);
  return g;
}

/* 张开的嘴：上缘走上唇线、下缘走下唇线，围成一块口 */
function mouthShape(g, w, topY, topMid, botY) {
  g.beginPath();
  g.moveTo(-w, topY);
  g.quadraticCurveTo(0, topMid, w, topY);
  g.quadraticCurveTo(0, botY, -w, topY);
  g.closePath();
}

/* 上排牙齿：贴着上唇内侧的一条，被口型裁掉外溢部分 */
function upperTeeth(g, w, topY, topMid, depth) {
  g.beginPath();
  g.moveTo(-w - 2, topY - 2);
  g.quadraticCurveTo(0, topMid - 4, w + 2, topY - 2);
  g.lineTo(w + 2, topY + depth * 0.42);
  g.quadraticCurveTo(0, topMid + depth, -w - 2, topY + depth * 0.42);
  g.closePath();
  // 牙不是一块白板：上缘受光、下缘落进阴影里，才有"含在嘴里"的感觉
  const tg = g.createLinearGradient(0, topMid - 2, 0, topMid + depth);
  tg.addColorStop(0, TOOTH);
  tg.addColorStop(0.55, '#e5d8c4');
  tg.addColorStop(1, '#c9b49b');
  g.fillStyle = tg;
  g.fill();
  // 齿缝
  g.strokeStyle = TOOTH_SHADE;
  g.lineWidth = 0.85 * LW;
  for (let x = -w + 4; x <= w - 4; x += 6) {
    g.beginPath();
    g.moveTo(x, topY - 2.5);
    g.lineTo(x, topY + depth * 0.5);
    g.stroke();
  }
}

/**
 * 画一张嘴。
 * @param {string} kind
 *   neutral | talk | eat | serious | sad | surprise |
 *   smile | smirk               —— 原有
 *   soft | warm | beam | grin | laugh | giggle | smug   —— 开心系
 * @param {number} open  张嘴程度 0..1（talk 用）
 */
export function mouthCanvas(kind = 'neutral', open = 0.35) {
  const g = ctx2d(256, 192);
  g.lineJoin = 'round';
  g.lineCap = 'round';

  const stroke = (w = 4) => {
    g.strokeStyle = LIP_DEEP;
    g.lineWidth = w * LW;
  };
  /* 嘴角那道往回收的小勾 */
  const corner = (x, from, to, s) => {
    g.beginPath();
    g.moveTo(x * s, from);
    g.quadraticCurveTo((x + 2.2) * s, (from + to) / 2, (x + 1.4) * s, to);
    g.lineWidth = 2.0 * LW;
    g.strokeStyle = LIP;
    g.stroke();
  };

  if (kind === 'talk') {
    // 说话：上下唇张开的椭圆，内部暗红，随时间做宽窄变化
    const o = Math.max(0.12, Math.min(1, open));
    const rw = 22 + 4 * o;
    const rh = 4 + 13 * o;
    g.beginPath();
    g.moveTo(-rw, -1);
    g.bezierCurveTo(-rw * 0.7, -rh * 1.15, rw * 0.7, -rh * 1.15, rw, -1);
    g.bezierCurveTo(rw * 0.62, rh * 1.3, -rw * 0.62, rh * 1.3, -rw, -1);
    const gr = g.createLinearGradient(0, -rh, 0, rh);
    gr.addColorStop(0, LIP_DEEP);
    gr.addColorStop(0.55, LIP_IN);
    gr.addColorStop(1, TONGUE);
    g.fillStyle = gr;
    g.fill();
    stroke(2.2);
    g.stroke();
    return g.canvas;
  }

  if (kind === 'smile') {
    // 笑：弧线更弯，两端带一点点往上收的唇角
    g.beginPath();
    g.moveTo(-24, -2);
    g.quadraticCurveTo(0, 13, 24, -2);
    stroke(3.1);
    g.stroke();
    for (const sx of [-1, 1]) {
      g.beginPath();
      g.moveTo(24 * sx, -2);
      g.quadraticCurveTo(28 * sx, -4.5, 27 * sx, -7);
      g.lineWidth = 2 * LW;
      g.stroke();
    }
    return g.canvas;
  }

  if (kind === 'smirk') {
    // 坏笑：只有一边翘起来
    g.beginPath();
    g.moveTo(-22, 3);
    g.quadraticCurveTo(2, 8, 25, -7);
    stroke(3.1);
    g.stroke();
    g.beginPath();
    g.moveTo(16, -3.5);
    g.quadraticCurveTo(22, -9, 26, -8);
    g.strokeStyle = LIP;
    g.lineWidth = 1.8 * LW;
    g.stroke();
    return g.canvas;
  }

  if (kind === 'surprise') {
    // 惊讶：小 O
    g.beginPath();
    g.ellipse(0, 1, 9, 12, 0, 0, Math.PI * 2);
    g.fillStyle = LIP_IN;
    g.fill();
    stroke(2.2);
    g.stroke();
    return g.canvas;
  }

  if (kind === 'serious') {
    // 抿嘴：一条略带下压的短线
    g.beginPath();
    g.moveTo(-22, 1);
    g.quadraticCurveTo(0, -3, 22, 1);
    stroke(2.6);
    g.stroke();
    return g.canvas;
  }

  if (kind === 'sad') {
    g.beginPath();
    g.moveTo(-20, 5);
    g.quadraticCurveTo(0, -7, 20, 5);
    stroke(2.6);
    g.stroke();
    return g.canvas;
  }

  if (kind === 'eat') {
    g.beginPath();
    g.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2);
    g.fillStyle = LIP_IN;
    g.fill();
    stroke(2.2);
    g.stroke();
    return g.canvas;
  }

  /* ══════════ 开心系 ══════════
   * 统一规矩：
   *  · 不画嘴角的小钩子 —— 缩到屏幕上会变成两根"胡须"
   *  · 嘴角靠路径端点本身抬高，弧线中段往下走
   *  · 张口的几款把上缘压平、下缘加深，读起来才有"开口"的体积
   */

  if (kind === 'soft') {
    // 浅笑：只有一点点弧度，嘴角轻轻提着
    g.beginPath();
    g.moveTo(-21, -2);
    g.quadraticCurveTo(0, 7.5, 21, -2);
    stroke(2.1);
    g.stroke();
    return g.canvas;
  }

  if (kind === 'warm') {
    // 暖笑：弧度明显、嘴角提得更高，最接近动画里那种"眼睛也弯了"的笑
    g.beginPath();
    g.moveTo(-24, -6.5);
    g.quadraticCurveTo(0, 14, 24, -6.5);
    stroke(2.3);
    g.stroke();
    return g.canvas;
  }

  if (kind === 'beam') {
    // 笑开：嘴微微张开，上排牙露一条
    const W = 21;
    mouthShape(g, W, -2.5, -5.5, 17);
    const gr = g.createLinearGradient(0, -5, 0, 10);
    gr.addColorStop(0, '#8f3a37');
    gr.addColorStop(1, TONGUE);
    g.fillStyle = gr;
    g.fill();
    g.save();
    g.clip();
    upperTeeth(g, W, -2.5, -5.5, 6.0);
    g.restore();
    g.beginPath();
    g.moveTo(-W, -2.5);
    g.quadraticCurveTo(0, -5, W, -2.5);
    stroke(1.9);
    g.stroke();
    g.beginPath();
    g.moveTo(-W, -2.5);
    g.quadraticCurveTo(0, 17, W, -2.5);
    stroke(1.5);
    g.stroke();
    return g.canvas;
  }

  if (kind === 'grin') {
    // 露齿笑：嘴角拉得更高，一窄条上牙，下面留暗
    const W = 23;
    mouthShape(g, W, -4, -8, 22);
    const gr = g.createLinearGradient(0, -7.5, 0, 15);
    gr.addColorStop(0, '#82302e');
    gr.addColorStop(0.6, LIP_IN);
    gr.addColorStop(1, '#b45c56');
    g.fillStyle = gr;
    g.fill();
    g.save();
    g.clip();
    upperTeeth(g, W, -4, -8, 8.2);
    g.restore();
    g.beginPath();
    g.moveTo(-W, -4);
    g.quadraticCurveTo(0, -7.5, W, -4);
    stroke(1.9);
    g.stroke();
    g.beginPath();
    g.moveTo(-W, -4);
    g.quadraticCurveTo(0, 22, W, -4);
    stroke(1.6);
    g.stroke();
    return g.canvas;
  }

  if (kind === 'laugh') {
    // 大笑：D 形张口，一整排牙 + 一点舌头
    const W = 23;
    mouthShape(g, W, -5, -9.5, 28);
    const gr = g.createLinearGradient(0, -9, 0, 20);
    gr.addColorStop(0, '#772626');
    gr.addColorStop(0.5, LIP_IN);
    gr.addColorStop(1, '#a94a46');
    g.fillStyle = gr;
    g.fill();
    g.save();
    g.clip();
    upperTeeth(g, W, -5, -9.5, 9.6);
    g.fillStyle = '#c4706a';
    g.beginPath();
    g.ellipse(0, 17, 14, 8, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = 'rgba(170,74,70,.4)';
    g.beginPath();
    g.ellipse(0, 12, 13, 3.6, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
    g.beginPath();
    g.moveTo(-W, -5);
    g.quadraticCurveTo(0, -9, W, -5);
    stroke(2.0);
    g.stroke();
    g.beginPath();
    g.moveTo(-W, -5);
    g.quadraticCurveTo(0, 28, W, -5);
    stroke(1.7);
    g.stroke();
    return g.canvas;
  }

  if (kind === 'giggle') {
    // 憋笑：一条被牙咬住的波浪线，两端往上吊
    g.beginPath();
    g.moveTo(-22, -4);
    g.bezierCurveTo(-14, 7, -5, 1, 0, 3.5);
    g.bezierCurveTo(5, 6, 14, 3.5, 22, -5);
    stroke(2.3);
    g.stroke();
    return g.canvas;
  }

  if (kind === 'smug') {
    // 得意：一边挑得很高，另一头压下去
    g.beginPath();
    g.moveTo(-21, 2);
    g.quadraticCurveTo(0, 8.5, 22, -7.5);
    stroke(2.3);
    g.stroke();
    return g.canvas;
  }

  // neutral：闭着的微笑
  g.beginPath();
  g.moveTo(-21, -1);
  g.quadraticCurveTo(0, 9.5, 21, -1);
  stroke(2.6);
  g.stroke();
  return g.canvas;
}

/**
 * 开心系表情预设：嘴型 + 眉、耳、腮红、头身姿态。
 * 单用嘴型不够 —— 开心是整张脸一起动的，耳朵和前倾才是"狼"的那部分。
 */
export const HAPPY_PRESETS = {
  // blush 整体压低了 —— 原来 0.4 以上在大远景里就是两块腮红膏，脸都糊了
  soft:   { mouth: 'soft',   brow: 0.22, ear: 0.18, blush: 0.11, tilt: 0.10, headTilt: 0.06, lean: 0.10 },
  warm:   { mouth: 'warm',   brow: 0.45, ear: 0.48, blush: 0.22, tilt: 0.16, headTilt: 0.15, lean: 0.18 },
  beam:   { mouth: 'beam',   brow: 0.55, ear: 0.58, blush: 0.26, tilt: 0.12, headTilt: 0.12, lean: 0.24 },
  grin:   { mouth: 'grin',   brow: 0.65, ear: 0.72, blush: 0.32, tilt: 0.06, headTilt: 0.18, lean: 0.30 },
  laugh:  { mouth: 'laugh',  brow: 0.75, ear: 0.85, blush: 0.36, tilt: 0.02, headTilt: 0.22, lean: 0.36 },
  giggle: { mouth: 'giggle', brow: 0.38, ear: 0.62, blush: 0.40, tilt: 0.22, headTilt: 0.26, lean: 0.14 },
  smug:   { mouth: 'smug',   brow: 0.42, ear: 0.34, blush: 0.17, tilt: 0.32, headTilt: -0.20, lean: 0.12 },
};

/** 一团柔和的腮红 */
export function blushCanvas() {
  const S = 128;
  const cv = document.createElement('canvas');
  cv.width = S;
  cv.height = S;
  const g = cv.getContext('2d');
  const gr = g.createRadialGradient(S / 2, S / 2, 2, S / 2, S / 2, S / 2);
  gr.addColorStop(0, 'rgba(216,110,106,0.75)');
  gr.addColorStop(0.45, 'rgba(208,98,96,0.38)');
  gr.addColorStop(1, 'rgba(200,90,90,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);
  return cv;
}

/**
 * 肤色补丁。
 * 模型自带的唇线在贴图上就有，而且又宽又浅 —— 叠加层不管怎么画都会和它并行，
 * 缩到屏幕上就是"两条嘴"。所以在嘴前面先铺一层和周围肤色一致的软边面片，
 * 把那道旧唇线盖掉，新的嘴型才能按动画的比例画窄。
 */
export function lipMaskCanvas() {
  const W = 256, H = 64;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  // 这里的颜色是从渲染结果里采的（上方 #e5caa8 / 下方 #e4c9a7），上下只留一点点差
  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#e7cdaa');
  gr.addColorStop(0.5, '#e4caa8');
  gr.addColorStop(1, '#dfc5a3');
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);

  // 四边羽化，避免出现矩形的硬边
  g.globalCompositeOperation = 'destination-in';
  g.save();
  g.translate(W / 2, H / 2);
  g.scale(1, H / W);
  const a = g.createRadialGradient(0, 0, W * 0.10, 0, 0, W * 0.50);
  a.addColorStop(0, 'rgba(0,0,0,1)');
  a.addColorStop(0.50, 'rgba(0,0,0,1)');
  a.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = a;
  g.beginPath();
  g.arc(0, 0, W * 0.52, 0, Math.PI * 2);
  g.fill();
  g.restore();
  return cv;
}
