/**
 * 配音播放器
 *
 * 素材：assets/voice/<id>.wav（16kHz 单声道，19 条共 2.5 MB）
 * 索引：assets/voice/index.json
 *
 * 为什么不做「预加载全部」：
 *   2.5 MB 对一个网页小游戏不算小，而且大部分句子用户不会听到。
 *   所以按需加载 + 缓存：第一次播某句才去取，之后复用同一个 Audio。
 *
 * 为什么用 WebAudio 的 gain 而不是 Audio.volume：
 *   Audio.volume 是线性刻度，人耳是对数的，调小一点点听起来还是很响。
 *   用 GainNode 可以做平滑淡入淡出，切句时不会有「啪」的爆音。
 */

const VOICE_DIR = './assets/voice/';
const STORAGE_KEY = 'dsh-theme-holo.voice-on';

export function createVoice(opts = {}) {
  const { volume = 0.85 } = opts;

  const state = {
    ctx: null,            // AudioContext（首次播放时才建，避免自动播放策略报错）
    gain: null,
    cache: new Map(),     // id -> AudioBuffer
    index: null,
    current: null,        // 当前正在播的 source
    enabled: true,
    loading: new Map(),   // id -> Promise（防止同一句并发取两次）
  };

  // 用户上次的选择
  try {
    if (localStorage.getItem(STORAGE_KEY) === '0') state.enabled = false;
  } catch (e) { /* 隐私模式读不到，当作开着 */ }

  /** 惰性建 AudioContext（浏览器要求必须在用户手势里创建/恢复） */
  function ensureCtx() {
    if (state.ctx === null) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      state.ctx = new AC();
      state.gain = state.ctx.createGain();
      state.gain.gain.value = volume;
      state.gain.connect(state.ctx.destination);
    }
    if (state.ctx.state === 'suspended') state.ctx.resume().catch(() => {});
    return state.ctx;
  }

  /** 加载索引（只加载一次） */
  async function loadIndex() {
    if (state.index !== null) return state.index;
    try {
      const res = await fetch(VOICE_DIR + 'index.json');
      state.index = res.ok ? await res.json() : {};
    } catch (e) {
      console.warn('[voice] 索引加载失败:', e);
      state.index = {};
    }
    return state.index;
  }

  /** 取某一句的 AudioBuffer（带缓存） */
  async function bufferOf(id) {
    if (state.cache.has(id)) return state.cache.get(id);
    if (state.loading.has(id)) return state.loading.get(id);

    const p = (async () => {
      const ctx = ensureCtx();
      if (!ctx) return null;
      try {
        const res = await fetch(VOICE_DIR + id + '.wav');
        if (!res.ok) return null;
        const raw = await res.arrayBuffer();
        const buf = await ctx.decodeAudioData(raw);
        state.cache.set(id, buf);
        return buf;
      } catch (e) {
        console.warn('[voice] ' + id + ' 加载/解码失败:', e);
        return null;
      } finally {
        state.loading.delete(id);
      }
    })();

    state.loading.set(id, p);
    return p;
  }

  /** 停掉当前这句（带 80ms 淡出，避免爆音） */
  function stopCurrent() {
    const src = state.current;
    if (!src) return;
    state.current = null;
    try {
      const now = state.ctx.currentTime;
      // 单独给这条 source 套一个增益做淡出，不动总音量
      src.gainNode.gain.cancelScheduledValues(now);
      src.gainNode.gain.setValueAtTime(src.gainNode.gain.value, now);
      src.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.08);
      src.node.stop(now + 0.09);
    } catch (e) {
      try { src.node.stop(); } catch (e2) { /* 已经停了 */ }
    }
  }

  return {
    /** 预取（可选）：提前把要用的一句拉下来，播的时候不卡 */
    prefetch(id) { return bufferOf(id); },

    /** 索引里有没有这句 */
    async has(id) {
      const idx = await loadIndex();
      return Object.prototype.hasOwnProperty.call(idx, id);
    },

    /**
     * 播一句。返回 Promise，**不等人听完**（0.1 秒后 resolve）。
     *
     * 为什么不返回「播完」的 Promise：
     *   对话推进是用户点击驱动的，不该被音频长度卡住。
     *   如果返回「播完」，用户点快了就得等，手感很差。
     */
    async say(id) {
      if (!state.enabled || !id) return false;
      const idx = await loadIndex();
      if (!Object.prototype.hasOwnProperty.call(idx, id)) return false;

      const buf = await bufferOf(id);
      if (buf === null) return false;

      const ctx = ensureCtx();
      if (!ctx) return false;

      stopCurrent();

      const node = ctx.createBufferSource();
      node.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = 1;
      node.connect(g);
      g.connect(state.gain);

      const now = ctx.currentTime;
      // 20ms 淡入，避免开头「啪」
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(1, now + 0.02);

      node.start(now);
      const rec = { node, gainNode: g };
      state.current = rec;
      node.onended = () => {
        if (state.current === rec) state.current = null;
      };
      return true;
    },

    /** 立刻停（切换场景/离开时用） */
    stop() { stopCurrent(); },

    /** 开关 */
    setEnabled(on) {
      state.enabled = !!on;
      if (!state.enabled) stopCurrent();
      try { localStorage.setItem(STORAGE_KEY, state.enabled ? '1' : '0'); } catch (e) { /* ignore */ }
    },
    get enabled() { return state.enabled; },

    /** 调音量（0~1） */
    setVolume(v) {
      const nv = Math.max(0, Math.min(1, Number(v)));
      if (state.gain) state.gain.gain.value = nv;
      return nv;
    },

    /** 预加载整段要用的句子（可选，进入回忆模式时调一次） */
    async warm(ids) {
      await loadIndex();
      await Promise.all((ids || []).map((id) => bufferOf(id)));
    },

    /** 释放 */
    dispose() {
      stopCurrent();
      state.cache.clear();
      state.loading.clear();
      if (state.ctx) { state.ctx.close().catch(() => {}); state.ctx = null; }
    },
  };
}