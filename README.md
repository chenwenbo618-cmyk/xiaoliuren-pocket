# 小六爻 · 掌上起课

一个手机端优先的纯前端 H5 起课工具。用户输入所问之事，选择公历日期时间，系统按北京时间读取该时间，自动换算农历月、日、时辰，并按小六壬「月日时起课法」排出月宫、日宫、时宫与最终六宫结果。

本项目是静态前端项目：构建后的 `dist/` 可以直接部署到 Cloudflare Pages 或 Vercel，不依赖本地电脑、不依赖局域网、不需要后台服务器。

本工具仅供传统文化体验与个人参考，不构成决策建议。

## 当前版本

当前版本：`v1.0`

`v1.0` 已完成第一版可用能力：

- H5 手机端可用，PC 端居中展示。
- 支持按北京时间起卦，用户选择的时间一律视为北京时间。
- 支持公历日期时间转换为农历月、日、时辰，并显示闰月信息。
- 支持小六壬六宫罗盘动画，按月、日、时三段流转后显示最终结果。
- 支持传统口诀、传统占语、白话解释和此卦处理方式。
- 支持一键复制完整起卦结果。
- 支持构建为纯前端静态文件并部署到 Cloudflare Pages 或 Vercel。

版本记录详见 [CHANGELOG.md](./CHANGELOG.md)。

## 安装依赖

```bash
npm install
```

## 本地开发

本地开发只用于写代码、调试页面和检查交互效果。

```bash
npm run dev
```

启动后通常会看到：

```text
http://localhost:5173/
```

`localhost` 只代表当前电脑本机。这个地址通常只能在运行开发服务的电脑上访问，不能作为正式公网访问地址。

如果需要用手机在局域网临时测试，手机和电脑必须连接同一个 Wi-Fi，并访问电脑的局域网 IP，例如：

```text
http://192.168.1.23:5173/
```

局域网测试只适合开发调试。手机换到其他网络后，这个地址就无法访问。

## 正式构建

正式上线前必须先构建静态文件：

```bash
npm run build
```

构建完成后会生成：

```text
dist/
```

`dist/` 就是正式部署目录。把 `dist/` 部署到 Cloudflare Pages 或 Vercel 后，会得到一个公网 HTTPS 链接。

公网部署完成后：

- 手机访问公网链接不需要和电脑在同一个 Wi-Fi；
- 不需要本地电脑开机；
- 不需要运行 `npm run dev`；
- 不需要后台服务器；
- 不需要数据库或登录服务。

## Cloudflare Pages 部署

推荐方式是连接 Git 仓库自动部署。

1. 将项目推送到 GitHub、GitLab 或其他 Cloudflare Pages 支持的 Git 仓库。
2. 打开 Cloudflare Dashboard。
3. 进入 `Workers & Pages`。
4. 选择 `Create application`。
5. 选择 `Pages`。
6. 选择 `Connect to Git`，并选择当前项目仓库。
7. 项目框架可选择 `Vue` 或 `Vite`。
8. 构建命令填写：

```bash
npm run build
```

9. 构建输出目录填写：

```text
dist
```

10. 保存并开始部署。
11. 部署完成后，Cloudflare Pages 会提供一个公网 HTTPS 地址，例如：

```text
https://your-project.pages.dev
```

这个地址可以直接发给朋友使用。手机在任何网络下都可以访问，不需要同一 Wi-Fi。

## Vercel 部署

推荐方式同样是连接 Git 仓库自动部署。

1. 将项目推送到 GitHub、GitLab 或 Bitbucket。
2. 打开 Vercel Dashboard。
3. 点击 `Add New Project`。
4. 导入当前项目仓库。
5. Framework Preset 选择 `Vite`。
6. Build Command 填写：

```bash
npm run build
```

7. Output Directory 填写：

```text
dist
```

8. 保存并部署。
9. 部署完成后，Vercel 会提供一个公网 HTTPS 地址，例如：

```text
https://your-project.vercel.app
```

这个地址可以直接发给朋友使用。手机在任何网络下都可以访问，不需要同一 Wi-Fi。

## 后续更新和重新部署

如果项目已经连接 Cloudflare Pages 或 Vercel 的 Git 自动部署，后续更新流程是：

1. 在本地修改代码。
2. 本地运行开发服务检查效果：

```bash
npm run dev
```

3. 构建确认没有问题：

```bash
npm run build
```

4. 提交代码：

```bash
git add .
git commit -m "update app"
git push
```

5. Cloudflare Pages 或 Vercel 会自动检测到新的 Git 提交，并重新执行：

```bash
npm run build
```

6. 部署完成后，原来的公网链接会自动更新到新版本。

如果没有使用 Git 自动部署，也可以手动重新上传最新的 `dist/` 目录。但长期维护更推荐使用 Git 自动部署。

## 起卦算法说明

六宫顺序固定为：

```ts
const PALACES = ['大安', '留连', '速喜', '赤口', '小吉', '空亡'];
```

采用小六壬「月日时起课法」：

1. 大安起月。
2. 月上起日。
3. 日上起时。
4. 使用「包含起点数」算法，即起点本身算 1。

核心移动函数：

```ts
function move(startIndex: number, count: number): number {
  return (startIndex + count - 1) % 6;
}
```

计算方式：

```ts
const monthIndex = move(0, lunarMonth);
const dayIndex = move(monthIndex, lunarDay);
const hourIndex = move(dayIndex, hourNumber);
const finalPalace = PALACES[hourIndex];
```

闰月处理：页面会显示「闰X月」。第一版起数时仍使用农历月数字参与计算，不做额外闰月规则。

时间处理：用户选择的 `datetime-local` 时间一律视为北京时间，不按用户所在地时区换算。

## 后续可扩展方向

- 历史记录：把每次起课结果保存到 localStorage 或后端数据库。
- AI 解读：接入模型接口，根据问题、农历时间、三宫结果生成详细解释。
- 生成结果图：把罗盘、断语和问题生成一张可分享图片。
- 微信小程序版：将核心算法迁移为独立模块，在小程序端复用。
