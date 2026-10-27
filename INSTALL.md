# 安装 dsh-theme-holo

三种方式，按推荐顺序排列。装完都要**重启 DSH**。

---

## 环境要求

| 项 | 要求 | 说明 |
| --- | --- | --- |
| DeepSeek Harness | `>=0.2.0-rc.1 <0.3.0-0` | 用了 `webServer` 路由、`theme.overrideTokens`、`slots` 等接口，低于此版本会静默不生效 |
| Node.js | `>=22` | DSH 自带运行时即满足 |
| 操作系统 | Windows / macOS / Linux | 已在 Windows 11 + DSH 0.2.1-rc.2 实测 |
| 磁盘 | 约 16 MB | 其中素材约 15 MB（`素材/动画/` 六段视频 12.9 MB） |
| 第三方依赖 | 无 | 没有 npm 依赖，不需要 `pnpm install` |

---

## 方式一：应用内安装（推荐）

DSH 的插件管理器接受 Git 地址。打开：

```
设置 → 插件 → 添加插件
```

填入：

```
github:1015677515/dsh-theme-holo
```

点安装，等它下载完，然后**立即启用**，再重启 DSH。

> **【未验证】** 这条 `github:` 路径没有在隔离环境里逐步实测过。如果你的 DSH
> 版本解析失败（提示找不到包、或下载后不显示在列表里），请直接用下面的方式二。

> 从 GitHub 下载时若卡住，可在插件管理器里把**安装源**换成国内镜像；
> 但镜像只替代 npm 注册表，不替代 GitHub 仓库下载，GitHub 直连不通时仍需代理。

---

## 方式二：本地目录 + `link:` 依赖（一定可用）

**第 1 步**，把仓库下载到本地任意目录（下称 `<插件目录>`）。

```cmd
git clone https://github.com/1015677515/dsh-theme-holo.git "A:\你的路径\dsh-theme-holo"
```

**第 2 步**，打开 profile 的 `package.json`：

```
%USERPROFILE%\.dsh\profiles\desktop\package.json
```

加入两处（其余内容保持不动）：

```jsonc
{
  "dependencies": {
    "dsh-theme-holo": "link:A:/你的路径/dsh-theme-holo"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "dsh-theme-holo"
      ]
    }
  }
}
```

> `link:` 后面用**正斜杠**，路径里不要有空格；Windows 盘符写法是 `link:A:/...`。
> Linux / macOS 写成 `link:/home/you/dsh-theme-holo`。

**第 3 步**，在 profile 的 `node_modules` 下建一个目录链接。

Windows（管理员 PowerShell 或 cmd）：

```cmd
mklink /J "%USERPROFILE%\.dsh\profiles\desktop\node_modules\dsh-theme-holo" "<插件目录>"
```

Linux / macOS：

```bash
ln -s "<插件目录>" ~/.dsh/profiles/desktop/node_modules/dsh-theme-holo
```

**第 4 步**，重启 DSH。

---

## 方式三：解压压缩包 + `link:` 依赖

不打算用 git 的话：

1. 下载仓库的 ZIP，解压到 `<插件目录>`
2. 照方式二的第 2–4 步做

---

## 装好之后

重启完成、开场动画播完，界面变成羊皮纸色就是生效了。

如果检测到 `dsh-whale-widget` 挂件，会弹一次「要不要把赫萝装进挂件」的对话框。
选择「安装」会把「赫萝」「赫萝Q版」两个角色和一条「愣住」语音写进挂件；
不想装就选「暂不安装」，之后不再弹。详见
[README 的小鲸鱼联动一节](README.md#小鲸鱼挂件联动)。

---

## 自检：确认装对了

打开「设置 → 插件」，应能看到 `dsh-theme-holo`，版本号与
[`package.json`](package.json) 一致，描述是中文。

再进插件详情页，应看到：

- 顶部一张 1920×620 的封面横幅
- 下方「插件设置」区，含开关若干（探头、开场动画、黑夜模式等）

两处都在，说明宿主半与浏览器半都加载成功。

如果只有版本号、没有设置区，通常是 `cordis.patch.yml` 没被读到——
检查 profile 的 `dsh.profile.bundles` 里有没有 `dsh-theme-holo`。

如果出现的是默认蓝色图标而不是赫萝图标，检查 `package.json` 的
`icon` 字段是否指向 `assets/icon.jpg`。

---

## 卸载

删掉方式二里加的两行（`dependencies` 一行、`bundles` 一行），重启即可。

插件所有效果都挂在自己的 fiber 上：样式表、片头层、偷看层、档案卡、浮动字标、
麦田、待机画面、日志标签属性，都会随 fiber 一起移除，不会在页面上留下任何东西。

目录本身和 junction 可以留着（下次启用只需把两行加回来），也可以一并删掉。

**注意**：插件写过的 `localStorage` 键（探头位置、开关状态等）不会自动清除。
要彻底清干净，在浏览器控制台执行：

```js
Object.keys(localStorage)
  .filter(k => k.startsWith('dsh-theme-holo.'))
  .forEach(k => localStorage.removeItem(k))
```

若装过小鲸鱼联动，角色与语音写在 `%USERPROFILE%\.dsh\whale-roles\` 与
`%USERPROFILE%\.dsh\whale-audio\`，需要的话手动删除对应文件。

---

## 常见问题

**桌面版启动就崩，日志里是 `Unexpected token '\uFEFF'`？**

不是本插件的问题。profile 配置清单 `%USERPROFILE%\.dsh\profiles\desktop\package.json`
开头被写入了 UTF-8 BOM，DSH 的引导层用 `JSON.parse` 直接解析它，遇 BOM 即抛错、Host 退出。

**本插件从不写这个文件。** 去掉文件开头 3 个字节（备份后改）、确认文件能被 `JSON.parse`
读通，再重启 DSH 即可。**别用 PowerShell 5.1 的 `Set-Content -Encoding UTF8` /
`Out-File -Encoding UTF8` 改它**——那两种写法必定写 BOM。

完整说明见 [README 常见问题](README.md#常见问题)。

**装完没有任何变化？**

按 F12 打开控制台，看有没有 `[dsh-theme-holo]` 开头的报错。没有报错但也没效果，
多半是 `bundles` 没登记——重启一次通常解决。

**开场动画每次都播，很烦？**

插件设置里点「关闭开场动画」，之后启动直接进界面。设置记在 `localStorage`。

**颜色太淡 / 想换深色？**

插件设置里有「黑夜模式」开关。深色是测试功能，未完全适配，谨慎打开。

**和 `dsh-plugin-wallpaper-engine` 的液体玻璃一起用时动画发虚？**

那是壁纸插件的 `backdrop-filter` 雾化导致的，不是本插件的问题。
关掉壁纸插件的「液体玻璃」即可恢复清晰。

---

[← 返回 README](README.md) · [更新记录](CHANGELOG.md) · [问题反馈](https://github.com/1015677515/dsh-theme-holo/issues)
