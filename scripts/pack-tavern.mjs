#!/usr/bin/env node
/**
 * 打包酒馆素材，发到素材仓库的 Release。
 *
 * 为什么要有这个脚本：
 *   酒馆素材**不随插件下发**，用户装完插件只拿到接口和前端代码，
 *   点「下载酒馆」才从素材仓库拉。所以每次改了素材，都要重新打包、
 *   重发 Release，否则用户下到的还是旧素材。
 *
 * 【2026-11-06 搬家】素材源已从本仓库移到独立仓库 holo-tavern-assets：
 *   插件仓库只留 tavern/lesson/{js,css,index.html,favicon.svg} 和 tavern/vendor，
 *   共 1.53 MB 代码；素材 5.38 MB 住在 holo-tavern-assets 里。
 *   所以 TAVERN 现在指向**同级目录**下的素材工作副本，不是本仓库的 tavern/。
 *
 * 包内路径仍是 `tavern/...`：解包端（index.js 的 safeRel）只认这个前缀，
 * 而安装路由写盘时会剥掉 `tavern/` 再拼到 TAVERN_DIR，两边必须一致。
 *
 * 用法：
 *   node scripts/pack-tavern.mjs                  # 只打包
 *   node scripts/pack-tavern.mjs --upload         # 打包 + 上传
 *   node scripts/pack-tavern.mjs --tag v1.1.0     # 指定 tag（默认见 DEFAULT_TAG）
 *   node scripts/pack-tavern.mjs --src <目录>     # 覆盖素材源目录
 *
 * 上传需要 GitHub PAT，从 A:/git密钥.txt 读（不进仓库）。
 * 目标 Release 必须已存在：本脚本只删同名旧附件再上传，不新建 Release。
 */

import { createWriteStream, existsSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

/** 素材源：默认是插件仓库**旁边**的 holo-tavern-assets 工作副本。
 *  搬家前这里是 join(ROOT, 'tavern')，即插件仓库自己的 tavern/。
 *  用 `--src <目录>` 可以在别处跑。 */
const DEFAULT_SRC = join(ROOT, '..', 'holo-tavern-assets', 'tavern');

const argv = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : fallback;
};

const TAVERN = argOf('--src', DEFAULT_SRC);
const OUT_DIR = join(ROOT, '..', '_release');
const OUT = join(OUT_DIR, 'tavern-assets.tar.gz');

const OWNER = '1015677515';
const REPO = 'holo-tavern-assets';
const DEFAULT_TAG = 'v1.1.0';
const TAG = argOf('--tag', DEFAULT_TAG);
const ASSET_NAME = 'tavern-assets.tar.gz';

/* ─────────── 打包 ─────────── */

/** 递归收集文件 */
async function walk(dir, base = dir, out = []) {
  const { readdir } = await import('node:fs/promises');
  const items = await readdir(dir, { withFileTypes: true });
  for (const it of items) {
    const p = join(dir, it.name);
    if (it.isDirectory()) await walk(p, base, out);
    else if (it.isFile()) out.push({ abs: p, rel: relative(base, p).replace(/\\/g, '/') });
  }
  return out;
}

/** 生成 tar 头（USTAR） */
/** 八进制字段：宽度 width，右侧补 NUL 由调用方的写入位置决定。
 *  tar 规范里 mode/size/checksum/mtime 都是八进制 ASCII，不是十进制。 */
function octal(value, width) {
  const s = value.toString(8);
  return s.padStart(width - 1, '0') + '\0';
}

function tarHeader(name, size, mode = 0o644) {
  const buf = Buffer.alloc(512);
  const nameBuf = Buffer.from(name, 'utf8');
  // 名字分两段：前 100 字节 + prefix 155 字节
  if (nameBuf.length <= 100) {
    nameBuf.copy(buf, 0);
  } else {
    const slash = nameBuf.lastIndexOf(0x2f, 155);
    const prefix = nameBuf.subarray(0, slash).toString('utf8');
    const rest = nameBuf.subarray(slash + 1).toString('utf8');
    Buffer.from(rest).copy(buf, 0);
    Buffer.from(prefix).copy(buf, 345);
  }
  /* tar 的数字字段全部是**八进制**、以 NUL 结尾。
     写成 String(n) 会得到十进制（1868424 -> "1868424"），
     而解析端 parseInt(field, 8) 遇到数字 8 就停，读成 1 ——
     表现为「包解开了但只出 1 个文件、其余静默丢失」。
     必须 toString(8)。下面 size / mode / checksum 三处都踩这个坑。 */
  buf.write(octal(mode, 7), 100, 'utf8');
  buf.write('0000000', 108);            // uid
  buf.write('0000000', 116);            // gid
  buf.write(octal(size, 11), 124, 'utf8');
  buf.write('00000000000', 136, 'utf8');// mtime 固定为 0，保证重复打包一致
  buf.write('0', 156);                  // 普通文件
  buf.write('ustar\0', 257);
  buf.write('00', 263);
  buf.write('root', 265);
  buf.write('root', 297);
  // checksum：先把该字段当空格算出总和，再以八进制写入
  buf.write('        ', 148);
  let sum = 0;
  for (const b of buf) sum += b;
  buf.write(octal(sum, 6) + '\0 ', 148, 'utf8');
  return buf;
}

async function pack() {
  if (!existsSync(TAVERN)) {
    console.error(`✗ 找不到素材源：${TAVERN}`);
    console.error('  素材已搬到独立仓库 holo-tavern-assets，请先 clone 到与插件同级的目录：');
    console.error('    git clone https://github.com/1015677515/holo-tavern-assets.git');
    console.error('  或用 --src <目录> 指定位置。');
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });
  const files = await walk(TAVERN);
  files.sort((a, b) => a.rel.localeCompare(b.rel));

  const chunks = [];
  let total = 0;
  for (const f of files) {
    const data = await readFile(f.abs);
    const name = 'tavern/' + f.rel;
    chunks.push(tarHeader(name, data.length));
    chunks.push(data);
    // 数据区按 512 对齐
    const pad = (512 - (data.length % 512)) % 512;
    if (pad) chunks.push(Buffer.alloc(pad));
    total += data.length;
  }
  chunks.push(Buffer.alloc(1024));       // 结束块

  const tar = Buffer.concat(chunks);
  const gz = zlib.gzipSync(tar, { level: 6 });
  await writeFile(OUT, gz);

  console.log(`素材源   ${TAVERN}`);
  console.log(`文件数   ${files.length}`);
  console.log(`原始     ${(total / 1048576).toFixed(2)} MB`);
  console.log(`打包后   ${(gz.length / 1048576).toFixed(2)} MB`);
  console.log(`输出     ${OUT}`);
  return { files: files.length, total, packed: gz.length };
}

/* ─────────── 上传 ─────────── */

const PAT_FILE = 'A:/git密钥.txt';

async function upload() {
  if (!existsSync(PAT_FILE)) {
    console.error(`✗ 找不到 PAT：${PAT_FILE}`);
    process.exit(1);
  }
  const pat = (await readFile(PAT_FILE, 'utf8')).trim();
  const H = {
    Authorization: 'Bearer ' + pat,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const API = 'https://api.github.com';

  // 找 Release
  let rel = null;
  const r = await fetch(`${API}/repos/${OWNER}/${REPO}/releases/tags/${TAG}`, { headers: H });
  if (r.status === 200) {
    rel = await r.json();
    console.log(`Release ${TAG} 已存在 id=${rel.id}`);
  } else {
    console.error(`✗ 找不到 Release ${TAG}（HTTP ${r.status}）`);
    process.exit(1);
  }

  // 删同名旧附件
  const assetsRes = await fetch(`${API}/repos/${OWNER}/${REPO}/releases/${rel.id}/assets`, { headers: H });
  const assets = assetsRes.ok ? await assetsRes.json() : [];
  for (const a of assets) {
    if (a.name === ASSET_NAME) {
      console.log(`删除旧附件 id=${a.id}`);
      await fetch(`${API}/repos/${OWNER}/${REPO}/releases/assets/${a.id}`, { method: 'DELETE', headers: H });
    }
  }

  // 上传
  const data = await readFile(OUT);
  const url = rel.upload_url.split('{')[0] + '?name=' + ASSET_NAME;
  const up = await fetch(url, {
    method: 'POST',
    headers: { ...H, 'Content-Type': 'application/gzip', 'Content-Length': String(data.length) },
    body: data,
  });
  if (!up.ok) {
    console.error(`✗ 上传失败 HTTP ${up.status}`);
    console.error(await up.text());
    process.exit(1);
  }
  const asset = await up.json();
  console.log('✓ 上传成功');
  console.log(`  大小 ${(asset.size / 1048576).toFixed(2)} MB`);
  console.log(`  地址 ${asset.browser_download_url}`);
}

/* ─────────── 入口 ─────────── */

const stats = await pack();
if (argv.includes('--upload')) {
  await upload();
} else {
  console.log('');
  console.log('只打包了。要上传到 Release：');
  console.log('  node scripts/pack-tavern.mjs --upload');
}
