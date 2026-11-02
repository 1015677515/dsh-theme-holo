/**
 * 物品图标：先加载 assets/items/final 下的图，再合成"金环 + 暗盘"的悬浮贴图。
 *
 * 狼辛的五件（银币 / 愚人金 / 貂皮 / 黄金 / 天秤）用写实静物图，
 * 联动的五件用各游戏官方图标，米饭用卡通插画。
 *
 * 格式分两种（2026-11-02 压缩）：
 *   写实静物 / 游戏图标 -> WebP q90。原 PNG 合计 2050 KB，转完 416 KB，省 79.7%，
 *     512x512 下肉眼无可辨差异（已逐张比对过 coin_trenni）。
 *   像素风（terraria_star / stardew_starfruit / mc_obsidian）-> 保留 PNG。
 *     这三张是最近邻放大的硬边图，PNG 的无损压缩对它们更划算：
 *     转 WebP 反而会变大（mc_obsidian 实测 18.8K -> 22.2K），所以不转。
 */

const TAU = Math.PI * 2;

/** 以 PNG 交付的条目；其余一律 WebP。键与 ITEM_IMG 的值同名。 */
const PNG_ITEMS = new Set(['terraria_star', 'stardew_starfruit', 'mc_obsidian']);

/** id → 文件名（都放在 assets/items/final/） */
export const ITEM_IMG = {
  trenni: 'coin_trenni',
  pyrite: 'pyrite',
  pelt: 'pelt',
  gold: 'gold',
  scales: 'scales',
  mc_obsidian: 'mc_obsidian',
  terraria_star: 'terraria_star',
  stardew_starfruit: 'stardew_starfruit',
  dota_blink: 'dota_blink',
  sts_orichalcum: 'sts_orichalcum',
  rice: 'rice',
};

/** 像素风图标放大时不要插值 */
const PIXEL = new Set(['terraria_star', 'stardew_starfruit']);

const images = new Map();

export function preloadItemImages() {
  const jobs = Object.entries(ITEM_IMG).map(
    ([id, file]) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          images.set(id, img);
          resolve(true);
        };
        img.onerror = () => {
          console.warn('[icons] 载入失败', id, file);
          resolve(false);
        };
        const ext = PNG_ITEMS.has(file) ? 'png' : 'webp';
        img.src = `assets/items/final/${file}.${ext}`;
      })
  );
  return Promise.all(jobs);
}

function imgOf(id) {
  return images.get(id) || null;
}

/**
 * 圆形徽章：外发光 + 暗底圆盘 + 圆形裁切的物品图 + 暗角 + 金环
 * @param {string} id    物品 id
 * @param {number} S     画布边长
 * @param {string} tint  环的色
 */
export function haloCanvas(id, S = 320, tint = '#f0c97a') {
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  g.translate(S / 2, S / 2);
  const k = S / 256;
  g.scale(k, k);

  // 外发光
  const halo = g.createRadialGradient(0, 0, 30, 0, 0, 128);
  halo.addColorStop(0, 'rgba(255,240,200,0.62)');
  halo.addColorStop(0.52, 'rgba(240,201,122,0.26)');
  halo.addColorStop(1, 'rgba(240,201,122,0)');
  g.beginPath();
  g.arc(0, 0, 127, 0, TAU);
  g.fillStyle = halo;
  g.fill();

  // 底盘（偏暖的羊皮纸色，别用近黑——缩到 100px 就成黑洞了）
  g.beginPath();
  g.arc(0, 0, 105, 0, TAU);
  const core = g.createRadialGradient(0, -46, 10, 0, 10, 116);
  core.addColorStop(0, 'rgba(168,138,96,0.98)');
  core.addColorStop(0.62, 'rgba(110,84,52,0.98)');
  core.addColorStop(1, 'rgba(58,40,22,0.99)');
  g.fillStyle = core;
  g.fill();

  // 物品图（裁圆 + 暗角）
  const img = imgOf(id);
  const R = 92;
  if (img) {
    g.save();
    g.beginPath();
    g.arc(0, 0, R, 0, TAU);
    g.clip();
    g.imageSmoothingEnabled = !PIXEL.has(id);
    // 等比填满
    const s = Math.max((R * 2) / img.width, (R * 2) / img.height) * 0.94;
    const w = img.width * s;
    const h = img.height * s;
    g.drawImage(img, -w / 2, -h / 2, w, h);
    // 暗角，把方图边缘融进圆盘（别压太狠，否则内容全黑）
    const vg = g.createRadialGradient(0, 0, R * 0.66, 0, 0, R);
    vg.addColorStop(0, 'rgba(22,14,6,0)');
    vg.addColorStop(1, 'rgba(22,14,6,0.78)');
    g.fillStyle = vg;
    g.fillRect(-R, -R, R * 2, R * 2);
    g.restore();
  } else {
    // 图没加载出来时的占位
    g.beginPath();
    g.arc(0, 0, R, 0, TAU);
    g.fillStyle = 'rgba(120,96,58,.4)';
    g.fill();
  }

  // 环
  g.beginPath();
  g.arc(0, 0, 105, 0, TAU);
  g.strokeStyle = tint;
  g.lineWidth = 5;
  g.stroke();
  g.beginPath();
  g.arc(0, 0, 95, 0, TAU);
  g.strokeStyle = 'rgba(255,232,178,0.42)';
  g.lineWidth = 1.6;
  g.stroke();

  return c;
}

/** 只有物品本身（透明底），用于界面里的小图标 */
export function iconCanvas(id, S = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const img = imgOf(id);
  if (img) {
    g.imageSmoothingEnabled = !PIXEL.has(id);
    const s = Math.min(S / img.width, S / img.height) * 0.94;
    const w = img.width * s;
    const h = img.height * s;
    g.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
  }
  return c;
}
