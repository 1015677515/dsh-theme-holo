/**
 * tar.gz 解包与路径校验 —— 从 index.js 抽出来的独立模块。
 *
 * 为什么独立成文件而不是留在 index.js 里：
 *   ① 测试能直接 import 真函数，不必用正则从源码里"抠"函数体
 *      （那种做法只要多一层缩进就抓不全，测试会假失败）；
 *   ② 这段逻辑纯计算、无副作用，独立出来更好读；
 *   ③ index.js 已经够长，安装相关的逻辑集中到一个小组件更清楚。
 *
 * 只依赖 node:zlib（标准库），不引第三方包 —— 本插件保持零依赖。
 */

/** 剥掉 tar 字段末尾的 NUL 与其后所有内容 */
const cleanField = (buf) => buf.toString('utf8').replace(/\0[\s\S]*$/, '').trim()

/**
 * 解析 tar（未压缩）。
 *
 * 只认两类条目：
 *   type '0' 或空 → 普通文件（收下）
 *   其余（目录、链接、设备…）→ 跳过
 *
 * 注意 size 字段的处理：tar 里所有字段都以 NUL 结尾，
 * 而 parseInt('00001868424\0', 8) 会在 NUL 处停下、读成 1。
 * 必须先剥 NUL —— 这个坑踩过，表现为「只解出 1 个文件，其余静默丢失」。
 *
 * @param {Buffer} buffer 未压缩的 tar 数据
 * @returns {Array<{name: string, buf: Buffer}>}
 */
export function untar(buffer) {
  const files = []
  let off = 0

  while (off + 512 <= buffer.length) {
    const header = buffer.subarray(off, off + 512)
    // 全零块 = 结束标记
    if (header.every((b) => b === 0)) break

    const name = cleanField(header.subarray(0, 100))
    const sizeStr = cleanField(header.subarray(124, 136))
    const size = sizeStr === '' ? 0 : parseInt(sizeStr, 8)
    const type = header.subarray(156, 157).toString('utf8')
    const prefix = cleanField(header.subarray(345, 500))

    // 长路径拆在 prefix + name 两段
    const full = prefix === '' ? name : prefix + '/' + name

    off += 512
    if (type === '0' || type === '') {
      files.push({ name: full, buf: buffer.subarray(off, off + size) })
    }
    // 数据区按 512 对齐
    off += Math.ceil(size / 512) * 512

    // size 解析异常时（NaN / 负数）防止死循环
    if (!Number.isFinite(size) || size < 0) break
  }

  return files
}

/**
 * 路径安全校验：解出来的条目只允许写进 tavern/ 子树。
 *
 * 防的是 zip-slip —— 包里塞一条 `../../etc/passwd`，
 * 天真的解压会写到插件目录外面去。
 *
 * @param {string} name 包内路径
 * @returns {string|undefined} 规范化后的相对路径，不安全则 undefined
 */
export function safeRel(name) {
  if (typeof name !== 'string' || name.length === 0) return undefined
  // 统一分隔符，去掉前导 ./ 或 /
  const norm = name.replace(/\\/g, '/').replace(/^\.?\//, '')
  if (norm.startsWith('/') || norm.includes('\0')) return undefined

  const parts = norm.split('/')
  if (parts.some((p) => p === '..')) return undefined
  if (!norm.startsWith('tavern/')) return undefined

  return norm
}
