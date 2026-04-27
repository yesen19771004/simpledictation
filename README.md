# Dictation — 多语言听写练习

> 🌐 **在线体验：[https://tx.comdosoft.com](https://tx.comdosoft.com)**
>
> 所有数据存储在浏览器本地，**无需注册**，打开即用。

一个纯前端的多语言听写练习平台。目前支持 **英语** 和 **中文**，后续可扩展任意语言。每种语言独立运行，数据互不干扰。

---

## 语言支持

| 语言 | 子目录 | 状态 |
|------|--------|------|
| English (英语) | `en/` | ✅ 已上线 |
| 中文 (Chinese) | `zh/` | ✅ 已上线 |
| 更多语言... | 即将推出 | 🚧 |

---

## 项目结构

```
.
├── index.html              # 语言选择入口页
├── style.css               # 全局样式（含入口页样式）
├── AGENTS.md               # 项目记录（gitignored）
├── .gitignore
├── en/                     # 英语听写
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   ├── preset-lessons.js   # 180 篇 CEFR A1-C2 分级文本
│   └── README.md           # 英语听写专属说明
├── zh/                     # 中文听写
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── preset-lessons.js   # 52 篇 A1-B2 分级文本
├── .git/
└── README.md               # 本文件
```

每种语言独立放在 `{lang}/` 子目录中，使用独立的 `localStorage key` 前缀，数据完全隔离。

---

## 快速开始

### 选择语言

打开根目录 `index.html`，点击语言卡片进入对应的听写应用。

### 英语听写功能

详见 [`en/README.md`](en/README.md)，包含：

- 资料库（180 篇分级文本）
- 逐句听写 + 自动核对
- 错误追踪与专项训练
- 美式 / 英式语音切换
- 数据导出/导入备份

### 中文听写功能

详见 [`zh/README.md`](zh/README.md)，包含：

- 资料库（52 篇分级文本）
- 逐字听写 + 自动核对
- 错误追踪与专项训练
- 中英文界面切换

---

## 添加新语言

1. 复制 `en/` 目录为新语言目录（如 `fr/`、`de/`）
2. 修改 `fr/app.js` 开头的语言前缀常量：

```js
const LANG_PREFIX = 'fr_';
```

3. 替换 `fr/preset-lessons.js` 为对应语言的课程数据
4. 调整 TTS 语音选择逻辑（不同语言的语音引擎不同）
5. 更新 `fr/index.html` 标题和语言标识
6. 在根 `index.html` 的语言选择网格中新增卡片

> 详细指引参见 `AGENTS.md`。

---

## 技术说明

- **纯前端**：无后端依赖，可部署在 GitHub Pages、Netlify 等静态托管平台
- **语音合成**：使用浏览器 `speechSynthesis` API
- **数据存储**：浏览器 `localStorage`，按语言前缀隔离
- **访问统计**：预留 Umami 跟踪脚本（配置方式见 `AGENTS.md`）

---

## 许可

MIT
