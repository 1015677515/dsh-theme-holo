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
import { INTRO, SHELF_HINT, AFTER_EACH, FINALE, ITEMS } from './story.js';
import { Dialogue } from './ui.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dlg = new Dialogue();

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
  const holoRoot = new THREE.Group();
  holoRoot.position.set(0, 0, -0.72);
  holoRoot.rotation.y = Math.PI;      // 原模型朝 -z，转过来正对镜头
  scene.add(holoRoot);
  holo = await loadHolo(loader, '../assets/holo.glb', holoRoot);
  holo.talk = 0;
  holo.gest = 0.06;

  step(1, '好了');
  await sleep(180);

  const ld = document.getElementById('loading');
  ld.classList.add('fade');
  setTimeout(() => ld.remove(), 900);

  startLoop();
  window.__ready = true;
  runIntro();
}

/* ───────────────── 剧本播放 ───────────────── */
let state = 'boot';          // boot | intro | shelf | lesson | finale | end
const finished = new Set();

async function play(nodes, ctx = {}) {
  for (const n of nodes) {
    // 每一句都过一遍：没写表情的句子也会从轮播里拿一张新脸
    applyEm(n);
    if (n.fx) await doFx(n.fx, ctx);
    if (n.act) await doAct(n.act);
    if (n.choice) {
      const idx = await dlg.ask(n.choice.map((c) => c.label));
      state = 'lesson';
      await play(n.choice[idx].reply || [], ctx);
      continue;
    }
    if (n.text) await dlg.say(n.who, n.text);
  }
}

async function doFx(name, ctx) {
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
  await play(INTRO, {});
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

/** 从架子回到餐桌：赫萝会问一句，不占用主流程 */
async function goTable() {
  state = 'table';
  clearHover();
  setHud('');
  setView('face');
  setNav('回到置物架 ›');      // 立刻挂上，随时能回去
  await sleep(760);
  dlg.show();
  dlg.setSpeaker('holo');
  dlg.textEl.classList.remove('narration');
  dlg.textEl.textContent = '……唔？看累了，还是舍不得挑？';
  dlg.arrow.classList.remove('on');
  dlg.resolveNext = null;
  holo.expr.ear = 0.35;
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

  await play(item.steps, { show: item.show });

  hideItems();
  await play(AFTER_EACH, {});

  finished.add(id);
  dlg.hide();
  sp.userData.picked = false;
  resetExpr();

  if (finished.size >= Object.keys(ITEMS).length) {
    state = 'finale';
    await play(FINALE, {});
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
    idleMood();
    holo.talk += ((dlg.typing ? 1 : 0) - holo.talk) * (1 - Math.exp(-6 * dt));
    const gT = holo.talk > 0.5 ? 0.42 + 0.46 * (0.5 + 0.5 * Math.sin(t * 0.85)) : 0.06;
    holo.gest += (gT - holo.gest) * (1 - Math.exp(-3.2 * dt));
    animateHolo(holo, t, { talking: holo.talk, gesture: holo.gest, look: 1, dt });
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
  /** 试表情用：给个名字就整张脸切过去 */
  setMood(name) {
    const p = HAPPY_PRESETS[name];
    if (!p || !holo) return false;
    Object.assign(holo.expr, p);
    return true;
  },
};
