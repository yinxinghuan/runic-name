# Runic Name 技术文档

## 1. 技术栈

- TypeScript、Three.js、SCSS、Webpack 5。
- 原作 `WebglManager`、`SlideProgress`、150×150 分段点云平面和 GLSL shader
  原样作为核心渲染管线。
- Aigram runtime bridge 读取当前 AlterU 用户资料。

## 2. 目录结构

- `src/js/initScene.ts`：身份加载、符文资源选择、场景启动、反馈与结算。
- `src/js/identity.ts`：规范资料接口与平台外 `AlterU` 回退。
- `src/js/glyphs.ts`：用户名到 24 个 Futhark 纹理索引的稳定映射。
- `src/js/Items/`：原作 SlideProgress、点云物件、视差和进度线。
- `src/pages/index.html`：加载、标题、身份、幽灵手指、结算和错误状态。
- `public/0.png`–`23.png`：原作固定符文纹理。
- `upstream/`：原作者、固定 commit、MIT 许可证与改动说明。

## 3. 核心模块

启动时先判断 `?baseline=1`。基线模式加载原作 24 张纹理并隐藏产品 UI；产品
模式通过 `/note/telegram/user/get/info/by/telegram_id` 读取必有的
`user_name`，平台外使用 `AlterU`。`nameToGlyphs()` 处理 `TH`、`NG` 二合字符、
拉丁近似音值及 Unicode 稳定哈希，生成 12–24 张纹理序列。

`Items` 保留原作拖动、滚轮、摩擦和 shader 进出场，并增加键盘、真实推进的
幽灵手指、归一化进度回调。首次真实交互后才创建 AudioContext；每跨符文播放
短三角波。进度超过 98.5% 触发一次结算，回退到 90% 以下后允许再次触发。

Webpack 输出目录为 `dist/`，`publicPath` 为空，所有资源均可在任意子路径运行。

## 4. 扩展点

- 改姓名转写：编辑 `src/js/glyphs.ts`。
- 改触控阻尼、步长或演示：编辑 `src/js/Items/index.ts`。
- 改 shader 点云：编辑 `src/js/Items/Item/shaders/`。
- 改标题、结算或安全区：编辑 `src/pages/index.html` 与
  `src/styles/index.scss`。
- 改平台身份读取：只调整 `src/js/identity.ts` 的业务层，不改写
  `src/shared/runtime/bridge.ts`。
