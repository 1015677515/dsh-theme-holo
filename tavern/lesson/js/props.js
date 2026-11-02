/**
 * 餐桌、桌面陈设、椅子，以及置物架上的可点击 2D 悬浮物品。
 */
import * as THREE from 'three';
import { woodTex, canvasTex, SHELF_SLOTS } from './room.js';
import { haloCanvas, iconCanvas } from './icons.js';

const TAU = Math.PI * 2;

export const TABLE = { w: 1.80, d: 0.86, h: 0.755, top: 0.755 };
/** 桌布上表面 —— 所有陈设都按这个高度落座 */
export const CLOTH_TOP = TABLE.h + 0.010;

/* ────────────────── 桌布纹理 ────────────────── */
function clothTexture() {
  return canvasTex(512, 512, (g, w, h) => {
    // 亚麻布：底色偏暖灰，不要亮到反白
    g.fillStyle = '#6d6047';
    g.fillRect(0, 0, w, h);

    // 大块色斑（染得不匀的旧布）
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      const r = 40 + Math.random() * 120;
      const gr = g.createRadialGradient(x, y, 1, x, y, r);
      const dark = Math.random() < 0.55;
      gr.addColorStop(0, dark ? 'rgba(70,56,36,.055)' : 'rgba(214,196,160,.05)');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }

    // 经纬：每 4px 一组交错的短划线，远看是布纹而不是方格纸
    for (let y = 0; y < h; y += 4) {
      for (let x = 0; x < w; x += 4) {
        const a = ((x + y) >> 2) % 2 ? 0.05 : 0.02;
        g.fillStyle = `rgba(255,250,235,${a})`;
        g.fillRect(x, y, 4, 1);
      }
    }
    for (let x = 0; x < w; x += 4) {
      for (let y = 0; y < h; y += 4) {
        const a = ((x + y) >> 2) % 2 ? 0.04 : 0.015;
        g.fillStyle = `rgba(60,44,26,${a})`;
        g.fillRect(x, y, 1, 4);
      }
    }

    // 织边条纹
    g.fillStyle = 'rgba(120,54,38,.45)';
    g.fillRect(0, 26, w, 6);
    g.fillRect(0, h - 32, w, 6);

    // 细颗粒
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(40,26,12,.10)' : 'rgba(240,228,200,.07)';
      g.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
    }
  }, 1, 1);
}

/* ────────────────── 接触阴影贴片 ────────────────── */
let _shadowTex = null;
function shadowTexture() {
  if (_shadowTex) return _shadowTex;
  _shadowTex = canvasTex(128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
    gr.addColorStop(0, 'rgba(18,10,4,0.62)');
    gr.addColorStop(0.45, 'rgba(18,10,4,0.34)');
    gr.addColorStop(1, 'rgba(18,10,4,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  return _shadowTex;
}

/* ────────────────── 餐桌 ────────────────── */
export function buildTable(root) {
  const g = new THREE.Group();
  g.name = 'table';
  root.add(g);

  const wood = new THREE.MeshStandardMaterial({ map: woodTex('#6b4a2b', 61, 2, 1), roughness: 0.74 });
  const woodDark = new THREE.MeshStandardMaterial({ map: woodTex('#4a3018', 63, 1, 1), roughness: 0.82 });

  // 桌面
  const top = new THREE.Mesh(new THREE.BoxGeometry(TABLE.w, 0.062, TABLE.d), wood);
  top.position.y = TABLE.h - 0.031;
  top.castShadow = true;
  top.receiveShadow = true;
  g.add(top);

  // 桌沿围板
  const apronY = TABLE.h - 0.062 - 0.055;
  for (const [w, d, x, z] of [
    [TABLE.w - 0.14, 0.03, 0, TABLE.d / 2 - 0.09],
    [TABLE.w - 0.14, 0.03, 0, -TABLE.d / 2 + 0.09],
    [0.03, TABLE.d - 0.18, TABLE.w / 2 - 0.075, 0],
    [0.03, TABLE.d - 0.18, -TABLE.w / 2 + 0.075, 0],
  ]) {
    const a = new THREE.Mesh(new THREE.BoxGeometry(w, 0.11, d), woodDark);
    a.position.set(x, apronY, z);
    a.castShadow = true;
    g.add(a);
  }

  // 四条方腿
  const legX = TABLE.w / 2 - 0.12, legZ = TABLE.d / 2 - 0.11;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.085, TABLE.h - 0.06, 0.085), wood);
      leg.position.set(sx * legX, (TABLE.h - 0.06) / 2, sz * legZ);
      leg.castShadow = true;
      leg.receiveShadow = true;
      g.add(leg);
    }
  }
  // 横撑
  for (const sz of [-1, 1]) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(TABLE.w - 0.3, 0.05, 0.05), woodDark);
    r.position.set(0, 0.2, sz * legZ);
    g.add(r);
  }

  /* 桌布：铺满整张桌面，四面垂边 —— 桌面不再露出深色木底 */
  const clothMat = new THREE.MeshStandardMaterial({ map: clothTexture(), roughness: 0.95 });
  const cw = TABLE.w + 0.06, cd = TABLE.d + 0.06;
  const cloth = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.010, cd), clothMat);
  cloth.position.set(0, TABLE.h + 0.005, 0);
  cloth.receiveShadow = true;
  g.add(cloth);
  // 垂边：四块薄板贴着桌沿往下挂
  const drapeH = 0.19;
  for (const sz of [-1, 1]) {
    const flap = new THREE.Mesh(new THREE.BoxGeometry(cw, drapeH, 0.008), clothMat);
    flap.position.set(0, TABLE.h + 0.005 - drapeH / 2, (sz * cd) / 2);
    flap.castShadow = true;
    flap.receiveShadow = true;
    g.add(flap);
  }
  for (const sx of [-1, 1]) {
    const flap = new THREE.Mesh(new THREE.BoxGeometry(0.008, drapeH, cd), clothMat);
    flap.position.set((sx * cw) / 2, TABLE.h + 0.005 - drapeH / 2, 0);
    flap.castShadow = true;
    flap.receiveShadow = true;
    g.add(flap);
  }

  return g;
}

/* ────────────────── 椅子 ────────────────── */
export function buildChair(root, x, z, face = 0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = face;
  root.add(g);

  const wood = new THREE.MeshStandardMaterial({ map: woodTex('#4a3120', 71, 1, 1), roughness: 0.86 });
  const seatY = 0.45;

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.44), wood);
  seat.position.y = seatY;
  seat.castShadow = true;
  seat.receiveShadow = true;
  g.add(seat);

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, seatY, 0.05), wood);
      leg.position.set(sx * 0.19, seatY / 2, sz * 0.18);
      leg.castShadow = true;
      g.add(leg);
    }
  }
  // 靠背（在角色身后，面朝 +z 时靠背在 -z 侧）
  for (const sx of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.95, 0.05), wood);
    post.position.set(sx * 0.19, 0.475, -0.19);
    post.castShadow = true;
    g.add(post);
  }
  for (const y of [0.72, 0.9]) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.035), wood);
    r.position.set(0, y, -0.19);
    r.castShadow = true;
    g.add(r);
  }
  return g;
}

/* ────────────────── 桌面陈设 ────────────────── */
export function buildTableProps(root) {
  const g = new THREE.Group();
  g.name = 'tableProps';
  root.add(g);

  const Y = CLOTH_TOP;           // 桌布上表面
  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex('#6b4a2a', 81, 1, 1), roughness: 0.8 });
  const ceramic = new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: 0.55, metalness: 0.05 });
  const ceramicDark = new THREE.MeshStandardMaterial({ color: 0x5e452e, roughness: 0.6 });

  const shadows = (m) => {
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  /** 一圈贴地的软阴影，专治"看起来悬空" */
  const contact = (x, z, size, opacity = 0.55) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({
        map: shadowTexture(), transparent: true, opacity,
        depthWrite: false, toneMapped: false,
      })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, Y + 0.0008, z);
    m.renderOrder = 1;
    g.add(m);
    return m;
  };

  /* 木盘 + 面包 */
  contact(-0.58, -0.06, 0.44, 0.62);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.176, 0.158, 0.024, 30), woodMat);
  plate.position.set(-0.58, Y + 0.012, -0.06);
  g.add(shadows(plate));
  // 盘沿一圈凹槽，让盘子从面包底下露出来
  const plateRim = new THREE.Mesh(new THREE.TorusGeometry(0.176, 0.007, 8, 30), new THREE.MeshStandardMaterial({ color: 0x54381f, roughness: 0.9 }));
  plateRim.position.set(-0.58, Y + 0.024, -0.06);
  plateRim.rotation.x = Math.PI / 2;
  g.add(plateRim);

  // 烘烤色 + 焦斑 + 顶上的面粉碎
  const breadTex = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#a5763c';
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 1100; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = 1 + Math.random() * 5;
      c.fillStyle = Math.random() < 0.55
        ? `rgba(74,42,12,${0.05 + Math.random() * 0.11})`
        : `rgba(206,166,104,${0.04 + Math.random() * 0.10})`;
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    }
    // v 大 = 靠顶 = canvas 上部：顶部烤得深一点
    const gr = c.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, 'rgba(58,30,8,.34)');
    gr.addColorStop(0.30, 'rgba(84,46,14,.14)');
    gr.addColorStop(0.72, 'rgba(46,22,6,.10)');
    gr.addColorStop(1, 'rgba(30,14,4,.30)');
    c.fillStyle = gr;
    c.fillRect(0, 0, w, h);
    // 撒粉：只在顶部区域
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h * 0.34;
      c.fillStyle = `rgba(238,226,200,${0.10 + Math.random() * 0.26})`;
      c.beginPath();
      c.arc(x, y, 0.6 + Math.random() * 1.5, 0, Math.PI * 2);
      c.fill();
    }
  }, 1, 1);

  const breadMat = new THREE.MeshStandardMaterial({ map: breadTex, color: 0xd2c0a4, roughness: 0.95 });

  /* 面包用旋转体：底面是平的圆，整个肚子坐在盘子上。
     原来是被压扁的球 —— 球底只有一个切点，四周全是悬空的缝，远看就是"浮着"。 */
  const prof = [
    [0.000, 0.0000], [0.056, 0.0000], [0.074, 0.0040],
    [0.082, 0.0190], [0.082, 0.0430], [0.071, 0.0700],
    [0.048, 0.0910], [0.022, 0.1040], [0.000, 0.1100],
  ].map(([r, y]) => new THREE.Vector2(r, y));

  const loaf = new THREE.Group();
  loaf.position.set(-0.58, Y + 0.024, -0.06);   // 盘子上表面
  loaf.rotation.y = 0.38;
  g.add(loaf);

  // 拉成橄榄形：两端收窄、下塌，截面保持椭圆。
  // 割口不做成几何体 —— 直的长条会从弧形顶面戳出来（看着像插了三根棍），
  // 改用贴图上的焦色与撒粉来表现。
  const breadGeo = new THREE.LatheGeometry(prof, 34);
  {
    const R0 = 0.082, HALF = 0.122;
    const pos = breadGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const nx = (pos.getX(i) / R0) * HALF;
      const t = Math.min(1, Math.abs(nx) / HALF);
      const k = Math.sqrt(Math.max(0, 1 - t * t * 0.80));
      pos.setX(i, nx);
      pos.setZ(i, pos.getZ(i) * k * 0.92);
      pos.setY(i, pos.getY(i) * (0.40 + 0.60 * k));
    }
    breadGeo.computeVertexNormals();
  }
  const bread = new THREE.Mesh(breadGeo, breadMat);
  loaf.add(shadows(bread));

  /* 奶酪楔形：三角棱柱，切面朝上，旁边撒两小块 */
  contact(-0.72, 0.28, 0.26, 0.5);
  const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xdfc078, roughness: 0.72 });
  const rindMat = new THREE.MeshStandardMaterial({ color: 0xb8933f, roughness: 0.85 });
  for (const [cx, cz, r, h, rot] of [[-0.72, 0.28, 0.105, 0.075, 0.55], [-0.60, 0.36, 0.055, 0.05, 1.5]]) {
    const cheese = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 3), cheeseMat);
    cheese.position.set(cx, Y + h / 2, cz);
    cheese.rotation.y = rot;
    g.add(shadows(cheese));
    const rind = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.01, r * 1.01, h * 0.55, 3), rindMat);
    rind.position.set(cx, Y + h * 0.275, cz);
    rind.rotation.y = rot;
    g.add(shadows(rind));
  }

  /* 陶罐（酒） */
  contact(0.63, -0.24, 0.26, 0.55);
  const jugPts = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const r = 0.046 + Math.sin(t * Math.PI) * 0.038;
    jugPts.push(new THREE.Vector2(r, t * 0.215));
  }
  const jug = new THREE.Mesh(new THREE.LatheGeometry(jugPts, 20), ceramic);
  jug.position.set(0.63, Y, -0.24);
  g.add(shadows(jug));
  const jugNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.038, 0.05, 14), ceramicDark);
  jugNeck.position.set(0.63, Y + 0.228, -0.24);
  g.add(shadows(jugNeck));

  /* 两个木杯 */
  const cupMat = new THREE.MeshStandardMaterial({ map: woodTex('#7a5632', 91, 1, 1), roughness: 0.85 });
  for (const [cx, cz, rot] of [[0.33, 0.27, 0.3], [-0.24, 0.33, -0.5]]) {
    contact(cx, cz, 0.15, 0.5);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.085, 16, 1, true), cupMat);
    cup.position.set(cx, Y + 0.043, cz);
    cup.rotation.y = rot;
    cup.material.side = THREE.DoubleSide;
    g.add(shadows(cup));
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.008, 16), cupMat);
    bottom.position.set(cx, Y + 0.004, cz);
    g.add(bottom);
    // 杯中酒液
    const wine = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.004, 16), new THREE.MeshStandardMaterial({ color: 0x4a1420, roughness: 0.3 }));
    wine.position.set(cx, Y + 0.062, cz);
    g.add(wine);
  }

  /* 蜡烛 + 烛台 */
  contact(0.76, 0.05, 0.22, 0.5);
  const brass = new THREE.MeshStandardMaterial({ color: 0x8a6b32, metalness: 0.7, roughness: 0.42 });
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.018, 20), brass);
  dish.position.set(0.76, Y + 0.009, 0.05);
  g.add(shadows(dish));
  const stemC = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.024, 0.07, 12), brass);
  stemC.position.set(0.76, Y + 0.05, 0.05);
  g.add(stemC);
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.155, 14), new THREE.MeshStandardMaterial({ color: 0xe8dcbe, roughness: 0.7, emissive: 0x2a1c08 }));
  candle.position.set(0.76, Y + 0.162, 0.05);
  g.add(shadows(candle));

  // 烛焰
  const flameTex = canvasTex(64, 64, (c2, w2, h2) => {
    const gr = c2.createRadialGradient(w2 / 2, h2 * 0.7, 1, w2 / 2, h2 * 0.6, w2 * 0.48);
    gr.addColorStop(0, 'rgba(255,252,232,1)');
    gr.addColorStop(0.35, 'rgba(255,200,110,.9)');
    gr.addColorStop(1, 'rgba(255,120,30,0)');
    c2.fillStyle = gr;
    c2.beginPath();
    c2.moveTo(w2 / 2, h2 * 0.08);
    c2.bezierCurveTo(w2 * 0.86, h2 * 0.5, w2 * 0.8, h2 * 0.92, w2 / 2, h2 * 0.96);
    c2.bezierCurveTo(w2 * 0.2, h2 * 0.92, w2 * 0.14, h2 * 0.5, w2 / 2, h2 * 0.08);
    c2.fill();
  });
  const candleFlame = new THREE.Sprite(new THREE.SpriteMaterial({
    map: flameTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  candleFlame.position.set(0.76, Y + 0.272, 0.05);
  candleFlame.scale.setScalar(0.075);
  g.add(candleFlame);

  const candleLight = new THREE.PointLight(0xffb05a, 1.5, 3.2, 2);
  candleLight.position.set(0.76, Y + 0.29, 0.05);
  g.add(candleLight);

  /* 摊开的手抄本（赫萝手边，往里收，别压到桌沿外） */
  contact(0.42, -0.28, 0.40, 0.55);
  const bk = new THREE.Group();
  bk.position.set(0.42, Y + 0.002, -0.28);
  bk.rotation.y = -0.16;
  g.add(bk);
  const cover = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.014, 0.22), new THREE.MeshStandardMaterial({ color: 0x4a2418, roughness: 0.85 }));
  cover.position.y = 0.007;
  bk.add(shadows(cover));
  for (const sx of [-1, 1]) {
    const page = new THREE.Mesh(new THREE.BoxGeometry(0.142, 0.012, 0.2), new THREE.MeshStandardMaterial({ color: 0xd9cbaa, roughness: 0.95 }));
    page.position.set(sx * 0.073, 0.019, 0);
    page.rotation.z = sx * 0.035;
    bk.add(shadows(page));
  }

  return { group: g, candleFlame, candleLight };
}

/* ────────────────── 置物架上的可点击物品 ────────────────── */

export function buildShelfItems(root, shelf) {
  const items = {};
  const sx = shelf.x0 - shelf.depth * 0.48;

  for (const slot of SHELF_SLOTS) {
    const z = shelf.cz + slot.dz;
    const tex = new THREE.CanvasTexture(haloCanvas(slot.id, 320));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    const mat = new THREE.SpriteMaterial({
      map: tex, transparent: true, depthWrite: false, depthTest: true,
      toneMapped: false,
    });
    const sp = new THREE.Sprite(mat);
    sp.position.set(sx, slot.y, z);
    sp.scale.setScalar(0.34);
    sp.userData = {
      id: slot.id,
      baseY: slot.y,
      baseScale: 0.34,
      phase: Math.random() * TAU,
      hover: false,
      dim: false,
      kind: 'shelfItem',
      home: new THREE.Vector3(sx, slot.y, z),
    };
    root.add(sp);
    items[slot.id] = sp;
  }
  return items;
}

/** 赫萝举着的展示贴图（对话中才出现） */
export function makeShowSprite(id, size = 0.34) {
  const tex = new THREE.CanvasTexture(haloCanvas(id, 320, '#ffe0a0'));
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, transparent: true, depthWrite: false, opacity: 0, toneMapped: false,
  }));
  sp.scale.setScalar(size);
  return sp;
}

export { iconCanvas };
