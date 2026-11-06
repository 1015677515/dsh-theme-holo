// Host half of the Holo (Spice and Wolf) theme.
//
// The theme itself is a browser-side capability: one stylesheet plus a handful
// of decorations, all shipped through exports["./client"]. What the host adds
// is the artwork: `./assets` is served over a plugin-owned HTTP route so the
// browser half can reference real files instead of carrying ~1.5 MB of base64
// inside the bundle.
//
// Routes: GET/HEAD /holo-theme/{assets,link,anime}/<file>
//   - prefix routes, registered before any fallback the Web composition owns
//   - strong ETag + Last-Modified, byte ranges (video/audio seeking), HEAD
//   - path traversal is rejected after normalisation, never merely stripped
//   - every route is an exact-file WHITELIST, not "whatever is on disk": the
//     staged folders also hold un-cleaned originals and design drafts, and this
//     package is published, so a directory listing must never be reachable

import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { dirname, extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/* tar.gz 解包与路径校验。抽成独立模块是为了让测试能 import 真函数，
 * 而不是用正则从本文件里"抠"函数体（那种做法一改缩进就假失败）。 */
import { untar, safeRel } from './tavern-kit/tar.mjs'

/** Stable Cordis plugin name. */
export const name = 'themeHolo'

/**
 * Hard dependency on the HTTP carrier: a `ctx.get('webServer')` at mount time is
 * racy (rows mount concurrently), and a missed registration would let the SPA
 * fallback answer every asset request with index.html.
 */
export const inject = ['webServer']

/** Public route prefix the browser half hard-codes (`client.js: ASSET_BASE`). */
const BASE = '/holo-theme/assets'

/**
 * Second prefix, for the whale-widget integration payload: the two role images
 * and the voice line. They live in `./素材`, the folder the user stages them in,
 * and are served from there rather than copied into `./assets` — one copy on
 * disk, and the browser half can still `fetch()` real bytes.
 */
const LINK_BASE = '/holo-theme/link'

/**
 * Third prefix, for the standby clips: the six webm files staged in
 * `./素材/动画`. Same reasoning as the link payload -- they are staged there by
 * the user and served in place, so swapping one on disk re-skins the plate
 * without touching `./assets` or the bundle.
 */
const ANIME_BASE = '/holo-theme/anime'

/** Directory the artwork lives in, next to this file. */
const ASSET_DIR = join(dirname(fileURLToPath(import.meta.url)), 'assets')

/** Directory the whale-widget integration payload lives in, next to this file. */
const LINK_DIR = join(dirname(fileURLToPath(import.meta.url)), '素材')

/** Directory the standby clips live in, next to this file. */
const ANIME_DIR = join(dirname(fileURLToPath(import.meta.url)), '素材', '动画')

/**
 * Exact relative paths each route is allowed to serve.
 *
 * These folders are staging areas: `素材/` in particular also holds the
 * un-cleaned originals (`holo.png`, `holo-Q.png`), the wordmark source, the
 * cover drafts, and two folders of lettering. None of that is referenced by the
 * browser half, and none of it should be reachable from a page. A whitelist also
 * keeps a stray file dropped into a staging folder from silently becoming
 * public. Keys are forward-slash relative paths, matched exactly.
 */
/**
 * Fourth prefix, for the tavern: the standalone 3D scene under `./tavern`.
 *
 * Unlike the three routes above, this one is NOT an exact-file whitelist. The
 * scene ships a directory tree (lesson/js, lesson/css, vendor, assets/items)
 * and the list would be 25+ entries that change whenever the scene does. So it
 * is scoped by DIRECTORY instead: only paths under `tavern/lesson`,
 * `tavern/vendor` and `tavern/assets` are served, and `resolveIn` still rejects
 * anything that normalises outside `tavern/` (traversal, absolute paths).
 *
 * `tavern/_png_backup` is deliberately not under any served prefix, and the
 * extra `TAVERN_DENY` check keeps a stray copy of it unreachable even if
 * someone moves it into `assets/`.
 */
const TAVERN_BASE = '/holo-tavern'

/**
 * 内部端点：返回宿主的真实 HTTP 根地址（webApp.getAdvertisedUrl()）。
 *
 * 单独一条前缀，不放在 TAVERN_BASE 下 —— /holo-tavern/* 整段由静态路由
 * 接管，它的目录白名单会把这个端点判成 404。
 */
const BASE_URL_PATH = '/holo-base-url'

/** Directory the tavern lives in, next to this file. */
const TAVERN_DIR = join(dirname(fileURLToPath(import.meta.url)), 'tavern')

/** Served subtrees under TAVERN_DIR. Anything else 404s. */
const TAVERN_ALLOW_DIRS = ['lesson/', 'vendor/', 'assets/']

/**
 * 酒馆分两半：
 *   · 代码与第三方库（lesson/js、lesson/css、lesson/index.html、vendor/）
 *     随插件发布，装完就有，约 1.53 MB。
 *   · 素材（lesson/assets/、assets/holo.glb）不随插件发布，约 5.38 MB，
 *     用户点「下载酒馆」时从素材仓库拉。
 *
 * 所以「能不能进酒馆」不能只看目录在不在 —— 目录一直都在。
 * 判定靠下面两组期望文件：它们全部存在才算完整。
 */
const TAVERN_CODE_FILES = [
  'lesson/index.html',
  'lesson/js/main.js',
  'lesson/js/story.js',
  'lesson/css/style.css',
  'vendor/three.module.js',
]

/** 素材抽样：每个素材子目录各挑一个，覆盖 holo.glb、配音、舞台、收藏品、2D 立绘。
 *  这不是逐文件校验（那需要 manifest），而是「下载过没有」的判定依据。 */
const TAVERN_MEDIA_FILES = [
  'assets/holo.glb',
  'lesson/assets/voice/index.json',
  'lesson/assets/stage/bg.webp',
  'lesson/assets/items/final/gold.webp',
  'lesson/assets/holo2d/holo2d.json',
]

/** Never served, even inside an allowed subtree (compression backups). */
const TAVERN_DENY = ['_png_backup/', 'final_png_backup']

/** Is this relative path servable from the tavern route? */
function tavernAllowed(rel) {
  if (rel === '' || rel.includes('\0')) return false
  if (!TAVERN_ALLOW_DIRS.some((prefix) => rel.startsWith(prefix))) return false
  if (TAVERN_DENY.some((bad) => rel.includes(bad))) return false
  // No dotfiles, no source maps, no editor droppings.
  const parts = rel.split('/')
  if (parts.some((p) => p.startsWith('.') || p === '' || p === '..')) return false
  return true
}

const ALLOW = new Map([
  [BASE, new Set([
    'avatar.jpg',
    'cover.webp',
    'icon.jpg',
    'intro.jpg',
    'intro.mp3',
    'logo.png',
    'peek-voice.wav',
    'peek.png',
    'planner-ring.png',
    'planner.png',
    'voice-H013.wav',
    'voice-H015.wav',
    'voice-H053.wav',
    'voice-H112.wav',
    'voice-H182.wav',
    'voice-H193.wav',
    'voice-H203.wav',
    'wheat.png',
  ])],
  [LINK_BASE, new Set([
    'holo-clean.png',
    'holo-Q-clean.png',
    '赫萝语音.WAV',
  ])],
  [ANIME_BASE, new Set([
    '赫萝抱臂.webm',
    '赫萝开心.webm',
    '缪莉开心1.webm',
    '缪莉开心2.webm',
    '赫萝叉腰.webm',
    '缪莉挥手.webm',
  ])],
])

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

/**
 * Resolve one request path to a file inside `baseDir`.
 * @returns absolute path, or `undefined` when the request escapes the directory.
 */
function resolveIn(baseDir, basePath, urlPath) {
  let rel
  try {
    rel = decodeURIComponent(urlPath.slice(basePath.length))
  } catch {
    return undefined // malformed percent-encoding
  }
  rel = rel.replace(/^\/+/, '')
  if (rel === '' || rel.includes('\0')) return undefined
  const abs = normalize(join(baseDir, rel))
  return abs === baseDir || abs.startsWith(baseDir + sep) ? abs : undefined
}

/** Parse a single-range `Range: bytes=a-b` header against a known size. */
function parseRange(header, size) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  if (!m) return undefined
  const [, rawStart, rawEnd] = m
  if (rawStart === '' && rawEnd === '') return undefined
  let start
  let end
  if (rawStart === '') {
    // suffix form: last N bytes
    const n = Number(rawEnd)
    if (!Number.isFinite(n) || n <= 0) return undefined
    start = Math.max(0, size - n)
    end = size - 1
  } else {
    start = Number(rawStart)
    end = rawEnd === '' ? size - 1 : Number(rawEnd)
  }
  if (!Number.isFinite(start) || !Number.isFinite(end)) return undefined
  if (start > end || start >= size) return { unsatisfiable: true }
  return { start, end: Math.min(end, size - 1) }
}

/** Send `file` with caching and range semantics. */
async function serveFile(req, res, file) {
  let info
  try {
    info = await stat(file)
  } catch {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('not found')
    return
  }
  if (!info.isFile()) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('not found')
    return
  }

  const etag = `W/"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`
  const headers = {
    'Content-Type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    ETag: etag,
    'Last-Modified': info.mtime.toUTCString(),
    'Accept-Ranges': 'bytes',
  }

  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { ETag: etag, 'Cache-Control': headers['Cache-Control'] })
    res.end()
    return
  }

  const range = req.headers.range === undefined ? undefined : parseRange(req.headers.range, info.size)
  if (range !== undefined && range.unsatisfiable === true) {
    res.writeHead(416, { ...headers, 'Content-Range': `bytes */${info.size}` })
    res.end()
    return
  }

  if (range !== undefined) {
    const { start, end } = range
    res.writeHead(206, {
      ...headers,
      'Content-Range': `bytes ${start}-${end}/${info.size}`,
      'Content-Length': String(end - start + 1),
    })
    if (req.method === 'HEAD') {
      res.end()
      return
    }
    createReadStream(file, { start, end }).on('error', () => res.destroy()).pipe(res)
    return
  }

  res.writeHead(200, { ...headers, 'Content-Length': String(info.size) })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  createReadStream(file).on('error', () => res.destroy()).pipe(res)
}

/** Host plugin body: claim the artwork routes for as long as this fiber lives. */
export function apply(ctx) {
  const webServer = ctx.webServer
  if (!webServer || typeof webServer.register !== 'function') return () => {}

  /**
   * One read-only file route: GET/HEAD only, traversal-proof, range-aware,
   * and limited to the exact files listed in `ALLOW`.
   */
  const claim = (basePath, baseDir, allowed, label) => webServer.register({
    kind: 'prefix',
    path: basePath,
    handler: (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 405
        res.setHeader('Allow', 'GET, HEAD')
        res.end()
        return
      }
      const urlPath = (req.url ?? '').split('?')[0]
      const file = resolveIn(baseDir, basePath, urlPath)
      if (file === undefined) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('not found')
        return
      }
      // Whitelist on the normalised relative path: sub-folders and staging-only
      // files fall out here even though they exist on disk.
      const rel = file.slice(baseDir.length + 1).split(sep).join('/')
      if (!allowed.has(rel)) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('not found')
        return
      }
      return serveFile(req, res, file)
    },
  })

  ctx.effect(
    () => claim(BASE, ASSET_DIR, ALLOW.get(BASE), 'artwork'),
    'theme-holo: artwork route',
  )
  ctx.effect(
    () => claim(LINK_BASE, LINK_DIR, ALLOW.get(LINK_BASE), 'whale link payload'),
    'theme-holo: whale link route',
  )
  ctx.effect(
    () => claim(ANIME_BASE, ANIME_DIR, ALLOW.get(ANIME_BASE), 'standby clips'),
    'theme-holo: anime route',
  )

  /* 真实 HTTP 地址，供「前往黄昏酒馆」拼绝对 URL。
   *
   * 为什么需要它：桌面版的 window.location.origin 是 `dsh-app://app`，
   * 那是 DSH 自己的协议。Electron 主窗口的 setWindowOpenHandler 只把
   * http:/https: 转交系统浏览器，其余一律 deny —— 所以用 dsh-app:// 的
   * 地址调 window.open 什么都不会发生（这就是点了没反应的原因）。
   *
   * webApp.getAdvertisedUrl() 是宿主提供的真实地址（同一个值也用于
   * DSH_WEB_URL 与启动时的 URL 行）。它不硬依赖：取不到就回空串，前端
   * 会退回 location.origin，不至于让插件启动失败。 */
  const baseUrlRoute = webServer.register({
    kind: 'prefix',
    // 独立前缀，不挂在 TAVERN_BASE 下面：/holo-tavern/* 由下面的静态路由
    // 整段接管，它的白名单会把这个内部端点判成 404。两者互不重叠最省心。
    path: BASE_URL_PATH,
    handler: (req, res) => {
      let url = ''
      try {
        const webApp = typeof ctx.get === 'function' ? ctx.get('webApp') : null
        if (webApp && typeof webApp.getAdvertisedUrl === 'function') {
          url = String(webApp.getAdvertisedUrl() || '')
        }
      } catch (error) {
        url = ''
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify({ url }))
    },
  })
  ctx.effect(() => baseUrlRoute, 'theme-holo: tavern base url route')

  /* The tavern: a directory-scoped static route rather than a file whitelist
     (see TAVERN_ALLOW_DIRS). It has to answer the bare directory too, because a
     browser opening /holo-tavern/ should land on the scene instead of a 404. */
  const tavernRoute = webServer.register({
    kind: 'prefix',
    path: TAVERN_BASE,
    handler: (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 405
        res.setHeader('Allow', 'GET, HEAD')
        res.end()
        return
      }
      let urlPath = (req.url ?? '').split('?')[0]
      // `/holo-tavern` and `/holo-tavern/` both mean "the scene's entry page".
      let rel = urlPath.slice(TAVERN_BASE.length).replace(/^\/+/, '')
      if (rel === '') rel = 'lesson/index.html'

      const file = resolveIn(TAVERN_DIR, TAVERN_BASE, TAVERN_BASE + '/' + rel)
      if (file === undefined) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('not found')
        return
      }
      const relFromDir = file.slice(TAVERN_DIR.length + 1).split(sep).join('/')
      if (!tavernAllowed(relFromDir)) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('not found')
        return
      }
      return serveFile(req, res, file)
    },
  })
  ctx.effect(() => tavernRoute, 'theme-holo: tavern route')

  /* ───────────────── 酒馆安装端点 ─────────────────
   *
   * POST /holo-tavern-install
   *   从素材仓库的 Release 下载 tar.gz，解压写进 <插件目录>/tavern/。
   *
   * 为什么让 host 下载、而不是浏览器下载：
   *   浏览器拿到的字节存不进插件目录（前端没有文件系统权限）；
   *   host 侧有 node:fs，能直接落地，静态路由也就能立刻服务这些文件。
   *
   * 为什么用 tar.gz 而不是 zip：
   *   Node 标准库有 zlib（gunzip），但没有 zip 解析器。
   *   tar 格式简单、能手工稳妥解析，不必引第三方依赖（本插件零依赖）。
   *
   * 安全：
   *   · 解压时逐条校验路径，禁止 ../ 与绝对路径（防 zip-slip）
   *   · 只往 TAVERN_DIR 里面写
   *   · 拒绝 SymbolicLink / 设备文件等非常规条目
   */
  const INSTALL_PATH = '/holo-tavern-install'
  /* 素材包 v1.1.0（2026-11-06）：素材从插件仓库搬到独立仓库后的第一个版本。
     内容和 v1.0.0 的 62 文件包不同 —— 现在只含素材 43 个文件，
     不含 lesson/js、lesson/css、vendor（那些跟着插件走）。 */
  const ASSET_URL =
    'https://github.com/1015677515/holo-tavern-assets/releases/download/v1.1.0/tavern-assets.tar.gz'

  const installRoute = webServer.register({
    kind: 'prefix',
    path: INSTALL_PATH,
    handler: async (req, res) => {
      const send = (code, obj) => {
        res.statusCode = code
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        res.end(JSON.stringify(obj))
      }

      if (req.method !== 'POST') {
        send(405, { ok: false, error: '只接受 POST' })
        return
      }

      try {
        // 1) 下载
        const r = await fetch(ASSET_URL, { redirect: 'follow' })
        if (!r.ok) {
          send(502, { ok: false, error: '下载失败：HTTP ' + r.status })
          return
        }
        const gz = Buffer.from(await r.arrayBuffer())

        // 2) 解压
        const { gunzipSync } = await import('node:zlib')
        let tar
        try {
          tar = gunzipSync(gz)
        } catch (e) {
          send(500, { ok: false, error: '解压失败：' + e.message })
          return
        }

        const entries = untar(tar)
        if (entries.length === 0) {
          send(500, { ok: false, error: '包内没有文件' })
          return
        }

        // 3) 落盘
        const { mkdir, writeFile } = await import('node:fs/promises')
        let written = 0
        const skipped = []
        for (const { name, buf } of entries) {
          const rel = safeRel(name)
          if (rel === undefined) {
            skipped.push(name)
            continue
          }
          const target = join(TAVERN_DIR, rel.slice('tavern/'.length))
          await mkdir(dirname(target), { recursive: true })
          await writeFile(target, buf)
          written++
        }

        send(200, {
          ok: true,
          written,
          skipped: skipped.length,
          bytes: gz.length,
          dir: TAVERN_DIR,
        })
      } catch (e) {
        send(500, { ok: false, error: String(e && e.message ? e.message : e) })
      }
    },
  })
  ctx.effect(() => installRoute, 'theme-holo: tavern install route')

  /* ───────────────── 酒馆状态端点 ─────────────────
   *
   * GET /holo-tavern-status
   *   回答一个问题：「酒馆能不能进？」
   *
   * 为什么需要它：
   *   搬家后素材不再随插件发布，两个目录（lesson/、vendor/）装完就有，
   *   所以前端无法用「目录存不存在」判断完整度。下载写到一半中断时，
   *   早写入的文件已经在磁盘上，光探一个 holo.glb 会误判为可进，
   *   结果就是白屏或图片全裂。
   *
   * 判定方式：
   *   · code   = TAVERN_CODE_FILES 全部存在（随包发布，理论上恒真）
   *   · media  = TAVERN_MEDIA_FILES 全部存在（要靠下载）
   *   · 两者全真才 ready
   *
   * 刻意不逐文件校验（那需要随包带 manifest 并对 43 个文件做哈希比对）。
   * 抽样足以覆盖「下载过没有」，而且素材子目录任一缺失都会被拓到。
   */
  const STATUS_PATH = '/holo-tavern-status'

  const probeFiles = async (list) => {
    const { stat } = await import('node:fs/promises')
    const missing = []
    for (const rel of list) {
      try {
        const st = await stat(join(TAVERN_DIR, rel))
        if (!st.isFile() || st.size === 0) missing.push(rel)
      } catch (error) {
        missing.push(rel)
      }
    }
    return missing
  }

  const statusRoute = webServer.register({
    kind: 'prefix',
    path: STATUS_PATH,
    handler: async (req, res) => {
      const send = (code, obj) => {
        res.statusCode = code
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        res.end(JSON.stringify(obj))
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 405
        res.setHeader('Allow', 'GET, HEAD')
        res.end()
        return
      }
      try {
        const codeMissing = await probeFiles(TAVERN_CODE_FILES)
        const mediaMissing = await probeFiles(TAVERN_MEDIA_FILES)
        send(200, {
          ok: true,
          code: codeMissing.length === 0,
          media: mediaMissing.length === 0,
          ready: codeMissing.length === 0 && mediaMissing.length === 0,
          codeMissing,
          mediaMissing,
        })
      } catch (e) {
        send(500, { ok: false, error: String(e && e.message ? e.message : e) })
      }
    },
  })
  ctx.effect(() => statusRoute, 'theme-holo: tavern status route')
}
