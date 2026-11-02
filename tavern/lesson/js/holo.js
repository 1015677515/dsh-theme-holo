/**
 * 赫萝：加载 Holo.glb，把站立 T-pose 改造成"坐在餐桌对面"的坐姿，
 * 并驱动待机 / 说话 / 举手讲解等程序化动作（原包没有 AnimationClip）。
 */
import * as THREE from 'three';
import { mouthCanvas, blushCanvas, lipMaskCanvas } from './face.js';

const _e = new THREE.Euler();
const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _q2 = new THREE.Quaternion();

/** 在初始 quaternion 上叠加欧拉旋转；同名骨骼可能有多份副本，全部应用 */
export function bend(list, x = 0, y = 0, z = 0) {
  if (!list || !list.length) return;
  _e.set(x, y, z, 'XYZ');
  _q.setFromEuler(_e);
  for (const b of list) b.quaternion.copy(b.userData.q0).multiply(_q);
}

/** 只应用到指定轴 */
function bendAxis(list, ax, amt) {
  bend(list, ax === 'x' ? amt : 0, ax === 'y' ? amt : 0, ax === 'z' ? amt : 0);
}

/** 绕任意局部轴旋转（归一化四元数），用于手指这种轴不规整的关节 */
function bendAxisDir(list, axis, angle) {
  if (!list || !list.length || !axis) return;
  _q.setFromAxisAngle(axis, angle);
  for (const b of list) b.quaternion.copy(b.userData.q0).multiply(_q);
}

function worldOf(bone, root) {
  root.updateMatrixWorld(true);
  return bone.getWorldPosition(new THREE.Vector3());
}

/**
 * 坐姿：把大腿折到接近水平、小腿折到垂直。
 * 骨骼的局部轴方向因 rig 而异（这套 rig 左右还有镜像），
 * 所以对三个轴、两个方向都实试一遍，按"脚最靠前 / 脚最低"挑结果。
 */
function foldLeg(B, root, side, thighAmt, kneeAmt) {
  const upList = B[side + 'UpLeg'];
  const loList = B[side + 'Leg'];
  const footBone = B[side + 'Foot'] && B[side + 'Foot'][0];
  if (!upList || !loList || !footBone) return null;

  const probe = () => worldOf(footBone, root);

  // 大腿：目标 —— 脚靴往角色正前方（+z）移动
  let best = { z: -Infinity };
  for (const ax of ['x', 'y', 'z']) {
    for (const s of [1, -1]) {
      bendAxis(upList, ax, s * 0.7);
      const v = probe();
      if (v.z > best.z) best = { ax, s, z: v.z };
    }
  }
  bendAxis(upList, best.ax, best.s * thighAmt);
  root.updateMatrixWorld(true);

  // 小腿：目标 —— 脚落到最低点（即膝盖向前回折）
  let best2 = { y: Infinity };
  for (const ax of ['x', 'y', 'z']) {
    for (const s of [1, -1]) {
      bendAxis(loList, ax, s * 0.9);
      const v = probe();
      if (v.y < best2.y) best2 = { ax, s, y: v.y };
    }
  }
  bendAxis(loList, best2.ax, best2.s * kneeAmt);
  root.updateMatrixWorld(true);

  return { thigh: best, knee: best2 };
}

export async function loadHolo(loader, url, root) {
  const gltf = await loader.loadAsync(url);
  const model = gltf.scene;
  model.name = 'holo';

  // 归一化到 1.50m（赫萝在设定里就是小个子）
  let bb = new THREE.Box3().setFromObject(model);
  const k = 1.50 / (bb.max.y - bb.min.y);
  model.scale.multiplyScalar(k);
  root.add(model);
  root.updateMatrixWorld(true);

  bb = new THREE.Box3().setFromObject(model);
  model.position.y -= bb.min.y;
  root.updateMatrixWorld(true);

  // 骨骼按名字归档（3 套 skin 各带一份同名骨骼）
  const bones = {};
  model.traverse((o) => {
    if (!o.isBone) return;
    o.userData.q0 = o.quaternion.clone();
    (bones[o.name] || (bones[o.name] = [])).push(o);
  });

  model.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    o.frustumCulled = false;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      if (!m) continue;
      m.side = THREE.DoubleSide;      // Unity 导出绕序不定，双面最稳
      if (m.map) m.map.anisotropy = 8;
      m.roughness = Math.min(1, (m.roughness ?? 0.8));
    }
  });

  const H = { model, bones, root, diag: {} };

  // 手部姿态参数（坐姿下把手搭在桌沿）
  // 左右手的局部轴是镜像的，必须各用一组参数
  // 数值是按"手腕落在桌面 (±0.163, 0.780, -0.315)"做坐标下降搜出来的
  H.hand = {
    L: { armY: 1.251, armZ: 0.119, foreY: 0.091, foreZ: -0.080 },
    R: { armY: -1.280, armZ: 0.077, foreY: -0.002, foreZ: -0.044 },
    curl: 0.11,                    // 手指蜷曲（每节弧度）
    spread: 0,                     // 手指张开
  };
  // 调参用：摆一次手臂 / 重算手腕朝向
  H.applyHand = () => applyHand(H);
  H.resolve = () => setupHand(H);

  // 表情状态：目标值 + 当前插值值
  H.expr = { mouth: 'neutral', open: 0.3, brow: 0, tilt: 0, blush: 0.15, ear: 0, lean: 0, headTilt: 0 };
  H.now = { mouth: 'neutral', open: 0.3, brow: 0, tilt: 0, blush: 0.15, ear: 0, lean: 0, headTilt: 0 };
  H.blink = 0;

  sitPose(H);
  setupHand(H);
  setupFace(H);
  return H;
}

/** T-pose → 坐姿 */
export function sitPose(H) {
  const B = H.bones;
  const root = H.root;

  // 1) 腿
  const l = foldLeg(B, root, 'Left', 1.52, 1.48);
  const r = foldLeg(B, root, 'Right', 1.52, 1.48);
  H.diag.legs = { l, r };

  // 2) 手臂：上臂自然垂下（方向实探，rig 左右镜像）
  H.armSgn = {};
  for (const side of ['Left', 'Right']) {
    H.armSgn[side] = probeDown(B, root, side);
  }

  // 3) 尾巴在坐姿下会顶到椅子，整体往上抬一点，向后侧绕
  for (let i = 1; i <= 8; i++) {
    if (B['Tail_' + i]) bend(B['Tail_' + i], -0.30 + i * 0.02, 0, 0);
  }

  // 4) 上身微微前倾（讲课的姿势）
  bend(B.Spine1, 0.045, 0, 0);
  bend(B.Spine2, 0.035, 0, 0);
  bend(B.Neck, -0.02, 0, 0);

  // 5) 整体下移到坐高
  root.updateMatrixWorld(true);
  const hips = B.Hips && B.Hips[0];
  const SEAT_HIPS = 0.58;          // 臀骨落在座面上方一点
  if (hips) {
    const hy = hips.getWorldPosition(new THREE.Vector3()).y;
    root.position.y += SEAT_HIPS - hy;
    root.updateMatrixWorld(true);
  }

  // 6) 坐姿身高补偿：
  //    归一化时用的是整体包围盒，而赫萝的耳朵是竖起来的，
  //    导致身体被缩到只有 1.2m 出头，坐下来只露一个头在桌面上。
  //    这里按坐姿的实际头顶再补一次缩放，并把臀部重新对回座面。
  if (hips) {
    const bb = new THREE.Box3().setFromObject(H.model);
    const targetTop = 1.36;        // 含耳朵的坐姿头顶高度
    const k2 = targetTop / bb.max.y;
    if (k2 > 1.02 || k2 < 0.98) {
      H.model.scale.multiplyScalar(k2);
      root.updateMatrixWorld(true);
      const hy2 = hips.getWorldPosition(new THREE.Vector3()).y;
      root.position.y += SEAT_HIPS - hy2;
      root.updateMatrixWorld(true);
    }
    H.diag.fit = { k2: +k2.toFixed(3), top: +new THREE.Box3().setFromObject(H.model).max.y.toFixed(3) };
  }

  H.sitY = root.position.y;
}

/* ───────────────── 手：参数化 + 手指蜷曲 ───────────────── */

const FINGERS = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];

/** 按 H.hand 的参数摆一次手臂（时间无关的静态部分） */
function applyHand(H) {
  const B = H.bones;
  const sL = H.armSgn.Left, sR = H.armSgn.Right, p = H.hand;
  bend(B.LeftArm, 0, p.L.armY, p.L.armZ * sL);
  bend(B.RightArm, 0, p.R.armY, p.R.armZ * sR);
  bend(B.LeftForeArm, 0, p.L.foreY, p.L.foreZ * sL);
  bend(B.RightForeArm, 0, p.R.foreY, p.R.foreZ * sR);
}

/**
 * 手指骨骼的弯曲轴不规整（拇指和其余四指方向不同），
 * 这里用"手掌宽度方向"实测出每根手指的局部弯曲轴，之后每帧只改角度。
 */
function setupHand(H) {
  applyHand(H);
  H.root.updateMatrixWorld(true);

  const B = H.bones;
  H.fingers = { Left: [], Right: [] };
  H.handQ = {};

  for (const side of ['Left', 'Right']) {
    const get = (n) => B[n] && B[n][0];
    const wristB = get(side + 'Hand');
    const mid1 = get(side + 'HandMiddle1');
    const mid3 = get(side + 'HandMiddle3');
    const thumb1 = get(side + 'HandThumb1');
    const pinky1 = get(side + 'HandPinky1');
    if (!wristB || !mid1 || !mid3 || !thumb1 || !pinky1) continue;

    const wp = (b) => b.getWorldPosition(new THREE.Vector3());
    const f = wp(mid3).sub(wp(wristB)).normalize();          // 手指延伸方向
    const s = wp(thumb1).sub(wp(pinky1)).normalize();        // 手掌宽度方向
    const axis = new THREE.Vector3().crossVectors(f, s).normalize();

    // 绕哪个方向转才会让指尖往掌心（下方）收 —— 实试一次
    const before = wp(mid3);
    const pq0 = mid1.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
    mid1.quaternion.copy(mid1.userData.q0).multiply(
      new THREE.Quaternion().setFromAxisAngle(axis.clone().applyQuaternion(pq0).normalize(), 0.5)
    );
    H.root.updateMatrixWorld(true);
    const dir = wp(mid3).y < before.y ? 1 : -1;
    mid1.quaternion.copy(mid1.userData.q0);
    H.root.updateMatrixWorld(true);

    const bendAxisWorld = axis.multiplyScalar(dir);
    H.handQ[side] = wristQuat(H, side);

    for (const fn of FINGERS) {
      for (let k = 1; k <= 3; k++) {
        const b = get(side + 'Hand' + fn + k);
        if (!b || !b.parent) continue;
        const pq = b.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
        const la = bendAxisWorld.clone().applyQuaternion(pq).normalize();
        H.fingers[side].push({ b, axis: la, k, fn });
      }
    }
  }
}

/**
 * 手腕的世界朝向不好用欧拉角凑（这套 rig 没有"抬起"轴），
 * 直接构造：手指朝 +z（伸向桌心），掌心朝下（贴桌面）。
 *
 * 掌心的法线不能用"拇指-小指"来算 —— 拇指本身是抬起的，
 * 算出来的法线带着一个滚转误差，手掌就会歪成一条斜的，
 * 结果一边掌根陷进桌布、另一边翘起来。改成用三个指根骨构成的平面。
 */
function wristQuat(H, side) {
  const B = H.bones;
  const get = (n) => (B[n] && B[n][0]) || null;
  const hand = get(side + 'Hand');
  const mid3 = get(side + 'HandMiddle3');
  const i1 = get(side + 'HandIndex1');
  const m1 = get(side + 'HandMiddle1');
  const p1 = get(side + 'HandPinky1');
  if (!hand || !mid3 || !i1 || !m1 || !p1) return null;

  H.root.updateMatrixWorld(true);
  const wp = (b) => b.getWorldPosition(new THREE.Vector3());
  const wrist = wp(hand);
  const fw = wp(mid3).sub(wrist).normalize();

  const pi = wp(i1), pm = wp(m1), pp = wp(p1);
  const nw = new THREE.Vector3()
    .crossVectors(pi.clone().sub(pm), pp.clone().sub(pm))
    .normalize();
  if (nw.y > 0) nw.negate();           // 统一成"掌心朝下"那一侧

  // 手指伸向桌心（略微上扬，抵消手指蜷曲带来的下垂）。
  // 不顺着前臂延长线走 —— 前臂在这个坐姿里偏竖直，顺着它手指会朝外张成"海星"。
  const inward = -Math.sign(wrist.x || 1);
  const fW = new THREE.Vector3(inward * 0.16, 0.16, 1).normalize();
  const nW = new THREE.Vector3(0, -1, 0);

  const orth = (f, n) => n.clone().addScaledVector(f, -n.dot(f)).normalize();
  const fwO = orth(nw, fw);            // 手指方向投影到掌心平面
  const nwO = nw.clone();
  const fWO = orth(nW, fW);
  const nWO = orth(fWO, nW);

  const mk = (f, n) => new THREE.Matrix4().makeBasis(f, n, new THREE.Vector3().crossVectors(f, n));
  const Rcorr = mk(fWO, nWO).multiply(mk(fwO, nwO).invert());

  const qw = hand.getWorldQuaternion(new THREE.Quaternion());
  const qw2 = new THREE.Quaternion().setFromRotationMatrix(Rcorr).multiply(qw);
  const pq = hand.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
  return pq.multiply(qw2);
}

/** 手指蜷曲（每帧调用） */
function curlFingers(H, side, curl, spread = 0) {
  const list = H.fingers && H.fingers[side];
  if (!list) return;
  for (const it of list) {
    const kk = it.k === 1 ? 1 : it.k === 2 ? 0.92 : 0.72;
    const sp = it.fn === 'Thumb' ? 0.35 : 1;
    bendAxisDir([it.b], it.axis, curl * kk * sp + spread * 0.1 * it.k);
  }
}

/* ───────────────── 脸：嘴 / 腮红叠加层 ───────────────── */

// 嘴部叠加面片。y 是按"模型自带的嘴"实测标定的：原值 -0.0224 会让
// 叠加层比模型嘴低 4.5mm，看着像嘴里含了东西。画布也加大到 4:3，
// 给张嘴型的牙齿和舌头留出竖直空间。
const MOUTH_OFF = new THREE.Vector3(0, -0.0340, 0.1172);
// 腮红原来贴在 x=±0.0685，比脸还宽 —— 整块飘在头发上，所以一直看不出来
const BLUSH_OFF = [
  new THREE.Vector3(0.050, -0.002, 0.109),
  new THREE.Vector3(-0.050, -0.002, 0.109),
];

const _mouthCache = new Map();
function mouthTexture(kind, open) {
  const step = kind === 'talk' ? Math.round(Math.min(1, Math.max(0, open)) * 4) : 0;
  const key = kind + ':' + step;
  let tex = _mouthCache.get(key);
  if (!tex) {
    tex = new THREE.CanvasTexture(mouthCanvas(kind, step / 4));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    _mouthCache.set(key, tex);
  }
  return tex;
}

function setupFace(H) {
  const B = H.bones;
  const head = B.Head && B.Head[0];
  if (!head) return;

  const host = H.root.parent || H.root;
  const g = new THREE.Group();
  g.name = 'faceOverlay';
  host.add(g);

  // 嘴贴着曲面脸画，深度上很难刚好卡在表面外侧：直接关掉深度测试，
  // 用一个很高的 renderOrder 让它永远画在脸上面（位置本身就在脸前，不会穿帮）
  const mouthMat = new THREE.MeshBasicMaterial({
    transparent: true, depthWrite: false, depthTest: false, toneMapped: false,
    side: THREE.DoubleSide, map: mouthTexture('neutral'),
  });
  const mouth = new THREE.Mesh(new THREE.PlaneGeometry(0.072, 0.054), mouthMat);
  mouth.position.copy(MOUTH_OFF);
  mouth.renderOrder = 12;
  mouth.frustumCulled = false;
  g.add(mouth);

  // 先铺一层肤色补丁，把贴图上那道旧唇线盖掉，新嘴型才敢画窄
  const lipTex = new THREE.CanvasTexture(lipMaskCanvas());
  lipTex.colorSpace = THREE.SRGBColorSpace;
  const lipMask = new THREE.Mesh(new THREE.PlaneGeometry(0.112, 0.030), new THREE.MeshBasicMaterial({
    map: lipTex, transparent: true, depthWrite: false, depthTest: false, toneMapped: false,
    side: THREE.DoubleSide,
  }));
  lipMask.position.copy(MOUTH_OFF).setZ(MOUTH_OFF.z - 0.0018);
  lipMask.renderOrder = 11.5;
  lipMask.frustumCulled = false;
  g.add(lipMask);

  const blushTex = new THREE.CanvasTexture(blushCanvas());
  blushTex.colorSpace = THREE.SRGBColorSpace;
  const blushes = [];
  for (let i = 0; i < 2; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.064, 0.046), new THREE.MeshBasicMaterial({
      map: blushTex, transparent: true, depthWrite: false, depthTest: false, opacity: 0,
      toneMapped: false, side: THREE.DoubleSide,
    }));
    m.position.copy(BLUSH_OFF[i]);
    m.renderOrder = 11;
    m.frustumCulled = false;
    g.add(m);
    blushes.push(m);
  }

  // 眉毛基址
  const brows = [];
  for (const side of ['Left', 'Right']) {
    const b = B['Face_Brow_' + side];
    if (b && b[0]) {
      b[0].userData.p0 = b[0].position.clone();
      brows.push({ b: b[0], sgn: side === 'Left' ? 1 : -1 });
    }
  }

  // 头部骨骼自带滚转（骨骼局部轴不是世界轴），直接套它的世界四元数会把
  // 嘴画成竖条。用「静息姿态的逆」做校正：静止时叠加层与世界轴对齐，
  // 动起来时则跟随头部的点头/歪头。
  const qFix = head.getWorldQuaternion(new THREE.Quaternion()).invert();

  H.face = { group: g, head, mouth, lipMask, blushes, brows, qFix, qTmp: new THREE.Quaternion(), kind: 'neutral', open: -1 };
}

/** 切换嘴型 / 表情目标 */
export function setExpr(H, e = {}) {
  if (!H || !H.expr) return;
  Object.assign(H.expr, e);
}

/** 每帧更新脸部叠加层 */
function updateFace(H, t) {
  const F = H.face;
  if (!F) return;
  const head = F.head;
  head.getWorldPosition(F.group.position);
  head.getWorldQuaternion(F.qTmp);
  F.group.quaternion.copy(F.qTmp).multiply(F.qFix);

  // 说话时嘴型自动在 talk / neutral 之间走
  const wantKind = H.now.mouth;
  const wantOpen = H.now.open;
  if (wantKind !== F.kind || Math.abs(wantOpen - F.open) > 0.12) {
    F.kind = wantKind;
    F.open = wantOpen;
    F.mouth.material.map = mouthTexture(wantKind, wantOpen);
    F.mouth.material.needsUpdate = true;
  }

  const bl = H.now.blush;
  for (const m of F.blushes) m.material.opacity = bl;

  // 眉毛：上下位移 + 绕脸面法线倾斜（内端下压 = 皱眉）
  const up = new THREE.Vector3(0, 1, 0);
  const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(F.group.quaternion);
  for (const it of F.brows) {
    const b = it.b;
    const pq = b.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
    const upL = up.clone().applyQuaternion(pq).normalize();
    const fwdL = fwd.clone().applyQuaternion(pq).normalize();
    b.position.copy(b.userData.p0).addScaledVector(upL, H.now.brow * 0.016);
    b.quaternion.copy(b.userData.q0).multiply(
      new THREE.Quaternion().setFromAxisAngle(fwdL, H.now.tilt * 0.18 * it.sgn)
    );
  }
}

/** 探测"手臂往下压"该用哪个方向 */
function probeDown(B, root, side) {
  const arm = B[side + 'Arm'];
  const hand = B[side + 'Hand'] && B[side + 'Hand'][0];
  if (!arm || !hand) return 1;
  const probe = (s) => {
    bendAxis(arm, 'z', s * 1.0);
    root.updateMatrixWorld(true);
    return hand.getWorldPosition(new THREE.Vector3()).y;
  };
  const a = probe(1), b = probe(-1);
  const sgn = a <= b ? 1 : -1;
  bendAxis(arm, 'z', sgn * 1.0);
  root.updateMatrixWorld(true);
  return sgn;
}

/**
 * 待机 + 讲课动作
 * @param H   角色句柄
 * @param t   时间
 * @param o   { talking, gesture, look, dt }
 */
export function animateHolo(H, t, o = {}) {
  const B = H.bones;
  const talking = o.talking || 0;
  const gest = o.gesture || 0;
  const look = o.look ?? 1;
  const dt = o.dt || 0.016;

  /* ── 表情插值 ── */
  const now = H.now, want = H.expr;
  const ke = 1 - Math.exp(-5.5 * dt);
  now.brow += (want.brow - now.brow) * ke;
  now.tilt += (want.tilt - now.tilt) * ke;
  now.blush += (want.blush - now.blush) * ke;
  now.ear += (want.ear - now.ear) * ke;
  now.lean += (want.lean - now.lean) * ke;
  now.headTilt += ((want.headTilt || 0) - now.headTilt) * ke;

  // 说话时嘴自己开合，不说话时回到目标嘴型
  if (talking > 0.5) {
    const flap = 0.5 + 0.5 * Math.sin(t * 10.7) * Math.sin(t * 6.3 + 1.1);
    now.mouth = 'talk';
    const target = 0.12 + 0.8 * flap;
    now.open += (target - now.open) * (1 - Math.exp(-16 * dt));
  } else {
    now.mouth = want.mouth || 'neutral';
    now.open += (0.25 - now.open) * ke;
  }

  // 呼吸
  const br = Math.sin(t * 1.25);
  bend(B.Spine1, 0.045 + 0.012 * br + 0.055 * now.lean, 0, 0);
  bend(B.Spine2, 0.035 + 0.010 * br + 0.030 * now.lean, Math.sin(t * 0.31) * 0.02, 0);
  bend(B.Spine3, 0.010 * br, 0, 0);

  // 头：说话时点头节奏更快，平时缓慢环视
  const nodR = Math.sin(t * 2.6) * 0.5 + 0.5;
  const hx = 0.03 + (talking ? nodR * 0.045 : 0) + Math.sin(t * 0.63) * 0.018 + 0.05 * now.tilt;
  const hy = Math.sin(t * 0.37) * 0.06 * (1 - look) + Math.sin(t * 0.9) * 0.02;
  bend(B.Neck, -0.02 + hx * 0.35, hy * 0.4, 0.08 * now.headTilt);
  bend(B.Head, hx * 0.65, hy * 0.6, Math.sin(t * 0.29) * 0.02 + 0.20 * now.headTilt);

  // 手臂：手肘撑在桌沿、前臂搭在桌面上（角度是数值搜索出来的，参数在 H.hand）
  const sL = H.armSgn.Left, sR = H.armSgn.Right;
  const sway = Math.sin(t * 1.25) * 0.012;
  const raise = gest;
  const h = H.hand;

  bend(B.LeftArm, 0, h.L.armY + sway * 0.5, (h.L.armZ + sway * 0.4) * sL);
  bend(B.RightArm, 0, h.R.armY + sway * 0.5 - 0.10 * raise, (h.R.armZ + sway * 0.4) * sR);
  bend(B.LeftShoulder, 0, 0, 0.05 * sL);
  bend(B.RightShoulder, 0, 0, 0.05 * sR);

  // 左前臂：稳定地搭在桌面上
  bend(B.LeftForeArm, 0.02 * br, h.L.foreY + 0.02 * br, h.L.foreZ * sL);
  // 右前臂：讲解时抬起来比划
  bend(B.RightForeArm, 0.02 * br, h.R.foreY + 0.02 * br - 0.50 * raise, (h.R.foreZ + 0.46 * raise) * sR);
  // 手腕：用预先算好的世界朝向（手指伸向桌心、掌心贴桌）
  if (H.handQ && H.handQ.Left) {
    for (const b of B.LeftHand) b.quaternion.copy(H.handQ.Left);
  }
  if (H.handQ && H.handQ.Right) {
    _q.setFromAxisAngle(_v.set(1, 0, 0), -0.55 * raise);
    _q2.copy(H.handQ.Right).multiply(_q);
    for (const b of B.RightHand) b.quaternion.copy(_q2);
  }

  // 手指：自然蜷在桌沿 / 讲话时松开一点
  curlFingers(H, 'Left', h.curl + 0.05 * Math.sin(t * 0.9), h.spread);
  curlFingers(H, 'Right', h.curl * (1 - 0.55 * raise), h.spread);

  // 耳朵：抽动 + 情绪（竖起 / 耷下）
  const tw = Math.pow(Math.max(0, Math.sin(t * 0.66 + 1.3)), 14);
  const perk = Math.max(0, now.ear);
  const droop = Math.max(0, -now.ear);
  for (const side of ['Left', 'Right']) {
    const sg = side === 'Left' ? 1 : -1;
    for (let i = 1; i <= 4; i++) {
      const b = B[`Kemo_Ear_${side}_${i}`];
      if (!b) continue;
      bend(
        b,
        tw * 0.12 * sg - droop * 0.20 + perk * 0.05,
        0,
        Math.sin(t * 1.1 + i) * 0.012 + droop * 0.06 * sg
      );
    }
  }

  // 尾巴：坐姿下从椅背后绕出，缓慢摆动（情绪高涨时摆得更明显）
  const wag = 0.75 + 0.9 * Math.max(0, now.ear);
  for (let i = 1; i <= 8; i++) {
    const b = B['Tail_' + i];
    if (!b) continue;
    const amp = (0.03 + i * 0.010) * wag;
    bend(
      b,
      -0.30 + i * 0.02 + Math.sin(t * 0.7 - i * 0.4) * 0.012,
      Math.sin(t * 1.05 - i * 0.45) * amp,
      Math.sin(t * 0.75 - i * 0.3) * amp * 0.5
    );
  }

  // 裙摆：坐着时轻微铺垫的动作
  for (let i = 1; i <= 4; i++) {
    const b = B['Skirt_Center_Front_' + i];
    if (b) bend(b, 0.05 + Math.sin(t * 1.4 + i * 0.6) * 0.006, 0, 0);
  }

  updateFace(H, t);
}

/** 调试：导出骨骼世界坐标 */
export function boneSnapshot(H, names) {
  H.root.updateMatrixWorld(true);
  const out = {};
  for (const n of names) {
    const b = H.bones[n] && H.bones[n][0];
    if (!b) { out[n] = null; continue; }
    const v = b.getWorldPosition(_v);
    out[n] = [+v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)];
  }
  return out;
}
