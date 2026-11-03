#!/usr/bin/env node
/**
 * 打包酒馆素材，发到素材仓库的 Release。
 *
 * 为什么要有这个脚本：
 *   酒馆素材现在**不随插件下发**（package.json 的 files 已排除 tavern/），
 *   用户装完插件是空的，点「下载酒馆」才从素材仓库拉。
 *   所以每次改了 tavern/ 里的东西，都要重新打包、重发 Release，
 *   否则用户下到的还是旧素材。
 *
 * 用法：
 *   node scripts/pack-tavern.mjs              # 只打包，出 tar.gz
 *   node scripts/pack-tavern.mjs --upload     # 打包 + 上传到 Release
 *
 * 上传需要 GitHub PAT，从 A:/git密钥.txt 读（不进仓库）。
 */

import { createWriteStream, existsSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TAVERN = join(ROOT, 'tavern');
const OUT_DIR = join(ROOT, '..', '_release');
const OUT = join(OUT_DIR, 'tavern-assets.tar.gz');

const OWNER = '1015677515';
const REPO = 'holo-tavern-assets';
const TAG = 'v1.0.0';
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
  buf.write(String(mode).padStart(7, '0'), 100, 'utf8');
  buf.write('0000000', 108);            // uid
  buf.write('0000000', 116);            // gid
  buf.write(String(size).padStart(11, '0'), 124, 'utf8');
  buf.write('00000000000', 136, 'utf8');// mtime 固定为 0，保证重复打包一致
  buf.write('0', 156);                  // 普通文件
  buf.write('ustar\0', 257);
  buf.write('00', 263);
  buf.write('root', 265);
  buf.write('root', 297);
  // checksum
  buf.write('        ', 148);
  let sum = 0;
  for (const b of buf) sum += b;
  buf.write(String(sum).padStart(6, '0') + '\0 ', 148, 'utf8');
  return buf;
}

async function pack() {
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
if (process.argv.includes('--upload')) {
  await upload();
} else {
  console.log('');
  console.log('只打包了。要上传到 Release：');
  console.log('  node scripts/pack-tavern.mjs --upload');
}
