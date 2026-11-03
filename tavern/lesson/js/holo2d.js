/**
 * 回忆模式 · 右侧 2D 立绘讲述者
 *
 * 用途：赫萝站在画面右侧，讲「初次相遇」这类回忆。左侧留给舞台剧画面，
 *       由舞台剧素材层（stage）负责，本模块只管立绘。
 *
 * 为什么是 DOM 覆盖层而不是放进 three 场景：
 *   1) 2D 立绘是平面贴图，进 3D 只会被场景的雾、色调映射、FOV 干扰；
 *   2) 定位在右侧是纯 CSS 的活，比换算相机坐标稳得多；
 *   3) 后面的舞台剧画面本来就要用 DOM/CSS 叠图层，同一套坐标系好对齐。
 *
 * 层序（从后到前）：尾巴 -> 身体
 * 尾巴根部藏在身体实心区内（见 holo2d.json 的 rootPct），旋转时不会脱节。
 *
 * 素材：./assets/holo2d/  总 93.7 KB（立绘 67 KB + 三条尾巴 26 KB）
 */

const ASSET = './assets/holo2d/';

export function createHolo2D(opts = {}) {
  const { onReady, onError } = opts;

  const state = {
    meta: null,
    root: null,          // 最外层（全屏覆盖，负责显隐）
    inner: null,         // 512x878 的定位盒
    tailBox: null,       // 尾巴容器（绕根部旋转）
    tails: {},           // name -> img 元素
    tail: 'curl',
    talking: 0,
    ready: false,
    scale: 1,
    scaleMul: 1,          // 调试用的缩放倍率，正常恒为 1
    raf: 0,
  };

  /** 造一个元素的小工具 */
  const el = (tag, cls, style) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (style) Object.assign(n.style, style);
    return n;
  };

  /** 按视口高度算缩放：立绘高度约占视口 78%
   *  （scaleMul 是调试面板用的倍率，正常恒为 1，不影响这里的行为） */
  function fit() {
    if (!state.meta || !state.inner) return;
    const CH = state.meta.canvas.h;
    const base = Math.min(
      (window.innerHeight * 0.78) / CH,
      (window.innerWidth * 0.46) / state.meta.canvas.w,
    );
    state.scale = Math.max(0.2, base * state.scaleMul);
    state.inner.style.transform = `scale(${state.scale.toFixed(4)})`;
  }

  /** 建 DOM */
  function build(meta) {
    const root = el('div', 'holo2d');

    const inner = el('div', 'holo2d__inner', {
      width: meta.canvas.w + 'px',
      height: meta.canvas.h + 'px',
    });

    // ---- 尾巴（在后面） ----
    const tailBox = el('div', 'holo2d__tail');

    for (const [name, info] of Object.entries(meta.tails)) {
      const img = el('img', 'holo2d__tailimg', {
        left: info.left + 'px',
        top: info.top + 'px',
        width: info.w + 'px',
        height: info.h + 'px',
        transformOrigin: info.rootPct[0] + '% ' + info.rootPct[1] + '%',
      });
      img.src = ASSET + info.file;
      img.alt = '';
      img.draggable = false;
      img.dataset.t = name;                 // 姿态名，便于调试与断言
      img.dataset.baseLeft = String(info.left);
      img.dataset.baseTop = String(info.top);
      // 显式写死可见性，别靠 CSS 默认值（否则状态含糊）
      img.style.opacity = (name === meta.defaultTail) ? '1' : '0';
      tailBox.appendChild(img);
      state.tails[name] = img;
    }

    // 尾巴容器本身绕根部转（整体甩动），轴取 tailRoot（三个姿态共用，换姿态不跳）
    tailBox.style.transformOrigin =
      ((meta.tailRoot.x) / meta.canvas.w * 100).toFixed(3) + '% ' +
      ((meta.tailRoot.y) / meta.canvas.h * 100).toFixed(3) + '%';

    // ---- 身体 ----
    const body = el('img', 'holo2d__body', {
      width: meta.canvas.w + 'px',
      height: meta.canvas.h + 'px',
    });
    body.src = ASSET + meta.file;
    body.alt = '赫萝';
    body.draggable = false;

    inner.appendChild(tailBox);
    inner.appendChild(body);
    root.appendChild(inner);
    document.body.appendChild(root);

    state.root = root;
    state.inner = inner;
    state.tailBox = tailBox;
    state.body = body;

    fit();
  }

  /** 主循环式更新（用 rAF，与 three 的主循环独立） */
  function loop() {
    state.raf = requestAnimationFrame(loop);
    if (!state.ready || !state.root.classList.contains('on')) return;

    const now = performance.now() / 1000;

    // 身体：轻微摇晃 + 呼吸
    const swayDeg = 1.6 * Math.sin(now * (Math.PI * 2 / 5));
    const sy = 1 + 0.012 * Math.sin(now * (Math.PI * 2 / 3.5));
    // 说话时头微动（整体轻微上下）
    const talkBob = state.talking ? Math.sin(now * 11) * 1.2 : 0;

    if (state.body) {
      state.body.style.transform =
        `translateY(${talkBob.toFixed(2)}px) ` +
        `rotate(${swayDeg.toFixed(3)}deg) ` +
        `scaleY(${sy.toFixed(5)})`;
    }

    // 尾巴：绕根部甩（容器整体转）
    const amp = 14;
    const dur = 2.6;
    const a = amp * Math.sin(now * (Math.PI * 2 / dur)) +
              amp * 0.3 * Math.sin(now * (Math.PI * 2 / (dur * 1.7)) + 1.2);
    if (state.tailBox) {
      state.tailBox.style.transform = `rotate(${a.toFixed(2)}deg)`;
    }
  }

  /** 启动加载 */
  (async () => {
    try {
      const res = await fetch(ASSET + 'holo2d.json');
      if (!res.ok) throw new Error('holo2d.json ' + res.status);
      const meta = await res.json();
      state.meta = meta;
      build(meta);

      // 等图片解码完成，避免第一帧闪白
      await Promise.all([
        state.body.decode().catch(() => {}),
        ...Object.values(state.tails).map((i) => i.decode().catch(() => {})),
      ]);

      window.addEventListener('resize', fit);
      state.ready = true;
      loop();
      if (onReady) onReady(meta);
    } catch (err) {
      console.warn('[holo2d] 加载失败:', err);
      if (onError) onError(err);
    }
  })();

  /* ───────── 对外接口 ───────── */
  return {
    get ready() { return state.ready; },

    /** 显示 / 隐藏（带淡入淡出） */
    show(on = true) {
      if (!state.root) return;
      state.root.classList.toggle('on', !!on);
    },
    hide() { this.show(false); },

    /** 切换尾巴姿态 */
    setTail(name) {
      if (!state.tails[name]) return false;
      state.tail = name;
      for (const [k, img] of Object.entries(state.tails)) {
        img.style.opacity = (k === name) ? '1' : '0';
      }
      // 轴由容器统一控制（三个姿态共用同一根部），这里不用改
      return true;
    },

    /** 正在说话的标记（轻微点头） */
    setTalking(on) { state.talking = on ? 1 : 0; },

    /* 调试接口：只给调参面板用。正常流程不会碰它，
       所以删掉调参面板 = 这段也可以一并删。 */
    dev: {
      get inner() { return state.inner; },
      get scale() { return state.scale; },
      get scaleMul() { return state.scaleMul; },
      setScaleMul(m) {
        state.scaleMul = Number(m) || 1;
        fit();
        return state.scaleMul;
      },
    },

    dispose() {
      cancelAnimationFrame(state.raf);
      window.removeEventListener('resize', fit);
      if (state.root && state.root.parentNode) {
        state.root.parentNode.removeChild(state.root);
      }
      state.ready = false;
    },
  };
}