/* stage_full.js · 用完整舞台剧（96 拍）替换酒馆回忆模式的渲染
 *
 * 设计（2026-11-13，用户选定方案 B）：
 *   · 剧本/配音/文本仍然由 story.js 驱动，一条都不改
 *   · 舞台画面换成完整舞台剧：12 个 shot 各自映射到 96 拍里的一个关键拍
 *   · 舞台**不播自己的声音、不画自己的字幕**（S.muted + S.sub 空实现），
 *     声音与文字全部交给酒馆原有流程，避免两套文本打架
 *
 * 对外 API 与 stage_v2.js 完全一致：
 *   createStage(rootEl, { onReady, onError }) -> {
 *     ready, show(on), hide(), gotoShot(i, byClick), shot, shotCount, dispose, dev
 *   }
 *
 * ⚠ 交接文档 §4.1 的坑：ensureStage() 会缓存实例不重复 show()，
 *   所以 show() 必须可以反复调用，且不依赖内部一次性状态。
 * ⚠ §4.3 的坑：动态 import 必须带版本号，见 BUILD。
 */

const BUILD = 2;          // 改本文件 / 改引擎 / 改剧本都要 +1
const ASSET_VER = 1;      // 只换素材时改这个（scenes_tav.js 里读 window.__TAV_ASSET_VER）

/* 12 个 shot → 完整舞台剧的拍索引（0..95）
 * 对齐依据：按 story.js 里每镜的剧情内容挑最贴的拍
 *   0  开场            → S00-01 幕启·麦田全景
 *   1  掌管麦子丰收     → S00-04 风吹麦浪
 *   2  祭典 / 被当神    → S00-09 守麦之灵横穿
 *   3  时代变了·离开    → S01-01 独行·撤道具
 *   4  最后一束麦       → S02-01 掀布（马车里）
 *   5  钻进马车         → S02-04 两人立绘待命
 *   6  半夜布被掀开     → S03-01 承前（赫萝在车里）
 *   7  他举手僵住       → S04-01 刚醒
 *   8  咱是赫萝         → S09-01 自报家门
 *   9  贤狼赫萝         → S09-07
 *  10  一见钟情         → S05-01 初见
 *  11  旅程够格         → S11-07 H053/H055
 */
export const SHOT_BEATS = [0, 3, 8, 14, 19, 22, 23, 30, 70, 76, 38, 93];

/* 模块自身所在目录。script.src 是相对「文档」解析的，
   直接写 './stage_v3.js' 会变成 /lesson/stage_v3.js（404）。
   用 import.meta.url 拿到 js/ 目录，才是稳的。 */
const HERE = new URL('.', import.meta.url).href;

function injectScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = () => res();
    s.onerror = () => rej(new Error('脚本加载失败: ' + src));
    document.head.appendChild(s);
  });
}

let loadPromise = null;
function loadOnce() {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    if (!window.Stage) await injectScript(HERE + 'stage_v3.js?v=' + BUILD);
    if (!window.PLAYLIST) await injectScript(HERE + 'scenes_tav.js?v=' + BUILD);
    if (!window.Stage) throw new Error('stage_v3.js 没有挂上 window.Stage');
    if (!window.PLAYLIST || !window.PLAYLIST.length) throw new Error('scenes_tav.js 没有导出 PLAYLIST');
  })();
  return loadPromise;
}

export function createStage(rootEl, opts = {}) {
  if (!rootEl) throw new TypeError('[stage_full] 需要容器元素');
  const { onReady, onError } = opts;

  let S = null;
  let beats = null;
  let curBeat = -1;
  let disposed = false;
  let playing = false;
  let playToken = 0;
  let bar = null;   // 打断令牌：seek/stop 时 +1，正在跑的循环自行退出

  const api = {
    ready: null,
    shot: -1,
    get shotCount() { return SHOT_BEATS.length; },

    /** 反复调用安全（交接文档 §4.1） */
    show(on = true) {
      if (!S) return;
      const wrap = S.wrap;
      if (wrap) wrap.style.opacity = on ? '1' : '0';
      if (on) S._fit && S._fit();
    },
    hide() { api.show(false); },

    /**
     * 跳到第 i 镜。byClick 参数保留以兼容旧调用（我们内部不吃它，
     * 但完整舞台没有「马车进出 1 秒催快」这回事，忽略即可）。
     */
    async gotoShot(i, byClick = false) {
      if (!S || disposed) return;
      const idx = Math.max(0, Math.min(SHOT_BEATS.length - 1, i | 0));
      const target = Math.min(beats.length - 1, SHOT_BEATS[idx]);

      /* 用 fast 模式把 0..target 全部重放一遍：所有 fade/wait 瞬时完成，
         结果就是「该拍结束时的完整舞台状态」。
         向后跳只补跑增量，向前跳（少见）才从头重建。 */
      S.fast = true;
      try {
        if (target <= curBeat) {
          S.clearAll();
          S.resetCurtain();
          curBeat = -1;
        }
        for (let k = curBeat + 1; k <= target; k++) {
          const tok = S.bump();
          try { await beats[k].run(tok); } catch (e) { /* 单拍失败不阻断 */ }
        }
        curBeat = target;
      } finally {
        S.fast = false;
      }
      api.shot = idx;
    },

    /** 整片顺序播放（成片模式）。返回 Promise，播完 resolve。
     *  opts.resumeFrom：从第几拍开始（跳转后续播用）
     *  opts.onBeat(k, total)、opts.onProgress(ratio) */
    async playAll(opts = {}) {
      if (!S || disposed) return;
      const { onBeat, onProgress, resumeFrom = 0 } = opts;
      const my = ++playToken;
      S.fast = false;
      S.muted = false;
      playing = true;
      try {
        for (let k = resumeFrom; k < beats.length; k++) {
          if (my !== playToken || disposed) return;     // 被 seek / stop 打断
          const tok = S.bump();
          await beats[k].run(tok);
          curBeat = k;
          if (onBeat) onBeat(k, beats.length);
          if (onProgress) onProgress((k + 1) / beats.length);
        }
      } catch (e) {
        if (String(e && e.message) !== 'stale') console.warn('[stage_full] 播放中断:', e);
      } finally {
        if (my === playToken) playing = false;
      }
    },

    /** 跳到第 n 拍并继续播放（进度条拖动用） */
    async seekBeat(n) {
      if (!S || disposed) return;
      const target = Math.max(0, Math.min(beats.length - 1, n | 0));
      playToken++;                     // 打断正在跑的 playAll
      try { S.bump(); } catch (e) { /* ignore */ }

      /* fast 重建到 target 的结束状态 */
      S.fast = true;
      try {
        S.clearAll();
        S.resetCurtain();
        for (let k = 0; k <= target; k++) {
          const tok = S.bump();
          try { await beats[k].run(tok); } catch (e) { /* 单拍失败不阻断 */ }
        }
      } finally {
        S.fast = false;
      }
      curBeat = target;
      if (api.onProgress) api.onProgress((target + 1) / beats.length);
      /* 从下一拍继续 */
      api.playAll({ resumeFrom: target + 1, onBeat: api.onBeat, onProgress: api.onProgress });
    },

    /** 中途停止（跳过用） */
    stopPlayback() {
      playToken++;
      playing = false;
      try { if (S) S.bump(); } catch (e) { /* ignore */ }
    },

    get playing() { return playing; },


    /* ---------------- 进度条（可选） ---------------- */
    /** 建一条可拖动的进度条，挂在舞台容器底部 */
    mountProgressBar(opts = {}) {
      if (!S || !S.wrap || bar) return bar;
      const wrap = S.wrap;
      const host = document.createElement('div');
      host.style.cssText = [
        'position:absolute', 'left:0', 'right:0', 'bottom:0', 'height:22px',
        'display:flex', 'align-items:center', 'gap:8px', 'padding:0 10px',
        'background:linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0))',
        'z-index:120', 'cursor:pointer', 'user-select:none',
        'font:11px/1 ui-monospace,Consolas,monospace', 'color:rgba(255,255,255,.72)',
      ].join(';');

      const track = document.createElement('div');
      track.style.cssText = [
        'flex:1', 'height:4px', 'border-radius:2px',
        'background:rgba(255,255,255,.22)', 'position:relative',
      ].join(';');
      const fill = document.createElement('div');
      fill.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:0%;'
        + 'background:rgba(201,164,92,.92);border-radius:2px;';
      const knob = document.createElement('div');
      knob.style.cssText = 'position:absolute;top:50%;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;'
        + 'border-radius:50%;background:#e8ddc8;box-shadow:0 0 6px rgba(0,0,0,.6);left:0%;';
      track.appendChild(fill);
      track.appendChild(knob);

      const label = document.createElement('span');
      label.textContent = '0 / ' + (beats ? beats.length : 0);

      host.appendChild(track);
      host.appendChild(label);
      wrap.appendChild(host);

      const setRatio = (r) => {
        const p = Math.max(0, Math.min(1, r)) * 100;
        fill.style.width = p + '%';
        knob.style.left = p + '%';
      };
      api.onProgress = (r) => {
        setRatio(r);
        const n = Math.round(Math.min(1, r) * (beats.length - 1)) + 1;
        label.textContent = n + ' / ' + beats.length;
      };

      let dragging = false;
      const ratioAt = (ev) => {
        const b = track.getBoundingClientRect();
        return (ev.clientX - b.left) / Math.max(1, b.width);
      };
      const onMove = (ev) => {
        if (!dragging) return;
        ev.preventDefault();
        setRatio(ratioAt(ev));                    // 拖动时只跟手，不真的跳
      };
      const onUp = (ev) => {
        if (!dragging) return;
        dragging = false;
        const r = ratioAt(ev);
        const target = Math.round(r * (beats.length - 1));
        if (opts.onSeek) opts.onSeek(target);
        else api.seekBeat(target);
      };
      host.addEventListener('pointerdown', (ev) => {
        if (ev.button !== 0) return;
        dragging = true;
        host.setPointerCapture && host.setPointerCapture(ev.pointerId);
        setRatio(ratioAt(ev));
      });
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerup', onUp);
      host.addEventListener('pointercancel', () => { dragging = false; });

      bar = { host, track, fill, knob, label, setRatio };
      return bar;
    },

    /** 显示/隐藏进度条 */
    showProgress(on = true) { if (bar) bar.host.style.display = on ? 'flex' : 'none'; },

    dispose() {
      disposed = true;
      try {
        if (S) { S.bump(); S.clearAll(); }
      } catch (e) { /* ignore */ }
      if (bar) { try { bar.host.remove(); } catch (e) {} bar = null; }
      if (rootEl) rootEl.innerHTML = '';
    },

    dev: { state: { get curBeat() { return curBeat; } }, SHOT_BEATS },
    onBeat: null,
    onProgress: null,
  };

  api.ready = (async () => {
    try {
      await loadOnce();
      if (disposed) return;
      S = window.Stage;
      beats = window.PLAYLIST;

      /* 完整成片模式：保留舞台自己的字幕、配音、音效（用户要求「移植成品」，
         不是改编）。酒馆那边只负责把片子放出来。 */
      S.mount(rootEl);
      S.muted = false;
      /* ★ 必须预加载音频表：场景里的 say() 只传 key，
         stage_v3 的 play() 靠 this.clips 取音源；不 preload 就没有声音、
         也不会发起任何 mp3 请求（踩过一次）。 */
      if (window.STAGE_PATHS && window.STAGE_PATHS.AUDIO) {
        S.preload(window.STAGE_PATHS.AUDIO);
      }
      /* 场景里有大量「不 await 的长动画」，换拍时 bump() 会让它们 reject('stale')。
         这些是预期内的，别让它们冒到控制台变成异常。 */
      if (!window.__tavStaleGuard) {
        window.__tavStaleGuard = true;
        window.addEventListener('unhandledrejection', (e) => {
          const r = e && e.reason;
          const msg = r && (r.message || String(r));
          if (msg && msg.indexOf('stale') >= 0) e.preventDefault();
        });
      }

      api.show(false);
      await api.gotoShot(0);
      api.show(true);
      if (onReady) onReady();
    } catch (e) {
      console.warn('[stage_full] 初始化失败:', e);
      if (onError) onError(e);
      throw e;
    }
  })();

  return api;
}