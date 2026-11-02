/**
 * 中世纪民居内景：木地板 / 灰泥墙 / 木框架 / 窗 / 壁炉 / 置物架墙
 * 全部程序化生成，不依赖外部贴图。
 */
import * as THREE from 'three';

const TAU = Math.PI * 2;

function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function canvasTex(w, h, fn, repX = 1, repY = 1) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  fn(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repX, repY);
  t.anisotropy = 8;
  return t;
}

/* ────────────────── 材质纹理 ────────────────── */

function floorTexture() {
  return canvasTex(
    512, 512,
    (g, w, h) => {
      const R = rng(11);
      const rows = 6;
      const rh = h / rows;
      g.fillStyle = '#3a2716';
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < rows; i++) {
        const y = i * rh;
        const base = 62 + R() * 26;
        g.fillStyle = `rgb(${base + 14},${base - 6},${base - 30})`;
        g.fillRect(0, y + 1.5, w, rh - 3);

        // 木板接缝
        const seam = R() * w;
        g.fillStyle = 'rgba(20,12,6,.55)';
        g.fillRect(seam, y, 2.5, rh);

        // 木纹
        for (let k = 0; k < 26; k++) {
          const yy = y + 4 + R() * (rh - 8);
          g.beginPath();
          g.moveTo(0, yy);
          for (let x = 0; x <= w; x += 32) g.lineTo(x, yy + Math.sin(x * 0.05 + k) * 1.7);
          g.strokeStyle = `rgba(${20 + R() * 30},${10 + R() * 18},4,${0.06 + R() * 0.10})`;
          g.lineWidth = 0.7 + R() * 1.5;
          g.stroke();
        }
        // 结疤
        if (R() > 0.62) {
          const kx = R() * w, ky = y + rh * (0.3 + R() * 0.4);
          g.beginPath();
          g.ellipse(kx, ky, 4 + R() * 5, 2 + R() * 3, 0, 0, TAU);
          g.fillStyle = 'rgba(28,16,6,.55)';
          g.fill();
        }
        // 板与板之间的暗缝
        g.fillStyle = 'rgba(14,8,3,.5)';
        g.fillRect(0, y, w, 1.6);
      }
    },
    5, 5
  );
}

function plasterTexture() {
  return canvasTex(
    512, 512,
    (g, w, h) => {
      const R = rng(37);
      g.fillStyle = '#a08a68';
      g.fillRect(0, 0, w, h);
      // 大块色差
      for (let i = 0; i < 90; i++) {
        const x = R() * w, y = R() * h, r = 30 + R() * 110;
        const gr = g.createRadialGradient(x, y, 0, x, y, r);
        const dark = R() > 0.5;
        gr.addColorStop(0, dark ? 'rgba(96,78,54,.16)' : 'rgba(210,192,162,.14)');
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr;
        g.beginPath();
        g.arc(x, y, r, 0, TAU);
        g.fill();
      }
      // 颗粒
      for (let i = 0; i < 2600; i++) {
        g.fillStyle = R() > 0.5 ? 'rgba(90,74,52,.10)' : 'rgba(255,248,232,.12)';
        g.fillRect(R() * w, R() * h, 1 + R() * 2, 1 + R() * 2);
      }
      // 细裂纹
      for (let i = 0; i < 5; i++) {
        let x = R() * w, y = R() * h;
        g.beginPath();
        g.moveTo(x, y);
        for (let k = 0; k < 9; k++) {
          x += (R() - 0.5) * 46;
          y += (R() - 0.5) * 46;
          g.lineTo(x, y);
        }
        g.strokeStyle = 'rgba(96,78,54,.16)';
        g.lineWidth = 1;
        g.stroke();
      }
    },
    4, 2
  );
}

export function woodTex(base = '#4b3320', seed = 5, repX = 1, repY = 1) {
  return canvasTex(
    256, 256,
    (g, w, h) => {
      const R = rng(seed);
      g.fillStyle = base;
      g.fillRect(0, 0, w, h);
      for (let k = 0; k < 46; k++) {
        const y = R() * h;
        g.beginPath();
        g.moveTo(0, y);
        for (let x = 0; x <= w; x += 24) g.lineTo(x, y + Math.sin(x * 0.06 + k) * 2.2);
        g.strokeStyle = `rgba(${18 + R() * 40},${10 + R() * 24},${4 + R() * 12},${0.10 + R() * 0.16})`;
        g.lineWidth = 0.8 + R() * 2.2;
        g.stroke();
      }
      for (let i = 0; i < 900; i++) {
        g.fillStyle = R() > 0.5 ? 'rgba(0,0,0,.05)' : 'rgba(255,220,170,.05)';
        g.fillRect(R() * w, R() * h, 1.4, 1.4);
      }
    },
    repX, repY
  );
}

function stoneTex() {
  return canvasTex(
    512, 512,
    (g, w, h) => {
      const R = rng(77);
      g.fillStyle = '#4a4741';
      g.fillRect(0, 0, w, h);
      const rows = 7;
      for (let i = 0; i < rows; i++) {
        const y = (i / rows) * h;
        const hh = h / rows;
        let x = -R() * 60;
        while (x < w) {
          const bw = 50 + R() * 70;
          const v = 78 + R() * 46;
          g.fillStyle = `rgb(${v},${v - 4},${v - 12})`;
          g.beginPath();
          const r = 4;
          g.moveTo(x + r, y + 2);
          g.lineTo(x + bw - r, y + 2);
          g.quadraticCurveTo(x + bw, y + 2, x + bw, y + 2 + r);
          g.lineTo(x + bw, y + hh - r - 2);
          g.quadraticCurveTo(x + bw, y + hh - 2, x + bw - r, y + hh - 2);
          g.lineTo(x + r, y + hh - 2);
          g.quadraticCurveTo(x, y + hh - 2, x, y + hh - r - 2);
          g.lineTo(x, y + 2 + r);
          g.quadraticCurveTo(x, y + 2, x + r, y + 2);
          g.fill();
          g.strokeStyle = 'rgba(24,22,18,.5)';
          g.lineWidth = 1.6;
          g.stroke();
          x += bw + 3;
        }
      }
      // 灰浆
      g.fillStyle = 'rgba(60,56,48,.35)';
      for (let i = 0; i < 400; i++) g.fillRect(R() * w, R() * h, 2, 2);
    },
    2, 2
  );
}

/** 窗外风景：黄昏的天与远山 */
function windowViewTexture() {
  return canvasTex(256, 256, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#2a3355');
    sky.addColorStop(0.42, '#7d5b74');
    sky.addColorStop(0.66, '#d98a56');
    sky.addColorStop(0.82, '#f5c07a');
    sky.addColorStop(1, '#8d6a3e');
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);

    // 远山
    g.beginPath();
    g.moveTo(0, h * 0.72);
    const R = rng(9);
    for (let x = 0; x <= w; x += 16) g.lineTo(x, h * (0.66 + Math.sin(x * 0.03) * 0.05 + R() * 0.02));
    g.lineTo(w, h);
    g.lineTo(0, h);
    g.fillStyle = 'rgba(58,44,54,.85)';
    g.fill();

    // 近处树线
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += 10) g.lineTo(x, h * (0.86 + Math.sin(x * 0.09) * 0.03));
    g.lineTo(w, h);
    g.fillStyle = 'rgba(28,22,26,.92)';
    g.fill();

    // 太阳余晖
    const glow = g.createRadialGradient(w * 0.66, h * 0.66, 4, w * 0.66, h * 0.66, 70);
    glow.addColorStop(0, 'rgba(255,238,190,.85)');
    glow.addColorStop(1, 'rgba(255,190,120,0)');
    g.fillStyle = glow;
    g.beginPath();
    g.arc(w * 0.66, h * 0.66, 70, 0, TAU);
    g.fill();
  });
}

/* ────────────────── 房间 ────────────────── */

export function buildRoom(root) {
  const group = new THREE.Group();
  group.name = 'room';
  root.add(group);

  const W = 3.3;      // 半宽 x
  const ZB = -3.5;    // 后墙
  const ZF = 2.6;     // 前墙
  const H = 2.72;     // 层高
  const DW = W * 2, DZ = ZF - ZB;

  const plaster = plasterTexture();
  const floorMap = floorTexture();
  const beamMap = woodTex('#4a3120', 5, 1, 3);

  const matPlaster = new THREE.MeshStandardMaterial({ map: plaster, roughness: 0.96, metalness: 0 });
  const matFloor = new THREE.MeshStandardMaterial({ map: floorMap, roughness: 0.82, metalness: 0 });
  const matBeam = new THREE.MeshStandardMaterial({ map: beamMap, color: 0x9a8368, roughness: 0.88, metalness: 0 });

  /* 地板 */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(DW, DZ), matFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, (ZB + ZF) / 2);
  floor.receiveShadow = true;
  group.add(floor);

  /* 天花板 */
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(DW, DZ), new THREE.MeshStandardMaterial({
    map: woodTex('#5a4229', 13, 4, 4), color: 0xb9a68c, roughness: 1,
  }));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, H, (ZB + ZF) / 2);
  group.add(ceil);

  /* 四面墙 */
  const wall = (w, h, pos, rotY) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matPlaster);
    m.position.copy(pos);
    m.rotation.y = rotY;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };
  wall(DW, H, new THREE.Vector3(0, H / 2, ZB), 0);              // 后
  wall(DW, H, new THREE.Vector3(0, H / 2, ZF), Math.PI);        // 前
  wall(DZ, H, new THREE.Vector3(-W, H / 2, (ZB + ZF) / 2), Math.PI / 2);  // 左
  wall(DZ, H, new THREE.Vector3(W, H / 2, (ZB + ZF) / 2), -Math.PI / 2);  // 右

  /* 木框架：立柱 + 顶部横梁 + 墙裙 */
  const beam = (w, h, d, x, y, z) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matBeam);
    b.position.set(x, y, z);
    b.castShadow = true;
    b.receiveShadow = true;
    group.add(b);
    return b;
  };
  const T = 0.16;   // 梁截面

  // 四角柱
  for (const [x, z] of [[-W, ZB], [W, ZB], [-W, ZF], [W, ZF]]) beam(T, H, T, x, H / 2, z);

  // 后墙：三根立柱 + 一根腰梁 + 顶部横梁
  for (const x of [-2.0, 0.0, 2.0]) beam(T, H, 0.12, x, H / 2, ZB + 0.06);
  beam(DW, 0.24, 0.12, 0, H - 0.12, ZB + 0.06);      // 顶梁
  beam(DW, 0.14, 0.10, 0, 1.02, ZB + 0.05);          // 腰梁

  // 左墙（窗户那面）
  beam(0.12, H, T, -W + 0.06, H / 2, -1.9);
  beam(0.12, H, T, -W + 0.06, H / 2, 0.9);
  beam(0.12, 0.24, DZ, -W + 0.06, H - 0.12, (ZB + ZF) / 2);
  beam(0.10, 0.14, DZ, -W + 0.05, 1.02, (ZB + ZF) / 2);

  // 右墙（置物架那面）
  beam(0.12, H, T, W - 0.06, H / 2, -2.2);
  beam(0.12, H, T, W - 0.06, H / 2, 1.5);
  beam(0.12, 0.24, DZ, W - 0.06, H - 0.12, (ZB + ZF) / 2);
  beam(0.10, 0.14, DZ, W - 0.05, 1.02, (ZB + ZF) / 2);

  // 天花板横梁
  for (const x of [-1.9, 0, 1.9]) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, DZ), matBeam);
    b.position.set(x, H - 0.15, (ZB + ZF) / 2);
    group.add(b);
  }
  // 一根斜撑，增加乡村感
  const brace = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 1.5), matBeam);
  brace.position.set(-2.5, H - 0.52, -1.0);
  brace.rotation.z = 0.72;
  group.add(brace);

  /* ── 墙裙木板（下半截） ── */
  const skirtMat = new THREE.MeshStandardMaterial({ map: woodTex('#5b432c', 21, 5, 1), roughness: 0.9 });
  const skirt = (w, pos, rotY) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.95), skirtMat);
    m.position.copy(pos);
    m.rotation.y = rotY;
    m.receiveShadow = true;
    group.add(m);
  };
  skirt(DW, new THREE.Vector3(0, 0.475, ZB + 0.012), 0);
  skirt(DW, new THREE.Vector3(0, 0.475, ZF - 0.012), Math.PI);
  skirt(DZ, new THREE.Vector3(-W + 0.012, 0.475, (ZB + ZF) / 2), Math.PI / 2);
  skirt(DZ, new THREE.Vector3(W - 0.012, 0.475, (ZB + ZF) / 2), -Math.PI / 2);

  /* ── 窗户（左墙） ── */
  const winZ = -1.55, winY = 1.62, winW = 1.05, winH = 0.95;
  // 窗外发光板
  const view = new THREE.Mesh(
    new THREE.PlaneGeometry(winW * 1.5, winH * 1.5),
    new THREE.MeshBasicMaterial({ map: windowViewTexture() })
  );
  view.position.set(-W - 0.1, winY, winZ);
  view.rotation.y = Math.PI / 2;
  group.add(view);

  // 窗洞（用四块灰泥板模拟墙体，把中间掏空）
  const holeMat = matPlaster;
  const holePart = (w, h, y, z) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), holeMat);
    m.position.set(-W + 0.014, y, z);
    m.rotation.y = Math.PI / 2;
    group.add(m);
  };
  // 上/下/前/后 四条，围出窗洞
  holePart(DZ, H - (winY + winH / 2), (H + winY + winH / 2) / 2, (ZB + ZF) / 2);
  holePart(DZ, winY - winH / 2, (winY - winH / 2) / 2, (ZB + ZF) / 2);
  holePart((winZ - winW / 2) - ZB, winH, winY, (ZB + winZ - winW / 2) / 2);
  holePart(ZF - (winZ + winW / 2), winH, winY, (ZF + winZ + winW / 2) / 2);

  // 窗框 + 窗棂
  const frameMat = new THREE.MeshStandardMaterial({ map: woodTex('#3c2817', 3, 1, 1), roughness: 0.85 });
  const frameBar = (len, thick, y, z, vertical) => {
    const g2 = vertical
      ? new THREE.BoxGeometry(thick, len, thick)
      : new THREE.BoxGeometry(thick, thick, len);
    const m = new THREE.Mesh(g2, frameMat);
    m.position.set(-W + 0.05, y, z);
    m.castShadow = true;
    group.add(m);
  };
  const fh = winH + 0.14, fw = winW + 0.14;
  frameBar(fh, 0.07, winY, winZ - fw / 2);   // 竖（前后两根）
  frameBar(fh, 0.07, winY, winZ + fw / 2);
  const horiz = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, fw), frameMat);
  horiz.position.set(-W + 0.05, winY + fh / 2, winZ);
  group.add(horiz);
  const horiz2 = horiz.clone();
  horiz2.position.y = winY - fh / 2;
  group.add(horiz2);
  // 中竖棂
  const mull = new THREE.Mesh(new THREE.BoxGeometry(0.05, winH, 0.05), frameMat);
  mull.position.set(-W + 0.05, winY, winZ);
  group.add(mull);
  // 窗台
  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, fw + 0.1), frameMat);
  sill.position.set(-W + 0.11, winY - fh / 2 - 0.03, winZ);
  sill.castShadow = true;
  group.add(sill);

  /* ── 壁炉（后墙偏右） ── */
  const fpX = 1.55;
  const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex(), roughness: 1 });
  const fpG = new THREE.Group();
  fpG.position.set(fpX, 0, ZB + 0.02);
  group.add(fpG);

  const fpW = 1.5, fpH = 1.55, fpD = 0.42;
  // 侧柱
  for (const dx of [-fpW / 2 + 0.12, fpW / 2 - 0.12]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.26, fpH, fpD), stoneMat);
    p.position.set(dx, fpH / 2, fpD / 2);
    p.castShadow = true;
    p.receiveShadow = true;
    fpG.add(p);
  }
  // 顶梁
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(fpW, 0.24, fpD + 0.06), stoneMat);
  lintel.position.set(0, fpH - 0.12, fpD / 2);
  lintel.castShadow = true;
  fpG.add(lintel);
  // 壁炉背板（黑洞）
  const fireback = new THREE.Mesh(new THREE.PlaneGeometry(fpW - 0.5, fpH - 0.26), new THREE.MeshStandardMaterial({ color: 0x120c08, roughness: 1 }));
  fireback.position.set(0, (fpH - 0.24) / 2, fpD - 0.02);
  fpG.add(fireback);
  // 炉底
  const hearth = new THREE.Mesh(new THREE.BoxGeometry(fpW + 0.3, 0.1, fpD + 0.45), stoneMat);
  hearth.position.set(0, 0.05, fpD / 2 + 0.2);
  hearth.receiveShadow = true;
  fpG.add(hearth);
  // 柴火
  const logMat = new THREE.MeshStandardMaterial({ color: 0x3a2415, roughness: 1 });
  for (let i = 0; i < 3; i++) {
    const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.6, 7), logMat);
    lg.rotation.z = Math.PI / 2;
    lg.rotation.y = (i - 1) * 0.28;
    lg.position.set((i - 1) * 0.1, 0.16 + i * 0.035, fpD - 0.14);
    fpG.add(lg);
  }

  // 火焰（程序化 sprite）
  const flameTex = canvasTex(128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h * 0.72, 4, w / 2, h * 0.62, w * 0.5);
    gr.addColorStop(0, 'rgba(255,246,214,1)');
    gr.addColorStop(0.28, 'rgba(255,190,86,.92)');
    gr.addColorStop(0.62, 'rgba(226,96,26,.5)');
    gr.addColorStop(1, 'rgba(120,30,0,0)');
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(w / 2, h * 0.02);
    g.bezierCurveTo(w * 0.92, h * 0.42, w * 0.86, h * 0.9, w / 2, h * 0.97);
    g.bezierCurveTo(w * 0.14, h * 0.9, w * 0.08, h * 0.42, w / 2, h * 0.02);
    g.fill();
  });
  const flames = [];
  for (let i = 0; i < 3; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: flameTex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, opacity: 0.9,
    }));
    sp.position.set((i - 1) * 0.12, 0.42, fpD - 0.1);
    sp.scale.setScalar(0.5 + i * 0.06);
    sp.userData.ph = i * 2.1;
    fpG.add(sp);
    flames.push(sp);
  }

  /* ── 后墙左段：挂杆 + 干草药 + 油灯（替换掉原来的挂毯） ── */
  const railMat = new THREE.MeshStandardMaterial({ map: woodTex('#4a3320', 51, 1, 1), roughness: 0.88 });
  const railZ = ZB + 0.07;
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.35, 10), railMat);
  rail.rotation.z = Math.PI / 2;
  rail.position.set(-1.45, 2.02, railZ);
  rail.castShadow = true;
  group.add(rail);
  // 两个铁托
  for (const rx of [-2.06, -0.84]) {
    const br = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.13), railMat);
    br.position.set(rx, 2.02, ZB + 0.035);
    group.add(br);
  }

  // 干草药：倒挂的一束束，用锥体+细枝堆出来
  const herbTones = ['#6b6a3a', '#7d7845', '#5c5f34'];
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x8a7a4a, roughness: 1 });
  [-1.86, -1.46, -1.06].forEach((hx, i) => {
    const hb = new THREE.Group();
    hb.position.set(hx, 1.98, railZ);
    hb.rotation.z = (i - 1) * 0.05;
    group.add(hb);

    // 麻绳
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.09, 6), stemMat);
    rope.position.y = -0.045;
    hb.add(rope);

    // 叶子：一圈细锥
    const n = 11;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU;
      const rr = 0.052 + (k % 3) * 0.008;
      const len = 0.2 + (k % 4) * 0.035;
      const leaf = new THREE.Mesh(
        new THREE.ConeGeometry(0.017, len, 5),
        new THREE.MeshStandardMaterial({ color: herbTones[k % 3], roughness: 1 })
      );
      leaf.position.set(Math.cos(a) * rr * 0.5, -0.1 - len / 2, Math.sin(a) * rr * 0.5);
      leaf.rotation.set(Math.cos(a) * 0.22, 0, -Math.sin(a) * 0.22);
      hb.add(leaf);
    }
    // 收紧的束腰
    const tie = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.03, 8), stemMat);
    tie.position.y = -0.075;
    hb.add(tie);
  });

  // 墙上小搁板（草药右边），摆两个陶罐
  const wallShelf = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.035, 0.16), railMat);
  wallShelf.position.set(-0.62, 1.62, ZB + 0.11);
  wallShelf.castShadow = true;
  group.add(wallShelf);
  for (const [jx, jh] of [[-0.76, 0.15], [-0.52, 0.12]]) {
    const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.038, jh, 12),
      new THREE.MeshStandardMaterial({ color: 0x7a5c3a, roughness: 0.72 }));
    jar.position.set(jx, 1.62 + 0.018 + jh / 2, ZB + 0.11);
    jar.castShadow = true;
    group.add(jar);
  }

  // 挂在搁板下方的铁皮油灯
  const lampIron = new THREE.MeshStandardMaterial({ color: 0x2a2622, metalness: 0.55, roughness: 0.6 });
  const lampHang = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 6), lampIron);
  lampHang.position.set(-0.62, 1.52, ZB + 0.12);
  group.add(lampHang);
  const lampBody = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.034, 0.09, 10), lampIron);
  lampBody.position.set(-0.62, 1.40, ZB + 0.12);
  lampBody.castShadow = true;
  group.add(lampBody);
  const lampGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.026, 10, 8),
    new THREE.MeshBasicMaterial({ color: 0xffd08a })
  );
  lampGlow.position.set(-0.62, 1.41, ZB + 0.12);
  group.add(lampGlow);
  const lampLight = new THREE.PointLight(0xffb060, 1.1, 2.2, 2);
  lampLight.position.set(-0.62, 1.40, ZB + 0.22);
  group.add(lampLight);

  /* ── 墙角木桶（后墙左角，增加纵深） ── */
  const barrelMat = new THREE.MeshStandardMaterial({ map: woodTex('#60421f', 67, 2, 1), roughness: 0.86 });
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.21, 0.62, 16), barrelMat);
  barrel.position.set(-2.92, 0.31, ZB + 0.42);
  barrel.castShadow = true;
  barrel.receiveShadow = true;
  group.add(barrel);
  for (const by of [0.16, 0.46]) {
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.012, 6, 20), lampIron);
    hoop.rotation.x = Math.PI / 2;
    hoop.position.set(-2.92, by, ZB + 0.42);
    group.add(hoop);
  }

  /* ── 门（前墙左侧） ── */
  const doorMat = new THREE.MeshStandardMaterial({ map: woodTex('#4e3520', 31, 2, 2), roughness: 0.9 });
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.95), doorMat);
  door.position.set(-1.35, 0.975, ZF - 0.015);
  door.rotation.y = Math.PI;
  group.add(door);
  const doorFrameMat = new THREE.MeshStandardMaterial({ map: woodTex('#31200f', 17, 1, 2), roughness: 0.9 });
  for (const [dx, dy, w2, h2] of [[-0.52, 0.975, 0.09, 2.05], [0.52, 0.975, 0.09, 2.05], [0, 1.99, 1.14, 0.09]]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w2, h2, 0.07), doorFrameMat);
    m.position.set(-1.35 + dx, dy, ZF - 0.03);
    group.add(m);
  }
  // 门把手
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), new THREE.MeshStandardMaterial({ color: 0x6b5a3e, metalness: 0.6, roughness: 0.5 }));
  knob.position.set(-0.95, 1.0, ZF - 0.06);
  group.add(knob);

  /* ── 右墙的置物架（对话中镜头右转的目标） ── */
  const shelf = buildShelf(W, 0.55);
  group.add(shelf.group);

  /* ── 灯光 ── */
  const lights = {};

  lights.amb = new THREE.AmbientLight(0xffd9ac, 0.26);
  group.add(lights.amb);

  lights.hemi = new THREE.HemisphereLight(0x9fb4d8, 0x3a2617, 0.54);
  group.add(lights.hemi);

  // 窗光：黄昏斜射
  const sun = new THREE.DirectionalLight(0xffb478, 2.5);
  sun.position.set(-5.6, 3.4, -2.2);
  sun.target.position.set(0.4, 0.5, 0.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -4.5; sc.right = 4.5; sc.top = 4.5; sc.bottom = -4.5; sc.near = 0.5; sc.far = 16;
  sun.shadow.bias = -0.0012;
  sun.shadow.normalBias = 0.02;
  group.add(sun, sun.target);
  lights.sun = sun;

  // 壁炉：暖色跳动
  const fire = new THREE.PointLight(0xff7a2e, 5.2, 9, 2);
  fire.position.set(fpX, 0.55, ZB + 0.5);
  group.add(fire);
  lights.fire = fire;

  const fire2 = new THREE.PointLight(0xffb066, 1.6, 5, 2);
  fire2.position.set(fpX, 0.95, ZB + 0.75);
  group.add(fire2);
  lights.fire2 = fire2;

  // 角色位置补光（很弱，只为了把脸从暗部拉出来）
  const fill = new THREE.PointLight(0xffd8b0, 1.1, 4.5, 2);
  fill.position.set(-0.4, 1.9, 1.4);
  group.add(fill);
  lights.fill = fill;

  // 桌面顶光：把赫萝的脸和桌上的东西从暖色阴影里拎出来
  const face = new THREE.PointLight(0xffe4c0, 1.6, 3.6, 2);
  face.position.set(0, 1.52, 0.62);
  group.add(face);
  lights.face = face;

  return {
    group, lights, flames, shelf,
    bounds: { W, ZB, ZF, H },
  };
}

/* ────────────────── 置物架 ────────────────── */

export const SHELF_SLOTS = [
  // 上两层：狼与香辛料里的东西
  { id: 'trenni', dz: -0.46, y: 2.145 },
  { id: 'pyrite', dz: 0.0, y: 2.145 },
  { id: 'pelt', dz: 0.46, y: 2.145 },

  { id: 'gold', dz: -0.46, y: 1.745 },
  { id: 'scales', dz: 0.0, y: 1.745 },
  { id: 'mc_obsidian', dz: 0.46, y: 1.745 },

  // 下两层：别处听来的东西
  { id: 'terraria_star', dz: -0.46, y: 1.345 },
  { id: 'stardew_starfruit', dz: 0.0, y: 1.345 },
  { id: 'dota_blink', dz: 0.46, y: 1.345 },

  { id: 'sts_orichalcum', dz: -0.23, y: 0.945 },
  { id: 'rice', dz: 0.23, y: 0.945 },
];

export const SHELF_WIDTH = 1.6;

function buildShelf(W, cz) {
  const group = new THREE.Group();
  group.name = 'shelf';

  const mat = new THREE.MeshStandardMaterial({ map: woodTex('#553c24', 41, 2, 2), roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a1c10, roughness: 1 });

  const x0 = W - 0.18;        // 靠墙
  const depth = 0.32;
  const width = SHELF_WIDTH;
  const levels = [0.80, 1.20, 1.60, 2.00];

  // 背板
  const back = new THREE.Mesh(new THREE.PlaneGeometry(width, 2.3), new THREE.MeshStandardMaterial({ map: woodTex('#2b1c0f', 43, 3, 3), color: 0x8a7358, roughness: 1 }));
  back.position.set(x0 - 0.01, 1.46, cz);
  back.rotation.y = -Math.PI / 2;
  group.add(back);

  // 侧板
  for (const dz of [-width / 2, width / 2]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(depth, 1.60, 0.05), mat);
    s.position.set(x0 - depth / 2, 1.46, cz + dz);
    s.castShadow = true;
    group.add(s);
  }

  // 层板
  for (const y of levels) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(depth, 0.045, width), mat);
    p.position.set(x0 - depth / 2, y, cz);
    p.castShadow = true;
    p.receiveShadow = true;
    group.add(p);
    // 层板前方的挡木
    const lip = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.06, width), dark);
    lip.position.set(x0 - depth, y + 0.028, cz);
    group.add(lip);
  }

  // 架子上的静态道具（背景氛围，不可点击），摆在物品区之外的两端
  const jarMat = new THREE.MeshStandardMaterial({ color: 0x6d5334, roughness: 0.7 });
  for (const [y, dz, h] of [[0.802, -0.70, 0.2], [0.802, 0.70, 0.16], [1.602, 0.70, 0.21], [2.002, -0.70, 0.14]]) {
    const j = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.05, h, 14), jarMat);
    j.position.set(x0 - 0.19, y + h / 2, cz + dz);
    j.castShadow = true;
    group.add(j);
  }
  // 小木箱
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.13, 0.2), mat);
  box.position.set(x0 - 0.18, 1.202 + 0.065, cz - 0.70);
  box.castShadow = true;
  group.add(box);

  // 挂在架子上方的小油灯，把可点击物品照亮
  const lamp = new THREE.PointLight(0xffc070, 3.6, 4.0, 2);
  lamp.position.set(x0 - 0.46, 2.02, cz);
  group.add(lamp);
  const lamp2 = new THREE.PointLight(0xffb878, 2.3, 3.4, 2);
  lamp2.position.set(x0 - 0.46, 1.24, cz);
  group.add(lamp2);
  const lamp3 = new THREE.PointLight(0xffd0a0, 1.1, 2.4, 2);
  lamp3.position.set(x0 - 0.46, 0.86, cz);
  group.add(lamp3);

  return { group, x0, depth, cz, W };
}

export { buildShelf };
