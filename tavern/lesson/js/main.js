/**
 * 赫萝的黄昏课堂 —— 主控
 * 第一人称固定座位 + 鼠标视差微转；galgame 对话推进；置物架选择教具。
 */
import * as THREE from 'three';
import { GLTFLoader } from '../../vendor/GLTFLoader.js';
import { buildRoom } from './room.js';
import { buildTable, buildChair, buildTableProps, buildShelfItems, makeShowSprite } from './props.js';
import { preloadItemImages } from './icons.js';
import { loadHolo, animateHolo, bend, setExpr } from './holo.js';
import { HAPPY_PRESETS } from './face.js';
import { INTRO, SHELF_HINT, AFTER_EACH, FINALE, ITEMS,
         MEMORY_OFFER, MEMORY_CH1, MEMORY_AFTER, TABLE_OFFER } from './story.js';
import { createVoice } from './voice.js';
import { createHolo2D } from './holo2d.js';
import { mountHolo2DTuner } from './holo2d_tune.js';
import { Dialogue } from './ui.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dlg = new Dialogue();

/* ───────────────── 配音 ─────────────────
   不是每句都配：剧本里只有挂了 voice 的句子才出声。
   播放是「触发即走」，不阻塞对话 —— 用户点得快时不必等音频放完。
   ─────────────────────────────────────── */
const voice = createVoice({ volume: 0.85 });

/* 表情基准值：每讲一样东西都从这里重新开始 */
const EM_BASE = { mouth: 'neutral', brow: 0, tilt: 0, blush: 0.2, ear: 0.12, lean: 0, headTilt: 0 };
const resetExpr = () => { if (holo) Object.assign(holo.expr, EM_BASE); moodAt = t; };

/* ───────────────── 表情轮播 ─────────────────
 * 八款表情轮着上。规则：
 *  · 台词没写嘴型（或者只写了 neutral）→ 从轮播里取下一张脸
 *  · 台词明确写了 smirk / serious / sad / surprise 的 → 尊重剧本，不动
 *  · 停在原地不说话时，隔几秒自己轻轻换一个（只换温和的那几款，不突然大笑）
 * 环里 warm / soft 出现得多，大笑只占一格，避免每句都在笑场。
 */
const MOOD_RING = [
  'soft', 'warm', 'beam', 'warm', 'giggle', 'soft',
  'smug', 'warm', 'grin', 'soft', 'laugh', 'neutral',
];
const MOOD_KEYS = new Set(Object.keys(HAPPY_PRESETS));
/* 旁白 / 心里话这类句子不该咧嘴大笑，只在这几款里挑 */
const MOOD_QUIET = ['soft', 'warm', 'neutral', 'soft', 'warm', 'giggle'];
/* 待机时允许自动切的表情：动作幅度小的 */
const MOOD_IDLE = ['soft', 'warm', 'warm', 'giggle', 'smug'];

let moodI = Math.floor(Math.random() * MOOD_RING.length);
let moodAt = 0;                       // 上一次换脸的时刻，待机轮播从这往后数
let moodIdleNext = 0;                 // 下一款待机表情

const moodOf = (name) => (name === 'neutral' ? EM_BASE : HAPPY_PRESETS[name] || null);

/** 台词节点 → 该不该换脸 */
function applyEm(node) {
  if (!holo) return;
  if (state === 'memory') return;   // 回忆模式由 2D 立绘出场，不碰 3D 面部
  const n = node || {};
  const e = n.em || {};
  // 没写嘴型、或者只写了 neutral / smile 的，交给轮播重新挑一张
  const free = !e.mouth || e.mouth === 'neutral' || e.mouth === 'smile';
  if (free) {
    const quiet = n.who !== 'holo' || /^（/.test(n.text || '');
    let name;
    if (quiet) {
      name = MOOD_QUIET[moodI = (moodI + 1) % MOOD_QUIET.length];
    } else {
      name = MOOD_RING[moodI = (moodI + 1) % MOOD_RING.length];
    }
    const p = moodOf(name);
    if (p) Object.assign(holo.expr, p);
    // 台词里其余字段（眉、耳、歪头）仍然以剧本为准
    const rest = { ...e };
    delete rest.mouth;
    Object.assign(holo.expr, rest);
  } else {
    Object.assign(holo.expr, e);
  }
  moodAt = t;
}

/**
 * 待机换脸：只在温和表情之间跳。
 * 剧本写死的情绪（smirk / serious / sad）先让它挂够 16 秒，别一句话还没读完就被顶掉；
 * 那之后再慢慢松回温和的表情，人站在架子前等着的时候才不会一直绷着一张脸。
 */
function idleMood() {
  if (!holo || dlg.typing) return;
  const cur = holo.expr.mouth;
  const authored = !MOOD_KEYS.has(cur) && cur !== 'neutral';
  if (t - moodAt < (authored ? 16 : 11)) return;
  do {
    moodIdleNext = (moodIdleNext + 1) % MOOD_IDLE.length;
  } while (MOOD_IDLE[moodIdleNext] === cur);
  const p = moodOf(MOOD_IDLE[moodIdleNext]);
  if (p) Object.assign(holo.expr, p);
  moodAt = t;
}

/* ───────────────── 渲染基础 ───────────────── */
const canvas = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.42;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0805);
scene.fog = new THREE.FogExp2(0x140d07, 0.018);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.05, 60);
camera.rotation.order = 'YXZ';
camera.position.set(0, 1.32, 1.30);

const loader = new GLTFLoader();

/* ───────────────── 相机状态 ───────────────── */
const VIEW = {
  face: { pos: new THREE.Vector3(0, 1.32, 1.30), yaw: 0, pitch: -0.240, fov: 50 },
  shelf: { pos: new THREE.Vector3(0.02, 1.44, 1.32), yaw: -1.372, pitch: -0.048, fov: 48 },
  // 回忆模式：相机拉远、偏左，把右侧让给 2D 立绘
  memory: { pos: new THREE.Vector3(0, 1.30, 2.05), yaw: -0.34, pitch: -0.03, fov: 44 },
};

const cam = {
  pos: VIEW.face.pos.clone(),
  tgtPos: VIEW.face.pos.clone(),
  yaw: VIEW.face.yaw,
  tgtYaw: VIEW.face.yaw,
  pitch: VIEW.face.pitch,
  tgtPitch: VIEW.face.pitch,
  fov: VIEW.face.fov,
  tgtFov: VIEW.face.fov,
  mYaw: 0, mYawT: 0,
  mPitch: 0, mPitchT: 0,
};

function setView(name) {
  const v = VIEW[name];
  cam.tgtPos.copy(v.pos);
  cam.tgtYaw = v.yaw;
  cam.tgtPitch = v.pitch;
  cam.tgtFov = v.fov;
}

/* 鼠标视差：只做轻微偏转，鼠标停在哪就停在哪儿 */
const MOUSE_YAW = 0.105;
const MOUSE_PITCH = 0.052;
addEventListener('pointermove', (e) => {
  const nx = (e.clientX / innerWidth) * 2 - 1;
  const ny = (e.clientY / innerHeight) * 2 - 1;
  cam.mYawT = -nx * MOUSE_YAW;
  cam.mPitchT = -ny * MOUSE_PITCH;
});
addEventListener('pointerleave', () => {
  cam.mYawT = 0;
  cam.mPitchT = 0;
});

/* ───────────────── 世界 ───────────────── */
let room, tableProps, holo, shelfItems = {}, showLayer;
let holoRoot = null;          // 3D 赫萝的挂载点（回忆模式要把它收起来）
const showSprites = [];

async function boot() {
  const prog = document.getElementById('bar');
  const progText = document.getElementById('barText');
  const step = (p, t) => {
    prog.style.width = `${p * 100}%`;
    progText.textContent = t;
  };

  step(0.12, '搭起木屋的四壁');
  room = buildRoom(scene);
  await sleep(30);

  step(0.34, '摆好餐桌与长凳');
  buildTable(scene);
  buildChair(scene, 0, -0.87, 0);
  tableProps = buildTableProps(scene);

  step(0.46, '翻找架子上的旧物');
  await preloadItemImages();
  shelfItems = buildShelfItems(scene, room.shelf);

  // 展示用图层：赫萝举起的教具
  showLayer = new THREE.Group();
  showLayer.position.set(0, 0, 0);
  scene.add(showLayer);

  step(0.58, '生火');
  await sleep(30);

  step(0.66, '唤醒贤狼');
  const holoRootLocal = new THREE.Group();
  holoRootLocal.position.set(0, 0, -0.72);
  holoRootLocal.rotation.y = Math.PI;      // 原模型朝 -z，转过来正对镜头
  scene.add(holoRootLocal);
  holoRoot = holoRootLocal;
  holo = await loadHolo(loader, '../assets/holo.glb', holoRootLocal);
  holo.talk = 0;
  holo.gest = 0.06;

  step(1, '好了');
  await sleep(180);

  const ld = document.getElementById('loading');
  ld.classList.add('fade');
  setTimeout(() => ld.remove(), 900);

  startLoop();
  window.__ready = true;

  // 构建号显示到右上角：刷新后先看这里，数字没变就是还在跑缓存
  const tag = document.getElementById('buildTag');
  if (tag) {
    tag.textContent = 'BUILD ' + BUILD;
    tag.title = '如果数字没变，说明浏览器还在用缓存的旧代码';
  }
  window.__build = BUILD;

  runIntro();
}

/* ───────────────── 回忆模式 ─────────────────
   赫萝的 2D 立绘站在右侧讲述，左侧是舞台剧画面。
   立绘是 DOM 覆盖层（不由 three 渲染），因为：
     · 2D 平面进 3D 只会被场景的雾、色调映射、FOV 干扰；
     · 右侧定位是纯 CSS 的活；
     · 舞台剧画面本来就要叠 DOM 图层，同一套坐标系好对齐。
   ─────────────────────────────────────────── */
let holo2d = null;
const memEl = document.getElementById('memory');
const memTitle = document.getElementById('memTitle');
const memStage = document.getElementById('memStage');
const memPlaceholder = document.getElementById('memPlaceholder');

/* ───────────────── 版本号 ─────────────────
   酒馆的构建号。**改了这个目录里任何 js/css/html 就要 +1** ——
   否则浏览器会一直跑缓存里的旧代码，表现出来就是「改了却没生效」。

   为什么必须这么干：index.html 引 main.js 是静态 <script src>，
   main.js 里 import('./stage_v2.js') 是动态 import，两者都不带版本号。
   浏览器按 URL 缓存模块，URL 不变就一直用旧的。
   ─────────────────────────────────────────── */
const BUILD = 11;

/** 给同目录的模块/样式拼上版本号（动态 import 和 <link> 都用它） */
const ver = (path) => path + '?v=' + BUILD;

/* ───────────────── 木偶戏舞台 ─────────────────
   v2：**点击驱动**。
   每句台词对应一个「镜头」，用户点一下推进一句，舞台同步切到那一镜。
   唯一不随点击跳的是月亮 —— 它一直在缓慢横移，表示时间流逝。

   素材：assets/stage/（8 个 webp，约 1.0 MB）
   挂载时机：第一次进回忆模式时惰性创建。
   ─────────────────────────────────────────────── */
let stage = null;
let stagePromise = null;

/** 把舞台错误显示到页面上（贴在你的截图上就能看到原因，不用开控制台） */
function showStageError(msg) {
  if (!memStage) return;
  const box = document.createElement('div');
  box.style.cssText = [
    'position:absolute', 'inset:0', 'display:flex', 'flex-direction:column',
    'align-items:center', 'justify-content:center', 'gap:8px',
    'padding:18px', 'text-align:center',
    'font:13px/1.6 "Microsoft YaHei",system-ui,sans-serif',
    'color:#f0a8a0', 'background:rgba(30,8,6,.72)',
  ].join(';');
  const t = document.createElement('b');
  t.textContent = '舞台加载失败';
  t.style.cssText = 'font-size:15px;letter-spacing:.1em;color:#ffb4a8';
  const p = document.createElement('div');
  p.textContent = msg;
  p.style.cssText = 'opacity:.85;word-break:break-all;max-width:90%';
  box.appendChild(t);
  box.appendChild(p);
  memStage.appendChild(box);
}

/** 惰性创建舞台（只创建一次；素材加载失败就退回占位框） */
function ensureStage() {
  if (stagePromise !== null) return stagePromise;
  stagePromise = (async () => {
    if (!memStage) return null;
    try {
      // 动态 import 也要带版本号，否则模块缓存会让改动完全不生效
      const mod = await import(ver('./stage_v2.js'));
      if (typeof mod.createStage !== 'function') {
        throw new Error('stage_v2.js 没有导出 createStage');
      }
      stage = mod.createStage(memStage, {
        onError: (e) => {
          console.warn('[stage] 素材加载失败:', e);
          showStageError('素材加载失败：' + (e && e.message ? e.message : e));
        },
      });
      await stage.ready;
      if (memPlaceholder) memPlaceholder.style.opacity = '0';
      // stage 内部 visible 默认 false，不 show() 就一直是 opacity:0
      stage.show(true);
      return stage;
    } catch (e) {
      console.warn('[stage] 初始化失败，保留占位框:', e);
      // 把原因贴到舞台上 —— 不这样做的话，出问题只会看到一片空白
      showStageError((e && e.message ? e.name + ': ' + e.message : String(e)));
      return null;
    }
  })();
  return stagePromise;
}

/**
 * 跳到指定镜头（由剧本的 shot 字段驱动）。
 *
 * 第二个参数 byClick：剧本里的 shot 都是「玩家点出来的」，
 * 传 true 让舞台把正在进行的马车进/出场催快到 1 秒 ——
 * 用户要求「玩家点击就加快到 1s 完成动作」。
 */
function stageShot(i) {
  if (stage && typeof stage.gotoShot === 'function') stage.gotoShot(i, true);
}

/** 停舞台（离开回忆模式时调用） */
function stopStage() {
  if (!stage) return;
  stage.hide();
}

/**
 * 亮出舞台。
 *
 * 为什么不能只靠 ensureStage 里那次 show：
 *   ensureStage 有「只创建一次」的缓存 —— 第二次进回忆模式会直接返回
 *   已有实例、不会再跑 show，而离开时 stopStage 已经把舞台藏了。
 *   结果就是「第一次正常、看第二遍时舞台一片空白」。
 *   所以每次进回忆都要显式亮一次。
 */
function showStage() {
  if (stage && typeof stage.show === 'function') stage.show(true);
}

/** 舞台剧画面：单张 <img> 换 src；素材缺失就留着占位框 */
const memArt = document.createElement('img');
memArt.className = 'memory__art';
memArt.alt = '';
if (memStage) memStage.appendChild(memArt);
let memArtWanted = '';

/** 舞台图目录；素材到位后放 assets/stage/<id>.webp 即可自动生效 */
const STAGE_DIR = './assets/stage/';

function setStageArt(id) {
  if (!memArt) return;
  if (!id) { memArtWanted = ''; memArt.classList.remove('on'); return; }
  if (id === memArtWanted && memArt.classList.contains('on')) return;

  memArtWanted = id;
  memArt.classList.remove('on');       // 先藏，避免旧图闪一下

  memArt.onload = () => {
    if (memArtWanted !== id) return;   // 已经被后一张顶掉了
    memArt.classList.add('on');
  };
  memArt.onerror = () => {
    // 素材还没到位：留占位框，并把它标出来缺哪一张
    if (memArtWanted !== id) return;
    memArt.classList.remove('on');
    if (memPlaceholder) {
      memPlaceholder.innerHTML =
        '<b>舞台剧画面</b><span>（素材待补：' + id + '.webp）</span>';
      memPlaceholder.style.opacity = '1';
    }
  };

  memArt.src = STAGE_DIR + id + '.webp';
}

/** 调参面板只在 ?tune=1 时挂载（临时工具，删掉 holo2d_tune.js 即可移除） */
const TUNE_ON = new URLSearchParams(location.search).has('tune');
let tunerMounted = false;

/** 惰性创建 2D 立绘（93 KB，提前创建好，选完就能出） */
function ensureHolo2D() {
  if (holo2d !== null) return holo2d;
  holo2d = createHolo2D({
    onReady: () => {
      // 已经进了回忆就立刻显示；否则等 setMemory(true) 再说
      if (memEl && memEl.classList.contains('on')) holo2d.show(true);
      // 调参面板要等立绘就绪（它得读到真实布局才能给出初值）
      if (TUNE_ON && !tunerMounted) {
        tunerMounted = true;
        mountHolo2DTuner(holo2d);
      }
    },
    onError: () => console.warn('[memory] 2D 立绘不可用，只放舞台画面'),
  });
  return holo2d;
}

/** 进出回忆模式 */
function setMemory(on, title) {
  if (!memEl) return;
  memEl.classList.toggle('on', !!on);
  if (title && memTitle) memTitle.textContent = title;

  if (on) {
    ensureHolo2D().show(true);
    // 台上只留 2D 立绘：把 3D 的赫萝收起来，免得同框两个
    if (holoRoot) holoRoot.visible = false;
  } else {
    if (holo2d) holo2d.show(false);
    if (holoRoot) holoRoot.visible = true;
  }
}

/* ───────────────── 剧本播放 ───────────────── */
let state = 'boot';          // boot | intro | offer | memory | shelf | lesson | table | finale | end
const finished = new Set();

async function play(nodes, ctx = {}) {
  for (const n of nodes) {
    // 舞台镜头：跟着这句台词切（点击驱动，不自己播）
    if (n.shot !== undefined) stageShot(n.shot);

    // 2D 立绘的尾巴姿态（回忆模式）
    if (n.tail && holo2d) holo2d.setTail(n.tail);

    // 配音：只有挂了 voice 的句子才出声。
    // 不 await —— 音频长度不该卡住对话推进（用户点快了要能立刻翻页）。
    if (n.voice) voice.say(n.voice);

    // 每一句都过一遍：没写表情的句子也会从轮播里拿一张新脸
    applyEm(n);
    if (n.fx) await doFx(n, ctx);
    if (n.act) await doAct(n.act);
    // 跳出当前流程：抛一个信号，由 goto() 的调用方接住并转场。
    // 不用「直接递归调用目标函数」—— 那样每转一次场栈就深一层，
    // 「再听一遍」点几次之后会越积越深，而且很难中断。
    if (n.go) throw { __goto: n.go };
    if (n.choice) {
      const idx = await dlg.ask(n.choice.map((c) => c.label));
      await play(n.choice[idx].reply || [], ctx);
      continue;
    }
    if (n.text) await dlg.say(n.who, n.text);
  }
}

/** 跑一段剧本，接住里面的 go 信号，转到对应流程
 *
 *  用法：await runScene(MEMORY_CH1) —— 它会自己处理剧本里的 go。
 *  转场目标自己也会处理自己的 go，所以链是平级的，不会递归。
 */
async function runScene(nodes, ctx = {}) {
  try {
    await play(nodes, ctx);
    return null;                 // 正常跑完，没有 go
  } catch (sig) {
    if (sig && sig.__goto) return sig.__goto;
    throw sig;                   // 不是 go 信号，照常抛出去
  }
}

/** go 的落点：把「换流程」从剧本里声明式地跳出来 */
async function goto(where, ctx) {
  if (where === 'memory') { await startMemory(); return; }
  if (where === 'shelf') { await enterShelf(); return; }
  if (where === 'table') { await goTable(); return; }
  console.warn('[story] 未知的 go 目标:', where);
}

async function doFx(node, ctx) {
  const name = node.fx;
  if (name === 'shelf') {
    setView('shelf');
    setHud('挑一样东西');
    await sleep(900);
  } else if (name === 'face') {
    setView('face');
    setHud('');
    await sleep(900);
  } else if (name === 'show') {
    showItems(ctx.show || []);
    await sleep(320);
  } else if (name === 'hide') {
    hideItems();
    await sleep(260);
  } else if (name === 'memOn') {
    // 进回忆：压暗房间、架起 2D 立绘、拉开镜头
    setView('memory');
    setMemory(true, node.title || '');
    setHud('');
    setNav('');
    await ensureStage();
    // 每次进回忆都要重新亮出舞台 —— 上一轮离开时 hide 过了，
    // 而 ensureStage 有缓存不会重跑，不显式 show 第二遍就是空白。
    showStage();
    // 开场镜头（月亮已在画面里，绳子都藏着）
    stageShot(node.shot ?? 0);
    await sleep(760);
  } else if (name === 'memArt') {
    // 老钩子，v2 不再用（画面由 shot 驱动）
    await sleep(60);
  } else if (name === 'memOff') {
    // 出回忆：收回立绘、镜头回座位、停舞台
    stopStage();
    setMemory(false);
    setView('face');
    await sleep(620);
  }
}

async function doAct(name) {
  if (name === 'bite') {
    // 抬手到嘴边 → 放下
    holo._bite = 1;
    await sleep(650);
    holo._bite = 0;
    await sleep(250);
  }
}

function setHud(text) {
  const el = document.getElementById('hudHint');
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('on', !!text);
}

async function runIntro() {
  state = 'intro';
  await sleep(500);
  const next = await runScene(INTRO, {});
  if (next) { await goto(next); return; }
  await runOffer();
}

/** 讲完开场，赫萝问要不要听往事；两条岔路都从这里出去 */
async function runOffer() {
  state = 'offer';
  ensureHolo2D();               // 趁她说话，把 2D 立绘先解码好
  dlg.show();
  dlg.setSpeaker('holo');
  dlg.textEl.classList.remove('narration');
  setNav('');
  const next = await runScene(MEMORY_OFFER, {});
  if (next) { await goto(next); return; }
  // 正常会在 go 处跳走；万一没跳，兜底回架子
  await enterShelf();
}

/** 回忆 · 第一章：初次相遇 */
async function startMemory() {
  state = 'memory';
  dlg.clear();
  resetExpr();
  setHud('');
  setNav('');
  dlg.show();

  const a = await runScene(MEMORY_CH1, {});
  if (a) { await goto(a); return; }
  // MEMORY_AFTER 只有收尾画面，没有选择支 ——
  // 「接下来做什么」统一交给 goTable() 里的 TABLE_OFFER 分岔。
  const b = await runScene(MEMORY_AFTER, {});
  if (b) { await goto(b); return; }

  dlg.hide();
  await enterShelf();
}

async function enterShelf() {
  state = 'shelf';
  setView('shelf');           // 讲完自动转回置物架
  setHud('挑一件东西');
  markAvailable();            // 先把已讲完的物品压暗，再走提示
  setNav('‹ 回到餐桌');        // 一进架子就能走，不用等提示播完
  await play(SHELF_HINT, {});
  dlg.show();
  dlg.setSpeaker(null);
  dlg.textEl.classList.add('narration');
  dlg.textEl.textContent = '（挑一件。挑过的会暗下去。）';
  dlg.arrow.classList.remove('on');
  dlg.resolveNext = null;
  setNav('‹ 回到餐桌');
}

/* ── 架子 ↔ 餐桌 往返 ── */
const navBtn = document.getElementById('navBtn');

function setNav(label) {
  navBtn.textContent = label || '';
  navBtn.classList.toggle('on', !!label);
}

navBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (state === 'shelf') goTable();
  else if (state === 'table') goShelf();
});

/** 从架子回到餐桌：这里是一个真正的分岔点
 *
 *  以前只是固定一句「看累了？」，现在换成 TABLE_OFFER —— 三条路：
 *    再听一遍旅行故事 / 看看旅行的收藏品 / 今晚就到这儿。
 *  这样「再听一遍」在回餐桌之后就能选，不用等讲完的瞬间。
 */
async function goTable() {
  state = 'table';
  clearHover();
  setHud('');
  setView('face');
  setNav('回到置物架 ›');
  dlg.show();
  dlg.setSpeaker('holo');
  dlg.textEl.classList.remove('narration');
  await sleep(600);

  // 分岔：选「再听」会走 goto('memory')，选「收藏品」会走 goto('shelf')
  const next = await runScene(TABLE_OFFER, {});
  if (next) { await goto(next); return; }

  // 只有「今晚就到这儿」会走到这里（不 go 的分支）
  setNav('回到置物架 ›');
}

// 餐桌状态下点对话框，也等于「回架子」
dlg.root.addEventListener('pointerdown', () => {
  if (state === 'table') goShelf();
});

/** 从餐桌回到架子 */
async function goShelf() {
  state = 'shelf';
  setView('shelf');
  setHud('挑一件东西');
  setNav('‹ 回到餐桌');        // 立刻挂上，别让按钮空着
  await sleep(700);
  dlg.show();
  dlg.setSpeaker(null);
  dlg.textEl.classList.add('narration');
  dlg.textEl.textContent = '（架子上的东西浮着一层淡淡的光。）';
  dlg.arrow.classList.remove('on');
  dlg.resolveNext = null;
  setNav('‹ 回到餐桌');
}
/** 把还没讲过的物品调亮 */
function markAvailable() {
  for (const [id, sp] of Object.entries(shelfItems)) {
    const done = finished.has(id);
    sp.userData.dim = done;
    sp.material.opacity = done ? 0.32 : 1;
  }
}

async function startLesson(id) {
  if (state !== 'shelf') return;
  clearHover();
  state = 'lesson';
  setHud('');
  setNav('');
  dlg.clear();
  resetExpr();

  const item = ITEMS[id];
  const sp = shelfItems[id];

  // 选中的物品从架子上"被拿走"
  sp.userData.picked = true;

  dlg.show();
  dlg.setSpeaker('holo');
  dlg.textEl.classList.remove('narration');
  dlg.textEl.textContent = `（赫萝伸手，取下了${item.name}。）`;
  await sleep(320);

  setView('face');
  await sleep(880);

  const a = await runScene(item.steps, { show: item.show });
  if (a) { await goto(a); return; }

  hideItems();
  const b = await runScene(AFTER_EACH, {});
  if (b) { await goto(b); return; }

  finished.add(id);
  dlg.hide();
  sp.userData.picked = false;
  resetExpr();

  if (finished.size >= Object.keys(ITEMS).length) {
    state = 'finale';
    await runScene(FINALE, {});
    dlg.hide();
    setHud('');
    state = 'end';
    const endEl = document.getElementById('endNote');
    endEl.classList.add('on');
    return;
  }
  await enterShelf();
}

/* ───────────────── 教具贴图 ───────────────── */
function showItems(ids) {
  hideItems();
  const n = ids.length;
  ids.forEach((id, i) => {
    const sp = makeShowSprite(id, n > 1 ? 0.42 : 0.50);
    // 摆在她左上方那片空墙前 —— 别压住背后的壁炉
    const x = n > 1 ? -0.92 + i * 0.48 : -0.30;
    const y = n > 1 ? 1.10 : 1.14;
    sp.position.set(x, y, n > 1 ? -0.66 : -0.62);
    sp.userData.phase = i * 1.7;
    sp.userData.baseY = y;
    sp.material.opacity = 0;
    showLayer.add(sp);
    showSprites.push(sp);
  });
}

function hideItems() {
  for (const sp of showSprites) {
    showLayer.remove(sp);
    sp.material.map.dispose();
    sp.material.dispose();
  }
  showSprites.length = 0;
}

/* ───────────────── 交互 ───────────────── */
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let hovered = null;
const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
const tip = document.getElementById('tip');

addEventListener('pointermove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function pickItem() {
  ndc.set((mouse.x / innerWidth) * 2 - 1, -(mouse.y / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const list = Object.values(shelfItems);
  const hits = ray.intersectObjects(list, false);
  for (const h of hits) {
    if (h.object.userData.picked) continue;
    return h.object;
  }
  return null;
}

function clearHover() {
  if (hovered) {
    hovered.userData.hover = false;
    hovered = null;
  }
  tip.classList.remove('on');
  canvas.style.cursor = 'default';
}

function updateHover() {
  if (state !== 'shelf') {
    clearHover();
    return;
  }
  const o = pickItem();
  if (o !== hovered) {
    if (hovered) hovered.userData.hover = false;
    hovered = o;
    if (o) {
      o.userData.hover = true;
      tip.textContent = ITEMS[o.userData.id].name;
      tip.classList.add('on');
      canvas.style.cursor = 'pointer';
    } else {
      tip.classList.remove('on');
      canvas.style.cursor = 'default';
    }
  }
  if (hovered) {
    tip.style.transform = `translate3d(${mouse.x + 16}px, ${mouse.y - 12}px, 0)`;
  }
}

canvas.addEventListener('click', () => {
  if (state !== 'shelf') return;
  const o = pickItem();
  if (o) startLesson(o.userData.id);
});

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

/* ───────────────── 主循环 ───────────────── */
const clock = new THREE.Clock();
let t = 0;

function startLoop() {
  renderer.setAnimationLoop(tick);
}

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  t += dt;

  /* 相机 */
  const k = 1 - Math.exp(-3.6 * dt);
  cam.pos.lerp(cam.tgtPos, k);
  cam.yaw += (cam.tgtYaw - cam.yaw) * k;
  cam.pitch += (cam.tgtPitch - cam.pitch) * k;
  cam.fov += (cam.tgtFov - cam.fov) * k;
  const k2 = 1 - Math.exp(-7.0 * dt);
  cam.mYaw += (cam.mYawT - cam.mYaw) * k2;
  cam.mPitch += (cam.mPitchT - cam.mPitch) * k2;

  camera.position.copy(cam.pos);
  camera.rotation.set(cam.pitch + cam.mPitch, cam.yaw + cam.mYaw, 0, 'YXZ');
  if (Math.abs(camera.fov - cam.fov) > 0.02) {
    camera.fov = cam.fov;
    camera.updateProjectionMatrix();
  }

  /* 角色 */
  if (holo) {
    if (state === 'memory') {
      // 回忆模式：3D 赫萝已收起，只把「在说话」的信号转给 2D 立绘
      if (holo2d) holo2d.setTalking(dlg.typing);
    } else {
      idleMood();
      holo.talk += ((dlg.typing ? 1 : 0) - holo.talk) * (1 - Math.exp(-6 * dt));
      const gT = holo.talk > 0.5 ? 0.42 + 0.46 * (0.5 + 0.5 * Math.sin(t * 0.85)) : 0.06;
      holo.gest += (gT - holo.gest) * (1 - Math.exp(-3.2 * dt));
      animateHolo(holo, t, { talking: holo.talk, gesture: holo.gest, look: 1, dt });
    }
  }

  /* 火焰 */
  if (room) {
    const f = room.lights.fire;
    f.intensity = 5.0 + Math.sin(t * 8.3) * 0.55 + Math.sin(t * 17.7) * 0.35;
    room.lights.fire2.intensity = 1.5 + Math.sin(t * 6.1 + 1.3) * 0.3;
    for (const sp of room.flames) {
      const ph = sp.userData.ph;
      sp.scale.setScalar(0.46 + Math.sin(t * 5.2 + ph) * 0.05 + Math.sin(t * 11 + ph) * 0.025);
      sp.position.x = (ph / 2.1 - 1) * 0.12 + Math.sin(t * 3.1 + ph) * 0.012;
    }
  }
  if (tableProps) {
    const cf = tableProps.candleFlame;
    cf.scale.setScalar(0.072 + Math.sin(t * 9.4) * 0.006);
    cf.position.x = 0.86 + Math.sin(t * 4.2) * 0.0018;
    tableProps.candleLight.intensity = 1.35 + Math.sin(t * 11.3) * 0.16;
  }

  /* 架子上的物品：悬浮、呼吸、hover 反馈 */
  for (const sp of Object.values(shelfItems)) {
    const u = sp.userData;
    if (u.picked) {
      sp.material.opacity += (0 - sp.material.opacity) * (1 - Math.exp(-8 * dt));
      continue;
    }
    const bob = Math.sin(t * 1.25 + u.phase) * 0.012;
    sp.position.y = u.home.y + bob;
    const wanted = u.hover ? u.baseScale * 1.22 : u.baseScale;
    sp.scale.x += (wanted - sp.scale.x) * (1 - Math.exp(-10 * dt));
    sp.scale.y = sp.scale.x;
    const oT = u.dim ? 0.3 : 1;
    sp.material.opacity += (oT - sp.material.opacity) * (1 - Math.exp(-6 * dt));
  }

  /* 赫萝举起的教具：悬浮 + 绕轴翻转 */
  for (const sp of showSprites) {
    const ph = sp.userData.phase || 0;
    const a = t * 1.15 + ph;
    const base = sp.scale.y || 0.44;
    sp.scale.x = base * (0.22 + 0.78 * Math.abs(Math.cos(a)));
    sp.position.y = sp.userData.baseY + Math.sin(t * 1.5 + ph) * 0.028;
    sp.material.opacity += (1 - sp.material.opacity) * (1 - Math.exp(-6 * dt));
  }

  updateHover();
  renderer.render(scene, camera);
}

/* 启动 */
boot().catch((e) => {
  console.error(e);
  const el = document.getElementById('barText');
  if (el) el.textContent = `加载失败：${e.message}`;
});

/* 调试钩子（开发用，保留便于你继续调） */
window.__dbg = {
  get scene() { return scene; },
  camera, cam, room,
  get shelfItems() { return shelfItems; },
  get showSprites() { return showSprites; },
  setView, startLesson, play, dlg, bend, animateHolo,
  get holo() { return holo; },
  get state() { return state; },
  THREE,
  HAPPY_PRESETS,
  /* 回忆模式 */
  setMemory, startMemory, runOffer, setStageArt, ensureHolo2D,
  get holo2d() { return holo2d; },
  get memoryOn() { return !!(memEl && memEl.classList.contains('on')); },
  /** 试表情用：给个名字就整张脸切过去 */
  setMood(name) {
    const p = HAPPY_PRESETS[name];
    if (!p || !holo) return false;
    Object.assign(holo.expr, p);
    return true;
  },
};
