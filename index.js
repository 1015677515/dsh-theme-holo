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
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
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
}
