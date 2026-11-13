/* ==========================================================================
 * scenes_act1.js — 第一幕 S00 + S01 的分场脚本  v2
 * --------------------------------------------------------------------------
 * 2026-11-08 用户四点修订：
 *   ① S00-05 起 男主 + 空马车 并排出场（车左人右，按原合图比例贴站）
 *   ② 说话的人身上要有抖动，明确「是谁在说话」
 *   ③ S00-09 守麦之灵潜伏在麦田里横向潜行，且带抖动
 *   ④ S00-03 之后不再切背景（取消 S00-04 的推板换景）
 *
 * 每一拍 { id, name, run(tok) }，run 里 await 会被跳拍打断（stale）。
 * ========================================================================== */
(function (global) {
  'use strict';

  const S = global.Stage;
  const W = S.W, H = S.H, Z = S.Z, E = S.EASE;

  /* ------------------------------ 素材 ------------------------------ */

    /* 酒馆版：素材按「键名」直接定位到 assets/stage3/img/<key>.webp */
  /* 素材版本号：只换素材时改这里（或由 index.html 设 window.__TAV_ASSET_VER），
     避免浏览器拿着旧 webp/mp3 不放（交接文档 §4.3）。 */
  const TAV_VER = (typeof window !== 'undefined' && window.__TAV_ASSET_VER) || 1;
  const TAV_IMG = './assets/stage3/img/';
  const TAV_AUD = './assets/stage3/audio/';
  const P = {
    bgDay: TAV_IMG + 'bgDay.webp?v=' + TAV_VER,
    bgRut: TAV_IMG + 'bgRut.webp?v=' + TAV_VER,
    spirit: TAV_IMG + 'spirit.webp?v=' + TAV_VER,
    stock: TAV_IMG + 'stock.webp?v=' + TAV_VER,
    bgNight: TAV_IMG + 'bgNight.webp?v=' + TAV_VER,
    bgRoad: TAV_IMG + 'bgRoad.webp?v=' + TAV_VER,
    cartEmpty: TAV_IMG + 'cartEmpty.webp?v=' + TAV_VER,
    cartMan: TAV_IMG + 'cartMan.webp?v=' + TAV_VER,
    man: TAV_IMG + 'man.webp?v=' + TAV_VER,
    sigh: TAV_IMG + 'sigh.webp?v=' + TAV_VER,
    s02A: TAV_IMG + 's02A.webp?v=' + TAV_VER,
    s02B: TAV_IMG + 's02B.webp?v=' + TAV_VER,
    s02Open: TAV_IMG + 's02Open.webp?v=' + TAV_VER,
    s03Hand: TAV_IMG + 's03Hand.webp?v=' + TAV_VER,
    horo: TAV_IMG + 'horo.webp?v=' + TAV_VER,
    s04Up: TAV_IMG + 's04Up.webp?v=' + TAV_VER,
    s05Lean: TAV_IMG + 's05Lean.webp?v=' + TAV_VER,
    s05Eat: TAV_IMG + 's05Eat.webp?v=' + TAV_VER,
    s05Pick: TAV_IMG + 's05Pick.webp?v=' + TAV_VER,
    s05Pre: TAV_IMG + 's05Pre.webp?v=' + TAV_VER,
    s06A: TAV_IMG + 's06A.webp?v=' + TAV_VER,
    s06B: TAV_IMG + 's06B.webp?v=' + TAV_VER,
    s06C: TAV_IMG + 's06C.webp?v=' + TAV_VER,
    s06Look: TAV_IMG + 's06Look.webp?v=' + TAV_VER,
    s06Lean: TAV_IMG + 's06Lean.webp?v=' + TAV_VER,
    s07A: TAV_IMG + 's07A.webp?v=' + TAV_VER,
    s07B: TAV_IMG + 's07B.webp?v=' + TAV_VER,
    s07Sword: TAV_IMG + 's07Sword.webp?v=' + TAV_VER,
    s07Laugh: TAV_IMG + 's07Laugh.webp?v=' + TAV_VER,
    s07Angry: TAV_IMG + 's07Angry.webp?v=' + TAV_VER,
    s08Ear: TAV_IMG + 's08Ear.webp?v=' + TAV_VER,
    s08Tail: TAV_IMG + 's08Tail.webp?v=' + TAV_VER,
    s08Side: TAV_IMG + 's08Side.webp?v=' + TAV_VER,
    s09: TAV_IMG + 's09.webp?v=' + TAV_VER,
    s10A: TAV_IMG + 's10A.webp?v=' + TAV_VER,
    s10B: TAV_IMG + 's10B.webp?v=' + TAV_VER,
    lookB1: TAV_IMG + 'lookB1.webp?v=' + TAV_VER,
    lookB2: TAV_IMG + 'lookB2.webp?v=' + TAV_VER,
    lookB3: TAV_IMG + 'lookB3.webp?v=' + TAV_VER,
    lookB4: TAV_IMG + 'lookB4.webp?v=' + TAV_VER,
    lookB5: TAV_IMG + 'lookB5.webp?v=' + TAV_VER,
    s10Betray: TAV_IMG + 's10Betray.webp?v=' + TAV_VER,
    s10Beg: TAV_IMG + 's10Beg.webp?v=' + TAV_VER,
    s10Wrath: TAV_IMG + 's10Wrath.webp?v=' + TAV_VER,
    s10Wrath2: TAV_IMG + 's10Wrath2.webp?v=' + TAV_VER,
    s10North: TAV_IMG + 's10North.webp?v=' + TAV_VER,
    s10Turn: TAV_IMG + 's10Turn.webp?v=' + TAV_VER,
    s10L916: TAV_IMG + 's10L916.webp?v=' + TAV_VER,
    s10Smile: TAV_IMG + 's10Smile.webp?v=' + TAV_VER,
    s10Peek: TAV_IMG + 's10Peek.webp?v=' + TAV_VER,
    s10Stretch: TAV_IMG + 's10Stretch.webp?v=' + TAV_VER,
    s10Ask: TAV_IMG + 's10Ask.webp?v=' + TAV_VER,
    sable: TAV_IMG + 'sable.webp?v=' + TAV_VER,
    logo: TAV_IMG + 'logo.webp?v=' + TAV_VER,
    moon: TAV_IMG + 'moon.webp?v=' + TAV_VER,
    sheafL: TAV_IMG + 'sheafL.webp?v=' + TAV_VER,
    sheafR: TAV_IMG + 'sheafR.webp?v=' + TAV_VER,
  };;

    const AUDIO = {
    H026: TAV_AUD + 'H026.mp3?v=' + TAV_VER,
    H029: TAV_AUD + 'H029.mp3?v=' + TAV_VER,
    H023: TAV_AUD + 'H023.mp3?v=' + TAV_VER,
    H015: TAV_AUD + 'H015.mp3?v=' + TAV_VER,
    L084: TAV_AUD + 'L084.mp3?v=' + TAV_VER,
    L085: TAV_AUD + 'L085.mp3?v=' + TAV_VER,
    L086: TAV_AUD + 'L086.mp3?v=' + TAV_VER,
    L087: TAV_AUD + 'L087.mp3?v=' + TAV_VER,
    L088: TAV_AUD + 'L088.mp3?v=' + TAV_VER,
    L089: TAV_AUD + 'L089.mp3?v=' + TAV_VER,
    L090: TAV_AUD + 'L090.mp3?v=' + TAV_VER,
    L091: TAV_AUD + 'L091.mp3?v=' + TAV_VER,
    L092: TAV_AUD + 'L092.mp3?v=' + TAV_VER,
    L093: TAV_AUD + 'L093.mp3?v=' + TAV_VER,
    L094: TAV_AUD + 'L094.mp3?v=' + TAV_VER,
    L095: TAV_AUD + 'L095.mp3?v=' + TAV_VER,
    L096: TAV_AUD + 'L096.mp3?v=' + TAV_VER,
    H063: TAV_AUD + 'H063.mp3?v=' + TAV_VER,
    L066: TAV_AUD + 'L066.mp3?v=' + TAV_VER,
    H905: TAV_AUD + 'H905.mp3?v=' + TAV_VER,
    L226: TAV_AUD + 'L226.mp3?v=' + TAV_VER,
    L902: TAV_AUD + 'L902.mp3?v=' + TAV_VER,
    L069: TAV_AUD + 'L069.mp3?v=' + TAV_VER,
    H061: TAV_AUD + 'H061.mp3?v=' + TAV_VER,
    H062: TAV_AUD + 'H062.mp3?v=' + TAV_VER,
    H064: TAV_AUD + 'H064.mp3?v=' + TAV_VER,
    H901: TAV_AUD + 'H901.mp3?v=' + TAV_VER,
    H902: TAV_AUD + 'H902.mp3?v=' + TAV_VER,
    L903: TAV_AUD + 'L903.mp3?v=' + TAV_VER,
    H032: TAV_AUD + 'H032.mp3?v=' + TAV_VER,
    L162: TAV_AUD + 'L162.mp3?v=' + TAV_VER,
    L001: TAV_AUD + 'L001.mp3?v=' + TAV_VER,
    H033: TAV_AUD + 'H033.mp3?v=' + TAV_VER,
    L904: TAV_AUD + 'L904.mp3?v=' + TAV_VER,
    H002: TAV_AUD + 'H002.mp3?v=' + TAV_VER,
    H007: TAV_AUD + 'H007.mp3?v=' + TAV_VER,
    L905: TAV_AUD + 'L905.mp3?v=' + TAV_VER,
    H004: TAV_AUD + 'H004.mp3?v=' + TAV_VER,
    L906: TAV_AUD + 'L906.mp3?v=' + TAV_VER,
    H042: TAV_AUD + 'H042.mp3?v=' + TAV_VER,
    H903: TAV_AUD + 'H903.mp3?v=' + TAV_VER,
    L911: TAV_AUD + 'L911.mp3?v=' + TAV_VER,
    H906: TAV_AUD + 'H906.mp3?v=' + TAV_VER,
    L910: TAV_AUD + 'L910.mp3?v=' + TAV_VER,
    H907: TAV_AUD + 'H907.mp3?v=' + TAV_VER,
    L070: TAV_AUD + 'L070.mp3?v=' + TAV_VER,
    L196: TAV_AUD + 'L196.mp3?v=' + TAV_VER,
    H051: TAV_AUD + 'H051.mp3?v=' + TAV_VER,
    L908: TAV_AUD + 'L908.mp3?v=' + TAV_VER,
    H124: TAV_AUD + 'H124.mp3?v=' + TAV_VER,
    L907: TAV_AUD + 'L907.mp3?v=' + TAV_VER,
    H904: TAV_AUD + 'H904.mp3?v=' + TAV_VER,
    H140: TAV_AUD + 'H140.mp3?v=' + TAV_VER,
    H141: TAV_AUD + 'H141.mp3?v=' + TAV_VER,
    H058: TAV_AUD + 'H058.mp3?v=' + TAV_VER,
    H055: TAV_AUD + 'H055.mp3?v=' + TAV_VER,
    L054: TAV_AUD + 'L054.mp3?v=' + TAV_VER,
    L909: TAV_AUD + 'L909.mp3?v=' + TAV_VER,
    H053: TAV_AUD + 'H053.mp3?v=' + TAV_VER,
    H218: TAV_AUD + 'H218.mp3?v=' + TAV_VER,
    H142: TAV_AUD + 'H142.mp3?v=' + TAV_VER,
    H143: TAV_AUD + 'H143.mp3?v=' + TAV_VER,
    H144: TAV_AUD + 'H144.mp3?v=' + TAV_VER,
    H145: TAV_AUD + 'H145.mp3?v=' + TAV_VER,
    H146: TAV_AUD + 'H146.mp3?v=' + TAV_VER,
    H147: TAV_AUD + 'H147.mp3?v=' + TAV_VER,
    H148: TAV_AUD + 'H148.mp3?v=' + TAV_VER,
    H149: TAV_AUD + 'H149.mp3?v=' + TAV_VER,
    H150: TAV_AUD + 'H150.mp3?v=' + TAV_VER,
    H151: TAV_AUD + 'H151.mp3?v=' + TAV_VER,
    L912: TAV_AUD + 'L912.mp3?v=' + TAV_VER,
    L914: TAV_AUD + 'L914.mp3?v=' + TAV_VER,
    L915: TAV_AUD + 'L915.mp3?v=' + TAV_VER,
    L916: TAV_AUD + 'L916.mp3?v=' + TAV_VER,
    sfxBird: TAV_AUD + 'sfxBird.mp3?v=' + TAV_VER,
    sfxDusk: TAV_AUD + 'sfxDusk.mp3?v=' + TAV_VER,
    sfxGale: TAV_AUD + 'sfxGale.mp3?v=' + TAV_VER,
    sfxBreeze: TAV_AUD + 'sfxBreeze.mp3?v=' + TAV_VER,
    sfxTail: TAV_AUD + 'sfxTail.mp3?v=' + TAV_VER,
    sfxOwl05: TAV_AUD + 'sfxOwl05.mp3?v=' + TAV_VER,
    sfxOwl06: TAV_AUD + 'sfxOwl06.mp3?v=' + TAV_VER,
    sfxOwl07: TAV_AUD + 'sfxOwl07.mp3?v=' + TAV_VER,
    sfxCloth02: TAV_AUD + 'sfxCloth02.mp3?v=' + TAV_VER,
    sfxCloth01: TAV_AUD + 'sfxCloth01.mp3?v=' + TAV_VER,
    sfxKneel: TAV_AUD + 'sfxKneel.mp3?v=' + TAV_VER,
    sfxEar: TAV_AUD + 'sfxEar.mp3?v=' + TAV_VER,
    sfxLand: TAV_AUD + 'sfxLand.mp3?v=' + TAV_VER,
  };;



  /* ==================================================================== */
  /* SFX · 独立音效轨（2026-11-13 重做）                                    */
  /* ==================================================================== */
  /* 与 Stage 完全解耦：不读 S.bump/S.stopAudio，Stage 那边也碰不到它。
     对外只有三个入口：
       SFX.play(key, { vol, fadeIn, maxMs, fadeOut, src })
       SFX.stopAll(ms)
       SFX.busy()                                    */
  const SFXTRACK = (function () {
    /* ---- 内部状态 ------------------------------------------------ */
    let cur = null;              // { el, gen, key, beat, timers:Set }
    const warm = new Set();      // 已预热的 key
    let gen = 0;                 // 每次 play +1；定时器回调校验它防误伤
    const log = [];              // 最近 40 条触发记录，供 audit() 排查

    function now() {
      try { return (window.Stage && window.Stage.currentBeat) || ''; } catch (e) { return ''; }
    }
    function isFast() {
      try {
        const S = window.Stage;
        return !!(S && (S.fast || S.muted));
      } catch (e) { return false; }
    }
    function srcOf(key) {
      try {
        return (window.STAGE_PATHS && window.STAGE_PATHS.AUDIO &&
                window.STAGE_PATHS.AUDIO[key]) || '';
      } catch (e) { return ''; }
    }
    function note(kind, key, extra) {
      log.push({ t: Date.now(), kind, key, beat: now(), extra: extra || '' });
      if (log.length > 40) log.shift();
    }

    /* ---- 唯一的 Audio 元素（单轨，池化只留 1 个） ------------------ */
    let el = null;
    function audio() {
      if (!el) {
        el = new Audio();
        el.preload = 'auto';
      }
      return el;
    }

    function ramp(target, ms, myGen) {
      const a = audio();
      if (!ms) { try { a.volume = target; } catch (e) {} return; }
      const v0 = a.volume, t0 = Date.now();
      const step = () => {
        if (myGen !== gen) return;                 // 期间被新调用顶掉，停手
        const k = Math.min(1, (Date.now() - t0) / ms);
        try { a.volume = v0 + (target - v0) * k; } catch (e) { return; }
        if (k < 1) requestAnimationFrame(step);
      };
      step();
    }

    /* 停当前轨。先摘 cur，再清定时器 —— 顺序保证幂等，重复调用无副作用。 */
    function halt(ms, why) {
      if (!cur) return;
      const rec = cur;
      cur = null;
      gen += 1;                                    // 让所有在途定时器/斜坡失效
      rec.timers.forEach((t) => clearTimeout(t));
      rec.timers.clear();
      const a = audio();
      const done = () => {
        try { a.pause(); a.currentTime = 0; } catch (e) { /* ignore */ }
      };
      if (!ms) { done(); note('stop', rec.key, why || 'hard'); return; }
      ramp(0, ms, gen);
      const t = setTimeout(done, ms + 40);
      rec.timers.add(t);
      note('fadeout', rec.key, why || ('+' + ms + 'ms'));
    }

    return {
      /* opt: { vol, fadeIn, maxMs, fadeOut, loop, src, beat } */
      play(key, opt) {
        const o = opt || {};

        /* 规则④：fast 重建 / 静音 → 一律不播（上次「每节都响」的根源） */
        if (isFast()) { note('skip', key, 'fast/muted'); return null; }

        /* 规则①：如果调用点声明了所属拍，但不是当前拍 → 拒绝
           （防止 seek 重建过程中被跑到、或代码放错拍） */
        const b = o.beat || '';
        if (b && now() && b !== now()) { note('skip', key, 'beat ' + b + '≠' + now()); return null; }

        const src = o.src || srcOf(key);
        if (!src) { note('skip', key, 'no src'); console.warn('[SFXTRACK] 找不到音频:', key); return null; }

        /* 规则②：单轨 —— 起新的必先停旧的 */
        halt(0, 'replace');

        const a = audio();
        gen += 1;
        const myGen = gen;
        try { a.pause(); } catch (e) { /* ignore */ }
        a.src = src;
        a.loop = !!o.loop;
        try { a.currentTime = 0; } catch (e) { /* ignore */ }

        const target = o.vol === undefined ? 1 : o.vol;
        const fadeIn = o.fadeIn === undefined ? 400 : o.fadeIn;
        try { a.volume = fadeIn > 0 ? 0 : target; } catch (e) { /* ignore */ }

        /* 就绪守卫：素材没缓冲够时直接 play() 会「调用成功但没声音」。
           readyState < 2（HAVE_CURRENT_DATA）就先等 canplay，最多 1200ms。 */
        const start = () => {
          if (gen !== myGen) return;                 // 等的时候被顶掉了，放弃
          const pr = a.play();
          if (pr && pr.catch) pr.catch((err) => note('reject', key, err && err.name));
          if (fadeIn > 0) ramp(target, fadeIn, myGen);
        };
        if (a.readyState >= 2) {
          start();
        } else {
          note('waitbuf', key, 'readyState=' + a.readyState);
          let fired = false;
          const go = () => { if (fired) return; fired = true; start(); };
          a.addEventListener('canplay', go, { once: true });
          setTimeout(go, 1200);                      // 兜底，不无限等
        }

        const rec = { el: a, gen: myGen, key, beat: b, timers: new Set() };

        /* 规则③：定时器回调先校验 gen，被顶掉就什么都不做 */
        if (o.maxMs) {
          const feed = o.fadeOut === undefined ? 400 : o.fadeOut;
          const t = setTimeout(() => {
            if (gen !== myGen || cur !== rec) return;   // 已被替换 / 已停
            halt(feed, 'auto ' + o.maxMs + 'ms');
          }, o.maxMs);
          rec.timers.add(t);
        }

        cur = rec;
        note('play', key, 'vol=' + target + ' in=' + fadeIn + (o.maxMs ? ' auto=' + o.maxMs + '/out=' + (o.fadeOut === undefined ? 400 : o.fadeOut) : ''));
        return a;
      },

      stopAll(ms) { halt(ms === undefined ? 0 : ms, 'stopAll'); },

      /* 后台预热：给每个 key 建一个只加载不播放的 Audio，让浏览器把数据和解码都备好。
         播的时候复用 src 就能瞬间起播，不会出现「调用到了但没声」。 */
      preload(keys) {
        try {
          const list = keys || Object.keys(
            (window.STAGE_PATHS && window.STAGE_PATHS.AUDIO) || {})
            .filter((k) => k.indexOf('sfx') === 0);
          list.forEach((k) => {
            if (warm.has(k)) return;
            const src = srcOf(k);
            if (!src) return;
            const e = new Audio();
            e.preload = 'auto';
            e.muted = true;          // 只解码，不出声
            e.src = src;
            warm.add(k);
          });
          note('preload', String(list.length) + ' keys', '');
        } catch (e) { /* ignore */ }
      },

      /* 排查用：当前在响什么、最近发生了什么 */
      audit() {
        const c = cur
          ? { key: cur.key, beat: cur.beat, vol: Math.round(audio().volume * 100) / 100,
              paused: audio().paused, src: (audio().src || '').split('/').pop() }
          : null;
        console.log('[SFXTRACK] 当前:', c, '\n最近:', log.slice(-12));
        return { current: c, log: log.slice(-12) };
      },
      current() { return cur ? { key: cur.key, beat: cur.beat } : null; },
      history() { return log.slice(); },
    };
  })();
  if (typeof window !== 'undefined') window.__SFXTRACK = SFXTRACK;

  /* 素材宽高比（抠图成品统一为原尺寸 +40，所以比例固定） */
  const R_V = 1032 / 1544;     // 竖版：车、人、麦捆、钱袋、叹气
  const R_H = 1544 / 1032;     // 横版：守麦之灵
  const R_SQ = 474 / 576;      // 月亮

  /* ------------------------------ 摆位常量 ------------------------------ */
  /* 依据「空车与男主」原合图量的比例：
     车内容 486×893，人内容 409×853 → 车:人 内容高比 893:853
     人贴车右侧，底部基本对齐
     2026-11-08 用户定：人物高度占画幕高度 60% */
  const GY = 886;              // 地面基线
  const STAGE_H = 928;         // 舞台高（引擎固定 1632×928）
  const MAN_BODY_H = Math.round(STAGE_H * 0.60);            // = 557（占画幕 60%）
  const CART_BODY_H = Math.round(MAN_BODY_H * 893 / 853);   // ≈583（按原合图比例）
  const CART_CX = 600;         // 车中心
  const GAP = 26;              // 车右边缘与人左边缘的间隙

  /* 2026-11-09 白边统一后，赫萝与空车被「紧裁」过，比例常量已变：
       赫萝  618×1440  比例 0.4292  内容高占比 0.9889
       空车  829×826   比例 1.0036  内容高占比 0.9855
       男主  未改      比例 0.6684  内容高占比 0.9009
     这两张不能再套 R_V。 */
  const HORO_RATIO = 618 / 1440;      // 0.4292
  const HORO_CONTENT = 0.9889;        // 内容高 / 图高
  const CART_RATIO = 829 / 826;       // 1.0036
  const CART_CONTENT = 0.9855;
  const HORO_BODY_H = Math.round(MAN_BODY_H * 0.90);        // = 501（比男主低 10%）

  /* 两捆麦子（2026-11-09 白边缩到 2px 后重新紧裁，从原始备份重画不叠加） */
  const SHEAF_L_RATIO = 681 / 892;    // 0.7635
  const SHEAF_R_RATIO = 730 / 895;    // 0.8156
  const SHEAF_CONTENT = 0.9866;       // 内容高 / 图高（两捆一致）

  /* 守麦之灵：横版 1544×1032，内容 1472×398（占图 0.9534 × 0.3857） */
  const SPIRIT_BODY_W = 390;   // 内容宽（潜伏感：小一点才像藏在麦浪里）
  const SPIRIT_Y = 330;         // 灵在麦浪带里的中心高度（对齐远处麦浪顶部）

  /* ------------------------------ 工具 ------------------------------ */

  /* 说话：字幕 + 配音 + 说话者抖动
     speaker 传图层名则抖动那个人，传 null 表示画外音（不抖任何人）

     2026-11-09 字幕节奏规则（用户定）：
       台词念完后再等 0.5s 才收字幕 + 外框，给观众读完的余量。
       若这 0.5s 内紧接着有下一句，就直接接上，不闪不空。
     所以这里不再在 say 内部清字幕，交给收尾统一处理。 */
  async function say(tok, id, sub, holdMs, speaker) {
    if (sub) S.sub(sub);
    if (speaker) S.talk(speaker, 3);
    await S.play(id);
    if (speaker) S.act(speaker, 'idle', 1);
    if (tok !== S.token) throw new Error('stale');
    if (holdMs) await S.wait(holdMs, tok);
  }

  /* 收字幕：延后 0.5s 才淡出（外框与字同层，一起消）
     若期间来了新字幕，S.sub() 会清掉这个定时器，自然接上。 */
  function endSub(delayMs) {
    S.sub('', { holdMs: delayMs === undefined ? 500 : delayMs });
  }

  /* 摆一个角色：按「内容高」定尺寸，底部对齐地面
     o.ratio  显式图片宽高比（赫萝 618/1440 不能套 R_V，必须传）
     o.bodyRatio 内容高 / 图高 */
  function place(name, src, bodyH, cx, opts) {
    const o = opts || {};
    const bodyRatio = o.bodyRatio || 0.9009;   // 男主默认 0.9009
    const imgH = bodyH / bodyRatio;
    S.setImage(name, {
      src, ratio: o.ratio, h: imgH,
      w: o.ratio ? imgH * o.ratio : undefined,
      x: cx, y: GY - (o.lift || 0), anchor: 'bc',
      z: o.z || Z.actor, opacity: o.opacity === undefined ? 0 : o.opacity,
    });

    /* 镜像（面向另一侧）：
       用 CSS 的 **scale 独立属性**而不是 transform ——
       act()/talk() 的抖动动画写的是 img.style.animation，
       关键帧里带 transform，会覆盖 inline 的 transform: scaleX(-1)。
       scale 独立属性与 transform 合成，动画不会把它冲掉。
       绕 img 自身中心翻转，left/top 与锚点都不受影响。 */
    if (o.mirror) {
      const L = S.layers.get(name);
      if (L && L.img) {
        L.img.style.transformOrigin = 'center center';
        L.img.style.scale = '-1 1';
      }
    }
    return imgH;
  }

  /* ====================================================================== */
  /* S00 · 序章·麦田（白天）                                                 */
  /* ====================================================================== */

  const S00 = [];

  /* ① 黑幕起 · 麦田全景 · 题字
       2026-11-11：开场改成**真幕布升起**（引擎常驻层，不再用 veil 全黑）。
       顺序：黑场 0.4s → 幕布上升 1.7s → 底幕已就位 → 题字 */
  S00.push({
    id: 'S00-01', name: '① 幕布升起 · 麦田全景 · 题字',
    async run(tok) {
      S.clearAll();
      S.setImage('bgDay', {
        src: P.bgDay, ratio: 16/9, w: W, h: H, x: 0, y: 0, anchor: 'tl',
        z: Z.bg, opacity: 0,
      });
      S.show('bgDay', 0);
      S.transform('bgDay', { scale: 1, x: 0, y: 0 }, 0);
      S.transform('bgDay', { scale: 1.02, x: -14, y: -8 }, 7000, 'linear');

      /* 幕布升起前先黑 0.4s，让人意识到「有东西在动」 */
      await S.wait(400, tok);
      await S.openCurtain();

      /* 标题：羊皮纸底 + 渐隐退出（2026-11-09 用户定）
         退出放在本拍内部完成，不用 title 自带的 holdMs 定时器 ——
         那个定时器靠 gen 守卫，一旦跳拍或本拍 wait 结束就会被判 stale，
         反而让标题停在画面上不走。 */
      S.title('第一节 · 初见赫萝', { top: 150, size: 56, inMs: 1200 });
      await S.wait(1500, tok);      // 等淡入完成
      await S.wait(3200, tok);      // 停留读数
      await S.fade('title', 0, 900); // 渐隐退出
      await S.wait(980, tok);
    },
  });

  /* ② H026 */
  S00.push({
    id: 'S00-02', name: '② H026 追忆开场',
    async run(tok) {
      await say(tok, 'H026', '赫萝：这是很久以前的记忆了。咱在这个村子里，掌管过麦子的丰收。', 420);
      endSub();
    },
  });

  /* ③ H029 —— 之后背景不再换（用户定） */
  S00.push({
    id: 'S00-03', name: '③ H029 曾被称为神',
    async run(tok) {
      await say(tok, 'H029', '赫萝：话虽如此，当年也确实被人叫作神。', 420);
      endSub();
    },
  });

  /* ④ 风吹麦浪（原「推板换景」取消，改为底幕缓推） */
  S00.push({
    id: 'S00-04', name: '④ 风吹麦浪 · 底幕缓推',
    async run(tok) {
      SFXTRACK.play('sfxBreeze', { beat: 'S00-04', vol: 1.0, fadeIn: 600, maxMs: 3200, fadeOut: 1000 });  // 风吹麦浪：0~4.20s
      /* 微风：淡入 600 / 渐出 1000，渐出正好收在拍末（3200+1000=4200=拍长 4.20s）。 */
      S.transform('bgDay', { scale: 1.06, x: -40, y: -16 }, 4200, 'linear');
      await S.wait(4200, tok);
    },
  });

  /* ⑤ L084 —— 男主 + 空马车 从下方道路走上来（边走边说） */
  S00.push({
    id: 'S00-05', name: '⑤ L084 车马沿路走上来（边走边说）',
    async run(tok) {
      // 空车：紧裁后 841×838，内容占比 0.9809
      const cartImgH = CART_BODY_H / CART_CONTENT;
      const cartImgW = cartImgH * CART_RATIO;
      S.setImage('cart', {
        src: P.cartEmpty, ratio: CART_RATIO,
        h: cartImgH, x: CART_CX, y: GY, anchor: 'bc',
        z: Z.cart, opacity: 0,
      });
      // 男主：未改，1032×1544
      const manImgH = MAN_BODY_H / 0.9009;
      const manImgW = manImgH * R_V;
      const cartRight = CART_CX + cartImgW / 2;
      const manCx = cartRight + GAP + manImgW / 2;
      S.setImage('man', {
        src: P.man, ratio: R_V,
        h: manImgH, x: manCx, y: GY, anchor: 'bc',
        z: Z.actor, opacity: 0,
      });

      /* 道路透视（依据背景实测坐标，见 _grid 核对）：
           路面在画面底部 x≈250~880（中心 520），向上收窄，
           消失点在 (650, 280) 附近。
           车马内容整体 x 范围 352~922，中心 637；脚底在 GY=886。
         起始 —— 路的远端：小、偏高、靠路中心（x≈540）
         终止 —— 走到近处：原尺寸、落在地面基线、中心 x=637 */
      const ORG = '700px ' + GY + 'px';   // 缩放锚点：整体中心地面

      const farScale = 0.5;
      const farX = -100;                  // 起点比落位靠左 100px（对准路中心）
      const farY = -254;                  // 起点抬到路面远端（脚底在 y≈632）

      // 先摆到落位，再瞬间拉到远端起点
      S.transform('cart', { x: 0, y: 0, scale: 1, origin: ORG }, 0);
      S.transform('man', { x: 0, y: 0, scale: 1, origin: ORG }, 0);
      S.show('cart', 240);
      S.show('man', 240);
      S.transform('cart', { x: farX, y: farY, scale: farScale, origin: ORG }, 0);
      S.transform('man', { x: farX, y: farY, scale: farScale, origin: ORG }, 0);
      await S.wait(180, tok);

      S.act('man', 'idle', 1);

      /* 三拍走上来 + 边走边说。
         关键：每段位移必须 await 完成再走下一段，否则后一段的 transition
         会覆盖前一段，画面永远停在起点。 */
      // 第 1 拍：远端起步
      S.transform('cart', { x: farX * 0.74, y: farY * 0.74, scale: 0.64, origin: ORG }, 900, 'linear');
      const pM1 = S.transform('man', { x: farX * 0.74, y: farY * 0.74, scale: 0.64, origin: ORG }, 900, 'linear');

      // 边走边说：L084 与走位同时起
      const pSay = say(tok, 'L084', '商人：麦子熟得喜人，风一吹过田里——', 0, 'man');

      await pM1;

      // 第 2 拍：中段
      S.transform('cart', { x: farX * 0.36, y: farY * 0.36, scale: 0.8, origin: ORG }, 1100, 'linear');
      await S.transform('man', { x: farX * 0.36, y: farY * 0.36, scale: 0.8, origin: ORG }, 1100, 'linear');

      // 第 3 拍：走到近处落位
      S.transform('cart', { x: 0, y: 0, scale: 1, origin: ORG }, 1200, E.shift);
      await S.transform('man', { x: 0, y: 0, scale: 1, origin: ORG }, 1200, E.shift);

      /* 台词（L084，2.71s）早播完了，剩下这段走位是空档 → 点缀一声鸟鸣。
         maxMs 压在 2600 以内，保证不跨到下一拍。 */
      SFXTRACK.play('sfxBird', { beat: 'S00-05', vol: 1.0, fadeIn: 250 });   // 台词之后的走位空档，2.38s 自然收
      await pSay;
      endSub();
      await S.wait(200, tok);
    },
  });

  /* ⑥ L085 */
  S00.push({
    id: 'S00-06', name: '⑥ L085 风的形状',
    async run(tok) {
      await say(tok, 'L085', '商人：便能清清楚楚看见风的形状。', 300, 'man');
      endSub();
    },
  });

  /* ⑦ L086/L087 */
  S00.push({
    id: 'S00-07', name: '⑦ L086/L087 那道凹痕',
    async run(tok) {
      await say(tok, 'L086', '商人：被风踩伏的麦穗，那道凹痕', 220, 'man');
      await say(tok, 'L087', '商人：就在辽阔的麦田里自在地奔窜。', 320, 'man');
      endSub();
    },
  });

  /* ⑧ L088 + H023（赫萝画外，不给人物抖动） */
  S00.push({
    id: 'S00-08', name: '⑧ L088/H023 靠麦子出名',
    async run(tok) {
      await say(tok, 'L088', '商人：人们望着这般景象，', 200, 'man');
      await say(tok, 'H023', '赫萝：嗯——这村子从前是靠麦子出名的。', 320, null);
      endSub();
    },
  });

  /* ==========================================================================
   * 守麦之灵的运动规则（2026-11-08 重做）
   * --------------------------------------------------------------------------
   * 台词要求的是「在辽阔的麦田里自在地奔窜」—— 意象是风穿过麦田，不是躲闪。
   * 所以：
   *   ① 全程单向：从左外侧出现 → 一路向右穿出，绝不折返
   *   ② 速度一致：约 430 px/s，段间差异控制在 ±15% 内（原版差 11.7 倍）
   *   ③ y 走一条平滑弧线：先浮起、再下伏，像麦浪被顶起又落下
   *   ④ 抖动是本体小幅高频，与位移分离（位移走 left，抖动走 img transform）
   * ========================================================================== */

  /* 灵的横穿路线：一次性规划好，四拍接力跑完全程 */
  const SPIRIT_PATH = {
    startX: -260,
    endX: 1500,          // 穿出画面右侧
    segs: [              // [目标x, 时长ms, 相对 SPIRIT_Y 的 y 偏移]
      [150, 950, 0],      // 从画外浮入
      [520, 860, -6],     // 顶起麦浪
      [880, 840, -12],    // 到弧顶
      [1150, 640, -8],    // 开始下伏
      [1380, 540, 0],     // 回到麦浪面
      [1620, 560, 10],    // 沉出去
    ],
  };

  /* ⑨ L089 —— 守麦之灵浮现并开始横穿 */
  S00.push({
    id: 'S00-09', name: '⑨ L089 守麦之灵·浮现奔窜',
    async run(tok) {
      const imgW = SPIRIT_BODY_W / 0.9534;
      const imgH = imgW * (1032 / 1544);

      S.setImage('spirit', {
        src: P.spirit, ratio: R_H, w: imgW, h: imgH,
        x: 0, y: 0, anchor: 'tl',
        z: Z.spirit, opacity: 0,
        filter: 'drop-shadow(0 0 14px rgba(255,226,150,.95)) ' +
                'drop-shadow(0 0 30px rgba(255,208,120,.65)) ' +
                'brightness(1.14) saturate(1.05)',
      });
      S.moveCenter('spirit', SPIRIT_PATH.startX, SPIRIT_Y, 0);

      S.fade('spirit', 0.9, 420);
      // 抖动：高频小幅，像麦浪自己在下头攒动
      S.act('spirit', 'idle', 2.6);

      // 第 1~2 段：浮现 + 顶起
      const [x1, d1, y1] = SPIRIT_PATH.segs[0];
      S.moveCenter('spirit', x1, SPIRIT_Y + y1, d1, 'linear');
      const pSay = say(tok, 'L089', '商人：便看见了守麦之灵的身姿。', 0, 'man');
      await S.wait(d1, tok);

      const [x2, d2, y2] = SPIRIT_PATH.segs[1];
      S.moveCenter('spirit', x2, SPIRIT_Y + y2, d2, 'linear');
      await S.wait(d2, tok);

      await pSay;
      endSub();
    },
  });

  /* ⑩ L090/L091 —— 继续单向奔窜到弧顶 */
  S00.push({
    id: 'S00-10', name: '⑩ L090/L091 麦穗色的皮毛·奔窜',
    async run(tok) {
      S.act('spirit', 'idle', 2.4);

      const [x3, d3, y3] = SPIRIT_PATH.segs[2];
      S.moveCenter('spirit', x3, SPIRIT_Y + y3, d3, 'linear');
      const pSay = say(tok, 'L090', '商人：说它披着麦穗般颜色的皮毛，', 0, 'man');
      await S.wait(d3, tok);
      await pSay;

      const [x4, d4, y4] = SPIRIT_PATH.segs[3];
      S.moveCenter('spirit', x4, SPIRIT_Y + y4, d4, 'linear');
      const pSay2 = say(tok, 'L091', '商人：时不时会替人赶跑糟蹋田地的野兽。', 0, 'man');
      await S.wait(d4, tok);

      await pSay2;
      endSub();
    },
  });

  /* ⑪ L092/L093 —— 下伏到麦浪面，继续向右 */
  S00.push({
    id: 'S00-11', name: '⑪ L092/L093 守护神·下伏',
    async run(tok) {
      const [x5, d5, y5] = SPIRIT_PATH.segs[4];
      S.moveCenter('spirit', x5, SPIRIT_Y + y5, d5, 'linear');
      const pSay = say(tok, 'L092', '商人：麦田的守护神。', 0, 'man');
      await S.wait(d5, tok);
      await pSay;

      // L093「然而——」时它正好开始沉出去
      const [x6, d6, y6] = SPIRIT_PATH.segs[5];
      S.moveCenter('spirit', x6, SPIRIT_Y + y6, d6, 'linear');
      await say(tok, 'L093', '商人：然而——', 160, 'man');
      endSub();
    },
  });

  /* ⑫ L094 —— 已经穿出画面，只收尾（灵不再回头动） */
  S00.push({
    id: 'S00-12', name: '⑫ L094 信钱胜过信神',
    async run(tok) {
      // 灵已在上一拍穿出画面右侧，这里只补一次淡出，不做任何位移
      S.fade('spirit', 0, 500);
      await say(tok, 'L094', '商人：信钱胜过信神的商人，对这类传说全不上心。', 200, 'man');
      endSub();
    },
  });

  /* ⑬ L095 —— 装货出发 · **装货特写**
       2026-11-09 用户定：本拍要有「商人装货」的特写。
       素材 S00_图层_商人装货_白底_透明B8.png（原注释说它画风不一致已废弃，
       本轮按用户要求恢复启用，只用于 S00-13/14 这两拍的特写）。

       画面：全黑压暗 + 特写板居中，他在搬货；L095 是旁白式叙述，
       所以 speaker 传 null，不抖任何人（原来抖的是站姿 man，现在被特写盖住）。 */
  S00.push({
    id: 'S00-13', name: '⑬ L095 装货出发 · 装货特写',
    async run(tok) {
      S.act('man', 'none');

      /* 切特写：压暗起来 + 特写淡入 400ms
         2026-11-09 用户定（方案 C）：**加深但不全黑**。
         底图是白天麦田（比夜景亮得多），同样的参数压不住，所以中心和
         中段加深（.30→.45、.72→.85），边缘收在 .90 —— 比基准 .94 浅一点，
         避免把麦田彻底吃掉，还能看出「白天装货」的环境。 */
      const dim = S._layer('dim', Z.fx);
      dim.el.style.background = 'radial-gradient(ellipse at ' +
        CU_CX + 'px ' + CU_CY + 'px,' +
        'rgba(4,6,14,.45) 0%, rgba(4,6,14,.85) 42%, rgba(4,6,14,.90) 100%)';
      S.fade('dim', 1, 400);

      cuShow('cuStock', P.stock, CU.stock, Z.fx + 6, 0);
      S.fade('cuStock', 1, 400);
      await S.wait(400, tok);

      await say(tok, 'L095',
        '商人：那天，年轻商人也照旧把货装上马车，朝着目的地赶路。', 320, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑭ L096「可是——」· 悬住（特写保持，他开口时特写本身抖动） */
  S00.push({
    id: 'S00-14', name: '⑭ L096「可是——」· 悬住',
    async run(tok) {
      await say(tok, 'L096', '商人：可是——', 1000, 'cuStock');
      endSub();
      await S.wait(400, tok);

      /* 收：特写与压暗一起退场，给 S01-01「撤道具」留一个干净的舞台 */
      S.fade('cuStock', 0, 400);
      S.fade('dim', 0, 400);
      await S.wait(400, tok);
    },
  });

  /* ====================================================================== */
  /* S01 · 独行（傍晚→入夜）快剪                                          */
  /* ====================================================================== */

  const S01 = [];

  /* ① 撤道具：装货层整体平移出画
       2026-11-09 改：S00-13 起不再用 merchant 合成层，
       所以要撤的是「空车 + 男主」两个独立层。 */
  S01.push({
    id: 'S01-01', name: '① 撤道具（空车+男主平移出画）',
    async run(tok) {
      SFXTRACK.play('sfxDusk', { beat: 'S01-01', vol: 1.0, fadeIn: 500, maxMs: 9590, fadeOut: 1000 });  // 独行整幕环境：0~10.59s（唯一跨拍）
      /* 黄昏环境：覆盖整个 S01（10.59s = 1.22+2.80+0.12+4.95+1.50）。
         淡入 500 / 渐出 1000，渐出起点 9.59s、终点 10.59s，正好收在 S01 末。
         2026-11-13 用户要求：不要推板结束就掐，要播满整幕再退。 */
      S.act('man', 'none');
      S.act('cart', 'none');
      S.transform('cart', { x: 960 }, 1100, E.push);
      await S.transform('man', { x: 960 }, 1100, E.push);
      S.hide('cart', 160);
      S.hide('man', 160);
      S.clear('cart');
      S.clear('man');
      await S.wait(120, tok);
    },
  });

  /* ② 推板：白天板向右推出，露出夜景板
       2026-11-08 用户定：两捆麦子在这一拍就入场，并且刚好贴到幕边。
       贴边算法：setImage 的 x/y 指的是**图片**的位置，但图片本身有透明留白，
       所以要按「内容边界」反算，不能直接用 0 或 W。
       2026-11-09 白边缩到 4px 后重新紧裁，两捆留白已对称：
         左 693×904  左右各偏 0.87%  底偏 0.66%
         右 742×907  左右各偏 0.81%  底偏 0.66%
       所以贴边要往外多放「留白像素」，内容边才正好压在幕边上。 */
  S01.push({
    id: 'S01-02', name: '② 推板 + 麦捆入场贴幕边',
    async run(tok) {
      S.setImage('bgNight', {
        src: P.bgNight, ratio: 16 / 9, w: W, h: H, x: 0, y: 0, anchor: 'tl',
        z: Z.bgBack, opacity: 0,
      });
      S.show('bgNight', 0);
      S.transform('bgNight', { scale: 1.02, x: 0, y: 0 }, 0);
      S.transform('bgNight', { scale: 1.04, x: -22, y: -10 }, 9000, 'linear');

      /* 麦捆尺寸与贴边（按内容边界反算） */
      const SHEAF_H = 520;                        // 图上高度
      const wL = SHEAF_H * SHEAF_L_RATIO;         // 398.6
      const wR = SHEAF_H * SHEAF_R_RATIO;         // 425.4
      const padL = wL * 0.0087;                   // 左捆左右留白 3.5px
      const padR = wR * 0.0081;                   // 右捆左右留白 3.4px
      const botPad = SHEAF_H * 0.0066;            // 内容底距图底 3.4px

      // 左：内容左边压在 x=0 → 图片 left = -padL
      S.setImage('sheafL', {
        src: P.sheafL, ratio: SHEAF_L_RATIO, h: SHEAF_H,
        x: -padL, y: GY + botPad, anchor: 'bl',
        z: Z.mid, opacity: 0,
      });
      // 右：内容右边压在 x=W → 图片 right = W + padR
      S.setImage('sheafR', {
        src: P.sheafR, ratio: SHEAF_R_RATIO, h: SHEAF_H,
        x: W + padR, y: GY + botPad, anchor: 'br',
        z: Z.mid, opacity: 0,
      });

      // 推板的同时两捆麦子从幕外滑入就位
      S.transform('sheafL', { x: -wL - 40 }, 0);
      S.transform('sheafR', { x: wR + 40 }, 0);
      S.fade('sheafL', 1, 200);
      S.fade('sheafR', 1, 200);

      const pDay = S.transform('bgDay', { x: W, y: 0 }, 1500, E.push);
      S.transform('sheafL', { x: 0 }, 1200, E.shift);
      await S.transform('sheafR', { x: 0 }, 1200, E.shift);

      await pDay;
      S.hide('bgDay', 0);
      await S.wait(100, tok);
    },
  });

  /* ③ 降月 + 车马入画（2026-11-09 合并为一拍，同时发生）
       原来分两拍串行：先降月（1530ms）再车马入画（1560ms），共 3090ms。
       合并后两件事同框进行，取较长者 1560ms，省下 1530ms。
       视觉上也更像舞台换景：月亮往下走，车马从侧幕推上来。 */
  S01.push({
    id: 'S01-03', name: '③ 降月 + 车马入画（同时）',
    async run(tok) {
      /* ---- 月亮下落 ---- */
      S.setImage('moon', {
        src: P.moon, ratio: R_SQ, h: 310, x: 1200, y: -60, anchor: 'tc',
        z: Z.props, opacity: 0,
      });
      S.transform('moon', { y: -260 }, 0);
      S.show('moon', 140);
      S.transform('moon', { y: 0 }, 1350, E.push);   // 不 await，与车马并行

      /* ---- 空车 + 男主从右侧入画 ---- */
      const cartCx = 700;
      const cartImgH = CART_BODY_H / CART_CONTENT;
      const cartImgW = cartImgH * CART_RATIO;
      S.setImage('cart', {
        src: P.cartEmpty, ratio: CART_RATIO, h: cartImgH,
        x: cartCx, y: GY, anchor: 'bc',
        z: Z.cart, opacity: 0,
      });
      const manImgH = MAN_BODY_H / 0.9009;
      const manImgW = manImgH * R_V;
      const manCx = cartCx + cartImgW / 2 + manImgW / 2 - 30;
      S.setImage('man', {
        src: P.man, ratio: R_V, h: manImgH,
        x: manCx, y: GY, anchor: 'bc',
        z: Z.actor, opacity: 0,
      });

      S.moveTo('cart', cartCx - cartImgW / 2 + 820, GY - cartImgH, 0);
      S.moveTo('man', manCx - manImgW / 2 + 820, GY - manImgH, 0);
      S.show('cart', 200);
      S.show('man', 200);
      S.moveTo('cart', cartCx - cartImgW / 2, GY - cartImgH, 1500, E.shift);
      await S.moveTo('man', manCx - manImgW / 2, GY - manImgH, 1500, E.shift);

      S.act('man', 'idle', 1);
      S.act('cart', 'idle', 0.6);

      /* 夜间打光（2026-11-09 用户定）：
         角色立绘在夜景里要有一盏暖光，像舞台追光。
         特写镜头不打光 —— 特写靠压暗+自身亮度，再加光斑会糊。
         光斑收紧、降低强度，只做「脚下有光」的暗示，不要糊成一片白雾。 */
      S.spot('manLight', {
        x: manCx, y: GY - 40, r: manImgW * 0.75, opacity: 0.5,
      });
      S.spot('cartLight', {
        x: cartCx, y: GY - 30, r: cartImgW * 0.65, opacity: 0.34,
      });

      await S.wait(120, tok);
    },
  });

  /* ④ 叹气特写 + H015 */
  S01.push({
    id: 'S01-04', name: '④ 叹气 · H015「什么都要钱」',
    async run(tok) {
      const dim = S._layer('dim', Z.fx);
      dim.el.style.background = '#000';
      S.fade('dim', 0.6, 300);

      S.setImage('sigh', {
        src: P.sigh, ratio: R_V, h: 640, x: W / 2, y: H / 2, anchor: 'mc',
        z: Z.fx + 5, opacity: 0,
      });
      S.transform('sigh', { scale: 0.95 }, 0);
      S.show('sigh', 260);
      await S.transform('sigh', { scale: 1 }, 440, E.shift);

      await say(tok, 'H015', '赫萝：人世间，什么都要钱嘛。', 260, null);
      endSub();

      await S.fade('sigh', 0, 340);
      await S.fade('dim', 0, 340);
      await S.wait(300, tok);
    },
  });

  /* ⑤ 动静 · 收尾（2026-11-09 合并）
       2026-11-09 用户定 1.5 秒，只保留两个动作：
         ① 车身轻微一晃
         ② 男主停住，头转向车
       无台词——用动作交代「车里有东西」，
       观众带着这个悬念进入 S02 掀布。 */
  S01.push({
    id: 'S01-05', name: '⑤ 动静 · 车一晃男主转头',
    async run(tok) {
      S.act('man', 'idle', 1);
      S.act('cart', 'idle', 0.6);

      /* ① 车身轻微一晃：左右 3px，两次，共 600ms */
      S.transform('cart', { x: 3 }, 150, E.shift);
      await S.wait(150, tok);
      S.transform('cart', { x: -3 }, 150, E.shift);
      await S.wait(150, tok);
      S.transform('cart', { x: 0 }, 300, E.shift);
      await S.wait(300, tok);

      /* ② 男主停住，头转向车：整层轻微左移 + 极小幅旋转，共 600ms */
      S.act('man', 'none');
      S.transform('man', { x: -12, rotate: -2.5 }, 600, E.shift);
      await S.wait(600, tok);

      /* 收：定住 300ms 让观众意识到「里面有东西」 */
      await S.wait(300, tok);    },
  });

  /* ====================================================================== */
  /* S02 · 掀布（67.0~79.5s，12.5s）— 静默动作镜                            */
  /* ====================================================================== */
  /* 分镜要求：
       【帧】A 麻布覆满 → B 掀起一半（定格 2s，只露轮廓与发）→ C 全掀
       【声】几乎全静默；H063「呼……」画外不出字幕 / H905 极轻呼吸 sfx
             / L066「谁能想到，货堆里竟钻着个人，可把我吓了一跳！」4.44s
       【位】麻布下的赫萝躺在货堆上，车已在 S01 留在场上

     五帧素材实测（1032×1544，比例统一 0.6684）：
       A 盖到头只露两耳   内容占比 0.8556
       C 半透明麻布覆盖   内容占比 0.7940
       B 盖到胸露脸       内容占比 0.8212  （S03 的帧，借用）
       C2 盖到腰膝        内容占比 0.8199  （S03 的帧，借用）
       全掀 俯视蜷睡      内容占比 0.8025

     摆位：赫萝躺姿，内容高按画幕 42%（390px），躺平在货台上。 */

  const S02 = [];

  /* ------------------------------------------------------------------
   * S02 特写镜（2026-11-09 用户定）
   * ------------------------------------------------------------------
   * 手法照 S01-06「钱袋/叹气」：四周压黑，中间只留一张特写。
   *
   * 三条要求：
   *   ① 三张赫萝特写切换，**中间点不变** —— 不能让画面跳一下
   *   ② 淡入淡出式变化（交叉淡入，不是硬切）
   *   ③ 男主从睡姿渐变成「伸手」那张，也用同一套特写手法
   *
   * 中间点怎么保证：
   *   每张图的内容框中心在图片里的位置都不一样（实测 dx 从 -27 到 +55），
   *   所以不能简单用 anchor:'mc'（那是图片中心，不是内容中心）。
   *   这里预先把每张图的「内容中心在图片内的偏移」算成常量，
   *   摆位时反算 left/top，让四张图的**内容中心**都落在同一个舞台坐标。
   *
   * 四张实测（1032×1544，内容高比 / 内容中心在图片内偏移）：
   *   S02A 盖到头   0.8556  中心 (156, 223)
   *   S02B 盖到胸   0.8212  中心 (169, 235)
   *   S02C 全掀睡   0.8025  中心 (180, 243)
   *   S03  伸手     0.7953  中心 (155, 253)
   * ------------------------------------------------------------------ */

  /* 特写统一参数 */
  const CU_BODY_H = Math.round(STAGE_H * 0.62);   // 内容高 = 画幕 62%（575px）
  const CU_CX = W / 2;                            // 内容中心 X（舞台中央）
  const CU_CY = 470;                              // 内容中心 Y（偏上，给字幕留位）

  /* 双人同框（2026-11-09 用户定）
       S02-02 起「男主在左 / 赫萝在右」两人同时在场。
       两条硬约束（2026-11-09 实测修正）：
         ① 不能中心对齐 —— 两人内容高不同，中心对齐会让人悬空。
            改成「底部对齐 DUO_BASE_Y」，两人都踩在同一地面上。
         ② 间距要压紧 —— 男主内容宽/高 0.514、赫萝 0.666，
            同高并排总共才 637px，放在 1632 宽的舞台上会散成两半。
            所以放大到画幕 0.68 高、间隙压到 46。
       ⚠ 这些常量依赖 CU，必须声明在 CU 之后。 */
  const DUO_HORO_H = Math.round(STAGE_H * 0.70);          // 赫萝内容高（650）
  /* 2026-11-09 用户定：男主太小，放大。
     伸手图是俯身姿态（内容宽/高 0.514），按内容高排会显得比赫萝矮一截，
     所以直接给到 720（赫萝的 1.11 倍），视觉上两人才压得住同一个特写框。 */
  const DUO_HAND_H = 720;                                 // 男主内容高（原 572）
  const DUO_GAP = 34;                                     // 两人内容框之间空隙
  const DUO_BASE_Y = GY - 18;                             // 两人共同的「落脚线」

  /* 每张图：内容高比 + 内容中心在「按内容高归一后的图片」里的位置 */
  const CU = {
    A: { ratio: 0.8556, cx: 156, cy: 223, w: 305, h: 456 },
    B: { ratio: 0.8212, cx: 169, cy: 235, w: 317, h: 475 },
    C: { ratio: 0.8025, cx: 180, cy: 243, w: 325, h: 486 },
    hand: { ratio: 0.7953, cx: 155, cy: 253, w: 328, h: 490 },
    /* S04 撑起半身：实测内容 905×1316、内容高比 0.8523
       内容中心原图 (546,726) → 归一后 cx/w=0.5291、cy/h=0.4702
       统一取 w=305/h=456 基准，反算 cx=161、cy=214 */
    up: { ratio: 0.8523, cx: 161, cy: 214, w: 305, h: 456 },
    /* S05 吃肉干：实测内容 910×1453、内容高比 0.9411
       内容中心原图 (541,816) → cx/w=0.5242、cy/h=0.5285
       同基准反算 cx=160、cy=241 */
    eat: { ratio: 0.9411, cx: 160, cy: 241, w: 305, h: 456 },
    /* 拣肉干：图 748×1172（ratio 0.6382），内容高比 0.9863，中心归一 (0.5,0.5)
       → h=456 基准，w=456×0.6382=291，cx=146、cy=228 */
    pick: { ratio: 0.9863, cx: 146, cy: 228, w: 291, h: 456 },
    /* 吃前（手举到嘴边）：图 752×1251（ratio 0.6011），内容高比 0.9872，中心 (0.5,0.5)
       → h=456，w=456×0.6011=274，cx=137、cy=228 */
    pre: { ratio: 0.9872, cx: 137, cy: 228, w: 274, h: 456 },
    /* 装货特写（S00-13/14）：708×586（ratio 1.2082），内容 692×570
       内容高比 0.9727，中心正中 (0.5,0.5)
       → h=456 基准，w=456×1.2082=551，cx=275、cy=228 */
    stock: { ratio: 0.9727, cx: 275, cy: 228, w: 551, h: 456 },
    /* S06 上下打量：内容高比 0.9216，中心归一 (0.5378, 0.5379)
       → h=456，w=304.8，cx=164、cy=245 */
    look: { ratio: 0.9216, cx: 164, cy: 245, w: 305, h: 456 },
    /* S06 凑近卖关子：内容高比 0.9780，中心归一 (0.5707, 0.5097)
       → h=456，w=304.8，cx=174、cy=232 */
    lean: { ratio: 0.9780, cx: 174, cy: 232, w: 305, h: 456 },
    /* S07 男主拔剑特写：内容高比 0.9644，中心归一 (0.4971, 0.5165)
       → h=456，w=304.8，cx=152、cy=236 */
    sword: { ratio: 0.9644, cx: 152, cy: 236, w: 305, h: 456 },
    /* S07 赫萝大笑：707×1234（ratio 0.5729），高比 0.9862，中心 (0.5,0.5)
       → h=456，w=261.2，cx=131、cy=228 */
    laugh: { ratio: 0.9862, cx: 131, cy: 228, w: 261, h: 456 },
    /* S07 罗伦斯恼羞：559×1205（ratio 0.4639），高比 0.9867，中心 (0.5,0.5)
       → h=456，w=211.5，cx=106、cy=228 */
    angry: { ratio: 0.9867, cx: 106, cy: 228, w: 212, h: 456 },
    /* S10 帧A 两人并肩：内容 834×833，高比 0.5395，中心归一 (0.5155, 0.4932)
       → h=456 基准，w=304.8，cx=157、cy=225 */
    road: { ratio: 0.5395, cx: 157, cy: 225, w: 305, h: 456 },
    /* S10 帧B 侧坐回望：692×1341（ratio 0.5160），高比 0.9881，中心 (0.5,0.5)
       → h=456，w=235.3，cx=118、cy=228 */
    roadB: { ratio: 0.9881, cx: 118, cy: 228, w: 235, h: 456 },
    /* 原「帧B 动画三帧」CU（roadB1/roadB2/roadB3）已于 2026-11-12 删除：
       那三帧被用户重抠的五帧（lookB，见下）取代，素材与条目都不再引用。 */

    /* ---- S10 夜话特写十张（2026-11-12 实测，基准 h=456 与上面同口径） ----
       ⚠ ratio 字段是「内容高比」不是宽高比（cuPlace 用 imgH = bodyH / ratio），
         w/h 才是图片宽高比。十张内容高比 0.9886~0.9893、中心归一 (0.4994~0.4995, 0.4996~0.4997)，
         所以 cx/cy 几乎相同，只有 w 随各自图片宽高比变化。 */
    betray: { ratio: 0.9890, cx: 145, cy: 228, w: 291, h: 456 },
    beg: { ratio: 0.9889, cx: 153, cy: 228, w: 306, h: 456 },
    wrath: { ratio: 0.9893, cx: 137, cy: 228, w: 275, h: 456 },
    /* wrath2 必须与 wrath 同 cx：6a→6b 是 90ms 快切，位置差 >1px 就会跳 */
    wrath2: { ratio: 0.9892, cx: 137, cy: 228, w: 274, h: 456 },
    north: { ratio: 0.9886, cx: 155, cy: 228, w: 310, h: 456 },
    /* turn：2026-11-13 换图（旅行前兴奋，seed 884811）
       911×1499，内容高比 0.9893，中心归一 (0.4995, 0.4997) */
    turn: { ratio: 0.9893, cx: 137, cy: 228, w: 275, h: 456 },
    /* l916：罗伦斯按头思考（seed 885111），S10-07 专用
       1024×1451，内容高比 0.9890，中心归一 (0.4995, 0.4997) */
    l916: { ratio: 0.9890, cx: 160, cy: 228, w: 320, h: 456 },
    smile: { ratio: 0.9889, cx: 147, cy: 228, w: 294, h: 456 },
    peek: { ratio: 0.9888, cx: 163, cy: 228, w: 326, h: 456 },
    stretch: { ratio: 0.9890, cx: 127, cy: 228, w: 254, h: 456 },
    ask: { ratio: 0.9890, cx: 140, cy: 228, w: 281, h: 456 },
    /* S10-01 麦束（复用 S01 月下麦捆左）：681×892，内容高比 0.9787，
       中心归一 (0.4971, 0.4978) */
    sheaf: { ratio: 0.9787, cx: 173, cy: 227, w: 348, h: 456 },
    /* S10-07 罗伦斯叹气（复用 S01 侧面叹气 v5 定妆一致）：1032×1544，
       内容高比 0.9430，中心归一 (0.5635, 0.5269) —— 内容明显偏右，cx 要按这个算 */
    sigh: { ratio: 0.9430, cx: 172, cy: 240, w: 305, h: 456 },
    /* S11-08 回望五帧（裁板版五张同尺寸 889×1332、内容中心 444/666，共用这一条）：
       图比 0.6674，内容高比 0.9872，中心归一 (0.4994, 0.5000) */
    lookB: { ratio: 0.9872, cx: 152, cy: 228, w: 304, h: 456 },
  };

  /* 两人内容宽（按内容高 × 内容宽高比），用于反算左右焦点与间距 */
  const HORO_CU_W = DUO_HORO_H * (844 / 1268);   // 赫萝 S02B 内容宽/高
  const HAND_CU_W = DUO_HAND_H * (631 / 1228);   // 男主伸手内容宽/高
  /* ⚠ DUO_SPAN 是「内容中心」间距，所以是半宽 + 间隙 + 半宽。
     写成 w1 + gap + w2 会把间距放大近一倍（2026-11-09 踩过）。 */
  const DUO_SPAN = HAND_CU_W / 2 + DUO_GAP + HORO_CU_W / 2;
  const DUO_X_L = CU_CX - DUO_SPAN / 2;               // 男主内容中心 X
  const DUO_X_R = CU_CX + DUO_SPAN / 2;               // 赫萝内容中心 X

  /* 双人位摆图：给内容高 + 内容中心 X，让内容底边落在 DUO_BASE_Y
     ⚠ py 是「内容中心」在图片内的 Y，所以内容底边 = py + bodyH/2。
        减 py 会让整张图往下推半个内容高，人被顶出画外。 */
  function duoPlace(spec, bodyH, cx) {
    const imgH = bodyH / spec.ratio;
    const imgW = imgH * (spec.w / spec.h);   // 用 spec 记录的实际比例，别硬编码
    const px = spec.cx / spec.w * imgW;
    const py = spec.cy / spec.h * imgH;
    return {
      imgW, imgH,
      left: cx - px,
      top: DUO_BASE_Y - (py + bodyH / 2),
    };
  }

  /* 按内容高把图缩放到 bodyH，返回 {imgW, imgH, left, top}，
     使内容中心落在 (cx, cy)。
     ⚠ 图片宽高比必须取 spec.w / spec.h，**不能硬编码 1032×1544**：
       那套尺寸只适用于老素材；本轮新增的拣肉干(748×1172)、吃前(752×1251)、
       装货带马车(708×586) 都不是这个比例，硬编码会把它们拉变形/算错位置。 */
  function cuPlace(spec, bodyH, cx, cy) {
    const bh = bodyH === undefined ? CU_BODY_H : bodyH;
    const px0 = cx === undefined ? CU_CX : cx;
    const py0 = cy === undefined ? CU_CY : cy;
    const imgH = bh / spec.ratio;          // 内容高比 → 图片高
    const imgW = imgH * (spec.w / spec.h); // 用 spec 里记录的实际比例
    const px = spec.cx / spec.w * imgW;    // 内容中心在图片内的 X
    const py = spec.cy / spec.h * imgH;    // 内容中心在图片内的 Y
    return {
      imgW, imgH,
      left: px0 - px,
      top: py0 - py,
    };
  }

  /* 摆一张特写（用 tl 锚点 + 精确 left/top，绕开图片留白）
     ⚠ 必须把 cuPlace 算出的 w/h 一起传给 setImage：
       setImage 的 ratio 会用 w = h * ratio 覆盖宽度，
       如果继续传 R_V（1032/1544），非该比例的素材（拣肉干/吃前/装货带马车）
       就会被横向压扁。 */
  function cuShow(name, src, spec, z, opacity, bodyH, cx, cy) {
    const p = cuPlace(spec, bodyH, cx, cy);
    S.setImage(name, {
      src, w: p.imgW, h: p.imgH, ratio: p.imgW / p.imgH,
      x: p.left, y: p.top, anchor: 'tl',
      z: z, opacity: opacity === undefined ? 0 : opacity,
    });
    return p;
  }

  /* 摆一张双人位特写（底部对齐地面，不用中心对齐）
     同样要把 w/h 一起传，别让 setImage 用 R_V 覆盖宽度。 */
  function duoShow(name, src, spec, z, opacity, bodyH, cx) {
    const p = duoPlace(spec, bodyH, cx);
    S.setImage(name, {
      src, w: p.imgW, h: p.imgH, ratio: p.imgW / p.imgH,
      x: p.left, y: p.top, anchor: 'tl',
      z: z, opacity: opacity === undefined ? 0 : opacity,
    });
    return p;
  }

  /* 舞台站位（S02-04 待命状态用）
       男主：与 S01-03 实测一致 —— cartCx(700) + 车半宽(296.85)
             + 人半宽(206.65) - 30 = 1173.5，改这里要同步 S01-03
       赫萝：车左边缘是 403，站 300 让她的内容右缘（405）正好贴住车边 */
  const STAGE_MAN_CX = 1173.5;
  /* 赫萝缩在车厢里的位置（S02-04 / S03 用）
     车：中心 700、宽 593.7、高 591.6、底边 886 → 车顶 294

     2026-11-09 用户第三轮：给出车区裁切图，画红框指定位置。
     红框 = 车斗内部（座椅+地板那一片），换算到舞台约
       x 553~771、y 462~712，中心 (660, 585)。
     **位置下沉是解决「浮在车篷上」的关键**：
       之前内容顶 160 高于车篷顶 294，头顶露在篷外 → 看着在车顶；
       现在内容顶 380 低于车篷顶 294? 不 —— 380 仍高于 294，
       但整块图落在车斗开口范围内，车篷拱形在画面上方把它框住，
       读作「躺在车斗里」。

     尺寸：她站着内容高 501（男主的 0.90），躺着蜷缩 ≈ 站高 0.64 → 320。
     用 S02_C 全掀蜷睡（内容 793x1239，宽/高 0.640，bbox y152~1390）：
       内容高 320 → imgH = 320/0.8025 = 398.8，imgW = 266.6
       内容底落 700（车斗地板），内容底距图底 = 153*0.2583 = 39.5
       → 图片底 739.5 → lift = 886-739.5 = 146.5
       内容中心归一 0.5533 → 偏图心 0.0533×266.6 = 14.2
       内容中心给 660 → 图片中心 = 645.8
     ⚠ place() 的 anchor:'bc' 对齐的是**图片底边**，lift 按图片底边算。 */
  const CART_IN_HORO_CX = 646;
  const CART_IN_HORO_LIFT = 146.5;
  const CART_IN_HORO_H = 320;

  /* ① 麻布覆满（帧 A）+ 压暗 */
  S02.push({
    id: 'S02-01', name: '① 特写·麻布覆满只露两耳',
    async run(tok) {
      SFXTRACK.play('sfxOwl05', { beat: 'S02-01', vol: 1.0, fadeIn: 180 });   // 掀布开场：0.5s 起，1.60s 自然收
      // 压暗层：像 S01-06 那样把周围吃掉
      /* 压暗层：椭圆半径按两人占位放大，让麦田和麦捆退到背景里，
         但中心区留足够亮度，不然人会糊在黑暗里看不清。
         2026-11-09 用户定：中心 .30 / 边缘 .94 是原定值，这里保持不变。 */
      const dim = S._layer('dim', Z.fx);
      dim.el.style.background = 'radial-gradient(ellipse ' +
        Math.round(DUO_SPAN * 0.62) + 'px ' + Math.round(DUO_HORO_H * 0.55) + 'px at ' +
        CU_CX + 'px ' + (CU_CY + 40) + 'px,' +
        'rgba(4,6,14,.30) 0%, rgba(4,6,14,.72) 42%, rgba(4,6,14,.94) 100%)';
      S.fade('dim', 1, 600);

      cuShow('cuA', P.s02A, CU.A, Z.fx + 5, 0);
      S.transform('cuA', { scale: 0.965 }, 0);
      S.show('cuA', 500);
      await S.transform('cuA', { scale: 1 }, 900, E.shift);

      // H063「呼……」画外，不出字幕
      await S.play('H063');
      await S.wait(300, tok);

      // 呼吸起伏
      S.act('cuA', 'idle', 1.2);
      await S.wait(500, tok);
    },
  });

  /* ② 盖到胸（帧 B）+ 男主伸手同场 —— 交叉淡入，中心不动
       2026-11-09 用户定：男主和赫萝在这一拍一起出场，男主在左、赫萝在右。
       原来 S02-04 单独才登场的伸手图，现在提前到这里，与赫萝并排。 */
  S02.push({
    id: 'S02-02', name: '② 特写·盖到胸 + 男主伸手（双人同框）',
    async run(tok) {
      SFXTRACK.play('sfxCloth01', { beat: 'S02-02', vol: 1.0, fadeIn: 0 });   // 他抓住麻布往上掀
      /* 站姿 man / 半透明 cart 先退掉：
         伸手图里是完整俯身男主，站姿那个还留着会看成两个人。 */
      S.act('man', 'none');
      S.fade('man', 0, 400);
      S.fade('cart', 0, 400);

      /* 男主（左）：伸手图，底部对齐 DUO_BASE_Y */
      duoShow('cuHand', P.s03Hand, CU.hand, Z.fx + 6, 0, DUO_HAND_H, DUO_X_L);
      /* 赫萝（右）：盖到胸，同样底部对齐 */
      duoShow('cuB', P.s02B, CU.B, Z.fx + 6, 0, DUO_HORO_H, DUO_X_R);

      /* 交叉淡入 800ms：A 淡出，男主 + 赫萝同时淡入 */
      S.fade('cuA', 0, 800);
      S.fade('cuHand', 1, 800);
      S.fade('cuB', 1, 800);
      await S.wait(800, tok);

      /* 2026-11-09 用户定：男主位置在 S02-02 / S02-03 两拍之间必须不动，
         所以这里不再做 scale 前探（前探会改图层变换，
         和 S02-03 的静止状态叠加后位置算不准）。
         只给一个不改变几何的呼吸。 */
      S.act('cuHand', 'idle', 0.5);

      // 定格，让观众看清两人同框
      await S.wait(2000, tok);
    },
  });

  /* ③ 全掀（帧 C）—— 交叉淡入 + L066
       赫萝从「盖到胸」变成「全掀蜷睡」，男主保持伸手不动。 */
  S02.push({
    id: 'S02-03', name: '③ 特写·全掀蜷睡（交叉淡入）',
    async run(tok) {
      SFXTRACK.play('sfxCloth02', { beat: 'S02-03', vol: 1.0, fadeIn: 0 });   // 第二下彻底掀开
      duoShow('cuC', P.s02Open, CU.C, Z.fx + 7, 0, DUO_HORO_H, DUO_X_R);

      S.fade('cuB', 0, 900);
      S.fade('cuC', 1, 900);
      await S.wait(900, tok);

      // L066 罗伦斯台词（画外）
      await say(tok, 'L066', '罗伦斯：谁能想到，货堆里竟钻着个人，可把我吓了一跳！', 280, null);
      endSub();
    },
  });

  /* ④ 回到舞台 · 两人立绘待命（赫萝左 / 男主右）
       2026-11-09 用户定：这一拍**不要特写**，
       回到正常舞台，两人以默认立绘待命 —— 赫萝站左边、男主站右边。
       所以特写层全退、压暗层淡出，恢复夜间追光的舞台感。 */
  S02.push({
    id: 'S02-04', name: '④ 回到舞台 · 赫萝躺着 / 男主站右',
    async run(tok) {
      // 特写层全部退场
      S.fade('cuA', 0, 600);
      S.fade('cuB', 0, 600);
      S.fade('cuC', 0, 600);
      S.fade('cuHand', 0, 600);
      // 压暗层淡出，舞台重新亮起来
      S.fade('dim', 0, 800);
      // 车恢复不透明（S02-02 把它淡掉了）
      S.fade('cart', 1, 700);

      /* 2026-11-09 用户定（第二轮）：赫萝**不起身**，一直躺在车斗里。
         原本这里给她摆过站姿立绘，但 S04 规格是「蜷卧 → 撑起半身」，
         她要是先站起来，S04 就得跳回躺姿，断层。
         所以这里让她缩在车厢里、只露上半身，S03 喊她不应，S04 才撑起。 */
      const horoInCart = place('horo', P.s02Open, CART_IN_HORO_H, CART_IN_HORO_CX, {
        bodyRatio: 0.8025, ratio: R_V, z: Z.actor + 2, opacity: 0,
        lift: CART_IN_HORO_LIFT,
      });

      /* 男主立绘：站右边，坐标与 S01-03 完全一致，不会跳位。
         S02-02 只是把 opacity 压到 0，这里重新 setImage 一次确保位置与尺寸
         回到舞台版（特写用的是另一套尺寸）。
         ⚠ 必须把图层 transform 归零 —— S01-05「转头」留过 x:-12，
            setImage 只改 img 的 left/top，不会复位图层 transform，
            不清掉的话男主会一直整体偏左 12px。 */
      const manLayer = S.layers.get('man');
      if (manLayer) {
        manLayer.el.style.transition = 'none';
        manLayer.el.style.transform = '';
        manLayer.tf = null;
      }
      place('man', P.man, MAN_BODY_H, STAGE_MAN_CX, {
        bodyRatio: 0.9009, ratio: R_V, z: Z.actor, opacity: 0,
      });

      S.fade('horo', 1, 800);
      S.fade('man', 1, 800);
      await S.wait(820, tok);

      /* 夜间打光：立绘要打，特写不打（用户定的规则）。
         赫萝缩在车厢里，光斑打在她身上、半径收小，别照亮整个车斗。
         男主的光斑 S01-03 已经建过（manLight，位置同为 STAGE_MAN_CX），
         这里**不要重建** —— spot() 复用同名图层会覆盖半径，
         把 S01-03 调好的 309.9px 改成新的值。 */
      S.spot('horoLight', {
        x: CART_IN_HORO_CX, y: GY - CART_IN_HORO_LIFT - 30,
        r: horoInCart * R_V * 0.60, opacity: 0.42,
      });

      // 待命呼吸
      S.act('man', 'idle', 1);
      S.act('horo', 'idle', 0.7);
      await S.wait(700, tok);

      /* 收尾兜底（原 S02-05 的职责，已合并进来）：
         特写层归零并去掉变换，保证不带残留透明度进入 S03。
         只归零 opacity、不设 display:none —— fade() 只改 opacity，
         设了 display:none 之后没有代码会把它恢复，层就永久消失了。 */
      ['cuA', 'cuB', 'cuC', 'cuHand', 'cuHandBig'].forEach((n) => {
        const L = S.layers.get(n);
        if (L) { L.el.style.opacity = '0'; L.el.style.transform = 'none'; L.tf = null; }
      });
      S.fade('cart', 1, 300);
    },
  });

  /* 2026-11-09 用户定：**删除原 S02-05「收·定住」**（900ms 空镜，白占时间）。
     它原本只做两件事：dim 淡出、给特写层兜底清场 —— 这两件事
     S02-04 里都已经做了（dim 已 fade 0、特写层已 fade 0），
     所以直接合并进 S02-04 的收尾，S02 从 5 拍变 4 拍。 */

  /* ====================================================================== */
  /* S03 · 喊人（79.5~92.0s，12.5s）                                        */
  /* ====================================================================== */
  /* 规格来源：分镜-草案-v6-208s.md 第 189~206 行
       【声】L226「喂！」→ 静默 1.5s → L902「喂！我说的你啊！」
             → 静默 1.5s → L069 自辩
             **两次静默是节奏核心，砍了就散**
       【位】承 S02-04 的舞台状态：赫萝缩在车厢里（不起身）、男主站右、车在后
             → S04 她才「蜷卧 → 撑起半身」，所以这里她始终不出车厢

     实测时长（与规格有出入，按实测排）：
       L226  0.73s（规格写 0.36s）
       L902  2.36s（一致）
       L069  4.31s（规格写 3.94s）
       合计 7.40s，配两次静默 3.0s = 10.40s
       剩余 2.10s 分给起手 800 + 两次前摇 600 + 收尾 700

     表现手法（遵守用户定的风格）：
       · 说话只用抖动（S.talk，由 say() 内部调用）
       · 男主的「前倾 / 后仰」用图层 transform，绕脚下转（origin 给脚心），
         不动 img 的 left/top —— 两套坐标系不混用
       · 赫萝全程无台词，只用呼吸与一次极轻的动静表示「在听但不理」 */

  const S03 = [];

  /* 男主旋转轴心：绕脚下转才像人身体倾斜，绕 '0 0' 会整体飘走
       男主 img 413.2×618.3 → 脚心 (207, 618)
       赫萝 img 218.0×508.1 → 脚心 (109, 508) */
  const MAN_ORIGIN = '207px 618px';
  const HORO_ORIGIN = '109px 508px';

  /* ① 承前 · 两人定住（0.80s） */
  S03.push({
    id: 'S03-01', name: '① 承前 · 男主定住（赫萝在车里）',
    async run(tok) {
      S.act('man', 'idle', 1);
      S.act('horo', 'idle', 1);
      // 男主身体微侧向赫萝那边，做「准备开口」的起手
      S.transform('man', { rotate: -1.2, origin: MAN_ORIGIN }, 600, E.shift);
      await S.wait(800, tok);
    },
  });

  /* ② L226「喂！」—— 试探（0.73s 实测） */
  S03.push({
    id: 'S03-02', name: '② L226「喂！」· 试探',
    async run(tok) {
      // 喊人时身体再往前一点
      S.transform('man', { x: -4, rotate: -2.0, origin: MAN_ORIGIN }, 200, E.shift);
      await say(tok, 'L226', '罗伦斯：喂！', 0, 'man');
      await S.wait(60, tok);
    },
  });

  /* ③ 静默 1.5s —— 第一次「没人应」
       节奏核心：这里什么都不做，让观众以为赫萝没听见。 */
  S03.push({
    id: 'S03-03', name: '③ 静默 · 第一次没人应（1.5s）',
    async run(tok) {
      SFXTRACK.play('sfxOwl07', { beat: 'S03-03', vol: 1.0, fadeIn: 150 });   // 第一次没人应
      S.act('man', 'idle', 0.6);   // 男主停在原地等着
      await S.wait(1500, tok);
    },
  });

  /* ④ L902「喂！我说的你啊！」—— 提高音量（2.36s） */
  S03.push({
    id: 'S03-04', name: '④ L902「喂！我说的你啊！」· 提高音量',
    async run(tok) {
      // 前摇：更大幅度前冲 + 转向赫萝，表现「第二次喊、有点急」
      S.transform('man', { x: -16, rotate: -3.4, origin: MAN_ORIGIN }, 300, E.shift);
      await S.wait(300, tok);

      await say(tok, 'L902', '罗伦斯：喂！我说的你啊！', 0, 'man');

      // 喊完稍微回一点，不那么咄咄逼人
      S.transform('man', { x: -8, rotate: -2.4, origin: MAN_ORIGIN }, 300, E.shift);
      await S.wait(300, tok);
    },
  });

  /* ⑤ 静默 1.5s —— 第二次「没人应」，车厢里有极轻的动静
       2026-11-09 用户定：赫萝一直在车里，这一拍不给她立绘动作，
       改成「车身被车厢里的东西碰了一下」——她在里面翻了个身，但没出来。 */
  S03.push({
    id: 'S03-05', name: '⑤ 静默 · 车厢里极轻一动（1.5s）',
    async run(tok) {
      await S.wait(500, tok);
      // 车身向右轻晃 2px 再回，像里面有人动了一下
      S.act('horo', 'idle', 1.6);
      S.transform('cart', { x: 2 }, 180, E.shift);
      await S.wait(180, tok);
      S.transform('cart', { x: -1.5 }, 220, E.shift);
      await S.wait(220, tok);
      S.transform('cart', { x: 0 }, 380, E.shift);
      await S.wait(420, tok);
    },
  });

  /* ⑥ L069 自辩（4.31s）—— 男主自己找台阶下 */
  S03.push({
    id: 'S03-06', name: '⑥ L069 自辩 · 直起身',
    async run(tok) {
      /* 自辩姿态：直起身、略后仰、转回正面。
         从「前倾逼问」变成「退半步解释」，是这一拍的全部动作。 */
      S.transform('man', { x: 0, rotate: 1.4, origin: MAN_ORIGIN }, 500, E.shift);
      await S.wait(300, tok);

      await say(tok, 'L069',
        '罗伦斯：货车里冷不丁钻出个陌生姑娘，换谁不吓一跳？', 0, 'man');
      endSub();
      await S.wait(200, tok);
    },
  });

  /* ⑦ 收 · 定住（0.70s） */
  S03.push({
    id: 'S03-07', name: '⑦ 收 · 定住',
    async run(tok) {
      // 男主归位待命，交给 S04
      S.transform('man', { x: 0, rotate: 0, origin: MAN_ORIGIN }, 400, E.shift);
      S.act('man', 'idle', 1);
      S.act('horo', 'idle', 1);
      await S.wait(700, tok);
    },
  });

  /* ====================================================================== */
  /* S04 · 刚醒（92.0~99.0s，规格 7.0s / 实测 8.03s）                        */
  /* ====================================================================== */
  /* 规格来源：分镜-草案-v6-208s.md 第 210~234 行
       【帧】帧A 蜷卧 → 帧B 撑起半身（交叉淡入），双眼初睁、发丝散乱
       【声】H061 / H062 / H064 三条含糊音，**不出字幕**，条间 0.3~0.5s
       【位】承 S03：赫萝一直在车厢里没出来，这一拍她才撑起身

     实测时长（规格表用的是旧值，全部偏短）：
       H061  2.25s（规格 1.88s）
       H062  0.77s（规格 0.40s）
       H064  0.91s（规格 0.54s）
       合计 3.93s（规格 2.82s），多 1.11s
       → 2026-11-09 用户定：**接受 8.03s**，不剪音频、不砍停顿

     八拍（对齐规格表，只把音频时长换成实测）：
       ① 帧A 蜷卧定格 1.4 ② 淡入帧B 1.0 ③ H061 2.25 ④ 停顿 0.3
       ⑤ H062 0.77 ⑥ 停顿 0.2 ⑦ H064 0.91 ⑧ 收·微晃 1.2   = 8.03s */

  const S04 = [];

  /* ① 帧A 蜷卧定格 */
  S04.push({
    id: 'S04-01', name: '① 帧A 蜷卧定格',
    async run(tok) {
      /* 特写镜：重新压暗（S02-05 把 dim 淡出过）。
         同时把车厢里那个小尺寸的赫萝收掉，别和特写重复。
         2026-11-09：边缘曾试过 .96 想抹平与 S02-01 的亮度差，
         实测只降 0.2（19.9→19.7），证明差异不来自压暗强度，
         已回退 .94 保持与基准一致。 */
      S.fade('horo', 0, 400);

      const dim = S._layer('dim', Z.fx);
      dim.el.style.background = 'radial-gradient(ellipse at ' +
        CU_CX + 'px ' + CU_CY + 'px,' +
        'rgba(4,6,14,.30) 0%, rgba(4,6,14,.72) 42%, rgba(4,6,14,.94) 100%)';
      S.fade('dim', 1, 500);

      cuShow('cuA', P.s02Open, CU.C, Z.fx + 5, 0);
      S.show('cuA', 400);
      await S.wait(1000, tok);

      // 静帧呼吸（刚睡醒，起伏很浅）
      S.act('cuA', 'idle', 0.8);
      await S.wait(400, tok);
    },
  });

  /* ② 交叉淡入到帧B 撑起半身 */
  S04.push({
    id: 'S04-02', name: '② 淡入帧B 撑起半身',
    async run(tok) {
      cuShow('cuA2', P.s04Up, CU.up, Z.fx + 6, 0);
      S.fade('cuA', 0, 1000);
      S.fade('cuA2', 1, 1000);
      await S.wait(1000, tok);
      S.act('cuA2', 'idle', 0.9);
    },
  });

  /* ③ H061「唔————」1.88→实测 2.25 */
  S04.push({
    id: 'S04-03', name: '③ H061「唔————」',
    async run(tok) {
      // 不出字幕，只出声 + 轻微抖动
      S.talk('cuA2', 2);
      await S.play('H061');
      S.act('cuA2', 'idle', 0.9);
      await S.wait(0, tok);
    },
  });

  /* ④ 停顿 0.3 */
  S04.push({
    id: 'S04-04', name: '④ 停顿',
    async run(tok) {
      await S.wait(300, tok);
    },
  });

  /* ⑤ H062「嗯————」0.40→实测 0.77 */
  S04.push({
    id: 'S04-05', name: '⑤ H062「嗯————」',
    async run(tok) {
      S.talk('cuA2', 1.6);
      await S.play('H062');
      S.act('cuA2', 'idle', 0.9);
      await S.wait(0, tok);
    },
  });

  /* ⑥ 停顿 0.2 */
  S04.push({
    id: 'S04-06', name: '⑥ 停顿',
    async run(tok) {
      await S.wait(200, tok);
    },
  });

  /* ⑦ H064「哦。」0.54→实测 0.91 */
  S04.push({
    id: 'S04-07', name: '⑦ H064「哦。」',
    async run(tok) {
      S.talk('cuA2', 1.4);
      await S.play('H064');
      S.act('cuA2', 'idle', 0.9);
      await S.wait(0, tok);
    },
  });

  /* ⑧ 收 · 微晃 1.2 */
  S04.push({
    id: 'S04-08', name: '⑧ 收 · 微晃',
    async run(tok) {
      /* 刚睡醒的迟钝：极轻地晃一下，然后定住。
         收的时候不撤压暗、不撤特写 —— 交给 S05 接着演。 */
      S.transform('cuA2', { x: -6, rotate: -0.8, origin: '0 0' }, 500, E.shift);
      await S.wait(500, tok);
      S.transform('cuA2', { x: 0, rotate: 0, origin: '0 0' }, 600, E.shift);
      await S.wait(700, tok);
      S.act('cuA2', 'idle', 1);
    },
  });

  /* ====================================================================== */
  /* S05 · 初见（99.0~119.0s，20.0s）                                        */
  /* ====================================================================== */
  /* 规格来源：分镜-草案-v6-208s.md 第 238~258 行
       【帧】静坐 → 前倾 8% 探身（淡入 0.8s），视线偏上，手搭货台
       【题】「……呼，真是好月色，有没有酒啊?」（上方小字题字，淡入 1s 停 4s
             淡出，**不配音** —— 这是本镜的题眼，规格明说不能砍）
       【声】H901 4.47 / H902 4.10 / L903 2.24 / H032 0.84
       【位】赫萝坐在车斗里，商人画外（只有 L903 一句是他的）

     实测（H032 比规格长）：
       H901 4.47（一致）H902 4.10（一致）L903 2.24（一致）
       H032 **1.21**（规格 0.84，多 0.37）
       合计 12.02s（规格 11.65s）

     八拍（合计 20.00s）：
       ① 题字淡入+静坐 1.0 ② 题字停留 3.0 ③ H901 4.47
       ④ 字幕「没酒」+前倾 1.6 ⑤ H902 4.10 ⑥ L903 2.24
       ⑦ H032+切特写 1.21 ⑧ 收尾 2.38                    = 20.00s */

  /* 赫萝坐姿的位置与尺寸（S05-01/02/04~06）
       比例推算：
         男主站姿内容高 557（画幕 0.60）
         赫萝站姿 501 = 557 × 0.90
         坐姿：腿折叠，坐高 ≈ 站高 × 0.78 → 501 × 0.78 ≈ **390**
       ⚠ 之前给 250 是为了「塞进车斗开口」，结果比例失真、人也太小。
         现在的思路是**位置下沉**而不是缩小 —— 把整块图压到车斗开口
         范围内，车篷拱形自然在上方框住她，不需要真的做遮挡。

       2026-11-09 用户第四轮给出红框（车斗座椅+地板区），换算到舞台
       约 x 490~735 / y 465~730，中心 (610, 597)。取：
         内容高 390、内容底 720、内容中心 X 610
         内容顶 = 720-390 = 330，低于车篷顶 294? 不 —— 330 仍在 294 下方，
         整块落在车斗开口里，读作「坐在车斗内」。

       前倾讨酒素材：内容高比 0.8821、宽/高 0.5573、中心归一 (558/1032,739/1544)
         imgH = 390/0.8821 = 442.1，imgW = 442.1 × 0.6684 = 295.5
         内容底距图底 = (1544-1419)/1544 = 0.0810 → 442.1×0.0810 = 35.8
         图片底 = 720+35.8 = 755.8 → lift = 886-755.8 = 130.2
         内容中心偏图心 = (0.5407-0.5)×295.5 = 12.0 → 图片中心 = 610-12.0 = 598
       ⚠ place() 的 anchor:'bc' 对齐的是**图片底边**，lift 按图片底边算。 */
  const S05_SIT_H = 390;
  const S05_SIT_LIFT = 130.2;
  const S05_SIT_CX = 598;
  /* 推镜：390 已经够大，不再额外放大，留 1.0 保持接口一致。
     前倾 8% 在此基础上 ×1.08。
     图片 295.5×442.1 → 底边中心 origin = '147.8px 442.1px' */
  const S05_PUSH = 1.0;
  const S05_ORIGIN = '147.8px 442.1px';
  /* S05-08 赫萝站到舞台上的位置：男主在右 1173.5，她站左边 700，
     两人距离 473（原本车的中心位置，车退场后正好空出来） */
  const S05_STAND_CX = 700;

  const S05 = [];

  /* ① 题字淡入 + 静坐定格 */
  S05.push({
    id: 'S05-01', name: '① 题字淡入 · 赫萝静坐',
    async run(tok) {
      /* 清字幕板：S04 的三条含糊音是「不出字幕」，
         但 S04-07 的 endSub 会排一个 500ms 定时器，
         跨拍时可能把空板延续到本拍开头。
         这里强制清空 sub 层（含待执行定时器），保证 S05 开场干净。 */
      const subL = S.layers.get('sub');
      if (subL) { subL.el.style.opacity = '0'; subL.el.innerHTML = ''; }
      if (S._subTimer) { clearTimeout(S._subTimer); S._subTimer = null; }

      // 承 S04：特写还在、压暗还在，先退回舞台
      S.fade('cuA2', 0, 500);
      S.fade('dim', 0, 600);
      S.fade('cart', 1, 400);

      place('horo5', P.s05Lean, S05_SIT_H, S05_SIT_CX, {
        bodyRatio: 0.8821, ratio: R_V, z: Z.actor + 3, opacity: 0,
        lift: S05_SIT_LIFT,
      });
      S.fade('horo5', 1, 600);
      await S.wait(600, tok);

      /* 夜间打光：立绘必须打（用户定的规则），特写不打。
         她坐在车斗里，光斑按内容宽收窄，只照亮她那一小块。
         内容中心 X=630、内容底 y=495 → 光斑落在 y=455，半径 139×0.7=97 */
      S.spot('horo5Light', { x: 630, y: 455, r: 97, opacity: 0.55 });

      /* 题字：2026-11-09 用户定 **删掉**。
         规格第 244 行原本要求「上方小字题字，淡入 1s 停 4s 淡出」，
         但它和 H901 的台词是同一句，先看一遍再听一遍，太啰嗦。
         省下来的时间挪给 S05-08（马车退场 + 两人对立）。 */
      await S.wait(400, tok);
    },
  });

  /* ② 静坐呼吸
       题字已删，这拍缩到 1.5s —— 只给观众一眼看清她坐在车里。 */
  S05.push({
    id: 'S05-02', name: '② 静坐呼吸',
    async run(tok) {
      S.act('horo5', 'idle', 0.7);
      await S.wait(1500, tok);
    },
  });

  /* ③ H901「呼，真是好月色，有没有酒啊？」慵懒
       说台词时推近（镜头拉近），她仍坐在车斗里，只是画面变大 */
  S05.push({
    id: 'S05-03', name: '③ H901 好月色有没有酒啊',
    async run(tok) {
      S.transform('horo5', { scale: S05_PUSH, origin: S05_ORIGIN }, 700, E.shift);
      await S.wait(700, tok);

      await say(tok, 'H901', '赫萝：呼……真是好月色，有没有酒啊？', 0, 'horo5');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ④ 前倾 8% 探身 + L162「到底是什么啊？」（罗伦斯，画外）
       2026-11-09 用户定：原来这里是字幕「……没酒。」（未配音），
       改成 L162 带配音 —— 他说完「没酒」之后追问她到底是谁，
       正好把剧情往前推，也给 S05-05「肉啊，真浪费」做铺垫。 */
  S05.push({
    id: 'S05-04', name: '④ 前倾探身 + L162 到底是什么啊',
    async run(tok) {
      /* 前倾 8%：在已推近的倍率基础上再 ×1.08，
         绕同一个底边中心，脚下不动。transform 是绝对值，不是累乘。 */
      S.transform('horo5',
        { scale: S05_PUSH * 1.08, origin: S05_ORIGIN }, 800, E.shift);
      await S.wait(800, tok);

      // 罗伦斯追问（画外，不给赫萝抖动）
      await say(tok, 'L162', '罗伦斯：到底是什么啊？', 0, null);
      endSub();

      // 她被问得一愣，随即微微仰起（前倾到位、视线偏上）
      S.transform('horo5', { y: -10, origin: S05_ORIGIN }, 400, E.shift);
      await S.wait(400, tok);
    },
  });

  /* ⑤ H902「肉啊，真浪费。」—— 切「拣肉干」特写
       2026-11-09 用户定顺序（改）：这一拍是**她拣起货台上那块肉干**，
       不是已经在吃。台词说的是「真浪费」，所以她嫌弃完就自己捡走了 ——
       后面 L903「那是我的肉干」才拦得住，因果才对。 */
  S05.push({
    id: 'S05-05', name: '⑤ H902 肉啊真浪费 · 拣肉干特写',
    async run(tok) {
      /* 切特写：压暗重新起来，立绘退场，特写淡入
         2026-11-09：边缘曾试 .96 想抹平与 S02-01 的 2.3 差，实测只降 0.2，
         证明不是压暗强度的问题，已回退 .94 与基准保持一致。 */
      const dim = S._layer('dim', Z.fx);
      dim.el.style.background = 'radial-gradient(ellipse at ' +
        CU_CX + 'px ' + CU_CY + 'px,' +
        'rgba(4,6,14,.30) 0%, rgba(4,6,14,.72) 42%, rgba(4,6,14,.94) 100%)';
      S.fade('dim', 1, 400);

      cuShow('cuPick', P.s05Pick, CU.pick, Z.fx + 6, 0);
      S.fade('horo5', 0, 400);
      S.fade('cuPick', 1, 400);
      await S.wait(400, tok);

      await say(tok, 'H902', '赫萝：肉啊，真浪费。', 0, 'cuPick');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑥ L903「喂，那是我的肉干。」—— 切「吃前」特写（送到嘴边）
       她把拣起来的那块往嘴边送，他这一声正好拦住；她手停在嘴边。 */
  S05.push({
    id: 'S05-06', name: '⑥ L903 那是我的肉干 · 送到嘴边',
    async run(tok) {
      cuShow('cuPre', P.s05Pre, CU.pre, Z.fx + 7, 0);
      S.fade('cuPick', 0, 400);
      S.fade('cuPre', 1, 400);
      await S.wait(400, tok);

      // 罗伦斯制止（画外）
      await say(tok, 'L903', '罗伦斯：喂，那是我的肉干。', 0, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑦ H032「嘿嘿哈哈哈哈」—— 切「吃肉干」特写（已经在嚼）
       她根本不管，塞进嘴里笑了。 */
  S05.push({
    id: 'S05-07', name: '⑦ H032 嘿嘿哈哈 · 已经在嚼',
    async run(tok) {
      cuShow('cuEat', P.s05Eat, CU.eat, Z.fx + 8, 0);
      S.fade('cuPre', 0, 400);
      S.fade('cuEat', 1, 400);
      await S.wait(400, tok);

      S.act('cuEat', 'idle', 1);
      await say(tok, 'H032', '赫萝：嘿嘿哈哈哈哈。', 0, 'cuEat');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑧ 收 · 马车退场，两人对立
       2026-11-09 用户定：这一拍**不要特写**，赫萝换成常规立绘登场，
       马车退场，她站在男主对面。
       站位：男主在右（STAGE_MAN_CX 1173.5），她从车里出来站到左边 700，
       两人距离 473，正好是一段对话的距离。 */
  S05.push({
    id: 'S05-08', name: '⑧ 收 · 马车退场 · 两人对立',
    async run(tok) {
      SFXTRACK.play('sfxLand', { beat: 'S05-08', vol: 1.0, fadeIn: 0 });      // 她落地
      /* ① 撤特写：三个特写（吃 / 拣 / 吃前）全部退场，压暗淡出，舞台重新亮起 */
      S.fade('cuEat', 0, 400);
      S.fade('cuPick', 0, 400);
      S.fade('cuPre', 0, 400);
      S.fade('dim', 0, 500);
      await S.wait(400, tok);

      /* ② 马车退场 + 赫萝常规立绘登场（同时进行） */
      S.fade('cart', 0, 700);
      place('horo', P.horo, HORO_BODY_H, S05_STAND_CX, {
        bodyRatio: 0.9861, ratio: HORO_RATIO, z: Z.actor + 2, opacity: 0,
      });
      S.fade('horo', 1, 800);
      await S.wait(800, tok);

      /* ③ 夜间打光：立绘必须打（用户定的规则） */
      S.spot('horo5Light', { x: S05_STAND_CX, y: GY - 40, r: 110, opacity: 0.5 });

      /* ④ 两人对立定住 */
      S.act('man', 'idle', 1);
      S.act('horo', 'idle', 1);
      await S.wait(1400, tok);
    },
  });

  /* ====================================================================== */
  /* S06 · 斗嘴（119.0~138.0s，规格 19.0s）                                  */
  /* ====================================================================== */
  /* 规格来源：分镜-草案-v6-208s.md 第 262~281 行
       【帧】**正坐 → 手举至发侧 → 发落**（拨发三帧，B/C 各淡入 0.7s）
       【声】七条对话几乎不喘气：L001 / H033 / L904 / H002 / H007 / L905 / H004
       【位】承 S05-08：马车已退场，两人在空地上；她坐下，男主仍站右侧

     实测配音（规格 13.42s → 实际 15.27s，全部偏长）：
       L001 2.87（规格2.50）H033 2.87（2.50）L904 1.27（1.27）
       H002 1.27（0.90）H007 4.47（4.10）L905 1.87（1.87）H004 0.65（0.28）

     九拍（约 19.6s）：
       ① 坐下 0.8 ② L001 3.17 ③ H033+打量特写 3.42 ④ L904 1.82
       ⑤ H002+B拨发 1.82 ⑥ H007+凑近特写 5.02 ⑦ L905+C发落 2.42
       ⑧ H004 0.85 ⑨ 收 0.3 */

  const S06 = [];
  const S06_SIT_H = 390;      // 坐姿内容高（站姿 501 × 0.78）
  const S06_SIT_CX = 700;     // 与 S05-08 的站位一致

  /* 坐姿/拨发帧的摆位辅助（底部贴地，用各帧自己的内容高比） */
  function s06Place(name, src, bodyRatio, opacity) {
    place(name, src, S06_SIT_H, S06_SIT_CX, {
      bodyRatio: bodyRatio, ratio: R_V, z: Z.actor + 2, opacity: opacity,
    });
  }

  /* ① 承接 · 赫萝坐下（站姿 → 坐姿，交叉淡入） */
  S06.push({
    id: 'S06-01', name: '① 承接 · 赫萝坐下',
    async run(tok) {
      s06Place('horo6', P.s06A, 0.8543, 0);
      S.fade('horo', 0, 400);
      S.fade('horo6', 1, 450);
      await S.wait(450, tok);

      S.act('horo6', 'idle', 0.8);
      S.act('man', 'idle', 1);
      await S.wait(350, tok);
    },
  });

  /* ② L001「喂喂，别自说自话啊！」（罗伦斯） */
  S06.push({
    id: 'S06-02', name: '② L001 别自说自话啊',
    async run(tok) {
      await say(tok, 'L001', '罗伦斯：喂喂，别自说自话啊！', 300, 'man');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ③ H033「哦哦，年轻啊。」+ 切「上下打量」特写 */
  S06.push({
    id: 'S06-03', name: '③ H033 年轻啊 · 上下打量',
    async run(tok) {
      /* 对话特写的压暗比单人独白轻一些（.20/.55/.85），
         避免把对手戏的舞台感完全吃掉 */
      const dim = S._layer('dim', Z.fx);
      dim.el.style.background = 'radial-gradient(ellipse at ' +
        CU_CX + 'px ' + CU_CY + 'px,' +
        'rgba(4,6,14,.20) 0%, rgba(4,6,14,.55) 45%, rgba(4,6,14,.85) 100%)';
      S.fade('dim', 1, 350);

      cuShow('cuLook', P.s06Look, CU.look, Z.fx + 6, 0);
      S.fade('horo6', 0, 350);
      S.fade('cuLook', 1, 350);
      await S.wait(350, tok);

      await say(tok, 'H033', '赫萝：哦哦，年轻啊。', 200, 'cuLook');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ④ L904「你是谁？」+ 切回正坐 */
  S06.push({
    id: 'S06-04', name: '④ L904 你是谁',
    async run(tok) {
      S.fade('cuLook', 0, 350);
      S.fade('dim', 0, 350);
      S.fade('horo6', 1, 350);
      await S.wait(350, tok);

      await say(tok, 'L904', '罗伦斯：你是谁？', 200, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑤ H002「那么……」—— 起势，手举至发侧（切 B 拨发中） */
  S06.push({
    id: 'S06-05', name: '⑤ H002 那么…… · 手举至发侧',
    async run(tok) {
      s06Place('horo6b', P.s06B, 0.8549, 0);
      S.fade('horo6', 0, 350);
      S.fade('horo6b', 1, 350);
      await S.wait(350, tok);

      await say(tok, 'H002', '赫萝：那么……', 200, 'horo6b');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑥ H007「你就当咱是个影子很淡的家伙」+ 切「凑近卖关子」特写 */
  S06.push({
    id: 'S06-06', name: '⑥ H007 影子很淡的家伙 · 凑近',
    async run(tok) {
      const dim = S._layer('dim', Z.fx);
      dim.el.style.background = 'radial-gradient(ellipse at ' +
        CU_CX + 'px ' + CU_CY + 'px,' +
        'rgba(4,6,14,.20) 0%, rgba(4,6,14,.55) 45%, rgba(4,6,14,.85) 100%)';
      S.fade('dim', 1, 350);

      cuShow('cuLean', P.s06Lean, CU.lean, Z.fx + 7, 0);
      S.fade('horo6b', 0, 350);
      S.fade('cuLean', 1, 350);
      await S.wait(350, tok);

      await say(tok, 'H007',
        '赫萝：你就当咱是个影子很淡的家伙——这么说倒也不算错。', 200, 'cuLean');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑦ L905「除了你还有谁！」+ 切回 C 发落 */
  S06.push({
    id: 'S06-07', name: '⑦ L905 除了你还有谁 · 发落',
    async run(tok) {
      S.fade('cuLean', 0, 350);
      S.fade('dim', 0, 350);
      s06Place('horo6c', P.s06C, 0.8562, 0);
      S.fade('horo6c', 1, 350);
      await S.wait(350, tok);

      await say(tok, 'L905', '罗伦斯：除了你还有谁！', 200, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑧ H004「嗯？」—— 装傻 */
  S06.push({
    id: 'S06-08', name: '⑧ H004 嗯？ · 装傻',
    async run(tok) {
      await say(tok, 'H004', '赫萝：嗯？', 200, 'horo6c');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑨ 收 · 钟摆微摆 */
  S06.push({
    id: 'S06-09', name: '⑨ 收 · 钟摆微摆',
    async run(tok) {
      S.act('horo6c', 'idle', 1);
      S.act('man', 'idle', 1);
      await S.wait(300, tok);
    },
  });

  /* ====================================================================== */
  /* S07 · 拔剑（138.0~150.0s，规格 12.0s）— 静默镜                        */
  /* ====================================================================== */
  /* 规格来源：分镜-草案-v6-208s.md 第 285~302 行 + 原著「恶魔」段
       【原著顺序】罗伦斯摸剑说「你该不会是恶魔附身的妖怪吧」
         → 女孩**口中还叼着肉干**，咧嘴大笑「哈哈哈哈哈，咱是恶魔?」
         → 他恼羞「喂!有什么好笑的?」
         → 她再笑「当然好笑啊，咱还是第一次被说是恶魔呢」
         → 罗伦斯**拔出短剑**「你到底是谁?」
         → **她总算收起笑容，眯起带点红色的琥珀色眼睛**
         → 「胆敢拿剑指着咱，真是不懂礼貌。」
       【声】拔剑后**完全静默 2.0s**——规格写明「全片最重的一次停顿，不能砍」

     2026-11-10 补齐三句 + 两张新特写（大笑/恼羞），十拍：
       ① 大笑特写 H906 4.24 ② 恼羞特写 L910 1.83 ③ 再笑 H907 4.47
       ④ **收起笑容**切抱臂 0.9 ⑤ L906 2.57 ⑥ 拔剑特写 0.9
       ⑦ **静默 2.0（冷光）** ⑧ H042 0.97 ⑨ H903 3.80 ⑩ 收 0.8 */

  const S07 = [];

  /* ⓪ **罗伦斯质疑「恶魔」** —— 她大笑的起因
        原著：「你该不会是被恶魔附身的妖怪吧。」罗伦斯一边说，一边把手摸向腰际短剑。
        2026-11-10：配音 L911 已生成（2.99s）并验收，替换掉原来的字幕占位。
        说话者传 null（画外）——这一拍画面上还是她，他的声音从画外进来。 */
  S07.push({
    id: 'S07-00', name: '⓪ 你该不会是被恶魔附身的妖怪吧',
    async run(tok) {
      await say(tok, 'L911', '罗伦斯：你该不会是被恶魔附身的妖怪吧。', 250, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ① 她大笑特写 —— 嘴里还叼着肉干（原著：「口中的肉乾都快掉下来了」） */
  S07.push({
    id: 'S07-01', name: '① 她大笑 · 咱是恶魔？',
    async run(tok) {
      const dim = S._layer('dim', Z.fx);
      dim.el.style.background = 'radial-gradient(ellipse at ' +
        CU_CX + 'px ' + CU_CY + 'px,' +
        'rgba(4,6,14,.20) 0%, rgba(4,6,14,.55) 45%, rgba(4,6,14,.85) 100%)';
      S.fade('dim', 1, 400);

      cuShow('cuLaugh', P.s07Laugh, CU.laugh, Z.fx + 6, 0);
      S.fade('horo6c', 0, 350);
      S.fade('cuLaugh', 1, 400);
      await S.wait(400, tok);

      await say(tok, 'H906', '赫萝：哈哈哈哈哈，咱是恶魔？', 0, 'cuLaugh');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ② 他恼羞特写 —— 「喂！有什么好笑的？」 */
  S07.push({
    id: 'S07-02', name: '② 他恼羞 · 有什么好笑的',
    async run(tok) {
      cuShow('cuAngry', P.s07Angry, CU.angry, Z.fx + 7, 0);
      S.fade('cuLaugh', 0, 350);
      S.fade('cuAngry', 1, 350);
      await S.wait(350, tok);

      await say(tok, 'L910', '罗伦斯：喂！有什么好笑的？', 0, 'cuAngry');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ③ 她再笑 —— 「当然好笑啊，咱还是第一次被说是恶魔呢」 */
  S07.push({
    id: 'S07-03', name: '③ 她再笑 · 第一次被说是恶魔',
    async run(tok) {
      cuShow('cuLaugh2', P.s07Laugh, CU.laugh, Z.fx + 8, 0);
      S.fade('cuAngry', 0, 350);
      S.fade('cuLaugh2', 1, 350);
      await S.wait(350, tok);

      await say(tok, 'H907',
        '赫萝：当然好笑啊，咱还是第一次被说是恶魔呢。', 0, 'cuLaugh2');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ④ **收起笑容** → 抱臂正坐（原著：「总算收起了脸上的笑容」）
        这一步原著写得很清楚，是全场气氛转冷的转折点。 */
  S07.push({
    id: 'S07-04', name: '④ 收起笑容 · 抱臂正坐',
    async run(tok) {
      place('horo7', P.s07A, S06_SIT_H, S06_SIT_CX, {
        bodyRatio: 0.8510, ratio: R_V, z: Z.actor + 2, opacity: 0,
      });
      S.fade('cuLaugh2', 0, 500);
      S.fade('cuAngry', 0, 500);
      S.fade('dim', 0, 500);
      S.fade('horo7', 1, 600);
      await S.wait(900, tok);
      S.act('horo7', 'idle', 0.5);
    },
  });

  /* ⑤ L906「你到底是什么？」（罗伦斯，画外） */
  S07.push({
    id: 'S07-05', name: '⑤ L906 你到底是什么',
    async run(tok) {
      await say(tok, 'L906', '罗伦斯：你到底是什么？', 0, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑥ 拔剑 —— 用男主拔剑特写暗示动作（0.9s），不拍打斗 */
  S07.push({
    id: 'S07-06', name: '⑥ 拔剑 · 男主特写',
    async run(tok) {
      const dim = S._layer('dim', Z.fx);
      dim.el.style.background = 'radial-gradient(ellipse at ' +
        CU_CX + 'px ' + CU_CY + 'px,' +
        'rgba(4,6,14,.35) 0%, rgba(4,6,14,.70) 45%, rgba(4,6,14,.92) 100%)';
      S.fade('dim', 1, 300);

      cuShow('cuSword', P.s07Sword, CU.sword, Z.fx + 6, 0);
      S.fade('horo7', 0, 300);
      S.fade('cuSword', 1, 300);
      await S.wait(900, tok);
    },
  });

  /* ⑦ **完全静默 2.0s** + 冷光扫过 + 切「眯眼侧首」
        规格：全片最重的一次停顿。冷光从画面左掠到右，暗示剑出鞘的寒光。 */
  S07.push({
    id: 'S07-07', name: '⑦ 静默 2.0s · 冷光扫过',
    async run(tok) {
      /* 切回赫萝：眯眼侧首，正面迎剑尖不躲 */
      place('horo7b', P.s07B, S06_SIT_H, S06_SIT_CX, {
        bodyRatio: 0.8374, ratio: R_V, z: Z.actor + 2, opacity: 0,
      });
      S.fade('cuSword', 0, 380);
      S.fade('dim', 0, 380);
      S.fade('horo7b', 1, 380);
      await S.wait(380, tok);

      /* 冷光：一道斜向白蓝光带横扫整层 */
      const glow = S._layer('coldglow', Z.fx + 9);
      if (!glow.el.querySelector('.cg')) {
        const d = document.createElement('div');
        d.className = 'cg';
        d.style.cssText =
          'position:absolute;top:-40%;left:0;width:70%;height:180%;' +
          'background:linear-gradient(90deg,' +
          'rgba(170,210,255,0) 0%, rgba(200,230,255,.28) 36%,' +
          'rgba(240,250,255,.70) 50%, rgba(200,230,255,.28) 64%,' +
          'rgba(170,210,255,0) 100%);' +
          'filter:blur(16px);pointer-events:none;';
        glow.el.appendChild(d);
      }
      const cg = glow.el.querySelector('.cg');
      glow.el.style.opacity = '1';
      cg.style.transition = 'none';
      cg.style.transform = 'rotate(9deg) translateX(-140%)';
      void cg.offsetWidth;
      cg.style.transition = 'transform 880ms cubic-bezier(.4,.55,.4,1)';
      cg.style.transform = 'rotate(9deg) translateX(260%)';
      await S.wait(880, tok);
      glow.el.style.opacity = '0';

      // 静默剩余：让那一下寒光落定，不配任何声音
      await S.wait(740, tok);
    },
  });

  /* ⑧ H042「蠢货！」—— 恼怒（B 保持）
        规范（补充文档第二节）：情绪变化必须有可见物理动作，不能只念台词。
        做法：整层向上弹 12px（动图层 transform，不碰 img 的 left/top），
        起跳到顶的瞬间开口骂，落回与台词并行 —— 只加 130ms。
        ⚠ 不用 rotate：HORO_ORIGIN 是按站姿算的，坐姿下旋会飘。 */
  S07.push({
    id: 'S07-08', name: '⑧ H042 蠢货！',
    async run(tok) {
      S.transform('horo7b', { y: -12 }, 130, E.push);
      await S.wait(130, tok);
      S.transform('horo7b', { y: 0 }, 190, E.shift);   // 不 await，与台词同时落回

      await say(tok, 'H042', '赫萝：蠢货！', 0, 'horo7b');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑨ H903「胆敢拿剑指着咱，真是不懂礼貌。」—— 冷傲 */
  S07.push({
    id: 'S07-09', name: '⑨ H903 不懂礼貌',
    async run(tok) {
      await say(tok, 'H903', '赫萝：胆敢拿剑指着咱，真是不懂礼貌。', 0, 'horo7b');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑩ 收 · 定住 */
  S07.push({
    id: 'S07-10', name: '⑩ 收 · 定住',
    async run(tok) {
      S.act('horo7b', 'idle', 0.8);
      S.act('man', 'idle', 1);
      await S.wait(800, tok);
    },
  });

  /* ====================================================================== */
  /* S08 · 亮耳朵尾巴（150.0~163.5s，规格 13.5s）                            */
  /* ====================================================================== */
  /* 规格来源：分镜-草案-v6-208s.md 第 306~323 行
       【帧】**帧A 拨发露一对尖狼耳（定格 3s）→ 帧B 转身露单条腰际白毛尖尾
             （定格 3s）**，淡入 1.4s
       【光】月亮整层 +10% 作展示光
       【配】L070 3.83（认输）/ H051 3.81（得意）——原 L196「不愧是贤狼大人」已删

     实测合计 9.23s（规格 8.49s），四拍合计 11.61s：
       ① 淡入帧A 1.4 ② L070 4.13 ③ H051+切帧B 4.51 ④ 帧B定格 1.57

     2026-11-11 用户定：**删除原 S08-03「L196 到底不愧是贤狼大人」**。
       规格第 312/318 行把这句标为「本轮新增」，理由是「中间缺一句罗伦斯的反应」，
       但逻辑上超前了 —— 罗伦斯到 S09 听她自报「咱是赫萝，贤狼赫萝」之后
       才知道她是贤狼，这一拍他不可能称她「贤狼大人」。
       小说原文这里他只「看呆了」，没有出声。
       删除后 S08 从 5 拍变 4 拍，时长 13.5s → 11.61s（规格原定 12.0s）。 */

  const S08 = [];
  /* ⚠ 这里用**站姿**高度 501（男主 557 × 0.90），不是坐姿的 390。
     S08「亮耳朵尾巴」是她站起来展示，素材本身也是站姿
     （S08_A 内容宽高比 0.4753，而坐姿素材都在 0.65 左右）。
     2026-11-10 用户指出「太矮了」——原来误用了 S06/S07 的坐姿 390。 */
  const S08_H = HORO_BODY_H;   // = 501（帧A 露耳用站姿）
  /* 帧B「转身露尾」用 390 —— 2026-11-10 用户定：这一帧保持之前的大小。
     该素材内容宽高比 0.7222（比帧A 的 0.4753 宽得多），
     按 501 排会渲染成 420×628，画面里显得过大。 */
  const S08B_H = 390;

  /* ① 淡入帧A · 露耳 */
  S08.push({
    id: 'S08-01', name: '① 帧A 拨发露耳',
    async run(tok) {
      SFXTRACK.play('sfxEar', { beat: 'S08-01', vol: 1.0, fadeIn: 0 });       // 拨发露耳
      place('horo8', P.s08Ear, S08_H, S06_SIT_CX, {
        bodyRatio: 0.9061, ratio: R_V, z: Z.actor + 2, opacity: 0,
        mirror: true,   // 2026-11-10 用户定：从 S08 起她面向右侧的男主
      });
      S.fade('horo7b', 0, 600);
      S.fade('horo8', 1, 1400);      // 规格：淡入 1.4s
      await S.wait(1400, tok);

      /* 月亮整层 +10%：把展示光打上去 */
      const mL = S.layers.get('moon');
      if (mL && mL.img) {
        mL.img.style.transition = 'filter 800ms ease-out';
        mL.img.style.filter = 'brightness(1.10)';
      }
      S.act('horo8', 'idle', 0.6);

      /* 抖耳朵（第一版：整层短抖）。
         ⚠ 引擎的 act()/talk() 动画作用在整个 img 上，只能整体抖，**动不到单独一只耳朵**。
         这里用 jy（上下 3px 高频）跑 240ms 再回 idle，观感像「她耳朵突然颤了一下」。
         真正的耳朵独立动需要 2 个「耳朵歪一点」的变体帧做快切（同 S10-07 转头三帧的做法），
         素材待补：赫萝_羊毛毡_S08_A露耳_耳动v1/v2_透明B8.png
         2026-11-12：千问局部重绘脚本已写好（_s08_ear_inpaint.py，mask 只框两只耳廓），
         但当时 ComfyUI 被占用、服务反复断连，两次提交都没出图。 */
      S.act('horo8', 'speaking', 2);      // jy 上下抖，幅度 2px
      await S.wait(240, tok);
      S.act('horo8', 'speaking', 2);
      await S.wait(160, tok);
      S.act('horo8', 'idle', 0.6);       // 回待机慢晃
    },
  });

  /* ② L070「好好好，是位长着举世无双的耳朵和尾巴的主儿」认输 */
  S08.push({
    id: 'S08-02', name: '② L070 举世无双的耳朵尾巴',
    async run(tok) {
      await say(tok, 'L070',
        '罗伦斯：好好好，是位长着举世无双的耳朵和尾巴的主儿。', 300, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ③ H051「何况还是这么罕见的漂亮人儿呢」得意 + 切帧B（转身露尾） */
  S08.push({
    id: 'S08-03', name: '③ H051 罕见漂亮人儿 · 转身露尾',
    async run(tok) {
      SFXTRACK.play('sfxTail', { beat: 'S08-03', vol: 1.0, fadeIn: 100 });    // 帧B 转身露尾
      place('horo8b', P.s08Tail, S08B_H, S06_SIT_CX, {
        bodyRatio: 0.7973, ratio: R_V, z: Z.actor + 2, opacity: 0,
        mirror: true,   // 同样镜像，保持面向男主
      });
      S.fade('horo8', 0, 700);
      S.fade('horo8b', 1, 700);
      await S.wait(700, tok);

      await say(tok, 'H051', '赫萝：何况还是这么罕见的漂亮人儿呢。', 0, 'horo8b');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ④ 帧B 定格 · 收 */
  S08.push({
    id: 'S08-04', name: '④ 帧B 定格',
    async run(tok) {
      S.act('horo8b', 'idle', 0.8);
      await S.wait(1570, tok);
    },
  });

  /* ====================================================================== */
  /* S09 · 自报家门（163.5~179.5s，规格 16.0s）— 亮相                        */
  /* ====================================================================== */
  /* 规格来源：分镜-草案-v6-208s.md 第 327~348 行
       【位】**经典装正面定格特写，下颌微扬、双手垂放身侧**；
             整体上抬 1.5% 回位；月亮亮度回到峰值
       【级】整体上抬【位】＋静帧呼吸【位】（**本镜不换帧**，亮相要稳）
       【配】7 条 12.79s（规格 11.32s，七条全部偏长）

     九拍（约 17.2s）：
       ① 承接+上抬 1.2 ② L908 2.36 ③ H124 3.69 ④ L907 1.34
       ⑤ H904 2.30 ⑥ H140 1.63 ⑦ H141 1.95 ⑧ 字「……」+H058 2.33 ⑨ 收 0.4 */

  const S09 = [];

  /* ① 承接 · 切经典装正面定格 + 整体上抬 1.5% 回位 */
  S09.push({
    id: 'S09-01', name: '① 经典装正面定格 · 上抬回位',
    async run(tok) {
      place('horo9', P.s09, HORO_BODY_H, S06_SIT_CX, {
        bodyRatio: 0.9430, ratio: R_V, z: Z.actor + 2, opacity: 0,
        mirror: true,        // 继续面向右侧的男主
      });
      S.fade('horo8b', 0, 600);
      S.fade('horo9', 1, 800);
      await S.wait(400, tok);

      /* 整体上抬 1.5% 回位：1.5% 画幕高 ≈ 14px，从下方升上来 */
      S.transform('horo9', { y: 14 }, 0);
      await S.wait(60, tok);
      S.transform('horo9', { y: 0 }, 700, E.push);
      await S.wait(740, tok);

      /* 月亮亮度回到峰值（S08 曾 +10% 作展示光） */
      const mL = S.layers.get('moon');
      if (mL && mL.img) {
        mL.img.style.transition = 'filter 700ms ease-out';
        mL.img.style.filter = 'brightness(1.0)';
      }
      S.act('horo9', 'idle', 0.6);
    },
  });

  /* ② L908「你不是神？」（罗伦斯） */
  S09.push({
    id: 'S09-02', name: '② L908 你不是神',
    async run(tok) {
      await say(tok, 'L908', '罗伦斯：你不是神？', 300, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ③ H124「照看它们，是贤狼的本分。」郑重 */
  S09.push({
    id: 'S09-03', name: '③ H124 贤狼的本分',
    async run(tok) {
      await say(tok, 'H124', '赫萝：照看它们，是贤狼的本分。', 300, 'horo9');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ④ L907「贤狼？」（罗伦斯，反问） */
  S09.push({
    id: 'S09-04', name: '④ L907 贤狼？',
    async run(tok) {
      await say(tok, 'L907', '罗伦斯：贤狼？', 300, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑤ H904「咱才不是神。」 */
  S09.push({
    id: 'S09-05', name: '⑤ H904 咱才不是神',
    async run(tok) {
      await say(tok, 'H904', '赫萝：咱才不是神。', 300, 'horo9');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑥ H140「咱是赫萝。」自我介绍 */
  S09.push({
    id: 'S09-06', name: '⑥ H140 咱是赫萝',
    async run(tok) {
      await say(tok, 'H140', '赫萝：咱是赫萝。', 300, 'horo9');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑦ H141「贤狼赫萝嘛。」得意 */
  S09.push({
    id: 'S09-07', name: '⑦ H141 贤狼赫萝嘛',
    async run(tok) {
      await say(tok, 'H141', '赫萝：贤狼赫萝嘛。', 200, 'horo9');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑧ 字幕「……」+ H058「那当然。」—— 他被噎住，她自己接话 */
  S09.push({
    id: 'S09-08', name: '⑧ 「……」· 那当然',
    async run(tok) {
      S.sub('罗伦斯：……');
      await S.wait(800, tok);

      await say(tok, 'H058', '赫萝：那当然。', 300, 'horo9');
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑨ 收 · 亮相定格 */
  S09.push({
    id: 'S09-09', name: '⑨ 收 · 亮相定格',
    async run(tok) {
      S.act('horo9', 'idle', 0.8);
      S.act('man', 'idle', 1);
      await S.wait(400, tok);
    },
  });

  /* ====================================================================== */
  /* S10 · 夜话与启程（插在 S09 与 S11 之间，独立一组镜头）                     */
  /* ====================================================================== */
  /* 原著：《狼与香辛料》第一卷，字符位 16500~23000
     剧情线：S09 自报家门 → 麦子设定 → **哀求 → 反捉弄**（2026-11-12 互换）
             → 愤怒独白 → 北方/约伊兹 → 先旅行 → 提议同行 → 睡外头
             →（天亮换景已移入 S11-01）→ S11 启程
     【配】赫萝 10 条已全部到位（H142~H151）；罗伦斯 4 条待配（L912/L914/L915/L916）
     【态】**八拍**。画面：九张特写已抠图入库并接进 cuShow；S10-01 走中景
            （台上从 S01-02 起就挂着左右麦捆，再叠麦束特写会三个麦子同框，故不切）。
            台词已全部改 say()；等罗伦斯四条到位后再一次性重算 SCENES。
     2026-11-12 三次调整：① ②③ 互换（求→被耍→愣住）② 天亮换景移入 S11-01
                          ③ 麦束特写改中景（见上）                                   */

  const S10 = [];

  /* ---- S10 特写表演辅助（本组专用） ----
     十张特写共用同一个 dim 层：第一次建好就复用，不重复建
     （重复 S._layer('dim') 会拿到同一层，但重设 background 会打断正在淡入的过渡）。
     切图一律「旧的淡出 350 + 新的淡入 400」，避免上一张残留在画面上。 */
  let s10Cu = null;        // 当前亮着的特写层名
  let s10DimOn = false;    // dim 层是否已初始化

  function s10Dim() {
    if (!s10DimOn) {
      const dim = S._layer('dim', Z.fx);
      dim.el.style.background = 'radial-gradient(ellipse at ' + CU_CX + 'px ' + CU_CY + 'px,' +
        'rgba(4,6,14,.20) 0%, rgba(4,6,14,.55) 45%, rgba(4,6,14,.85) 100%)';
      s10DimOn = true;
    }
    S.fade('dim', 1, 400);
  }
  function s10Undim() {
    S.fade('dim', 0, 350);
  }
  function s10Cut(tok, name, src, spec, z, cxOff) {
    if (s10Cu && s10Cu !== name) S.fade(s10Cu, 0, 350);
    cuShow(name, src, spec, z, 0, CU_BODY_H, CU_CX + (cxOff || 0), CU_CY);
    S.fade(name, 1, 400);
    s10Cu = name;
    return S.wait(400, tok);
  }

  /* ① 麦束 · 咱是寄宿在麦子里的狼（特写·纯物件，不出人物） */
  S10.push({
    id: 'S10-01', name: '① 寄宿在麦子里（中景）',
    async run(tok) {
      /* H142 保持中景，**不切麦束特写**。
         原因（2026-11-12 用户指出）：台上从 S01-02 起就挂着 sheafL/sheafR 两个麦捆
         （Z.mid=30，直到 S10-09 推板才 fade 退场），而麦束特写用的又是同一张 P.sheafL，
         三个麦子同框、且特写与道具一模一样，重复失焦。
         这句本来就是画外音式的陈述，人物在台上说即可，麦子作为环境存在。
         cuSheaf / CU.sheaf / s10Cut 这条链路保留未删，若要单独用可随时接回。 */
      await say(tok, 'H142', '赫萝：咱是寄宿在麦子里的狼。少了麦子，咱就活不了命。', 300, null);
      endSub();
      await S.wait(500, tok);
    },
  });

  /* ② 哀求 · 汝愿意……帮咱吧?（罗伦斯别过头）
     ⚠ 2026-11-12 用户定：与③「反捉弄」**互换位置**。
     叙事变成「她先求 → 他故意将她的军 → 她愣住」，情绪递进更硬。 */
  S10.push({
    id: 'S10-02', name: '② 哀求 · 汝愿意帮咱吧',
    async run(tok) {
      /* 承 S10-01 的中景，这一拍才压暗、切「仰头讨要」特写 */
      s10Dim();
      await s10Cut(tok, 'cuBeg', P.s10Beg, CU.beg, Z.fx + 5);
      await say(tok, 'H144', '赫萝：汝愿意……帮咱吧?', 300, null);
      await S.wait(600, tok);
      SFXTRACK.play('sfxOwl06', { beat: 'S10-02', vol: 1.0, fadeIn: 150 });   // 哀求被拒后的静默里一声猫头鹰
      await S.wait(600, tok);          // 静默：罗伦斯不出声
      endSub();
      await S.wait(500, tok);
    },
  });

  /* ③ 罗伦斯反捉弄 → 赫萝被背叛的表情
     ⚠ 2026-11-12 用户定：与②「哀求」互换位置（原为第②拍） */
  S10.push({
    id: 'S10-03', name: '③ 反捉弄 · 汝是在跟咱开玩笑吧?',
    async run(tok) {
      /* 撤哀求特写回中景，让他从台上说这句 → 静默 0.8s 她愣住 → 切「遭背叛」特写 */
      S.fade('cuBeg', 0, 350);
      s10Cu = null;
      s10Undim();
      await say(tok, 'L912', '罗伦斯：既然这样，那就把这些麦子带回村里吧。', 300, null);
      await S.wait(800, tok);           // 静默：她愣住了
      s10Dim();
      await s10Cut(tok, 'cuBetray', P.s10Betray, CU.betray, Z.fx + 5);
      await say(tok, 'H143', '赫萝：汝……是在跟咱开玩笑吧?', 300, null);
      endSub();
      await S.wait(500, tok);
    },
  });

  /* ④ 愤怒独白（本组情绪高点）→ 末尾扑倒埋头 */
  S10.push({
    id: 'S10-04', name: '④ 愤怒独白 · 他们却说咱反覆无常',
    async run(tok) {
      /* L914 罗伦斯追问（特写）→ H145 赫萝独白（中途 6a→6b 换图） */
      await s10Cut(tok, 'cuAsk', P.s10Ask, CU.ask, Z.fx + 7);
      await say(tok, 'L914', '罗伦斯：你离开后，帕斯罗村的麦田，是不是就长不出麦子了?', 300, null);

      await s10Cut(tok, 'cuWrath', P.s10Wrath, CU.wrath, Z.fx + 6);
      /* H145 切点：「…怠けたことなど一度もない。」之后改念「それなのに…」时换图。
         按 v1 分段 ASR 换算到 v2 时间轴约 10.4s（v1 的 21.0s − 剪掉 10.42 + 前导 0.2）。
         交叉 90ms —— 超过 90ms 会看见两张脸叠在一起（双头鬼影，S10-07 踩过）。
         cuWrath2 先预建（opacity 0），避免换图那一刻才加载图片造成闪烁。 */
      cuShow('cuWrath2', P.s10Wrath2, CU.wrath2, Z.fx + 6, 0);
      /* 字幕分**三段**（2026-11-12 用户定：三句话就要三段，且台词念到哪句就显哪段）。
         切点取自 H145_反覆无常_v2.wav 的句间静音实测：
           句1 结束 = 6.02~6.39s 静音（「この尻尾の毛ほどものう。」之后）
           句2 结束 = 10.01~10.49s 静音（「怠けたことなど一度もない。」之后）
         所以 6.2s 换第二段、10.3s 换第三段；换图（cuWrath→cuWrath2）也压在
         10.3s —— 句3「それなのに…」情绪落下来的同一刻。
         say 传 null 字幕，三段全部用 S.sub 手动下，避免被 say 内部覆盖。 */
      S.sub('赫萝：咱在那座村落待了好长的岁月，有咱尾巴的毛那么多。');
      const pWrath = say(tok, 'H145', null, 300, null);
      await S.wait(6200, tok);          // → 句2
      S.sub('赫萝：咱为了守护村里的麦田，从不曾偷懒过。');
      await S.wait(4100, tok);          // → 10.3s，句3
      S.fade('cuWrath', 0, 90);
      S.fade('cuWrath2', 1, 90);
      S.sub('赫萝：可村民们说咱反覆无常。');
      s10Cu = 'cuWrath2';
      SFXTRACK.play('sfxKneel', { beat: 'S10-04', vol: 1.0, fadeIn: 0 });     // 她弓身扑倒在貂皮上
      await pWrath;
      endSub();
      await S.wait(800, tok);
    },
  });

  /* ⑤ 北方 · 咱出生的故乡——约伊兹森林 */
  S10.push({
    id: 'S10-05', name: '⑤ 北方 · 约伊兹森林',
    async run(tok) {
      /* L915 复用 ask 同一张脸，但整体右移 6px —— 语气软下来，不换图靠位移区分 */
      await s10Cut(tok, 'cuAsk', P.s10Ask, CU.ask, Z.fx + 7, 6);
      await say(tok, 'L915', '罗伦斯：离开村落后，你知道自己能去哪里吗?', 300, null);

      await s10Cut(tok, 'cuNorth', P.s10North, CU.north, Z.fx + 5);
      await say(tok, 'H146', '赫萝：咱想回到北方去。', 300, null);
      /* H147 复用同一张侧脸，靠月亮上移 20px 补足「更想家」的变化 */
      S.transform('moon', { y: -20 }, 2000, 'linear');
      await say(tok, 'H147', '赫萝：咱出生的故乡——约伊兹森林。', 300, null);
      endSub();
      await S.wait(500, tok);
    },
  });

  /* ⑥ 先旅行（H151）
     2026-11-12 归位：小说原文 [20567] 这句在「提议同行」**之前**——
     她先自己松口说「咱想先去旅行」，罗伦斯才问「你能去哪」，然后才轮到「一同旅行」。
     原来排在最后（天亮之后）会使逻辑链断裂，故独立成拍。 */
  S10.push({
    id: 'S10-06', name: '⑥ 先旅行 · 难得在异国增广见闻',
    async run(tok) {
      await s10Cut(tok, 'cuTurn', P.s10Turn, CU.turn, Z.fx + 5);
      await say(tok, 'H151', '赫萝：咱想先旅行。难得在远离故乡的异国，藉机增广见闻也是一件好事。', 300, null);
      endSub();
      await S.wait(500, tok);
    },
  });

  /* ⑦ 提议同行（她回头微笑，是掩饰不是胜利） */
  S10.push({
    id: 'S10-07', name: '⑦ 提议同行 · 和汝一同旅行',
    async run(tok) {
      /* 镜11 掩饰的笑 → 镜12 罗伦斯叹气 → 镜13 揶揄（凑近卖关子复用） */
      await s10Cut(tok, 'cuSmile', P.s10Smile, CU.smile, Z.fx + 5);
      await say(tok, 'H148', '赫萝：咱希望可以和汝一同旅行。汝是不停旅行的旅行商人吧?', 300, null);
      await s10Cut(tok, 'cuSigh', P.s10L916, CU.l916, Z.fx + 7);
      await say(tok, 'L916', '罗伦斯：我没办法立刻下决定。', 300, null);
      await s10Cut(tok, 'cuLean', P.s06Lean, CU.lean, Z.fx + 5);
      await say(tok, 'H149', '赫萝：做人小心谨慎是件好事。', 300, null);
      endSub();
      await S.wait(500, tok);
    },
  });

  /* ⑦ 汝不会要咱睡在外头吧?（钻貂皮，只露两耳） */
  S10.push({
    id: 'S10-08', name: '⑧ 睡在外头 · 貂皮毯子',
    async run(tok) {
      /* 镜14 从貂皮探头。peek 素材自带画面下缘一角毯子，不必再铺 S02 貂皮图层
         （铺了会和素材里的毯子叠成两层） */
      await s10Cut(tok, 'cuPeek', P.s10Peek, CU.peek, Z.fx + 5);
      await say(tok, 'H150', '赫萝：汝不会要咱睡在外头吧?', 300, null);
      endSub();
      SFXTRACK.play('sfxEar', { beat: 'S10-08', vol: 1.0, fadeIn: 0 });       // 耳朵动两下
      await S.wait(1200, tok);
    },
  });

  /* ====================================================================== */
  /* S11 · 同行启程（原 S10，2026-11-12 因新增 S10 过渡段而顺延）              */
  /* ====================================================================== */
  /* 规格来源：分镜-草案-v6-208s.md 第 352~373 行
       【帧】经典装侧坐驾座 → **回望**（淡入 1.2s）
       【位】马车＋赫萝**一起向左平移启程**，底幕反向轻移 1.02 倍作视差；月亮不动
       【撤】各层按上场倒序平移撤走 → 回空底幕，**留 2.0s 空台静默**
       【配】5 条 21.95s（规格 20.47s）

     八拍（约 30.4s）：
       ① 帧A 并肩+启程 2.0 ② H055 4.81 ③ L054 4.03 ④ L909 6.17
       ⑤ 字幕「随着马嘶声…」1.5 ⑥ H053 6.57 ⑦ 帧B 回望动画+H218 3.22
       ⑧ 撤台+空台静默 2.0

     ⚠ 2026-11-12 调整：原 S10-09「天亮·换景推板」移入本组作**第①拍**，
        原①~⑧ 顺延为 ②~⑨，共**九拍**。理由：天亮换景属「启程」的开场，
        不应留在仍以夜谈为主的 S10 里。
     ⚠ L909 于同日换成 _v6（5.59s，原 v1 5.87s），该拍时长随之 -0.28s。 */

  const S11 = [];
  const S11_ROAD_H = 480;     // 帧A 内容高（两人+车合成图）

  /* ① 天亮 · 换景推板（2026-11-12 用户定：从原 S10-09 移入 S11 作开场拍）
     **推拉，不是渐变** —— 照 S01-02 的实现：
       新底先压在后面一层（z=Z.bgBack）置为不透明，
       旧底连月亮、两侧麦捆**一起平移**推出画面右侧，露出后面的新板。
     道具不能淡出：淡出是电影语言，整块布景被推走才是 Puppeteer 的「看得见机关的布景」。
     新底自带收割后的麦田与麦束，旧底那两个麦捆必须跟着走，否则叠出两层。 */
  S11.push({
    id: 'S11-01', name: '① 天亮 · 换景推板',
    async run(tok) {
      SFXTRACK.play('sfxBird', { beat: 'S11-01', vol: 1.0, fadeIn: 300, maxMs: 1350, fadeOut: 1000 }); // 换景清晨：0~2.35s
      /* 换景清晨·鸟鸣短起。
         ⚠ 2026-11-13 用户要求加长到 3400，但本拍只有 2.35s ——
           实际最多播 2.35s 就会被下一拍 S11-02 的强风 bgStop(0) 掐掉。
           真要听完 3.4s，得让 S11-02 不掐旧音轨（见 bg 的 keep 选项）。 */
      /* 先撤上一组停在台面上的 peek 特写与压暗 —— 特写在 z=85，不撤会盖住换景 */
      S.fade('cuPeek', 0, 350);
      s10Cu = null;
      s10Undim();
      await S.wait(350, tok);

      S.setImage('bgRoad', {
        src: P.bgRoad, ratio: 16 / 9, w: W, h: H, x: 0, y: 0, anchor: 'tl',
        z: Z.bgBack, opacity: 0,
      });
      S.show('bgRoad', 0);
      S.transform('bgRoad', { scale: 1.02, x: 0, y: 0 }, 0);

      /* 旧底 + 月亮 + 左右麦捆：同速 1500ms 整块向右推出 */
      const pOut = S.transform('bgNight', { x: W, y: 0 }, 1500, E.push);
      S.transform('moon', { x: 1200 + W }, 1500, E.push);   // 原 x=1200（anchor tc）
      S.transform('sheafL', { x: W }, 1500, E.push);        // 原 x=0（anchor bl）
      S.transform('sheafR', { x: W * 2 }, 1500, E.push);    // 原 x=W（anchor br）
      await pOut;
      S.hide('bgNight', 0);
      S.hide('moon', 0);
      S.hide('sheafL', 0);
      S.hide('sheafR', 0);

      // TODO 画面：罗伦斯折毯子、赫萝伸懒腰（stretch 尚未接入）；本拍无台词
      await S.wait(500, tok);
    },
  });

  /* ① 承接 · 帧A 两人并肩，启程开始左移 */
  S11.push({
    id: 'S11-02', name: '② 帧A 并肩 → 侧坐回望特写',
    async run(tok) {
      SFXTRACK.play('sfxGale', { beat: 'S11-02', vol: 1.0, fadeIn: 600, maxMs: 2500, fadeOut: 1000 }); // 帧A 启程：0~3.50s
      /* 强风：淡入 600 / 渐出 1000，渐出正好收在拍末（2500+1000=3500=拍长 3.50s）。 */
      /* 撤 S09 的单人图层（两人已合成在帧A 里） */
      S.fade('horo9', 0, 500);
      S.fade('man', 0, 400);

      /* ① 帧A 两人并肩启程 */
      cuShow('cuRoad', P.s10A, CU.road, Z.actor, 0, S11_ROAD_H, CU_CX, CU_CY);
      S.fade('cuRoad', 1, 800);
      await S.wait(800, tok);

      /* 启程：马车+两人整体向左缓移（长时间线性）。
         ⚠ 2026-11-12 用户反馈「S11-02 到 S11-03 背景怎么移动了」——
           原本这里还有一条 `bgRoad x:60 / 14000ms` 的底幕反向视差，
           14s 的长动画会一直跑进后面每一拍，所以背景看着在动。
           底幕视差已删除，只保留人物层左移（那才是「启程」要表达的东西）。 */
      S.transform('cuRoad', { x: -130 }, 14000, E.linear);
      await S.wait(700, tok);

      /* ② 侧坐回望特写（**周围变黑的那种**：dim 径向压暗 + 特写贴在暗场里）。
         2026-11-12 用户定：这张只作为本拍的特写，停留一会儿就撤回去，
         **S11-03 及之后各拍保持原样**（帧A 继续在台上跑）。
         ⚠ 2026-11-13 用户反馈「背景不够黑」：本拍底是**白天底 bgRoad**（平均亮度 146），
           照 S10 夜景那套 0.20/0.55/0.85 压下去仍发灰，所以这里加浓到 0.42/0.82/0.96。 */
      const dimL = S._layer('dim', Z.fx);
      dimL.el.style.background = 'radial-gradient(ellipse at ' + CU_CX + 'px ' + CU_CY + 'px,' +
        'rgba(3,5,11,.42) 0%, rgba(3,5,11,.82) 42%, rgba(3,5,11,.96) 100%)';
      S.fade('dim', 1, 400);

      cuShow('cuLookB', P.s10B, CU.roadB, Z.fx + 5, 0, S11_ROAD_H, CU_CX, CU_CY);
      S.fade('cuLookB', 1, 400);
      await S.wait(400, tok);

      /* 特写停留 1.2s 给人看清。
         ⚠ 2026-11-13 用户定：这张特写**延续到 S11-03 结束**，所以本拍**不撤**，
            撤场交给 S11-03 的末尾（那里接手 cuLookB 与 dim 的淡出）。 */
      await S.wait(1200, tok);
    },
  });

  /* ② H055「咱俩后来的旅程，写成画卷也好、冒险故事也好，都够格。」旁白·得意 */
  S11.push({
    id: 'S11-03', name: '③ H055 后来的旅程都够格',
    async run(tok) {
      /* 本拍全场沿用 S11-02 切进来的侧坐回望特写（cuLookB）+ 压暗 dim。
         说话抖动层从 cuRoad 换成 cuLookB —— 帧A 此刻被 dim 压着，抖它看不出来。
         末尾才撤特写与压暗，露出帧A 交给 S11-04。 */
      await say(tok, 'H055',
        '赫萝：咱俩后来的旅程，写成画卷也好、冒险故事也好，都够格。', 300, 'cuLookB');
      endSub();
      S.fade('cuLookB', 0, 400);
      S.fade('dim', 0, 400);
      await S.wait(400, tok);
    },
  });

  /* ③ L054「也正因如此，我才能没什么留恋地离开这村子。」 */
  S11.push({
    id: 'S11-04', name: '④ L054 没什么留恋地离开',
    async run(tok) {
      await say(tok, 'L054',
        '罗伦斯：也正因如此，我才能没什么留恋地离开这村子。', 300, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ④ L909「原本一个人坐显得宽敞的驾座，现在两个人坐却稍嫌狭窄。」 */
  S11.push({
    id: 'S11-05', name: '⑤ L909 两人坐却稍嫌狭窄',
    async run(tok) {
      await say(tok, 'L909',
        '罗伦斯：原本一个人坐显得宽敞的驾座，现在两个人坐却稍嫌狭窄。', 300, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑤ 字幕「随着马嘶声，两人奇妙的旅程也跟着展开。」（不配音） */
  S11.push({
    id: 'S11-06', name: '⑥ 字 · 旅程跟着展开',
    async run(tok) {
      /* ⑥ 字 · 旅程跟着展开（末尾马车离场）
         ⚠ 2026-11-12 用户定：立绘最后**向右上轻移一点再渐出**，表示离场。
            注意 cuRoad 从 S11-02 起有一条 14000ms / -130px 的左移长动画，
            到这一拍约跑到 -85 左右，所以这里给绝对目标 (-90, -40)，
            不会突跳，只是把「继续左移」改成「往右上收」。 */
      S.sub('随着马嘶声，两人奇妙的旅程也跟着展开。');
      await S.wait(1500, tok);
      endSub();

      S.act('cuRoad', 'idle', 1);
      S.transform('cuRoad', { x: -90, y: -40 }, 900, E.linear);   // 向右上
      S.fade('cuRoad', 0, 900);                                   // 同时渐出
      await S.wait(900, tok);
    },
  });

  /* ⑥ H053「总之，咱俩的相遇就是这样。咱一句话就把人给迷住了。」·得意 */
  S11.push({
    id: 'S11-07', name: '⑦ H053 一句话就把人给迷住了',
    async run(tok) {
      /* H053 —— cuRoad 已在 S11-06 末尾离场，这里不再挂抖动层（speaker 传 null） */
      await say(tok, 'H053',
        '赫萝：总之，咱俩的相遇就是这样。咱一句话就把人给迷住了。', 300, null);
      endSub();
      await S.wait(0, tok);
    },
  });

  /* ⑦ 帧B 回望【动画版】+ H218「一直在一起。」·温柔
        三帧 2D 动画风：f1 侧脸朝前 → f3 半回头 → f5 完全回头笑（定格）。
        三帧同 cx=700、同内容高 480，各自 spec 反算 left，视觉中心不动。
        ⚠ 换帧只给 90ms 交叉：给 280ms 会看到两颗头叠在一起（双头鬼影）。
        时序：帧A→f1 700 / f1 停 450 / f1→f3 90 / f3 停 320 / f3→f5 90
              → 共 1650ms（旧单帧版 1200ms） */
  S11.push({
    id: 'S11-08', name: '⑧ 帧B 回望动画 · 一直在一起',
    async run(tok) {
      const ZB = Z.actor + 5;
      /* ⚠ 2026-11-12 用户看到「S11-07 切 S11-08 时两个赫萝叠在一起」：
         原因是帧A 的 cuRoad 在淡出（700ms）与 cuL1 淡入同时进行，中间态同框。
         这里**先用 hide 瞬时归零**，不靠 fade 叠加 —— 五帧出场时台上只该有她一个。
         同时把 S11-02 的侧坐特写 cuLookB 也一并归零兜底。 */
      S.hide('cuRoad', 0);
      S.hide('cuLookB', 0);
      s10Cu = null;
      /* 五帧回望（2026-11-12 用户定：**五张总时长 2.5s**）。
         五张已统一 824×1332、内容中心一致（最大偏差 1.5px），全部叠在同一坐标，
         只靠 opacity 交替，渐变过程中人物不会位移。
         时序：每帧占 500ms（前 250ms 净显示、后 250ms 与下一帧交叉），5×500 = 2500ms。
         位置：cx 由 700 → 600 左移，给右侧片尾 logo 让位（2026-11-12 用户定）。 */
      const LOOK = [
        ['cuL1', P.lookB1], ['cuL2', P.lookB2], ['cuL3', P.lookB3],
        ['cuL4', P.lookB4], ['cuL5', P.lookB5],
      ];
      LOOK.forEach(([nm, src], i) => {
        cuShow(nm, src, CU.lookB, ZB, i === 0 ? 1 : 0, S11_ROAD_H, 600, CU_CY);
      });

      /* 帧A 已在上方 hide 归零，这里不再需要交接等待；
         直接开始 2.5s 五帧渐变（每帧 500ms = 250 显示 + 250 交叉）。 */
      for (let i = 0; i < LOOK.length; i++) {
        await S.wait(250, tok);
        if (i + 1 < LOOK.length) {
          S.fade(LOOK[i][0], 0, 250);
          S.fade(LOOK[i + 1][0], 1, 250);
        }
        await S.wait(250, tok);
      }

      await say(tok, 'H218', '赫萝：一直在一起。', 200, 'cuL5');
      endSub();
      await S.wait(0, tok);

      /* ---- 片尾 logo（2026-11-12 用户定：移到本拍末尾、居中、**不要黑底**）----
         logo 可见内容只占画布中间一条（内容 561×98 / 图 640×360），
         主体是深色细笔画（亮度中位 32.3、暗像素 55.8%），贴在亮底幕上会糊掉。
         用**白色光晕描边**（drop-shadow 白光）把笔画从底幕里托出来 ——
         不加任何衬底色块，保持原图透明底。
         居中 x=816：五帧先渐出，再浮现 logo，两者不重叠。 */
      S.fade('cuL1', 0, 400);
      S.fade('cuL2', 0, 400);
      S.fade('cuL3', 0, 400);
      S.fade('cuL4', 0, 400);
      S.fade('cuL5', 0, 400);
      await S.wait(400, tok);

      const K = 760 / 561;
      const LOGO_CX = 816, LOGO_CY = 470;
      S.setImage('logo', {
        src: P.logo, ratio: 640 / 360, w: 640 * K, h: 360 * K,
        x: LOGO_CX - 294 * K, y: LOGO_CY - 143.5 * K, anchor: 'tl',
        /* z=88：低于幕布(90)与台口(91)，闭幕时盖得住；高于人物层与压暗层。 */
        z: 88, opacity: 0,
      });
      const logoL = S.layers.get('logo');
      if (logoL && logoL.img) {
        /* 白光晕描边 + 轻微提亮：不改原图，不加黑底 */
        logoL.img.style.filter =
          'brightness(1.12) drop-shadow(0 0 3px rgba(255,255,255,.95))' +
          ' drop-shadow(0 0 1px rgba(255,255,255,.85))';
      }
      S.fade('logo', 1, 1200);          // 浮现
      await S.wait(1800, tok);          // 亮着给人看清
    },
  });

  /* ⑧ 撤台 · 空台静默 2.0s
        按上场倒序：赫萝(帧B)→马车(帧A)→月亮 → 回空底幕 */
  S11.push({
    id: 'S11-09', name: '⑨ 撤台 · 空台静默',
    async run(tok) {
      /* ① 赫萝先撤（五帧层一起，倒序：最后一帧先走、前面的跟着淡）
         ⚠ 2026-11-12：层名从旧的 cuB1~cuB3 换成 cuL1~cuL5（用户重抠的五帧），
            这里若还写 cuB* 会操作到不存在的层，撤台失效。 */
      S.transform('cuL5', { x: -320 }, 900, E.push);
      S.fade('cuL5', 0, 900);
      S.fade('cuL4', 0, 500);
      S.fade('cuL3', 0, 500);
      S.fade('cuL2', 0, 500);
      S.fade('cuL1', 0, 500);
      await S.wait(900, tok);

      // ② 马车撤（帧A 继续左移出画）
      S.transform('cuRoad', { x: -700 }, 800, E.push);
      S.fade('cuRoad', 0, 800);
      await S.wait(800, tok);

      // ③ 底幕回位（月亮已在 S11-01 换景推板时退场）
      const bgL = S.layers.get('bgRoad');
      if (bgL) S.transform('bgRoad', { x: 0 }, 700, E.linear);
      await S.wait(700, tok);

      // ④ 空台静默 2.0s —— 全片收尾，什么都不做
      await S.wait(2000, tok);

      // ⑤ 闭幕：幕布落下（logo 已在 S11-08 末尾浮现，这里只剩收幕）
      await S.closeCurtain();
      await S.wait(500, tok);
    },
  });

  /* ------------------------------ 导出 ------------------------------ */

  const SCENES = {
    S00: { name: 'S00 · 序章·麦田（白天）', beats: S00, t0: 0.00, t1: 70.67 },
    S01: { name: 'S01 · 独行（傍晚→入夜）', beats: S01, t0: 70.67, t1: 81.26 },
    S02: { name: 'S02 · 掀布', beats: S02, t0: 81.26, t1: 94.42 },
    S03: { name: 'S03 · 喊人', beats: S03, t0: 94.42, t1: 107.31 },
    S04: { name: 'S04 · 刚醒', beats: S04, t0: 107.31, t1: 115.33 },
    S05: { name: 'S05 · 初见', beats: S05, t0: 115.33, t1: 136.97 },
    S06: { name: 'S06 · 斗嘴', beats: S06, t0: 136.97, t1: 156.59 },
    S07: { name: 'S07 · 拔剑', beats: S07, t0: 156.59, t1: 183.53 },
    S08: { name: 'S08 · 亮耳朵尾巴', beats: S08, t0: 183.53, t1: 195.54 },
    S09: { name: 'S09 · 自报家门', beats: S09, t0: 195.54, t1: 212.73 },
    /* ⚠ 2026-11-13：S10-04 的时长是**手算修正值**，不是 _apply_timeline.js 的产物。
       那个脚本用惰性 thenable 复刻引擎语义 —— 只有 await 才推进时间；
       而 S10-04 里 `const pWrath = say(...)` 先创建 promise、中间 await 了两段
       (6200+4100)，最后才 await pWrath，于是那 10.3s 被算了两遍，
       测出 31.61s（真实 21.30s）。
       真实播放是并行的：H145 从 6.08s 播到 20.50s，中途 10.3s 切字幕与图。
       修正后 S10 = 6.71+5.90+9.39+21.30+11.93+9.06+13.00+5.86 = 83.15s */
    S10: { name: 'S10 · 夜话与启程', beats: S10, t0: 212.73, t1: 295.88 },
    S11: { name: 'S11 · 同行启程', beats: S11, t0: 295.88, t1: 338.50 },
  };

  const PLAYLIST = [];
  ['S00', 'S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11'].forEach((k) => {
    SCENES[k].beats.forEach((b) => PLAYLIST.push(Object.assign({ scene: k }, b)));
  });

  global.SCENES = SCENES;
  global.PLAYLIST = PLAYLIST;
  global.STAGE_PATHS = { P, AUDIO };
  global.STAGE_LAYOUT = { GY, CART_BODY_H, MAN_BODY_H, CART_CX, GAP, SPIRIT_Y };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SCENES, PLAYLIST, P, AUDIO };
  }
})(typeof window !== 'undefined' ? window : globalThis);
